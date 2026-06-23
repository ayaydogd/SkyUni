import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
  style?: ViewStyle;
}

export function Card({ children, onPress, active, style }: Props) {
  const content = (
    <View
      style={[
        styles.card,
        active && { borderColor: colors.primary, borderWidth: 1.5 },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.85 }}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
