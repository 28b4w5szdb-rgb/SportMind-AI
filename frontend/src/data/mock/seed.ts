import type {
  MockAthlete,
  MockCalculationRecord,
  DailyCheckIn,
  DailyNutritionLog,
  BodyCompositionRecord,
  NutritionGoalSetting,
  MockPerformanceTest,
  MockReport,
  MockResearchProject,
  MockTeam,
  InjuryRecord,
  TrainingPlan,
} from './types';
import { generateWeeklyProgram } from '@/src/features/training-builder/engine/trainingBuilderEngine';

export const SEED_ATHLETES: MockAthlete[] = [
  {
    id: '1',
    first_name: 'Ahmed',
    last_name: 'Hassan',
    position: 'Forward',
    status: 'active',
    date_of_birth: '2001-03-15',
    gender: 'male',
    nationality: 'EG',
    jersey_number: 9,
    height_cm: 182,
    weight_kg: 78,
    tests_count: 24,
    trend_percent: 12,
    created_at: '2025-01-10T08:00:00Z',
  },
  {
    id: '2',
    first_name: 'Mohammed',
    last_name: 'Ali',
    position: 'Midfielder',
    status: 'active',
    date_of_birth: '2000-07-22',
    gender: 'male',
    nationality: 'SA',
    jersey_number: 8,
    height_cm: 175,
    weight_kg: 72,
    tests_count: 18,
    trend_percent: 5,
    created_at: '2025-01-12T08:00:00Z',
  },
  {
    id: '3',
    first_name: 'Omar',
    last_name: 'Farouk',
    position: 'Defender',
    status: 'injured',
    date_of_birth: '1999-11-08',
    gender: 'male',
    nationality: 'AE',
    jersey_number: 4,
    height_cm: 188,
    weight_kg: 84,
    tests_count: 31,
    trend_percent: -3,
    created_at: '2025-01-08T08:00:00Z',
  },
  {
    id: '4',
    first_name: 'Yusuf',
    last_name: 'Ibrahim',
    position: 'Goalkeeper',
    status: 'rest',
    date_of_birth: '1998-05-30',
    gender: 'male',
    nationality: 'QA',
    jersey_number: 1,
    height_cm: 190,
    weight_kg: 86,
    tests_count: 15,
    trend_percent: 8,
    created_at: '2025-02-01T08:00:00Z',
  },
];

export const SEED_TEAMS: MockTeam[] = [];

export const SEED_TESTS: MockPerformanceTest[] = [
  {
    id: 't1',
    athlete_id: '1',
    athlete_name: 'Ahmed Hassan',
    test_type: 'Yo-Yo IR1',
    test_type_key: 'yoyo',
    value: 1420,
    unit: 'm',
    date: '2026-06-28',
  },
  {
    id: 't2',
    athlete_id: '2',
    athlete_name: 'Mohammed Ali',
    test_type: '30m Sprint',
    test_type_key: 'sprint30',
    value: 4.12,
    unit: 's',
    date: '2026-06-27',
  },
];

export const SEED_CHECKINS: DailyCheckIn[] = [
  {
    id: 'ci1',
    athlete_id: '1',
    date: '2026-07-05',
    created_at: '2026-07-05T07:30:00Z',
    sleep_duration_hours: 7.5,
    sleep_quality: 8,
    fatigue: 3,
    muscle_soreness: 4,
    mood: 8,
    stress: 3,
    pain_level: 1,
    hydration_liters: 2.5,
    morning_heart_rate: 58,
    rpe: 4,
    notes: 'Felt fresh after light recovery day.',
  },
  {
    id: 'ci2',
    athlete_id: '3',
    date: '2026-07-05',
    created_at: '2026-07-05T08:00:00Z',
    sleep_duration_hours: 6,
    sleep_quality: 5,
    fatigue: 6,
    muscle_soreness: 7,
    mood: 5,
    stress: 5,
    pain_level: 4,
    hydration_liters: 1.8,
    morning_heart_rate: 64,
    rpe: 3,
    notes: 'Hamstring tightness during warm-up.',
  },
];

export const SEED_INJURIES: InjuryRecord[] = [
  {
    id: 'inj1',
    athlete_id: '3',
    injury_date: '2026-06-15',
    body_region: 'hamstring',
    tissue_type: 'muscle',
    severity_grade: 'grade_1',
    pain_level: 4,
    swelling: 3,
    rom_limitation: 4,
    status: 'rehab',
    expected_absence_days: 14,
    rtp_phase: 'phase_2',
    notes: 'Left hamstring strain during sprint deceleration.',
    created_at: '2026-06-15T10:00:00Z',
  },
  {
    id: 'inj2',
    athlete_id: '1',
    injury_date: '2025-11-20',
    body_region: 'ankle',
    tissue_type: 'ligament',
    severity_grade: 'grade_1',
    pain_level: 2,
    swelling: 2,
    rom_limitation: 2,
    status: 'resolved',
    expected_absence_days: 10,
    rtp_phase: 'ready',
    notes: 'Lateral ankle sprain — resolved.',
    created_at: '2025-11-20T08:00:00Z',
  },
];

export const SEED_REPORTS: MockReport[] = [];

export const SEED_RESEARCH: MockResearchProject[] = [];

export const SEED_CALCULATIONS: MockCalculationRecord[] = [];

const seedPlanAthlete1 = generateWeeklyProgram(
  {
    athleteId: '1',
    position: 'Forward',
    testsCount: 24,
    dateOfBirth: '2001-03-15',
    analyticsOverall: 72,
    readinessScore: 78,
    recoveryScore: 75,
    fatigueScore: 68,
    injuryRiskScore: 62,
    trainingLoadScore: 70,
    decisionLevel: 'ready_to_train',
    weaknessModuleIds: ['speed', 'power'],
    hasActiveInjury: false,
    inRtp: false,
    trainingAgeYears: 5,
  },
  '2026-06-30'
);
seedPlanAthlete1.sessions[0].status = 'completed';
seedPlanAthlete1.sessions[0].execution = {
  actual_duration_min: 58,
  actual_rpe: 7,
  actual_session_load: 406,
  post_session_fatigue: 5,
  post_session_pain: 1,
  notes: 'Good quality session.',
  logged_at: '2026-06-30T18:00:00Z',
};
seedPlanAthlete1.sessions[1].status = 'completed';
seedPlanAthlete1.sessions[1].execution = {
  actual_duration_min: 48,
  actual_rpe: 8,
  actual_session_load: 384,
  post_session_fatigue: 6,
  post_session_pain: 2,
  logged_at: '2026-07-01T17:30:00Z',
};
seedPlanAthlete1.sessions[2].status = 'modified';
seedPlanAthlete1.sessions[2].execution = {
  actual_duration_min: 40,
  actual_rpe: 6,
  actual_session_load: 240,
  post_session_fatigue: 4,
  post_session_pain: 1,
  notes: 'Reduced volume due to tightness.',
  logged_at: '2026-07-02T16:00:00Z',
};

export const SEED_TRAINING_PLANS: TrainingPlan[] = [seedPlanAthlete1];

export const SEED_NUTRITION_LOGS: DailyNutritionLog[] = [
  {
    id: 'nl1',
    athlete_id: '1',
    date: '2026-07-05',
    meals: [
      { slot: 'breakfast', calories: 520, protein_g: 28, carbs_g: 55, fat_g: 18, description: 'Oats, eggs, fruit' },
      { slot: 'snack_am', calories: 180, protein_g: 12, carbs_g: 20, fat_g: 6 },
      { slot: 'lunch', calories: 680, protein_g: 42, carbs_g: 72, fat_g: 22, description: 'Chicken rice bowl' },
      { slot: 'snack_pm', calories: 200, protein_g: 15, carbs_g: 18, fat_g: 8 },
      { slot: 'dinner', calories: 620, protein_g: 38, carbs_g: 58, fat_g: 20 },
      { slot: 'pre_workout', calories: 150, protein_g: 5, carbs_g: 35, fat_g: 2 },
      { slot: 'post_workout', calories: 280, protein_g: 25, carbs_g: 35, fat_g: 4, description: 'Recovery shake' },
    ],
    water_liters: 2.8,
    supplement_keys: ['whey_protein', 'electrolytes'],
    notes: 'Pre-match day — carb emphasis.',
    created_at: '2026-07-05T19:00:00Z',
  },
  {
    id: 'nl2',
    athlete_id: '3',
    date: '2026-07-05',
    meals: [
      { slot: 'breakfast', calories: 450, protein_g: 30, carbs_g: 40, fat_g: 16 },
      { slot: 'lunch', calories: 580, protein_g: 45, carbs_g: 55, fat_g: 18 },
      { slot: 'dinner', calories: 520, protein_g: 40, carbs_g: 48, fat_g: 16 },
    ],
    water_liters: 2.1,
    supplement_keys: ['omega3', 'vitamin_d'],
    notes: 'Recovery-focused macros during RTP.',
    created_at: '2026-07-05T18:30:00Z',
  },
];

export const SEED_BODY_COMPOSITION: BodyCompositionRecord[] = [
  {
    id: 'bc1',
    athlete_id: '1',
    date: '2026-06-15',
    weight_kg: 79.2,
    body_fat_percent: 12.5,
    muscle_mass_kg: 38,
    lean_mass_kg: 69.3,
    body_water_percent: 58,
  },
  {
    id: 'bc2',
    athlete_id: '1',
    date: '2026-06-22',
    weight_kg: 78.8,
    body_fat_percent: 12.2,
    muscle_mass_kg: 38.2,
    lean_mass_kg: 69.2,
    body_water_percent: 58.5,
  },
  {
    id: 'bc3',
    athlete_id: '1',
    date: '2026-07-05',
    weight_kg: 78,
    body_fat_percent: 11.8,
    muscle_mass_kg: 38.5,
    lean_mass_kg: 68.8,
    body_water_percent: 59,
  },
  {
    id: 'bc4',
    athlete_id: '3',
    date: '2026-07-05',
    weight_kg: 84,
    body_fat_percent: 14.2,
    muscle_mass_kg: 40,
    lean_mass_kg: 72.1,
    body_water_percent: 57,
  },
];

export const SEED_NUTRITION_GOALS: NutritionGoalSetting[] = [
  { athlete_id: '1', goal: 'performance', updated_at: '2026-06-01T00:00:00Z' },
  { athlete_id: '3', goal: 'recovery', updated_at: '2026-06-15T00:00:00Z' },
];
