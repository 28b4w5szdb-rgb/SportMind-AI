import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import type { MockPerformanceTest } from '@/src/data/mock/types';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { getTestDefinition, PERFORMANCE_LEVEL_COLORS, getTestName, useCustomTestDefinitions, interpretTestWithSsid, getCategoryById } from '../../index';

interface LabTimelineProps {
  tests: MockPerformanceTest[];
  compact?: boolean;
}

export function LabTimeline({ tests, compact = false }: LabTimelineProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { flexRow, textAlign, isRTL } = useDirection();
  const customTests = useCustomTestDefinitions();

  if (tests.length === 0) {
    return (
      <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: 'center', paddingVertical: 16 }]}>
        {t('performanceLab.timelineEmpty')}
      </Text>
    );
  }

  const visible = compact ? tests.slice(0, 5) : tests;

  return (
    <View>
      {visible.map((test, index) => {
        const definition = getTestDefinition(test.test_type_key, customTests);
        const category = definition ? getCategoryById(definition.categoryId) : undefined;
        const { level } = definition ? interpretTestWithSsid(definition, test.value, test.demographicContext) : { level: 'average' as const };
        const color = PERFORMANCE_LEVEL_COLORS[level];
        const isLast = index === visible.length - 1;

        return (
          <TouchableOpacity key={test.id} activeOpacity={0.88} onPress={() => router.push(APP_ROUTES.performanceLabResult(test.id))}>
            <View style={{ flexDirection: flexRow(true) }}>
              <View style={{ alignItems: 'center', width: 40 }}>
                <LinearGradient colors={[color + '30', color + '10']} style={{ width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={(definition?.icon ?? 'flask') as keyof typeof Ionicons.glyphMap} size={16} color={color} />
                </LinearGradient>
                {!isLast ? <View style={{ width: 2, flex: 1, backgroundColor: theme.colors.border, marginVertical: 4 }} /> : null}
              </View>
              <Card variant="ghost" padding="none" style={{ flex: 1, marginBottom: isLast ? 0 : theme.spacing.sm, marginStart: theme.spacing.sm }}>
                <View style={{ flexDirection: flexRow(true), justifyContent: 'space-between' }}>
                  <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', flex: 1, textAlign: textAlign('start') }]}>
                    {definition ? getTestName(definition, isRTL) : test.test_type}
                  </Text>
                  <Text style={[type.caption, { color: theme.colors.textTertiary, marginStart: 8 }]}>{test.date}</Text>
                </View>
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
                  {test.athlete_name} · {test.value} {test.unit}
                </Text>
                <View style={{ flexDirection: flexRow(true), gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  {category ? <Badge label={t(category.nameKey)} toneColor={category.color} /> : null}
                  <Badge label={t(`testingCenter.levels.${level}`)} variant={level === 'elite' || level === 'good' ? 'success' : 'warning'} />
                  {test.ssid ? <Badge label={t('performanceLab.decisionLogged')} variant="info" /> : null}
                </View>
              </Card>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
