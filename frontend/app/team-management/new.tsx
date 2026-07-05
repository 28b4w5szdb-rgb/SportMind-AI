import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { Card } from '@/src/components/common/Card';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useFormAction } from '@/src/hooks/useFormAction';

export default function NewTeamScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const addTeam = useMockStore((s) => s.addTeam);
  const { loading, success, run } = useFormAction();

  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [headCoach, setHeadCoach] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [nameError, setNameError] = useState<string | undefined>();

  const toggleAthlete = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(t('features.team.nameRequired'));
      return;
    }
    run(() => {
      const team = addTeam({
        name: name.trim(),
        sport: sport.trim() || 'Football',
        head_coach: headCoach.trim() || undefined,
        athlete_ids: selected,
      });
      setTimeout(() => router.replace(APP_ROUTES.teamDetail(team.id)), 600);
    });
  };

  return (
    <FeatureScrollScreen title={t('features.team.createTeam')}>
      <SuccessBanner message={t('features.team.saved')} visible={success} />

      <FormSection title={t('features.team.teamName')} subtitle={t('features.team.createSubtitle')}>
        <Input
          label={t('features.team.teamName')}
          value={name}
          onChangeText={(v) => {
            setName(v);
            setNameError(undefined);
          }}
          error={nameError}
        />
        <Input label={t('features.team.sport')} value={sport} onChangeText={setSport} containerStyle={{ marginTop: 16 }} />
        <Input label={t('features.team.headCoach')} value={headCoach} onChangeText={setHeadCoach} containerStyle={{ marginTop: 16 }} />
      </FormSection>

      <FormSection title={t('features.team.selectAthletes')} subtitle={t('features.team.selectAthletesHint')}>
        {athletes.length === 0 ? (
          <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
            {t('athletes.empty.description')}
          </Text>
        ) : (
          athletes.map((a) => {
            const checked = selected.includes(a.id);
            return (
              <TouchableAthleteRow
                key={a.id}
                checked={checked}
                name={`${a.first_name} ${a.last_name}`}
                position={a.position}
                onPress={() => toggleAthlete(a.id)}
                theme={theme}
                type={type}
                flexRow={flexRow}
              />
            );
          })
        )}
      </FormSection>

      <Button
        title={loading ? t('common.saving') : t('common.save')}
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        fullWidth
        icon="people"
      />
    </FeatureScrollScreen>
  );
}

function TouchableAthleteRow({
  checked,
  name,
  position,
  onPress,
  theme,
  type,
  flexRow,
}: {
  checked: boolean;
  name: string;
  position: string;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
  type: ReturnType<typeof useTypography>;
  flexRow: (reverse?: boolean) => 'row' | 'row-reverse';
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card
        variant="outlined"
        padding="md"
        style={{
          marginBottom: 8,
          borderRadius: theme.borderRadius.lg,
          borderColor: checked ? theme.colors.primary : theme.colors.border,
          backgroundColor: checked ? theme.colors.primary + '08' : undefined,
        }}
      >
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={22} color={checked ? theme.colors.primary : theme.colors.textTertiary} />
          <Text style={[type.body, { color: theme.colors.text, marginHorizontal: 12, flex: 1 }]}>{name}</Text>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{position}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
