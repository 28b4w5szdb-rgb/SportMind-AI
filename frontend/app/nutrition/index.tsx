import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { AthleteSelectorChips } from '@/src/features/daily-checkin';
import { NutritionCenterPanel, useNutritionSnapshot } from '@/src/features/nutrition';
import { useMockStore } from '@/src/data/mock/store';
import { useAthleteById } from '@/src/data/mock/hooks';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';

export default function NutritionCenterScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const athletes = useMockStore((s) => s.athletes);

  const initialAthleteId = useMemo(() => athleteIdParam ?? athletes[0]?.id ?? '', [athleteIdParam, athletes]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);
  const athlete = useAthleteById(selectedAthleteId || undefined);
  const snapshot = useNutritionSnapshot(athlete);

  if (athletes.length === 0) {
    return (
      <FeatureScrollScreen title={t('nutrition.title')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen
      title={t('nutrition.title')}
      subtitle={t('nutrition.centerSubtitle')}
      rightAction={
        selectedAthleteId
          ? { icon: 'create-outline', onPress: () => router.push(APP_ROUTES.nutritionLog(selectedAthleteId)) }
          : undefined
      }
    >
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>{t('dailyCheckIn.selectAthlete')}</Text>
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>
      {snapshot ? (
        <NutritionCenterPanel snapshot={snapshot} />
      ) : (
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('nutrition.empty')}</Text>
      )}
    </FeatureScrollScreen>
  );
}
