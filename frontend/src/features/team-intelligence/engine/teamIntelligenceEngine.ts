import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import { computeAthleteAnalytics } from '@/src/analytics/engine/performanceAnalyticsEngine';
import type { MockAthlete } from '@/src/data/mock/types';
import { buildNutritionSignals } from '@/src/features/nutrition/utils/nutritionSignals';

import type {
  PlayerRanking,
  PlayerTeamMetrics,
  PositionGroupAnalysis,
  RankingCategory,
  ReadinessBucket,
  StaffRecommendation,
  TeamAlert,
  TeamIntelligenceInput,
  TeamIntelligenceSnapshot,
  TeamMetrics,
  TeamTrendPoint,
} from '../types';
import { POSITION_GROUPS, positionGroupLabelKey, resolvePositionGroup } from '../utils/positionHelpers';

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function kpiValue(analytics: AthleteAnalyticsSnapshot, id: string): number {
  return analytics.kpis.find((k) => k.id === id)?.value ?? 0;
}

function moduleScore(analytics: AthleteAnalyticsSnapshot, id: string): number {
  return analytics.overall.modules.find((m) => m.id === id)?.score ?? 0;
}

function buildPlayerMetrics(
  athlete: MockAthlete,
  analytics: AthleteAnalyticsSnapshot,
  nutritionCompliance: number,
  trainingCompliance: number
): PlayerTeamMetrics {
  return {
    athleteId: athlete.id,
    athleteName: `${athlete.first_name} ${athlete.last_name}`,
    position: athlete.position,
    positionGroup: resolvePositionGroup(athlete.position),
    status: athlete.status,
    overallScore: analytics.overall.score,
    readiness: kpiValue(analytics, 'readiness'),
    recovery: kpiValue(analytics, 'recovery'),
    fatigue: kpiValue(analytics, 'fatigue'),
    trainingLoad: kpiValue(analytics, 'training_load'),
    injuryRisk: kpiValue(analytics, 'injury_risk'),
    nutritionCompliance,
    trainingCompliance,
    trendDelta: analytics.overall.trendDelta,
  };
}

function rankPlayers(players: PlayerTeamMetrics[], category: RankingCategory, invert = false): PlayerRanking {
  const valueOf = (p: PlayerTeamMetrics): number => {
    switch (category) {
      case 'overall':
        return p.overallScore;
      case 'readiness':
        return p.readiness;
      case 'injury_risk':
        return p.injuryRisk;
      case 'fatigue':
        return p.fatigue;
      case 'recovery':
        return p.recovery;
      case 'training_compliance':
        return p.trainingCompliance;
      case 'nutrition_compliance':
        return p.nutritionCompliance;
      default:
        return 0;
    }
  };

  const sorted = [...players].sort((a, b) => {
    const diff = valueOf(b) - valueOf(a);
    return invert ? -diff : diff;
  });

  return {
    category,
    entries: sorted.map((p, i) => {
      const value = valueOf(p);
      const displayValue =
        category === 'overall' ? `${value}/1000` : category === 'injury_risk' || category === 'fatigue' ? `${value}%` : `${value}%`;
      return { rank: i + 1, athleteId: p.athleteId, athleteName: p.athleteName, value, displayValue };
    }),
  };
}

function buildRankings(players: PlayerTeamMetrics[]): PlayerRanking[] {
  const categories: Array<{ cat: RankingCategory; invert?: boolean }> = [
    { cat: 'overall' },
    { cat: 'readiness' },
    { cat: 'injury_risk', invert: true },
    { cat: 'fatigue', invert: true },
    { cat: 'recovery' },
    { cat: 'training_compliance' },
    { cat: 'nutrition_compliance' },
  ];
  return categories.map(({ cat, invert }) => rankPlayers(players, cat, invert));
}

function buildPositionAnalysis(players: PlayerTeamMetrics[], snapshots: Array<{ athlete: MockAthlete; analytics: AthleteAnalyticsSnapshot }>): PositionGroupAnalysis[] {
  return POSITION_GROUPS.map((id) => {
    const groupPlayers = players.filter((p) => p.positionGroup === id);
    const groupSnapshots = snapshots.filter((s) => resolvePositionGroup(s.athlete.position) === id);
    const weaknessPool = groupSnapshots.flatMap((s) => s.analytics.weaknesses);
    const weakest = [...weaknessPool].sort((a, b) => a.score - b.score)[0];

    return {
      id,
      labelKey: positionGroupLabelKey(id),
      playerCount: groupPlayers.length,
      avgOverallScore: avg(groupPlayers.map((p) => p.overallScore)),
      avgReadiness: avg(groupPlayers.map((p) => p.readiness)),
      avgFatigue: avg(groupPlayers.map((p) => p.fatigue)),
      avgInjuryRisk: avg(groupPlayers.map((p) => p.injuryRisk)),
      keyWeaknessModuleId: weakest?.id,
      keyWeaknessLabelKey: weakest?.labelKey,
    };
  }).filter((g) => g.playerCount > 0);
}

function buildAlerts(players: PlayerTeamMetrics[]): TeamAlert[] {
  const alerts: TeamAlert[] = [];

  for (const p of players) {
    if (p.injuryRisk >= 65) {
      alerts.push({
        id: 'high_injury_risk',
        severity: p.injuryRisk >= 75 ? 'high' : 'medium',
        titleKey: 'teamIntelligence.alerts.highInjuryTitle',
        bodyKey: 'teamIntelligence.alerts.highInjuryBody',
        athleteId: p.athleteId,
        athleteName: p.athleteName,
      });
    }
    if (p.recovery < 50) {
      alerts.push({
        id: 'low_recovery',
        severity: p.recovery < 40 ? 'high' : 'medium',
        titleKey: 'teamIntelligence.alerts.lowRecoveryTitle',
        bodyKey: 'teamIntelligence.alerts.lowRecoveryBody',
        athleteId: p.athleteId,
        athleteName: p.athleteName,
      });
    }
    if (p.fatigue >= 65) {
      alerts.push({
        id: 'high_fatigue',
        severity: p.fatigue >= 75 ? 'high' : 'medium',
        titleKey: 'teamIntelligence.alerts.highFatigueTitle',
        bodyKey: 'teamIntelligence.alerts.highFatigueBody',
        athleteId: p.athleteId,
        athleteName: p.athleteName,
      });
    }
    if (p.trainingCompliance < 55) {
      alerts.push({
        id: 'low_compliance',
        severity: 'medium',
        titleKey: 'teamIntelligence.alerts.lowComplianceTitle',
        bodyKey: 'teamIntelligence.alerts.lowComplianceBody',
        athleteId: p.athleteId,
        athleteName: p.athleteName,
      });
    }
    if (p.nutritionCompliance < 60) {
      alerts.push({
        id: 'poor_nutrition',
        severity: 'medium',
        titleKey: 'teamIntelligence.alerts.poorNutritionTitle',
        bodyKey: 'teamIntelligence.alerts.poorNutritionBody',
        athleteId: p.athleteId,
        athleteName: p.athleteName,
      });
    }
    if (p.trainingLoad >= 78 && p.recovery < 55) {
      alerts.push({
        id: 'overload_risk',
        severity: 'high',
        titleKey: 'teamIntelligence.alerts.overloadTitle',
        bodyKey: 'teamIntelligence.alerts.overloadBody',
        athleteId: p.athleteId,
        athleteName: p.athleteName,
      });
    }
  }

  const severityOrder = { high: 0, medium: 1, low: 2 };
  return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]).slice(0, 8);
}

function buildReadinessDistribution(players: PlayerTeamMetrics[]): ReadinessBucket[] {
  const buckets: ReadinessBucket[] = [
    { id: 'excellent', labelKey: 'teamIntelligence.readiness.excellent', count: 0 },
    { id: 'good', labelKey: 'teamIntelligence.readiness.good', count: 0 },
    { id: 'moderate', labelKey: 'teamIntelligence.readiness.moderate', count: 0 },
    { id: 'low', labelKey: 'teamIntelligence.readiness.low', count: 0 },
  ];
  for (const p of players) {
    if (p.readiness >= 80) buckets[0].count += 1;
    else if (p.readiness >= 65) buckets[1].count += 1;
    else if (p.readiness >= 50) buckets[2].count += 1;
    else buckets[3].count += 1;
  }
  return buckets.filter((b) => b.count > 0);
}

function buildTrends(players: PlayerTeamMetrics[], baseOverall: number, baseReadiness: number): TeamTrendPoint[] {
  const delta = avg(players.map((p) => p.trendDelta));
  return [
    { label: 'W-3', overallScore: Math.max(0, baseOverall - Math.round(delta * 1.5)), readiness: Math.max(0, baseReadiness - 4) },
    { label: 'W-2', overallScore: Math.max(0, baseOverall - Math.round(delta)), readiness: Math.max(0, baseReadiness - 2) },
    { label: 'W-1', overallScore: Math.max(0, baseOverall - Math.round(delta * 0.5)), readiness: Math.max(0, baseReadiness - 1) },
    { label: 'Now', overallScore: baseOverall, readiness: baseReadiness },
  ];
}

function buildStaffRecommendations(alerts: TeamAlert[], metrics: TeamMetrics, positionAnalysis: PositionGroupAnalysis[]): StaffRecommendation[] {
  const recs: StaffRecommendation[] = [];

  if (metrics.injuredCount > 0) {
    recs.push({ id: 'rtp', priority: 'high', titleKey: 'teamIntelligence.staff.rtpTitle', bodyKey: 'teamIntelligence.staff.rtpBody' });
  }
  if (metrics.nutritionCompliance < 70) {
    recs.push({ id: 'nutrition', priority: 'medium', titleKey: 'teamIntelligence.staff.nutritionTitle', bodyKey: 'teamIntelligence.staff.nutritionBody' });
  }
  if (metrics.trainingCompliance < 65) {
    recs.push({ id: 'compliance', priority: 'medium', titleKey: 'teamIntelligence.staff.complianceTitle', bodyKey: 'teamIntelligence.staff.complianceBody' });
  }
  if (metrics.fatigue >= 60) {
    recs.push({ id: 'fatigue', priority: 'high', titleKey: 'teamIntelligence.staff.fatigueTitle', bodyKey: 'teamIntelligence.staff.fatigueBody' });
  }

  const weakestGroup = [...positionAnalysis].sort((a, b) => a.avgOverallScore - b.avgOverallScore)[0];
  if (weakestGroup && weakestGroup.playerCount > 0) {
    recs.push({
      id: 'position',
      priority: 'medium',
      titleKey: 'teamIntelligence.staff.positionTitle',
      bodyKey: 'teamIntelligence.staff.positionBody',
    });
  }

  if (alerts.some((a) => a.id === 'overload_risk')) {
    recs.push({ id: 'load', priority: 'high', titleKey: 'teamIntelligence.staff.loadTitle', bodyKey: 'teamIntelligence.staff.loadBody' });
  }

  return recs.slice(0, 5);
}

function buildAiSummary(metrics: TeamMetrics, topPerformer?: PlayerTeamMetrics, atRisk?: PlayerTeamMetrics, isRTL = false): string {
  if (metrics.rosterSize === 0) {
    return isRTL ? 'أضف لاعبين لتفعيل ذكاء الفريق.' : 'Add athletes to enable team intelligence.';
  }
  if (isRTL) {
    return (
      `صحة الفريق: ${metrics.overallScore}/1000 · جاهزية ${metrics.readiness}% · امتثال تدريب ${metrics.trainingCompliance}% · تغذية ${metrics.nutritionCompliance}%.\n` +
      (topPerformer ? `الأفضل: ${topPerformer.athleteName}. ` : '') +
      (atRisk ? `تحذير: ${atRisk.athleteName}.` : '')
    );
  }
  return (
    `Squad health: ${metrics.overallScore}/1000 · Readiness ${metrics.readiness}% · Training compliance ${metrics.trainingCompliance}% · Nutrition ${metrics.nutritionCompliance}%.\n` +
    (topPerformer ? `Top performer: ${topPerformer.athleteName}. ` : '') +
    (atRisk ? `Watch: ${atRisk.athleteName}.` : '')
  );
}

export function computeTeamIntelligence(input: TeamIntelligenceInput, isRTL = false): TeamIntelligenceSnapshot {
  const {
    athletes,
    tests,
    dailyCheckIns,
    injuries,
    trainingPlans,
    nutritionLogs,
    bodyCompositionRecords,
    nutritionGoalSettings,
    teamId,
    teamName,
  } = input;

  if (athletes.length === 0) {
    return {
      teamId,
      teamName,
      metrics: {
        overallScore: 0,
        readiness: 0,
        recovery: 0,
        fatigue: 0,
        trainingLoad: 0,
        injuryRisk: 0,
        nutritionCompliance: 0,
        trainingCompliance: 0,
        activeCount: 0,
        injuredCount: 0,
        restCount: 0,
        rosterSize: 0,
      },
      players: [],
      rankings: [],
      topPerformers: [],
      playersAtRisk: [],
      fatigueWatchlist: [],
      recoveryWatchlist: [],
      readinessDistribution: [],
      positionAnalysis: [],
      alerts: [],
      trends: [],
      aiSummary: buildAiSummary({ rosterSize: 0 } as TeamMetrics, undefined, undefined, isRTL),
      staffRecommendations: [],
    };
  }

  const snapshots = athletes.map((athlete) => {
    const checkIn = dailyCheckIns
      .filter((c) => c.athlete_id === athlete.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    const analytics = computeAthleteAnalytics({
      athlete,
      tests: tests.filter((t) => t.athlete_id === athlete.id),
      checkIn,
      injuries: injuries.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      nutritionLogs,
      bodyCompositionRecords,
      nutritionGoalSettings,
    });
    const nutritionSignals = buildNutritionSignals({
      athlete,
      logs: nutritionLogs,
      bodyRecords: bodyCompositionRecords,
      goalSettings: nutritionGoalSettings,
      checkIn,
      trainingPlans,
    });
    const nutritionCompliance = nutritionSignals.compliancePercent;
    const trainingCompliance = moduleScore(analytics, 'training_compliance');
    const player = buildPlayerMetrics(athlete, analytics, nutritionCompliance, trainingCompliance);
    return { athlete, analytics, player };
  });

  const players = snapshots.map((s) => s.player);
  const metrics: TeamMetrics = {
    overallScore: avg(players.map((p) => p.overallScore)),
    readiness: avg(players.map((p) => p.readiness)),
    recovery: avg(players.map((p) => p.recovery)),
    fatigue: avg(players.map((p) => p.fatigue)),
    trainingLoad: avg(players.map((p) => p.trainingLoad)),
    injuryRisk: avg(players.map((p) => p.injuryRisk)),
    nutritionCompliance: avg(players.map((p) => p.nutritionCompliance)),
    trainingCompliance: avg(players.map((p) => p.trainingCompliance)),
    activeCount: athletes.filter((a) => a.status === 'active').length,
    injuredCount: athletes.filter((a) => a.status === 'injured').length,
    restCount: athletes.filter((a) => a.status === 'rest').length,
    rosterSize: athletes.length,
  };

  const rankings = buildRankings(players);
  const topPerformers = [...players].sort((a, b) => b.overallScore - a.overallScore).slice(0, 3);
  const playersAtRisk = [...players]
    .filter((p) => p.injuryRisk >= 60 || p.status === 'injured')
    .sort((a, b) => b.injuryRisk - a.injuryRisk)
    .slice(0, 4);
  const fatigueWatchlist = [...players].sort((a, b) => b.fatigue - a.fatigue).slice(0, 3);
  const recoveryWatchlist = [...players].sort((a, b) => a.recovery - b.recovery).slice(0, 3);
  const positionAnalysis = buildPositionAnalysis(players, snapshots);
  const alerts = buildAlerts(players);
  const readinessDistribution = buildReadinessDistribution(players);
  const trends = buildTrends(players, metrics.overallScore, metrics.readiness);
  const staffRecommendations = buildStaffRecommendations(alerts, metrics, positionAnalysis);

  return {
    teamId,
    teamName,
    metrics,
    players,
    rankings,
    topPerformers,
    playersAtRisk,
    fatigueWatchlist,
    recoveryWatchlist,
    readinessDistribution,
    positionAnalysis,
    alerts,
    trends,
    aiSummary: buildAiSummary(metrics, topPerformers[0], playersAtRisk[0], isRTL),
    staffRecommendations,
  };
}

export function formatTeamIntelligenceForAI(snapshot: TeamIntelligenceSnapshot, isRTL: boolean): string {
  const m = snapshot.metrics;
  const ready = snapshot.rankings.find((r) => r.category === 'readiness')?.entries[0];
  const risk = snapshot.rankings.find((r) => r.category === 'injury_risk')?.entries[0];
  const weakPos = [...snapshot.positionAnalysis].sort((a, b) => a.avgOverallScore - b.avgOverallScore)[0];

  if (isRTL) {
    return (
      `👥 ذكاء الفريق${snapshot.teamName ? ` — ${snapshot.teamName}` : ''}:\n` +
      `• النتيجة: ${m.overallScore}/1000 · جاهزية ${m.readiness}%\n` +
      `• امتثال تدريب ${m.trainingCompliance}% · تغذية ${m.nutritionCompliance}%\n` +
      (ready ? `• الأكثر جاهزية: ${ready.athleteName}\n` : '') +
      (risk ? `• أعلى خطر إصابة: ${risk.athleteName}\n` : '') +
      (weakPos ? `• مركز يحتاج تحسين: ${weakPos.id}` : '')
    );
  }
  return (
    `👥 Team intelligence${snapshot.teamName ? ` — ${snapshot.teamName}` : ''}:\n` +
    `• Score: ${m.overallScore}/1000 · Readiness ${m.readiness}%\n` +
    `• Training compliance ${m.trainingCompliance}% · Nutrition ${m.nutritionCompliance}%\n` +
    (ready ? `• Most ready: ${ready.athleteName}\n` : '') +
    (risk ? `• Highest injury risk: ${risk.athleteName}\n` : '') +
    (weakPos ? `• Position to improve: ${weakPos.id}` : '')
  );
}
