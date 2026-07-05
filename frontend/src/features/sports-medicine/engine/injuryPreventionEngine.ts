import type { MockAthlete, MockPerformanceTest, DailyCheckIn } from '@/src/data/mock/types';
import type { AnalyticsRawSignals } from '@/src/analytics/types';
import type { BodyRegion, InjuryAlert, InjuryPreventionProfile, InjuryRecord, RegionalRiskScores } from '../types';

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function priorInjuryBoost(records: InjuryRecord[], region: BodyRegion, months = 12): number {
  const cutoff = Date.now() - months * 30 * 24 * 3600 * 1000;
  return records.filter((r) => r.body_region === region && new Date(r.injury_date).getTime() >= cutoff).length * 12;
}

function activeInjuryBoost(records: InjuryRecord[], region: BodyRegion): number {
  const active = records.filter(
    (r) => r.body_region === region && (r.status === 'active' || r.status === 'rehab' || r.status === 'return_to_play')
  );
  if (active.length === 0) return 0;
  return active.reduce((sum, r) => sum + r.pain_level * 4 + (r.severity_grade === 'grade_3' ? 20 : r.severity_grade === 'grade_2' ? 12 : 6), 0);
}

export interface InjuryPreventionInput {
  athlete: MockAthlete;
  injuries: InjuryRecord[];
  checkIn?: DailyCheckIn;
  signals: AnalyticsRawSignals;
}

function baseRegionalRisk(input: InjuryPreventionInput, region: BodyRegion): number {
  const { athlete, injuries, checkIn, signals } = input;
  let risk = 28;

  if (athlete.status === 'injured') risk += 15;
  if (athlete.trend_percent < -5) risk += 8;

  if (checkIn) {
    risk += checkIn.fatigue * 2.2;
    risk += checkIn.muscle_soreness * 1.8;
    risk += checkIn.pain_level * 3;
    risk += Math.max(0, 6 - checkIn.sleep_quality) * 2;
    risk += Math.max(0, 7 - checkIn.sleep_duration_hours) * 2.5;
    risk += checkIn.stress * 1.2;
  }

  const fatigueMod = signals.checkIn?.fatigue ?? (checkIn?.fatigue ?? 5);
  const recoveryScore = signals.checkIn?.recoveryScore ?? 55;
  risk += fatigueMod * 1.5;
  risk -= (recoveryScore - 50) * 0.35;

  const loadMod = signals.testSignals.training_load;
  if (loadMod !== undefined && loadMod > 800) risk += 10;

  const nordic = signals.testSignals.nordic_hamstring;
  if (region === 'hamstring' && nordic !== undefined && nordic < 300) risk += 18;

  const sprint = signals.testSignals.sprint30;
  if ((region === 'hamstring' || region === 'groin') && sprint !== undefined && sprint > 4.3) risk += 6;

  const yBalance = signals.testSignals.y_balance;
  if ((region === 'ankle' || region === 'knee') && yBalance !== undefined && yBalance < 90) risk += 14;

  const fms = signals.testSignals.fms;
  if (region === 'back' && fms !== undefined && fms < 12) risk += 12;

  risk += priorInjuryBoost(injuries, region);
  risk += activeInjuryBoost(injuries, region);

  return clamp(risk);
}

function buildAlerts(regional: RegionalRiskScores, input: InjuryPreventionInput): InjuryAlert[] {
  const alerts: InjuryAlert[] = [];

  if (regional.hamstring >= 65) {
    alerts.push({ id: 'high_hamstring_risk', priority: 'high', titleKey: 'sportsMedicine.alerts.highHamstringTitle', bodyKey: 'sportsMedicine.alerts.highHamstring' });
  }
  if (regional.ankle >= 60) {
    alerts.push({ id: 'high_ankle_risk', priority: 'high', titleKey: 'sportsMedicine.alerts.highAnkleTitle', bodyKey: 'sportsMedicine.alerts.highAnkle' });
  }
  if (regional.overall >= 58 && (regional.hamstring >= 55 || input.signals.testSignals.sprint30 !== undefined)) {
    alerts.push({ id: 'reduce_sprint_load', priority: 'medium', titleKey: 'sportsMedicine.alerts.reduceSprintTitle', bodyKey: 'sportsMedicine.alerts.reduceSprint' });
  }
  if (regional.back >= 50 || regional.groin >= 55) {
    alerts.push({ id: 'add_mobility', priority: 'medium', titleKey: 'sportsMedicine.alerts.mobilityTitle', bodyKey: 'sportsMedicine.alerts.mobility' });
  }
  if (regional.overall >= 70 || input.injuries.some((i) => i.status === 'active' && i.pain_level >= 6)) {
    alerts.push({ id: 'medical_evaluation', priority: 'high', titleKey: 'sportsMedicine.alerts.medicalTitle', bodyKey: 'sportsMedicine.alerts.medical' });
  }

  return alerts.slice(0, 5);
}

export function computeInjuryPreventionProfile(input: InjuryPreventionInput): InjuryPreventionProfile {
  const hamstring = baseRegionalRisk(input, 'hamstring');
  const knee = baseRegionalRisk(input, 'knee');
  const ankle = baseRegionalRisk(input, 'ankle');
  const groin = baseRegionalRisk(input, 'groin');
  const shoulder = baseRegionalRisk(input, 'shoulder');
  const back = baseRegionalRisk(input, 'back');

  const regional: RegionalRiskScores = {
    hamstring,
    knee,
    ankle,
    groin,
    shoulder,
    back,
    overall: clamp((hamstring + knee + ankle + groin + shoulder + back) / 6),
  };

  const activeInjuries = input.injuries.filter(
    (i) => i.athlete_id === input.athlete.id && i.status !== 'resolved'
  );
  const resolvedCount = input.injuries.filter((i) => i.athlete_id === input.athlete.id && i.status === 'resolved').length;

  const preventionKeys = [
    'sportsMedicine.prevention.monitorLoad',
    'sportsMedicine.prevention.sleep',
    'sportsMedicine.prevention.nordic',
    'sportsMedicine.prevention.balance',
  ];

  if (regional.hamstring >= 55) preventionKeys.unshift('sportsMedicine.prevention.hamstring');
  if (regional.ankle >= 50) preventionKeys.unshift('sportsMedicine.prevention.ankle');

  return {
    regional,
    alerts: buildAlerts(regional, input),
    preventionKeys: preventionKeys.slice(0, 5),
    activeInjuries,
    resolvedCount,
  };
}

export function injuryRiskModuleAdjustment(profile: InjuryPreventionProfile): number {
  return -Math.max(0, profile.regional.overall - 40) * 0.45;
}

export function readinessAdjustment(profile: InjuryPreventionProfile): number {
  const activePenalty = profile.activeInjuries.length * 8;
  return -profile.regional.overall * 0.15 - activePenalty;
}

export function recoveryAdjustment(profile: InjuryPreventionProfile): number {
  return profile.activeInjuries.length > 0 ? -12 : 0;
}

export function fatigueAdjustment(profile: InjuryPreventionProfile): number {
  return -Math.max(0, profile.regional.overall - 45) * 0.2;
}
