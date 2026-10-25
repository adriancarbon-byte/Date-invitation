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
