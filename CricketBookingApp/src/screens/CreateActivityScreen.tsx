import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { createActivity } from '../api/activitiesApi';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { HomeStackParamList, SelectedClub } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'CreateActivity'>;

export default function CreateActivityScreen({ navigation, route }: Props) {
  const [activityName, setActivityName] = useState('');
  const [playerSize, setPlayerSize] = useState('');
  const [selectedClub, setSelectedClub] = useState<SelectedClub | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (route.params?.selectedClub) {
      setSelectedClub(route.params.selectedClub);
    }
  }, [route.params?.selectedClub]);

  const handleCreate = async () => {
    if (!activityName.trim() || !playerSize.trim() || !selectedClub) {
      return;
    }

    try {
      setSubmitting(true);
      await createActivity({
        clubId: selectedClub.id,
        clubName: selectedClub.name,
        name: activityName.trim(),
        playerSize: Number(playerSize),
        comment: comment.trim() || undefined,
      });
      navigation.goBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Create Activity"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Activity Name</Text>
        <TextInput
          value={activityName}
          onChangeText={setActivityName}
          placeholder="Sunday Gully T20"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Player Size</Text>
        <TextInput
          value={playerSize}
          onChangeText={setPlayerSize}
          placeholder="11"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Select Club</Text>
        <Pressable
          style={styles.clubSelector}
          onPress={() =>
            navigation.navigate('SelectClub', {
              selectedClubId: selectedClub?.id,
            })
          }
        >
          <Icon name="search-outline" size={20} color={colors.textSecondary} />
          <Text
            style={[
              styles.clubSelectorText,
              !selectedClub && styles.clubSelectorPlaceholder,
            ]}
          >
            {selectedClub?.name ?? 'Search and select club'}
          </Text>
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        <Text style={styles.label}>Comment</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Add notes for players..."
          placeholderTextColor={colors.textMuted}
          multiline
          style={[styles.input, styles.textArea]}
        />

        <PrimaryButton
          label={submitting ? 'Creating...' : 'Create Activity'}
          onPress={handleCreate}
          disabled={submitting}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  clubSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.background,
  },
  clubSelectorText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  clubSelectorPlaceholder: {
    color: colors.textMuted,
  },
});
