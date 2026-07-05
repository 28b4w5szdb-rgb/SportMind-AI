import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { ProgressRingChart } from '@/src/components/charts';
import type { DailyCheckIn } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { buildRecoverySummary } from '../recoveryEngine';

interface RecoveryCenterPanelProps {
  checkIn?: DailyCheckIn;
  compact?: boolean;
}

function MetricTile({ icon, label, value, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; color: string }) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 140, borderRadius: theme.borderRadius.xl }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: 6 }}>
        <Ionicons name={icon} size={16} color={color} />
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginStart: 6 }]}>{label}</Text>
      </View>
      <Text style={[type.body, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>{value}</Text>
    </Card>
  );
}

export function RecoveryCenterPanel({ checkIn, compact = false }: RecoveryCenterPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  if (!checkIn) {
    return (
      <Card variant="outlined" padding="lg" style={{ borderRadius: theme.borderRadius.xl }}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('recovery.empty')}</Text>
      </Card>
    );
  }

  const summary = buildRecoverySummary(checkIn);
  const scoreColor = summary.recoveryScore >= 70 ? theme.colors.success : summary.recoveryScore >= 50 ? theme.colors.primary : theme.colors.warning;
  const impactPrefix = summary.readinessImpact >= 0 ? '+' : '';

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden', ...theme.shadows.md }}>
        <LinearGradient colors={[`${scoreColor}18`, theme.colors.surface]} style={{ padding: theme.spacing.lg }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
            <ProgressRingChart value={summary.recoveryScore} max={100} size={compact ? 90 : 110} color={scoreColor} trackColor={theme.colors.border}>
              <Text style={[type.h5, { color: theme.colors.text }]}>{summary.recoveryScore}</Text>
            </ProgressRingChart>
            <View style={{ flex: 1, marginStart: theme.spacing.lg }}>
              <Text style={[type.overline, { color: theme.colors.textSecondary, letterSpacing: 1.2, textAlign: textAlign('start') }]}>
                {t('recovery.dailyScore')}
              </Text>
              <Text style={[type.h5, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>{t('recovery.scoreLabel')}</Text>
              <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
                {t('recovery.readinessImpact', { value: `${impactPrefix}${summary.readinessImpact}` })}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Card>

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <MetricTile icon="moon" label={t('recovery.sleep')} value={`${summary.sleepHours}h · ${summary.sleepQuality}/10`} color="#6366F1" />
        <MetricTile icon="battery-half" label={t('recovery.fatigue')} value={`${summary.fatigue}/10`} color="#F97316" />
        <MetricTile icon="body" label={t('recovery.soreness')} value={`${summary.soreness}/10`} color="#EF4444" />
        <MetricTile icon="water" label={t('recovery.hydration')} value={`${summary.hydrationLiters.toFixed(1)} L`} color="#0EA5E9" />
      </View>

      {summary.recommendations.length > 0 ? (
        <View style={{ gap: theme.spacing.sm }}>
          <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('recovery.recommendationsTitle')}</Text>
          {summary.recommendations.map((rec) => (
            <Card key={rec.id} variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start', gap: theme.spacing.sm }}>
                <Ionicons
                  name={rec.priority === 'high' ? 'alert-circle' : 'information-circle'}
                  size={18}
                  color={rec.priority === 'high' ? theme.colors.error : theme.colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>{t(rec.titleKey)}</Text>
                  <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{t(rec.bodyKey)}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.bodySm, { color: theme.colors.success, textAlign: textAlign('start') }]}>{t('recovery.allGood')}</Text>
        </Card>
      )}
    </View>
  );
}
