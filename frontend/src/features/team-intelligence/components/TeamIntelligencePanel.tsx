import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { FormSection } from '@/src/components/common/FormSection';
import { Badge } from '@/src/components/common/Badge';
import { ProgressRingChart } from '@/src/components/charts';
import { APP_ROUTES } from '@/src/core/constants/routes';
import type { TeamIntelligenceSnapshot } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface TeamIntelligencePanelProps {
  snapshot: TeamIntelligenceSnapshot;
  compact?: boolean;
  showOpenLink?: boolean;
}

function MetricTile({ label, value, color }: { label: string; value: string; color?: string }) {
  const theme = useTheme();
  const type = useTypography();
  return (
    <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 100, borderRadius: 12 }}>
      <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text style={[type.h5, { color: color ?? theme.colors.text, marginTop: 4 }]}>{value}</Text>
    </Card>
  );
}

function PlayerRow({ name, meta, value, onPress }: { name: string; meta: string; value: string; onPress?: () => void }) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const content = (
    <View style={{ flexDirection: flexRow(true), alignItems: 'center', paddingVertical: 8 }}>
      <View style={{ flex: 1 }}>
        <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>{name}</Text>
        <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{meta}</Text>
      </View>
      <Text style={[type.bodySm, { color: theme.colors.primary, fontWeight: '700' }]}>{value}</Text>
    </View>
  );
  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }
  return content;
}

export function TeamIntelligencePanel({ snapshot, compact = false, showOpenLink = true }: TeamIntelligencePanelProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { metrics, rankings, topPerformers, playersAtRisk, fatigueWatchlist, recoveryWatchlist, readinessDistribution, positionAnalysis, alerts, trends, aiSummary, staffRecommendations } =
    snapshot;

  const rankingTitleKey: Record<string, string> = {
    overall: 'teamIntelligence.rankings.overall',
    readiness: 'teamIntelligence.rankings.readiness',
    injury_risk: 'teamIntelligence.rankings.injuryRisk',
    fatigue: 'teamIntelligence.rankings.fatigue',
    recovery: 'teamIntelligence.rankings.recovery',
    training_compliance: 'teamIntelligence.rankings.trainingCompliance',
    nutrition_compliance: 'teamIntelligence.rankings.nutritionCompliance',
  };

  if (metrics.rosterSize === 0) {
    return (
      <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{t('teamIntelligence.empty')}</Text>
    );
  }

  return (
    <View>
      <FormSection title={t('teamIntelligence.squadHealth')} subtitle={t('teamIntelligence.squadHealthHint')}>
        {showOpenLink ? (
          <TouchableOpacity onPress={() => router.push(APP_ROUTES.teamIntelligence(snapshot.teamId))} style={{ marginBottom: theme.spacing.sm }}>
            <Text style={[type.bodySm, { color: theme.colors.primary, fontWeight: '600', textAlign: textAlign('start') }]}>{t('teamIntelligence.open')}</Text>
          </TouchableOpacity>
        ) : null}
        <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.md }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: theme.spacing.md }}>
            <ProgressRingChart value={metrics.overallScore} max={1000} size={compact ? 72 : 88} color={theme.colors.primary}>
              <Text style={[type.caption, { color: theme.colors.text }]}>{metrics.overallScore}</Text>
            </ProgressRingChart>
            <View style={{ flex: 1 }}>
              <Text style={[type.h4, { color: theme.colors.text, textAlign: textAlign('start') }]}>{metrics.overallScore}/1000</Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
                {t('teamIntelligence.activeRoster', { active: metrics.activeCount, total: metrics.rosterSize })}
              </Text>
              <View style={{ flexDirection: flexRow(true), gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {metrics.injuredCount > 0 ? <Badge label={t('teamIntelligence.injured', { count: metrics.injuredCount })} variant="warning" /> : null}
                {metrics.restCount > 0 ? <Badge label={t('teamIntelligence.rest', { count: metrics.restCount })} variant="info" /> : null}
              </View>
            </View>
          </View>
        </Card>

        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
          <MetricTile label={t('analytics.kpi.readiness')} value={`${metrics.readiness}%`} />
          <MetricTile label={t('analytics.kpi.recovery')} value={`${metrics.recovery}%`} />
          <MetricTile label={t('analytics.kpi.fatigue')} value={`${metrics.fatigue}%`} color={metrics.fatigue >= 65 ? theme.colors.warning : undefined} />
          <MetricTile label={t('analytics.kpi.injuryRisk')} value={`${metrics.injuryRisk}%`} />
          <MetricTile label={t('teamIntelligence.trainingCompliance')} value={`${metrics.trainingCompliance}%`} />
          <MetricTile label={t('teamIntelligence.nutritionCompliance')} value={`${metrics.nutritionCompliance}%`} />
        </View>
      </FormSection>

      {!compact && (
        <>
          <FormSection title={t('teamIntelligence.topPerformers')}>
            {topPerformers.map((p) => (
              <PlayerRow
                key={p.athleteId}
                name={p.athleteName}
                meta={p.position}
                value={`${p.overallScore}/1000`}
                onPress={() => router.push(APP_ROUTES.athleteDetail(p.athleteId))}
              />
            ))}
          </FormSection>

          <FormSection title={t('teamIntelligence.playerRankings')}>
            {rankings.map((ranking) => (
              <View key={ranking.category} style={{ marginBottom: theme.spacing.md }}>
                <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: 6, textAlign: textAlign('start') }]}>
                  {t(rankingTitleKey[ranking.category] ?? ranking.category)}
                </Text>
                {ranking.entries.slice(0, 3).map((entry) => (
                  <PlayerRow
                    key={`${ranking.category}-${entry.athleteId}`}
                    name={`#${entry.rank} ${entry.athleteName ?? entry.athleteId}`}
                    meta={t(rankingTitleKey[ranking.category] ?? ranking.category)}
                    value={entry.displayValue}
                    onPress={() => router.push(APP_ROUTES.athleteDetail(entry.athleteId))}
                  />
                ))}
              </View>
            ))}
          </FormSection>

          <FormSection title={t('teamIntelligence.playersAtRisk')}>
            {playersAtRisk.length === 0 ? (
              <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{t('teamIntelligence.noRisk')}</Text>
            ) : (
              playersAtRisk.map((p) => (
                <PlayerRow key={p.athleteId} name={p.athleteName} meta={p.position} value={`${p.injuryRisk}%`} onPress={() => router.push(APP_ROUTES.athleteDetail(p.athleteId))} />
              ))
            )}
          </FormSection>

          <FormSection title={t('teamIntelligence.watchlists')}>
            <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: 6, textAlign: textAlign('start') }]}>{t('teamIntelligence.fatigueWatch')}</Text>
            {fatigueWatchlist.map((p) => (
              <PlayerRow key={`f-${p.athleteId}`} name={p.athleteName} meta={p.position} value={`${p.fatigue}%`} />
            ))}
            <Text style={[type.label, { color: theme.colors.textSecondary, marginVertical: 6, textAlign: textAlign('start') }]}>{t('teamIntelligence.recoveryWatch')}</Text>
            {recoveryWatchlist.map((p) => (
              <PlayerRow key={`r-${p.athleteId}`} name={p.athleteName} meta={p.position} value={`${p.recovery}%`} />
            ))}
          </FormSection>

          <FormSection title={t('teamIntelligence.readinessDistribution')}>
            <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
              {readinessDistribution.map((b) => (
                <Card key={b.id} variant="outlined" padding="md" style={{ minWidth: 80, borderRadius: 12 }}>
                  <Text style={[type.h5, { color: theme.colors.text }]}>{b.count}</Text>
                  <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t(b.labelKey)}</Text>
                </Card>
              ))}
            </View>
          </FormSection>

          <FormSection title={t('teamIntelligence.positionAnalysis')}>
            {positionAnalysis.map((pos) => (
              <Card key={pos.id} variant="outlined" padding="md" style={{ borderRadius: 12, marginBottom: 8 }}>
                <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>{t(pos.labelKey)} · {pos.playerCount}</Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
                  {t('teamIntelligence.posScore', { score: pos.avgOverallScore, readiness: pos.avgReadiness, risk: pos.avgInjuryRisk })}
                </Text>
                {pos.keyWeaknessLabelKey ? (
                  <Text style={[type.caption, { color: theme.colors.warning, marginTop: 4, textAlign: textAlign('start') }]}>
                    {t('teamIntelligence.keyWeakness')}: {t(pos.keyWeaknessLabelKey)}
                  </Text>
                ) : null}
              </Card>
            ))}
          </FormSection>

          <FormSection title={t('teamIntelligence.teamTrends')}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'flex-end', height: 64, gap: 8 }}>
              {trends.map((pt) => {
                const h = Math.max(12, Math.min(56, (pt.overallScore / 1000) * 56));
                return (
                  <View key={pt.labelKey} style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ width: 16, height: h, backgroundColor: theme.colors.primary, borderRadius: 4, opacity: 0.85 }} />
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, fontSize: 9, textAlign: textAlign('center') }]}>{t(pt.labelKey)}</Text>
                  </View>
                );
              })}
            </View>
          </FormSection>

          {alerts.length > 0 && (
            <FormSection title={t('teamIntelligence.alertsTitle')}>
              {alerts.map((alert, i) => (
                <Card key={`${alert.id}-${alert.athleteId ?? i}`} variant="outlined" padding="md" style={{ borderRadius: 12, marginBottom: 8, borderColor: alert.severity === 'high' ? theme.colors.error : theme.colors.warning }}>
                  <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8 }}>
                    <Ionicons name="warning" size={16} color={alert.severity === 'high' ? theme.colors.error : theme.colors.warning} />
                    <View style={{ flex: 1 }}>
                      <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>{t(alert.titleKey)}</Text>
                      <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
                        {alert.athleteName ? `${alert.athleteName} · ` : ''}{t(alert.bodyKey)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </FormSection>
          )}

          <FormSection title={t('teamIntelligence.aiSummary')}>
            <Card variant="filled" padding="md" style={{ borderRadius: 12 }}>
              <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('start') }]}>{aiSummary}</Text>
            </Card>
          </FormSection>

          <FormSection title={t('teamIntelligence.staffRecommendations')}>
            {staffRecommendations.map((rec) => (
              <Card key={rec.id} variant="outlined" padding="md" style={{ borderRadius: 12, marginBottom: 8 }}>
                <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>{t(rec.titleKey)}</Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{t(rec.bodyKey)}</Text>
              </Card>
            ))}
          </FormSection>
        </>
      )}
    </View>
  );
}
