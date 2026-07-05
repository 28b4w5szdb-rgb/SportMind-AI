import type {
  MockAthlete,
  MockCalculationRecord,
  MockPerformanceTest,
  MockReport,
  MockResearchProject,
  MockTeam,
} from './types';

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

export const SEED_REPORTS: MockReport[] = [];

export const SEED_RESEARCH: MockResearchProject[] = [];

export const SEED_CALCULATIONS: MockCalculationRecord[] = [];
