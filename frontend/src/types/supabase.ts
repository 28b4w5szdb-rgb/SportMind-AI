/**
 * Supabase domain types — re-exports schema types and app-level shapes.
 */

export type {
  Database,
  Json,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Organization,
  OrganizationMember,
  Athlete,
  Team,
  UserRole,
  OrganizationType,
  AiAgentType,
} from '@/src/services/supabase/database.types';

import type { Organization, OrganizationMember, UserRole } from '@/src/services/supabase/database.types';

/** Organization row embedded in a membership query. */
export type OrganizationSummary = Pick<
  Organization,
  'id' | 'name' | 'slug' | 'type' | 'settings' | 'is_active'
>;

/** Result shape for getUserOrganizations(). */
export type UserOrganizationMembership = Pick<
  OrganizationMember,
  'id' | 'role' | 'joined_at' | 'is_primary'
> & {
  organization: OrganizationSummary | null;
};

export interface AuthUserContext {
  userId: string;
  email: string | undefined;
  role: UserRole | undefined;
  organizationId: string | null | undefined;
}
