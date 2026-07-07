import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { LabTimeline } from '@/src/features/performance-lab/components/lab/LabTimeline';
import { usePerformanceLabHistory } from '@/src/features/performance-lab/bridge';

export default function LabHistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { loading, readErrorKey, tests } = usePerformanceLabHistory();

  return (
    <FeatureScrollScreen
      title={t('performanceLab.historyTitle')}
      rightAction={{ icon: 'add', onPress: () => router.push('/(tabs)/performance-lab' as never) }}
    >
      {loading ? (
        <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xl }}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: theme.spacing.md }]}>
            {t('testingCenter.bridge.loading')}
          </Text>
        </View>
      ) : tests.length === 0 ? (
        <EmptyState
          icon="analytics"
          title={t('performanceLab.noRecentTests')}
          description={t('performanceLab.noRecentTestsHint')}
          actionLabel={t('testingCenter.title')}
          onAction={() => router.push('/(tabs)/performance-lab' as never)}
        />
      ) : (
        <>
          {readErrorKey ? (
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md }]}>
              {t(readErrorKey)}
            </Text>
          ) : null}
          <SectionHeader title={t('performanceLab.labTimeline')} subtitle={t('performanceLab.historySub')} titleSize="h5" />
          <LabTimeline tests={tests} />
        </>
      )}
    </FeatureScrollScreen>
  );
}
