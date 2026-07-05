import type { DailyCheckIn } from '@/src/data/mock/types';

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/** Composite daily recovery score (0–100) from check-in metrics. */
export function computeRecoveryScoreFromCheckIn(checkIn: DailyCheckIn): number {
  let score = 52;

  score += clamp((checkIn.sleep_duration_hours - 6) * 7, -18, 18);
  score += (checkIn.sleep_quality - 5) * 3.2;
  score -= (checkIn.fatigue - 5) * 4.5;
  score -= (checkIn.muscle_soreness - 5) * 3.2;
  score += (checkIn.mood - 5) * 2.8;
  score -= (checkIn.stress - 5) * 3;
  score -= checkIn.pain_level * 4.2;
  score += clamp((checkIn.hydration_liters - 2) * 7, -14, 14);

  if (checkIn.morning_heart_rate > 72) {
    score -= (checkIn.morning_heart_rate - 72) * 0.55;
  } else if (checkIn.morning_heart_rate < 48) {
    score -= 4;
  } else {
    score += 3;
  }

  score -= (checkIn.rpe - 5) * 2.2;

  return clamp(score);
}

export type RecoveryRecommendationId =
  | 'reduce_load'
  | 'recovery_session'
  | 'hydration'
  | 'sleep'
  | 'mobility';

export interface RecoveryRecommendation {
  id: RecoveryRecommendationId;
  priority: 'high' | 'medium' | 'low';
  titleKey: string;
  bodyKey: string;
}

export interface RecoverySummary {
  recoveryScore: number;
  sleepHours: number;
  sleepQuality: number;
  fatigue: number;
  soreness: number;
  hydrationLiters: number;
  readinessImpact: number;
  recommendations: RecoveryRecommendation[];
}

export function buildRecoverySummary(checkIn: DailyCheckIn): RecoverySummary {
  const recoveryScore = computeRecoveryScoreFromCheckIn(checkIn);
  const recommendations: RecoveryRecommendation[] = [];

  if (checkIn.fatigue >= 7 || checkIn.rpe >= 8) {
    recommendations.push({
      id: 'reduce_load',
      priority: 'high',
      titleKey: 'recovery.recommendations.reduceLoadTitle',
      bodyKey: 'recovery.recommendations.reduceLoad',
    });
  }

  if (recoveryScore < 55 || checkIn.fatigue >= 6 || checkIn.muscle_soreness >= 6) {
    recommendations.push({
      id: 'recovery_session',
      priority: recoveryScore < 50 ? 'high' : 'medium',
      titleKey: 'recovery.recommendations.recoverySessionTitle',
      bodyKey: 'recovery.recommendations.recoverySession',
    });
  }

  if (checkIn.hydration_liters < 2) {
    recommendations.push({
      id: 'hydration',
      priority: 'medium',
      titleKey: 'recovery.recommendations.hydrationTitle',
      bodyKey: 'recovery.recommendations.hydration',
    });
  }

  if (checkIn.sleep_duration_hours < 7 || checkIn.sleep_quality <= 5) {
    recommendations.push({
      id: 'sleep',
      priority: checkIn.sleep_duration_hours < 6 ? 'high' : 'medium',
      titleKey: 'recovery.recommendations.sleepTitle',
      bodyKey: 'recovery.recommendations.sleep',
    });
  }

  if (checkIn.muscle_soreness >= 6 || checkIn.pain_level >= 3) {
    recommendations.push({
      id: 'mobility',
      priority: checkIn.pain_level >= 5 ? 'high' : 'medium',
      titleKey: 'recovery.recommendations.mobilityTitle',
      bodyKey: 'recovery.recommendations.mobility',
    });
  }

  const readinessImpact = clamp(recoveryScore - 50, -25, 25);

  return {
    recoveryScore,
    sleepHours: checkIn.sleep_duration_hours,
    sleepQuality: checkIn.sleep_quality,
    fatigue: checkIn.fatigue,
    soreness: checkIn.muscle_soreness,
    hydrationLiters: checkIn.hydration_liters,
    readinessImpact,
    recommendations: recommendations.slice(0, 5),
  };
}
