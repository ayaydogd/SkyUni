import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, radius, spacing, fontSize } from '../theme/theme';

interface Props extends TextInputProps {
  label?: string;
}

export function AppTextInput({ label, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.subtleGray}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: {
    color: colors.textLight,
    marginBottom: spacing.xs,
    fontSize: fontSize.sm,
  },
  input: {
    backgroundColor: colors.white,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
  },
});
