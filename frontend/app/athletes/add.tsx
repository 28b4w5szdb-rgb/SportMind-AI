import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import {
  AthleteForm,
  formValuesToAthleteInput,
  type AthleteFormValues,
} from '@/src/components/features';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useFormAction } from '@/src/hooks/useFormAction';

export default function AddAthleteScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const addAthlete = useMockStore((s) => s.addAthlete);
  const { loading, success, run } = useFormAction();

  const handleSubmit = (values: AthleteFormValues) => {
    run(() => {
      const athlete = addAthlete(formValuesToAthleteInput(values));
      setTimeout(() => router.replace(APP_ROUTES.athleteDetail(athlete.id)), 600);
    });
  };

  return (
    <FeatureScrollScreen title={t('features.athletes.addTitle')}>
      <SuccessBanner message={t('features.athletes.saved')} visible={success} />
      <AthleteForm submitLabel={loading ? t('common.saving') : t('common.save')} onSubmit={handleSubmit} loading={loading} />
    </FeatureScrollScreen>
  );
}
