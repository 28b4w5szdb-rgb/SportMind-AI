import React from 'react';
import { Alert, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import {
  AthleteForm,
  athleteToFormValues,
  formValuesToAthleteInput,
  type AthleteFormValues,
} from '@/src/components/features';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';

export default function EditAthleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const athlete = useMockStore((s) => s.getAthlete(id ?? ''));
  const updateAthlete = useMockStore((s) => s.updateAthlete);

  if (!athlete) {
    return (
      <FeatureScrollScreen title={t('features.athletes.editTitle')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>
          {t('states.empty.defaultDescription')}
        </Text>
      </FeatureScrollScreen>
    );
  }

  const handleSubmit = (values: AthleteFormValues) => {
    updateAthlete(athlete.id, formValuesToAthleteInput(values));
    Alert.alert(t('features.athletes.saved'), '', [
      { text: t('common.done'), onPress: () => router.replace(APP_ROUTES.athleteDetail(athlete.id)) },
    ]);
  };

  return (
    <FeatureScrollScreen title={t('features.athletes.editTitle')}>
      <AthleteForm
        initial={athleteToFormValues(athlete)}
        submitLabel={t('common.save')}
        onSubmit={handleSubmit}
      />
    </FeatureScrollScreen>
  );
}
