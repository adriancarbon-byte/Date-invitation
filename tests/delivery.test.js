import test from 'node:test';
import assert from 'node:assert/strict';
import { handleInvitation } from '../server/invitations.js';
import { sendPlan } from '../assets/js/submission.js';
const now = new Date('2026-10-25T12:00:00Z');
const plan = {invitationAnswer:'yes',date:'2026-10-30',time:'00:37',foodIds:['sushi','ramen'],activityId:'arcade'};
const request = (data=plan,origin='https://invitation.example') => new Request('https://invitation.example/api/invitations',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});

test('relay validates before any email and never exposes the runtime key',async () => {
 let calls=0;
 const provider=async (url,options) => {calls++;assert.equal(url,'https://api.web3forms.com/submit');const payload=JSON.parse(options.body);assert.equal(payload.access_key,'test-only-secret');assert.equal(payload.time,'12:37 AM · Asia/Manila (UTC+08:00)');assert.equal(payload.food,'Sushi, Ramen');assert.equal(payload.activity,'Arcade');assert.equal(payload.answer,'Yes');return Response.json({success:true});};
 const response=await handleInvitation(request(),{WEB3FORMS_ACCESS_KEY:'test-only-secret'},provider,now);
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{accepted:true});assert.equal(calls,1);
 for (const invalid of [{...plan,date:'2026-12-01'},{...plan,time:'24:00'},{...plan,foodIds:['unknown']},{...plan,invitationAnswer:'no'},{...plan,activityId:'unknown'},null]) assert.equal((await handleInvitation(request(invalid),{WEB3FORMS_ACCESS_KEY:'test-only-secret'},provider,now)).status,400);
 assert.equal((await handleInvitation(request(plan,'https://other.example'),{},provider,now)).status,403);
 assert.equal((await handleInvitation(request(),{},provider,now)).status,503);
 assert.equal((await handleInvitation(request({...plan,padding:'x'.repeat(3000)}),{},provider,now)).status,413);
 assert.equal(calls,1);
});
test('provider errors, malformed receipts and timeouts never confirm success',async () => {
 for(const provider of [async()=>Response.json({success:false}),async()=>Response.json({success:true},{status:403}),async()=>new Response('not JSON'),async()=>{throw new Error('timeout')}]) {
  const response=await handleInvitation(request(),{WEB3FORMS_ACCESS_KEY:'test'},provider,now);
  assert.equal(response.status,502);assert.deepEqual(await response.json(),{accepted:false});
 }
});
test('client transport sends only choices and requires an affirmative server receipt',async () => {
 let body;
 const result=await sendPlan({...plan,unwanted:'ignored'},async(url,options)=>{assert.equal(url,'/api/invitations');body=JSON.parse(options.body);return Response.json({accepted:true});});
 assert.deepEqual(body,plan);assert.deepEqual(result,{accepted:true});
 for(const response of [Response.json({accepted:false}),Response.json({accepted:true},{status:500}),new Response('invalid')]) await assert.rejects(sendPlan(plan,async()=>response));
});

test('deployment and provider failures give safe actionable errors even for HTML responses', async () => {
 for (const [status,code] of [[400,'invalid'],[404,'unavailable'],[405,'unavailable'],[429,'busy'],[502,'rejected'],[503,'unavailable'],[500,'unknown']]) {
  await assert.rejects(sendPlan(plan,async()=>new Response('<html>private platform details</html>',{status})), error => error.code === code && !error.message.includes('private platform'));
 }
});

test('browser submits directly only after preparation and requires provider acceptance', async () => {
 const payload = {access_key:'fixture-public-form-key',message:'Synthetic plan'};
 for (const [status,receipt,accepted] of [[200,{success:true},true],[200,{success:false},false],[403,{success:true},false],[429,{success:false},false],[200,null,false]]) {
  const calls=[];
  const transport=async(url,options)=>{
   calls.push(url);
   if (calls.length===1) return Response.json({prepared:true,payload});
   assert.equal(url,'https://api.web3forms.com/submit');
   assert.deepEqual(JSON.parse(options.body),payload);
   assert.equal(options.credentials,'omit');
   return receipt === null ? new Response('invalid') : Response.json(receipt,{status});
  };
  if (accepted) assert.deepEqual(await sendPlan(plan,transport),{accepted:true});
  else await assert.rejects(sendPlan(plan,transport));
  assert.deepEqual(calls,['/api/invitations','https://api.web3forms.com/submit']);
 }
});

test('failed preparation never submits or falls back to another delivery', async () => {
 let calls=0;
 await assert.rejects(sendPlan(plan,async()=>{calls++;return Response.json({accepted:false},{status:503});}));
 assert.equal(calls,1);
});
