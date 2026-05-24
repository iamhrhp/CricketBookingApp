export type ActivityStatus = 'upcoming' | 'in_progress' | 'completed';

export interface Activity {
  id: string;
  clubId: string;
  clubName: string;
  name: string;
  hostName: string;
  dateTime: string;
  slot: string;
  duration: number;
  amount: number;
  status: ActivityStatus;
  playerCount: number;
  maxPlayers: number;
  players: string[];
  comment?: string;
}

export interface CreateActivityInput {
  clubId: string;
  name: string;
  playerSize: number;
  comment?: string;
  hostName?: string;
  clubName?: string;
}
