import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { Card } from '@/src/components/common/Card';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { Badge } from '@/src/components/common/Badge';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { APP_ROUTES } from '@/src/core/constants/routes';
import type { TeamIntelligenceSnapshot } from '@/src/features/team-intelligence/types';
import type { StaffRecommendation } from '@/src/features/team-intelligence/types';

interface DashboardTeamIntelligenceProps {
  squadIntelligence: TeamIntelligenceSnapshot;
  weeklyFocus?: StaffRecommendation;
  isDesktop: boolean;
}

export function DashboardTeamIntelligence({ squadIntelligence, weeklyFocus, isDesktop }: DashboardTeamIntelligenceProps) {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const router = useRouter();
  const { flexRow, textAlign, isRTL } = useDirection();

  const top = squadIntelligence.topPerformers[0];
  const atRisk = squadIntelligence.playersAtRisk[0];
  const fatigueNames = squadIntelligence.fatigueWatchlist.slice(0, 2).map((p) => p.athleteName).join(isRTL ? ' · ' : ' · ');

  const tiles = [
    {
      id: 'top',
      icon: 'trophy' as const,
      color: '#10B981',
      title: t('dashboard.intel.topPerformer'),
      body: top ? `${top.athleteName} · ${top.overallScore}/1000` : t('dashboard.intel.noData'),
    },
    {
      id: 'risk',
      icon: 'warning' as const,
      color: '#EF4444',
      title: t('dashboard.intel.atRisk'),
      body: atRisk ? `${atRisk.athleteName} · ${t('analytics.kpi.injuryRisk')} ${atRisk.injuryRisk}%` : t('dashboard.intel.noData'),
    },
    {
      id: 'fatigue',
      icon: 'battery-dead' as const,
      color: '#F97316',
      title: t('dashboard.intel.fatigueWatch'),
      body: fatigueNames || t('dashboard.intel.noData'),
    },
    {
      id: 'focus',
      icon: 'flag' as const,
      color: '#8B5CF6',
      title: t('dashboard.intel.weeklyFocus'),
      body: weeklyFocus ? t(weeklyFocus.titleKey) : squadIntelligence.aiSummary,
    },
  ];

  return (
    <View>
      <SectionHeader
        title={t('dashboard.teamIntelligence')}
        actionLabel={t('dashboard.viewIntel')}
        onAction={() => router.push(APP_ROUTES.teamIntelligence())}
      />
      <View style={{ flexDirection: isDesktop ? flexRow(true) : 'column', flexWrap: 'wrap', gap: theme.spacing[3] }}>
        {tiles.map((tile) => (
          <Card key={tile.id} variant="outlined" padding="md" style={{ flex: isDesktop ? 1 : undefined, minWidth: isDesktop ? 220 : undefined, borderRadius: theme.borderRadius[theme.tokens.radius.card] }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start', gap: theme.spacing[3] }}>
              <View style={{ width: 40, height: 40, borderRadius: theme.borderRadius.lg, backgroundColor: tile.color + '18', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={tile.icon} size={20} color={tile.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.label, { color: tile.color, textAlign: textAlign('start') }]}>{tile.title}</Text>
                <Text style={[type.bodySm, { color: theme.colors.text, marginTop: theme.spacing[1], textAlign: textAlign('start') }]} numberOfLines={3}>
                  {tile.body}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
      {squadIntelligence.alerts.length > 0 ? (
        <TouchableOpacity activeOpacity={theme.tokens.interaction.activeOpacity} onPress={() => router.push(APP_ROUTES.teamIntelligence())} style={{ marginTop: theme.spacing[3] }}>
          <Badge label={`${squadIntelligence.alerts.length} ${t('teamIntelligence.alertsTitle')}`} variant="warning" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
