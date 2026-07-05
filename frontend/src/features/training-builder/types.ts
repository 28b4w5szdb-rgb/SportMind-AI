/** Training Builder domain types — structured for future Supabase wiring. */

export type TrainingTemplateId =
  | 'strength'
  | 'hypertrophy'
  | 'power'
  | 'speed'
  | 'acceleration'
  | 'agility'
  | 'endurance'
  | 'aerobic'
  | 'anaerobic'
  | 'recovery'
  | 'mobility'
  | 'injury_prevention'
  | 'return_to_play';

export type WeekdayId =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type SessionStatus = 'planned' | 'completed' | 'skipped' | 'modified';

export interface TrainingSessionExecution {
  actual_duration_min: number;
  actual_rpe: number;
  actual_session_load: number;
  post_session_fatigue: number;
  post_session_pain: number;
  notes?: string;
  logged_at: string;
}

export type TrainingSessionLogInput = {
  status: Exclude<SessionStatus, 'planned'>;
  actual_duration_min: number;
  actual_rpe: number;
  post_session_fatigue: number;
  post_session_pain: number;
  notes?: string;
};

export interface TrainingComplianceSnapshot {
  planned: number;
  completed: number;
  skipped: number;
  modified: number;
  missed: number;
  compliancePercent: number;
}

export interface TemplateExercise {
  nameKey: string;
  sets?: number;
  reps?: string;
  intensityKey?: string;
  durationMin?: number;
  restSec?: number;
}

export interface TrainingTemplate {
  id: TrainingTemplateId;
  labelKey: string;
  focusKey: string;
  warmUp: TemplateExercise[];
  activation: TemplateExercise[];
  mainExercises: TemplateExercise[];
  coolDown: TemplateExercise[];
  defaultDurationMin: number;
  defaultRpe: number;
}

export interface DailySessionSection {
  titleKey: string;
  items: TemplateExercise[];
}

export interface TrainingDailySession {
  id: string;
  plan_id: string;
  athlete_id: string;
  date: string;
  weekday: WeekdayId;
  templateId: TrainingTemplateId;
  titleKey: string;
  status: SessionStatus;
  duration_min: number;
  target_rpe: number;
  session_load: number;
  execution?: TrainingSessionExecution;
  warmUp: DailySessionSection;
  mainSection: DailySessionSection;
  accessoryWork: DailySessionSection;
  conditioning: DailySessionSection;
  recovery: DailySessionSection;
}

export interface TrainingPlan {
  id: string;
  athlete_id: string;
  title: string;
  week_start: string;
  goal_key: string;
  training_age_years: number;
  sessions: TrainingDailySession[];
  created_at: string;
  is_active: boolean;
}

export type TrainingPlanInput = Omit<TrainingPlan, 'id' | 'created_at'>;

export type AcwrZone = 'low' | 'optimal' | 'high' | 'danger';

export interface TrainingLoadSnapshot {
  sessionLoad: number;
  sessionPlannedLoad: number;
  weeklyLoad: number;
  weeklyPlannedLoad: number;
  weeklyActualLoad: number;
  acuteLoad: number;
  chronicLoad: number;
  acwr: number;
  acwrZone: AcwrZone;
}

export type TrainingRecommendationId =
  | 'reduce_intensity'
  | 'increase_volume'
  | 'recovery_session'
  | 'mobility_session'
  | 'injury_prevention_session';

export interface TrainingRecommendation {
  id: TrainingRecommendationId;
  priority: 'high' | 'medium' | 'low';
  titleKey: string;
  bodyKey: string;
}

export interface TrainingBuilderSnapshot {
  plan?: TrainingPlan;
  todaySession?: TrainingDailySession;
  nextSession?: TrainingDailySession;
  load: TrainingLoadSnapshot;
  compliance: TrainingComplianceSnapshot;
  progressPercent: number;
  recommendations: TrainingRecommendation[];
  weeklyOverview: Array<{ weekday: WeekdayId; templateId: TrainingTemplateId; load: number; actualLoad: number; status: SessionStatus }>;
}

export interface TrainingEngineInput {
  athleteId: string;
  position: string;
  testsCount: number;
  dateOfBirth?: string;
  analyticsOverall: number;
  readinessScore: number;
  recoveryScore: number;
  fatigueScore: number;
  injuryRiskScore: number;
  trainingLoadScore: number;
  decisionLevel: string;
  weaknessModuleIds: string[];
  hasActiveInjury: boolean;
  inRtp: boolean;
  trainingAgeYears: number;
}
