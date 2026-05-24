export type ActivityDraftField =
  | 'activityName'
  | 'playerSize'
  | 'club'
  | 'date'
  | 'time'
  | 'comment';

export interface ActivityDraft {
  activityName?: string;
  playerSize?: number;
  clubId?: string;
  clubName?: string;
  date?: string;
  time?: string;
  comment?: string;
}

const FIELD_ORDER: ActivityDraftField[] = [
  'activityName',
  'playerSize',
  'club',
  'date',
  'time',
  'comment',
];

export { FIELD_ORDER };

export function getNextMissingField(draft: ActivityDraft): ActivityDraftField | null {
  for (const field of FIELD_ORDER) {
    if (field === 'activityName' && !draft.activityName?.trim()) return field;
    if (field === 'playerSize' && !draft.playerSize) return field;
    if (field === 'club' && !draft.clubId) return field;
    if (field === 'date' && !draft.date?.trim()) return field;
    if (field === 'time' && !draft.time?.trim()) return field;
    if (field === 'comment' && draft.comment === undefined) return field;
  }
  return null;
}

export function isDraftComplete(draft: ActivityDraft): boolean {
  return getNextMissingField(draft) === null;
}

export function getFilledStepCount(draft: ActivityDraft): number {
  return FIELD_ORDER.filter((field) => isFieldFilled(draft, field)).length;
}

export function isFieldFilled(draft: ActivityDraft, field: ActivityDraftField): boolean {
  if (field === 'activityName') return Boolean(draft.activityName?.trim());
  if (field === 'playerSize') return Boolean(draft.playerSize);
  if (field === 'club') return Boolean(draft.clubId);
  if (field === 'date') return Boolean(draft.date?.trim());
  if (field === 'time') return Boolean(draft.time?.trim());
  if (field === 'comment') return draft.comment !== undefined;
  return false;
}

export const DRAFT_STEP_LABELS: Record<ActivityDraftField, string> = {
  activityName: 'Name',
  playerSize: 'Players',
  club: 'Club',
  date: 'Date',
  time: 'Time',
  comment: 'Notes',
};

export function getQuestionForField(field: ActivityDraftField): string {
  switch (field) {
    case 'activityName':
      return 'Great! What should we call this activity? For example: "Sunday Gully T20" or "Office Box Cricket".';
    case 'playerSize':
      return 'How many players do you need? (e.g. 6, 8, or 11)';
    case 'club':
      return 'Which turf should host it? Tell me the club name or city — like "MSD Cricket Turf" or "Raipur".';
    case 'date':
      return 'What date are you planning? (e.g. "Sunday 25 May" or "tomorrow")';
    case 'time':
      return 'What time should the match start? (e.g. "7:00 AM" or "8 PM")';
    case 'comment':
      return 'Any notes for players? Share rules or skill level — or type "skip" to leave blank.';
  }
}

export function getWelcomeMessage(): string {
  return "Hi! I'm your AI activity assistant. I'll ask a few quick questions and set up your cricket activity for you. Ready when you are — tap Start below or type anything to begin.";
}

export function buildSummary(draft: ActivityDraft): string {
  return [
    `Activity: ${draft.activityName}`,
    `Players: ${draft.playerSize}`,
    `Club: ${draft.clubName}`,
    `When: ${draft.date} · ${draft.time}`,
    `Notes: ${draft.comment?.trim() ? draft.comment : 'None'}`,
  ].join('\n');
}
