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

export interface MockTeamStaff {
  role: string;
  name: string;
}

export interface MockTeam {
  id: string;
  name: string;
  sport: string;
  athlete_ids: string[];
  head_coach?: string;
  staff?: MockTeamStaff[];
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

export type MockReportStatus = 'draft' | 'ready' | 'exported';

export interface MockReportSections {
  athlete_summary: string;
  performance_tests: string;
  ai_insights: string;
  recommendations: string;
  overall_score?: string;
  kpi_summary?: string;
  strengths?: string;
  weaknesses?: string;
  decision_support?: string;
  injury_summary?: string;
  rtp_status?: string;
  prevention_recommendations?: string;
  training_summary?: string;
  training_compliance_summary?: string;
  nutrition_summary?: string;
  nutrition_hydration_status?: string;
  nutrition_body_comp_trend?: string;
  nutrition_recommendations?: string;
  team_overview?: string;
  team_rankings?: string;
  team_risk_players?: string;
  team_position_analysis?: string;
  team_recommendations?: string;
}

export interface MockReport {
  id: string;
  title: string;
  type: 'athlete' | 'team' | 'session' | 'custom';
  status: MockReportStatus;
  created_at: string;
  summary: string;
  athlete_id?: string;
  sections: MockReportSections;
}

export interface MockResearchProject {
  id: string;
  title: string;
  status: 'planning' | 'active' | 'completed';
  hypothesis: string;
  sample?: string;
  method?: string;
  variables?: string;
  notes?: string;
  references?: string;
  mock_analysis?: string;
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
  result: { value: number; unit: string; interpretation: string; ssid?: import('@/src/features/ssid-engine').SsidInterpretation };
  created_at: string;
}

/** Daily wellness check-in — local mock, aligned for future Supabase wiring. */
export interface DailyCheckIn {
  id: string;
  athlete_id: string;
  date: string;
  created_at: string;
  sleep_duration_hours: number;
  sleep_quality: number;
  fatigue: number;
  muscle_soreness: number;
  mood: number;
  stress: number;
  pain_level: number;
  hydration_liters: number;
  morning_heart_rate: number;
  rpe: number;
  notes?: string;
}

export type DailyCheckInInput = Omit<DailyCheckIn, 'id' | 'created_at' | 'date'> & { date?: string };

export type {
  BodyRegion,
  TissueType,
  InjurySeverity,
  InjuryStatus,
  RTPPhaseId,
  InjuryRecord,
  InjuryRecordInput,
} from '@/src/features/sports-medicine/types';

export type { TrainingPlan, TrainingDailySession, TrainingPlanInput, TrainingSessionLogInput, TrainingSessionExecution, TrainingComplianceSnapshot } from '@/src/features/training-builder/types';

export type {
  DailyNutritionLog,
  DailyNutritionLogInput,
  BodyCompositionRecord,
  BodyCompositionInput,
  NutritionGoalSetting,
  NutritionGoalId,
  MealSlotId,
  MealEntry,
} from '@/src/features/nutrition/types';

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
