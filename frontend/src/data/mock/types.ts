/** Local mock domain types — aligned with Supabase schema for future wiring. */

export type AthleteStatus = 'active' | 'injured' | 'rest';

export interface MockAthlete {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  status: AthleteStatus;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  jersey_number?: number;
  height_cm?: number;
  weight_kg?: number;
  tests_count: number;
  trend_percent: number;
  created_at: string;
}

export interface MockTeam {
  id: string;
  name: string;
  sport: string;
  athlete_ids: string[];
  head_coach?: string;
  created_at: string;
}

export interface MockPerformanceTest {
  id: string;
  athlete_id: string;
  athlete_name: string;
  test_type: string;
  test_type_key: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface MockReport {
  id: string;
  title: string;
  type: 'athlete' | 'team' | 'session' | 'custom';
  status: 'draft' | 'ready';
  created_at: string;
  summary: string;
}

export interface MockResearchProject {
  id: string;
  title: string;
  status: 'planning' | 'active' | 'completed';
  hypothesis: string;
  progress: number;
  updated_at: string;
}

export type CalculatorType =
  | 'vo2max'
  | 'bmi'
  | 'body-fat'
  | 'heart-rate-zones'
  | 'training-load'
  | 'recovery-time';

export interface MockCalculationRecord {
  id: string;
  calculator_type: CalculatorType;
  title: string;
  inputs: Record<string, number>;
  result: { value: number; unit: string; interpretation: string };
  created_at: string;
}

export interface CalculatorDefinition {
  id: CalculatorType;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  titleKey: string;
  descKey: string;
  fields: Array<{
    key: string;
    labelKey: string;
    unit?: string;
    defaultValue?: number;
  }>;
}
