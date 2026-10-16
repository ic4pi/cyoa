import { story, limited } from '../lib/story.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'GROQ_API_KEY is not set on the server' });
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Slow down. Even sarcasm has a rate limit.' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    res.status(200).json(await story(body));
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'The narrator is unavailable. Tragic.' });
  }
}
