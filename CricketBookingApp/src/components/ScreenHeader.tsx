import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
}

export default function ScreenHeader({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {showBack ? (
        <Pressable onPress={onBack} style={styles.iconButton}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
      <Text style={styles.title}>{title}</Text>
      {rightIcon ? (
        <Pressable onPress={onRightPress} style={styles.iconButton}>
          <Icon name={rightIcon} size={22} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
