import type { CloudDocumentMeta } from './common';

export interface TeamStaffMember {
  role: string;
  name: string;
  uid?: string;
}

/** Squad within an organization. Collection: `teams/{id}`. */
export interface Team extends CloudDocumentMeta {
  organization_id: string;
  name: string;
  sport: string;
  athlete_ids: string[];
  head_coach?: string;
  head_coach_uid?: string;
  staff?: TeamStaffMember[];
}

export type TeamInput = Omit<Team, keyof CloudDocumentMeta>;
