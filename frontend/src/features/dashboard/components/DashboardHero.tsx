import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { ProgressRingChart } from '@/src/components/charts';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { APP_ROUTES } from '@/src/core/constants/routes';
import type { TeamAnalyticsOverview } from '@/src/analytics';
import type { TeamIntelligenceSnapshot } from '@/src/features/team-intelligence/types';

interface DashboardHeroProps {
  greetingKey: string;
  formattedDate: string;
  teamAnalytics: TeamAnalyticsOverview;
  squadIntelligence: TeamIntelligenceSnapshot;
  aiSummary: string;
  isDesktop: boolean;
}

export function DashboardHero({
  greetingKey,
  formattedDate,
  teamAnalytics,
  squadIntelligence,
  aiSummary,
  isDesktop,
}: DashboardHeroProps) {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const router = useRouter();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { metrics } = squadIntelligence;

  return (
    <Card variant="gradient" padding="lg" gradientColors={[theme.colors.primary, theme.colors.secondary]} style={{ borderRadius: theme.borderRadius[theme.tokens.radius.card] }}>
      <View style={{ flexDirection: flexRow(true), gap: theme.spacing[6], alignItems: isDesktop ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
        <View style={{ flex: 1, minWidth: 220 }}>
          <Text style={[type.overline, { color: 'rgba(255,255,255,0.85)', textAlign: textAlign('start') }]}>
            {t(greetingKey).toUpperCase()}
          </Text>
          <Text style={[type.h2, { color: '#FFFFFF', marginTop: theme.spacing[1], textAlign: textAlign('start') }]}>
            {t('dashboard.commandCenter')}
          </Text>
          <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.9)', marginTop: theme.spacing[2], textAlign: textAlign('start') }]}>
            {formattedDate}
          </Text>
          <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing[2], marginTop: theme.spacing[4] }}>
            <Badge label={`${metrics.activeCount} ${t('dashboard.status.active')}`} toneColor="#FFFFFF" />
            <Badge label={`${metrics.injuredCount} ${t('dashboard.status.injured')}`} toneColor="#FCA5A5" />
            <Badge label={`${metrics.restCount} ${t('dashboard.status.rest')}`} toneColor="#FDE68A" />
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <ProgressRingChart value={teamAnalytics.avgOverallScore} max={1000} size={isDesktop ? 128 : 108} color="#FFFFFF">
            <Text style={[type.h4, { color: '#FFFFFF' }]}>{teamAnalytics.avgOverallScore}</Text>
            <Text style={[type.caption, { color: 'rgba(255,255,255,0.85)' }]}>/1000</Text>
          </ProgressRingChart>
          <Text style={[type.captionBold, { color: 'rgba(255,255,255,0.9)', marginTop: theme.spacing[2], textAlign: 'center' }]}>
            {t('analytics.overallScore')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={theme.tokens.interaction.activeOpacity}
        onPress={() => router.push(APP_ROUTES.aiCoach)}
        style={{ marginTop: theme.spacing[5] }}
      >
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderRadius: theme.borderRadius[theme.tokens.radius.cardInner],
            padding: theme.spacing[4],
            borderWidth: theme.tokens.border.hairline,
            borderColor: 'rgba(255,255,255,0.25)',
          }}
        >
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: theme.spacing[3] }}>
            <LinearGradient colors={['#FFFFFF33', '#FFFFFF11']} style={{ width: 44, height: 44, borderRadius: theme.borderRadius.lg, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="sparkles" size={22} color="#FFFFFF" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[type.label, { color: 'rgba(255,255,255,0.85)', textAlign: textAlign('start') }]}>
                {t('dashboard.aiInsight')}
              </Text>
              <Text style={[type.bodySm, { color: '#FFFFFF', marginTop: theme.spacing[1], textAlign: textAlign('start') }]} numberOfLines={3}>
                {teamAnalytics.athleteCount > 0 ? aiSummary : t('dashboard.noInsightsYet')}
              </Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color="rgba(255,255,255,0.8)" />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
