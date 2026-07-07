import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Button } from '@/src/components/common/Button';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { useReportDetail } from '@/src/features/scientific-report/hooks/useReportDetail';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useFormAction } from '@/src/hooks/useFormAction';
import { ReportPreview, useSavedReportPreview } from '@/src/features/report-builder';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { report } = useReportDetail(id);
  const updateReport = useMockStore((s) => s.updateReport);
  const { loading, success, run } = useFormAction();
  const { config, blocks, subtitle, scientificReport } = useSavedReportPreview(report);

  if (!report || !config) {
    return (
      <FeatureScrollScreen title={t('features.reports.detailTitle')}>
        <EmptyState
          icon="document-text-outline"
          title={t('features.reports.notFoundTitle')}
          description={t('features.reports.notFoundDesc')}
          actionLabel={t('common.back')}
          onAction={() => router.replace(APP_ROUTES.reports)}
        />
      </FeatureScrollScreen>
    );
  }

  const markReady = () => {
    run(() => updateReport(report.id, { status: 'ready' }));
  };

  const markExported = () => {
    run(() => updateReport(report.id, { status: 'exported' }));
  };

  return (
    <FeatureScrollScreen title={t('features.reports.detailTitle')}>
      <SuccessBanner message={t('features.reports.updated')} visible={success} />

      <ReportPreview
        config={config}
        blocks={blocks}
        subtitle={subtitle}
        sections={report.sections}
        scientificReport={scientificReport}
        status={report.status}
        createdAt={report.created_at}
        onMarkReady={markReady}
        onMarkExported={markExported}
        actionLoading={loading}
      />

      <Button title={t('common.back')} onPress={() => router.replace(APP_ROUTES.reports)} variant="ghost" fullWidth style={{ marginTop: 8 }} />
    </FeatureScrollScreen>
  );
}
