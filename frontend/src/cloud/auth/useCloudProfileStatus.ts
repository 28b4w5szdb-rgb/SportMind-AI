/**
 * Cloud profile document readiness for settings UI.
 */

import { useEffect, useState } from 'react';

import { shouldUseFirebaseAuth } from '@/src/cloud/auth/config';
import { UserProfileService } from '@/src/cloud/auth/UserProfileService';
import type { CloudProfileDocumentStatus } from '@/src/cloud/auth/UserProfile';
import { useAuth } from '@/src/cloud/auth/useAuth';

const INITIAL: CloudProfileDocumentStatus = {
  loading: true,
  exists: false,
  lastLogin: null,
  accountCreated: null,
  errorKey: null,
};

export function useCloudProfileStatus(): CloudProfileDocumentStatus {
  const auth = useAuth();
  const [status, setStatus] = useState<CloudProfileDocumentStatus>(INITIAL);

  useEffect(() => {
    if (!shouldUseFirebaseAuth() || !auth.isAuthenticated || !auth.cloudAuthUser) {
      setStatus({
        loading: false,
        exists: false,
        lastLogin: null,
        accountCreated: null,
        errorKey: null,
      });
      return;
    }

    let mounted = true;
    setStatus((prev) => ({ ...prev, loading: true, errorKey: null }));

    UserProfileService.getProfile(auth.cloudAuthUser.uid)
      .then((profile) => {
        if (!mounted) return;
        setStatus({
          loading: false,
          exists: Boolean(profile),
          lastLogin: profile?.lastLogin ?? null,
          accountCreated: profile?.createdAt ?? null,
          errorKey: null,
        });
      })
      .catch(() => {
        if (!mounted) return;
        setStatus({
          loading: false,
          exists: false,
          lastLogin: null,
          accountCreated: null,
          errorKey: 'auth.errors.networkFailure',
        });
      });

    return () => {
      mounted = false;
    };
  }, [auth.cloudAuthUser, auth.isAuthenticated]);

  return status;
}
