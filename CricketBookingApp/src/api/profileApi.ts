import userData from './data/user.json';
import { apiDelay } from './utils';
import { UserProfile } from '../types/user';

/** GET /profile */
export async function fetchUserProfile(): Promise<UserProfile> {
  await apiDelay();
  return userData as UserProfile;
}
