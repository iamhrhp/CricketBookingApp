import { searchClubs } from '../api/clubsApi';
import { apiDelay } from '../api/utils';
import {
  ActivityDraft,
  ActivityDraftField,
  buildSummary,
  getNextMissingField,
  getQuestionForField,
  isDraftComplete,
} from '../utils/activityDraft';

export type AiChatRole = 'assistant' | 'user';

export interface AiChatMessage {
  id: string;
  role: AiChatRole;
  text: string;
}

export interface AiTurnResult {
  messages: AiChatMessage[];
  draft: ActivityDraft;
  isComplete: boolean;
  awaitingConfirmation: boolean;
}

let messageCounter = 0;

function createMessage(role: AiChatRole, text: string): AiChatMessage {
  messageCounter += 1;
  return { id: `m-${messageCounter}`, role, text };
}

function parsePlayerSize(text: string): number | null {
  const match = text.match(/\d+/);
  if (!match) return null;
  const value = Number.parseInt(match[0], 10);
  return value > 0 && value <= 30 ? value : null;
}

async function resolveClub(text: string): Promise<{ clubId: string; clubName: string } | null> {
  const clubs = await searchClubs(text.trim());
  if (clubs.length === 0) return null;
  return { clubId: clubs[0].id, clubName: clubs[0].name };
}

function applyAnswer(
  field: ActivityDraftField,
  answer: string,
  draft: ActivityDraft,
): { draft: ActivityDraft; error?: string } {
  const trimmed = answer.trim();

  switch (field) {
    case 'activityName':
      if (trimmed.length < 2) {
        return { draft, error: 'Please give a short activity name (at least 2 characters).' };
      }
      return { draft: { ...draft, activityName: trimmed } };

    case 'playerSize': {
      const size = parsePlayerSize(trimmed);
      if (!size) {
        return { draft, error: 'Please enter a valid player count between 1 and 30.' };
      }
      return { draft: { ...draft, playerSize: size } };
    }

    case 'club':
      return { draft };

    case 'date':
      if (trimmed.length < 2) {
        return { draft, error: 'Please share a date, like "Sunday 25 May".' };
      }
      return { draft: { ...draft, date: trimmed } };

    case 'time':
      if (trimmed.length < 2) {
        return { draft, error: 'Please share a time, like "7:00 AM".' };
      }
      return { draft: { ...draft, time: trimmed } };

    case 'comment':
      if (/^skip$/i.test(trimmed)) {
        return { draft: { ...draft, comment: '' } };
      }
      return { draft: { ...draft, comment: trimmed } };

    default:
      return { draft };
  }
}

export async function processActivityAnswer(
  answer: string,
  draft: ActivityDraft,
  awaitingConfirmation: boolean,
): Promise<AiTurnResult> {
  await apiDelay(400);

  const userMessage = createMessage('user', answer.trim());
  const messages: AiChatMessage[] = [userMessage];

  if (awaitingConfirmation) {
    const yes = /^(yes|y|create|confirm|ok|sure|go ahead)/i.test(answer.trim());
    if (yes) {
      return {
        messages: [
          ...messages,
          createMessage('assistant', 'Perfect. Creating your activity now...'),
        ],
        draft,
        isComplete: true,
        awaitingConfirmation: false,
      };
    }

    return {
      messages: [
        ...messages,
        createMessage(
          'assistant',
          'No problem. Tell me which detail to change — name, players, club, date, time, or notes.',
        ),
      ],
      draft: { ...draft, comment: undefined },
      isComplete: false,
      awaitingConfirmation: false,
    };
  }

  const nextField = getNextMissingField(draft);
  if (!nextField) {
    return { messages, draft, isComplete: true, awaitingConfirmation: true };
  }

  if (nextField === 'club') {
    const club = await resolveClub(answer);
    if (!club) {
      return {
        messages: [
          ...messages,
          createMessage(
            'assistant',
            "I couldn't find that club. Try a turf name or city like MSD Cricket Turf, Raipur, or Durg.",
          ),
        ],
        draft,
        isComplete: false,
        awaitingConfirmation: false,
      };
    }

    const updatedDraft: ActivityDraft = {
      ...draft,
      clubId: club.clubId,
      clubName: club.clubName,
    };

    const followUp = getNextMissingField(updatedDraft);
    if (!followUp) {
      return buildConfirmationTurn(messages, updatedDraft);
    }

    return {
      messages: [
        ...messages,
        createMessage('assistant', `Got it — ${club.clubName}. ${getQuestionForField(followUp)}`),
      ],
      draft: updatedDraft,
      isComplete: false,
      awaitingConfirmation: false,
    };
  }

  const { draft: updatedDraft, error } = applyAnswer(nextField, answer, draft);

  if (error) {
    return {
      messages: [...messages, createMessage('assistant', error)],
      draft,
      isComplete: false,
      awaitingConfirmation: false,
    };
  }

  const followUp = getNextMissingField(updatedDraft);
  if (!followUp) {
    return buildConfirmationTurn(messages, updatedDraft);
  }

  const ack =
    nextField === 'activityName'
      ? `"${updatedDraft.activityName}" — nice choice.`
      : nextField === 'playerSize'
        ? `${updatedDraft.playerSize} players — noted.`
        : nextField === 'date'
          ? `${updatedDraft.date} — saved.`
          : 'Got it.';

  return {
    messages: [
      ...messages,
      createMessage('assistant', `${ack} ${getQuestionForField(followUp)}`),
    ],
    draft: updatedDraft,
    isComplete: false,
    awaitingConfirmation: false,
  };
}

function buildConfirmationTurn(
  priorMessages: AiChatMessage[],
  draft: ActivityDraft,
): AiTurnResult {
  return {
    messages: [
      ...priorMessages,
      createMessage(
        'assistant',
        `Here's your activity:\n\n${buildSummary(draft)}\n\nShall I create it? Reply "yes" to confirm.`,
      ),
    ],
    draft,
    isComplete: isDraftComplete(draft),
    awaitingConfirmation: true,
  };
}

export function getInitialAssistantMessages(): AiChatMessage[] {
  return [
    createMessage(
      'assistant',
      "Hi! I'm your AI activity agent. I'll guide you step-by-step to create a cricket match.",
    ),
    createMessage('assistant', getQuestionForField('activityName')),
  ];
}
