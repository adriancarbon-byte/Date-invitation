// Reviewing a plan is local. Only the explicit Send button calls the server.
export async function previewSubmission() {
  return Object.freeze({ mode: 'mock', sent: false });
}
export async function sendPlan(plan, request = globalThis.fetch, endpoint = '/api/invitations') {
  const response = await request(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invitationAnswer: plan.invitationAnswer, date: plan.date, time: plan.time, foodIds: [...plan.foodIds], activityId: plan.activityId }),
    signal: AbortSignal.timeout(20000),
  });
  let result;
  try { result = await response.json(); } catch { throw new Error('The server could not confirm delivery.'); }
  if (!response.ok || result.accepted !== true) throw new Error('The email service did not accept your plan.');
  return Object.freeze({ accepted: true });
}
