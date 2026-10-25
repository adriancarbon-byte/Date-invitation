import { handleInvitation } from '../../server/invitations.js';

// The existing validated relay runs privately in Netlify's Node function runtime.
export default async function handler(request) {
  return handleInvitation(request, {
    WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY,
  });
}

export const config = { path: '/api/invitations' };
