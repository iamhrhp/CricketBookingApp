import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { fetchBookings } from '../api/bookingsApi';
import { BookingStackParamList } from '../navigation/types';
import { Booking } from '../types/booking';
import { getBookingStatusMeta } from '../utils/booking';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<BookingStackParamList, 'Booking'>;

export default function BookingScreen({ navigation }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Booking</Text>
        <Text style={styles.subtitle}>Slot → Duration → Amount → Checkout → Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.blue} style={styles.loader} />
        ) : (
          bookings.map((booking) => {
            const statusMeta = getBookingStatusMeta(booking.status);

            return (
              <Pressable
                key={booking.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('BookingDetails', { bookingId: booking.id })
                }
              >
                <View style={styles.cardTop}>
                  <Text style={styles.clubName}>{booking.clubName}</Text>
                  <View style={[styles.badge, { backgroundColor: statusMeta.background }]}>
                    <Text style={[styles.badgeText, { color: statusMeta.color }]}>
                      {statusMeta.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.meta}>{booking.date}</Text>
                </View>
                <View style={styles.row}>
                  <Icon name="time-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.meta}>
                    {booking.slot} · {booking.duration} min
                  </Text>
                </View>
                {booking.paymentMethod ? (
                  <View style={styles.row}>
                    <Icon name="wallet-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.meta}>{booking.paymentMethod}</Text>
                  </View>
                ) : null}
                <View style={styles.cardFooter}>
                  <Text style={styles.amount}>₹{booking.amount}</Text>
                  <Icon name="chevron-forward" size={20} color={colors.textMuted} />
                </View>
              </Pressable>
            );
          })
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
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clubName: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  meta: { fontSize: 14, color: colors.textSecondary },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  amount: { fontSize: 18, fontWeight: '800', color: colors.navy },
});
