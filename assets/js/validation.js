import { config } from './config.js';

// The only approved calendar dates. Never extend this set when it expires.
export const allowedDates = Object.freeze([
  '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31',
  ...Array.from({ length: 30 }, (_, index) => `2026-11-${String(index + 1).padStart(2, '0')}`),
]);
const dateSet = new Set(allowedDates);
const manilaFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
});

export function manilaDay(now = new Date()) {
  const instant = new Date(now);
  if (!Number.isFinite(instant.getTime())) return '';
  const parts = Object.fromEntries(manilaFormatter.formatToParts(instant).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function isAllowedDate(date, now = new Date()) {
  const today = manilaDay(now);
  return typeof date === 'string' && dateSet.has(date) && today !== '' && date >= today;
}

export function isAllowedTime(time, date, settings = config, now = new Date()) {
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time) || !isAllowedDate(date, now) ||
      (Number(time.slice(0, 2)) > 23 || Number(time.slice(3)) > 59 || (!settings.freeTime && !settings.allowedTimes.some(option => option.value === time)))) return false;
  if (!settings.rejectElapsedSampleTimes) return true;
  // Fixed +08:00 is the actual Manila offset; device timezone never enters this calculation.
  return new Date(`${date}T${time}:00+08:00`).getTime() > new Date(now).getTime();
}

export function validatePlan(state, settings = config, now = new Date()) {
  const errors = {};
  if (!state || typeof state !== 'object' || Array.isArray(state)) return Object.freeze({ valid: false, errors: Object.freeze({ plan: 'Please check your plan.' }) });
  if (state.invitationAnswer !== 'yes') errors.invitation = 'Please choose an invitation response first.';
  if (!isAllowedDate(state.date, now)) errors.date = 'Please choose an available day.';
  if (!isAllowedTime(state.time, state.date, settings, now)) errors.time = 'Please choose a future time.';
  if (!settings.activities.some(option => option.id === state.activityId)) errors.activity = 'Please choose an activity.';
  if (settings.dinner.enabled) {
    if (!Array.isArray(state.foodIds) || state.foodIds.length > settings.dinner.options.length || state.foodIds.some(id => !settings.dinner.options.some(option => option.id === id)) ||
        new Set(state.foodIds).size !== state.foodIds.length || (!settings.dinner.multiple && state.foodIds.length > 1)) {
      errors.food = 'Please choose from the food options.';
    } else if (settings.dinner.required && state.foodIds.length === 0) {
      errors.food = 'Please choose a food option.';
    }
  }
  return Object.freeze({ valid: Object.keys(errors).length === 0, errors: Object.freeze(errors) });
}
