import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useTeamAnalyticsOverview, buildAiSummaryFromAnalytics, computeAthleteAnalytics } from '@/src/analytics';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { computeCompliance, findTodaySession, todayDateKey } from '@/src/features/training-builder';
import { buildAthleteNutritionSnapshot } from '@/src/features/nutrition/utils/nutritionHelpers';
import { useWearablesDashboardSummary } from '@/src/features/wearables';
import { useSquadIntelligence } from '@/src/features/team-intelligence';
import { useDirection } from '@/src/providers/DirectionProvider';
import { getFeaturedTestForCategory } from '@/src/features/performance-lab';

function getGreetingKey(): string {
  const h = new Date().getHours();
  if (h < 12) return 'dashboard.greetingMorning';
  if (h < 18) return 'dashboard.greetingAfternoon';
  return 'dashboard.greetingEvening';
}

function formatDashboardDate(isRTL: boolean): string {
  return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
}

export function useDashboardPresentation() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);

  const teamAnalytics = useTeamAnalyticsOverview();
  const squadIntelligence = useSquadIntelligence();
  const wearablesDashboard = useWearablesDashboardSummary();

  const today = todayDateKey();

  const trainingDashboard = useMemo(() => {
    let sessionsToday = 0;
    let loggedToday = 0;
    let complianceTotal = 0;
    let complianceCount = 0;
    for (const athlete of athletes) {
      const plan = trainingPlans.find((p) => p.athlete_id === athlete.id && p.is_active) ?? trainingPlans.find((p) => p.athlete_id === athlete.id);
      if (!plan) continue;
      const compliance = computeCompliance(plan, today);
      complianceTotal += compliance.compliancePercent;
      complianceCount += 1;
      const session = findTodaySession(plan, today);
      if (session) {
        sessionsToday += 1;
        if (session.status !== 'planned') loggedToday += 1;
      }
    }
    return {
      sessionsToday,
      loggedToday,
      avgCompliance: complianceCount > 0 ? Math.round(complianceTotal / complianceCount) : 0,
    };
  }, [athletes, trainingPlans, today]);

  const nutritionDashboard = useMemo(() => {
    let logsToday = 0;
    let complianceTotal = 0;
    let complianceCount = 0;

    for (const athlete of athletes) {
      const log = nutritionLogs.find((l) => l.athlete_id === athlete.id && l.date === today);
      if (log) logsToday += 1;
      const checkIn = dailyCheckIns
        .filter((c) => c.athlete_id === athlete.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const analytics = computeAthleteAnalytics({
        athlete,
        tests: tests.filter((test) => test.athlete_id === athlete.id),
        checkIn,
        injuries: injuryRecords.filter((i) => i.athlete_id === athlete.id),
        trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
        nutritionLogs,
        bodyCompositionRecords,
        nutritionGoalSettings,
      });
      const snapshot = buildAthleteNutritionSnapshot({
        athlete,
        analytics,
        logs: nutritionLogs,
        bodyRecords: bodyCompositionRecords,
        goalSettings: nutritionGoalSettings,
        checkIn,
        trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
        dateKey: today,
      });
      complianceTotal += snapshot.compliance.overall;
      complianceCount += 1;
    }

    return {
      logsToday,
      avgCompliance: complianceCount > 0 ? Math.round(complianceTotal / complianceCount) : 0,
    };
  }, [athletes, tests, trainingPlans, dailyCheckIns, injuryRecords, nutritionLogs, bodyCompositionRecords, nutritionGoalSettings, today]);

  const checkInsToday = useMemo(
    () => dailyCheckIns.filter((c) => c.date === today).length,
    [dailyCheckIns, today]
  );

  const aiSummary = useMemo(() => buildAiSummaryFromAnalytics(teamAnalytics, isRTL), [teamAnalytics, isRTL]);

  const performanceTrend = useMemo(() => {
    const fromIntel = squadIntelligence.trends.map((p) => p.overallScore);
    if (fromIntel.length >= 3) return fromIntel;
    const weekly = teamAnalytics.snapshots[0]?.analytics.trends.find((tr) => tr.period === 'weekly');
    if (weekly?.points.length) return weekly.points.map((p) => p.value);
    return [62, 68, 71, 69, 74, 78, 76];
  }, [squadIntelligence.trends, teamAnalytics.snapshots]);

  const readinessTrend = useMemo(() => {
    const fromIntel = squadIntelligence.trends.map((p) => p.readiness);
    if (fromIntel.length >= 3) return fromIntel;
    return teamAnalytics.snapshots.slice(0, 7).map(({ analytics }) => analytics.kpis.find((k) => k.id === 'readiness')?.value ?? teamAnalytics.avgReadiness);
  }, [squadIntelligence.trends, teamAnalytics.snapshots, teamAnalytics.avgReadiness]);

  const trainingLoadBars = useMemo(
    () =>
      teamAnalytics.snapshots.slice(0, 7).map(({ analytics }) => analytics.kpis.find((k) => k.id === 'training_load')?.value ?? 0),
    [teamAnalytics.snapshots]
  );

  const riskDistribution = useMemo(() => {
    if (squadIntelligence.readinessDistribution.length > 0) {
      return squadIntelligence.readinessDistribution.map((b) => ({
        value: b.count,
        label: t(b.labelKey),
        color: b.id.includes('low') ? '#EF4444' : b.id.includes('mid') ? '#F97316' : '#10B981',
      }));
    }
    const low = teamAnalytics.snapshots.filter(({ analytics }) => (analytics.kpis.find((k) => k.id === 'injury_risk')?.value ?? 0) >= 60).length;
    const mid = teamAnalytics.snapshots.filter(({ analytics }) => {
      const v = analytics.kpis.find((k) => k.id === 'injury_risk')?.value ?? 0;
      return v >= 35 && v < 60;
    }).length;
    const lowRisk = Math.max(0, teamAnalytics.snapshots.length - low - mid);
    return [
      { value: lowRisk, label: t('dashboard.risk.low'), color: '#10B981' },
      { value: mid, label: t('dashboard.risk.moderate'), color: '#F97316' },
      { value: low, label: t('dashboard.risk.high'), color: '#EF4444' },
    ];
  }, [squadIntelligence.readinessDistribution, teamAnalytics.snapshots, t]);

  const kpis = useMemo(
    () => [
      { id: 'overall', icon: 'trophy' as const, labelKey: 'analytics.overallScore', value: `${teamAnalytics.avgOverallScore}`, unit: '/1000', color: '#0066FF', trend: teamAnalytics.avgOverallScore >= 600 ? '+↑' : '→' },
      { id: 'readiness', icon: 'flash' as const, labelKey: 'analytics.kpi.readiness', value: `${teamAnalytics.avgReadiness}`, unit: '%', color: '#10B981', trend: teamAnalytics.avgReadiness >= 70 ? '+↑' : '↓' },
      { id: 'recovery', icon: 'heart' as const, labelKey: 'analytics.kpi.recovery', value: `${teamAnalytics.avgRecovery}`, unit: '%', color: '#0D9488', trend: '+' },
      { id: 'fatigue', icon: 'battery-dead' as const, labelKey: 'analytics.kpi.fatigue', value: `${teamAnalytics.avgFatigue}`, unit: '%', color: '#F97316', trend: teamAnalytics.avgFatigue <= 40 ? '↓' : '↑' },
      { id: 'load', icon: 'barbell' as const, labelKey: 'analytics.kpi.trainingLoad', value: `${teamAnalytics.avgTrainingLoad}`, unit: '%', color: '#8B5CF6', trend: '→' },
      { id: 'injury', icon: 'medkit' as const, labelKey: 'analytics.kpi.injuryRisk', value: `${teamAnalytics.avgInjuryRisk}`, unit: '%', color: '#EF4444', trend: teamAnalytics.avgInjuryRisk <= 30 ? '↓' : '↑' },
      { id: 'nutrition', icon: 'nutrition' as const, labelKey: 'dashboard.kpi.nutritionCompliance', value: `${nutritionDashboard.avgCompliance}`, unit: '%', color: '#F97316', trend: nutritionDashboard.avgCompliance >= 70 ? '+↑' : '↓' },
      { id: 'wearables', icon: 'watch' as const, labelKey: 'dashboard.kpi.wearablesSync', value: `${wearablesDashboard.syncedToday}`, unit: `/${wearablesDashboard.totalAthletes || 0}`, color: '#0EA5E9', trend: wearablesDashboard.syncedToday > 0 ? '+↑' : '→' },
    ],
    [teamAnalytics, nutritionDashboard, wearablesDashboard]
  );

  const featuredTestRoute = useMemo(() => {
    const featured = getFeaturedTestForCategory('speed');
    return featured ? APP_ROUTES.performanceLabTest(featured.key) : APP_ROUTES.performanceLabEntry;
  }, []);

  const quickActions = useMemo(
    () => [
      { id: 'addTest', labelKey: 'dashboard.actions.addTest', icon: 'analytics' as const, color: '#0066FF', route: featuredTestRoute as string },
      { id: 'checkIn', labelKey: 'dashboard.actions.dailyCheckIn', icon: 'clipboard-outline' as const, color: '#10B981', route: APP_ROUTES.dailyCheckIn() as string },
      { id: 'logSession', labelKey: 'dashboard.actions.logSession', icon: 'barbell' as const, color: '#8B5CF6', route: APP_ROUTES.trainingBuilder() as string },
      { id: 'nutritionLog', labelKey: 'dashboard.actions.nutritionLog', icon: 'nutrition' as const, color: '#F97316', route: APP_ROUTES.nutritionLog() as string },
      { id: 'connectDevice', labelKey: 'dashboard.actions.connectDevice', icon: 'watch' as const, color: '#0EA5E9', route: APP_ROUTES.wearables() as string },
      { id: 'generateReport', labelKey: 'dashboard.actions.generateReport', icon: 'document-text' as const, color: '#EF4444', route: APP_ROUTES.reportBuilder as string },
    ],
    [featuredTestRoute]
  );

  const weeklyFocus = squadIntelligence.staffRecommendations[0];

  return {
    greetingKey: getGreetingKey(),
    formattedDate: formatDashboardDate(isRTL),
    isRTL,
    athletes,
    teamAnalytics,
    squadIntelligence,
    wearablesDashboard,
    trainingDashboard,
    nutritionDashboard,
    checkInsToday,
    aiSummary,
    kpis,
    performanceTrend,
    readinessTrend,
    trainingLoadBars,
    riskDistribution,
    quickActions,
    weeklyFocus,
  };
}
