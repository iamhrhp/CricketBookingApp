export type NotificationType = 'booking' | 'activity';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  senderName?: string;
  time: string;
  read: boolean;
}
