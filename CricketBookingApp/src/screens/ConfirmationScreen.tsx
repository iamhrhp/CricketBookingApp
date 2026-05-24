import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';

import { createBooking } from '../api/bookingsApi';
import { createNotification } from '../api/notificationsApi';
import PrimaryButton from '../components/PrimaryButton';
import { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Confirmation'>;

export default function ConfirmationScreen({ navigation, route }: Props) {
  const { clubId, clubName, slot, duration, amount, date, paymentMethod } = route.params;

  useEffect(() => {
    createBooking({
      clubId,
      clubName,
      slot,
      duration,
      amount,
      date,
      paymentMethod,
    });

    createNotification({
      type: 'booking',
      title: 'Booking Confirmed',
      message: `Your slot at ${clubName} on ${date} at ${slot} is confirmed.`,
    });
  }, [amount, clubId, clubName, date, duration, paymentMethod, slot]);

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Icon name="checkmark-circle" size={72} color={colors.success} />
        </View>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your cricket turf slot has been booked successfully.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLine}>{clubName}</Text>
          <Text style={styles.cardMeta}>{date} · {slot} · {duration} min</Text>
          <Text style={styles.cardMeta}>Payment: {paymentMethod}</Text>
          <Text style={styles.amount}>₹{amount}</Text>
        </View>

        <PrimaryButton label="Back to Home" onPress={goHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  iconWrap: { alignItems: 'center', marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  cardLine: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  cardMeta: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  amount: { fontSize: 24, fontWeight: '800', color: colors.navy, marginTop: 12 },
});
