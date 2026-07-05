import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { TestResultCard } from '@/src/features/performance-lab';

export default function LabHistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { isRTL } = useDirection();
  const tests = useMockStore((s) => s.tests);

  return (
    <FeatureScrollScreen
      title={isRTL ? 'سجل الاختبارات' : 'Test History'}
      rightAction={{ icon: 'add', onPress: () => router.push('/(tabs)/performance-lab' as never) }}
    >
      {tests.length === 0 ? (
        <EmptyState
          icon="analytics"
          title={isRTL ? 'لا توجد اختبارات' : 'No tests recorded'}
          description={isRTL ? 'سجّل أول اختبار من مركز الاختبارات' : 'Record your first test from the Testing Center'}
          actionLabel={isRTL ? 'مركز الاختبارات' : 'Testing Center'}
          onAction={() => router.push('/(tabs)/performance-lab' as never)}
        />
      ) : (
        tests.map((test) => (
          <TestResultCard
            key={test.id}
            test={test}
            compact
            onPress={() => router.push(APP_ROUTES.performanceLabResult(test.id))}
          />
        ))
      )}
    </FeatureScrollScreen>
  );
}
