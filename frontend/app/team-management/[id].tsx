import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ReadinessScore } from '@/src/components/features/ReadinessScore';
import { useTeamById, useTeamRoster } from '@/src/data/mock/hooks';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { computeReadinessScore, readinessLabel } from '@/src/utils/athleteMetrics';
import { computeTeamLoadSummary } from '@/src/utils/teamMetrics';
import { TeamIntelligencePanel, useTeamIntelligence } from '@/src/features/team-intelligence';

const DEFAULT_STAFF = [
  { roleKey: 'features.team.assistantCoach', name: '—' },
  { roleKey: 'features.team.physio', name: '—' },
  { roleKey: 'features.team.analyst', name: '—' },
];

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const team = useTeamById(id);
  const roster = useTeamRoster(team);

  const summary = useMemo(() => computeTeamLoadSummary(roster), [roster]);
  const teamIntel = useTeamIntelligence(id);

  const staff = useMemo(() => {
    if (!team) {
      return DEFAULT_STAFF.map((p) => ({ role: t(p.roleKey), name: p.name }));
    }

    const base = team.staff?.length
      ? team.staff.map((member) => ({ role: member.role, name: member.name }))
      : team.head_coach
        ? [{ role: t('features.team.headCoach'), name: team.head_coach }]
        : [];

    const placeholders = DEFAULT_STAFF.filter(
      (p) => !base.some((s) => s.role.toLowerCase().includes(t(p.roleKey).split(' ')[0].toLowerCase()))
    ).map((p) => ({ role: t(p.roleKey), name: p.name }));

    return [...base, ...placeholders];
  }, [team, t]);

  if (!team) {
    return (
      <FeatureScrollScreen title={t('features.team.detailTitle')}>
        <EmptyState icon="people-outline" title={t('features.team.notFoundTitle')} description={t('features.team.notFoundDesc')} />
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('features.team.detailTitle')}>
      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, ...theme.shadows.md }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <LinearGradient colors={['#0066FF', '#0D9488']} style={{ width: 64, height: 64, borderRadius: theme.borderRadius.xl, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="shield" size={30} color="#FFF" />
          </LinearGradient>
          <View style={{ flex: 1, marginStart: theme.spacing.md }}>
            <Text style={[type.h3, { color: theme.colors.text, textAlign: textAlign('start') }]}>{team.name}</Text>
            <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{team.sport}</Text>
            {team.head_coach ? (
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
                {t('features.team.headCoach')}: {team.head_coach}
              </Text>
            ) : null}
          </View>
          <ReadinessScore score={summary.avgReadiness} label={readinessLabel(summary.avgReadiness, isRTL)} size="md" />
        </View>
      </Card>

      <FormSection title={t('features.team.loadSummary')} subtitle={t('features.team.loadSummaryHint')}>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {[
            { label: t('features.team.rosterSize'), value: summary.rosterSize },
            { label: t('features.team.activeCount'), value: summary.activeCount },
            { label: t('features.team.injuredCount'), value: summary.injuredCount },
            { label: t('features.team.avgTrend'), value: `${summary.avgTrend > 0 ? '+' : ''}${summary.avgTrend}%` },
          ].map((item) => (
            <Card key={item.label} variant="filled" padding="md" style={{ flex: 1, minWidth: '45%', borderRadius: theme.borderRadius.lg }}>
              <Text style={[type.numberSm, { color: theme.colors.text }]}>{item.value}</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>{item.label}</Text>
            </Card>
          ))}
        </View>
      </FormSection>

      <FormSection title={t('teamIntelligence.title')} subtitle={t('teamIntelligence.teamDetailHint')}>
        <TeamIntelligencePanel snapshot={teamIntel} compact showOpenLink />
      </FormSection>

      <FormSection title={t('features.team.rosterTitle')} subtitle={t('features.team.rosterSubtitle')}>
        {roster.length === 0 ? (
          <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{t('features.team.rosterEmpty')}</Text>
        ) : (
          roster.map((athlete) => (
            <TouchableOpacity key={athlete.id} activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.athleteDetail(athlete.id))}>
              <Card variant="outlined" padding="md" style={{ marginBottom: theme.spacing.sm, borderRadius: theme.borderRadius.lg }}>
                <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.primary + '15', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[type.label, { color: theme.colors.primary }]}>{athlete.first_name[0]}</Text>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: theme.spacing.sm }}>
                    <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                      {athlete.first_name} {athlete.last_name}
                    </Text>
                    <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{athlete.position}</Text>
                  </View>
                  <Badge
                    label={t(`features.athletes.status.${athlete.status}`)}
                    variant={athlete.status === 'active' ? 'success' : athlete.status === 'injured' ? 'warning' : 'info'}
                  />
                  <Text style={[type.caption, { color: theme.colors.primary, marginStart: 8 }]}>{computeReadinessScore(athlete)}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </FormSection>

      <FormSection title={t('features.team.staffTitle')} subtitle={t('features.team.staffSubtitle')}>
        {staff.map((member, i) => (
          <View
            key={`${member.role}-${i}`}
            style={{
              flexDirection: flexRow(true),
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: i < staff.length - 1 ? 1 : 0,
              borderBottomColor: theme.colors.border,
            }}
          >
            <Ionicons name="person-circle-outline" size={22} color={theme.colors.textTertiary} />
            <View style={{ flex: 1, marginHorizontal: theme.spacing.sm }}>
              <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>{member.role}</Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{member.name}</Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={member.role}
              onPress={() => Alert.alert(member.role, t('features.team.staffRoleComingSoon'))}
            >
              <Ionicons name="create-outline" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </FormSection>

      <Button title={t('common.back')} onPress={() => router.replace(APP_ROUTES.teamManagement)} variant="ghost" fullWidth />
    </FeatureScrollScreen>
  );
}
