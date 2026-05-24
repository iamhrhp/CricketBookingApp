import bookingsSeed from './data/bookings.json';
import { apiDelay, createId } from './utils';
import { Booking, BookingStatus, CreateBookingInput } from '../types/booking';

let bookingsStore: Booking[] = [...(bookingsSeed as Booking[])];

/** GET /bookings */
export async function fetchBookings(): Promise<Booking[]> {
  await apiDelay();
  return [...bookingsStore];
}

/** GET /bookings/:id */
export async function fetchBookingById(id: string): Promise<Booking | null> {
  await apiDelay();
  const booking = bookingsStore.find((item) => item.id === id);
  return booking ? { ...booking } : null;
}

/** GET /bookings?status= */
export async function fetchBookingsByStatus(status: BookingStatus): Promise<Booking[]> {
  await apiDelay();
  return bookingsStore.filter((booking) => booking.status === status);
}

/** GET /bookings/history */
export async function fetchBookingHistory(): Promise<Booking[]> {
  await apiDelay();
  return bookingsStore.filter((booking) => booking.status !== 'cancelled');
}

/** POST /bookings */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  await apiDelay();

  const booking: Booking = {
    id: createId('b'),
    ...input,
    status: 'upcoming',
  };

  bookingsStore = [booking, ...bookingsStore];
  return booking;
}
