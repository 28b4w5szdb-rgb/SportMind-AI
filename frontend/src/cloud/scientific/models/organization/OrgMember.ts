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
}

export type OrgMemberInput = Omit<OrgMember, keyof CloudDocumentMeta | 'status'> & {
  status?: OrgMember['status'];
};
