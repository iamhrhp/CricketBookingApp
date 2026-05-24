export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  clubId: string;
  clubName: string;
  slot: string;
  duration: number;
  amount: number;
  date: string;
  status: BookingStatus;
  paymentMethod?: string;
}

export interface CreateBookingInput {
  clubId: string;
  clubName: string;
  slot: string;
  duration: number;
  amount: number;
  date: string;
  paymentMethod?: string;
}
