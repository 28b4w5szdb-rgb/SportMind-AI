import type { CloudDocumentMeta } from '../common';

/** Organization team. Path: `organizations/{orgId}/teams/{teamId}`. */
export interface OrgTeam extends CloudDocumentMeta {
  organization_id: string;
  name: string;
  sport_key: string;
  gender_category?: 'male' | 'female' | 'mixed' | null;
  competition_level?: string | null;
  season_ids: string[];
  staff_user_ids: string[];
  status: 'active' | 'archived';
}

export type OrgTeamInput = Omit<OrgTeam, keyof CloudDocumentMeta | 'status' | 'season_ids' | 'staff_user_ids'> & {
  status?: OrgTeam['status'];
  season_ids?: string[];
  staff_user_ids?: string[];
};

/** Team membership junction. Path: `organizations/{orgId}/teams/{teamId}/memberships/{athleteId}`. */
export interface OrgTeamMembership extends CloudDocumentMeta {
  organization_id: string;
  team_id: string;
  athlete_id: string;
  joined_at: string;
  left_at?: string | null;
  active: boolean;
}
