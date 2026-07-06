import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { ProgressRingChart } from '@/src/components/charts';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete, MockTeam } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { AnimatedMetric } from './AnimatedMetric';

interface CockpitHeroProps {
  athlete: MockAthlete;
  team?: MockTeam;
  analytics: AthleteAnalyticsSnapshot;
}

function athleteAge(dob?: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

function kpiScore(analytics: AthleteAnalyticsSnapshot, id: string): number {
  const kpi = analytics.kpis.find((k) => k.id === id);
  if (!kpi) return 0;
  const num = parseFloat(String(kpi.displayValue).replace(/[^\d.-]/g, ''));
  return Number.isFinite(num) ? num : 0;
}

export function CockpitHero({ athlete, team, analytics }: CockpitHeroProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  const fullName = `${athlete.first_name} ${athlete.last_name}`;
  const age = athleteAge(athlete.date_of_birth);
  const readiness = kpiScore(analytics, 'readiness');
  const recovery = kpiScore(analytics, 'recovery');
  const injuryRisk = kpiScore(analytics, 'injury_risk');
  const injuryVariant = injuryRisk >= 70 ? 'error' : injuryRisk >= 45 ? 'warning' : 'success';

  const initials = `${athlete.first_name[0] ?? ''}${athlete.last_name[0] ?? ''}`.toUpperCase();

  const metrics = [
    { label: t('analytics.kpi.readiness'), value: readiness, color: '#10B981' },
    { label: t('analytics.kpi.recovery'), value: recovery, color: '#0D9488' },
    { label: t('analytics.kpi.injuryRisk'), value: injuryRisk, color: injuryRisk >= 60 ? '#EF4444' : '#F97316' },
  ];

  return (
    <Card
      variant="elevated"
      padding="none"
      style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, overflow: 'hidden', ...theme.shadows.lg }}
    >
      <LinearGradient colors={['#0066FF', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: theme.spacing.lg }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: theme.borderRadius['2xl'],
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={[type.h2, { color: '#FFF' }]}>{initials}</Text>
          </View>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.overline, { color: 'rgba(255,255,255,0.75)', letterSpacing: 1.2, textAlign: textAlign('start') }]}>
              {t('athleteWorkspace.cockpit.commandCenter')}
            </Text>
            <Text style={[type.h3, { color: '#FFF', textAlign: textAlign('start'), marginTop: 4 }]}>{fullName}</Text>
            <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.9)', textAlign: textAlign('start'), marginTop: 2 }]}>
              {athlete.position}
              {team ? ` · ${team.name}` : ''}
              {age != null ? (isRTL ? ` · ${age} سنة` : ` · ${age} yrs`) : ''}
              {athlete.jersey_number != null ? ` · #${athlete.jersey_number}` : ''}
            </Text>
            <View style={{ flexDirection: flexRow(true), gap: 8, marginTop: theme.spacing.sm, flexWrap: 'wrap' }}>
              <Badge label={t(`features.athletes.status.${athlete.status}`)} variant={athlete.status === 'active' ? 'success' : athlete.status === 'injured' ? 'warning' : 'info'} />
              <Badge label={t(`athleteWorkspace.injuryRisk.${injuryRisk >= 60 ? 'high' : injuryRisk >= 40 ? 'medium' : 'low'}`)} variant={injuryVariant} />
            </View>
          </View>
          <ProgressRingChart value={analytics.overall.score} max={analytics.overall.maxScore} size={92} color="#FFF" trackColor="rgba(255,255,255,0.25)">
            <AnimatedMetric value={analytics.overall.score} style={[type.h5, { color: '#FFF', fontWeight: '700' }]} />
            <Text style={[type.caption, { color: 'rgba(255,255,255,0.75)' }]}>{t('analytics.overallScore')}</Text>
          </ProgressRingChart>
        </View>

        <View
          style={{
            flexDirection: flexRow(true),
            marginTop: theme.spacing.lg,
            paddingTop: theme.spacing.md,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.2)',
            gap: theme.spacing.sm,
          }}
        >
          {metrics.map((m) => (
            <View key={m.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: theme.borderRadius.lg, padding: theme.spacing.sm }}>
              <Text style={[type.caption, { color: 'rgba(255,255,255,0.75)', textAlign: textAlign('start') }]}>{m.label}</Text>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginTop: 4 }}>
                <AnimatedMetric value={m.value} style={[type.numberSm, { color: '#FFF' }]} />
                <Ionicons name="pulse" size={14} color={m.color} style={{ marginStart: 6 }} />
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Card>
  );
}
