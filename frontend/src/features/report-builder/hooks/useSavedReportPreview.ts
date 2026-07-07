import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { buildSecurityContext } from '@/src/cloud/scientific/security/accessControl';
import { filterReportForContext } from '@/src/cloud/scientific/security/reportAccess';
import type { MockReport } from '@/src/data/mock/types';
import { useAthleteById } from '@/src/data/mock/hooks';
import {
  isPersistedScientificReport,
  loadPersistedScientificReport,
} from '@/src/features/scientific-report/persistence/scientificReportPersistence';
import { WORKSPACE_MOCK_ORG_ID } from '@/src/features/athlete-workspace/security/workspaceRolePresets';
import { buildPreviewBlocks } from '../utils/reportContent';
import { builderMetaToConfig, buildReportSubtitle } from '../utils/reportMeta';
import type { ReportBuilderConfig, ReportPreviewBlock } from '../types';

const DEV_MOCK_UID = 'dev_saved_report';

export function useSavedReportPreview(report: MockReport | undefined) {
  const { t } = useTranslation();
  const athlete = useAthleteById(report?.athlete_id);

  const config: ReportBuilderConfig | null = useMemo(() => {
    if (!report) return null;
    return builderMetaToConfig(report);
  }, [report]);

  const isTeam = config?.scope === 'team' || report?.type === 'team';
  const isScientific = isPersistedScientificReport(report);

  const securityContext = useMemo(
    () => buildSecurityContext(DEV_MOCK_UID, WORKSPACE_MOCK_ORG_ID, { roleIds: ['coach'] }, null),
    []
  );

  const scientificReport = useMemo(() => {
    const loaded = loadPersistedScientificReport(report);
    if (!loaded) return null;
    return filterReportForContext(loaded, securityContext);
  }, [report, securityContext]);

  const blocks: ReportPreviewBlock[] = useMemo(() => {
    if (!report || !config || isScientific) return [];
    const fallback = t('reportBuilder.preview.noContent');
    return buildPreviewBlocks(config.sectionOrder, report.sections, isTeam, fallback, {
      includeEmpty: Boolean(report.builder_meta),
    });
  }, [config, isScientific, isTeam, report, t]);

  const subtitle = useMemo(() => {
    if (!config) return '';
    const name = athlete ? `${athlete.first_name} ${athlete.last_name}` : undefined;
    return buildReportSubtitle(config, name, t);
  }, [athlete, config, t]);

  return { config, blocks, subtitle, athlete, isTeam, scientificReport, isScientific };
}
