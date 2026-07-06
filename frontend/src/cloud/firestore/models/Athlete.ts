import type { AthleteStatus, CloudDocumentMeta } from './common';

/** Athlete profile. Collection: `athletes/{id}`. */
export interface Athlete extends CloudDocumentMeta {
  organization_id: string;
  team_ids: string[];
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
}

export type AthleteInput = Omit<Athlete, keyof CloudDocumentMeta | 'tests_count' | 'trend_percent'> & {
  tests_count?: number;
  trend_percent?: number;
};
