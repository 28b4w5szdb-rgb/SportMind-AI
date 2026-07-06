import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import {
  getCategoryById,
  getTestsByCategory,
  getFeaturedTestForCategory,
  getTestName,
  TestResultCard,
  useCustomTestDefinitions,
  LabProtocolCard,
} from '@/src/features/performance-lab';

export default function LabCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const tests = useMockStore((s) => s.tests);
  const customTests = useCustomTestDefinitions();
  const category = getCategoryById(id ?? '');
  const categoryTests = getTestsByCategory(id ?? '', customTests);
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
      <LinearGradient colors={[category.color, category.color + '99']} style={{ borderRadius: theme.borderRadius['2xl'], padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, borderRadius: theme.borderRadius['2xl'], backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={category.icon} size={36} color="#FFF" />
          </View>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text style={[type.h3, { color: '#FFF', textAlign: textAlign('start') }]}>{t(category.nameKey)}</Text>
              <Badge label={t('testingCenter.analyticsBadge')} variant="info" />
            </View>
            <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.9)', marginTop: 6, textAlign: textAlign('start') }]}>
              {t(category.descriptionKey)}
            </Text>
            <Text style={[type.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 8, textAlign: textAlign('start') }]}>
              {categoryTests.length} {t('testingCenter.testsAvailable')} · {recorded.length} {t('performanceLab.recorded')}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {categoryTests.map((def) => (
        <LabProtocolCard
          key={def.key}
          definition={def}
          featured={def.featured}
          onPress={() => router.push(APP_ROUTES.performanceLabTest(def.key))}
        />
      ))}

      {featured ? (
        <Button
          title={t('performanceLab.startFeatured', { test: getTestName(featured, isRTL) })}
          onPress={() => router.push(APP_ROUTES.performanceLabTest(featured.key))}
          fullWidth
          icon="play"
          style={{ marginBottom: theme.spacing.lg }}
        />
      ) : null}

      {recorded.length > 0
        ? recorded.map((test) => (
            <TestResultCard key={test.id} test={test} onPress={() => router.push(APP_ROUTES.performanceLabResult(test.id))} />
          ))
        : null}
    </FeatureScrollScreen>
  );
}
