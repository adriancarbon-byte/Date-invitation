// Public prototype settings. Unconfirmed client decisions stay unset.
export const config = Object.freeze({
  timezone: 'Asia/Manila',
  submissionMode: 'mock',
  invitationVariant: null,
  dinner: Object.freeze({ enabled: true, required: false, options: Object.freeze([]) }),
  allowedTimes: null,
  audioEnabled: false,
  stages: Object.freeze([
    { id: 'invitation', label: 'Invitation' },
    { id: 'dinner', label: 'A little taste' },
    { id: 'activity', label: 'An adventure' },
    { id: 'scheduler', label: 'A little time' },
    { id: 'ending', label: 'The beginning' },
  ].map(Object.freeze)),
  previewOptions: Object.freeze([
    Object.freeze({ id: 'sample-a', label: 'A shared table' }),
    Object.freeze({ id: 'sample-b', label: 'A sweet little stop' }),
  ]),
});

export function enabledStages(settings = config) {
  return settings.stages.filter(stage => stage.id !== 'dinner' || settings.dinner.enabled);
}
