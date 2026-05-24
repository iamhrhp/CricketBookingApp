import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Club } from '../types/club';
import { formatClubTiming } from '../utils/club';
import { colors } from '../theme/colors';

interface ClubCardProps {
  club: Club;
  onPress?: () => void;
}

export default function ClubCard({ club, onPress }: ClubCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: club.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{club.name}</Text>
        <View style={styles.row}>
          <Icon name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.meta}>{formatClubTiming(club)}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.meta}>{club.location}</Text>
        </View>
        <Text style={styles.tagline}>
          {club.cricketType} · ★ {club.rating} · ₹{club.pricePerHour}/hr
        </Text>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tagline: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
