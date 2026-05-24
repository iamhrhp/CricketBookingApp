import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { createActivity } from '../api/activitiesApi';
import ScreenHeader from '../components/ScreenHeader';
import { AIStackParamList, MainTabParamList } from '../navigation/types';
import {
  AiChatMessage,
  getInitialAssistantMessages,
  processActivityAnswer,
} from '../services/aiActivityAssistant';
import {
  ActivityDraft,
  DRAFT_STEP_LABELS,
  FIELD_ORDER,
  getFilledStepCount,
  isDraftComplete,
  isFieldFilled,
} from '../utils/activityDraft';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<AIStackParamList, 'AICreateActivity'>;

type NavigationProp = CompositeNavigationProp<
  NativeStackScreenProps<AIStackParamList, 'AICreateActivity'>['navigation'],
  BottomTabNavigationProp<MainTabParamList>
>;

const TOTAL_STEPS = 6;

export default function AICreateActivityScreen({ navigation }: Props) {
  const tabNavigation = navigation as NavigationProp;
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<AiChatMessage>>(null);

  const [messages, setMessages] = useState<AiChatMessage[]>(getInitialAssistantMessages());
  const [draft, setDraft] = useState<ActivityDraft>({});
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [creating, setCreating] = useState(false);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || thinking || creating) return;

    setInput('');
    setThinking(true);

    try {
      const result = await processActivityAnswer(text, draft, awaitingConfirmation);
      setMessages((prev) => [...prev, ...result.messages]);
      setDraft(result.draft);
      setAwaitingConfirmation(result.awaitingConfirmation);
      scrollToEnd();

      if (result.isComplete && result.awaitingConfirmation === false && isDraftComplete(result.draft)) {
        await finalizeActivity(result.draft);
      }
    } finally {
      setThinking(false);
    }
  };

  const finalizeActivity = async (finalDraft: ActivityDraft) => {
    if (!finalDraft.clubId || !finalDraft.activityName || !finalDraft.playerSize) return;

    setCreating(true);
    try {
      const activity = await createActivity({
        clubId: finalDraft.clubId,
        clubName: finalDraft.clubName,
        name: finalDraft.activityName,
        playerSize: finalDraft.playerSize,
        comment: finalDraft.comment?.trim() || undefined,
        date: finalDraft.date,
        time: finalDraft.time,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `m-done-${Date.now()}`,
          role: 'assistant',
          text: `Done! "${activity.name}" is live at ${activity.clubName}.`,
        },
      ]);
      scrollToEnd();

      tabNavigation.navigate('HomeTab', {
        screen: 'ActivityDetails',
        params: { activityId: activity.id },
      });
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmCreate = async () => {
    if (!isDraftComplete(draft) || creating) return;
    setMessages((prev) => [
      ...prev,
      { id: `m-u-${Date.now()}`, role: 'user', text: 'Yes, create it' },
      { id: `m-a-${Date.now()}`, role: 'assistant', text: 'Perfect. Creating your activity now...' },
    ]);
    await finalizeActivity(draft);
  };

  const filledSteps = getFilledStepCount(draft);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="AI Activity Agent"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.agentBar}>
        <View style={styles.agentAvatar}>
          <Icon name="sparkles" size={18} color={colors.white} />
        </View>
        <View style={styles.agentInfo}>
          <Text style={styles.agentTitle}>Agentic assistant</Text>
          <Text style={styles.agentSubtitle}>
            {filledSteps}/{TOTAL_STEPS} details collected
          </Text>
        </View>
        {thinking && <ActivityIndicator size="small" color={colors.blue} />}
      </View>

      <View style={styles.stepsRow}>
        {FIELD_ORDER.map((field) => {
          const done = isFieldFilled(draft, field);
          return (
            <View key={field} style={[styles.stepPill, done && styles.stepPillDone]}>
              <Text style={[styles.stepText, done && styles.stepTextDone]}>
                {DRAFT_STEP_LABELS[field]}
              </Text>
            </View>
          );
        })}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToEnd}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageRow,
                item.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant,
              ]}
            >
              {item.role === 'assistant' && (
                <View style={styles.bubbleAvatar}>
                  <Icon name="sparkles" size={14} color={colors.blue} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  item.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    item.role === 'user' ? styles.userBubbleText : styles.assistantBubbleText,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            </View>
          )}
        />

        {awaitingConfirmation && isDraftComplete(draft) && (
          <Pressable style={styles.confirmButton} onPress={handleConfirmCreate} disabled={creating}>
            <Icon name="checkmark-circle" size={20} color={colors.white} />
            <Text style={styles.confirmButtonText}>
              {creating ? 'Creating...' : 'Confirm & Create Activity'}
            </Text>
          </Pressable>
        )}

        <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your answer..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            editable={!thinking && !creating}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Pressable
            style={[styles.sendButton, (!input.trim() || thinking) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || thinking || creating}
          >
            <Icon name="send" size={18} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  agentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.navy,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentInfo: { flex: 1 },
  agentTitle: { fontSize: 15, fontWeight: '700', color: colors.white },
  agentSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  stepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepPillDone: {
    backgroundColor: '#EEF3FF',
    borderColor: colors.blue,
  },
  stepText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  stepTextDone: { color: colors.blue },
  messageList: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowAssistant: { justifyContent: 'flex-start' },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
  },
  assistantBubble: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.blue,
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  assistantBubbleText: { color: colors.textPrimary },
  userBubbleText: { color: colors.white },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.success,
  },
  confirmButtonText: { fontSize: 15, fontWeight: '700', color: colors.white },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.45 },
});
