import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchAiActions, fetchAiPromotions } from '../api/aiApi';
import { AiAction, ClubPromotion } from '../types/ai';
import { colors } from '../theme/colors';

export default function AIScreen() {
  const [actions, setActions] = useState<AiAction[]>([]);
  const [promotions, setPromotions] = useState<ClubPromotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAiActions(), fetchAiPromotions()])
      .then(([actionData, promotionData]) => {
        setActions(actionData);
        setPromotions(promotionData);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        <Text style={styles.subtitle}>Agentic AI booking help</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.blue} style={styles.loader} />
        ) : (
          <>
            {actions.map((action) => (
              <View key={action.id} style={styles.card}>
                <View style={styles.iconWrap}>
                  <Icon name={action.icon} size={24} color={colors.blue} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{action.title}</Text>
                  <Text style={styles.cardDesc}>{action.description}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textMuted} />
              </View>
            ))}

            <Text style={styles.promoSectionTitle}>Promoted Clubs</Text>
            {promotions.map((promo) => (
              <View key={promo.id} style={styles.promoCard}>
                <View style={styles.promoBadge}>
                  <Text style={styles.promoBadgeText}>Ad</Text>
                </View>
                <Image source={{ uri: promo.image }} style={styles.promoImage} />
                <View style={styles.promoBody}>
                  <Text style={styles.promoName}>{promo.name}</Text>
                  <View style={styles.promoRow}>
                    <Icon name="location-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.promoMeta}>{promo.location}</Text>
                  </View>
                  <Text style={styles.promoTagline}>{promo.tagline}</Text>
                  <Text style={styles.promoPricing}>
                    {promo.cricketType} · ★ {promo.rating} · ₹{promo.pricePerHour}/hr
                  </Text>
                </View>
              </View>
            ))}
          </>
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
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  promoSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  promoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  promoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    backgroundColor: colors.blue,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  promoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  promoImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.background,
  },
  promoBody: {
    padding: 16,
    gap: 6,
  },
  promoName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promoMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  promoTagline: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginTop: 2,
  },
  promoPricing: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
