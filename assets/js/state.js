import { config, enabledStages } from './config.js';

export function createStore(settings = config) {
  const stages = Object.freeze(enabledStages(settings));
  const listeners = new Set();
  const initial = () => ({
    screen: stages[0].id,
    furthest: 0,
    previewPreference: '',
    invitationAnswer: null,
    dinnerId: null,
    activityId: null,
    date: null,
    time: null,
    notes: '',
    submission: { mode: 'mock', status: 'idle', sent: false },
    audioEnabled: false,
  });
  let state = initial();
  const snapshot = () => Object.freeze({ ...state, submission: Object.freeze({ ...state.submission }) });

  function dispatch(action) {
    const index = stages.findIndex(stage => stage.id === state.screen);
    let next = state;
    switch (action.type) {
      case 'next': {
        const target = stages[index + 1];
        if (index >= 0 && target && target.id !== 'ending') {
          next = { ...state, screen: target.id, furthest: Math.max(state.furthest, index + 1) };
        }
        break;
      }
      case 'restore': {
        const targetIndex = stages.findIndex(stage => stage.id === action.screen);
        if (targetIndex >= 0 && targetIndex <= state.furthest &&
            (action.screen !== 'ending' || state.submission.status === 'previewed')) {
          next = { ...state, screen: action.screen };
        } else if (action.screen === 'declined') {
          next = { ...state, screen: 'declined' };
        }
        break;
      }
      case 'preference':
        if (action.value === '' || settings.previewOptions.some(option => option.id === action.value)) {
          next = { ...state, previewPreference: action.value };
        }
        break;
      case 'decline':
        next = { ...state, screen: 'declined' };
        break;
      case 'previewComplete':
        if (state.screen === 'scheduler' && action.result?.mode === 'mock' && action.result.sent === false) {
          next = {
            ...state, screen: 'ending', furthest: stages.length - 1,
            submission: { mode: 'mock', status: 'previewed', sent: false },
          };
        }
        break;
      case 'reset':
        next = initial();
        break;
    }
    if (next !== state) {
      state = next;
      listeners.forEach(listener => listener(snapshot()));
    }
    return snapshot();
  }

  return Object.freeze({
    getState: snapshot,
    dispatch,
    stages,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  });
}
