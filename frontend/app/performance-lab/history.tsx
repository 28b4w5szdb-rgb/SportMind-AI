import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { LabTimeline } from '@/src/features/performance-lab/components/lab/LabTimeline';

export default function LabHistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tests = useMockStore((s) => s.tests);
  const sorted = [...tests].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  return (
    <FeatureScrollScreen
      title={t('performanceLab.historyTitle')}
      rightAction={{ icon: 'add', onPress: () => router.push('/(tabs)/performance-lab' as never) }}
    >
      {sorted.length === 0 ? (
        <EmptyState
          icon="analytics"
          title={t('performanceLab.noRecentTests')}
          description={t('performanceLab.noRecentTestsHint')}
          actionLabel={t('testingCenter.title')}
          onAction={() => router.push('/(tabs)/performance-lab' as never)}
        />
      ) : (
        <>
          <SectionHeader title={t('performanceLab.labTimeline')} subtitle={t('performanceLab.historySub')} titleSize="h5" />
          <LabTimeline tests={sorted} />
        </>
      )}
    </FeatureScrollScreen>
  );
}
