import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { LAB_CATEGORIES } from '@/src/data/mock/lab';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function LabCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const tests = useMockStore((s) => s.tests);
  const category = LAB_CATEGORIES.find((c) => c.id === id);

  if (!category) {
    return (
      <FeatureScrollScreen title={isRTL ? 'الفئة' : 'Category'}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  const categoryTests = tests.filter((t) => (category.tests as string[]).includes(t.test_type_key));

  return (
    <FeatureScrollScreen title={isRTL ? category.labelAr : category.labelEn}>
      <Card variant="gradient" padding="lg" gradientColors={[category.color, category.color + '99']} style={{ marginBottom: theme.spacing.lg, borderRadius: theme.borderRadius['2xl'] }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={32} color="#FFF" />
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.h4, { color: '#FFF', textAlign: textAlign('start') }]}>
              {isRTL ? category.labelAr : category.labelEn}
            </Text>
            <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.85)', marginTop: 4, textAlign: textAlign('start') }]}>
              {categoryTests.length} {isRTL ? 'نتائج مسجلة' : 'recorded results'}
            </Text>
          </View>
        </View>
      </Card>

      {categoryTests.length === 0 ? (
        <Button title={isRTL ? 'تسجيل اختبار' : 'Record test'} onPress={() => router.push(APP_ROUTES.performanceLabEntry)} icon="add" fullWidth />
      ) : (
        categoryTests.map((test) => (
          <Card key={test.id} variant="outlined" padding="md" style={{ marginBottom: theme.spacing.sm, borderRadius: theme.borderRadius.xl, borderColor: category.color + '40' }}>
            <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>{test.test_type}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
              {test.athlete_name} · {test.value} {test.unit} · {test.date}
            </Text>
          </Card>
        ))
      )}
    </FeatureScrollScreen>
  );
}
