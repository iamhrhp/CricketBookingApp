import clubsData from './data/clubs.json';
import { apiDelay } from './utils';
import { Club } from '../types/club';

const NEARBY_CITIES = new Set(['Raipur', 'Bilaspur', 'Durg']);

function withNearby(club: Club): Club {
  return {
    ...club,
    nearby: NEARBY_CITIES.has(club.location),
  };
}

/** GET /clubs */
export async function fetchClubs(): Promise<Club[]> {
  await apiDelay();
  return (clubsData as Club[]).map(withNearby);
}

/** GET /clubs/:id */
export async function fetchClubById(id: string): Promise<Club | null> {
  await apiDelay();
  const club = (clubsData as Club[]).find((item) => item.id === id);
  return club ? withNearby(club) : null;
}

/** GET /clubs/nearby */
export async function fetchNearbyClubs(): Promise<Club[]> {
  const clubs = await fetchClubs();
  return clubs.filter((club) => club.nearby);
}

/** GET /clubs/search?q= */
export async function searchClubs(query: string): Promise<Club[]> {
  await apiDelay();
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return (clubsData as Club[]).map(withNearby);
  }

  return (clubsData as Club[])
    .filter(
      (club) =>
        club.name.toLowerCase().includes(normalized) ||
        club.location.toLowerCase().includes(normalized) ||
        club.cricketType.toLowerCase().includes(normalized),
    )
    .map(withNearby);
}
