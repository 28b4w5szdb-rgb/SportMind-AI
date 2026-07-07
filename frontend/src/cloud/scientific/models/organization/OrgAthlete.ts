import type { CloudDocumentMeta } from '../common';

/** Scientific athlete profile. Path: `organizations/{orgId}/athletes/{athleteId}`. */
export interface OrgAthlete extends CloudDocumentMeta {
  organization_id: string;
  external_ids: Array<{ system: string; value: string }>;
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  sex?: 'male' | 'female' | 'other' | null;
  gender_identity?: string | null;
  nationality?: string | null;
  primary_sport_key?: string | null;
  position?: string | null;
  dominant_side?: 'left' | 'right' | 'ambidextrous' | null;
  competition_level?: string | null;
  team_ids: string[];
  consent_status: 'pending' | 'granted' | 'revoked';
  pseudonym_id?: string | null;
  /** Coach-visible medical availability — no diagnosis details. */
  availability_status?: 'available' | 'modified' | 'unavailable';
  status: 'active' | 'inactive' | 'archived';
}

export type OrgAthleteInput = Omit<
  OrgAthlete,
  keyof CloudDocumentMeta | 'status' | 'team_ids' | 'external_ids' | 'consent_status'
> & {
  status?: OrgAthlete['status'];
  team_ids?: string[];
  external_ids?: OrgAthlete['external_ids'];
  consent_status?: OrgAthlete['consent_status'];
};
