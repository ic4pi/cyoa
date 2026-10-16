import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import { story, limited } from './lib/story.js';

const root = fileURLToPath(new URL('.', import.meta.url));

// minimal .env loader (no deps)
if (existsSync(join(root, '.env'))) {
  for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[2] && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}

const PORT = process.env.PORT || 3000;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

http.createServer(async (req, res) => {
  const send = (code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
  try {
    if (req.method === 'POST' && req.url === '/api/story') {
      if (!process.env.GROQ_API_KEY) return send(500, { error: 'GROQ_API_KEY is not set on the server' });
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
      if (limited(ip)) return send(429, { error: 'Slow down. Even sarcasm has a rate limit.' });
      let raw = '';
      for await (const c of req) { raw += c; if (raw.length > 20000) return send(413, { error: 'too large' }); }
      return send(200, await story(JSON.parse(raw)));
    }
    if (req.method === 'GET') {
      const p = req.url.split('?')[0];
      const file = normalize(join(root, 'public', p === '/' ? 'index.html' : p));
      if (!file.startsWith(join(root, 'public'))) return send(403, { error: 'no' });
      const buf = await readFile(file).catch(() => null);
      if (!buf) return send(404, { error: 'not found' });
      res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
      return res.end(buf);
    }
    send(404, { error: 'not found' });
  } catch (e) {
    console.error(e.message);
    send(500, { error: 'The narrator is unavailable. Tragic.' });
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
