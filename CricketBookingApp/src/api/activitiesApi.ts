import activitiesSeed from './data/activities.json';
import { fetchClubById } from './clubsApi';
import { apiDelay, createId } from './utils';
import { Activity, CreateActivityInput } from '../types/activity';

let activitiesStore: Activity[] = [...(activitiesSeed as Activity[])];

const CURRENT_USER = 'Arjun Mehta';

/** GET /activities */
export async function fetchActivities(): Promise<Activity[]> {
  await apiDelay();
  return [...activitiesStore];
}

/** GET /activities/:id */
export async function fetchActivityById(id: string): Promise<Activity | null> {
  await apiDelay();
  const activity = activitiesStore.find((item) => item.id === id);
  return activity ? { ...activity } : null;
}

/** GET /activities?clubId= */
export async function fetchActivitiesByClub(clubId: string): Promise<Activity[]> {
  await apiDelay();
  return activitiesStore.filter((activity) => activity.clubId === clubId);
}

/** POST /activities */
export async function createActivity(input: CreateActivityInput): Promise<Activity> {
  await apiDelay();

  const club = await fetchClubById(input.clubId);
  const duration = 90;
  const hostName = input.hostName ?? CURRENT_USER;
  const amount = club ? Math.round((duration / 60) * club.pricePerHour) : 1200;

  const activity: Activity = {
    id: createId('a'),
    clubId: input.clubId,
    clubName: input.clubName ?? club?.name ?? 'Cricket Turf',
    name: input.name,
    hostName,
    dateTime: 'Sat, 07 Jun · 6:00 PM',
    slot: '6:00 PM',
    duration,
    amount,
    status: 'upcoming',
    playerCount: 1,
    maxPlayers: input.playerSize,
    players: [hostName],
    comment: input.comment,
  };

  activitiesStore = [activity, ...activitiesStore];
  return activity;
}

/** POST /activities/:id/join */
export async function joinActivity(activityId: string): Promise<Activity | null> {
  await apiDelay();

  const index = activitiesStore.findIndex((activity) => activity.id === activityId);
  if (index === -1) {
    return null;
  }

  const activity = activitiesStore[index];
  if (activity.playerCount >= activity.maxPlayers || activity.status !== 'upcoming') {
    return null;
  }

  const players = activity.players.includes(CURRENT_USER)
    ? activity.players
    : [...activity.players, CURRENT_USER];

  const updated: Activity = {
    ...activity,
    players,
    playerCount: players.length,
  };

  activitiesStore = activitiesStore.map((item) =>
    item.id === activityId ? updated : item,
  );

  return updated;
}
