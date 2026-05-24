import slotsData from './data/slots.json';
import { apiDelay } from './utils';
import { DateOption, SlotsData } from '../types/slot';

const slots = slotsData as SlotsData & { timeSlots: string[] };

/** GET /slots/dates */
export async function fetchDateOptions(): Promise<DateOption[]> {
  await apiDelay();
  return slots.dateOptions;
}

/** GET /slots/times */
export async function fetchTimeSlots(): Promise<string[]> {
  await apiDelay();
  return slots.timeSlots;
}

/** GET /slots/:clubId/unavailable */
export async function fetchUnavailableSlots(clubId: string): Promise<Set<string>> {
  await apiDelay();
  const clubConfig = slots.clubSlots.find((item) => item.clubId === clubId);
  const unavailable = clubConfig?.unavailableSlots ?? slots.defaultUnavailableSlots;
  return new Set(unavailable);
}
