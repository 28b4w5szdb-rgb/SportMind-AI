import type { CloudDocumentMeta } from '../common';

/** Organization sport configuration override. Path: `organizations/{orgId}/sport_configs/{sportConfigId}`. */
export interface OrgSportConfig extends CloudDocumentMeta {
  organization_id: string;
  sport_key: string;
  custom_positions: string[];
  custom_assessment_definition_ids: string[];
  normative_reference_override_ids: string[];
  active: boolean;
}

export type OrgSportConfigInput = Omit<
  OrgSportConfig,
  keyof CloudDocumentMeta | 'active' | 'custom_positions' | 'custom_assessment_definition_ids' | 'normative_reference_override_ids'
> & {
  active?: boolean;
  custom_positions?: string[];
  custom_assessment_definition_ids?: string[];
  normative_reference_override_ids?: string[];
};
