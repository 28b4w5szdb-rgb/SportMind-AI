import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { MockReport } from '@/src/data/mock/types';
import { useAthleteById } from '@/src/data/mock/hooks';
import { buildPreviewBlocks } from '../utils/reportContent';
import { builderMetaToConfig, buildReportSubtitle } from '../utils/reportMeta';
import type { ReportBuilderConfig, ReportPreviewBlock } from '../types';

export function useSavedReportPreview(report: MockReport | undefined) {
  const { t } = useTranslation();
  const athlete = useAthleteById(report?.athlete_id);

  const config: ReportBuilderConfig | null = useMemo(() => {
    if (!report) return null;
    return builderMetaToConfig(report);
  }, [report]);

  const isTeam = config?.scope === 'team' || report?.type === 'team';

  const blocks: ReportPreviewBlock[] = useMemo(() => {
    if (!report || !config) return [];
    const fallback = t('reportBuilder.preview.noContent');
    return buildPreviewBlocks(config.sectionOrder, report.sections, isTeam, fallback, {
      includeEmpty: Boolean(report.builder_meta),
    });
  }, [config, isTeam, report, t]);

  const subtitle = useMemo(() => {
    if (!config) return '';
    const name = athlete ? `${athlete.first_name} ${athlete.last_name}` : undefined;
    return buildReportSubtitle(config, name, t);
  }, [athlete, config, t]);

  return { config, blocks, subtitle, athlete, isTeam };
}
