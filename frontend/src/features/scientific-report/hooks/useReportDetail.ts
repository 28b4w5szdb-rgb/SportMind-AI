/**
 * Report detail hook — cloud first, mock fallback (Phase 7.2).
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { buildSecurityContext } from '@/src/cloud/scientific/security/accessControl';
import { filterReportForContext } from '@/src/cloud/scientific/security/reportAccess';
import { canAccessScientificFirestore } from '@/src/cloud/scientific/config';
import type { MockReport } from '@/src/data/mock/types';
import { useReportById } from '@/src/data/mock/hooks';
import { WORKSPACE_MOCK_ORG_ID } from '@/src/features/athlete-workspace/security/workspaceRolePresets';

import { tryLoadScientificReportFromFirestore } from '../persistence/scientificReportFirestoreAdapter';
import { loadPersistedScientificReport } from '../persistence/scientificReportPersistence';
import { persistedRecordToMockReport } from '../persistence/scientificReportMapper';

const DEV_MOCK_UID = 'dev_report_detail';

export function useReportDetail(reportId: string | undefined): {
  report: MockReport | undefined;
  loading: boolean;
  source: 'cloud' | 'mock' | 'none';
  refresh: () => void;
} {
  const mockReport = useReportById(reportId);
  const cloudEnabled = canAccessScientificFirestore();
  const [cloudReport, setCloudReport] = useState<MockReport | undefined>();
  const [loading, setLoading] = useState(false);

  const securityContext = useMemo(
    () => buildSecurityContext(DEV_MOCK_UID, WORKSPACE_MOCK_ORG_ID, { roleIds: ['coach'] }, null),
    []
  );

  const loadCloud = useCallback(async () => {
    if (!reportId || !cloudEnabled) {
      setCloudReport(undefined);
      return;
    }
    setLoading(true);
    try {
      const result = await tryLoadScientificReportFromFirestore(WORKSPACE_MOCK_ORG_ID, reportId);
      if (result.ok) {
        const mapped = persistedRecordToMockReport(result.record);
        const scientific = loadPersistedScientificReport(mapped);
        if (scientific) {
          mapped.scientific_report = filterReportForContext(scientific, securityContext);
        }
        setCloudReport(mapped);
      } else {
        setCloudReport(undefined);
      }
    } finally {
      setLoading(false);
    }
  }, [cloudEnabled, reportId, securityContext]);

  useEffect(() => {
    loadCloud();
  }, [loadCloud]);

  const report = useMemo(() => {
    if (cloudReport) return cloudReport;
    if (mockReport) {
      const scientific = loadPersistedScientificReport(mockReport);
      if (scientific) {
        return {
          ...mockReport,
          scientific_report: filterReportForContext(scientific, securityContext),
        };
      }
      return mockReport;
    }
    return undefined;
  }, [cloudReport, mockReport, securityContext]);

  const resolvedSource: 'cloud' | 'mock' | 'none' = cloudReport ? 'cloud' : mockReport ? 'mock' : 'none';

  return {
    report,
    loading,
    source: resolvedSource,
    refresh: loadCloud,
  };
}
