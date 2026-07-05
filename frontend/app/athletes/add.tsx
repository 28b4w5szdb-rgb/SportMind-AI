import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import {
  AthleteForm,
  formValuesToAthleteInput,
  type AthleteFormValues,
} from '@/src/components/features';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';

export default function AddAthleteScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const addAthlete = useMockStore((s) => s.addAthlete);

  const handleSubmit = (values: AthleteFormValues) => {
    const athlete = addAthlete(formValuesToAthleteInput(values));
    Alert.alert(t('features.athletes.saved'), '', [
      { text: t('common.done'), onPress: () => router.replace(APP_ROUTES.athleteDetail(athlete.id)) },
    ]);
  };

  return (
    <FeatureScrollScreen title={t('features.athletes.addTitle')}>
      <AthleteForm
        submitLabel={t('common.save')}
        onSubmit={handleSubmit}
      />
    </FeatureScrollScreen>
  );
}
