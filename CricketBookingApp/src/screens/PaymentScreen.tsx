import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { fetchPaymentMethods } from '../api/aiApi';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { HomeStackParamList } from '../navigation/types';
import { PaymentMethod } from '../types/ai';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Payment'>;

export default function PaymentScreen({ navigation, route }: Props) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods()
      .then((data) => {
        setMethods(data);
        if (data[0]) {
          setSelected(data[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Payment" showBack onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Text style={styles.heading}>Select payment method</Text>
        <Text style={styles.amount}>Total: ₹{route.params.amount}</Text>

        {loading ? (
          <ActivityIndicator color={colors.blue} />
        ) : (
          methods.map((method) => {
            const isSelected = method.id === selected;
            return (
              <Pressable
                key={method.id}
                onPress={() => setSelected(method.id)}
                style={[styles.methodCard, isSelected && styles.methodCardSelected]}
              >
                <Icon
                  name={method.icon}
                  size={24}
                  color={isSelected ? colors.blue : colors.textSecondary}
                />
                <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
                  {method.label}
                </Text>
                {isSelected && <Icon name="checkmark-circle" size={22} color={colors.blue} />}
              </Pressable>
            );
          })
        )}

        <PrimaryButton
          label="Pay & Confirm"
          disabled={!selected}
          onPress={() =>
            navigation.navigate('Confirmation', {
              ...route.params,
              paymentMethod: selected,
            })
          }
        />
      </View>
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
    marginBottom: 8,
  },
  amount: { fontSize: 16, color: colors.textSecondary, marginBottom: 24 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: 12,
  },
  methodCardSelected: {
    borderColor: colors.blue,
    backgroundColor: '#EEF3FF',
  },
  methodLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  methodLabelSelected: { color: colors.blue },
});
