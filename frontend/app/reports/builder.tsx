import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { useAthleteById } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useFormAction } from '@/src/hooks/useFormAction';
import { buildDefaultReportSections, buildTeamIntelligenceReportSections } from '@/src/utils/moduleHelpers';
import type { MockReport } from '@/src/data/mock/types';

const REPORT_TYPES: MockReport['type'][] = ['athlete', 'team', 'session', 'custom'];

export default function ReportBuilderScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const addReport = useMockStore((s) => s.addReport);
  const { loading, success, run } = useFormAction();

  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState<MockReport['type']>('athlete');
  const [athleteId, setAthleteId] = useState(athletes[0]?.id ?? '');
  const [summary, setSummary] = useState('');
  const [athleteSummary, setAthleteSummary] = useState('');
  const [performanceTests, setPerformanceTests] = useState('');
  const [aiInsights, setAiInsights] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [overallScore, setOverallScore] = useState('');
  const [kpiSummary, setKpiSummary] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [decisionSupport, setDecisionSupport] = useState('');
  const [teamOverview, setTeamOverview] = useState('');
  const [teamRankings, setTeamRankings] = useState('');
  const [teamRiskPlayers, setTeamRiskPlayers] = useState('');
  const [teamPositionAnalysis, setTeamPositionAnalysis] = useState('');
  const [teamRecommendations, setTeamRecommendations] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>();

  const selectedAthlete = useAthleteById(athleteId);
  const athleteTests = useMemo(() => {
    if (!athleteId) return [];
    return tests.filter((tst) => tst.athlete_id === athleteId);
  }, [tests, athleteId]);

  const applySections = (sections: ReturnType<typeof buildDefaultReportSections> & Partial<ReturnType<typeof buildTeamIntelligenceReportSections>>) => {
    setAthleteSummary(sections.athlete_summary);
    setPerformanceTests(sections.performance_tests);
    setAiInsights(sections.ai_insights);
    setRecommendations(sections.recommendations);
    setOverallScore(sections.overall_score ?? '');
    setKpiSummary(sections.kpi_summary ?? '');
    setStrengths(sections.strengths ?? '');
    setWeaknesses(sections.weaknesses ?? '');
    setDecisionSupport(sections.decision_support ?? '');
    setTeamOverview(sections.team_overview ?? '');
    setTeamRankings(sections.team_rankings ?? '');
    setTeamRiskPlayers(sections.team_risk_players ?? '');
    setTeamPositionAnalysis(sections.team_position_analysis ?? '');
    setTeamRecommendations(sections.team_recommendations ?? '');
  };

  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);
  const reportContext = useMemo(() => {
    if (!athleteId) return undefined;
    const checkIn = dailyCheckIns
      .filter((c) => c.athlete_id === athleteId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    return { injuries: injuryRecords, checkIn, trainingPlans, nutritionLogs, bodyCompositionRecords, nutritionGoalSettings };
  }, [athleteId, injuryRecords, dailyCheckIns, trainingPlans, nutritionLogs, bodyCompositionRecords, nutritionGoalSettings]);

  const buildSections = () => {
    if (reportType === 'team') {
      const teamSections = buildTeamIntelligenceReportSections(
        athletes,
        tests,
        injuryRecords,
        dailyCheckIns,
        trainingPlans,
        nutritionLogs,
        bodyCompositionRecords,
        nutritionGoalSettings,
        t,
        isRTL
      );
      return {
        athlete_summary: summary.trim() || teamSections.team_overview?.slice(0, 120) || '',
        performance_tests: '',
        ai_insights: teamSections.team_overview ?? '',
        recommendations: teamSections.team_recommendations ?? '',
        ...teamSections,
      };
    }
    return buildDefaultReportSections(selectedAthlete, athleteTests, summary, isRTL, t, reportContext);
  };

  const autoFillSections = () => {
    applySections(buildSections());
  };

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(t('features.reports.titleRequired'));
      return;
    }
    run(() => {
      const sections = buildSections();
      const report = addReport({
        title: title.trim(),
        type: reportType,
        summary: summary.trim() || sections.athlete_summary.slice(0, 120),
        athlete_id: reportType === 'athlete' ? athleteId || undefined : undefined,
        sections: {
          athlete_summary: athleteSummary.trim() || sections.athlete_summary,
          performance_tests: performanceTests.trim() || sections.performance_tests,
          ai_insights: aiInsights.trim() || sections.ai_insights,
          recommendations: recommendations.trim() || sections.recommendations,
          overall_score: overallScore.trim() || sections.overall_score,
          kpi_summary: kpiSummary.trim() || sections.kpi_summary,
          strengths: strengths.trim() || sections.strengths,
          weaknesses: weaknesses.trim() || sections.weaknesses,
          decision_support: decisionSupport.trim() || sections.decision_support,
          team_overview: teamOverview.trim() || sections.team_overview,
          team_rankings: teamRankings.trim() || sections.team_rankings,
          team_risk_players: teamRiskPlayers.trim() || sections.team_risk_players,
          team_position_analysis: teamPositionAnalysis.trim() || sections.team_position_analysis,
          team_recommendations: teamRecommendations.trim() || sections.team_recommendations,
        },
      });
      setTimeout(() => router.replace(APP_ROUTES.reportDetail(report.id)), 600);
    });
  };

  return (
    <FeatureScrollScreen title={t('features.reports.builderTitle')}>
      <SuccessBanner message={t('features.reports.saved')} visible={success} />

      <FormSection title={t('features.reports.reportTitle')} subtitle={t('features.reports.builderSubtitle')}>
        <Input
          label={t('features.reports.reportTitle')}
          value={title}
          onChangeText={(v) => {
            setTitle(v);
            setTitleError(undefined);
          }}
          error={titleError}
        />
        <Input
          label={t('features.reports.summary')}
          value={summary}
          onChangeText={setSummary}
          multiline
          containerStyle={{ marginTop: theme.spacing.md }}
          style={{ minHeight: 72, textAlignVertical: 'top' }}
        />
      </FormSection>

      <FormSection title={t('features.reports.reportType')}>
        <View style={[{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }]}>
          {REPORT_TYPES.map((rt) => (
            <Button
              key={rt}
              title={t(`features.reports.types.${rt}`)}
              onPress={() => setReportType(rt)}
              variant={reportType === rt ? 'primary' : 'outline'}
              size="small"
            />
          ))}
        </View>
      </FormSection>

      {reportType === 'athlete' && athletes.length > 0 && (
        <FormSection title={t('features.reports.selectAthlete')} subtitle={t('features.reports.selectAthleteHint')}>
          <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
            {athletes.map((a) => (
              <Button
                key={a.id}
                title={`${a.first_name} ${a.last_name}`}
                onPress={() => setAthleteId(a.id)}
                variant={athleteId === a.id ? 'secondary' : 'outline'}
                size="small"
              />
            ))}
          </View>
        </FormSection>
      )}

      <FormSection title={t('features.reports.sectionsTitle')} subtitle={t('features.reports.sectionsSubtitle')}>
        <Button title={t('features.reports.autoFill')} onPress={autoFillSections} variant="outline" size="small" style={{ marginBottom: theme.spacing.md }} />
        <Input label={t('features.reports.sectionOverallScore')} value={overallScore} onChangeText={setOverallScore} multiline style={{ minHeight: 56, textAlignVertical: 'top' }} />
        <Input label={t('features.reports.sectionKpiSummary')} value={kpiSummary} onChangeText={setKpiSummary} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 88, textAlignVertical: 'top' }} />
        <Input label={t('features.reports.sectionAthleteSummary')} value={athleteSummary} onChangeText={setAthleteSummary} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 72, textAlignVertical: 'top' }} />
        <Input label={t('features.reports.sectionPerformanceTests')} value={performanceTests} onChangeText={setPerformanceTests} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 88, textAlignVertical: 'top' }} />
        <Input label={t('features.reports.sectionStrengths')} value={strengths} onChangeText={setStrengths} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 72, textAlignVertical: 'top' }} />
        <Input label={t('features.reports.sectionWeaknesses')} value={weaknesses} onChangeText={setWeaknesses} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 72, textAlignVertical: 'top' }} />
        <Input label={t('features.reports.sectionAiInsights')} value={aiInsights} onChangeText={setAiInsights} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 88, textAlignVertical: 'top' }} />
        <Input label={t('features.reports.sectionRecommendations')} value={recommendations} onChangeText={setRecommendations} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 88, textAlignVertical: 'top' }} />
        <Input label={t('features.reports.sectionDecisionSupport')} value={decisionSupport} onChangeText={setDecisionSupport} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 72, textAlignVertical: 'top' }} />
        {reportType === 'team' ? (
          <>
            <Input label={t('features.reports.sectionTeamOverview')} value={teamOverview} onChangeText={setTeamOverview} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 88, textAlignVertical: 'top' }} />
            <Input label={t('features.reports.sectionTeamRankings')} value={teamRankings} onChangeText={setTeamRankings} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 88, textAlignVertical: 'top' }} />
            <Input label={t('features.reports.sectionTeamRiskPlayers')} value={teamRiskPlayers} onChangeText={setTeamRiskPlayers} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 72, textAlignVertical: 'top' }} />
            <Input label={t('features.reports.sectionTeamPositionAnalysis')} value={teamPositionAnalysis} onChangeText={setTeamPositionAnalysis} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 88, textAlignVertical: 'top' }} />
            <Input label={t('features.reports.sectionTeamRecommendations')} value={teamRecommendations} onChangeText={setTeamRecommendations} multiline containerStyle={{ marginTop: 12 }} style={{ minHeight: 88, textAlignVertical: 'top' }} />
          </>
        ) : null}
      </FormSection>

      <Button
        title={loading ? t('common.saving') : t('common.save')}
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        fullWidth
        icon="document-text"
      />
    </FeatureScrollScreen>
  );
}
