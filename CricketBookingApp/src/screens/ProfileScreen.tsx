import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { fetchActivities } from '../api/activitiesApi';
import { fetchBookingHistory } from '../api/bookingsApi';
import { fetchClubs } from '../api/clubsApi';
import { fetchUserProfile } from '../api/profileApi';
import { useAuth } from '../context/AuthContext';
import { MainTabParamList } from '../navigation/types';
import { signOutGoogle } from '../services/googleAuth';
import { Activity } from '../types/activity';
import { Booking } from '../types/booking';
import { UserProfile } from '../types/user';
import { getActivityStatusMeta } from '../utils/activity';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<Booking[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [clubRatings, setClubRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    Promise.all([fetchUserProfile(), fetchBookingHistory(), fetchActivities(), fetchClubs()])
      .then(([profileData, bookingHistory, activityHistory, clubs]) => {
        setProfile(profileData);
        setHistory(bookingHistory);
        setActivities(activityHistory);
        setClubRatings(Object.fromEntries(clubs.map((club) => [club.id, club.rating])));
      })
      .finally(() => setLoading(false));
  }, []);

  const displayName = user?.displayName ?? profile?.name ?? 'Guest User';
  const email = user?.email ?? profile?.email ?? 'Not signed in';
  const photoUrl = user?.photoURL;
  const city = profile?.city;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOutGoogle();

      const rootNavigation = navigation.getParent()?.getParent();
      rootNavigation?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      Alert.alert('Logout failed', message);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleOpenActivity = (activityId: string) => {
    navigation.navigate('HomeTab', {
      screen: 'ActivityDetails',
      params: { activityId },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.userCard}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Icon name="person" size={36} color={colors.white} />
            </View>
          )}
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          {city ? <Text style={styles.userCity}>{city}</Text> : null}
        </View>

        <Text style={styles.sectionTitle}>Booking History</Text>
        {loading ? (
          <ActivityIndicator color={colors.blue} style={styles.loader} />
        ) : (
          history.map((booking) => {
            const rating = clubRatings[booking.clubId];
            return (
              <Pressable
                key={booking.id}
                style={styles.historyCard}
                onPress={() =>
                  navigation.navigate('BookingTab', {
                    screen: 'BookingDetails',
                    params: { bookingId: booking.id },
                  })
                }
              >
                <Text style={styles.historyClub}>{booking.clubName}</Text>
                <Text style={styles.historyMeta}>
                  {booking.date} · {booking.slot}
                  {rating != null ? ` · ★ ${rating}` : ''} · ₹{booking.amount}
                </Text>
              </Pressable>
            );
          })
        )}

        <Text style={styles.sectionTitle}>Activity History</Text>
        {loading ? (
          <ActivityIndicator color={colors.blue} style={styles.loader} />
        ) : (
          activities.map((activity) => {
            const statusMeta = getActivityStatusMeta(activity.status);
            const rating = clubRatings[activity.clubId];
            return (
              <Pressable
                key={activity.id}
                style={styles.historyCard}
                onPress={() => handleOpenActivity(activity.id)}
              >
                <View style={styles.activityHistoryHeader}>
                  <Text style={styles.historyClub}>{activity.name}</Text>
                  <View
                    style={[styles.statusPill, { backgroundColor: statusMeta.background }]}
                  >
                    <Text style={[styles.statusPillText, { color: statusMeta.color }]}>
                      {statusMeta.label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.historyMeta}>
                  {activity.clubName}
                  {rating != null ? ` · ★ ${rating}` : ''} · {activity.dateTime}
                </Text>
                <Text style={styles.historyMeta}>
                  {activity.playerCount}/{activity.maxPlayers} players · ₹{activity.amount}
                </Text>
              </Pressable>
            );
          })
        )}

        <Pressable
          style={[styles.logoutButton, loggingOut && styles.logoutDisabled]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Icon name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>{loggingOut ? 'Logging out...' : 'Logout'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  userName: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  userEmail: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  userCity: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  loader: { marginVertical: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyClub: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, flex: 1 },
  historyMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  activityHistoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFD6D3',
    backgroundColor: '#FFF5F4',
  },
  logoutDisabled: { opacity: 0.6 },
  logoutText: { fontSize: 16, fontWeight: '700', color: colors.danger },
});
