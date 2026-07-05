import type {
  MockAthlete,
  MockCalculationRecord,
  DailyCheckIn,
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
seedPlanAthlete1.sessions[1].status = 'completed';
seedPlanAthlete1.sessions[2].status = 'completed';

export const SEED_TRAINING_PLANS: TrainingPlan[] = [seedPlanAthlete1];
