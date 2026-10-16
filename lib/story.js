const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_URL = process.env.GROQ_URL || 'https://api.groq.com/openai/v1/chat/completions';
const STEPS = { short: 6, long: 18 }; // ~150 words each => ~5 / ~15 min read

const SYSTEM = `You are the narrator of a choose-your-own-adventure story. Voice: deadpan, dry, sarcastic, in second person ("you"). You gently roast the reader's first-world problems — the stakes are tiny and treated with absurd gravity. Never mock real suffering; the target is the pettiness of the problem and the reader's reaction to it.
Rules:
- Write about 120-150 words per chapter. Continue the story from the reader's last choice.
- Each chapter ends with a NEW first-world problem caused by the previous choice (a "solution" always creates the next annoyance).
- Offer 2 or 3 choices. Each reads as a sensible, innocent action. At least one choice is secretly a self-defeating or melodramatic reaction written to sound innocent. Never label which is which. Choices are max 12 words, no sarcasm in the label itself.
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

export async function story(body) {
  const total = STEPS[body.length];
  const step = Number(body.step);
  if (!total || !Number.isInteger(step) || step < 1 || step > total) throw new Error('bad request');
  const topic = clip(body.topic, 160);
  const track = body.track === 'female' ? 'female' : body.track === 'male' ? 'male' : 'any';
  const history = Array.isArray(body.history) ? body.history.slice(-3) : [];
  const last = step === total;

  let user = `Reader type: ${track}. Story premise (first-world problem): "${topic}".\nChapter ${step} of ${total}.\n`;
  if (step === 1) user += 'Open the story with this problem. ';
  else {
    user += 'Previous chapters (most recent last):\n';
    history.forEach(h => { user += `[Chapter text] ${clip(h.text, 900)}\n[Reader chose] ${clip(h.choice, 200)}\n`; });
    user += 'Continue from the last choice. ';
  }
  user += last
    ? 'This is the FINAL chapter: wrap up with a deadpan ending that lands on one last petty indignity. Return "choices": [].'
    : 'End with a new first-world problem and 2-3 choices.';

  const r = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.9,
      max_tokens: 500,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }],
    }),
  });
  if (!r.ok) throw new Error(`groq ${r.status}: ${clip(await r.text(), 200)}`);
  const data = JSON.parse((await r.json()).choices[0].message.content);
  const text = clip(data.text, 2000);
  let choices = Array.isArray(data.choices) ? data.choices.map(c => clip(c, 200)).filter(Boolean).slice(0, 3) : [];
  if (last) choices = [];
  else if (choices.length < 2) throw new Error('model returned too few choices');
  if (!text) throw new Error('empty text');
  return { text, choices, step, total };
}

