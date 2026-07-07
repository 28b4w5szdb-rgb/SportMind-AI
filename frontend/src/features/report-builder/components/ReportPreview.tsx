import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { Badge } from '@/src/components/common/Badge';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { MockReportSections, MockReportStatus } from '@/src/data/mock/types';
import { reportStatusVariant } from '@/src/utils/moduleHelpers';
import { getThemeById } from '../constants';
import { ReportSectionBlock, ReportChartsBlock } from './blocks/ReportSectionBlock';
import { showReportExportAlert } from '../utils/exportAlert';
import type { ReportBuilderConfig, ReportPreviewBlock } from '../types';
import type { ScientificReport } from '@/src/cloud/scientific/models/report';
import { ScientificReportPreview } from '@/src/features/scientific-report';

interface ReportPreviewProps {
  config: ReportBuilderConfig;
  blocks: ReportPreviewBlock[];
  subtitle: string;
  sections?: MockReportSections;
  scientificReport?: ScientificReport | null;
  onSave?: () => void;
  saving?: boolean;
  showExport?: boolean;
  status?: MockReportStatus;
  createdAt?: string;
  onMarkReady?: () => void;
  onMarkExported?: () => void;
  actionLoading?: boolean;
}

export function ReportPreview({
  config,
  blocks,
  subtitle,
  sections,
  scientificReport,
  onSave,
  saving,
  showExport = true,
  status,
  createdAt,
  onMarkReady,
  onMarkExported,
  actionLoading,
}: ReportPreviewProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const reportTheme = getThemeById(config.theme);
  const chartSections = sections ?? ({} as MockReportSections);

  const handleExport = (format: 'pdf' | 'word' | 'excel') => {
    showReportExportAlert(format, t, scientificReport?.report_id);
  };

  return (
    <View>
      <LinearGradient
        colors={[reportTheme.accent, reportTheme.accent + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: theme.borderRadius['2xl'], padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}
      >
        <Text style={[type.overline, { color: 'rgba(255,255,255,0.75)', letterSpacing: 1.5, textAlign: textAlign('start') }]}>
          {t('reportBuilder.preview.label')}
        </Text>
        <Text style={[type.h3, { color: reportTheme.headerText, marginTop: 4, textAlign: textAlign('start') }]}>{config.title}</Text>
        <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.9)', marginTop: 6, textAlign: textAlign('start') }]}>{subtitle}</Text>
        <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginTop: theme.spacing.md, flexWrap: 'wrap' }}>
          <Badge label={t(`reportBuilder.types.${config.reportType}`)} variant="info" />
          <Badge label={t(`reportBuilder.themes.${config.theme}`)} variant="info" />
          <Badge label={t('reportBuilder.preview.sectionsCount', { count: blocks.length })} variant="info" />
          {status ? <Badge label={t(`features.reports.status.${status}`)} variant={reportStatusVariant(status)} /> : null}
        </View>
        {createdAt ? (
          <Text style={[type.caption, { color: 'rgba(255,255,255,0.75)', marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
            {new Date(createdAt).toLocaleString(isRTL ? 'ar' : 'en')}
          </Text>
        ) : null}
      </LinearGradient>

      {scientificReport ? <ScientificReportPreview report={scientificReport} /> : null}

      {!scientificReport && blocks.length === 0 ? (
        <Card variant="filled" padding="lg" style={{ marginBottom: theme.spacing.lg, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: textAlign('center') }]}>
            {t('reportBuilder.preview.empty')}
          </Text>
        </Card>
      ) : !scientificReport ? (
        blocks.map((block, index) => (
          <View key={`${block.id}-${index}`}>
            {block.id === 'charts' ? (
              <>
                <ReportSectionBlock block={block} accent={reportTheme.accent} accentSoft={reportTheme.accentSoft} index={index} hideBody />
                <Card
                  variant="filled"
                  padding="md"
                  style={{ marginTop: -theme.spacing.sm, marginBottom: theme.spacing.md, borderRadius: theme.borderRadius.xl }}
                >
                  <ReportChartsBlock body={block.body} sections={chartSections} accent={reportTheme.accent} accentSoft={reportTheme.accentSoft} />
                </Card>
              </>
            ) : (
              <ReportSectionBlock block={block} accent={reportTheme.accent} accentSoft={reportTheme.accentSoft} index={index} />
            )}
          </View>
        ))
      ) : null}

      {showExport ? (
        <>
          <SectionHeader title={t('features.reports.exportSection')} subtitle={t('reportBuilder.export.subtitle')} titleSize="h5" />
          <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginBottom: theme.spacing.lg, flexWrap: 'wrap' }}>
            {(
              [
                { id: 'pdf', icon: 'document', labelKey: 'reportBuilder.export.pdf' },
                { id: 'word', icon: 'document-text', labelKey: 'reportBuilder.export.word' },
                { id: 'excel', icon: 'grid', labelKey: 'reportBuilder.export.excel' },
              ] as const
            ).map((item) => (
              <Button
                key={item.id}
                title={t(item.labelKey)}
                onPress={() => handleExport(item.id)}
                variant="outline"
                size="small"
                icon={item.icon}
                style={{ flex: 1, minWidth: 100 }}
              />
            ))}
          </View>
        </>
      ) : null}

      {onSave ? (
        <Button
          title={saving ? t('common.saving') : t('reportBuilder.preview.saveDraft')}
          onPress={onSave}
          loading={saving}
          disabled={saving}
          fullWidth
          icon="save"
        />
      ) : null}

      {status === 'draft' && onMarkReady ? (
        <Button
          title={t('features.reports.markReady')}
          onPress={onMarkReady}
          loading={actionLoading}
          disabled={actionLoading}
          variant="primary"
          fullWidth
          icon="checkmark-circle"
          style={{ marginTop: theme.spacing.sm }}
        />
      ) : null}
      {status === 'ready' && onMarkExported ? (
        <Button
          title={t('features.reports.markExported')}
          onPress={onMarkExported}
          loading={actionLoading}
          disabled={actionLoading}
          variant="secondary"
          fullWidth
          icon="download"
          style={{ marginTop: theme.spacing.sm }}
        />
      ) : null}
    </View>
  );
}
