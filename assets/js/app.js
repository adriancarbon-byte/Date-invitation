import { config } from './config.js';
import { createStore } from './state.js';
import { previewSubmission } from './submission.js';

const store = createStore();
const sections = [...document.querySelectorAll('[data-stage]')];
const select = document.querySelector('#preview-preference');
const progress = document.querySelector('#journey-steps');
const main = document.querySelector('#main');
const error = document.querySelector('#preview-error');
let session = crypto.randomUUID();
let lastScreen = store.getState().screen;
let busy = false;

for (const option of config.previewOptions) {
  const element = document.createElement('option');
  element.value = option.id;
  element.textContent = option.label;
  select.append(element);
}

const stepButtons = store.stages.map((stage, index) => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'journey-step';
  button.dataset.step = stage.id;
  button.setAttribute('aria-label', `Step ${index + 1}: ${stage.label}`);
  const number = document.createElement('span');
  number.className = 'step-number';
  number.textContent = String(index + 1).padStart(2, '0');
  const label = document.createElement('span');
  label.className = 'step-name';
  label.textContent = stage.label;
  button.append(number, label);
  item.append(button);
  progress.append(item);
  return button;
});

function writeHistory(replace = false) {
  history[replace ? 'replaceState' : 'pushState'](
    { invitationSession: session, screen: store.getState().screen },
    '', `#${store.getState().screen}`,
  );
}

function render(state) {
  const changedScreen = state.screen !== lastScreen;
  for (const section of sections) section.hidden = section.dataset.stage !== state.screen;
  const index = store.stages.findIndex(stage => stage.id === state.screen);
  const active = store.stages[index];
  document.querySelector('#step-label').textContent = index < 0 ? 'A little pause' :
    `${String(index + 1).padStart(2, '0')} / ${String(store.stages.length).padStart(2, '0')}  —  ${active.label}`;
  stepButtons.forEach((button, stepIndex) => {
    button.disabled = stepIndex > state.furthest;
    button.classList.toggle('is-visited', stepIndex <= state.furthest);
    if (button.dataset.step === state.screen) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  select.value = state.previewPreference;
  const chosen = config.previewOptions.find(option => option.id === state.previewPreference);
  document.querySelector('[data-preview-choice]').textContent = chosen?.label || 'No sample chosen';
  document.title = `${active?.label || 'At your own pace'} · A little invitation`;
  if (changedScreen) {
    error.hidden = true;
    const heading = document.querySelector(`[data-stage="${state.screen}"] h1`);
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    document.querySelector('#stage-announcement').textContent = index < 0 ? 'Invitation paused. Nothing was sent.' :
      `Step ${index + 1} of ${store.stages.length}: ${active.label}. Preview only; nothing is sent.`;
  }
  lastScreen = state.screen;
}

function navigate(action) {
  const previous = store.getState().screen;
  store.dispatch(action);
  if (store.getState().screen !== previous) writeHistory();
}

select.addEventListener('change', () => store.dispatch({ type: 'preference', value: select.value }));
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector(`[data-stage="${store.getState().screen}"] h1`).focus();
});

document.addEventListener('click', async event => {
  const button = event.target.closest('[data-action], [data-step]');
  if (!button || button.disabled || busy) return;
  const owner = button.closest('[data-stage]');
  if (owner && owner.dataset.stage !== store.getState().screen) return;
  event.preventDefault();
  if (button.dataset.step) { navigate({ type: 'restore', screen: button.dataset.step }); return; }
  switch (button.dataset.action) {
    case 'next': navigate({ type: 'next' }); break;
    case 'home': navigate({ type: 'restore', screen: 'invitation' }); break;
    case 'decline': navigate({ type: 'decline' }); break;
    case 'back': history.back(); break;
    case 'restart':
      session = crypto.randomUUID();
      store.dispatch({ type: 'reset' });
      writeHistory(true);
      break;
    case 'preview': {
      busy = true;
      button.disabled = true;
      main.setAttribute('aria-busy', 'true');
      const startedSession = session;
      try {
        const result = await previewSubmission();
        if (session === startedSession) navigate({ type: 'previewComplete', result });
      } catch {
        error.textContent = 'The preview could not open. Nothing was sent. Please try again.';
        error.hidden = false;
      } finally {
        busy = false;
        button.disabled = false;
        main.removeAttribute('aria-busy');
      }
      break;
    }
  }
});

window.addEventListener('popstate', event => {
  if (event.state?.invitationSession === session) {
    store.dispatch({ type: 'restore', screen: event.state.screen });
  } else {
    // Refresh and reset begin a new session. Old history cannot resurrect drafts.
    store.dispatch({ type: 'reset' });
  }
  writeHistory(true);
});

store.subscribe(render);
writeHistory(true);
render(store.getState());
document.querySelector('#script-fallback').hidden = true;
