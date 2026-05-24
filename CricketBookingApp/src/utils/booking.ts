import { BookingStatus } from '../types/booking';
import { colors } from '../theme/colors';

export function getBookingStatusMeta(status: BookingStatus) {
  switch (status) {
    case 'upcoming':
      return { label: 'Upcoming', color: colors.blue, background: '#EEF3FF' };
    case 'completed':
      return { label: 'Completed', color: colors.success, background: '#E8FAEF' };
    case 'cancelled':
      return { label: 'Cancelled', color: colors.danger, background: '#FFF5F4' };
  }
}
