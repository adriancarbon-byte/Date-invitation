import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../assets/js/config.js';
import { createStore } from '../assets/js/state.js';
import { previewSubmission } from '../assets/js/submission.js';

const clock = () => new Date('2026-10-25T12:00:00Z');
const makeStore = settings => { const store = createStore(settings || config, clock); store.dispatch({type:'openLetter'}); return store; };
function schedule(store) {
  store.dispatch({type:'openLetter'});
  store.dispatch({ type: 'accept' });
  store.dispatch({ type: 'next' });
  store.dispatch({ type: 'date', value: '2026-10-28' });
  store.dispatch({ type: 'time', value: '18:00' });
  store.dispatch({ type: 'next' });
}
function activity(store) {
  schedule(store);
  if (store.getState().screen === 'dinner') store.dispatch({ type: 'next' });
  store.dispatch({ type: 'activity', value: 'arcade' });
}

test('affirmative invitation explicitly enters celebration; next cannot answer for the user', () => {
  const store = makeStore();
  store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'invitation');
  assert.equal(store.getState().invitationAnswer, null);
  store.dispatch({ type: 'accept' });
  assert.equal(store.getState().screen, 'celebration');
  assert.equal(store.getState().invitationAnswer, 'yes');
  store.dispatch({ type: 'accept' });
  assert.equal(store.getState().screen, 'celebration');
});

test('missing or tampered date/time cannot advance the scheduler', () => {
  const store = makeStore();
  store.dispatch({ type: 'accept' });
  store.dispatch({ type: 'next' });
  for (const value of ['2026-10-26', '2026-10-27', '2026-11-31', '2027-11-01', '<script>']) {
    store.dispatch({ type: 'date', value });
    assert.equal(store.getState().date, null);
  }
  store.dispatch({ type: 'time', value: '18:00' });
  store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'scheduler');
  store.dispatch({ type: 'date', value: '2026-11-01' });
  store.dispatch({ type: 'time', value: '24:00' });
  assert.equal(store.getState().time, null);
  store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'scheduler');
});

test('multiple food choices and schedule survive forward/backward navigation', () => {
  const store = makeStore();
  schedule(store);
  store.dispatch({ type: 'food', value: 'pizza' });
  store.dispatch({ type: 'food', value: 'ramen' });
  store.dispatch({ type: 'next' });
  store.dispatch({ type: 'activity', value: 'movie-date' });
  store.dispatch({ type: 'restore', screen: 'scheduler' });
  assert.equal(store.getState().date, '2026-10-28');
  assert.equal(store.getState().time, '18:00');
  store.dispatch({ type: 'restore', screen: 'dinner' });
  assert.deepEqual(store.getState().foodIds, ['pizza', 'ramen']);
  store.dispatch({ type: 'food', value: 'pizza' });
  assert.deepEqual(store.getState().foodIds, ['ramen']);
  store.dispatch({ type: 'restore', screen: 'activity' });
  assert.equal(store.getState().activityId, 'movie-date');
});

test('unknown choices, wrong-stage actions and unreached stages are rejected', () => {
  const store = makeStore();
  for (const action of [
    { type: 'food', value: 'pizza' }, { type: 'activity', value: 'arcade' },
    { type: 'date', value: '2026-10-28' }, { type: 'restore', screen: 'ending' },
    { type: 'restore', screen: 'unknown' }, { type: 'restore', screen: 'activity' },
  ]) store.dispatch(action);
  assert.equal(store.getState().screen, 'invitation');
  assert.deepEqual(store.getState().foodIds, []);
  assert.equal(store.getState().activityId, null);
  schedule(store);
  store.dispatch({ type: 'food', value: 'unknown' });
  store.dispatch({ type: 'next' });
  store.dispatch({ type: 'activity', value: 'unknown' });
  assert.deepEqual(store.getState().foodIds, []);
  assert.equal(store.getState().activityId, null);
});

test('dinner can be disabled without breaking stage count or the mock journey', async () => {
  const store = makeStore({ ...config, dinner: { ...config.dinner, enabled: false, required: true } });
  assert.equal(store.stages.length, 6);
  assert.equal(store.stages.some(stage => stage.id === 'dinner'), false);
  activity(store);
  store.dispatch({ type: 'previewComplete', result: await previewSubmission() });
  assert.equal(store.getState().screen, 'ending');
  assert.deepEqual(store.getState().foodIds, []);
});

test('optional dinner can be skipped, and single-selection configuration replaces choices', () => {
  const optional = makeStore();
  schedule(optional);
  optional.dispatch({ type: 'next' });
  assert.equal(optional.getState().screen, 'activity');
  const single = makeStore({ ...config, dinner: { ...config.dinner, multiple: false } });
  schedule(single);
  single.dispatch({ type: 'food', value: 'pizza' });
  single.dispatch({ type: 'food', value: 'sushi' });
  assert.deepEqual(single.getState().foodIds, ['sushi']);
});

test('required dinner configuration guards progression until a food is selected', () => {
  const store = makeStore({ ...config, dinner: { ...config.dinner, required: true } });
  schedule(store);
  store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'dinner');
  store.dispatch({ type: 'food', value: 'tacos' });
  store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'activity');
});

test('optional food can be explicitly cleared in single and multiple selection modes', () => {
  for (const multiple of [true, false]) {
    const store = makeStore({ ...config, dinner: { ...config.dinner, multiple } });
    schedule(store);
    store.dispatch({ type: 'food', value: 'pizza' });
    store.dispatch({ type: 'food', value: 'sushi' });
    assert.equal(store.getState().foodIds.length, multiple ? 2 : 1);
    store.dispatch({ type: 'clear-food' });
    assert.deepEqual(store.getState().foodIds, []);
    store.dispatch({ type: 'next' });
    assert.equal(store.getState().screen, 'activity');
  }
});

test('clear-food rejects required dinner and actions outside the enabled dinner stage', () => {
  const required = makeStore({ ...config, dinner: { ...config.dinner, required: true } });
  schedule(required);
  required.dispatch({ type: 'food', value: 'pizza' });
  required.dispatch({ type: 'clear-food' });
  assert.deepEqual(required.getState().foodIds, ['pizza']);
  const optional = makeStore();
  schedule(optional);
  optional.dispatch({ type: 'food', value: 'ramen' });
  optional.dispatch({ type: 'next' });
  optional.dispatch({ type: 'clear-food' });
  assert.deepEqual(optional.getState().foodIds, ['ramen']);
  const disabled = makeStore({ ...config, dinner: { ...config.dinner, enabled: false } });
  disabled.dispatch({ type: 'clear-food' });
  assert.deepEqual(disabled.getState().foodIds, []);
  assert.equal(disabled.getState().screen, 'invitation');
});

test('all four mandatory activities can be selected and the choice can be corrected', () => {
  const store = makeStore();
  activity(store);
  assert.deepEqual(config.activities.map(option => option.label), ['City Lights', 'Around the City', 'Movie Date', 'Arcade']);
  for (const option of config.activities) {
    store.dispatch({ type: 'activity', value: option.id });
    assert.equal(store.getState().activityId, option.id);
  }
});

test('the ending requires an explicit mock result, activity and a valid current plan', async () => {
  const store = makeStore();
  schedule(store);
  store.dispatch({ type: 'next' });
  store.dispatch({ type: 'previewComplete', result: await previewSubmission() });
  assert.equal(store.getState().screen, 'activity');
  store.dispatch({ type: 'activity', value: 'city-lights' });
  store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'activity');
  store.dispatch({ type: 'previewComplete', result: { mode: 'live', sent: true } });
  assert.equal(store.getState().screen, 'activity');
  store.dispatch({ type: 'previewComplete', result: await previewSubmission() });
  assert.equal(store.getState().screen, 'ending');
  assert.deepEqual(store.getState().submission, { mode: 'mock', status: 'previewed', sent: false });
});

test('expired schedule is revalidated before mock completion and history restoration', async () => {
  let instant = clock();
  const store = createStore(config, () => instant);
  activity(store);
  instant = new Date('2026-10-29T00:00:00Z');
  store.dispatch({ type: 'previewComplete', result: await previewSubmission() });
  assert.equal(store.getState().screen, 'activity');
  store.dispatch({ type: 'restore', screen: 'dinner' });
  assert.equal(store.getState().screen, 'activity');
  store.dispatch({ type: 'restore', screen: 'scheduler' });
  assert.equal(store.getState().screen, 'scheduler');
  store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'scheduler');
});

test('changing a choice invalidates a previous mock ending without losing other answers', async () => {
  const store = makeStore();
  activity(store);
  store.dispatch({ type: 'previewComplete', result: await previewSubmission() });
  store.dispatch({ type: 'restore', screen: 'activity' });
  store.dispatch({ type: 'activity', value: 'movie-date' });
  store.dispatch({ type: 'restore', screen: 'ending' });
  assert.equal(store.getState().screen, 'activity');
  assert.equal(store.getState().time, '18:00');
  assert.equal(store.getState().submission.status, 'idle');
});

test('clearing the date clears time and guards previously reached downstream stages', () => {
  const store = makeStore();
  activity(store);
  store.dispatch({ type: 'restore', screen: 'scheduler' });
  store.dispatch({ type: 'date', value: '' });
  assert.equal(store.getState().date, null);
  assert.equal(store.getState().time, null);
  store.dispatch({ type: 'restore', screen: 'activity' });
  assert.equal(store.getState().screen, 'scheduler');
});

test('elapsed same-day time is cleared when changing to an earlier date', () => {
  const store = createStore(config, () => new Date('2026-10-28T11:00:00Z'));
  store.dispatch({type:'openLetter'});
  store.dispatch({ type: 'accept' });
  store.dispatch({ type: 'next' });
  store.dispatch({ type: 'date', value: '2026-10-29' });
  store.dispatch({ type: 'time', value: '18:00' });
  store.dispatch({ type: 'date', value: '2026-10-28' });
  assert.equal(store.getState().time, null);
});

test('stale source-stage next actions cannot skip a stage', () => {
  const store = makeStore();
  store.dispatch({ type: 'accept' });
  store.dispatch({ type: 'next', from: 'celebration' });
  store.dispatch({ type: 'next', from: 'celebration' });
  assert.equal(store.getState().screen, 'scheduler');
});

test('only explicit acceptance advances the opening; removed decline is ignored', () => {
  const store = makeStore();
  store.dispatch({ type: 'decline' });
  assert.equal(store.getState().screen, 'invitation');
  assert.equal(store.getState().invitationAnswer, null);
  assert.equal(store.getState().submission.sent, false);
  store.dispatch({ type: 'restore', screen: 'invitation' });
  assert.equal(store.getState().screen, 'invitation');
});

test('reset clears draft and prevents restoring its previous ending', async () => {
  const store = makeStore();
  activity(store);
  store.dispatch({ type: 'previewComplete', result: await previewSubmission() });
  store.dispatch({ type: 'reset' });
  store.dispatch({ type: 'restore', screen: 'ending' });
  assert.equal(store.getState().screen, 'letter');
  assert.deepEqual(store.getState().foodIds, []);
  assert.equal(store.getState().activityId, null);
  assert.equal(store.getState().date, null);
  assert.equal(store.getState().submission.status, 'idle');
});

test('state snapshots protect arrays, nested submission and top-level state', () => {
  const store = makeStore();
  assert.throws(() => { store.getState().screen = 'ending'; }, TypeError);
  assert.throws(() => { store.getState().submission.sent = true; }, TypeError);
  assert.throws(() => { store.getState().foodIds.push('pizza'); }, TypeError);
  assert.deepEqual(store.getState().foodIds, []);
});

test('subscriptions stop after unsubscribe', () => {
  const store = makeStore();
  let notifications = 0;
  const unsubscribe = store.subscribe(() => notifications++);
  store.dispatch({ type: 'accept' });
  unsubscribe();
  store.dispatch({ type: 'next' });
  assert.equal(notifications, 1);
});

test('mock boundary does not call the network', async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Network is forbidden in this preview'); };
  try { assert.deepEqual(await previewSubmission(), { mode: 'mock', sent: false }); }
  finally { globalThis.fetch = previousFetch; }
});

test('sealed letter opens before the question and cannot imply acceptance', () => {
  const store = createStore(config,clock);
  assert.equal(store.getState().screen,'letter');
  store.dispatch({type:'accept'});
  store.dispatch({type:'next'});
  store.dispatch({type:'restore',screen:'invitation'});
  assert.equal(store.getState().screen,'letter');
  store.dispatch({type:'openLetter'});
  assert.equal(store.getState().screen,'invitation');
  assert.equal(store.getState().invitationAnswer,null);
  store.dispatch({type:'no'});
  assert.equal(store.getState().screen,'invitation');
  assert.equal(store.getState().invitationAnswer,null);
  store.dispatch({type:'accept'});
  assert.equal(store.getState().screen,'celebration');
});

test('October 30 and 31 are accepted through state and the final mock gate',async () => {
  for (const date of ['2026-10-30','2026-10-31']) {
    const store = makeStore();
    store.dispatch({type:'accept'});
    store.dispatch({type:'next'});
    store.dispatch({type:'date',value:date});
    store.dispatch({type:'time',value:'19:00'});
    store.dispatch({type:'next'});
    store.dispatch({type:'next'});
    store.dispatch({type:'activity',value:'city-lights'});
    store.dispatch({type:'previewComplete',result:await previewSubmission()});
    assert.equal(store.getState().screen,'ending');
    assert.equal(store.getState().date,date);
    assert.equal(store.getState().submission.sent,false);
  }
});

test('email confirmation requires a pending send and an affirmative provider receipt', async () => {
  const store = makeStore(); activity(store);
  store.dispatch({type:'sendStart'});
  assert.equal(store.getState().submission.status,'idle');
  store.dispatch({type:'previewComplete',result:await previewSubmission()});
  store.dispatch({type:'sendSuccess',result:{accepted:true}});
  assert.equal(store.getState().submission.sent,false);
  store.dispatch({type:'sendStart'});
  assert.equal(store.getState().submission.status,'sending');
  store.dispatch({type:'sendSuccess',result:{accepted:false}});
  assert.equal(store.getState().submission.sent,false);
  store.dispatch({type:'sendError'});
  assert.equal(store.getState().submission.status,'error');
  assert.equal(store.getState().date,'2026-10-28');
  store.dispatch({type:'sendStart'});
  store.dispatch({type:'sendSuccess',result:{accepted:true}});
  assert.equal(store.getState().submission.sent,true);
  store.dispatch({type:'sendStart'});
  assert.equal(store.getState().submission.status,'sent');
});
