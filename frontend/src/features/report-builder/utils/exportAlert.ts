import { Alert } from 'react-native';
import type { TFunction } from 'i18next';

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
