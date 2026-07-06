import React, { useMemo } from 'react';
import { View, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { useAthleteById, useReportById } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useFormAction } from '@/src/hooks/useFormAction';
import { reportStatusVariant } from '@/src/utils/moduleHelpers';
import type { MockReportSections } from '@/src/data/mock/types';

function resolveSections(report: { summary: string; sections?: MockReportSections }): MockReportSections {
  if (report.sections) return report.sections;
  return {
    athlete_summary: report.summary,
    performance_tests: '',
    ai_insights: '',
    recommendations: '',
  };
}

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const report = useReportById(id);
  const athlete = useAthleteById(report?.athlete_id);
  const updateReport = useMockStore((s) => s.updateReport);
  const { loading, success, run } = useFormAction();

  const sections = useMemo(() => (report ? resolveSections(report) : null), [report]);

  if (!report || !sections) {
    return (
      <FeatureScrollScreen title={t('features.reports.detailTitle')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  const exportPlaceholder = (format: string) => {
    Alert.alert(
      t('features.reports.exportTitle', { format }),
      isRTL ? `تصدير ${format} سيتوفر عند ربط التخزين.` : `${format} export will be available when storage is connected.`
    );
  };

  const markReady = () => {
    run(() => updateReport(report.id, { status: 'ready' }));
  };

  const markExported = () => {
    run(() => updateReport(report.id, { status: 'exported' }));
  };

  const sectionBlocks = [
    { key: 'overall_score', title: t('features.reports.sectionOverallScore'), body: sections.overall_score, icon: 'trophy' as const },
    { key: 'kpi_summary', title: t('features.reports.sectionKpiSummary'), body: sections.kpi_summary, icon: 'stats-chart' as const },
    { key: 'athlete_summary', title: t('features.reports.sectionAthleteSummary'), body: sections.athlete_summary, icon: 'person' as const },
    { key: 'performance_tests', title: t('features.reports.sectionPerformanceTests'), body: sections.performance_tests, icon: 'analytics' as const },
    { key: 'strengths', title: t('features.reports.sectionStrengths'), body: sections.strengths, icon: 'arrow-up' as const },
    { key: 'weaknesses', title: t('features.reports.sectionWeaknesses'), body: sections.weaknesses, icon: 'arrow-down' as const },
    { key: 'ai_insights', title: t('features.reports.sectionAiInsights'), body: sections.ai_insights, icon: 'sparkles' as const },
    { key: 'recommendations', title: t('features.reports.sectionRecommendations'), body: sections.recommendations, icon: 'bulb' as const },
    { key: 'decision_support', title: t('features.reports.sectionDecisionSupport'), body: sections.decision_support, icon: 'checkmark-circle' as const },
    { key: 'ssid_interpretation', title: t('features.reports.sectionSsidInterpretation'), body: sections.ssid_interpretation, icon: 'flask' as const },
    { key: 'ssid_decision', title: t('features.reports.sectionSsidDecision'), body: sections.ssid_decision, icon: 'shield-checkmark' as const },
    { key: 'ssid_recommendations', title: t('features.reports.sectionSsidRecommendations'), body: sections.ssid_recommendations, icon: 'list' as const },
    { key: 'ssid_reference', title: t('features.reports.sectionSsidReference'), body: sections.ssid_reference, icon: 'document-text' as const },
    { key: 'injury_summary', title: t('features.reports.sectionInjurySummary'), body: sections.injury_summary, icon: 'medkit' as const },
    { key: 'rtp_status', title: t('features.reports.sectionRtpStatus'), body: sections.rtp_status, icon: 'walk' as const },
    { key: 'prevention_recommendations', title: t('features.reports.sectionPrevention'), body: sections.prevention_recommendations, icon: 'shield-checkmark' as const },
    { key: 'training_summary', title: t('features.reports.sectionTrainingSummary'), body: sections.training_summary, icon: 'barbell' as const },
    { key: 'training_compliance_summary', title: t('features.reports.sectionTrainingCompliance'), body: sections.training_compliance_summary, icon: 'checkmark-done' as const },
    { key: 'nutrition_summary', title: t('features.reports.sectionNutritionSummary'), body: sections.nutrition_summary, icon: 'nutrition' as const },
    { key: 'nutrition_hydration_status', title: t('features.reports.sectionNutritionHydration'), body: sections.nutrition_hydration_status, icon: 'water' as const },
    { key: 'nutrition_body_comp_trend', title: t('features.reports.sectionNutritionBodyComp'), body: sections.nutrition_body_comp_trend, icon: 'body' as const },
    { key: 'nutrition_recommendations', title: t('features.reports.sectionNutritionRecommendations'), body: sections.nutrition_recommendations, icon: 'bulb' as const },
    { key: 'wearable_summary', title: t('features.reports.sectionWearableSummary'), body: sections.wearable_summary, icon: 'watch' as const },
    { key: 'team_overview', title: t('features.reports.sectionTeamOverview'), body: sections.team_overview, icon: 'people' as const },
    { key: 'team_rankings', title: t('features.reports.sectionTeamRankings'), body: sections.team_rankings, icon: 'podium' as const },
    { key: 'team_risk_players', title: t('features.reports.sectionTeamRiskPlayers'), body: sections.team_risk_players, icon: 'warning' as const },
    { key: 'team_position_analysis', title: t('features.reports.sectionTeamPositionAnalysis'), body: sections.team_position_analysis, icon: 'grid' as const },
    { key: 'team_recommendations', title: t('features.reports.sectionTeamRecommendations'), body: sections.team_recommendations, icon: 'bulb' as const },
  ].filter((block) => block.body);

  return (
    <FeatureScrollScreen title={t('features.reports.detailTitle')}>
      <SuccessBanner message={t('features.reports.updated')} visible={success} />

      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, ...theme.shadows.md }}>
        <Text style={[type.h4, { color: theme.colors.text, textAlign: textAlign('start') }]}>{report.title}</Text>
        <View style={{ flexDirection: flexRow(true), gap: 8, marginTop: theme.spacing.sm, flexWrap: 'wrap' }}>
          <Badge label={t(`features.reports.types.${report.type}`)} variant="info" />
          <Badge label={t(`features.reports.status.${report.status}`)} variant={reportStatusVariant(report.status)} />
        </View>
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
          {new Date(report.created_at).toLocaleString(isRTL ? 'ar' : 'en')}
        </Text>
        {athlete ? (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 8, textAlign: textAlign('start') }]}>
            {athlete.first_name} {athlete.last_name} · {athlete.position}
          </Text>
        ) : null}
        {report.summary ? (
          <Text style={[type.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.md, textAlign: textAlign('start') }]}>{report.summary}</Text>
        ) : null}
      </Card>

      {sectionBlocks.map((block) => (
        <FormSection key={block.key} title={block.title}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
            <Ionicons name={block.icon} size={20} color={theme.colors.primary} style={{ marginTop: 2 }} />
            <Text style={[type.body, { color: theme.colors.text, flex: 1, marginStart: theme.spacing.sm, textAlign: textAlign('start'), lineHeight: 22 }]}>
              {block.body || '—'}
            </Text>
          </View>
        </FormSection>
      ))}

      <FormSection title={t('features.reports.exportSection')}>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
          <Button title="PDF" onPress={() => exportPlaceholder('PDF')} variant="outline" size="small" icon="document" />
          <Button title="Word" onPress={() => exportPlaceholder('Word')} variant="outline" size="small" icon="document-text" />
          <Button title="Excel" onPress={() => exportPlaceholder('Excel')} variant="outline" size="small" icon="grid" />
        </View>
      </FormSection>

      <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
        {report.status === 'draft' && (
          <Button title={t('features.reports.markReady')} onPress={markReady} loading={loading} disabled={loading} variant="primary" style={{ flex: 1 }} icon="checkmark-circle" />
        )}
        {report.status === 'ready' && (
          <Button title={t('features.reports.markExported')} onPress={markExported} loading={loading} disabled={loading} variant="secondary" style={{ flex: 1 }} icon="download" />
        )}
      </View>
      <Button title={t('common.back')} onPress={() => router.replace(APP_ROUTES.reports)} variant="ghost" fullWidth style={{ marginTop: theme.spacing.md }} />
    </FeatureScrollScreen>
  );
}
