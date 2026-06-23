import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { ErrorText, Loading, SuccessText } from '../../components/Feedback';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';
import { useAuth } from '../../viewmodels/AuthContext';
import { colors, fontSize, radius, spacing } from '../../theme/theme';

export default function ProfileScreen() {
  const vm = useProfileViewModel();
  const { logout } = useAuth();

  function confirmDelete() {
    Alert.alert(
      'Hesabi sil',
      'Hesabiniz ve tum verileriniz kalici olarak silinecek. Emin misiniz?',
      [
        { text: 'Vazgec', style: 'cancel' },
        { text: 'Hesabi Sil', style: 'destructive', onPress: () => vm.deleteAccount() },
      ]
    );
  }

  if (vm.loading) return <Loading label="Profil yukleniyor..." />;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>👤 Profilim</Text>
        <ErrorText message={vm.loadError} />

        {vm.profile ? (
          <Card>
            <View style={styles.avatarRow}>
              {vm.profile.avatarUrl ? (
                <Image source={{ uri: vm.profile.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>
                    {vm.profile.username?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.flex}>
                <Text style={styles.username}>{vm.profile.username}</Text>
                <Text style={styles.muted}>{vm.profile.email}</Text>
              </View>
            </View>
            <Text style={styles.fieldLabel}>Universite</Text>
            <Text style={styles.fieldValue}>{vm.profile.universite || 'Belirtilmemis'}</Text>
            <Text style={styles.fieldLabel}>Hakkinda</Text>
            <Text style={styles.fieldValue}>{vm.profile.kisaOzgecmis || 'Belirtilmemis'}</Text>
            {vm.profile.basarimlar && vm.profile.basarimlar.length > 0 ? (
              <>
                <Text style={styles.fieldLabel}>Basarimlar</Text>
                <Text style={styles.fieldValue}>{vm.profile.basarimlar.join(', ')}</Text>
              </>
            ) : null}
          </Card>
        ) : null}

        <Text style={styles.section}>Profili Guncelle</Text>
        <SuccessText message={vm.feedback.ok} />
        <ErrorText message={vm.feedback.err} />

        <AppTextInput
          label="Hakkinda"
          placeholder="Kendinizden bahsedin..."
          value={vm.kisaOzgecmis}
          onChangeText={vm.setKisaOzgecmis}
          multiline
          style={styles.textArea}
        />
        <AppTextInput
          label="Avatar URL"
          placeholder="https://..."
          autoCapitalize="none"
          value={vm.avatarUrl}
          onChangeText={vm.setAvatarUrl}
        />
        <AppTextInput
          label="Yeni Sifre (degistirmek istemiyorsaniz bos birakin)"
          placeholder="min 8 karakter"
          secureTextEntry
          value={vm.password}
          onChangeText={vm.setPassword}
        />
        <AppButton title="Guncelle" onPress={vm.save} loading={vm.saving} />

        <View style={styles.divider} />

        <AppButton title="Cikis Yap" variant="secondary" onPress={logout} />
        <View style={{ height: spacing.sm }} />
        <AppButton
          title="Hesabi Sil"
          variant="danger"
          onPress={confirmDelete}
          loading={vm.deleting}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  title: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  avatar: { width: 64, height: 64, borderRadius: radius.pill },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: colors.white, fontSize: fontSize.xl, fontWeight: '700' },
  flex: { flex: 1 },
  username: { color: colors.white, fontSize: fontSize.lg, fontWeight: '700' },
  muted: { color: colors.textMuted, fontSize: fontSize.sm },
  fieldLabel: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.sm },
  fieldValue: { color: colors.textLight, fontSize: fontSize.md },
  section: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
});
