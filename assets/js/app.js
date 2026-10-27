import { config } from './config.js';
import { createStore } from './state.js';
import { allowedDates, isAllowedDate, isAllowedTime, validatePlan } from './validation.js';
import { previewSubmission, sendPlan, deliveryMessage } from './submission.js';

const artPath = name => `./assets/art/${name}.svg`;
const store = createStore();
const $ = selector => document.querySelector(selector);
const sections = [...document.querySelectorAll('[data-stage]')];
const dateTrigger = $('#date-trigger');
const calendar = $('#calendar-panel');
const wheels = {};
let pendingTime = { hour: 6, minute: 0, period: 'PM' };
const timeLabel = value => { if (!value) return ''; const [h,m] = value.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`; };
const chosenTime = () => `${String(pendingTime.hour % 12 + (pendingTime.period === 'PM' ? 12 : 0)).padStart(2,'0')}:${String(pendingTime.minute).padStart(2,'0')}`;
// History identity only, never an authentication token. Works without randomUUID.
const session = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
let lastScreen = store.getState().screen;
let month = 10;
let busy = false;
let navigationUntil = 0;
let historyAvailable = true;
let particleTimer;
let selectionTimer;
let celebrationOrigin = null;
let letterOpening = false;
let letterTimer;
let idleTimer;
let lastIdleReset = 0;
let dodgeCount = 0;
let lastDodgeAt = -Infinity;
let availabilityTimer;
const dateLabel = value => new Intl.DateTimeFormat('en-US', {
  timeZone: config.timezone, month: 'long', day: 'numeric', year: 'numeric',
}).format(new Date(`${value}T12:00:00+08:00`));
const dateFullLabel = value => new Intl.DateTimeFormat('en-US', {
  timeZone: config.timezone, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
}).format(new Date(`${value}T12:00:00+08:00`));
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21S2 15 2 8.5a5.5 5.5 0 0 1 10-3.1A5.5 5.5 0 0 1 22 8.5C22 15 12 21 12 21Z"/></svg>';
const stepButtons = store.stages.map((stage, index) => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'journey-step';
  button.dataset.step = stage.id;
  button.setAttribute('aria-label', `Step ${index + 1} of ${store.stages.length}: ${stage.label}`);
  button.innerHTML = heart;
  item.append(button);
  $('#journey-steps').append(item);
  return button;
});
const descriptions = { 'city-lights': 'A little evening glow', 'around-city': 'Wander a little together', 'movie-date': 'Share the popcorn?', arcade: 'A little friendly rivalry' };
function createChoices(parent, options, type, name) {
  for (const option of options) {
    const label = document.createElement('label');
    label.className = 'choice-card';
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.value = option.id;
    const image = document.createElement('img');
    image.src = artPath(option.art);
    image.width = 150;
    image.height = 120;
    image.alt = '';
    const title = document.createElement('span');
    title.className = 'choice-label';
    title.textContent = option.label;
    const indicator = document.createElement('span');
    indicator.className = 'choice-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.textContent = '✓';
    label.append(input, image, title, indicator);
    if (descriptions[option.id]) {
      const description = document.createElement('span');
      description.className = 'choice-description';
      description.textContent = descriptions[option.id];
      label.append(description);
    }
    parent.append(label);
  }
}
createChoices($('#food-grid'), config.dinner.options, config.dinner.multiple ? 'checkbox' : 'radio', 'food');
createChoices($('#activity-grid'), config.activities, 'radio', 'activity');
function updateTimeControls() {
  const state = store.getState();
  const value = chosenTime();
  $('#time-confirm').disabled = !isAllowedTime(value, state.date);
  $('#time-confirm').textContent = state.time === value ? `Chosen · ${timeLabel(value)} ♡` : `Choose ${timeLabel(value)} ♡`;
  $('#time-status').textContent = state.time ? `${timeLabel(state.time)} · Manila time. A lovely choice.` : !state.date ? 'Pick your day, then choose your time.' : !isAllowedTime(value,state.date) ? 'That time has passed. Scroll to a later time.' : 'Your time, your choice. All times in Manila.';
}
function setupWheel(key, values) {
  const wheel = $(`#${key}-wheel`);
  let timer;
  for (const value of values) {
    const option = document.createElement('div');
    option.className = 'wheel-option';
    option.id = `${key}-option-${value}`;
    option.setAttribute('role','option');
    option.dataset.value = String(value);
    option.textContent = typeof value === 'number' ? String(value).padStart(2,'0') : value;
    wheel.append(option);
  }
  function select(value, scroll = true, smooth = true) {
    const changed = pendingTime[key] !== value;
    pendingTime[key] = value;
    for (const item of wheel.children) item.setAttribute('aria-selected', String(item.dataset.value === String(value)));
    wheel.setAttribute('aria-activedescendant',`${key}-option-${value}`);
    if (scroll) wheel.scrollTo({top:values.indexOf(value)*44,behavior:smooth ? 'smooth' : 'instant'});
    if (changed && store.getState().time && store.getState().time !== chosenTime()) store.dispatch({type:'time',value:null});
    updateTimeControls();
  }
  wheel.addEventListener('click',event => { const option = event.target.closest('[role="option"]'); if (option) select(values.find(value => String(value) === option.dataset.value)); });
  wheel.addEventListener('scroll',() => { clearTimeout(timer); timer = setTimeout(() => select(values[Math.max(0,Math.min(values.length-1,Math.round(wheel.scrollTop/44)))],false),130); },{passive:true});
  wheel.addEventListener('keydown',event => {
    if (!['ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)) return;
    event.preventDefault();
    const index = values.indexOf(pendingTime[key]);
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? values.length-1 : index + ({ArrowUp:-1,ArrowDown:1,PageUp:-5,PageDown:5}[event.key]);
    select(values[Math.max(0,Math.min(values.length-1,target))]);
  });
  wheels[key] = { select, sync:() => select(pendingTime[key],true,false) };
  select(pendingTime[key],false);
}
setupWheel('hour',Array.from({length:12},(_,i)=>i+1));
setupWheel('minute',Array.from({length:60},(_,i)=>i));
setupWheel('period',['AM','PM']);
$('#time-confirm').addEventListener('click',() => { if (!busy) { store.dispatch({type:'time',value:chosenTime()}); if (store.getState().time) selectionBloom($('#time-confirm')); } });
$('#final-message').textContent = config.finalMessage;
$('#closing-message').textContent = config.closingMessage;

function renderCalendar() {
  const state = store.getState();
  $('#calendar-month').textContent = `${month === 10 ? 'October' : 'November'} 2026`;
  $('[data-month="-1"]').disabled = month === 10;
  $('[data-month="1"]').disabled = month === 11;
  const grid = $('#calendar-days');
  grid.replaceChildren();
  const offset = new Date(Date.UTC(2026, month - 1, 1)).getUTCDay();
  const count = month === 10 ? 31 : 30;
  for (let index = 0; index < offset; index++) {
    const blank = document.createElement('span');
    blank.setAttribute('aria-hidden', 'true');
    grid.append(blank);
  }
  for (let day = 1; day <= count; day++) {
    const value = `2026-${month}-${String(day).padStart(2, '0')}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'calendar-day';
    button.dataset.date = value;
    button.textContent = day;
    button.disabled = !isAllowedDate(value);
    button.setAttribute('aria-label', dateFullLabel(value));
    button.setAttribute('aria-pressed', String(state.date === value));
    grid.append(button);
  }
}
function openCalendar() {
  recheckSchedule();
  month = store.getState().date ? Number(store.getState().date.slice(5, 7)) :
    allowedDates.find(date => isAllowedDate(date))?.includes('-11-') ? 11 : 10;
  renderCalendar();
  calendar.hidden = false;
  dateTrigger.setAttribute('aria-expanded', 'true');
  (calendar.querySelector('[aria-pressed="true"]:not(:disabled)') || calendar.querySelector('[data-date]:not(:disabled)') || calendar.querySelector('h2')).focus();
}
function closeCalendar(restoreFocus = false) {
  calendar.hidden = true;
  dateTrigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) dateTrigger.focus();
}
// A fixed decorative pool: no intervals, network requests, or growing particle lists.
function createAmbientHearts() {
  // A fixed field plus an upward stream: vivid from the first frame, without spawning.
  for (let index = 0; index < 240; index++) {
    const flowing = index >= 160;
    const fieldIndex = flowing ? index - 160 : index;
    const jitterX = ((index * 37) % 13 - 6) * .23;
    const jitterY = ((index * 29) % 11 - 5) * .29;
    const desktopX = flowing ? 2 + (fieldIndex * 37 % 100) * .96 : 2 + (fieldIndex % 20) * 5.02 + jitterX;
    const desktopY = flowing ? 100 : 3 + Math.floor(fieldIndex / 20) * 13 + jitterY;
    const mobileX = flowing ? 2 + (fieldIndex * 37 % 100) * .96 : 3 + (fieldIndex % 10) * 10.3 + jitterX;
    const mobileY = flowing ? 100 : 2 + Math.floor(fieldIndex / 10) * 6.1 + jitterY;
    const duration = flowing ? 20 + fieldIndex % 9 * 2 : 8 + fieldIndex % 6;
    const item = document.createElement('span');
    item.className = `ambient-heart ${flowing ? 'heart-flow' : 'heart-field'}`;
    item.innerHTML = heart;
    item.style.setProperty('--desktop-x',`${desktopX}%`);
    item.style.setProperty('--desktop-y',`${desktopY}%`);
    item.style.setProperty('--mobile-x',`${mobileX}%`);
    item.style.setProperty('--mobile-y',`${mobileY}%`);
    item.style.setProperty('--heart-size',`${flowing ? 10 + fieldIndex % 5 * 2 : 12 + fieldIndex % 6 * 2}px`);
    item.style.setProperty('--float-time',`${duration}s`);
    item.style.setProperty('--float-delay',`${-((index * 31) % 100) / 100 * duration}s`);
    item.style.setProperty('--glow-time',`${3.2 + index % 5 * .6}s`);
    item.style.setProperty('--glow-delay',`${-index * .63}s`);
    item.style.setProperty('--drift',`${(index % 2 ? 1 : -1) * (14 + index % 4 * 6)}px`);
    item.style.setProperty('--desktop-opacity',`${desktopX > 28 && desktopX < 72 ? .34 + index % 4 * .04 : .46 + index % 4 * .06}`);
    item.style.setProperty('--mobile-opacity',`${mobileX > 14 && mobileX < 86 ? .32 + index % 4 * .04 : .46 + index % 4 * .06}`);
    item.style.setProperty('--heart-tint',['#bb6484','#ca7896','#ba718b','#ce85a0','#bd708d','#bd9470'][index % 6]);
    $('#ambient-hearts').append(item);
  }
  [[12,19],[88,13],[6,72],[93,42],[31,88],[73,82],[37,8],[64,64]].forEach(([x,y],index) => {
    const charm = document.createElement('span');
    charm.className = 'ambient-charm';
    charm.style.left = `${x}%`;
    charm.style.top = `${y}%`;
    charm.style.setProperty('--float-time',`${12 + index % 4}s`);
    charm.style.setProperty('--float-delay',`${-index * 1.7}s`);
    charm.style.setProperty('--drift',`${index % 2 ? 12 : -12}px`);
    charm.innerHTML = index % 2 ? '<svg viewBox="0 0 24 24"><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M12 9C1-4-4 12 9 12-4 24 12 28 12 15c12 13 17-3 3-3C28 0 12-4 12 9Z"/><circle cx="12" cy="12" r="2"/></svg>';
    $('#ambient-hearts').append(charm);
  });
}
function clearParticles() {
  clearTimeout(particleTimer);
  $('#celebration-particles').replaceChildren();
}
function clearSelectionSparkles() {
  clearTimeout(selectionTimer);
  $('#selection-sparkles').replaceChildren();
}
// Full effects are automatic by explicit user request; only hidden tabs pause work.
function motionAllowed() { return !document.hidden; }
function celebrate() {
  clearParticles();
  const origin = celebrationOrigin || {x:innerWidth / 2,y:Math.min(innerHeight * .35,330)};
  celebrationOrigin = null;
  if (!motionAllowed()) return;
  const isEnding = store.getState().screen === 'ending';
  const center = {x:innerWidth / 2,y:isEnding ? Math.min(innerHeight * .23,240) : innerHeight * .42};
  const radius = isEnding ? Math.min(innerWidth * .33,140) : Math.min(innerWidth * .40,innerHeight * .33,285);
  // Parametric heart outline plus an inner ring, each built from tiny original SVG hearts.
  for (let index = 0; index < 64; index++) {
    const inner = index >= 44;
    const count = inner ? 20 : 44;
    const angle = (inner ? index - 44 : index) / count * Math.PI * 2;
    const scale = radius * (inner ? .82 : 1) / 16;
    const x = 16 * Math.sin(angle) ** 3 * scale;
    const y = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * scale;
    const piece = document.createElement('span');
    piece.className = 'heart-burst-piece';
    piece.innerHTML = heart;
    piece.style.left = `${origin.x}px`;
    piece.style.top = `${origin.y}px`;
    piece.style.setProperty('--x',`${center.x + x - origin.x}px`);
    piece.style.setProperty('--y',`${center.y + y - origin.y}px`);
    piece.style.setProperty('--end-x',`${center.x + x * 1.5 - origin.x}px`);
    piece.style.setProperty('--end-y',`${center.y + y * 1.35 + (isEnding ? 10 : 80) - origin.y}px`);
    piece.style.setProperty('--size',`${inner ? 10 : 12 + index % 4 * 2}px`);
    piece.style.setProperty('--tilt',`${index % 2 ? 12 : -12}deg`);
    piece.style.animationDelay = `${index % 6 * 18}ms`;
    $('#celebration-particles').append(piece);
  }
  particleTimer = setTimeout(clearParticles,3250);
}
function selectionBloom(element) {
  clearSelectionSparkles();
  if (!motionAllowed()) return;
  const bounds = element.getBoundingClientRect();
  const group = document.createElement('div');
  group.className = 'selection-bloom';
  group.style.left = `${bounds.left + bounds.width / 2}px`;
  group.style.top = `${bounds.top + bounds.height / 2}px`;
  for (let index = 0; index < 10; index++) {
    const piece = document.createElement('span');
    piece.className = 'selection-heart';
    piece.innerHTML = heart;
    const angle = index / 10 * Math.PI * 2;
    piece.style.setProperty('--x',`${Math.cos(angle) * (48 + bounds.width * .12)}px`);
    piece.style.setProperty('--y',`${Math.sin(angle) * 45 - 18}px`);
    piece.style.animationDelay = `${index % 3 * 30}ms`;
    group.append(piece);
  }
  $('#selection-sparkles').append(group);
  selectionTimer = setTimeout(clearSelectionSparkles,1100);
}
function stopIdleMotion() {
  clearTimeout(idleTimer);
  document.body.classList.remove('is-idle');
}
function resetIdleMotion(event) {
  if (document.body.classList.contains('is-idle')) document.body.classList.remove('is-idle');
  if (event?.type === 'pointermove' && performance.now() - lastIdleReset < 600) return;
  lastIdleReset = performance.now();
  clearTimeout(idleTimer);
  if (!motionAllowed()) return;
  idleTimer = setTimeout(() => {
    if (motionAllowed()) document.body.classList.add('is-idle');
  },4500);
}
for (const type of ['pointermove','pointerdown','keydown','scroll']) document.addEventListener(type,resetIdleMotion,{passive:true});
function resetNoDodge() {
  const no = $('#no-button');
  no.classList.remove('is-dodging');
  const slot = $('.no-slot');
  if (no.parentElement !== slot) slot.append(no);
  no.style.removeProperty('left');
  no.style.removeProperty('top');
  no.style.removeProperty('width');
  no.style.removeProperty('--no-x');
  no.style.removeProperty('--no-y');
  dodgeCount = 0;
  lastDodgeAt = -Infinity;
  $('#no-tease').textContent = 'p.s. one of these buttons is a little shy.';
}
function dodgeNo(event, repositionOnly = false) {
  if (store.getState().screen !== 'invitation') return;
  resetIdleMotion();
  event?.preventDefault();
  event?.stopPropagation();
  if (!repositionOnly && performance.now() - lastDodgeAt < 220) return;
  const no = $('#no-button');
  const current = no.getBoundingClientRect();
  const slot = $('.no-slot').getBoundingClientRect();
  const width = current.width;
  const height = current.height;
  const home = {x:slot.left + (slot.width - width) / 2,y:slot.top + (slot.height - height) / 2};
  const protectedRects = [
    $('[data-action="accept"]'),$('#invitation-title'),$('.opening>.eyebrow'),$('.opening>.description'),$('.opening-signoff'),$('#no-tease'),
  ].map(element => element.getBoundingClientRect());
  // Stay close to the original slot: no cross-screen jumps or cumulative drift.
  const offsets = [{x:24,y:-12},{x:8,y:-24},{x:28,y:-4},{x:16,y:-20},{x:0,y:-22},{x:20,y:-8}];
  const candidates = offsets.filter(offset => {
    const point = {x:home.x + offset.x,y:home.y + offset.y};
    return point.x >= 8 && point.x + width <= innerWidth - 8 && point.y >= 8 && point.y + height <= innerHeight - 8 &&
      !protectedRects.some(rect => point.x < rect.right + 6 && point.x + width > rect.left - 6 && point.y < rect.bottom + 5 && point.y + height > rect.top - 5) &&
      Math.hypot(point.x-current.left,point.y-current.top)>9;
  });
  const offset = candidates.length ? candidates[dodgeCount % candidates.length] : {x:0,y:0};
  const bodyZoom = Number.parseFloat(getComputedStyle(document.body).zoom) || 1;
  no.style.setProperty('--no-x',`${offset.x / bodyZoom}px`);
  no.style.setProperty('--no-y',`${offset.y / bodyZoom}px`);
  no.classList.add('is-dodging');
  if (!repositionOnly) {
    const captions = ['Oops. Just a tiny case of butterflies.','A little shy. A little dramatic.','Just a tiny hop. Still right here.','The world’s smallest getaway.','Psst… it’s only teasing.','Okay, that was my best tiny escape.'];
    $('#no-tease').textContent = captions[dodgeCount % captions.length];
    dodgeCount++;
    lastDodgeAt = performance.now();
    no.focus({preventScroll:true});
    selectionBloom(no);
  }
}
$('#no-button').addEventListener('pointerdown',event => dodgeNo(event));
$('#no-button').addEventListener('click',event => dodgeNo(event));
document.addEventListener('keydown',event => {
  if (event.key === 'Escape' && $('#no-button').classList.contains('is-dodging')) {
    resetNoDodge();
    $('#no-tease').textContent = 'Phew. Back where we started.';
  }
});
window.addEventListener('resize',() => { if ($('#no-button').classList.contains('is-dodging')) dodgeNo(null,true); });
function openLetter(button) {
  if (letterOpening || store.getState().screen !== 'letter') return;
  letterOpening = true;
  button.disabled = true;
  document.body.classList.add('letter-opening');
  $('#letter-hint').textContent = 'Opening a little something lovely…';
  const startedSession = session;
  const reveal = () => {
    letterOpening = false;
    button.disabled = false;
    document.body.classList.remove('letter-opening');
    if (session === startedSession && store.getState().screen === 'letter') navigate({type:'openLetter'});
  };
  // Navigation has a bounded fallback and never depends on an animation event.
  if (motionAllowed()) letterTimer = setTimeout(reveal,960);
  else reveal();
}
createAmbientHearts();
resetIdleMotion();
function writeHistory(replace = false) {
  try {
    history[replace ? 'replaceState' : 'pushState']({invitationSession: session, screen: store.getState().screen}, '', `#${store.getState().screen}`);
  } catch { historyAvailable = false; }
}
function render(state) {
  const changed = state.screen !== lastScreen;
  document.body.dataset.screen = state.screen;
  for (const section of sections) section.hidden = section.dataset.stage !== state.screen;
  const index = store.stages.findIndex(stage => stage.id === state.screen);
  const active = store.stages[index];
  $('#step-label').textContent = index < 0 ? 'A little pause' : `${String(index + 1).padStart(2, '0')} / ${String(store.stages.length).padStart(2, '0')} · ${active.label}`;
  stepButtons.forEach((button, stepIndex) => {
    button.disabled = stepIndex > state.furthest;
    button.classList.toggle('is-visited', stepIndex <= index);
    if (stepIndex === index) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  $('#date-display').textContent = state.date ? dateLabel(state.date) : 'Choose our day';
  updateTimeControls();
  if (changed && state.screen === 'scheduler') requestAnimationFrame(() => Object.values(wheels).forEach(wheel => wheel.sync()));
  $('#availability-note').hidden = allowedDates.some(date => isAllowedDate(date));
  $('#schedule-continue').disabled = !isAllowedDate(state.date) || !isAllowedTime(state.time, state.date);
  document.querySelectorAll('input[name="food"]').forEach(input => { input.checked = state.foodIds.includes(input.value); });
  document.querySelectorAll('input[name="activity"]').forEach(input => { input.checked = state.activityId === input.value; });
  const activity = config.activities.find(option => option.id === state.activityId);
  $('#activity-hint').textContent = activity ? `${activity.label} it is. A lovely choice.` : 'Choose the one that makes you smile.';
  $('#preview-button').disabled = !activity || busy;
  const food = config.dinner.options.filter(option => state.foodIds.includes(option.id));
  $('#summary-date').textContent = state.date ? dateLabel(state.date) : '';
  $('#summary-time').textContent = timeLabel(state.time);
  $('#summary-food-row').hidden = !config.dinner.enabled;
  $('#summary-food').textContent = food.length ? food.map(option => option.label).join(' & ') : 'We’ll decide together';
  if (food.length && $('#summary-food-art').getAttribute('src') !== artPath(food[0].art)) $('#summary-food-art').src = artPath(food[0].art);
  $('#summary-activity').textContent = activity?.label || '';
  if (activity && $('#summary-activity-art').getAttribute('src') !== artPath(activity.art)) $('#summary-activity-art').src = artPath(activity.art);
  $('.skip-food').hidden = config.dinner.required;
  $('[data-stage="dinner"] .description').textContent = config.dinner.multiple ? 'A little of this, a little of that. Pick as many as you like.' : 'What sounds good? Pick one little favorite.';
  const status = state.submission.status;
  $('#send-plan').disabled = status === 'sending' || status === 'sent';
  $('#send-plan').textContent = status === 'sending' ? 'Sending a little happiness…' : status === 'sent' ? 'Our plan is on its way ♡' : status === 'error' ? 'Try sending again ♡' : 'Send our plan ♡';
  $('#send-status').textContent = status === 'sending' ? 'Sending your choices. One little moment…' : status === 'sent' ? 'Your plan was accepted by the email service. You’ve just made someone smile.' : status === 'error' ? deliveryMessage(state.submission.errorCode) : '';
  $('#send-status').classList.toggle('is-error',status === 'error');
  $('#edit-plan').hidden = status === 'sent';
  $('#edit-plan').disabled = status === 'sending';
  stepButtons.forEach(button => { if (status === 'sending' || status === 'sent') button.disabled = true; });
  $('.delivery-notice').hidden = status === 'sent';
  $('.ending-preview').textContent = status === 'sent' ? 'A little plan, a very happy heart.' : 'Take a little look. Then send it with a smile.';
  scheduleAvailabilityCheck(state);
  document.title = `${active?.label || 'Just for you'} · Just for you`;
  if (changed) {
    resetNoDodge();
    stopIdleMotion();
    resetIdleMotion();
    clearTimeout(letterTimer);
    letterOpening = false;
    document.body.classList.remove('letter-opening');
    $('[data-action="open-letter"]').disabled = false;
    $('#letter-hint').textContent = 'Tap the heart. There’s a little something inside.';
    closeCalendar();
    $('#preview-error').hidden = true;
    $('#scheduler-error').hidden = true;

    const heading = $(`[data-stage="${state.screen}"] h1`);
    heading.focus({preventScroll:true});
    window.scrollTo({top:0, behavior:'instant'});
    $('#stage-announcement').textContent = index < 0 ? 'Invitation paused. Nothing was sent.' : `Step ${index + 1} of ${store.stages.length}: ${active.label}. Review your choices before sending.`;
    clearSelectionSparkles();
    if (['celebration', 'ending'].includes(state.screen)) celebrate();
    else clearParticles();
  }
  lastScreen = state.screen;
}
function navigate(action, replace = false) {
  const before = store.getState().screen;
  store.dispatch(action);
  if (store.getState().screen !== before) {
    writeHistory(replace);
    navigationUntil = performance.now() + 320;
  }
}
document.addEventListener('change', event => {
  if (event.target.matches('input[name="food"]')) { store.dispatch({type:'food', value:event.target.value}); if (event.target.checked) selectionBloom(event.target.closest('label')); }
  if (event.target.matches('input[name="activity"]')) { store.dispatch({type:'activity', value:event.target.value}); selectionBloom(event.target.closest('label')); }
});
dateTrigger.addEventListener('click', () => { if (calendar.hidden) openCalendar(); else closeCalendar(); });
calendar.addEventListener('click', event => {
  const day = event.target.closest('[data-date]');
  const monthButton = event.target.closest('[data-month]');
  if (day && !day.disabled) {
    store.dispatch({type:'date', value:day.dataset.date});
    closeCalendar(true);
    selectionBloom(dateTrigger);
  } else if (monthButton && !monthButton.disabled) {
    month += Number(monthButton.dataset.month);
    renderCalendar();
    calendar.querySelector(`[data-month="${month === 10 ? '1' : '-1'}"]`).focus();
  }
});
calendar.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); closeCalendar(true); return; }
  const current = event.target.closest('[data-date]');
  if (!current || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const value = current.dataset.date;
  const instant = new Date(`${value}T12:00:00Z`);
  const weekday = instant.getUTCDay();
  const shifts = {ArrowLeft:-1, ArrowRight:1, ArrowUp:-7, ArrowDown:7, Home:-weekday, End:6-weekday};
  const shift = shifts[event.key];
  instant.setUTCDate(instant.getUTCDate() + shift);
  const searchDirection = event.key === 'Home' ? 1 : event.key === 'End' ? -1 : Math.sign(shift);
  let target = instant.toISOString().slice(0,10);
  for (let attempts = 0; !isAllowedDate(target) && attempts < 32; attempts++) {
    if (target < allowedDates[0] || target > allowedDates.at(-1) || searchDirection === 0) return;
    instant.setUTCDate(instant.getUTCDate() + searchDirection);
    target = instant.toISOString().slice(0,10);
  }
  if (!isAllowedDate(target)) return;
  month = Number(target.slice(5,7));
  renderCalendar();
  calendar.querySelector(`[data-date="${target}"]`)?.focus();
});
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-action], [data-step]');
  if (!button || button.disabled || busy) return;
  const owner = button.closest('[data-stage]');
  if (owner && owner.dataset.stage !== store.getState().screen) return;
  event.preventDefault();
  if (performance.now() < navigationUntil) return;
  if (button.dataset.step) { navigate({type:'restore', screen:button.dataset.step}); return; }
  switch (button.dataset.action) {
    case 'open-letter': openLetter(button); break;
    case 'accept': {
      const bounds = button.getBoundingClientRect();
      celebrationOrigin = {x:bounds.left + bounds.width / 2,y:bounds.top + bounds.height / 2};
      navigate({type:'accept'});
      break;
    }
    case 'next': {
      const from = store.getState().screen;
      recheckSchedule();
      if (store.getState().screen !== from) return;
      navigate({type:'next', from});
      if (from === 'scheduler' && store.getState().screen === from) {
        $('#scheduler-error').textContent = 'Please choose an available day and time.';
        $('#scheduler-error').hidden = false;
      }
      break;
    }
    case 'skip-food':
      store.dispatch({type:'clear-food'});
      navigate({type:'next', from:'dinner'});
      break;
    case 'home': navigate({type:'restore', screen:'invitation'}); break;
    case 'back': {
      if (historyAvailable) history.back();
      else {
        const index = store.stages.findIndex(stage => stage.id === store.getState().screen);
        if (index > 0) navigate({type:'restore',screen:store.stages[index - 1].id});
      }
      break;
    }
    case 'send': {
      const plan = store.getState();
      if (plan.submission.sent || !validatePlan(plan).valid) { recheckSchedule(); return; }
      if (!['http:', 'https:'].includes(location.protocol)) {
        $('#send-status').textContent = 'Open the live invitation link to send your plan. This downloaded copy stays offline.';
        return;
      }
      store.dispatch({type:'sendStart'});
      if (store.getState().submission.status !== 'sending') return;
      busy = true;
      $('#main').setAttribute('aria-busy','true');
      const startedSession = session;
      try {
        const result = await sendPlan(plan);
        if (session === startedSession) { store.dispatch({type:'sendSuccess',result}); celebrate(); }
      } catch (error) {
        if (session === startedSession) store.dispatch({type:'sendError', errorCode:error?.code});
      } finally {
        busy = false;
        $('#main').removeAttribute('aria-busy');
        render(store.getState());
      }
      break;
    }
    case 'preview': {
      const validation = validatePlan(store.getState());
      if (!validation.valid) {
        if (validation.errors.date || validation.errors.time) { recheckSchedule(); return; }
        $('#preview-error').textContent = Object.values(validation.errors).join(' ');
        $('#preview-error').hidden = false;
        return;
      }
      busy = true;
      button.disabled = true;
      $('#main').setAttribute('aria-busy','true');
      const startedSession = session;
      try {
        const result = await previewSubmission();
        if (session === startedSession) {
          navigate({type:'previewComplete', result});
          if (store.getState().screen !== 'ending') throw new Error('The date needs checking again');
        }
      } catch {
        $('#preview-error').textContent = 'Please check your available day and time again. Nothing was sent.';
        $('#preview-error').hidden = false;
      } finally {
        busy = false;
        button.disabled = !store.getState().activityId;
        $('#main').removeAttribute('aria-busy');
        render(store.getState());
      }
      break;
    }
  }
});
$('.skip-link').addEventListener('click', event => {event.preventDefault(); $(`[data-stage="${store.getState().screen}"] h1`).focus();});
window.addEventListener('popstate', event => {
  if (busy || store.getState().submission.sent) { writeHistory(true); return; }
  if (event.state?.invitationSession === session) store.dispatch({type:'restore', screen:event.state.screen});
  else store.dispatch({type:'reset'});
  writeHistory(true);
});
function scheduleAvailabilityCheck(state) {
  clearTimeout(availabilityTimer);
  if (busy || state.submission.status === 'sending' || state.submission.sent || !state.date || ['letter','invitation','celebration'].includes(state.screen)) return;
  const midnight = new Date(`${state.date}T00:00:00+08:00`).getTime() + 86400000;
  const slot = state.time && config.rejectElapsedSampleTimes ? new Date(`${state.date}T${state.time}:00+08:00`).getTime() : midnight;
  const remaining = Math.min(midnight,slot) - Date.now() + 10;
  // One bounded wakeup at the selected slot/day expiry; long delays recheck safely.
  availabilityTimer = setTimeout(recheckSchedule, Math.max(20,Math.min(remaining,2147483647)));
}
function recheckSchedule() {
  const state = store.getState();
  if (busy || state.submission.status === 'sending') return;
  if (state.submission.sent) { render(state); return; }
  const staleDate = state.date && !isAllowedDate(state.date);
  const staleTime = state.time && !isAllowedTime(state.time,state.date);
  if ((staleDate || staleTime) && !['letter','invitation','celebration'].includes(state.screen)) {
    if (state.screen !== 'scheduler') navigate({type:'restore',screen:'scheduler'});
    store.dispatch(staleDate ? {type:'date',value:null} : {type:'time',value:null});
    $('#scheduler-error').textContent = 'That day or time has passed. Please choose an available one.';
    $('#scheduler-error').hidden = false;
  } else render(store.getState());
  if (!calendar.hidden) renderCalendar();
}
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('motion-paused', document.hidden);
  if (document.hidden) { clearParticles(); clearSelectionSparkles(); stopIdleMotion(); } else { recheckSchedule(); resetIdleMotion(); }
});
window.addEventListener('focus', recheckSchedule);
window.addEventListener('beforeunload', event => {
  if (store.getState().submission.status === 'sending') { event.preventDefault(); event.returnValue = ''; }
});
store.subscribe(render);
writeHistory(true);
render(store.getState());
$('#script-fallback').hidden = true;
