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
import { ErrorText, SuccessText } from '../../components/Feedback';
import { useRegisterViewModel } from '../../viewmodels/useRegisterViewModel';
import { colors, fontSize, spacing } from '../../theme/theme';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const vm = useRegisterViewModel();

  async function onSubmit() {
    const ok = await vm.submit();
    if (ok) {
      // Web ile parite: kayittan sonra giris ekranina yonlendir
      setTimeout(() => navigation.navigate('Login'), 1200);
    }
  }

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>SkyUni 🎓</Text>
          <Text style={styles.subtitle}>Kayit Ol</Text>

          <ErrorText message={vm.error} />
          <SuccessText message={vm.success} />

          <AppTextInput
            label="Kullanici adiniz"
            placeholder="anonim kullanici adi"
            autoCapitalize="none"
            value={vm.username}
            onChangeText={vm.setUsername}
          />
          <AppTextInput
            label="Universite e-postaniz (.edu.tr)"
            placeholder="ogrenci@uni.edu.tr"
            autoCapitalize="none"
            keyboardType="email-address"
            value={vm.email}
            onChangeText={vm.setEmail}
          />
          <AppTextInput
            label="Sifreniz (min 8 karakter)"
            placeholder="Sifreniz"
            secureTextEntry
            value={vm.password}
            onChangeText={vm.setPassword}
          />

          <Text style={styles.warning}>
            ⚠️ Sadece universite ogrenci e-postasi (.edu.tr) kabul edilir.
          </Text>

          <AppButton
            title="Kayit Ol"
            onPress={onSubmit}
            loading={vm.submitting}
            disabled={!vm.canSubmit}
          />

          <View style={styles.footer}>
            <Text style={styles.muted}>Zaten hesabin var mi? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Giris Yap</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
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
  warning: {
    color: colors.subtleGray,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  muted: { color: colors.textMuted, fontSize: fontSize.md },
  link: { color: colors.primary, fontSize: fontSize.md, fontWeight: '600' },
});
