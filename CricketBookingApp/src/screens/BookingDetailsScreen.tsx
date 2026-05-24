import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { fetchBookingById } from '../api/bookingsApi';
import { fetchClubById } from '../api/clubsApi';
import ScreenHeader from '../components/ScreenHeader';
import { BookingStackParamList, MainTabParamList } from '../navigation/types';
import { Booking } from '../types/booking';
import { getBookingStatusMeta } from '../utils/booking';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingDetails'>;

type NavigationProp = CompositeNavigationProp<
  NativeStackScreenProps<BookingStackParamList, 'BookingDetails'>['navigation'],
  BottomTabNavigationProp<MainTabParamList>
>;

export default function BookingDetailsScreen({ navigation, route }: Props) {
  const tabNavigation = navigation as NavigationProp;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = useCallback(async () => {
    setLoading(true);
    const data = await fetchBookingById(route.params.bookingId);
    setBooking(data);

    if (data) {
      const club = await fetchClubById(data.clubId);
      setRating(club?.rating ?? null);
    }

    setLoading(false);
  }, [route.params.bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Booking Details"
          showBack
          onBack={() => navigation.goBack()}
        />
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  const statusMeta = getBookingStatusMeta(booking.status);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Booking Details"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.statusBadge, { backgroundColor: statusMeta.background }]}>
          <View style={[styles.statusDot, { backgroundColor: statusMeta.color }]} />
          <Text style={[styles.statusText, { color: statusMeta.color }]}>
            {statusMeta.label}
          </Text>
        </View>

        <Pressable
          onPress={() =>
            tabNavigation.navigate('HomeTab', {
              screen: 'ClubDetails',
              params: { clubId: booking.clubId },
            })
          }
        >
          <Text style={styles.clubName}>{booking.clubName}</Text>
        </Pressable>
        <Text style={styles.bookingId}>Booking ID · {booking.id.toUpperCase()}</Text>

        <View style={styles.detailsCard}>
          <DetailRow icon="calendar-outline" label="Date" value={booking.date} />
          <DetailRow icon="time-outline" label="Slot" value={booking.slot} />
          <DetailRow icon="hourglass-outline" label="Duration" value={`${booking.duration} min`} />
          {rating != null && (
            <DetailRow icon="star-outline" label="Club Rating" value={`★ ${rating}`} />
          )}
          {booking.paymentMethod ? (
            <DetailRow icon="wallet-outline" label="Payment" value={booking.paymentMethod} />
          ) : null}
          <DetailRow icon="cash-outline" label="Amount" value={`₹${booking.amount}`} bold />
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  bold,
}: {
  icon: string;
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLabelWrap}>
        <Icon name={icon} size={18} color={colors.textSecondary} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={[styles.detailValue, bold && styles.detailValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: { padding: 20, paddingBottom: 40 },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: colors.textSecondary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  clubName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.blue,
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  detailValueBold: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
});
