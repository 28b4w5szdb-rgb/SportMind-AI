import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { RecommendationItem } from '@/src/analytics/types';
import type { MockPerformanceTest } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface WorkspaceLatestStripProps {
  latestTest?: MockPerformanceTest;
  latestRecommendation?: RecommendationItem;
  daysSinceInjury: number | null;
}

export function WorkspaceLatestStrip({ latestTest, latestRecommendation, daysSinceInjury }: WorkspaceLatestStripProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  return (
    <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
      <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 160, borderRadius: theme.borderRadius.xl }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: 6 }}>
          <Ionicons name="flask" size={16} color={theme.colors.primary} />
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginStart: 6 }]}>{t('athleteWorkspace.latestTest')}</Text>
        </View>
        {latestTest ? (
          <>
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]} numberOfLines={1}>
              {latestTest.test_type}
            </Text>
            <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2, textAlign: textAlign('start') }]}>
              {latestTest.value} {latestTest.unit} · {latestTest.date}
            </Text>
          </>
        ) : (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{t('athleteWorkspace.noLatestTest')}</Text>
        )}
      </Card>

      <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 160, borderRadius: theme.borderRadius.xl }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: 6 }}>
          <Ionicons name="sparkles" size={16} color="#8B5CF6" />
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginStart: 6 }]}>{t('athleteWorkspace.latestAiRec')}</Text>
        </View>
        {latestRecommendation ? (
          <>
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]} numberOfLines={2}>
              {t(latestRecommendation.titleKey)}
            </Text>
            <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2, textAlign: textAlign('start') }]}>
              {t(`athleteWorkspace.priority.${latestRecommendation.priority}`)}
            </Text>
          </>
        ) : (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>—</Text>
        )}
      </Card>

      <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 140, borderRadius: theme.borderRadius.xl }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: 6 }}>
          <Ionicons name="medkit" size={16} color={theme.colors.warning} />
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginStart: 6 }]}>{t('athleteWorkspace.daysSinceInjury')}</Text>
        </View>
        <Text style={[type.numberSm, { color: theme.colors.text }]}>
          {daysSinceInjury != null
            ? isRTL
              ? `${daysSinceInjury} يوم`
              : `${daysSinceInjury} days`
            : t('athleteWorkspace.noRecentInjury')}
        </Text>
      </Card>
    </View>
  );
}
