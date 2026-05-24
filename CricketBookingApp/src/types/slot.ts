export interface DateOption {
  id: string;
  day: string;
  date: number;
  month: string;
}

export interface ClubSlotConfig {
  clubId: string;
  unavailableSlots: string[];
}

export interface SlotsData {
  dateOptions: DateOption[];
  defaultUnavailableSlots: string[];
  clubSlots: ClubSlotConfig[];
}
