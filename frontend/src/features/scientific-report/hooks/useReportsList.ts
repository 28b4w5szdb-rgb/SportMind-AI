import { useCallback, useEffect, useMemo, useState } from 'react';

import { logScientificCloudError } from '@/src/cloud/scientific/adapters/cloudErrorDiagnostics';
import { canAccessScientificFirestore } from '@/src/cloud/scientific/config';
import type { MockReport } from '@/src/data/mock/types';
import { useMockStore } from '@/src/data/mock/store';
import { WORKSPACE_MOCK_ORG_ID } from '@/src/features/athlete-workspace/security/workspaceRolePresets';

import { listScientificReportsFromFirestore } from '../persistence/scientificReportFirestoreAdapter';
import { mergeReportLists } from '../persistence/scientificReportMapper';

export function useReportsList(): {
  reports: MockReport[];
  loading: boolean;
  cloudEnabled: boolean;
  cloudError?: string;
  refresh: () => void;
} {
  const mockReports = useMockStore((s) => s.reports);
  const cloudEnabled = canAccessScientificFirestore();
  const [cloudReports, setCloudReports] = useState<import('@/src/cloud/scientific/models/report').PersistedScientificReportRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [cloudError, setCloudError] = useState<string | undefined>();

  const loadCloud = useCallback(async () => {
    if (!cloudEnabled) {
      setCloudReports([]);
      setCloudError(undefined);
      return;
    }
    setLoading(true);
    setCloudError(undefined);
    try {
      const rows = await listScientificReportsFromFirestore(WORKSPACE_MOCK_ORG_ID);
      setCloudReports(rows);
    } catch (e) {
      logScientificCloudError(e, 'useReportsList');
      setCloudReports([]);
      setCloudError('read_failed');
    } finally {
      setLoading(false);
    }
  }, [cloudEnabled]);

  useEffect(() => {
    loadCloud();
  }, [loadCloud]);

  const reports = useMemo(
    () => (cloudEnabled && !cloudError ? mergeReportLists(mockReports, cloudReports) : mockReports),
    [cloudEnabled, cloudError, cloudReports, mockReports]
  );

  return { reports, loading, cloudEnabled, cloudError, refresh: loadCloud };
}
