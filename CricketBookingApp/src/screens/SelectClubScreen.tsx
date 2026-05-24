import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { searchClubs } from '../api/clubsApi';
import SearchBar from '../components/SearchBar';
import ScreenHeader from '../components/ScreenHeader';
import { HomeStackParamList } from '../navigation/types';
import { Club } from '../types/club';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'SelectClub'>;

const PAGE_SIZE = 4;

export default function SelectClubScreen({ navigation, route }: Props) {
  const [search, setSearch] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const selectedClubId = route.params?.selectedClubId;

  const loadClubs = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const data = await searchClubs(query);
      setClubs(data);
      setVisibleCount(PAGE_SIZE);
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

  const visibleClubs = clubs.slice(0, visibleCount);
  const hasMore = visibleCount < clubs.length;

  const handleSelect = (club: Club) => {
    navigation.navigate({
      name: 'CreateActivity',
      params: {
        selectedClub: { id: club.id, name: club.name },
      },
      merge: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Select Club"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} />

        {loading ? (
          <ActivityIndicator color={colors.blue} style={styles.loader} />
        ) : clubs.length === 0 ? (
          <Text style={styles.empty}>No clubs match your search</Text>
        ) : (
          <>
            <FlatList
              data={visibleClubs}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = item.id === selectedClubId;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={[styles.clubOption, selected && styles.clubOptionSelected]}
                  >
                    <View style={styles.clubInfo}>
                      <Text
                        style={[styles.clubName, selected && styles.clubNameSelected]}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.clubMeta}>
                        {item.location} · {item.cricketType}
                      </Text>
                    </View>
                    {selected && (
                      <Icon name="checkmark-circle" size={20} color={colors.blue} />
                    )}
                  </Pressable>
                );
              }}
            />

            {hasMore && (
              <Pressable
                style={styles.loadMore}
                onPress={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                <Text style={styles.loadMoreText}>Show more clubs</Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loader: {
    marginTop: 32,
  },
  empty: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
  clubOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  clubOptionSelected: {
    borderColor: colors.blue,
    backgroundColor: '#EEF3FF',
  },
  clubInfo: {
    flex: 1,
    marginRight: 12,
  },
  clubName: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  clubNameSelected: {
    fontWeight: '700',
    color: colors.blue,
  },
  clubMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  loadMore: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.blue,
  },
});
