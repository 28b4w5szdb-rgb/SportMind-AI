import React from 'react';
import { View, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { Badge } from '@/src/components/common/Badge';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { getThemeById } from '../constants';
import { ReportSectionBlock, ReportChartsBlock } from './blocks/ReportSectionBlock';
import type { ReportBuilderConfig, ReportPreviewBlock } from '../types';

interface ReportPreviewProps {
  config: ReportBuilderConfig;
  blocks: ReportPreviewBlock[];
  subtitle: string;
  onSave?: () => void;
  saving?: boolean;
  showExport?: boolean;
}

export function ReportPreview({ config, blocks, subtitle, onSave, saving, showExport = true }: ReportPreviewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const reportTheme = getThemeById(config.theme);

  const handleExport = (format: 'pdf' | 'word' | 'excel') => {
    Alert.alert(t('features.reports.exportTitle', { format: format.toUpperCase() }), t('reportBuilder.export.placeholder'));
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
        </View>
      </LinearGradient>

      {blocks.length === 0 ? (
        <Card variant="filled" padding="lg" style={{ marginBottom: theme.spacing.lg, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: textAlign('center') }]}>
            {t('reportBuilder.preview.empty')}
          </Text>
        </Card>
      ) : (
        blocks.map((block, index) => (
          <View key={block.id}>
            <ReportSectionBlock block={block} accent={reportTheme.accent} accentSoft={reportTheme.accentSoft} index={index} />
            {block.id === 'charts' ? (
              <Card variant="filled" padding="md" style={{ marginTop: -theme.spacing.sm, marginBottom: theme.spacing.md, borderRadius: theme.borderRadius.xl }}>
                <ReportChartsBlock body={block.body} accent={reportTheme.accent} accentSoft={reportTheme.accentSoft} />
              </Card>
            ) : null}
          </View>
        ))
      )}

      {showExport ? (
        <>
          <SectionHeader title={t('features.reports.exportSection')} subtitle={t('reportBuilder.export.subtitle')} titleSize="h5" />
          <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginBottom: theme.spacing.lg, flexWrap: 'wrap' }}>
            {(
              [
                { id: 'pdf', icon: 'document', label: 'PDF' },
                { id: 'word', icon: 'document-text', label: 'Word' },
                { id: 'excel', icon: 'grid', label: 'Excel' },
              ] as const
            ).map((item) => (
              <Button
                key={item.id}
                title={item.label}
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
    </View>
  );
}
