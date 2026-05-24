import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchNotifications } from '../api/notificationsApi';
import { NotificationItem } from '../types/notification';
import { colors } from '../theme/colors';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Booking updates & activity invites</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.blue} style={styles.loader} />
        ) : (
          notifications.map((item) => (
            <View
              key={item.id}
              style={[styles.card, !item.read && styles.cardUnread]}
            >
              <View style={styles.iconWrap}>
                <Icon
                  name={item.type === 'booking' ? 'calendar' : 'people'}
                  size={20}
                  color={colors.blue}
                />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.senderName ? (
                  <Text style={styles.sender}>{item.senderName}</Text>
                ) : null}
                <Text style={styles.cardMessage}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  loader: { marginVertical: 32 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  cardUnread: { backgroundColor: '#F5F8FF' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  sender: { fontSize: 12, fontWeight: '600', color: colors.blue, marginBottom: 4 },
  cardMessage: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 6 },
  time: { fontSize: 12, color: colors.textMuted },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginTop: 4,
  },
});
