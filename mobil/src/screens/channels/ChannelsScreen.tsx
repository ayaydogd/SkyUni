import React from 'react';
import {
  Alert,
  FlatList,
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
import { useChannelsViewModel } from '../../viewmodels/useChannelsViewModel';
import { colors, fontSize, spacing } from '../../theme/theme';
import type { ChannelsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ChannelsStackParamList, 'ChannelsList'>;

export default function ChannelsScreen({ navigation }: Props) {
  const vm = useChannelsViewModel();

  function confirmDelete(id: string, name: string) {
    Alert.alert('Kanali sil', `"${name}" kanalini silmek istiyor musunuz?`, [
      { text: 'Vazgec', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => vm.deleteChannel(id) },
    ]);
  }

  return (
    <Screen>
      <Text style={styles.title}># Kanallar</Text>

      <View style={styles.createBox}>
        <AppTextInput
          placeholder="Yeni kanal adi"
          value={vm.newName}
          onChangeText={vm.setNewName}
        />
        <AppTextInput
          placeholder="Aciklama (istege bagli)"
          value={vm.newDescription}
          onChangeText={vm.setNewDescription}
        />
        <ErrorText message={vm.error} />
        <AppButton
          title="+ Kanal Olustur"
          onPress={vm.createChannel}
          loading={vm.creating}
        />
      </View>

      {vm.loading ? (
        <Loading label="Kanallar yukleniyor..." />
      ) : vm.loadError ? (
        <ErrorText message={vm.loadError} />
      ) : (
        <FlatList
          data={vm.channels}
          keyExtractor={(item) => item._id}
          onRefresh={vm.refetch}
          refreshing={vm.refreshing}
          ListEmptyComponent={<EmptyState message="Henuz kanal yok. Ilk kanali olusturun!" />}
          contentContainerStyle={vm.channels.length === 0 && styles.flexGrow}
          renderItem={({ item }) => (
            <Card
              onPress={() =>
                navigation.navigate('Messages', {
                  channelId: item._id,
                  channelName: item.name,
                })
              }
            >
              <View style={styles.row}>
                <View style={styles.flex}>
                  <Text style={styles.channelName}># {item.name}</Text>
                  {item.description ? (
                    <Text style={styles.desc}>{item.description}</Text>
                  ) : null}
                </View>
                <Pressable
                  hitSlop={10}
                  onPress={() => confirmDelete(item._id, item.name)}
                >
                  <Text style={styles.delete}>Sil</Text>
                </Pressable>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  createBox: { marginBottom: spacing.md },
  flex: { flex: 1 },
  flexGrow: { flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  channelName: { color: colors.white, fontSize: fontSize.lg, fontWeight: '600' },
  desc: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 },
  delete: { color: colors.error, fontSize: fontSize.md, fontWeight: '600' },
});
