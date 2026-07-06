import type { AppLanguage, CloudDocumentMeta, OrganizationType } from '../common';

/** Organization root document — extends Phase 6A with scientific metadata. */
export interface ScientificOrganization extends CloudDocumentMeta {
  name: string;
  slug: string;
  org_type: OrganizationType;
  default_language: AppLanguage;
  timezone: string;
  country_code?: string | null;
  primary_sport_keys: string[];
  owner_uid: string;
  plan: 'trial' | 'team' | 'enterprise' | 'research';
  feature_flags: {
    scientific_cloud: boolean;
    clinical_mode: boolean;
    research_export: boolean;
  };
  data_retention_days?: number | null;
  status: 'active' | 'suspended';
}

export type ScientificOrganizationInput = Omit<
  ScientificOrganization,
  keyof CloudDocumentMeta | 'status' | 'feature_flags'
> & {
  status?: ScientificOrganization['status'];
  feature_flags?: Partial<ScientificOrganization['feature_flags']>;
};
