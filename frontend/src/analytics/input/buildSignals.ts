import type { MockAthlete, MockPerformanceTest, DailyCheckIn, TrainingPlan, DailyNutritionLog, BodyCompositionRecord, NutritionGoalSetting } from '@/src/data/mock/types';
import { resolveSignalKey } from '@/src/features/performance-lab/registry/signalAliases';
import { computeRecoveryScoreFromCheckIn } from '@/src/features/recovery/recoveryEngine';
import { buildTrainingSignals } from '@/src/features/training-builder/utils/trainingSignals';
import { buildNutritionSignals } from '@/src/features/nutrition/utils/nutritionSignals';
import { buildWearableSignals } from '@/src/features/wearables/utils/wearableSignals';
import type { WearableDataRecord, WearableProviderConnection } from '@/src/features/wearables/types';
import { todayDateKey } from '@/src/features/daily-checkin/validation';
import type { AnalyticsRawSignals } from '../types';

export interface BuildRawSignalsOptions {
  nutritionLogs?: DailyNutritionLog[];
  bodyCompositionRecords?: BodyCompositionRecord[];
  nutritionGoalSettings?: NutritionGoalSetting[];
  wearableConnections?: WearableProviderConnection[];
  wearableRecords?: WearableDataRecord[];
  wearableDateKey?: string;
}

function ageFromDob(dob?: string): number | undefined {
  if (!dob) return undefined;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return undefined;
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

export function buildRawSignals(
  athlete: MockAthlete,
  tests: MockPerformanceTest[],
  checkIn?: DailyCheckIn,
  trainingPlans?: TrainingPlan[],
  nutritionOptions?: BuildRawSignalsOptions
): AnalyticsRawSignals {
  const testSignals: AnalyticsRawSignals['testSignals'] = {};
  for (const test of tests) {
    const signalKey = resolveSignalKey(test.test_type_key);
    if (testSignals[signalKey] === undefined) {
      testSignals[signalKey] = test.value;
    }
    if (testSignals[test.test_type_key] === undefined) {
      testSignals[test.test_type_key] = test.value;
    }
  }

  const signals: AnalyticsRawSignals = {
    status: athlete.status,
    testsCount: athlete.tests_count,
    trendPercent: athlete.trend_percent,
    heightCm: athlete.height_cm,
    weightKg: athlete.weight_kg,
    testSignals,
  };

  if (checkIn) {
    signals.checkIn = {
      recoveryScore: computeRecoveryScoreFromCheckIn(checkIn),
      sleepQuality: checkIn.sleep_quality,
      sleepDurationHours: checkIn.sleep_duration_hours,
      fatigue: checkIn.fatigue,
      muscleSoreness: checkIn.muscle_soreness,
      mood: checkIn.mood,
      stress: checkIn.stress,
      painLevel: checkIn.pain_level,
      hydrationLiters: checkIn.hydration_liters,
      morningHeartRate: checkIn.morning_heart_rate,
      rpe: checkIn.rpe,
    };
  }

  if (trainingPlans && trainingPlans.length > 0) {
    signals.training = buildTrainingSignals(trainingPlans, athlete.id);
  }

  if (
    nutritionOptions?.nutritionLogs ||
    nutritionOptions?.bodyCompositionRecords ||
    nutritionOptions?.nutritionGoalSettings
  ) {
    signals.nutrition = buildNutritionSignals({
      athlete,
      logs: nutritionOptions.nutritionLogs ?? [],
      bodyRecords: nutritionOptions.bodyCompositionRecords ?? [],
      goalSettings: nutritionOptions.nutritionGoalSettings ?? [],
      checkIn,
      trainingPlans,
    });
  }

  if (nutritionOptions?.wearableConnections && nutritionOptions?.wearableRecords) {
    signals.wearables = buildWearableSignals({
      athleteId: athlete.id,
      dateKey: nutritionOptions.wearableDateKey ?? todayDateKey(),
      connections: nutritionOptions.wearableConnections,
      records: nutritionOptions.wearableRecords,
    });
  }

  return signals;
}

export { ageFromDob };
