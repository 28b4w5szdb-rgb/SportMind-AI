import { useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_REPORT_LIST_LIMIT } from '@/src/cloud/scientific/models/common/ListPagination';
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
  hasMore: boolean;
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
      const rows = await listScientificReportsFromFirestore(WORKSPACE_MOCK_ORG_ID, {
        limit: DEFAULT_REPORT_LIST_LIMIT,
      });
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

  const reports = useMemo(() => {
    const merged =
      cloudEnabled && !cloudError ? mergeReportLists(mockReports, cloudReports) : mockReports;
    return merged
      .slice()
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, DEFAULT_REPORT_LIST_LIMIT);
  }, [cloudEnabled, cloudError, cloudReports, mockReports]);

  const hasMore = useMemo(() => {
    const mergedCount =
      cloudEnabled && !cloudError
        ? mergeReportLists(mockReports, cloudReports).length
        : mockReports.length;
    return mergedCount > DEFAULT_REPORT_LIST_LIMIT;
  }, [cloudEnabled, cloudError, cloudReports, mockReports]);

  return { reports, loading, cloudEnabled, cloudError, refresh: loadCloud, hasMore };
}
