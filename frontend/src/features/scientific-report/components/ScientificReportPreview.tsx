/**
 * Scientific Report Preview — structured bilingual sections (Phase 7.0).
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { ScientificReport, ScientificReportSection } from '@/src/cloud/scientific/models/report';

interface ScientificReportPreviewProps {
  report: ScientificReport;
  compact?: boolean;
}

function SectionCard({
  section,
  index,
  lang,
}: {
  section: ScientificReportSection;
  index: number;
  lang: 'en' | 'ar';
}) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  if (section.is_empty && section.section_id !== 'cover' && section.section_id !== 'signature') {
    return null;
  }

  const title = lang === 'ar' ? section.title.ar : section.title.en;
  const body = lang === 'ar' ? section.body.ar : section.body.en;

  return (
    <Card variant="elevated" padding="md" style={{ marginBottom: theme.spacing.md, borderRadius: theme.borderRadius.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: theme.colors.primary + '18',
            alignItems: 'center',
            justifyContent: 'center',
            marginEnd: theme.spacing.sm,
          }}
        >
          <Text style={[type.caption, { color: theme.colors.primary, fontWeight: '700' }]}>{index + 1}</Text>
        </View>
        <Text style={[type.h6, { flex: 1, color: theme.colors.text, textAlign: textAlign('start') }]}>{title}</Text>
        {section.evidence_tier ? (
          <Badge label={section.evidence_tier} variant="info" />
        ) : null}
      </View>
      <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start'), lineHeight: 22 }]}>
        {body}
      </Text>
      {section.bullet_points.length > 0 ? (
        <View style={{ marginTop: theme.spacing.sm }}>
          {section.bullet_points.map((bp, i) => (
            <Text
              key={i}
              style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start'), marginTop: 4 }]}
            >
              • {lang === 'ar' ? bp.ar : bp.en}
            </Text>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

export function ScientificReportPreview({ report, compact = false }: ScientificReportPreviewProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign, flexRow } = useDirection();
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const visibleSections = report.sections.filter(
    (s) => !s.is_empty || s.section_id === 'cover' || s.section_id === 'signature'
  );

  const title = lang === 'ar' ? report.title.ar : report.title.en;
  const disclaimer = lang === 'ar' ? report.evidence_summary.disclaimer.ar : report.evidence_summary.disclaimer.en;

  if (compact) {
    return (
      <Card variant="filled" padding="md" style={{ marginBottom: theme.spacing.md }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: theme.spacing.sm }}>
          <Ionicons name="document-text" size={20} color={theme.colors.primary} />
          <Text style={[type.bodySm, { flex: 1, color: theme.colors.text, textAlign: textAlign('start') }]}>
            {t('scientificReport.preview.compactLabel', { count: visibleSections.length })}
          </Text>
          <Badge label={report.evidence_summary.primary_tier} variant="info" />
        </View>
      </Card>
    );
  }

  return (
    <View>
      <SectionHeader title={t('scientificReport.preview.title')} subtitle={t('scientificReport.preview.subtitle')} />
      <Card variant="filled" padding="md" style={{ marginBottom: theme.spacing.lg, borderRadius: theme.borderRadius.xl }}>
        <Text style={[type.overline, { color: theme.colors.primary, textAlign: textAlign('start') }]}>
          {t('scientificReport.preview.engineLabel')}
        </Text>
        <Text style={[type.h5, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>{title}</Text>
        <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginTop: theme.spacing.sm, flexWrap: 'wrap' }}>
          <Badge label={report.report_type} variant="info" />
          <Badge label={report.viewer_role} variant="info" />
          <Badge label={report.evidence_summary.primary_tier} variant="info" />
        </View>
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
          {disclaimer}
        </Text>
      </Card>

      {visibleSections.map((section, index) => (
        <SectionCard key={section.section_id} section={section} index={index} lang={lang} />
      ))}
    </View>
  );
}
