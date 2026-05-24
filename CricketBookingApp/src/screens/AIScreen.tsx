import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchAiPromotions } from '../api/aiApi';
import { AIStackParamList } from '../navigation/types';
import { ClubPromotion } from '../types/ai';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<AIStackParamList, 'AIHome'>;

const PREVIEW_STEPS = ['Name', 'Players', 'Club', 'Date', 'Time', 'Notes'];

export default function AIScreen({ navigation }: Props) {
  const [promotions, setPromotions] = useState<ClubPromotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAiPromotions()
      .then(setPromotions)
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
            <Pressable
              style={styles.agentCard}
              onPress={() => navigation.navigate('AICreateActivity')}
            >
              <View style={styles.agentCardTop}>
                <View style={styles.agentIconWrap}>
                  <Icon name="sparkles" size={26} color={colors.white} />
                </View>
                <View style={styles.agentCardHeader}>
                  <Text style={styles.agentLabel}>Agentic AI</Text>
                  <Text style={styles.agentTitle}>Create Activity</Text>
                  <Text style={styles.agentDesc}>
                    Chat with AI — it asks questions, you answer, and it creates your match.
                  </Text>
                </View>
              </View>

              <View style={styles.previewChat}>
                <View style={styles.previewBubbleAssistant}>
                  <Icon name="sparkles" size={12} color={colors.blue} />
                  <Text style={styles.previewAssistantText}>
                    What should we call your activity?
                  </Text>
                </View>
                <View style={styles.previewBubbleUser}>
                  <Text style={styles.previewUserText}>Sunday Gully T20</Text>
                </View>
                <View style={styles.previewBubbleAssistant}>
                  <Icon name="sparkles" size={12} color={colors.blue} />
                  <Text style={styles.previewAssistantText}>How many players?</Text>
                </View>
              </View>

              <View style={styles.stepsRow}>
                {PREVIEW_STEPS.map((step) => (
                  <View key={step} style={styles.stepPill}>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.startRow}>
                <Text style={styles.startText}>Start AI conversation</Text>
                <Icon name="arrow-forward-circle" size={28} color={colors.white} />
              </View>
            </Pressable>

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
  agentCard: {
    backgroundColor: colors.navy,
    borderRadius: 20,
    padding: 18,
    marginBottom: 8,
    overflow: 'hidden',
  },
  agentCardTop: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  agentIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentCardHeader: { flex: 1 },
  agentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93C5FD',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  agentTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
  },
  agentDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
  },
  previewChat: {
    gap: 8,
    marginBottom: 14,
  },
  previewBubbleAssistant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    maxWidth: '88%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderBottomLeftRadius: 4,
  },
  previewAssistantText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  previewBubbleUser: {
    alignSelf: 'flex-end',
    maxWidth: '70%',
    backgroundColor: colors.blue,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderBottomRightRadius: 4,
  },
  previewUserText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '600',
  },
  stepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  stepText: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  startText: { fontSize: 15, fontWeight: '700', color: colors.white },
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
