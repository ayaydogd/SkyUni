import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { ErrorText } from '../../components/Feedback';
import { useLoginViewModel } from '../../viewmodels/useLoginViewModel';
import { colors, fontSize, spacing } from '../../theme/theme';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const vm = useLoginViewModel();

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>SkyUni 🎓</Text>
          <Text style={styles.subtitle}>Giris Yap</Text>

          <ErrorText message={vm.error} />

          <AppTextInput
            label="Universite e-postaniz"
            placeholder="ornek@uni.edu.tr"
            autoCapitalize="none"
            keyboardType="email-address"
            value={vm.email}
            onChangeText={vm.setEmail}
          />
          <AppTextInput
            label="Sifreniz"
            placeholder="Sifreniz"
            secureTextEntry
            value={vm.password}
            onChangeText={vm.setPassword}
          />

          <AppButton
            title="Giris Yap"
            onPress={vm.submit}
            loading={vm.submitting}
            disabled={!vm.canSubmit}
          />

          <View style={styles.footer}>
            <Text style={styles.muted}>Hesabin yok mu? </Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Kayit Ol</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logo: {
    color: colors.white,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  muted: { color: colors.textMuted, fontSize: fontSize.md },
  link: { color: colors.primary, fontSize: fontSize.md, fontWeight: '600' },
});
