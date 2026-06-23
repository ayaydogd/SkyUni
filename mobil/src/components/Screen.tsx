import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/theme';

interface Props {
  children: React.ReactNode;
  padded?: boolean;
  style?: ViewStyle;
}

/** Tum ekranlar icin ortak koyu temali guvenli-alan kapsayicisi. */
export function Screen({ children, padded = true, style }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[styles.body, padded && styles.padded, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.veryDarkBg },
  body: { flex: 1, backgroundColor: colors.veryDarkBg },
  padded: { padding: spacing.md },
});
