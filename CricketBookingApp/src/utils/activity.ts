import { ActivityStatus } from '../types/activity';
import { colors } from '../theme/colors';

export function getActivityStatusMeta(status: ActivityStatus) {
  switch (status) {
    case 'upcoming':
      return { label: 'Upcoming', color: colors.blue, background: '#EEF3FF' };
    case 'in_progress':
      return { label: 'In Progress', color: '#FF9500', background: '#FFF4E5' };
    case 'completed':
      return { label: 'Completed', color: colors.success, background: '#E8FAEF' };
  }
}
