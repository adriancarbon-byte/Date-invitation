import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../assets/js/config.js';
import { createStore } from '../assets/js/state.js';
import { previewSubmission } from '../assets/js/submission.js';

test('sample preference survives forward and backward navigation without becoming a real dinner answer', () => {
  const store = createStore();
  store.dispatch({ type: 'next' });
  store.dispatch({ type: 'preference', value: 'sample-b' });
  store.dispatch({ type: 'next' });
  store.dispatch({ type: 'restore', screen: 'dinner' });
  assert.equal(store.getState().previewPreference, 'sample-b');
  assert.equal(store.getState().dinnerId, null);
  assert.equal(store.getState().invitationAnswer, null);
});

test('unknown preferences and visits to unreached stages are rejected', () => {
  const store = createStore();
  store.dispatch({ type: 'preference', value: '<script>bad</script>' });
  store.dispatch({ type: 'restore', screen: 'ending' });
  store.dispatch({ type: 'restore', screen: 'unknown' });
  assert.equal(store.getState().screen, 'invitation');
  assert.equal(store.getState().previewPreference, '');
});

test('dinner can be removed from the stage sequence without breaking progression', () => {
  const store = createStore({ ...config, dinner: { enabled: false } });
  assert.equal(store.stages.length, 4);
  store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'activity');
  store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'scheduler');
});

test('the ending requires an explicit mock result and never becomes sent', async () => {
  const store = createStore();
  for (let i = 0; i < 4; i++) store.dispatch({ type: 'next' });
  assert.equal(store.getState().screen, 'scheduler');
  store.dispatch({ type: 'previewComplete', result: { mode: 'live', sent: true } });
  assert.equal(store.getState().screen, 'scheduler');
  store.dispatch({ type: 'previewComplete', result: await previewSubmission() });
  assert.equal(store.getState().screen, 'ending');
  assert.deepEqual(store.getState().submission, { mode: 'mock', status: 'previewed', sent: false });
});

test('decline is an exit without an affirmative answer or submission', () => {
  const store = createStore();
  store.dispatch({ type: 'decline' });
  assert.equal(store.getState().screen, 'declined');
  assert.equal(store.getState().invitationAnswer, null);
  assert.equal(store.getState().submission.sent, false);
  store.dispatch({ type: 'restore', screen: 'invitation' });
  assert.equal(store.getState().screen, 'invitation');
});

test('reset clears the draft and prevents restoring the previous ending', async () => {
  const store = createStore();
  store.dispatch({ type: 'preference', value: 'sample-a' });
  for (let i = 0; i < 3; i++) store.dispatch({ type: 'next' });
  store.dispatch({ type: 'previewComplete', result: await previewSubmission() });
  store.dispatch({ type: 'reset' });
  store.dispatch({ type: 'restore', screen: 'ending' });
  assert.equal(store.getState().screen, 'invitation');
  assert.equal(store.getState().previewPreference, '');
  assert.equal(store.getState().submission.status, 'idle');
});

test('state snapshots do not allow callers to mutate central state', () => {
  const store = createStore();
  assert.throws(() => { store.getState().screen = 'ending'; }, TypeError);
  assert.throws(() => { store.getState().submission.sent = true; }, TypeError);
  assert.equal(store.getState().screen, 'invitation');
});

test('mock boundary does not call the network', async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Network is forbidden in this preview'); };
  try { assert.deepEqual(await previewSubmission(), { mode: 'mock', sent: false }); }
  finally { globalThis.fetch = previousFetch; }
});
