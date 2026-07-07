/**
 * Reports data hook — mock + cloud merge (Phase 7.2).
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

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
  refresh: () => void;
} {
  const mockReports = useMockStore((s) => s.reports);
  const cloudEnabled = canAccessScientificFirestore();
  const [cloudReports, setCloudReports] = useState<import('@/src/cloud/scientific/models/report').PersistedScientificReportRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCloud = useCallback(async () => {
    if (!cloudEnabled) {
      setCloudReports([]);
      return;
    }
    setLoading(true);
    try {
      const rows = await listScientificReportsFromFirestore(WORKSPACE_MOCK_ORG_ID);
      setCloudReports(rows);
    } finally {
      setLoading(false);
    }
  }, [cloudEnabled]);

  useEffect(() => {
    loadCloud();
  }, [loadCloud]);

  const reports = useMemo(
    () => (cloudEnabled ? mergeReportLists(mockReports, cloudReports) : mockReports),
    [cloudEnabled, cloudReports, mockReports]
  );

  return { reports, loading, cloudEnabled, refresh: loadCloud };
}
