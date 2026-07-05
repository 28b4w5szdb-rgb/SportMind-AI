import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Card } from '@/src/components/common/Card';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function NewTeamScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const addTeam = useMockStore((s) => s.addTeam);

  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [headCoach, setHeadCoach] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAthlete = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    addTeam({
      name: name.trim(),
      sport: sport.trim() || 'Football',
      head_coach: headCoach.trim() || undefined,
      athlete_ids: selected,
    });
    Alert.alert(t('features.team.saved'), '', [
      { text: t('common.done'), onPress: () => router.replace(APP_ROUTES.teamManagement) },
    ]);
  };

  return (
    <FeatureScrollScreen title={t('features.team.createTeam')}>
      <Input label={t('features.team.teamName')} value={name} onChangeText={setName} />
      <Input label={t('features.team.sport')} value={sport} onChangeText={setSport} containerStyle={{ marginTop: 16 }} />
      <Input label={t('features.team.headCoach')} value={headCoach} onChangeText={setHeadCoach} containerStyle={{ marginTop: 16 }} />

      <Text style={[type.label, { color: theme.colors.textSecondary, marginTop: 24, marginBottom: 12, textAlign: textAlign('start') }]}>
        {t('features.team.selectAthletes')}
      </Text>
      {athletes.map((a) => {
        const checked = selected.includes(a.id);
        return (
          <TouchableOpacity key={a.id} onPress={() => toggleAthlete(a.id)} activeOpacity={0.8}>
            <Card variant="outlined" padding="md" style={{ marginBottom: 8, borderRadius: theme.borderRadius.lg, borderColor: checked ? theme.colors.primary : theme.colors.border }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={22} color={checked ? theme.colors.primary : theme.colors.textTertiary} />
                <Text style={[type.body, { color: theme.colors.text, marginHorizontal: 12, flex: 1 }]}>
                  {a.first_name} {a.last_name}
                </Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{a.position}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        onPress={handleSave}
        disabled={!name.trim()}
        style={{
          marginTop: 24,
          backgroundColor: theme.colors.primary,
          borderRadius: theme.borderRadius.lg,
          minHeight: 48,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: name.trim() ? 1 : 0.5,
        }}
      >
        <Text style={[type.button, { color: '#FFF' }]}>{t('common.save')}</Text>
      </TouchableOpacity>
    </FeatureScrollScreen>
  );
}
