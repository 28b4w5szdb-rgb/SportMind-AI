import { useMemo } from 'react';

import { buildSecurityContext } from '@/src/cloud/scientific/security/accessControl';
import { useAuth } from '@/src/cloud/auth/useAuth';
import { getDataMode } from '@/src/core/config/cloud';
import { DEV_BYPASS_AUTH } from '@/src/core/config/dev';

import {
  WORKSPACE_MOCK_ORG_ID,
  WORKSPACE_ROLE_PRESETS,
  devWorkspaceRoleFromEnv,
  type WorkspaceRole,
} from '../security/workspaceRolePresets';

const DEV_MOCK_UID = 'dev_workspace_user';

export function useWorkspaceSecurityContext(): {
  securityContext: ReturnType<typeof buildSecurityContext>;
  workspaceRole: WorkspaceRole;
  organizationId: string;
} {
  const auth = useAuth();

  return useMemo(() => {
    const workspaceRole = DEV_BYPASS_AUTH ? devWorkspaceRoleFromEnv() : 'coach';
    const preset = WORKSPACE_ROLE_PRESETS[workspaceRole];
    const uid = auth.cloudAuthUser?.uid ?? auth.user?.id ?? DEV_MOCK_UID;

    const securityContext = buildSecurityContext(
      uid,
      WORKSPACE_MOCK_ORG_ID,
      preset.claims,
      preset.membership
    );

    return {
      securityContext,
      workspaceRole,
      organizationId: WORKSPACE_MOCK_ORG_ID,
    };
  }, [auth.cloudAuthUser?.uid, auth.user?.id]);
}

export function useWorkspaceDataMode() {
  return useMemo(
    () => ({
      dataMode: getDataMode(),
      scientificCloudEnabled: getDataMode() === 'cloud',
    }),
    []
  );
}
