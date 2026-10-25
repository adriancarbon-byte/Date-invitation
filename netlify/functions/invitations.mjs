import { prepareInvitation } from '../../server/invitations.js';

// Validate locally; Web3Forms requires the final email request from the browser.
export default async function handler(request) {
  return prepareInvitation(request, {
    WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY,
  });
}

export const config = { path: '/api/invitations' };
