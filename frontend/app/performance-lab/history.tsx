import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function LabHistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL, chevronIcon } = useDirection();
  const tests = useMockStore((s) => s.tests);

  return (
    <FeatureScrollScreen
      title={isRTL ? 'سجل الاختبارات' : 'Test History'}
      rightAction={{ icon: 'add', onPress: () => router.push(APP_ROUTES.performanceLabEntry) }}
    >
      {tests.length === 0 ? (
        <EmptyState
          icon="analytics"
          title={isRTL ? 'لا توجد اختبارات' : 'No tests recorded'}
          description={isRTL ? 'سجّل أول اختبار أداء' : 'Record your first performance test'}
          actionLabel={isRTL ? 'اختبار جديد' : 'New test'}
          onAction={() => router.push(APP_ROUTES.performanceLabEntry)}
        />
      ) : (
        tests.map((test) => (
          <Card key={test.id} variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.primary + '15', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="analytics" size={22} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>{test.test_type}</Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                  {test.athlete_name} · {test.date}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[type.numberSm, { color: theme.colors.text }]}>{test.value} {test.unit}</Text>
                <Ionicons name={chevronIcon()} size={16} color={theme.colors.textTertiary} style={{ marginTop: 4 }} />
              </View>
            </View>
            {test.notes ? (
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
                {test.notes}
              </Text>
            ) : null}
          </Card>
        ))
      )}
    </FeatureScrollScreen>
  );
}
