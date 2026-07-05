import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const TEST_TYPES = [
  { key: 'yoyo', unit: 'm' },
  { key: 'sprint30', unit: 's' },
  { key: 'cmj', unit: 'cm' },
  { key: 'beep', unit: 'level' },
] as const;

export default function PerformanceLabEntryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const addTest = useMockStore((s) => s.addTest);

  const [athleteId, setAthleteId] = useState(athletes[0]?.id ?? '');
  const [testKey, setTestKey] = useState<(typeof TEST_TYPES)[number]['key']>('yoyo');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const selectedTest = TEST_TYPES.find((tt) => tt.key === testKey)!;
  const athlete = athletes.find((a) => a.id === athleteId);

  const handleSave = () => {
    if (!athlete || !value.trim()) return;
    addTest({
      athlete_id: athlete.id,
      athlete_name: `${athlete.first_name} ${athlete.last_name}`,
      test_type: t(`features.lab.testTypes.${testKey}`),
      test_type_key: testKey,
      value: Number(value),
      unit: selectedTest.unit,
      date,
      notes: notes.trim() || undefined,
    });
    Alert.alert(t('features.lab.saved'), '', [
      { text: t('common.done'), onPress: () => router.back() },
    ]);
  };

  return (
    <FeatureScrollScreen title={t('features.lab.entryTitle')}>
      <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: 8, textAlign: textAlign('start') }]}>
        {t('features.lab.selectAthlete')}
      </Text>
      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {athletes.map((a) => {
          const active = athleteId === a.id;
          return (
            <TouchableOpacity
              key={a.id}
              onPress={() => setAthleteId(a.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                borderWidth: 1,
                borderColor: active ? theme.colors.primary : theme.colors.border,
              }}
            >
              <Text style={[type.bodySm, { color: active ? '#FFF' : theme.colors.text }]}>
                {a.first_name} {a.last_name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: 8, textAlign: textAlign('start') }]}>
        {t('features.lab.testType')}
      </Text>
      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {TEST_TYPES.map((tt) => {
          const active = testKey === tt.key;
          return (
            <TouchableOpacity
              key={tt.key}
              onPress={() => setTestKey(tt.key)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: active ? theme.colors.secondary : theme.colors.surface,
                borderWidth: 1,
                borderColor: active ? theme.colors.secondary : theme.colors.border,
              }}
            >
              <Text style={[type.bodySm, { color: active ? '#FFF' : theme.colors.text }]}>
                {t(`features.lab.testTypes.${tt.key}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Input label={`${t('features.lab.value')} (${selectedTest.unit})`} value={value} onChangeText={setValue} keyboardType="decimal-pad" />
      <Input label={t('features.lab.date')} value={date} onChangeText={setDate} containerStyle={{ marginTop: 16 }} />
      <Input
        label={t('features.lab.notes')}
        value={notes}
        onChangeText={setNotes}
        multiline
        containerStyle={{ marginTop: 16 }}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={!value.trim()}
        style={{
          marginTop: 24,
          backgroundColor: theme.colors.primary,
          borderRadius: theme.borderRadius.lg,
          minHeight: 48,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: value.trim() ? 1 : 0.5,
        }}
      >
        <Text style={[type.button, { color: '#FFF' }]}>{t('common.save')}</Text>
      </TouchableOpacity>
    </FeatureScrollScreen>
  );
}
