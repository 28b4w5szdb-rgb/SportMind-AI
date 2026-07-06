import type { CloudDocumentMeta } from '../common';

export interface SeasonPhaseDefinition {
  key: string;
  name: string;
  start_date: string;
  end_date: string;
}

/** Season boundary for longitudinal tracking. Path: `organizations/{orgId}/seasons/{seasonId}`. */
export interface OrgSeason extends CloudDocumentMeta {
  organization_id: string;
  team_id?: string | null;
  name: string;
  start_date: string;
  end_date: string;
  competition_name?: string | null;
  phase_definitions: SeasonPhaseDefinition[];
  status: 'planned' | 'active' | 'completed';
}

export type OrgSeasonInput = Omit<
  OrgSeason,
  keyof CloudDocumentMeta | 'status' | 'phase_definitions'
> & {
  status?: OrgSeason['status'];
  phase_definitions?: SeasonPhaseDefinition[];
};
