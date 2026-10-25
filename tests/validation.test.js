import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { config } from '../assets/js/config.js';
import { allowedDates, manilaDay, isAllowedDate, isAllowedTime, validatePlan } from '../assets/js/validation.js';

const before = new Date('2026-10-25T12:00:00Z');
const plan = { invitationAnswer: 'yes', date: '2026-10-28', time: '18:00', activityId: 'arcade', foodIds: [] };

test('exact allowlist contains 32 unique approved dates and excludes October 30/31', () => {
  assert.equal(allowedDates.length, 32);
  assert.equal(new Set(allowedDates).size, 32);
  assert.equal(allowedDates[0], '2026-10-28');
  assert.equal(allowedDates[1], '2026-10-29');
  assert.equal(allowedDates.at(-1), '2026-11-30');
  assert.equal(allowedDates.filter(date => date.startsWith('2026-11-')).length, 30);
  for (const date of allowedDates) assert.equal(isAllowedDate(date, before), true);
  for (const date of ['2026-10-27', '2026-10-30', '2026-10-31', '2026-11-31', '2026-12-01', '2027-11-01', '2026-11-1', '', null]) {
    assert.equal(isAllowedDate(date, before), false, String(date));
  }
});

test('Manila midnight disables yesterday without shifting date strings', () => {
  const lastSecond = new Date('2026-10-28T15:59:59Z');
  const midnight = new Date('2026-10-28T16:00:00Z');
  assert.equal(manilaDay(lastSecond), '2026-10-28');
  assert.equal(manilaDay(midnight), '2026-10-29');
  assert.equal(isAllowedDate('2026-10-28', lastSecond), true);
  assert.equal(isAllowedDate('2026-10-28', midnight), false);
  assert.equal(isAllowedDate('2026-10-29', midnight), true);
  assert.equal(manilaDay(new Date('invalid')), '');
});

test('date set becomes unavailable after November without extending to a new year', () => {
  const after = new Date('2026-11-30T16:00:00Z');
  assert.equal(manilaDay(after), '2026-12-01');
  assert.equal(allowedDates.some(date => isAllowedDate(date, after)), false);
  assert.equal(isAllowedDate('2027-11-01', after), false);
});

test('October gap, last November day, and same-day sample times validate correctly', () => {
  assert.equal(isAllowedTime('18:00', '2026-11-01', config, new Date('2026-10-29T16:00:00Z')), true);
  assert.equal(isAllowedTime('18:00', '2026-10-30', config, before), false);
  assert.equal(isAllowedTime('21:00', '2026-11-30', config, before), true);
  const now = new Date('2026-10-28T10:00:00Z');
  assert.equal(isAllowedTime('17:00', '2026-10-28', config, now), false);
  assert.equal(isAllowedTime('18:00', '2026-10-28', config, now), false);
  assert.equal(isAllowedTime('19:00', '2026-10-28', config, now), true);
  assert.equal(isAllowedTime('17:00', '2026-10-29', config, now), true);
  for (const time of ['18:30', '24:00', '6:00 PM', '', null]) assert.equal(isAllowedTime(time, '2026-10-29', config, before), false);
});

test('same-day elapsed policy and sample slots can be configured centrally', () => {
  const settings = { ...config, rejectElapsedSampleTimes: false, allowedTimes: [{ value: '16:30', label: '4:30 PM' }] };
  const now = new Date('2026-10-28T11:00:00Z');
  assert.equal(isAllowedTime('16:30', '2026-10-28', settings, now), true);
  assert.equal(isAllowedTime('18:00', '2026-10-28', settings, now), false);
});

test('plan validation rejects tampering and handles optional/omitted food correctly', () => {
  assert.equal(validatePlan(plan, config, before).valid, true);
  assert.equal(validatePlan({ ...plan, invitationAnswer: null }, config, before).valid, false);
  assert.equal(validatePlan({ ...plan, date: '2026-10-31' }, config, before).valid, false);
  assert.equal(validatePlan({ ...plan, time: '16:00' }, config, before).valid, false);
  assert.equal(validatePlan({ ...plan, activityId: 'unknown' }, config, before).valid, false);
  for (const foodIds of [['unknown'], ['pizza', 'pizza'], null]) assert.equal(validatePlan({ ...plan, foodIds }, config, before).valid, false);
  assert.equal(validatePlan({ ...plan, foodIds: ['pizza', 'ramen'] }, config, before).valid, true);
  assert.equal(validatePlan(plan, { ...config, dinner: { ...config.dinner, required: true } }, before).valid, false);
  assert.equal(validatePlan({ ...plan, foodIds: ['pizza', 'ramen'] }, { ...config, dinner: { ...config.dinner, multiple: false } }, before).valid, false);
  assert.equal(validatePlan(plan, { ...config, dinner: { ...config.dinner, enabled: false, required: true } }, before).valid, true);
});

test('Manila validation is identical in UTC and America/Los_Angeles device timezones', () => {
  const moduleUrl = new URL('../assets/js/validation.js', import.meta.url).href;
  const script = `import {manilaDay,isAllowedDate,isAllowedTime} from '${moduleUrl}'; const now=new Date('2026-10-28T16:00:00Z'); console.log(JSON.stringify([manilaDay(now),isAllowedDate('2026-10-28',now),isAllowedDate('2026-10-29',now),isAllowedTime('18:00','2026-10-29',undefined,now)]));`;
  for (const timezone of ['UTC', 'America/Los_Angeles', 'Pacific/Honolulu']) {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', env: { ...process.env, TZ: timezone } });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), ['2026-10-29', false, true, true]);
  }
});
