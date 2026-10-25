import { config, enabledStages } from './config.js';
import { isAllowedDate, isAllowedTime, validatePlan } from './validation.js';

export function createStore(settings = config, now = () => new Date()) {
  const stages = Object.freeze(enabledStages(settings));
  const listeners = new Set();
  const initial = () => ({
    screen: stages[0].id,
    furthest: 0,
    invitationAnswer: null,
    foodIds: [],
    activityId: null,
    date: null,
    time: null,
    submission: { mode: 'mock', status: 'idle', sent: false },
    audioEnabled: false,
  });
  let state = initial();
  const snapshot = () => Object.freeze({
    ...state, foodIds: Object.freeze([...state.foodIds]),
    submission: Object.freeze({ ...state.submission }),
  });
  const scheduleValid = () => isAllowedDate(state.date, now()) && isAllowedTime(state.time, state.date, settings, now());
  const foodValid = () => !settings.dinner.enabled || !settings.dinner.required || state.foodIds.length > 0;
  const canVisit = screen => {
    if (screen === 'invitation') return true;
    if (state.invitationAnswer !== 'yes') return false;
    if (['celebration', 'scheduler'].includes(screen)) return true;
    if (!scheduleValid()) return false;
    if (screen === 'dinner') return settings.dinner.enabled;
    if (screen === 'activity') return foodValid();
    return screen === 'ending' && state.submission.status === 'previewed' && validatePlan(state, settings, now()).valid;
  };
  const enter = screen => ({
    ...state, screen,
    furthest: Math.max(state.furthest, stages.findIndex(stage => stage.id === screen)),
  });
  const changedChoice = updates => ({
    ...state, ...updates, submission: { mode: 'mock', status: 'idle', sent: false },
  });

  function dispatch(action) {
    const index = stages.findIndex(stage => stage.id === state.screen);
    let next = state;
    switch (action.type) {
      case 'accept':
        if (state.screen === 'invitation') next = { ...enter('celebration'), invitationAnswer: 'yes' };
        break;
      case 'next': {
        const target = stages[index + 1];
        if (action.from && action.from !== state.screen) break;
        if (index > 0 && target && target.id !== 'ending' && canVisit(target.id)) next = enter(target.id);
        break;
      }
      case 'restore': {
        const targetIndex = stages.findIndex(stage => stage.id === action.screen);
        if (targetIndex >= 0 && targetIndex <= state.furthest && canVisit(action.screen)) next = { ...state, screen: action.screen };
        else if (action.screen === 'declined') next = { ...state, screen: 'declined' };
        break;
      }
      case 'date':
        if (state.screen === 'scheduler' && (action.value === null || action.value === '' || isAllowedDate(action.value, now()))) {
          const date = action.value || null;
          next = changedChoice({ date, time: isAllowedTime(state.time, date, settings, now()) ? state.time : null });
        }
        break;
      case 'time':
        if (state.screen === 'scheduler' && (action.value === null || action.value === '' || isAllowedTime(action.value, state.date, settings, now()))) {
          next = changedChoice({ time: action.value || null });
        }
        break;
      case 'food':
        if (state.screen === 'dinner' && settings.dinner.enabled && settings.dinner.options.some(option => option.id === action.value)) {
          const foodIds = settings.dinner.multiple ? state.foodIds.includes(action.value) ?
            state.foodIds.filter(id => id !== action.value) : [...state.foodIds, action.value] : [action.value];
          next = changedChoice({ foodIds });
        }
        break;
      case 'clear-food':
        if (state.screen === 'dinner' && settings.dinner.enabled && !settings.dinner.required) {
          next = changedChoice({ foodIds: [] });
        }
        break;
      case 'activity':
        if (state.screen === 'activity' && settings.activities.some(option => option.id === action.value)) next = changedChoice({ activityId: action.value });
        break;
      case 'decline':
        if (state.screen === 'invitation') next = { ...state, screen: 'declined' };
        break;
      case 'previewComplete':
        if (state.screen === 'activity' && action.result?.mode === 'mock' && action.result.sent === false && validatePlan(state, settings, now()).valid) {
          next = { ...enter('ending'), submission: { mode: 'mock', status: 'previewed', sent: false } };
        }
        break;
      case 'reset': next = initial(); break;
    }
    if (next !== state) {
      state = next;
      listeners.forEach(listener => listener(snapshot()));
    }
    return snapshot();
  }

  return Object.freeze({
    getState: snapshot, dispatch, stages,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  });
}
