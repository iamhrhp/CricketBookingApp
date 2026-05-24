import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { searchClubs } from '../api/clubsApi';
import ClubCard from '../components/ClubCard';
import SearchBar from '../components/SearchBar';
import { HomeStackParamList } from '../navigation/types';
import { Club } from '../types/club';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HOME_CLUB_LIMIT = 5;

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClubs = useCallback(async (query: string) => {
    try {
      setError(null);
      setLoading(true);
      const data = await searchClubs(query);
      setClubs(data);
    } catch {
      setError('Unable to load clubs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadClubs(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [loadClubs, search]);

  const isSearching = search.trim().length > 0;

  const nearbyClubs = useMemo(
    () => clubs.filter((club) => club.nearby).slice(0, HOME_CLUB_LIMIT),
    [clubs],
  );

  const allClubsPreview = useMemo(
    () => clubs.slice(0, HOME_CLUB_LIMIT),
    [clubs],
  );

  const showSeeAll = clubs.length > HOME_CLUB_LIMIT;

  const renderClubList = (list: Club[], keyPrefix = '') =>
    list.map((club) => (
      <ClubCard
        key={`${keyPrefix}${club.id}`}
        club={club}
        onPress={() => navigation.navigate('ClubDetails', { clubId: club.id })}
      />
    ));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.location}>Raipur, Chhattisgarh 492001</Text>
        <Text style={styles.subtitle}>Find cricket turfs around you</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SearchBar value={search} onChangeText={setSearch} />

        {loading ? (
          <ActivityIndicator color={colors.blue} style={styles.loader} />
        ) : error ? (
          <Text style={styles.empty}>{error}</Text>
        ) : isSearching ? (
          <>
            <Text style={styles.sectionTitle}>Search clubs</Text>
            {clubs.length === 0 ? (
              <Text style={styles.empty}>No clubs match your search</Text>
            ) : (
              renderClubList(clubs, 'search-')
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Nearby Clubs</Text>
            {nearbyClubs.length === 0 ? (
              <Text style={styles.empty}>No nearby clubs found</Text>
            ) : (
              renderClubList(nearbyClubs, 'nearby-')
            )}

            <Text style={styles.sectionTitle}>All Clubs</Text>
            {clubs.length === 0 ? (
              <Text style={styles.empty}>No clubs found</Text>
            ) : (
              <>
                {renderClubList(allClubsPreview, 'all-')}
                {showSeeAll && (
                  <Pressable
                    style={styles.seeAllButton}
                    onPress={() => navigation.navigate('AllClubs')}
                  >
                    <Text style={styles.seeAllText}>See All</Text>
                    <Icon name="chevron-forward" size={18} color={colors.blue} />
                  </Pressable>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('CreateActivity')}
      >
        <Icon name="add" size={28} color={colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  location: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.blue,
  },
  empty: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 32,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
