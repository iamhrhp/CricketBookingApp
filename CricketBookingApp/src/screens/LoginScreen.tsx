import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../navigation/types';
import { signInWithGoogle } from '../services/googleAuth';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1531416513074-47feab73e6a6?auto=format&fit=crop&w=1200&q=80';

const FEATURES = [
  { icon: 'location-outline' as const, label: 'Discover turfs near you' },
  { icon: 'calendar-outline' as const, label: 'Book slots in seconds' },
  { icon: 'sparkles-outline' as const, label: 'Create matches with AI' },
];

export default function LoginScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  const goToMain = () => {
    navigation.replace('Main', {
      screen: 'HomeTab',
      params: { screen: 'Home' },
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      goToMain();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Google sign-in failed';
      if (message !== 'Sign in cancelled') {
        Alert.alert('Sign in failed', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} />
      <View style={styles.heroOverlay} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.heroContent}>
          <View style={styles.brandBadge}>
            <Icon name="baseball-outline" size={28} color={colors.white} />
          </View>
          <Text style={styles.appName}>Cricket Turf Booking</Text>
          <Text style={styles.heroTagline}>Discover clubs · Book slots · Play more</Text>

          <View style={styles.features}>
            {FEATURES.map((feature) => (
              <View key={feature.label} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Icon name={feature.icon} size={18} color={colors.white} />
                </View>
                <Text style={styles.featureText}>{feature.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSheet}>
          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to book turfs, join activities, and manage your cricket schedule.
          </Text>

          <Pressable
            disabled={loading}
            onPress={handleGoogleSignIn}
            style={[styles.googleButton, loading && styles.googleButtonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <>
                <View style={styles.googleIconWrap}>
                  <Icon name="logo-google" size={20} color="#EA4335" />
                </View>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.footerNote}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(27, 40, 56, 0.82)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    justifyContent: 'center',
  },
  brandBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroTagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 22,
    marginBottom: 32,
  },
  features: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  footerNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 16,
    paddingHorizontal: 8,
  },
});
