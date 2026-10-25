// Public review settings. Food and time fixtures are provisional, not approved availability.
const choices = values => Object.freeze(values.map(([id, label, art = id]) => Object.freeze({ id, label, art })));

export const config = Object.freeze({
  timezone: 'Asia/Manila',
  submissionMode: 'mock',
  invitationVariant: 'yes-or-yes',
  invitationQuestion: 'Will you go out on a date with me?',
  finalMessage: 'See you cutie, wear whatever makes you feel comfortable, okay? You don’t have to dress up or try to impress me, because honestly, I already think you’re beautiful just the way you are.',
  dinner: Object.freeze({
    enabled: true,
    required: false,
    multiple: true,
    provisional: true,
    options: choices([
      ['pizza', 'Pizza'], ['sushi', 'Sushi'], ['burgers', 'Burgers'],
      ['pasta', 'Pasta'], ['tacos', 'Tacos'], ['ramen', 'Ramen'],
    ]),
  }),
  activities: choices([
    ['city-lights', 'City Lights'], ['around-city', 'Around the City'],
    ['movie-date', 'Movie Date'], ['arcade', 'Arcade'],
  ]),
  timesProvisional: true,
  // Engineering preview policy only: elapsed same-day sample slots are unavailable.
  rejectElapsedSampleTimes: true,
  allowedTimes: Object.freeze([
    ['17:00', '5:00 PM'], ['18:00', '6:00 PM'], ['19:00', '7:00 PM'],
    ['20:00', '8:00 PM'], ['21:00', '9:00 PM'],
  ].map(([value, label]) => Object.freeze({ value, label }))),
  audioEnabled: false,
  stages: Object.freeze([
    { id: 'invitation', label: 'Invitation' },
    { id: 'celebration', label: 'A happy little yes' },
    { id: 'scheduler', label: 'A little time' },
    { id: 'dinner', label: 'A little taste' },
    { id: 'activity', label: 'An adventure' },
    { id: 'ending', label: 'Our little plan' },
  ].map(Object.freeze)),
});

export function enabledStages(settings = config) {
  return settings.stages.filter(stage => stage.id !== 'dinner' || settings.dinner.enabled);
}
