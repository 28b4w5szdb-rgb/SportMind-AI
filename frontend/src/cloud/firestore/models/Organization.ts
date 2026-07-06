import type { CloudDocumentMeta } from './common';

/** Multi-tenant organization / club. Collection: `organizations/{id}`. */
export interface Organization extends CloudDocumentMeta {
  name: string;
  slug: string;
  sport?: string;
  country_code?: string;
  logo_url?: string;
  owner_uid: string;
  member_count: number;
  plan: 'trial' | 'team' | 'enterprise';
}

export type OrganizationInput = Omit<Organization, keyof CloudDocumentMeta>;
