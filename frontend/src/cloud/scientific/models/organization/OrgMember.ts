import type { AppLanguage, CloudDocumentMeta } from '../common';

/** Organization staff member. Path: `organizations/{orgId}/users/{userId}`. */
export interface OrgMember extends CloudDocumentMeta {
  organization_id: string;
  uid: string;
  email: string;
  display_name: string;
  role_ids: string[];
  team_ids: string[];
  language: AppLanguage;
  credentials?: string[] | null;
  department?: string | null;
  status: 'active' | 'inactive' | 'invited';
  /** Direct permission keys granted on membership document. */
  permissions?: string[];
  /** Grants clinical read/write when true (in addition to role-derived permissions). */
  clinical_access?: boolean;
  /** Grants read_research when true. */
  research_access?: boolean;
  /** Grants export_research when true. */
  export_research?: boolean;
}

export type OrgMemberInput = Omit<OrgMember, keyof CloudDocumentMeta | 'status'> & {
  status?: OrgMember['status'];
  permissions?: string[];
  clinical_access?: boolean;
  research_access?: boolean;
  export_research?: boolean;
};
