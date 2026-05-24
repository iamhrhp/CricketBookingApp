import notificationsSeed from './data/notifications.json';
import { apiDelay, createId } from './utils';
import { NotificationItem, NotificationType } from '../types/notification';

let notificationsStore: NotificationItem[] = [...(notificationsSeed as NotificationItem[])];

/** GET /notifications */
export async function fetchNotifications(): Promise<NotificationItem[]> {
  await apiDelay();
  return [...notificationsStore];
}

/** GET /notifications/unread */
export async function fetchUnreadNotifications(): Promise<NotificationItem[]> {
  await apiDelay();
  return notificationsStore.filter((item) => !item.read);
}

/** PATCH /notifications/:id/read */
export async function markNotificationRead(id: string): Promise<void> {
  await apiDelay();
  notificationsStore = notificationsStore.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
}

/** POST /notifications */
export async function createNotification(input: {
  type: NotificationType;
  title: string;
  message: string;
  senderName?: string;
}): Promise<NotificationItem> {
  await apiDelay();

  const notification: NotificationItem = {
    id: createId('n'),
    type: input.type,
    title: input.title,
    message: input.message,
    senderName: input.senderName ?? 'Cricket Turf Booking',
    time: 'Just now',
    read: false,
  };

  notificationsStore = [notification, ...notificationsStore];
  return notification;
}
