import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareInvitation } from '../server/invitations.js';
const now=new Date('2026-10-25T12:00:00Z');
const plan={invitationAnswer:'yes',date:'2026-10-30',time:'18:00',foodIds:[],activityId:'arcade'};
const origin='https://invitation.example';
const req=(body=JSON.stringify(plan),headers={})=>new Request(`${origin}/api/invitations`,{
 method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...headers},body,
});
const env={WEB3FORMS_ACCESS_KEY:'fixture-public-form-key'};

test('API rejects cross-origin, non-JSON, arbitrary fields and injection payloads safely',async()=>{
 for(const [request,status] of [
  [req(undefined,{Origin:'https://other.example'}),403],
  [req(undefined,{Origin:'null'}),403],
  [req(undefined,{'Sec-Fetch-Site':'cross-site'}),403],
  [req(undefined,{'Content-Type':'application/json-invalid'}),415],
  [req(undefined,{'Content-Type':'text/plain'}),415],
  [req('{'),400],
  [req(JSON.stringify({...plan,redirect:'https://other.example'})),400],
  [req(JSON.stringify({...plan,foodIds:['<img src=x onerror=alert(1)>']})),400],
  [req(JSON.stringify({...plan,activityId:{id:'arcade'}})),400],
 ]) {
  const response=await prepareInvitation(request,env,now);
  assert.equal(response.status,status);
  assert.deepEqual(await response.json(),{accepted:false});
  assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
 }
 const accepted=await prepareInvitation(req(undefined,{'Content-Type':'Application/JSON; charset=UTF-8'}),env,now);
 assert.equal(accepted.status,200);
});

test('size limits apply even when Content-Length is absent or misleading',async()=>{
 for(const request of [req('x'.repeat(2049)),req('x'.repeat(2049),{'Content-Length':'1'}),req('{}',{'Content-Length':'3000'})]) {
  assert.equal((await prepareInvitation(request,env,now)).status,413);
 }
});

test('stalled request bodies time out and are cancelled instead of holding the function open',async()=>{
 let cancelled=false;
 const body=new ReadableStream({cancel(){cancelled=true;}});
 const request=new Request(`${origin}/api/invitations`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body,duplex:'half'});
 const response=await prepareInvitation(request,env,now,15);
 assert.equal(response.status,408);
 assert.equal(cancelled,true);
});

test('missing runtime configuration and expired schedules fail closed',async()=>{
 assert.equal((await prepareInvitation(req(),undefined,now)).status,503);
 assert.equal((await prepareInvitation(req(),env,new Date('2026-12-01T00:00:00Z'))).status,400);
 const response=await prepareInvitation(new Request(`${origin}/api/invitations`),env,now);
 assert.equal(response.status,405);
 assert.equal(response.headers.get('Allow'),'POST');
});
