import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchActivitiesByClub, joinActivity } from '../api/activitiesApi';
import { fetchClubById } from '../api/clubsApi';
import {
  fetchDateOptions,
  fetchTimeSlots,
  fetchUnavailableSlots,
} from '../api/slotsApi';
import PrimaryButton from '../components/PrimaryButton';
import { HomeStackParamList } from '../navigation/types';
import { Activity } from '../types/activity';
import { Club } from '../types/club';
import { DateOption } from '../types/slot';
import {
  calculateClubAmount,
  formatClubTiming,
  getClubGalleryImages,
} from '../utils/club';
import { getActivityStatusMeta } from '../utils/activity';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'ClubDetails'>;
type Tab = 'Info' | 'Booking' | 'Activities';
type Duration = 60 | 90 | 120;

const TABS: Tab[] = ['Info', 'Booking', 'Activities'];
const DURATIONS: Duration[] = [60, 90, 120];

export default function ClubDetailsScreen({ navigation, route }: Props) {
  const [club, setClub] = useState<Club | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [unavailableSlots, setUnavailableSlots] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const [activeTab, setActiveTab] = useState<Tab>('Info');
  const [selectedDateId, setSelectedDateId] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<Duration>(60);
  const [selectedSlot, setSelectedSlot] = useState('8:00');
  const [isFavorite, setIsFavorite] = useState(false);

  const selectedDate = dateOptions.find((d) => d.id === selectedDateId);
  const galleryImages = useMemo(
    () => (club ? getClubGalleryImages(club) : []),
    [club],
  );
  const amount = useMemo(
    () => (club ? calculateClubAmount(selectedDuration, club.pricePerHour) : 0),
    [club, selectedDuration],
  );

  useEffect(() => {
    setLoading(true);
    const clubId = route.params.clubId;

    Promise.all([
      fetchClubById(clubId),
      fetchActivitiesByClub(clubId),
      fetchDateOptions(),
      fetchTimeSlots(),
      fetchUnavailableSlots(clubId),
    ])
      .then(([clubData, clubActivities, dates, slots, unavailable]) => {
        setClub(clubData);
        setActivities(clubActivities);
        setDateOptions(dates);
        setTimeSlots(slots);
        setUnavailableSlots(unavailable);
        if (dates[0]) {
          setSelectedDateId(dates[0].id);
        }
        if (slots[0]) {
          setSelectedSlot(slots.find((slot) => !unavailable.has(slot)) ?? slots[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [route.params.clubId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (!club) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Club not found</Text>
      </View>
    );
  }

  const dateLabel = selectedDate
    ? `${selectedDate.day}, ${String(selectedDate.date).padStart(2, '0')} ${selectedDate.month}`
    : '';

  const handleBook = () => {
    if (unavailableSlots.has(selectedSlot)) {
      return;
    }

    navigation.navigate('Checkout', {
      clubId: club.id,
      clubName: club.name,
      slot: selectedSlot,
      duration: selectedDuration,
      amount,
      date: dateLabel,
    });
  };

  const handleJoinActivity = async (activity: Activity) => {
    if (activity.playerCount >= activity.maxPlayers || joinedIds.has(activity.id)) {
      return;
    }

    try {
      setJoiningId(activity.id);
      const updated = await joinActivity(activity.id);

      if (!updated) {
        Alert.alert('Activity full', 'This activity has no spots left.');
        return;
      }

      setActivities((prev) =>
        prev.map((item) => (item.id === activity.id ? updated : item)),
      );
      setJoinedIds((prev) => new Set(prev).add(activity.id));
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroContainer}>
          <Image source={{ uri: club.image }} style={styles.heroImage} />
          <SafeAreaView edges={['top']} style={styles.heroOverlay}>
            <View style={styles.heroActions}>
              <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
                <Icon name="arrow-back" size={22} color={colors.white} />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Icon name="share-outline" size={22} color={colors.white} />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.clubHeader}>
            <View style={styles.clubHeaderText}>
              <Text style={styles.clubName}>{club.name}</Text>
              <Text style={styles.clubLocation}>{club.location}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Icon name="time-outline" size={14} color={colors.blue} />
                  <Text style={styles.metaChipText}>{formatClubTiming(club)}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>★ {club.rating}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>₹{club.pricePerHour}/hr</Text>
                </View>
              </View>
            </View>
            <Pressable onPress={() => setIsFavorite((prev) => !prev)}>
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? colors.danger : colors.textPrimary}
              />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            {TABS.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={styles.tabItem}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab}
                  </Text>
                  {isActive && <View style={styles.tabIndicator} />}
                </Pressable>
              );
            })}
          </ScrollView>

          {activeTab === 'Info' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Images</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {galleryImages.map((uri, index) => (
                  <Image
                    key={`${uri}-${index}`}
                    source={{ uri }}
                    style={styles.galleryImage}
                  />
                ))}
              </ScrollView>

              <Text style={styles.sectionTitle}>Timing</Text>
              <View style={styles.infoRow}>
                <Icon name="time-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.bodyText}>{formatClubTiming(club)}</Text>
              </View>
              <Text style={styles.infoSubtext}>{club.cricketType}</Text>

              <Text style={styles.sectionTitle}>Facilities</Text>
              <View style={styles.facilitiesWrap}>
                {club.facilities.map((facility) => (
                  <View key={facility} style={styles.facilityPill}>
                    <Icon name="checkmark-circle-outline" size={14} color={colors.blue} />
                    <Text style={styles.facilityText}>{facility}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'Booking' && (
            <View style={styles.bookingSection}>
              <Text style={styles.sectionTitle}>Select Date</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateRow}
              >
                <View style={styles.sportIconBox}>
                  <Icon name="baseball-outline" size={22} color={colors.textPrimary} />
                </View>
                {dateOptions.map((item) => {
                  const isSelected = item.id === selectedDateId;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => setSelectedDateId(item.id)}
                      style={styles.dateItem}
                    >
                      <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                        {item.day}
                      </Text>
                      <View style={[styles.dateCircle, isSelected && styles.dateCircleSelected]}>
                        <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                          {String(item.date).padStart(2, '0')}
                        </Text>
                      </View>
                      <Text style={[styles.dateMonth, isSelected && styles.dateMonthSelected]}>
                        {item.month}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Text style={styles.sectionTitle}>Select Duration</Text>
              <View style={styles.durationRow}>
                {DURATIONS.map((duration) => {
                  const isSelected = duration === selectedDuration;
                  return (
                    <Pressable
                      key={duration}
                      onPress={() => setSelectedDuration(duration)}
                      style={[styles.durationPill, isSelected && styles.durationPillSelected]}
                    >
                      <Text
                        style={[styles.durationText, isSelected && styles.durationTextSelected]}
                      >
                        {duration} min
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.sectionTitle}>Select Slot</Text>
              <View style={styles.slotsGrid}>
                {timeSlots.map((slot) => {
                  const isUnavailable = unavailableSlots.has(slot);
                  const isSelected = slot === selectedSlot;
                  return (
                    <Pressable
                      key={slot}
                      disabled={isUnavailable}
                      onPress={() => setSelectedSlot(slot)}
                      style={[
                        styles.slotPill,
                        isSelected && styles.slotPillSelected,
                        isUnavailable && styles.slotPillUnavailable,
                      ]}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          isSelected && styles.slotTextSelected,
                          isUnavailable && styles.slotTextUnavailable,
                        ]}
                      >
                        {slot}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.sectionTitle}>Amount</Text>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Estimated total</Text>
                <Text style={styles.summaryValue}>₹{amount}</Text>
              </View>
            </View>
          )}

          {activeTab === 'Activities' && (
            <View style={styles.section}>
              {activities.length === 0 ? (
                <Text style={styles.bodyText}>No activities at this club yet.</Text>
              ) : (
                activities.map((activity) => {
                  const isFull = activity.playerCount >= activity.maxPlayers;
                  const hasJoined =
                    joinedIds.has(activity.id) || activity.players.includes('Arjun Mehta');
                  const spotsLeft = activity.maxPlayers - activity.playerCount;
                  const statusMeta = getActivityStatusMeta(activity.status);

                  return (
                    <View key={activity.id} style={styles.activityCard}>
                      <Pressable
                        onPress={() =>
                          navigation.navigate('ActivityDetails', {
                            activityId: activity.id,
                          })
                        }
                      >
                        <View style={styles.activityCardHeader}>
                          <View
                            style={[
                              styles.activityStatusBadge,
                              { backgroundColor: statusMeta.background },
                            ]}
                          >
                            <Text
                              style={[styles.activityStatusText, { color: statusMeta.color }]}
                            >
                              {statusMeta.label}
                            </Text>
                          </View>
                          <Icon name="chevron-forward" size={18} color={colors.textMuted} />
                        </View>
                        <Text style={styles.activityName}>{activity.name}</Text>
                        <View style={styles.activityRow}>
                          <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
                          <Text style={styles.activityMeta}>{activity.dateTime}</Text>
                        </View>
                        <View style={styles.activityRow}>
                          <Icon name="cash-outline" size={16} color={colors.textSecondary} />
                          <Text style={styles.activityMeta}>₹{activity.amount}</Text>
                        </View>
                        <View style={styles.activityRow}>
                          <Icon name="people-outline" size={16} color={colors.textSecondary} />
                          <Text style={styles.activityMeta}>
                            {activity.playerCount}/{activity.maxPlayers} players
                            {!isFull ? ` · ${spotsLeft} spots left` : ' · Full'}
                          </Text>
                        </View>
                        <Text style={styles.activityHost}>Hosted by {activity.hostName}</Text>
                        {activity.comment ? (
                          <Text style={styles.activityComment} numberOfLines={2}>
                            {activity.comment}
                          </Text>
                        ) : null}
                      </Pressable>
                      {activity.status === 'upcoming' && (
                        <PrimaryButton
                          label={
                            hasJoined
                              ? 'Joined'
                              : isFull
                                ? 'Activity Full'
                                : joiningId === activity.id
                                  ? 'Joining...'
                                  : 'Join Activity'
                          }
                          onPress={() => handleJoinActivity(activity)}
                          disabled={isFull || hasJoined || joiningId === activity.id}
                          style={styles.joinButton}
                        />
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {activeTab === 'Booking' && (
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <PrimaryButton label="Book" onPress={handleBook} />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollContent: { paddingBottom: 120 },
  heroContainer: { height: 260, backgroundColor: colors.navy },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: { ...StyleSheet.absoluteFill, justifyContent: 'flex-start' },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  contentCard: {
    marginTop: -28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.white,
    paddingTop: 24,
    paddingHorizontal: 20,
    minHeight: 400,
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  clubHeaderText: { flex: 1, paddingRight: 12 },
  clubName: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  clubLocation: { fontSize: 16, color: colors.textSecondary, marginBottom: 10 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EEF3FF',
  },
  metaChipText: { fontSize: 12, fontWeight: '600', color: colors.blue },
  tabsRow: { gap: 24, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabItem: { paddingBottom: 12, marginRight: 8 },
  tabText: { fontSize: 16, color: colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: colors.textPrimary, fontWeight: '700' },
  tabIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.navy,
  },
  section: { paddingTop: 24, paddingBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  bodyText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoSubtext: { fontSize: 14, color: colors.textSecondary, marginTop: 6 },
  facilitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  facilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  facilityText: { fontSize: 13, color: colors.textPrimary, fontWeight: '500' },
  galleryImage: {
    width: 160,
    height: 110,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: colors.background,
  },
  bookingSection: { paddingTop: 24, gap: 8, paddingBottom: 24 },
  dateRow: { alignItems: 'center', gap: 18, paddingRight: 8 },
  sportIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateItem: { alignItems: 'center', minWidth: 54 },
  dateDay: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  dateDaySelected: { color: colors.textPrimary },
  dateCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dateCircleSelected: { backgroundColor: colors.navy },
  dateNumber: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  dateNumberSelected: { color: colors.white },
  dateMonth: { fontSize: 12, color: colors.textSecondary },
  dateMonthSelected: { color: colors.textPrimary, fontWeight: '600' },
  durationRow: { flexDirection: 'row', gap: 12 },
  durationPill: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPillSelected: { backgroundColor: colors.navy, borderColor: colors.navy },
  durationText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  durationTextSelected: { color: colors.white },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  slotPill: {
    width: '30%',
    minWidth: 96,
    flexGrow: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotPillSelected: { backgroundColor: colors.navy, borderColor: colors.navy },
  slotPillUnavailable: { backgroundColor: colors.background, borderColor: colors.background },
  slotText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  slotTextSelected: { color: colors.white },
  slotTextUnavailable: { color: colors.unavailable, textDecorationLine: 'line-through' },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  summaryLabel: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
  summaryValue: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  activityCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  activityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activityStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: { fontSize: 12, fontWeight: '700' },
  activityName: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  activityMeta: { fontSize: 14, color: colors.textSecondary },
  activityHost: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  activityComment: { fontSize: 14, color: colors.textPrimary, marginTop: 4, marginBottom: 12 },
  joinButton: { marginTop: 8, height: 44 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  errorText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: colors.textSecondary },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
