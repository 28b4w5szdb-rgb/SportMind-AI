import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { ProgressRingChart } from '@/src/components/charts';
import type { OverallAthleteScore } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface OverallScoreHeroProps {
  overall: OverallAthleteScore;
}

export function OverallScoreHero({ overall }: OverallScoreHeroProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  return (
    <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden', marginBottom: theme.spacing.lg, ...theme.shadows.md }}>
      <LinearGradient colors={['#0066FF12', '#0D948812']} style={{ padding: theme.spacing.lg }}>
        <Text style={[type.overline, { color: theme.colors.textSecondary, letterSpacing: 1.5, textAlign: textAlign('start') }]}>
          {t('analytics.overallScore')}
        </Text>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginTop: theme.spacing.md }}>
          <ProgressRingChart value={overall.score} max={overall.maxScore} size={110} color={overall.color} trackColor={theme.colors.border}>
            <Text style={[type.h4, { color: theme.colors.text }]}>{overall.score}</Text>
            <Text style={[type.caption, { color: theme.colors.textTertiary }]}>/ {overall.maxScore}</Text>
          </ProgressRingChart>
          <View style={{ flex: 1, marginStart: theme.spacing.lg }}>
            <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>
              {t(`analytics.status.${overall.percentileLabel}`)}
            </Text>
            <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
              {t('analytics.trendLabel')}: {overall.trendDelta > 0 ? '+' : ''}{overall.trendDelta}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Card>
  );
}
