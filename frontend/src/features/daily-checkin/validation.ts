import type { DailyCheckIn, DailyCheckInInput } from '@/src/data/mock/types';

export function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getLatestCheckIn(checkIns: DailyCheckIn[], athleteId: string): DailyCheckIn | undefined {
  return checkIns
    .filter((c) => c.athlete_id === athleteId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
}

export function getCheckInForDate(checkIns: DailyCheckIn[], athleteId: string, date: string): DailyCheckIn | undefined {
  return checkIns.find((c) => c.athlete_id === athleteId && c.date === date);
}

export interface CheckInValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof DailyCheckInInput | 'athlete_id', string>>;
}

export function validateCheckInInput(input: DailyCheckInInput): CheckInValidationResult {
  const errors: CheckInValidationResult['errors'] = {};

  if (!input.athlete_id) errors.athlete_id = 'dailyCheckIn.validation.athleteRequired';

  if (input.sleep_duration_hours < 0 || input.sleep_duration_hours > 14) {
    errors.sleep_duration_hours = 'dailyCheckIn.validation.sleepDuration';
  }
  if (input.sleep_quality < 1 || input.sleep_quality > 10) errors.sleep_quality = 'dailyCheckIn.validation.scale';
  if (input.fatigue < 1 || input.fatigue > 10) errors.fatigue = 'dailyCheckIn.validation.scale';
  if (input.muscle_soreness < 1 || input.muscle_soreness > 10) errors.muscle_soreness = 'dailyCheckIn.validation.scale';
  if (input.mood < 1 || input.mood > 10) errors.mood = 'dailyCheckIn.validation.scale';
  if (input.stress < 1 || input.stress > 10) errors.stress = 'dailyCheckIn.validation.scale';
  if (input.pain_level < 0 || input.pain_level > 10) errors.pain_level = 'dailyCheckIn.validation.pain';
  if (input.hydration_liters < 0 || input.hydration_liters > 6) errors.hydration_liters = 'dailyCheckIn.validation.hydration';
  if (input.morning_heart_rate < 35 || input.morning_heart_rate > 120) {
    errors.morning_heart_rate = 'dailyCheckIn.validation.heartRate';
  }
  if (input.rpe < 1 || input.rpe > 10) errors.rpe = 'dailyCheckIn.validation.scale';
  if (input.notes && input.notes.length > 500) errors.notes = 'dailyCheckIn.validation.notesLength';

  return { valid: Object.keys(errors).length === 0, errors };
}

export function defaultCheckInValues(athleteId: string): DailyCheckInInput {
  return {
    athlete_id: athleteId,
    sleep_duration_hours: 7,
    sleep_quality: 7,
    fatigue: 4,
    muscle_soreness: 4,
    mood: 7,
    stress: 4,
    pain_level: 0,
    hydration_liters: 2,
    morning_heart_rate: 60,
    rpe: 5,
    notes: '',
  };
}
