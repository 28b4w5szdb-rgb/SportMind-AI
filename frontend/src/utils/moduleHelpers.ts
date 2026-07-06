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
): Pick<MockReportSections, 'nutrition_summary'> {
  const athletePlans = trainingPlans.filter((p) => p.athlete_id === athlete.id);
  const analytics = computeAthleteAnalytics({
    athlete,
    tests: tests.filter((tst) => tst.athlete_id === athlete.id),
    checkIn,
    injuries: injuries.filter((i) => i.athlete_id === athlete.id),
    trainingPlans: athletePlans,
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
  const { totals, targets, hydration, compliancePercent, goal, primaryRecommendation } = snapshot;

  const goalLabel = t(NUTRITION_GOALS.find((g) => g.id === goal)?.labelKey ?? 'nutrition.goals.performance');

  const nutritionSummary = isRTL
    ? `السعرات ${totals.calories}/${targets.calories} · بروtein ${totals.protein_g}/${targets.protein_g}g · ماء ${totals.water_liters}/${targets.water_liters}L.\n` +
      `الامتثال ${compliancePercent}%. الترطيب ${hydration.hydrationPercent}%. الهدف: ${goalLabel}.\n` +
      (primaryRecommendation ? `توصية: ${t(primaryRecommendation.titleKey)}` : 'الامتثال ضمن النطاق المستهدف.')
    : `Calories ${totals.calories}/${targets.calories} · Protein ${totals.protein_g}/${targets.protein_g}g · Water ${totals.water_liters}/${targets.water_liters}L.\n` +
      `Compliance ${compliancePercent}%. Hydration ${hydration.hydrationPercent}%. Goal: ${goalLabel}.\n` +
      (primaryRecommendation ? `Recommendation: ${t(primaryRecommendation.titleKey)}` : 'Nutrition compliance on target.');

  return { nutrition_summary: nutritionSummary };
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

  return {
    ...base,
    overall_score: enriched.overall_score,
    kpi_summary: enriched.kpi_summary,
    strengths: enriched.strengths,
    weaknesses: enriched.weaknesses,
    recommendations: enriched.recommendations,
    decision_support: enriched.decision_support,
    ai_insights: `${enriched.kpi_summary}\n\n${base.ai_insights}`,
    athlete_summary: `${base.athlete_summary}\n\n${enriched.overall_score}`,
    ...injurySections,
    ...trainingSections,
    ...nutritionSections,
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
