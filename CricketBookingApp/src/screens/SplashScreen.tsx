import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1531416513074-47feab73e6a6?auto=format&fit=crop&w=1200&q=80';

export default function SplashScreen({ navigation }: Props) {
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (initializing) {
      return;
    }

    const timer = setTimeout(() => {
      if (user) {
        navigation.replace('Main', {
          screen: 'HomeTab',
          params: { screen: 'Home' },
        });
      } else {
        navigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [initializing, navigation, user]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: HERO_IMAGE }} style={styles.logo} />
      <Text style={styles.title}>Cricket Turf Booking</Text>
      <Text style={styles.subtitle}>Discover clubs · Book slots · Play more</Text>
      {initializing && (
        <ActivityIndicator color={colors.white} style={styles.loader} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
    paddingHorizontal: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 28,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  loader: {
    marginTop: 24,
  },
});
