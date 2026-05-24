import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { searchClubs } from '../api/clubsApi';
import ClubCard from '../components/ClubCard';
import SearchBar from '../components/SearchBar';
import ScreenHeader from '../components/ScreenHeader';
import { HomeStackParamList } from '../navigation/types';
import { Club } from '../types/club';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'AllClubs'>;

export default function AllClubsScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClubs = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const data = await searchClubs(query);
      setClubs(data);
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

  return (
    <View style={styles.container}>
      <ScreenHeader title="All Clubs" showBack onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} />

        {loading ? (
          <ActivityIndicator color={colors.blue} style={styles.loader} />
        ) : clubs.length === 0 ? (
          <Text style={styles.empty}>No clubs match your search</Text>
        ) : (
          <FlatList
            data={clubs}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ClubCard
                club={item}
                onPress={() => navigation.navigate('ClubDetails', { clubId: item.id })}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
});
