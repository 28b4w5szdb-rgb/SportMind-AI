import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { AnimatedMetric } from './AnimatedMetric';

interface CockpitAiSummaryProps {
  analytics: AthleteAnalyticsSnapshot;
}

export function CockpitAiSummary({ analytics }: CockpitAiSummaryProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  const rec = analytics.recommendations[0];
  const decision = analytics.decision;
  const nextAction = analytics.recommendations[1] ?? rec;

  return (
    <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden', ...theme.shadows.md }}>
      <LinearGradient colors={['#8B5CF618', '#0066FF10']} style={{ padding: theme.spacing.lg }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: theme.spacing.md }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: theme.borderRadius.lg,
              backgroundColor: '#8B5CF622',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="sparkles" size={22} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('athleteWorkspace.cockpit.aiTitle')}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
              {t('athleteWorkspace.cockpit.aiSubtitle')}
            </Text>
          </View>
          <Badge label={`${decision.confidence}%`} toneColor="#8B5CF6" />
        </View>

        {rec ? (
          <>
            <Text style={[type.body, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>{t(rec.titleKey)}</Text>
            <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: theme.spacing[2], textAlign: textAlign('start'), lineHeight: isRTL ? 24 : 20 }]}>
              {t(rec.bodyKey)}
            </Text>
          </>
        ) : null}

        <View
          style={{
            marginTop: theme.spacing.md,
            paddingTop: theme.spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
          }}
        >
          <Text style={[type.label, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>{t('athleteWorkspace.cockpit.reasoning')}</Text>
          <Text style={[type.bodySm, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>{t(decision.bodyKey)}</Text>
        </View>

        {nextAction ? (
          <View
            style={{
              marginTop: theme.spacing.md,
              backgroundColor: theme.colors.backgroundSecondary,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flexDirection: flexRow(true),
              alignItems: 'center',
            }}
          >
            <Ionicons name="arrow-forward-circle" size={20} color={theme.colors.primary} />
            <View style={{ flex: 1, marginHorizontal: theme.spacing.sm }}>
              <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>{t('athleteWorkspace.cockpit.nextAction')}</Text>
              <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>{t(nextAction.titleKey)}</Text>
            </View>
            <AnimatedMetric value={decision.confidence} suffix="%" style={[type.captionBold, { color: '#8B5CF6' }]} />
          </View>
        ) : null}
      </LinearGradient>
    </Card>
  );
}
