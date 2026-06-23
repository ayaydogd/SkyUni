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
import { useUniversitiesViewModel } from '../../viewmodels/useUniversitiesViewModel';
import { colors, fontSize, spacing } from '../../theme/theme';
import type { UniversitiesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<UniversitiesStackParamList, 'UniversitiesList'>;

export default function UniversitiesScreen({ navigation }: Props) {
  const vm = useUniversitiesViewModel();

  function confirmDelete(id: string, name: string) {
    Alert.alert('Universiteyi sil', `"${name}" silinsin mi?`, [
      { text: 'Vazgec', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => vm.deleteUniversity(id) },
    ]);
  }

  return (
    <Screen>
      <Text style={styles.title}>🏫 Universiteler</Text>

      <View style={styles.createBox}>
        <AppTextInput
          placeholder="Universite adi (min 3 karakter)"
          value={vm.newName}
          onChangeText={vm.setNewName}
        />
        <AppTextInput
          placeholder="Website (istege bagli)"
          autoCapitalize="none"
          value={vm.newWebsite}
          onChangeText={vm.setNewWebsite}
        />
        <ErrorText message={vm.error} />
        <AppButton title="+ Universite Ekle" onPress={vm.addUniversity} loading={vm.adding} />
      </View>

      {vm.loading ? (
        <Loading label="Universiteler yukleniyor..." />
      ) : vm.loadError ? (
        <ErrorText message={vm.loadError} />
      ) : (
        <FlatList
          data={vm.universities}
          keyExtractor={(item) => item._id}
          onRefresh={vm.refetch}
          refreshing={vm.refreshing}
          ListEmptyComponent={<EmptyState message="Henuz universite yok. Ilkini ekleyin!" />}
          contentContainerStyle={vm.universities.length === 0 && styles.flexGrow}
          renderItem={({ item }) => (
            <Card
              onPress={() =>
                navigation.navigate('UniversityDetail', {
                  universityId: item._id,
                  universityName: item.name,
                })
              }
            >
              <View style={styles.row}>
                <View style={styles.flex}>
                  <Text style={styles.name}>🏫 {item.name}</Text>
                  {item.website ? <Text style={styles.web}>{item.website}</Text> : null}
                </View>
                <Pressable hitSlop={10} onPress={() => confirmDelete(item._id, item.name)}>
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
  name: { color: colors.white, fontSize: fontSize.lg, fontWeight: '600' },
  web: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 },
  delete: { color: colors.error, fontSize: fontSize.md, fontWeight: '600' },
});
