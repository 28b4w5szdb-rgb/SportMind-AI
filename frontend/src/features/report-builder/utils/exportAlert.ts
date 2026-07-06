import { Alert } from 'react-native';
import type { TFunction } from 'i18next';

export type ReportExportFormat = 'pdf' | 'word' | 'excel';

export function showReportExportAlert(format: ReportExportFormat, t: TFunction): void {
  Alert.alert(
    t('reportBuilder.export.title', { format: format.toUpperCase() }),
    t(`reportBuilder.export.${format}Message`),
    [{ text: t('common.close'), style: 'default' }]
  );
}
