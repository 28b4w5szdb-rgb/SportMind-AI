import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { FormSection } from '@/src/components/common/FormSection';
import type { SportsMedicineSnapshot } from '../types';
import { RTP_PHASES } from '../registry/rtpPhases';
import { InjuryAlertsBanner } from './InjuryAlertsBanner';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface SportsMedicinePanelProps {
  snapshot: SportsMedicineSnapshot;
}

function riskColor(score: number): string {
  if (score >= 65) return '#EF4444';
  if (score >= 50) return '#F97316';
  if (score >= 35) return '#0066FF';
  return '#10B981';
}

export function SportsMedicinePanel({ snapshot }: SportsMedicinePanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { profile, primaryInjury, rehabPlan, rtpProgress, nextCriteriaKey } = snapshot;

  const regions: Array<{ key: keyof typeof profile.regional; labelKey: string }> = [
    { key: 'hamstring', labelKey: 'sportsMedicine.regions.hamstring' },
    { key: 'knee', labelKey: 'sportsMedicine.regions.knee' },
    { key: 'ankle', labelKey: 'sportsMedicine.regions.ankle' },
    { key: 'groin', labelKey: 'sportsMedicine.regions.groin' },
    { key: 'shoulder', labelKey: 'sportsMedicine.regions.shoulder' },
    { key: 'back', labelKey: 'sportsMedicine.regions.back' },
  ];

  return (
    <View>
      <InjuryAlertsBanner alerts={profile.alerts} />

      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg }}>
        <Text style={[type.overline, { color: theme.colors.textSecondary, letterSpacing: 1.2, textAlign: textAlign('start') }]}>
          {t('sportsMedicine.overview')}
        </Text>
        <View style={{ flexDirection: flexRow(true), marginTop: theme.spacing.md, gap: theme.spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Text style={[type.h3, { color: riskColor(profile.regional.overall) }]}>{profile.regional.overall}%</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('sportsMedicine.overallRisk')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.h4, { color: theme.colors.text }]}>{profile.activeInjuries.length}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('sportsMedicine.activeCount')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.h4, { color: theme.colors.text }]}>{profile.resolvedCount}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('sportsMedicine.historyCount')}</Text>
          </View>
        </View>
      </Card>

      <FormSection title={t('sportsMedicine.regionRisk')} subtitle={t('sportsMedicine.regionRiskHint')}>
        {regions.map(({ key, labelKey }) => (
          <View key={key} style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: 8 }}>
            <Text style={[type.bodySm, { color: theme.colors.textSecondary, width: 100, textAlign: textAlign('start') }]}>{t(labelKey)}</Text>
            <View style={{ flex: 1, height: 8, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: `${profile.regional[key]}%`, height: 8, backgroundColor: riskColor(profile.regional[key]) }} />
            </View>
            <Text style={[type.caption, { color: theme.colors.text, width: 36, textAlign: 'right' }]}>{profile.regional[key]}</Text>
          </View>
        ))}
      </FormSection>

      <FormSection title={t('sportsMedicine.activeInjuries')}>
        {profile.activeInjuries.length === 0 ? (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{t('sportsMedicine.noActiveInjuries')}</Text>
        ) : (
          profile.activeInjuries.map((inj) => (
            <Card key={inj.id} variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
              <Text style={[type.body, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>
                {t(`sportsMedicine.regions.${inj.body_region}`)} · {t(`sportsMedicine.severity.${inj.severity_grade}`)}
              </Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
                {inj.injury_date} · {t(`sportsMedicine.status.${inj.status}`)} · {t('sportsMedicine.pain')}: {inj.pain_level}/10
              </Text>
            </Card>
          ))
        )}
      </FormSection>

      {primaryInjury ? (
        <FormSection title={t('sportsMedicine.rtpTitle')} subtitle={t('sportsMedicine.rtpSubtitle')}>
          <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>
              {t(RTP_PHASES.find((p) => p.id === primaryInjury.rtp_phase)?.labelKey ?? 'sportsMedicine.rtp.phase1')}
            </Text>
            <View style={{ height: 8, backgroundColor: theme.colors.border, borderRadius: 4, marginTop: 10, overflow: 'hidden' }}>
              <View style={{ width: `${rtpProgress}%`, height: 8, backgroundColor: theme.colors.primary }} />
            </View>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 8, textAlign: textAlign('start') }]}>
              {t('sportsMedicine.rtpProgress', { percent: rtpProgress })}
            </Text>
            {nextCriteriaKey ? (
              <Text style={[type.caption, { color: theme.colors.primary, marginTop: 6, textAlign: textAlign('start') }]}>
                {t('sportsMedicine.nextCriteria')}: {t(nextCriteriaKey)}
              </Text>
            ) : null}
          </Card>
          {RTP_PHASES.map((phase) => {
            const currentIdx = RTP_PHASES.findIndex((p) => p.id === primaryInjury.rtp_phase);
            const done = phase.order <= RTP_PHASES[currentIdx]?.order;
            return (
              <View key={phase.id} style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={done ? theme.colors.success : theme.colors.textTertiary} />
                <Text style={[type.caption, { color: done ? theme.colors.text : theme.colors.textTertiary }]}>{t(phase.labelKey)}</Text>
              </View>
            );
          })}
        </FormSection>
      ) : null}

      {rehabPlan ? (
        <FormSection title={t('sportsMedicine.rehabTitle')} subtitle={t(rehabPlan.conditionKey)}>
          {rehabPlan.phases.slice(0, 2).map((phase) => (
            <Card key={phase.phaseId} variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
              <Text style={[type.bodySm, { fontWeight: '700', color: theme.colors.text, textAlign: textAlign('start') }]}>{t(phase.goalKey)}</Text>
              {phase.exerciseKeys.map((ex) => (
                <Text key={ex} style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>• {t(ex)}</Text>
              ))}
              <Text style={[type.caption, { color: theme.colors.warning, marginTop: 6, textAlign: textAlign('start') }]}>
                {phase.precautionKeys.map((p) => t(p)).join(' · ')}
              </Text>
            </Card>
          ))}
        </FormSection>
      ) : null}

      <FormSection title={t('sportsMedicine.preventionTitle')}>
        {profile.preventionKeys.map((key) => (
          <Text key={key} style={[type.bodySm, { color: theme.colors.textSecondary, marginBottom: 6, textAlign: textAlign('start') }]}>• {t(key)}</Text>
        ))}
      </FormSection>

      <Card variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.lg }}>
        <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>{t('sportsMedicine.medicalNotesTitle')}</Text>
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{t('sportsMedicine.medicalNotesBody')}</Text>
      </Card>
    </View>
  );
}
