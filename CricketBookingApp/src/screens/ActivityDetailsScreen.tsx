import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { fetchActivityById, joinActivity } from '../api/activitiesApi';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { HomeStackParamList } from '../navigation/types';
import { Activity } from '../types/activity';
import { getActivityStatusMeta } from '../utils/activity';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'ActivityDetails'>;

export default function ActivityDetailsScreen({ navigation, route }: Props) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const loadActivity = useCallback(async () => {
    setLoading(true);
    const data = await fetchActivityById(route.params.activityId);
    setActivity(data);
    setHasJoined(data?.players.includes('Arjun Mehta') ?? false);
    setLoading(false);
  }, [route.params.activityId]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const handleJoin = async () => {
    if (!activity) {
      return;
    }

    try {
      setJoining(true);
      const updated = await joinActivity(activity.id);

      if (!updated) {
        Alert.alert('Unable to join', 'This activity is full or no longer open.');
        return;
      }

      setActivity(updated);
      setHasJoined(true);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Activity Details"
          showBack
          onBack={() => navigation.goBack()}
        />
        <Text style={styles.errorText}>Activity not found</Text>
      </View>
    );
  }

  const statusMeta = getActivityStatusMeta(activity.status);
  const isFull = activity.playerCount >= activity.maxPlayers;
  const canJoin = activity.status === 'upcoming' && !isFull && !hasJoined;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Activity Details"
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

        <Text style={styles.title}>{activity.name}</Text>
        <Pressable
          onPress={() =>
            navigation.navigate('ClubDetails', { clubId: activity.clubId })
          }
        >
          <Text style={styles.clubName}>{activity.clubName}</Text>
        </Pressable>

        <View style={styles.detailsCard}>
          <DetailRow icon="calendar-outline" label="Date & Time" value={activity.dateTime} />
          <DetailRow icon="time-outline" label="Slot" value={activity.slot} />
          <DetailRow icon="hourglass-outline" label="Duration" value={`${activity.duration} min`} />
          <DetailRow icon="cash-outline" label="Amount" value={`₹${activity.amount}`} bold />
          <DetailRow icon="person-outline" label="Host" value={activity.hostName} />
        </View>

        {activity.comment ? (
          <View style={styles.commentBox}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.commentText}>{activity.comment}</Text>
          </View>
        ) : null}

        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>
            Players ({activity.playerCount}/{activity.maxPlayers})
          </Text>
          {activity.players.map((player) => (
            <View key={player} style={styles.playerRow}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerInitial}>{player.charAt(0)}</Text>
              </View>
              <Text style={styles.playerName}>{player}</Text>
              {player === activity.hostName && (
                <View style={styles.hostBadge}>
                  <Text style={styles.hostBadgeText}>Host</Text>
                </View>
              )}
              {player === 'Arjun Mehta' && player !== activity.hostName && (
                <View style={styles.youBadge}>
                  <Text style={styles.youBadgeText}>You</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {canJoin && (
          <PrimaryButton
            label={joining ? 'Joining...' : 'Join Activity'}
            onPress={handleJoin}
            disabled={joining}
            style={styles.joinButton}
          />
        )}

        {hasJoined && activity.status === 'upcoming' && (
          <View style={styles.joinedBanner}>
            <Icon name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.joinedText}>You have joined this activity</Text>
          </View>
        )}
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
  statusText: { fontSize: 13, fontWeight: '700' },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.blue,
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
  commentBox: {
    marginTop: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  commentText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  playersSection: {
    marginTop: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitial: { fontSize: 14, fontWeight: '700', color: colors.blue },
  playerName: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  hostBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#EEF3FF',
  },
  hostBadgeText: { fontSize: 11, fontWeight: '700', color: colors.blue },
  youBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#E8FAEF',
  },
  youBadgeText: { fontSize: 11, fontWeight: '700', color: colors.success },
  joinButton: { marginTop: 24 },
  joinedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#E8FAEF',
  },
  joinedText: { fontSize: 14, fontWeight: '600', color: colors.success },
});
