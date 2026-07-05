import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { AnalyticsModuleResult } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

interface BodyMuscleMapPlaceholderProps {
  modules: AnalyticsModuleResult[];
}

interface ZoneDef {
  id: string;
  labelKey: string;
  moduleId: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

const ZONES: ZoneDef[] = [
  { id: 'head', labelKey: 'athleteWorkspace.body.head', moduleId: 'readiness', top: 0, left: 38, width: 24, height: 14 },
  { id: 'chest', labelKey: 'athleteWorkspace.body.chest', moduleId: 'strength', top: 16, left: 30, width: 40, height: 16 },
  { id: 'core', labelKey: 'athleteWorkspace.body.core', moduleId: 'physical_fitness', top: 34, left: 32, width: 36, height: 14 },
  { id: 'arms', labelKey: 'athleteWorkspace.body.arms', moduleId: 'strength', top: 18, left: 8, width: 18, height: 28 },
  { id: 'arms_r', labelKey: 'athleteWorkspace.body.arms', moduleId: 'strength', top: 18, left: 74, width: 18, height: 28 },
  { id: 'hips', labelKey: 'athleteWorkspace.body.hips', moduleId: 'flexibility', top: 50, left: 28, width: 44, height: 12 },
  { id: 'legs', labelKey: 'athleteWorkspace.body.legs', moduleId: 'speed', top: 64, left: 34, width: 14, height: 28 },
  { id: 'legs_r', labelKey: 'athleteWorkspace.body.legs', moduleId: 'speed', top: 64, left: 52, width: 14, height: 28 },
];

function zoneColor(score: number): string {
  if (score >= 75) return '#10B981';
  if (score >= 55) return '#0066FF';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

export function BodyMuscleMapPlaceholder({ modules }: BodyMuscleMapPlaceholderProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  const scoreFor = (moduleId: string) => modules.find((m) => m.id === moduleId)?.score ?? 50;

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader title={t('athleteWorkspace.bodyMapTitle')} subtitle={t('athleteWorkspace.bodyMapSubtitle')} />
      <Card variant="outlined" padding="lg" style={{ borderRadius: theme.borderRadius.xl }}>
        <View style={{ flexDirection: flexRow(true), gap: theme.spacing.lg, flexWrap: 'wrap' }}>
          <View style={{ width: 140, height: 200, alignSelf: 'center', position: 'relative' }}>
            <View
              style={{
                position: 'absolute',
                top: 14,
                left: 42,
                width: 56,
                height: 170,
                borderRadius: 28,
                backgroundColor: theme.colors.border,
                opacity: 0.35,
              }}
            />
            {ZONES.map((zone) => {
              const score = scoreFor(zone.moduleId);
              return (
                <View
                  key={zone.id}
                  style={{
                    position: 'absolute',
                    top: `${zone.top}%`,
                    left: `${zone.left}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                    borderRadius: 6,
                    backgroundColor: `${zoneColor(score)}33`,
                    borderWidth: 1.5,
                    borderColor: zoneColor(score),
                  }}
                />
              );
            })}
          </View>

          <View style={{ flex: 1, minWidth: 160, gap: 8 }}>
            {['strength', 'speed', 'flexibility', 'recovery', 'injury_risk'].map((moduleId) => {
              const mod = modules.find((m) => m.id === moduleId);
              const score = mod?.score ?? 50;
              return (
                <View key={moduleId} style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: zoneColor(score) }} />
                  <Text style={[type.bodySm, { color: theme.colors.textSecondary, flex: 1, textAlign: textAlign('start') }]}>
                    {mod ? t(mod.labelKey) : moduleId}
                  </Text>
                  <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600' }]}>{score}</Text>
                </View>
              );
            })}
            <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
              {t('athleteWorkspace.bodyMapHint')}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}
