import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { config } from '../netlify/functions/invitations.mjs';

test('Netlify routes the unchanged email API and guards invalid requests without a provider call',async () => {
  assert.equal(config.path,'/api/invitations');
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {throw new Error('Unexpected provider call');};
  try {
    const wrongMethod=await handler(new Request('https://just-for-christine.example/api/invitations'));
    assert.equal(wrongMethod.status,405);
    const invalid=await handler(new Request('https://just-for-christine.example/api/invitations',{
      method:'POST',headers:{Origin:'https://just-for-christine.example','Content-Type':'application/json'},body:'{}',
    }));
    assert.equal(invalid.status,400);
    assert.deepEqual(await invalid.json(),{accepted:false});
  } finally { globalThis.fetch=originalFetch; }
});

test('Netlify prepares a validated browser payload without a server-side provider request', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.WEB3FORMS_ACCESS_KEY;
  process.env.WEB3FORMS_ACCESS_KEY = '  fixture-public-form-key  ';
  globalThis.fetch = () => { throw new Error('Server-side provider request is forbidden'); };
  const plan = {invitationAnswer:'yes',date:'2026-11-30',time:'18:00',foodIds:[],activityId:'movie-date'};
  const request = () => new Request('https://invitation.example/api/invitations', {
    method:'POST',headers:{Origin:'https://invitation.example','Content-Type':'application/json'},body:JSON.stringify(plan),
  });
  try {
    const response = await handler(request());
    assert.equal(response.status,200);
    assert.equal(response.headers.get('Cache-Control'),'no-store');
    const result = await response.json();
    assert.equal(result.prepared,true);
    assert.equal(result.accepted,undefined);
    assert.equal(result.payload.access_key,'fixture-public-form-key');
    assert.equal(result.payload.date,plan.date);
    assert.equal(result.payload.activity,'Movie Date');
    process.env.WEB3FORMS_ACCESS_KEY = '  ';
    assert.equal((await handler(request())).status,503);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.WEB3FORMS_ACCESS_KEY;
    else process.env.WEB3FORMS_ACCESS_KEY = originalKey;
  }
});
