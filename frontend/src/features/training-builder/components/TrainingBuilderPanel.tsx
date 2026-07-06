import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { FormSection } from '@/src/components/common/FormSection';
import { Button } from '@/src/components/common/Button';
import { APP_ROUTES } from '@/src/core/constants/routes';
import type { TrainingBuilderSnapshot } from '../types';
import { sessionDisplayTitle } from '../utils/sessionDisplay';
import { templateLabelKey } from '../utils/templateLabelKey';
import { WEEKDAY_ORDER } from '../registry/trainingTemplates';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface TrainingBuilderPanelProps {
  snapshot: TrainingBuilderSnapshot;
  athleteId?: string;
  onGenerate?: () => void;
  generating?: boolean;
}

function acwrColor(zone: string): string {
  if (zone === 'danger') return '#EF4444';
  if (zone === 'high') return '#F97316';
  if (zone === 'low') return '#0EA5E9';
  return '#10B981';
}

function priorityColor(p: string): string {
  if (p === 'high') return '#EF4444';
  if (p === 'medium') return '#F97316';
  return '#64748B';
}

export function TrainingBuilderPanel({ snapshot, athleteId, onGenerate, generating }: TrainingBuilderPanelProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { plan, todaySession, load, compliance, progressPercent, recommendations, weeklyOverview } = snapshot;
  const locale = i18n.language.startsWith('ar') ? 'ar' : 'en';

  return (
    <View>
      {!plan && onGenerate ? (
        <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg }}>
          <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start'), marginBottom: theme.spacing.md }]}>
            {t('trainingBuilder.noPlan')}
          </Text>
          <Button title={t('trainingBuilder.generatePlan')} onPress={onGenerate} loading={generating} />
        </Card>
      ) : null}

      {plan ? (
        <>
          <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg }}>
            <Text style={[type.overline, { color: theme.colors.textSecondary, letterSpacing: 1.2, textAlign: textAlign('start') }]}>
              {t('trainingBuilder.loadTitle')}
            </Text>
            <View style={{ flexDirection: flexRow(true), marginTop: theme.spacing.md, flexWrap: 'wrap', gap: theme.spacing.md }}>
              <View style={{ minWidth: 90 }}>
                <Text style={[type.h4, { color: theme.colors.text }]}>{load.sessionLoad}</Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.sessionLoad')}</Text>
              </View>
              <View style={{ minWidth: 90 }}>
                <Text style={[type.h4, { color: theme.colors.text }]}>{load.weeklyActualLoad}</Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.weeklyActualLoad')}</Text>
              </View>
              <View style={{ minWidth: 90 }}>
                <Text style={[type.h4, { color: theme.colors.textTertiary }]}>{load.weeklyPlannedLoad}</Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.weeklyPlannedLoad')}</Text>
              </View>
              <View style={{ minWidth: 90 }}>
                <Text style={[type.h4, { color: theme.colors.text }]}>{load.acuteLoad}</Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.acuteLoad')}</Text>
              </View>
              <View style={{ minWidth: 90 }}>
                <Text style={[type.h4, { color: theme.colors.text }]}>{load.chronicLoad}</Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.chronicLoad')}</Text>
              </View>
              <View style={{ minWidth: 90 }}>
                <Text style={[type.h4, { color: acwrColor(load.acwrZone) }]}>{load.acwr.toFixed(2)}</Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.acwr')}</Text>
              </View>
            </View>
            <Text style={[type.caption, { color: acwrColor(load.acwrZone), marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
              {t(`trainingBuilder.acwrZone.${load.acwrZone}`)} · {t('trainingBuilder.complianceTitle')}: {compliance.compliancePercent}%
            </Text>
          </Card>

          {todaySession ? (
            <FormSection title={t('trainingBuilder.todaySession')} subtitle={todaySession.date}>
              <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
                <Text style={[type.body, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>
                  {sessionDisplayTitle(todaySession, locale)}
                </Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
                  {t(`trainingBuilder.execution.status.${todaySession.status}`)} · {load.sessionLoad}/{load.sessionPlannedLoad} AU
                </Text>
                {athleteId && (todaySession.status === 'planned' || todaySession.execution) ? (
                  <TouchableOpacity
                    onPress={() => router.push(APP_ROUTES.logTrainingSession(todaySession.id, athleteId))}
                    style={{ marginTop: theme.spacing.sm }}
                  >
                    <Text style={[type.bodySm, { color: theme.colors.primary, fontWeight: '600' }]}>
                      {t('trainingBuilder.execution.logToday')}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {[todaySession.warmUp, todaySession.mainSection, todaySession.accessoryWork, todaySession.conditioning, todaySession.recovery].map(
                  (section) => (
                    <View key={section.titleKey} style={{ marginTop: theme.spacing.sm }}>
                      <Text style={[type.label, { color: theme.colors.primary, textAlign: textAlign('start') }]}>{t(section.titleKey)}</Text>
                      {section.items.slice(0, 2).map((item) => (
                        <Text key={item.nameKey} style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
                          • {t(item.nameKey)}
                          {item.sets ? ` · ${item.sets}×${item.reps ?? ''}` : ''}
                        </Text>
                      ))}
                    </View>
                  )
                )}
              </Card>
            </FormSection>
          ) : null}

          <FormSection title={t('trainingBuilder.weeklyPlan')} subtitle={t('trainingBuilder.weeklyPlanHint')}>
            <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {WEEKDAY_ORDER.map((day) => {
                const entry = weeklyOverview.find((w) => w.weekday === day.id);
                const isToday = todaySession?.weekday === day.id;
                return (
                  <Card
                    key={day.id}
                    variant={isToday ? 'elevated' : 'outlined'}
                    padding="sm"
                    style={{
                      borderRadius: theme.borderRadius.lg,
                      minWidth: 88,
                      borderColor: isToday ? theme.colors.primary : undefined,
                    }}
                  >
                    <Text style={[type.caption, { color: theme.colors.textSecondary, fontWeight: '600' }]}>{t(day.labelKey)}</Text>
                    <Text style={[type.bodySm, { color: theme.colors.text, marginTop: 2, textAlign: textAlign('start') }]} numberOfLines={1}>
                      {entry ? t(templateLabelKey(entry.templateId)) : '—'}
                    </Text>
                    {entry ? (
                      <Text style={[type.caption, { color: theme.colors.textTertiary }]}>{entry.load} AU</Text>
                    ) : null}
                  </Card>
                );
              })}
            </View>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginTop: theme.spacing.md, gap: 8 }}>
              <Ionicons name="trending-up" size={16} color={theme.colors.primary} />
              <Text style={[type.bodySm, { color: theme.colors.text }]}>{t('trainingBuilder.progress', { percent: progressPercent })}</Text>
            </View>
          </FormSection>

          {onGenerate ? (
            <Button
              title={t('trainingBuilder.regeneratePlan')}
              variant="outline"
              onPress={onGenerate}
              loading={generating}
              style={{ marginBottom: theme.spacing.lg }}
            />
          ) : null}
        </>
      ) : null}

      <FormSection title={t('trainingBuilder.recommendationsTitle')}>
        {recommendations.length === 0 ? (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.allGood')}</Text>
        ) : (
          recommendations.map((rec) => (
            <Card key={rec.id} variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm, borderStartWidth: 3, borderStartColor: priorityColor(rec.priority) }}>
              <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>{t(rec.titleKey)}</Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{t(rec.bodyKey)}</Text>
            </Card>
          ))
        )}
      </FormSection>
    </View>
  );
}
