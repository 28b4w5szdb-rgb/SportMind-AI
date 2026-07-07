import { Alert } from 'react-native';
import type { TFunction } from 'i18next';

import type { ExportResult } from '@/src/cloud/scientific/export';
import { resolveExportStatusMessage } from '@/src/features/scientific-export';

export type ReportExportFormat = 'pdf' | 'word' | 'excel';

export function showReportExportAlert(format: ReportExportFormat, t: TFunction, reportId?: string): void {
  const engineNote = reportId
    ? `\n\n${t('scientificReport.export.engineReady', { reportId })}`
    : `\n\n${t('scientificReport.export.engineFallback')}`;
  Alert.alert(
    t('reportBuilder.export.title', { format: format.toUpperCase() }),
    `${t(`reportBuilder.export.${format}Message`)}${engineNote}`,
    [{ text: t('common.close'), style: 'default' }]
  );
}

export function showScientificExportResultAlert(
  format: ReportExportFormat,
  result: ExportResult,
  t: TFunction,
  language: string
): void {
  const message = resolveExportStatusMessage(result, language);
  const comingSoon = result.format_coming_soon
    ? `\n\n${t('scientificExport.formatComingSoon')}`
    : '';
  const artifactNote = result.artifact
    ? `\n\n${t('scientificExport.preparedMeta', {
        file: result.artifact.file_name_placeholder,
        sections: result.artifact.section_count,
      })}`
    : '';

  Alert.alert(
    t('scientificExport.title', { format: format.toUpperCase() }),
    `${message}${comingSoon}${artifactNote}`,
    [{ text: t('common.close'), style: 'default' }]
  );
}
