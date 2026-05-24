import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Checkout'>;

export default function CheckoutScreen({ navigation, route }: Props) {
  const { clubName, slot, duration, amount, date } = route.params;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Checkout" showBack onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Text style={styles.heading}>Booking Summary</Text>

        <View style={styles.card}>
          <Row label="Club" value={clubName} />
          <Row label="Date" value={date} />
          <Row label="Slot" value={slot} />
          <Row label="Duration" value={`${duration} min`} />
          <View style={styles.divider} />
          <Row label="Amount" value={`₹${amount}`} bold />
        </View>

        <PrimaryButton
          label="Proceed to Payment"
          onPress={() => navigation.navigate('Payment', route.params)}
        />
      </View>
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 20 },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowLabel: { fontSize: 15, color: colors.textSecondary },
  rowValue: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  rowValueBold: { fontSize: 18, fontWeight: '800', color: colors.navy },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
});
