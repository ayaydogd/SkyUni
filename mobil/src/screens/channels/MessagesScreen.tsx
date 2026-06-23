import React, { useLayoutEffect } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { EmptyState, ErrorText, Loading } from '../../components/Feedback';
import {
  useMessagesViewModel,
  messageAuthorName,
} from '../../viewmodels/useMessagesViewModel';
import { colors, fontSize, radius, spacing } from '../../theme/theme';
import type { ChannelsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ChannelsStackParamList, 'Messages'>;

export default function MessagesScreen({ route, navigation }: Props) {
  const { channelId, channelName } = route.params;
  const vm = useMessagesViewModel(channelId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: `# ${channelName}` });
  }, [navigation, channelName]);

  function confirmDelete(id: string) {
    Alert.alert('Mesaji sil', 'Bu mesaji silmek istiyor musunuz?', [
      { text: 'Vazgec', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => vm.deleteMessage(id) },
    ]);
  }

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {vm.loading ? (
          <Loading label="Mesajlar yukleniyor..." />
        ) : vm.loadError ? (
          <View style={styles.padded}>
            <ErrorText message={vm.loadError} />
          </View>
        ) : (
          <FlatList
            data={vm.messages}
            keyExtractor={(item) => item._id}
            onRefresh={vm.refetch}
            refreshing={vm.refreshing}
            contentContainerStyle={[
              styles.list,
              vm.messages.length === 0 && styles.flexGrow,
            ]}
            ListEmptyComponent={
              <EmptyState message="Henuz mesaj yok. Ilk mesaji siz yazin!" />
            }
            renderItem={({ item }) => {
              const own = vm.isOwn(item);
              const editing = vm.editingId === item._id;
              return (
                <Card style={own ? styles.ownCard : undefined}>
                  <Text style={styles.author}>
                    {messageAuthorName(item)} {own ? '(siz)' : ''}
                  </Text>

                  {editing ? (
                    <>
                      <AppTextInput
                        value={vm.editingText}
                        onChangeText={vm.setEditingText}
                        multiline
                      />
                      <View style={styles.editRow}>
                        <AppButton
                          title="Kaydet"
                          onPress={vm.saveEdit}
                          loading={vm.savingEdit}
                          style={styles.flex}
                        />
                        <AppButton
                          title="Iptal"
                          variant="secondary"
                          onPress={vm.cancelEdit}
                          style={styles.flex}
                        />
                      </View>
                    </>
                  ) : (
                    <Text style={styles.text}>{item.text}</Text>
                  )}

                  {own && !editing ? (
                    <View style={styles.actions}>
                      <Pressable hitSlop={8} onPress={() => vm.startEdit(item)}>
                        <Text style={styles.editAction}>Duzenle</Text>
                      </Pressable>
                      <Pressable hitSlop={8} onPress={() => confirmDelete(item._id)}>
                        <Text style={styles.deleteAction}>Sil</Text>
                      </Pressable>
                    </View>
                  ) : null}
                </Card>
              );
            }}
          />
        )}

        <View style={styles.composer}>
          <ErrorText message={vm.error} />
          <View style={styles.composerRow}>
            <View style={styles.flex}>
              <AppTextInput
                placeholder="Mesajinizi yazin..."
                value={vm.draft}
                onChangeText={vm.setDraft}
                style={styles.composerInput}
              />
            </View>
            <AppButton
              title="Gonder"
              onPress={vm.send}
              loading={vm.sending}
              style={styles.sendBtn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexGrow: { flexGrow: 1 },
  padded: { padding: spacing.md },
  list: { padding: spacing.md },
  ownCard: { borderColor: colors.primary },
  author: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: fontSize.sm,
    marginBottom: 2,
  },
  text: { color: colors.textLight, fontSize: fontSize.md },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  editAction: { color: colors.primary, fontWeight: '600', fontSize: fontSize.sm },
  deleteAction: { color: colors.error, fontWeight: '600', fontSize: fontSize.sm },
  editRow: { flexDirection: 'row', gap: spacing.sm },
  composer: {
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.darkBg,
  },
  composerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  composerInput: { marginBottom: 0 },
  sendBtn: { borderRadius: radius.md },
});
