import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { ReadinessScore } from '@/src/components/features/ReadinessScore';
import type { MockAthlete } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { computeReadinessScore, injuryRisk, readinessLabel } from '@/src/utils/athleteMetrics';

interface AthleteHeroCardProps {
  athlete: MockAthlete;
}

export function AthleteHeroCard({ athlete }: AthleteHeroCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  const fullName = `${athlete.first_name} ${athlete.last_name}`;
  const readiness = computeReadinessScore(athlete);
  const injury = injuryRisk(athlete);
  const injuryVariant = injury === 'high' ? 'error' : injury === 'medium' ? 'warning' : 'success';
  const trendColor = athlete.trend_percent >= 0 ? theme.colors.success : theme.colors.warning;

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
              width: 80,
              height: 80,
              borderRadius: theme.borderRadius['2xl'],
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.35)',
            }}
          >
            <Text style={[type.h3, { color: '#FFF' }]}>
              {athlete.first_name[0]}
              {athlete.last_name[0]}
            </Text>
          </View>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.overline, { color: 'rgba(255,255,255,0.75)', letterSpacing: 1.2, textAlign: textAlign('start') }]}>
              {t('athleteWorkspace.heroLabel')}
            </Text>
            <Text style={[type.h3, { color: '#FFF', textAlign: textAlign('start'), marginTop: 4 }]}>{fullName}</Text>
            <Text style={[type.body, { color: 'rgba(255,255,255,0.9)', textAlign: textAlign('start') }]}>
              {athlete.position}
              {athlete.jersey_number != null ? ` · #${athlete.jersey_number}` : ''}
            </Text>
            <View style={{ flexDirection: flexRow(true), gap: 8, marginTop: theme.spacing.sm, flexWrap: 'wrap' }}>
              <Badge label={t(`features.athletes.status.${athlete.status}`)} variant={athlete.status === 'active' ? 'success' : athlete.status === 'injured' ? 'warning' : 'info'} />
              <Badge label={t(`athleteWorkspace.injuryRisk.${injury}`)} variant={injuryVariant} />
            </View>
          </View>
          <ReadinessScore score={readiness} label={readinessLabel(readiness, isRTL)} size="lg" />
        </View>

        <View
          style={{
            flexDirection: flexRow(true),
            marginTop: theme.spacing.lg,
            paddingTop: theme.spacing.md,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.2)',
            gap: theme.spacing.md,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[type.caption, { color: 'rgba(255,255,255,0.7)' }]}>{t('features.athletes.testsCount', { count: athlete.tests_count })}</Text>
            <Text style={[type.numberSm, { color: '#FFF', marginTop: 2 }]}>{athlete.tests_count}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.caption, { color: 'rgba(255,255,255,0.7)' }]}>{t('features.athletes.trend')}</Text>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginTop: 2 }}>
              <Ionicons name={athlete.trend_percent >= 0 ? 'trending-up' : 'trending-down'} size={16} color="#FFF" />
              <Text style={[type.numberSm, { color: trendColor === theme.colors.success ? '#A7F3D0' : '#FDE68A', marginStart: 4 }]}>
                {athlete.trend_percent > 0 ? '+' : ''}
                {athlete.trend_percent}%
              </Text>
            </View>
          </View>
          {athlete.height_cm && athlete.weight_kg ? (
            <View style={{ flex: 1 }}>
              <Text style={[type.caption, { color: 'rgba(255,255,255,0.7)' }]}>{t('athleteWorkspace.biometrics')}</Text>
              <Text style={[type.bodySm, { color: '#FFF', marginTop: 2 }]}>
                {athlete.height_cm} cm · {athlete.weight_kg} kg
              </Text>
            </View>
          ) : null}
        </View>
      </LinearGradient>
    </Card>
  );
}
