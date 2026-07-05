import React from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import {
  AthleteForm,
  athleteToFormValues,
  formValuesToAthleteInput,
  type AthleteFormValues,
} from '@/src/components/features';
import { useAthleteById } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useFormAction } from '@/src/hooks/useFormAction';

export default function EditAthleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const athlete = useAthleteById(id);
  const updateAthlete = useMockStore((s) => s.updateAthlete);
  const { loading, success, run } = useFormAction();

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
    run(() => {
      updateAthlete(athlete.id, formValuesToAthleteInput(values));
      setTimeout(() => router.replace(APP_ROUTES.athleteDetail(athlete.id)), 600);
    });
  };

  return (
    <FeatureScrollScreen title={t('features.athletes.editTitle')}>
      <SuccessBanner message={t('features.athletes.saved')} visible={success} />
      <AthleteForm
        initial={athleteToFormValues(athlete)}
        submitLabel={loading ? t('common.saving') : t('common.save')}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </FeatureScrollScreen>
  );
}
