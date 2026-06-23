import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, fontSize } from '../theme/theme';

export function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
}

export function SuccessText({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.success}>{message}</Text>;
}

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
      {label ? <Text style={styles.muted}>{label}</Text> : null}
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.error,
    marginBottom: spacing.sm,
    fontSize: fontSize.sm,
  },
  success: {
    color: colors.success,
    marginBottom: spacing.sm,
    fontSize: fontSize.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  muted: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
});
