import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { ErrorText } from '../../components/Feedback';
import { useUniversityDetailViewModel } from '../../viewmodels/useUniversityDetailViewModel';
import { colors, fontSize, spacing } from '../../theme/theme';
import type { UniversitiesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<UniversitiesStackParamList, 'UniversityDetail'>;

export default function UniversityDetailScreen({ route, navigation }: Props) {
  const { universityId, universityName } = route.params;
  const vm = useUniversityDetailViewModel(universityId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: universityName });
  }, [navigation, universityName]);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ErrorText message={vm.error || vm.loadError} />

        {/* HOCALAR */}
        <Text style={styles.section}>👨‍🏫 Hocalar</Text>
        <AppTextInput placeholder="Hoca adi" value={vm.profName} onChangeText={vm.setProfName} />
        <AppTextInput placeholder="Bolum" value={vm.profDept} onChangeText={vm.setProfDept} />
        <AppButton title="+ Hoca Ekle" onPress={vm.addProfessor} loading={vm.addingProfessor} />

        <View style={styles.listBlock}>
          {vm.professors.length === 0 ? (
            <Text style={styles.muted}>Henuz hoca eklenmemis.</Text>
          ) : (
            vm.professors.map((h) => (
              <Card key={h._id}>
                <Text style={styles.itemTitle}>{h.name}</Text>
                {h.department ? <Text style={styles.muted}>{h.department}</Text> : null}
              </Card>
            ))
          )}
        </View>

        {/* DERSLER */}
        <Text style={styles.section}>📚 Dersler</Text>
        <AppTextInput placeholder="Ders kodu" value={vm.courseCode} onChangeText={vm.setCourseCode} />
        <AppTextInput placeholder="Ders adi" value={vm.courseName} onChangeText={vm.setCourseName} />
        <AppButton title="+ Ders Ekle" onPress={vm.addCourse} loading={vm.addingCourse} />

        <View style={styles.listBlock}>
          {vm.courses.length === 0 ? (
            <Text style={styles.muted}>Henuz ders eklenmemis.</Text>
          ) : (
            vm.courses.map((d) => (
              <Card key={d._id}>
                <Text style={styles.itemTitle}>
                  {d.code} - {d.name}
                </Text>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md },
  section: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  listBlock: { marginTop: spacing.sm, marginBottom: spacing.md },
  itemTitle: { color: colors.textLight, fontSize: fontSize.md, fontWeight: '600' },
  muted: { color: colors.textMuted, fontSize: fontSize.sm },
});
