import { config } from '../assets/js/config.js';
import { validatePlan } from '../assets/js/validation.js';

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}});

// An explicit same-origin submission is the only email boundary. No answer logs or storage.
export async function handleInvitation(request, env, providerFetch = fetch, now = new Date()) {
  if (request.method !== 'POST') return json(405, { accepted: false });
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return json(403, { accepted: false });
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json(415, { accepted: false });
  if (Number(request.headers.get('Content-Length')) > 2048) return json(413, { accepted: false });
  let plan;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json(400, { accepted: false });
    const chunks = []; let size = 0;
    for (;;) {
      const {done,value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) { await reader.cancel(); return json(413, { accepted: false }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.length; }
    plan = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return json(400, { accepted: false }); }
  if (!plan || typeof plan !== 'object' || Array.isArray(plan) || !validatePlan(plan, config, now).valid) return json(400, { accepted: false });
  if (!env.WEB3FORMS_ACCESS_KEY) return json(503, { accepted: false });
  const activity = config.activities.find(option => option.id === plan.activityId).label;
  const food = config.dinner.options.filter(option => plan.foodIds.includes(option.id)).map(option => option.label).join(', ') || 'Decide together';
  const [hour,minute] = plan.time.split(':').map(Number);
  const time = `${hour % 12 || 12}:${String(minute).padStart(2,'0')} ${hour >= 12 ? 'PM' : 'AM'}`;
  try {
    const response = await providerFetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: env.WEB3FORMS_ACCESS_KEY, subject: 'She said yes! Your little date plan ♡', from_name: 'Your romantic invitation',
        answer: 'Yes', date: plan.date, time: `${time} · Asia/Manila (UTC+08:00)`, food, activity,
        message: `She said yes!\n\nDate: ${plan.date}\nTime: ${time} · Asia/Manila\nFood: ${food}\nActivity: ${activity}\n\nThese choices were shared using Send our plan on your invitation.`,
      }), signal: AbortSignal.timeout(15000),
    });
    const receipt = await response.json();
    if (!response.ok || receipt.success !== true) return json(502, { accepted: false });
    return json(200, { accepted: true });
  } catch { return json(502, { accepted: false }); }
}
