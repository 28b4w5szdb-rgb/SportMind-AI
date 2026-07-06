import type { TFunction } from 'i18next';

import type { MockAthlete, MockPerformanceTest, MockReportSections, DailyCheckIn, InjuryRecord, DailyNutritionLog, BodyCompositionRecord, NutritionGoalSetting } from '@/src/data/mock/types';
import { computeAthleteAnalytics } from '@/src/analytics';
import { buildRawSignals } from '@/src/analytics/input/buildSignals';
import { buildAnalyticsReportSections } from '@/src/analytics/summary/teamOverview';
import { buildSportsMedicineSnapshot } from '@/src/features/sports-medicine/utils/sportsMedicineHelpers';
import { RTP_PHASES } from '@/src/features/sports-medicine/registry/rtpPhases';
import { buildTrainingBuilderSnapshot } from '@/src/features/training-builder/utils/trainingHelpers';
import { templateLabelKey } from '@/src/features/training-builder/utils/templateLabelKey';
import { buildAthleteNutritionSnapshot } from '@/src/features/nutrition/utils/nutritionHelpers';
import { NUTRITION_GOALS } from '@/src/features/nutrition/registry/nutritionCatalog';
import { computeTeamIntelligence } from '@/src/features/team-intelligence';
import { buildWorkspaceSsidEntries, formatSsidReportSections } from '@/src/features/ssid-engine';
import type { TrainingPlan } from '@/src/features/training-builder/types';

export function buildPerformanceTestsSummary(tests: MockPerformanceTest[], isRTL: boolean): string {
  if (tests.length === 0) {
    return isRTL ? 'لا توجد اختبارات مسجلة بعد.' : 'No performance tests recorded yet.';
  }
  return tests
    .slice(0, 6)
    .map((t) => `${t.test_type}: ${t.value} ${t.unit} (${t.date})`)
    .join('\n');
}

export function buildAthleteSummary(athlete: MockAthlete | undefined, isRTL: boolean): string {
  if (!athlete) {
    return isRTL ? 'لم يتم اختيار لاعب.' : 'No athlete selected.';
  }
  return isRTL
    ? `${athlete.first_name} ${athlete.last_name} — ${athlete.position}. الحالة: ${athlete.status}. الاختبارات: ${athlete.tests_count}. الاتجاه: ${athlete.trend_percent}%.`
    : `${athlete.first_name} ${athlete.last_name} — ${athlete.position}. Status: ${athlete.status}. Tests: ${athlete.tests_count}. Trend: ${athlete.trend_percent}%.`;
}

export function buildMockAiInsights(isRTL: boolean): string {
  return isRTL
    ? '• تحميل تدريبي ضمن النطاق المستهدف\n• استشفاء كافٍ خلال آخر 48 ساعة\n• مراقبة Yo-Yo قبل الجلسة القادمة'
    : '• Training load within target range\n• Adequate recovery over last 48h\n• Monitor Yo-Yo before next session block';
}

export function buildMockRecommendations(isRTL: boolean): string {
  return isRTL
    ? '1. الحفاظ على حجم التدريب الحالي\n2. جلسة movilidad قبل المباراة\n3. مراجعة التغذية بعد التمرين'
    : '1. Maintain current training volume\n2. Add mobility session pre-match\n3. Review post-training nutrition';
}

export function buildInjuryReportSections(
  athlete: MockAthlete,
  tests: MockPerformanceTest[],
  injuries: InjuryRecord[],
  checkIn: DailyCheckIn | undefined,
  t: TFunction,
  isRTL: boolean
): Pick<MockReportSections, 'injury_summary' | 'rtp_status' | 'prevention_recommendations'> {
  const athleteInjuries = injuries.filter((i) => i.athlete_id === athlete.id);
  const snapshot = buildSportsMedicineSnapshot({
    athlete,
    injuries: athleteInjuries,
    checkIn,
    signals: buildRawSignals(athlete, tests.filter((tst) => tst.athlete_id === athlete.id), checkIn),
  });

  const active = snapshot.profile.activeInjuries;
  const injurySummary = isRTL
    ? `إصابات نشطة: ${active.length}. مخاطر إجمالية: ${snapshot.profile.regional.overall}%.`
    : `Active injuries: ${active.length}. Overall risk: ${snapshot.profile.regional.overall}%.`;

  const rtpStatus = snapshot.primaryInjury
    ? isRTL
      ? `مرحلة RTP: ${snapshot.primaryInjury.rtp_phase} (${snapshot.rtpProgress}%)`
      : `RTP phase: ${t(RTP_PHASES.find((p) => p.id === snapshot.primaryInjury!.rtp_phase)?.labelKey ?? 'sportsMedicine.rtp.phase1')} (${snapshot.rtpProgress}%)`
    : isRTL
      ? 'لا توجد خطة RTP نشطة'
      : 'No active RTP plan';

  const preventionRecommendations = snapshot.profile.preventionKeys.map((key) => `• ${t(key)}`).join('\n');

  return { injury_summary: injurySummary, rtp_status: rtpStatus, prevention_recommendations: preventionRecommendations };
}

export function buildTrainingReportSections(
  athlete: MockAthlete,
  tests: MockPerformanceTest[],
  injuries: InjuryRecord[],
  checkIn: DailyCheckIn | undefined,
  trainingPlans: TrainingPlan[],
  t: TFunction,
  isRTL: boolean
): Pick<MockReportSections, 'training_summary' | 'training_compliance_summary'> {
  const athletePlans = trainingPlans.filter((p) => p.athlete_id === athlete.id);
  const analytics = computeAthleteAnalytics({
    athlete,
    tests: tests.filter((tst) => tst.athlete_id === athlete.id),
    checkIn,
    injuries: injuries.filter((i) => i.athlete_id === athlete.id),
    trainingPlans: athletePlans,
  });
  const snapshot = buildTrainingBuilderSnapshot(athlete, analytics, trainingPlans, injuries);
  const { plan, load, todaySession, compliance } = snapshot;

  if (!plan) {
    return {
      training_summary: isRTL ? 'لا يوجد برنامج تدريبي نشط.' : 'No active training program.',
      training_compliance_summary: isRTL ? 'لا بيانات امتثال.' : 'No compliance data.',
    };
  }

  const todayLabel = todaySession ? t(templateLabelKey(todaySession.templateId)) : t('trainingBuilder.restDay');
  const trainingSummary = isRTL
    ? `حمل فعلي: ${load.weeklyActualLoad} AU · مخطط: ${load.weeklyPlannedLoad} AU. ACWR: ${load.acwr.toFixed(2)}. اليوم: ${todayLabel}.`
    : `Actual load: ${load.weeklyActualLoad} AU · Planned: ${load.weeklyPlannedLoad} AU. ACWR: ${load.acwr.toFixed(2)}. Today: ${todayLabel}.`;

  const complianceSummary = isRTL
    ? `الامتثال: ${compliance.compliancePercent}%. مكتمل: ${compliance.completed}. تخطي: ${compliance.skipped}. معدّل: ${compliance.modified}. فائت: ${compliance.missed}.`
    : `Compliance: ${compliance.compliancePercent}%. Completed: ${compliance.completed}. Skipped: ${compliance.skipped}. Modified: ${compliance.modified}. Missed: ${compliance.missed}.`;

  return { training_summary: trainingSummary, training_compliance_summary: complianceSummary };
}

export function buildNutritionReportSections(
  athlete: MockAthlete,
  tests: MockPerformanceTest[],
  injuries: InjuryRecord[],
  checkIn: DailyCheckIn | undefined,
  trainingPlans: TrainingPlan[],
  nutritionLogs: DailyNutritionLog[],
  bodyRecords: BodyCompositionRecord[],
  goalSettings: NutritionGoalSetting[],
  t: TFunction,
  isRTL: boolean
): Pick<
  MockReportSections,
  'nutrition_summary' | 'nutrition_hydration_status' | 'nutrition_body_comp_trend' | 'nutrition_recommendations'
> {
  const athletePlans = trainingPlans.filter((p) => p.athlete_id === athlete.id);
  const athleteTests = tests.filter((tst) => tst.athlete_id === athlete.id);
  const analytics = computeAthleteAnalytics({
    athlete,
    tests: athleteTests,
    checkIn,
    injuries: injuries.filter((i) => i.athlete_id === athlete.id),
    trainingPlans: athletePlans,
    nutritionLogs,
    bodyCompositionRecords: bodyRecords,
    nutritionGoalSettings: goalSettings,
  });
  const snapshot = buildAthleteNutritionSnapshot({
    athlete,
    analytics,
    logs: nutritionLogs,
    bodyRecords,
    goalSettings,
    checkIn,
    trainingPlans: athletePlans,
    dateKey: new Date().toISOString().slice(0, 10),
  });
  const { totals, targets, hydration, compliance, goal, primaryRecommendation, recommendations, bodyCompositionAnalysis } =
    snapshot;

  const goalLabel = t(NUTRITION_GOALS.find((g) => g.id === goal)?.labelKey ?? 'nutrition.goals.performance');

  const nutritionSummary = isRTL
    ? `السعرات ${totals.calories}/${targets.calories} · البروتين ${totals.protein_g}/${targets.protein_g} جم · ماء ${totals.water_liters}/${targets.water_liters} ل.\n` +
      `الامتثال ${compliance.overall}%. البروتين ${compliance.protein}%. السعرات ${compliance.calories}%. الهدف: ${goalLabel}.`
    : `Calories ${totals.calories}/${targets.calories} · Protein ${totals.protein_g}/${targets.protein_g}g · Water ${totals.water_liters}/${targets.water_liters}L.\n` +
      `Overall compliance ${compliance.overall}%. Protein ${compliance.protein}%. Calories ${compliance.calories}%. Goal: ${goalLabel}.`;

  const nutritionHydrationStatus = isRTL
    ? `الترطيب ${hydration.hydrationPercent}% (${totals.water_liters}/${targets.water_liters}L). خطر التعرق: ${t(`nutrition.sweatRisk.${hydration.sweatRisk}`)}.`
    : `Hydration ${hydration.hydrationPercent}% (${totals.water_liters}/${targets.water_liters}L). Sweat risk: ${t(`nutrition.sweatRisk.${hydration.sweatRisk}`)}.`;

  const bc = bodyCompositionAnalysis;
  const nutritionBodyCompTrend =
    bc?.latest && bc.previous
      ? isRTL
        ? `الأحدث ${bc.latest.weight_kg} kg (${bc.latest.date}) · السابق ${bc.previous.weight_kg} kg. التغير ${bc.weightChange ?? 0} kg. BMI ${bc.bmi ?? '—'}. WHR ${bc.waistHipRatio ?? '—'}. ${t(bc.statusKey)}.`
        : `Latest ${bc.latest.weight_kg} kg (${bc.latest.date}) · Previous ${bc.previous.weight_kg} kg. Change ${bc.weightChange ?? 0} kg. BMI ${bc.bmi ?? '—'}. WHR ${bc.waistHipRatio ?? '—'}. ${t(bc.statusKey)}.`
      : bc?.latest
        ? isRTL
          ? `الوزن ${bc.latest.weight_kg} kg · BMI ${bc.bmi ?? '—'}. ${t(bc.statusKey)}.`
          : `Weight ${bc.latest.weight_kg} kg · BMI ${bc.bmi ?? '—'}. ${t(bc.statusKey)}.`
        : isRTL
          ? 'لا توجد قياسات تركيب جسم كافية.'
          : 'Insufficient body composition measurements.';

  const nutritionRecommendations =
    recommendations.length > 0
      ? recommendations.map((rec) => `• ${t(rec.titleKey)}: ${t(rec.bodyKey)}`).join('\n')
      : primaryRecommendation
        ? `• ${t(primaryRecommendation.titleKey)}: ${t(primaryRecommendation.bodyKey)}`
        : isRTL
          ? 'التغذية ضمن الأهداف — لا توصيات عاجلة.'
          : 'Nutrition on target — no urgent recommendations.';

  return {
    nutrition_summary: nutritionSummary,
    nutrition_hydration_status: nutritionHydrationStatus,
    nutrition_body_comp_trend: nutritionBodyCompTrend,
    nutrition_recommendations: nutritionRecommendations,
  };
}

export function buildTeamIntelligenceReportSections(
  athletes: MockAthlete[],
  tests: MockPerformanceTest[],
  injuries: InjuryRecord[],
  dailyCheckIns: DailyCheckIn[],
  trainingPlans: TrainingPlan[],
  nutritionLogs: DailyNutritionLog[],
  bodyCompositionRecords: BodyCompositionRecord[],
  nutritionGoalSettings: NutritionGoalSetting[],
  t: TFunction,
  isRTL: boolean
): Pick<
  MockReportSections,
  'team_overview' | 'team_rankings' | 'team_risk_players' | 'team_position_analysis' | 'team_recommendations'
> {
  const snapshot = computeTeamIntelligence(
    {
      athletes,
      tests,
      dailyCheckIns,
      injuries,
      trainingPlans,
      nutritionLogs,
      bodyCompositionRecords,
      nutritionGoalSettings,
    },
    isRTL
  );
  const m = snapshot.metrics;

  const teamOverview = isRTL
    ? `صحة الفريق: ${m.overallScore}/1000 · جاهزية ${m.readiness}% · تعافي ${m.recovery}% · إرهاق ${m.fatigue}%.\n` +
      `امتثال تدريب ${m.trainingCompliance}% · تغذية ${m.nutritionCompliance}% · خطر إصابة ${m.injuryRisk}%.\n` +
      `القائمة: ${m.activeCount} نشط · ${m.injuredCount} مصاب · ${m.restCount} راحة.`
    : `Squad health: ${m.overallScore}/1000 · Readiness ${m.readiness}% · Recovery ${m.recovery}% · Fatigue ${m.fatigue}%.\n` +
      `Training compliance ${m.trainingCompliance}% · Nutrition ${m.nutritionCompliance}% · Injury risk ${m.injuryRisk}%.\n` +
      `Roster: ${m.activeCount} active · ${m.injuredCount} injured · ${m.restCount} rest.`;

  const teamRankings = snapshot.rankings
    .map((ranking) => {
      const label = t(`teamIntelligence.rankings.${ranking.category === 'injury_risk' ? 'injuryRisk' : ranking.category === 'training_compliance' ? 'trainingCompliance' : ranking.category === 'nutrition_compliance' ? 'nutritionCompliance' : ranking.category}`);
      const top = ranking.entries
        .slice(0, 3)
        .map((e) => `#${e.rank} ${e.athleteName ?? e.athleteId} (${e.displayValue})`)
        .join(', ');
      return `${label}: ${top || '—'}`;
    })
    .join('\n');

  const teamRiskPlayers =
    snapshot.playersAtRisk.length > 0
      ? snapshot.playersAtRisk
          .map((p) => `• ${p.athleteName} — ${p.injuryRisk}% ${t('analytics.kpi.injuryRisk')} (${p.position})`)
          .join('\n')
      : isRTL
        ? 'لا يوجد لاعبون في نطاق الخطر حالياً.'
        : 'No players currently flagged at elevated risk.';

  const teamPositionAnalysis = snapshot.positionAnalysis
    .map((pos) => {
      const weakness = pos.keyWeaknessLabelKey ? t(pos.keyWeaknessLabelKey) : '—';
      return isRTL
        ? `${t(pos.labelKey)} (${pos.playerCount}): ${pos.avgOverallScore}/1000 · جاهزية ${pos.avgReadiness}% · خطر ${pos.avgInjuryRisk}%. ضعف: ${weakness}.`
        : `${t(pos.labelKey)} (${pos.playerCount}): ${pos.avgOverallScore}/1000 · Readiness ${pos.avgReadiness}% · Risk ${pos.avgInjuryRisk}%. Weakness: ${weakness}.`;
    })
    .join('\n');

  const teamRecommendations =
    snapshot.staffRecommendations.length > 0
      ? snapshot.staffRecommendations.map((rec) => `• ${t(rec.titleKey)}: ${t(rec.bodyKey)}`).join('\n')
      : snapshot.aiSummary;

  return {
    team_overview: teamOverview,
    team_rankings: teamRankings,
    team_risk_players: teamRiskPlayers,
    team_position_analysis: teamPositionAnalysis || (isRTL ? 'لا توجد مجموعات مراكز.' : 'No position groups available.'),
    team_recommendations: teamRecommendations,
  };
}

export function buildSsidReportSections(
  analytics: ReturnType<typeof computeAthleteAnalytics>,
  t: TFunction,
  bodyCompSsid?: import('@/src/features/ssid-engine').SsidMetricBundle
): Pick<MockReportSections, 'ssid_interpretation' | 'ssid_decision' | 'ssid_recommendations' | 'ssid_reference'> {
  const entries = buildWorkspaceSsidEntries(analytics, bodyCompSsid);
  const content = formatSsidReportSections(entries, (key) => t(key));
  return {
    ssid_interpretation: content.interpretation,
    ssid_decision: content.decision,
    ssid_recommendations: content.recommendations,
    ssid_reference: content.reference,
  };
}

export function buildDefaultReportSections(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  summary: string,
  isRTL: boolean,
  t?: TFunction,
  context?: {
    injuries?: InjuryRecord[];
    checkIn?: DailyCheckIn;
    trainingPlans?: TrainingPlan[];
    nutritionLogs?: DailyNutritionLog[];
    bodyCompositionRecords?: BodyCompositionRecord[];
    nutritionGoalSettings?: NutritionGoalSetting[];
  }
): MockReportSections {
  const base: MockReportSections = {
    athlete_summary: summary.trim() || buildAthleteSummary(athlete, isRTL),
    performance_tests: buildPerformanceTestsSummary(tests, isRTL),
    ai_insights: buildMockAiInsights(isRTL),
    recommendations: buildMockRecommendations(isRTL),
  };

  if (!athlete || !t) return base;

  const analytics = computeAthleteAnalytics({
    athlete,
    tests,
    checkIn: context?.checkIn,
    injuries: context?.injuries?.filter((i) => i.athlete_id === athlete.id),
    trainingPlans: context?.trainingPlans?.filter((p) => p.athlete_id === athlete.id),
    nutritionLogs: context?.nutritionLogs,
    bodyCompositionRecords: context?.bodyCompositionRecords,
    nutritionGoalSettings: context?.nutritionGoalSettings,
  });
  const enriched = buildAnalyticsReportSections(analytics, t);
  const injurySections = buildInjuryReportSections(
    athlete,
    tests,
    context?.injuries ?? [],
    context?.checkIn,
    t,
    isRTL
  );
  const trainingSections = buildTrainingReportSections(
    athlete,
    tests,
    context?.injuries ?? [],
    context?.checkIn,
    context?.trainingPlans ?? [],
    t,
    isRTL
  );
  const nutritionSections = buildNutritionReportSections(
    athlete,
    tests,
    context?.injuries ?? [],
    context?.checkIn,
    context?.trainingPlans ?? [],
    context?.nutritionLogs ?? [],
    context?.bodyCompositionRecords ?? [],
    context?.nutritionGoalSettings ?? [],
    t,
    isRTL
  );
  const nutritionSnapshot = buildAthleteNutritionSnapshot({
    athlete,
    analytics,
    logs: context?.nutritionLogs ?? [],
    bodyRecords: context?.bodyCompositionRecords ?? [],
    goalSettings: context?.nutritionGoalSettings ?? [],
    checkIn: context?.checkIn,
    trainingPlans: context?.trainingPlans?.filter((p) => p.athlete_id === athlete.id) ?? [],
    dateKey: new Date().toISOString().slice(0, 10),
  });
  const ssidSections = buildSsidReportSections(analytics, t, nutritionSnapshot.bodyCompositionAnalysis?.ssid);

  return {
    ...base,
    overall_score: enriched.overall_score,
    kpi_summary: enriched.kpi_summary,
    strengths: enriched.strengths,
    weaknesses: enriched.weaknesses,
    athlete_summary: `${base.athlete_summary}\n\n${enriched.overall_score}`,
    ...injurySections,
    ...trainingSections,
    ...nutritionSections,
    ...ssidSections,
    decision_support: [enriched.decision_support, ssidSections.ssid_decision].filter(Boolean).join('\n\n'),
    recommendations: [enriched.recommendations, ssidSections.ssid_recommendations].filter(Boolean).join('\n\n'),
    ai_insights: [enriched.kpi_summary, ssidSections.ssid_interpretation, base.ai_insights].filter(Boolean).join('\n\n'),
  };
}

export function reportStatusVariant(status: string): 'success' | 'warning' | 'info' | 'neutral' {
  if (status === 'ready') return 'success';
  if (status === 'exported') return 'info';
  return 'warning';
}

export function researchStatusVariant(status: string): 'success' | 'warning' | 'info' | 'neutral' {
  if (status === 'completed') return 'success';
  if (status === 'active') return 'info';
  return 'warning';
}
