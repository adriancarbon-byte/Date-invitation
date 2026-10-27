const deliveryMessages = Object.freeze({
  unavailable: 'Email sending is not set up on this site yet. Please ask the inviter to finish the email setup. Your choices are still here.',
  rejected: 'The email service could not accept the plan. Please ask the inviter to check the email setup. Your choices are still here.',
  invalid: 'Please edit your plan and check the date and time before sending again. Your choices are still here.',
  busy: 'Too many sending attempts. Please wait an hour before trying again. Your choices are still here.',
  unknown: 'We couldn’t confirm that your plan was sent. Your choices are safe here. Please check your connection before trying again; a retry may send a duplicate.',
});
export function deliveryMessage(code) {
  return deliveryMessages[code] || deliveryMessages.unknown;
}
function deliveryError(code) {
  return Object.assign(new Error(deliveryMessage(code)), { code });
}
// Bound both the fetch and body parsing; AbortSignal.timeout is unavailable on older phones.
export async function requestJson(request, url, options, timeoutMs = 20000) {
  const controller = new AbortController();
  let timer;
  try {
    return await Promise.race([
      (async () => {
        const response = await request(url, { ...options, signal: controller.signal });
        let result;
        try { result = await response.json(); } catch { result = null; }
        return { response, result };
      })(),
      new Promise((resolve, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(deliveryError('unknown')); }, timeoutMs);
      }),
    ]);
  } finally { clearTimeout(timer); }
}
// Reviewing a plan is local. Only the explicit Send button calls the server.
export async function previewSubmission() {
  return Object.freeze({ mode: 'mock', sent: false });
}
export async function sendPlan(plan, request = globalThis.fetch, endpoint = '/api/invitations') {
  const { response, result } = await requestJson(request, endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invitationAnswer: plan.invitationAnswer, date: plan.date, time: plan.time, foodIds: [...plan.foodIds], activityId: plan.activityId }),
  });
  if (!response.ok) {
    const code = ({ 400: 'invalid', 404: 'unavailable', 405: 'unavailable', 429: 'busy', 502: 'rejected', 503: 'unavailable' })[response.status];
    throw deliveryError(code || 'unknown');
  }
  if (!result || typeof result !== 'object' || Array.isArray(result)) throw deliveryError('unknown');
  if (result.prepared === true) {
    if (!result.payload || typeof result.payload.access_key !== 'string' || !result.payload.access_key.trim()) throw deliveryError('unavailable');
    // Use the fixed provider URL, never a URL supplied by a response or visitor.
    const { response: delivery, result: receipt } = await requestJson(request, 'https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(result.payload),
      credentials: 'omit',
    });
    if (!delivery.ok) throw deliveryError(delivery.status === 429 ? 'busy' : 'rejected');
    if (!receipt || typeof receipt.success !== 'boolean') throw deliveryError('unknown');
    if (receipt.success !== true) throw deliveryError('rejected');
  } else if (result.accepted !== true) throw deliveryError('unknown');
  return Object.freeze({ accepted: true });
}
