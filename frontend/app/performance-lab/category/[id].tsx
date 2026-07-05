import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { Badge } from '@/src/components/common/Badge';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import {
  getCategoryById,
  getTestsByCategory,
  getFeaturedTestForCategory,
  TestResultCard,
} from '@/src/features/performance-lab';

export default function LabCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const tests = useMockStore((s) => s.tests);
  const category = getCategoryById(id ?? '');
  const categoryTests = getTestsByCategory(id ?? '');
  const featured = getFeaturedTestForCategory(id ?? '');

  if (!category) {
    return (
      <FeatureScrollScreen title={t('testingCenter.categoriesTitle')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  const recorded = tests.filter((tst) => categoryTests.some((def) => def.key === tst.test_type_key));

  return (
    <FeatureScrollScreen title={t(category.nameKey)}>
      <Card variant="gradient" padding="lg" gradientColors={[category.color, category.color + '99']} style={{ marginBottom: theme.spacing.lg, borderRadius: theme.borderRadius['2xl'] }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <Ionicons name={category.icon} size={32} color="#FFF" />
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8 }}>
              <Text style={[type.h4, { color: '#FFF', textAlign: textAlign('start') }]}>{t(category.nameKey)}</Text>
              <Badge label={t('testingCenter.analyticsBadge')} variant="info" />
            </View>
            <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.85)', marginTop: 4, textAlign: textAlign('start') }]}>
              {t(category.descriptionKey)}
            </Text>
            <Text style={[type.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 8, textAlign: textAlign('start') }]}>
              {categoryTests.length} {t('testingCenter.testsAvailable')} · {recorded.length} {isRTL ? 'نتائج' : 'recorded'}
            </Text>
          </View>
        </View>
      </Card>

      <Text style={[type.label, { color: theme.colors.text, marginBottom: theme.spacing.sm, textAlign: textAlign('start') }]}>
        {isRTL ? 'البروتوكولات المتاحة' : 'Available protocols'}
      </Text>
      {categoryTests.map((def) => (
        <Button
          key={def.key}
          title={t(def.nameKey)}
          onPress={() => router.push(APP_ROUTES.performanceLabTest(def.key))}
          variant={def.featured ? 'primary' : 'outline'}
          size="small"
          style={{ marginBottom: theme.spacing.sm }}
          icon={def.icon}
        />
      ))}

      {featured ? (
        <Button
          title={isRTL ? `بدء ${t(featured.nameKey)}` : `Start ${t(featured.nameKey)}`}
          onPress={() => router.push(APP_ROUTES.performanceLabTest(featured.key))}
          fullWidth
          icon="play"
          style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}
        />
      ) : null}

      {recorded.length === 0 ? (
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
          {isRTL ? 'لا توجد نتائج مسجلة بعد في هذه الفئة.' : 'No recorded results in this category yet.'}
        </Text>
      ) : (
        recorded.map((test) => (
          <TestResultCard key={test.id} test={test} onPress={() => router.push(APP_ROUTES.performanceLabResult(test.id))} />
        ))
      )}
    </FeatureScrollScreen>
  );
}
