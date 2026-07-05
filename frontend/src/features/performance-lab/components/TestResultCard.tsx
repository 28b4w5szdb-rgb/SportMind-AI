import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { ANALYTICS_MODULES } from '@/src/analytics/registry/modules';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockPerformanceTest } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { getTestDefinition, rateTestResult, PERFORMANCE_LEVEL_COLORS, getTestName, getTestText, useCustomTestDefinitions } from '../index';
import type { TestDefinition } from '../types';
import type { TestAnalyticsImpact } from '../types';

interface TestResultCardProps {
  test: MockPerformanceTest;
  analytics?: AthleteAnalyticsSnapshot;
  impact?: TestAnalyticsImpact;
  compact?: boolean;
  onPress?: () => void;
  definition?: TestDefinition;
}

export function TestResultCard({ test, analytics, impact, compact = false, onPress, definition: definitionProp }: TestResultCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL, chevronIcon } = useDirection();
  const customTests = useCustomTestDefinitions();
  const definition = definitionProp ?? getTestDefinition(test.test_type_key, customTests);
  const level = definition ? rateTestResult(test.value, definition.referenceValues) : 'average';
  const levelColor = PERFORMANCE_LEVEL_COLORS[level];
  const affected = definition?.affectedModules ?? [];

  const content = (
    <Card
      variant="elevated"
      padding={compact ? 'md' : 'lg'}
      style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.sm, borderStartWidth: 4, borderStartColor: levelColor }}
    >
      <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: levelColor + '18', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={(definition?.icon ?? 'analytics') as keyof typeof Ionicons.glyphMap} size={22} color={levelColor} />
        </View>
        <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
          <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>
            {definition ? getTestName(definition, isRTL) : test.test_type}
          </Text>
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
            {test.athlete_name} · {test.date}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[type.numberSm, { color: theme.colors.text }]}>
            {test.value} {test.unit}
          </Text>
          <Badge label={t(`testingCenter.levels.${level}`)} variant={level === 'elite' || level === 'good' ? 'success' : level === 'average' ? 'warning' : 'error'} />
        </View>
        {onPress ? <Ionicons name={chevronIcon()} size={18} color={theme.colors.textTertiary} style={{ marginStart: 8 }} /> : null}
      </View>

      {!compact && (
        <View style={{ marginTop: theme.spacing.md, gap: theme.spacing.sm }}>
          <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 6 }}>
            {affected.map((modId) => {
              const mod = ANALYTICS_MODULES.find((m) => m.id === modId);
              return mod ? <Badge key={modId} label={t(mod.labelKey)} variant="neutral" /> : null;
            })}
          </View>

          {impact ? (
            <Text style={[type.caption, { color: theme.colors.primary, textAlign: textAlign('start') }]}>
              {isRTL
                ? `تأثير النتيجة: ${impact.beforeScore} → ${impact.afterScore} (${impact.delta >= 0 ? '+' : ''}${impact.delta})`
                : `Score impact: ${impact.beforeScore} → ${impact.afterScore} (${impact.delta >= 0 ? '+' : ''}${impact.delta})`}
            </Text>
          ) : null}

          {definition ? (
            <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
              {getTestText(definition, 'aiRec', isRTL)}
            </Text>
          ) : null}

          {analytics ? (
            <View style={{ paddingTop: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
              <Text style={[type.label, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                {t('testingCenter.decisionSupport')}
              </Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
                {t(analytics.decision.titleKey)} — {t(analytics.decision.bodyKey)}
              </Text>
              {analytics.recommendations[0] ? (
                <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
                  {t(analytics.recommendations[0].bodyKey)}
                </Text>
              ) : null}
            </View>
          ) : null}

          {test.notes ? (
            <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
              {test.notes}
            </Text>
          ) : null}
        </View>
      )}
    </Card>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}
