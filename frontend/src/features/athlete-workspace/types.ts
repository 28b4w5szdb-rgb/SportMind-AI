import type { AnalyticsModuleId } from '@/src/analytics/types';

export type AthleteTimelineEventType =
  | 'test'
  | 'training'
  | 'recovery'
  | 'injury'
  | 'nutrition'
  | 'ai_recommendation'
  | 'report';

export interface AthleteTimelineEvent {
  id: string;
  athleteId: string;
  type: AthleteTimelineEventType;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  date: string;
}

export interface AthleteGoal {
  id: string;
  titleKey: string;
  moduleId: AnalyticsModuleId;
  progress: number;
  target: number;
  invert?: boolean;
}

export type QuickActionId =
  | 'add_test'
  | 'daily_checkin'
  | 'add_injury'
  | 'injury_prevention'
  | 'training_builder'
  | 'log_session'
  | 'nutrition_log'
  | 'nutrition_center'
  | 'log_body_composition'
  | 'connect_device'
  | 'sync_wearable'
  | 'edit_athlete'
  | 'create_report'
  | 'compare'
  | 'ask_ai'
  | 'export';
