import type { CloudDocumentMeta } from '../common';

export type PermissionAction = 'read' | 'write' | 'approve' | 'export' | 'deidentify';

export interface RolePermission {
  resource: string;
  actions: PermissionAction[];
}

/** Organization role definition. Path: `organizations/{orgId}/role_definitions/{roleId}`. */
export interface OrgRoleDefinition extends CloudDocumentMeta {
  organization_id: string;
  key: string;
  name: string;
  scope: 'org' | 'team' | 'athlete';
  permissions: RolePermission[];
  system_role: boolean;
  active: boolean;
}

export type OrgRoleDefinitionInput = Omit<
  OrgRoleDefinition,
  keyof CloudDocumentMeta | 'active' | 'system_role'
> & {
  active?: boolean;
  system_role?: boolean;
};
