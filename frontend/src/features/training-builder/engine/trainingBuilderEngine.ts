import type {
  AcwrZone,
  TrainingDailySession,
  TrainingEngineInput,
  TrainingLoadSnapshot,
  TrainingPlan,
  TrainingRecommendation,
  TrainingTemplateId,
  WeekdayId,
} from '../types';
import { TRAINING_TEMPLATES, WEEKDAY_ORDER } from '../registry/trainingTemplates';

function ex(
  nameKey: string,
  opts?: { sets?: number; reps?: string; intensityKey?: string; durationMin?: number; restSec?: number }
) {
  return { nameKey, ...opts };
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(dateKey: string, days: number): string {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + days);
  return formatDateKey(d);
}

function mondayOfWeek(dateKey: string): string {
  const d = parseDateKey(dateKey);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatDateKey(d);
}

export function deriveTrainingAgeYears(testsCount: number, dateOfBirth?: string): number {
  if (dateOfBirth) {
    const dob = parseDateKey(dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000));
    return Math.max(1, Math.min(age - 14, 12));
  }
  if (testsCount >= 30) return 8;
  if (testsCount >= 20) return 5;
  if (testsCount >= 10) return 3;
  return 2;
}

export function deriveGoalKey(position: string, weaknessModuleIds: string[]): string {
  const pos = position.toLowerCase();
  if (weaknessModuleIds.includes('speed') || pos.includes('forward')) return 'trainingBuilder.goals.speedPower';
  if (weaknessModuleIds.includes('endurance') || pos.includes('mid')) return 'trainingBuilder.goals.aerobicCapacity';
  if (weaknessModuleIds.includes('strength') || pos.includes('def')) return 'trainingBuilder.goals.strengthResilience';
  if (weaknessModuleIds.includes('flexibility')) return 'trainingBuilder.goals.mobilityBalance';
  return 'trainingBuilder.goals.performanceBalance';
}

function intensityMultiplier(input: TrainingEngineInput): number {
  let mult = 1;
  if (input.readinessScore < 50 || input.fatigueScore < 45) mult *= 0.75;
  else if (input.readinessScore < 60) mult *= 0.85;
  if (input.injuryRiskScore < 50) mult *= 0.8;
  if (input.decisionLevel === 'recovery_day') mult *= 0.6;
  if (input.decisionLevel === 'train_reduced_load') mult *= 0.85;
  if (input.decisionLevel === 'medical_evaluation') mult *= 0.5;
  if (input.trainingAgeYears < 3) mult *= 0.9;
  return mult;
}

function pickWeeklyTemplates(input: TrainingEngineInput): TrainingTemplateId[] {
  if (input.inRtp) {
    return ['return_to_play', 'mobility', 'return_to_play', 'recovery', 'return_to_play', 'injury_prevention', 'recovery'];
  }
  if (input.decisionLevel === 'recovery_day') {
    return ['recovery', 'mobility', 'recovery', 'injury_prevention', 'aerobic', 'recovery', 'mobility'];
  }

  const focus = input.weaknessModuleIds[0];
  const base: TrainingTemplateId[] = ['strength', 'speed', 'power', 'recovery', 'agility', 'endurance', 'mobility'];

  if (focus === 'speed' || focus === 'acceleration') {
    return ['speed', 'acceleration', 'power', 'recovery', 'speed', 'agility', 'mobility'];
  }
  if (focus === 'strength') {
    return ['strength', 'hypertrophy', 'power', 'recovery', 'strength', 'injury_prevention', 'mobility'];
  }
  if (focus === 'endurance' || focus === 'aerobic_capacity') {
    return ['aerobic', 'endurance', 'anaerobic', 'recovery', 'endurance', 'strength', 'mobility'];
  }
  if (input.injuryRiskScore < 55) {
    return ['injury_prevention', 'mobility', 'strength', 'recovery', 'speed', 'injury_prevention', 'recovery'];
  }

  return base;
}

function buildSessionSections(templateId: TrainingTemplateId, rpeScale: number) {
  const tpl = TRAINING_TEMPLATES[templateId];
  const scale = (n: number) => Math.max(1, Math.round(n * rpeScale));

  return {
    warmUp: { titleKey: 'trainingBuilder.sections.warmUp', items: tpl.warmUp },
    mainSection: { titleKey: 'trainingBuilder.sections.main', items: tpl.mainExercises },
    accessoryWork: {
      titleKey: 'trainingBuilder.sections.accessory',
      items: tpl.activation.map((e) => ({ ...e, sets: scale(e.sets ?? 2) })),
    },
    conditioning: {
      titleKey: 'trainingBuilder.sections.conditioning',
      items:
        templateId === 'recovery' || templateId === 'mobility'
          ? tpl.mainExercises.slice(0, 1)
          : [ex('trainingBuilder.exercises.finisher', { durationMin: 8, intensityKey: 'trainingBuilder.intensity.moderate' })],
    },
    recovery: { titleKey: 'trainingBuilder.sections.recovery', items: tpl.coolDown },
  };
}

export function generateWeeklyProgram(input: TrainingEngineInput, weekStart?: string): TrainingPlan {
  const start = weekStart ?? mondayOfWeek(formatDateKey(new Date()));
  const templates = pickWeeklyTemplates(input);
  const mult = intensityMultiplier(input);
  const goalKey = deriveGoalKey(input.position, input.weaknessModuleIds);
  const trainingAge = deriveTrainingAgeYears(input.testsCount, input.dateOfBirth);

  const planId = uid('plan');
  const sessions: TrainingDailySession[] = WEEKDAY_ORDER.map((day, idx) => {
    const templateId = templates[idx];
    const tpl = TRAINING_TEMPLATES[templateId];
    const duration = Math.round(tpl.defaultDurationMin * mult);
    const rpe = clamp(tpl.defaultRpe * mult, 2, 9);
    const date = addDays(start, idx);

    return {
      id: uid('sess'),
      plan_id: planId,
      athlete_id: input.athleteId,
      date,
      weekday: day.id,
      templateId,
      titleKey: tpl.labelKey,
      status: 'planned',
      duration_min: duration,
      target_rpe: rpe,
      session_load: duration * rpe,
      ...buildSessionSections(templateId, mult),
    };
  });

  return {
    id: planId,
    athlete_id: input.athleteId,
    title: 'trainingBuilder.generatedPlanTitle',
    week_start: start,
    goal_key: goalKey,
    training_age_years: trainingAge,
    sessions,
    created_at: new Date().toISOString(),
    is_active: true,
  };
}

export function computeSessionLoad(session: TrainingDailySession): number {
  return session.duration_min * session.target_rpe;
}

export function computeWeeklyLoad(sessions: TrainingDailySession[]): number {
  return sessions.reduce((sum, s) => sum + computeSessionLoad(s), 0);
}

export function computeAcuteChronicLoad(
  allSessions: TrainingDailySession[],
  referenceDate: string
): Pick<TrainingLoadSnapshot, 'acuteLoad' | 'chronicLoad' | 'acwr' | 'acwrZone'> {
  const ref = parseDateKey(referenceDate).getTime();
  const dayMs = 24 * 3600 * 1000;

  const acuteSessions = allSessions.filter((s) => {
    const t = parseDateKey(s.date).getTime();
    return ref - t <= 6 * dayMs && ref - t >= 0 && s.status !== 'skipped';
  });

  const chronicSessions = allSessions.filter((s) => {
    const t = parseDateKey(s.date).getTime();
    return ref - t <= 27 * dayMs && ref - t >= 0 && s.status !== 'skipped';
  });

  const acuteLoad = acuteSessions.reduce((sum, s) => sum + computeSessionLoad(s), 0);
  const chronicTotal = chronicSessions.reduce((sum, s) => sum + computeSessionLoad(s), 0);
  const chronicLoad = chronicTotal / 4;
  const acwr = chronicLoad > 0 ? Math.round((acuteLoad / chronicLoad) * 100) / 100 : acuteLoad > 0 ? 1.5 : 0;

  let acwrZone: AcwrZone = 'optimal';
  if (acwr < 0.8) acwrZone = 'low';
  else if (acwr <= 1.3) acwrZone = 'optimal';
  else if (acwr <= 1.5) acwrZone = 'high';
  else acwrZone = 'danger';

  return { acuteLoad, chronicLoad: Math.round(chronicLoad), acwr, acwrZone };
}

export function computeLoadSnapshot(
  plan: TrainingPlan | undefined,
  allPlans: TrainingPlan[],
  referenceDate: string
): TrainingLoadSnapshot {
  const todaySession = plan?.sessions.find((s) => s.date === referenceDate);
  const sessionLoad = todaySession ? computeSessionLoad(todaySession) : 0;
  const weeklyLoad = plan ? computeWeeklyLoad(plan.sessions) : 0;

  const historicalSessions = allPlans.flatMap((p) => p.sessions);
  const { acuteLoad, chronicLoad, acwr, acwrZone } = computeAcuteChronicLoad(historicalSessions, referenceDate);

  return { sessionLoad, weeklyLoad, acuteLoad, chronicLoad, acwr, acwrZone };
}

export function buildTrainingRecommendations(
  load: TrainingLoadSnapshot,
  input: TrainingEngineInput
): TrainingRecommendation[] {
  const recs: TrainingRecommendation[] = [];

  if (input.readinessScore < 55 || input.fatigueScore < 50 || input.decisionLevel === 'recovery_day') {
    recs.push({
      id: 'recovery_session',
      priority: 'high',
      titleKey: 'trainingBuilder.recommendations.recoverySessionTitle',
      bodyKey: 'trainingBuilder.recommendations.recoverySession',
    });
  }

  if (input.decisionLevel === 'train_reduced_load' || load.acwrZone === 'high' || load.acwrZone === 'danger') {
    recs.push({
      id: 'reduce_intensity',
      priority: load.acwrZone === 'danger' ? 'high' : 'medium',
      titleKey: 'trainingBuilder.recommendations.reduceIntensityTitle',
      bodyKey: 'trainingBuilder.recommendations.reduceIntensity',
    });
  }

  if (input.injuryRiskScore < 55 || input.hasActiveInjury) {
    recs.push({
      id: 'injury_prevention_session',
      priority: 'high',
      titleKey: 'trainingBuilder.recommendations.injuryPreventionTitle',
      bodyKey: 'trainingBuilder.recommendations.injuryPrevention',
    });
  }

  if (input.readinessScore >= 70 && input.fatigueScore >= 65 && load.acwrZone === 'low') {
    recs.push({
      id: 'increase_volume',
      priority: 'medium',
      titleKey: 'trainingBuilder.recommendations.increaseVolumeTitle',
      bodyKey: 'trainingBuilder.recommendations.increaseVolume',
    });
  }

  if (input.weaknessModuleIds.includes('flexibility') || input.injuryRiskScore < 65) {
    recs.push({
      id: 'mobility_session',
      priority: 'medium',
      titleKey: 'trainingBuilder.recommendations.mobilitySessionTitle',
      bodyKey: 'trainingBuilder.recommendations.mobilitySession',
    });
  }

  return recs.slice(0, 5);
}

export function computePlanProgress(plan: TrainingPlan): number {
  if (plan.sessions.length === 0) return 0;
  const completed = plan.sessions.filter((s) => s.status === 'completed').length;
  return Math.round((completed / plan.sessions.length) * 100);
}

export function findTodaySession(plan: TrainingPlan | undefined, dateKey: string): TrainingDailySession | undefined {
  return plan?.sessions.find((s) => s.date === dateKey);
}

export function findNextSession(plan: TrainingPlan | undefined, dateKey: string): TrainingDailySession | undefined {
  if (!plan) return undefined;
  const upcoming = plan.sessions
    .filter((s) => s.date >= dateKey && s.status === 'planned')
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0];
}

export function todayDateKey(): string {
  return formatDateKey(new Date());
}
