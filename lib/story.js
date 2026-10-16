import { getProblem, pickNext } from './problems.js';

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_URL = process.env.GROQ_URL || 'https://api.groq.com/openai/v1/chat/completions';
const STEPS = { short: 6, long: 18 }; // ~150 words each => ~5 / ~15 min read

const SYSTEM = `You are the narrator of a choose-your-own-adventure story. Voice: deadpan, dry, sarcastic, in second person ("you"). You gently roast the reader's first-world problems — the stakes are tiny and treated with absurd gravity. Never mock real suffering; the target is the pettiness of the problem and the reader's reaction to it.
Rules:
- Write about 120-150 words per chapter, in 2 short paragraphs. Continue from the reader's last choice and dramatize the CURRENT PROBLEM you are given; do not invent a different main problem.
- You will be given a list of NEXT PROBLEMS, one per choice. Write one choice per next problem, in the same order. Each choice must read as a sensible, innocent action (max 12 words, no sarcasm in the label) that plausibly leads to its next problem. Exactly one choice should be a disguised melodramatic or self-defeating reaction; never label which. Do not mention the next problems in the chapter text.
- Never repeat jokes, phrases or sentence openers from earlier chapters.
- Reply ONLY with JSON: {"text": string, "choices": [string, ...]}.`;

export const hits = new Map(); // ip -> timestamps
export function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 600000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 60;
}

function clip(s, n) { return String(s ?? '').slice(0, n); }

async function callModel(user) {
  const r = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.9,
      max_tokens: 600,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }],
    }),
  });
  if (!r.ok) throw new Error(`groq ${r.status}: ${clip(await r.text(), 200)}`);
  return JSON.parse((await r.json()).choices[0].message.content);
}

export async function story(body) {
  const total = STEPS[body.length];
  const step = Number(body.step);
  if (!total || !Number.isInteger(step) || step < 1 || step > total) throw new Error('bad request');
  const track = body.track === 'female' ? 'female' : body.track === 'male' ? 'male' : 'any';
  const history = Array.isArray(body.history) ? body.history.slice(-3) : [];
  const used = (Array.isArray(body.used) ? body.used : []).slice(0, 40).map(Number).filter(Number.isFinite);
  const last = step === total;

  const cur = step === 1 ? null : getProblem(body.problem);
  const curText = step === 1 ? clip(body.topic, 160) : cur?.text;
  if (!curText) throw new Error('bad request');
  const curId = cur?.id ?? null;

  const next = last ? [] : pickNext(track, curId ? [...used, curId] : used, cur?.tag, Math.random() < 0.5 ? 2 : 3);

  let user = `Reader type: ${track}.\nChapter ${step} of ${total}.\nCURRENT PROBLEM: "${curText}"\n`;
  if (step > 1) {
    user += 'Previous chapters (most recent last):\n';
    history.forEach(h => { user += `[Chapter text] ${clip(h.text, 900)}\n[Reader chose] ${clip(h.choice, 200)}\n`; });
    user += 'Continue from the last choice, which led to the CURRENT PROBLEM.\n';
  } else user += 'Open the story with this problem.\n';
  user += last
    ? 'This is the FINAL chapter: resolve the current problem with a deadpan ending that lands on one last petty indignity. Return "choices": [].'
    : 'NEXT PROBLEMS (one per choice, in order):\n' + next.map((p, i) => `${i + 1}. ${p.text}`).join('\n');

  for (let attempt = 0; attempt < 2; attempt++) {
    const data = await callModel(user);
    const text = clip(data.text, 2000);
    const labels = Array.isArray(data.choices) ? data.choices.map(c => clip(typeof c === 'string' ? c : c?.label, 200)).filter(Boolean) : [];
    if (!text) continue;
    if (last) return { text, choices: [], step, total, pid: curId };
    if (labels.length !== next.length) continue;
    return { text, choices: labels.map((label, i) => ({ label, pid: next[i].id })), step, total, pid: curId };
  }
  throw new Error('model returned malformed output twice');
}
