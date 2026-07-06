import type { CloudDocumentMeta } from './common';

/** Training plan header — sessions stored as subcollection or embedded. */
export interface TrainingPlan extends CloudDocumentMeta {
  organization_id: string;
  athlete_id: string;
  title: string;
  week_start: string;
  goal_key: string;
  training_age_years: number;
  is_active: boolean;
  session_count: number;
}

export type TrainingPlanInput = Omit<TrainingPlan, keyof CloudDocumentMeta | 'session_count'> & {
  session_count?: number;
};
