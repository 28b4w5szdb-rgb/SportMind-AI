import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { ReportPreviewBlock } from '../../types';

interface ReportSectionBlockProps {
  block: ReportPreviewBlock;
  accent: string;
  accentSoft: string;
  index: number;
}

export function ReportSectionBlock({ block, accent, accentSoft, index }: ReportSectionBlockProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card
      variant="elevated"
      padding="md"
      style={{
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius['2xl'],
        borderStartWidth: 4,
        borderStartColor: accent,
        ...theme.shadows.sm,
      }}
    >
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={block.icon} size={18} color={accent} />
        </View>
        <View style={{ flex: 1, marginStart: theme.spacing.sm }}>
          <Text style={[type.overline, { color: accent, textAlign: textAlign('start') }]}>
            {String(index + 1).padStart(2, '0')}
          </Text>
          <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t(block.titleKey)}</Text>
        </View>
      </View>
      <Text style={[type.bodySm, { color: theme.colors.textSecondary, lineHeight: 22, textAlign: textAlign('start') }]}>
        {block.body}
      </Text>
    </Card>
  );
}

interface ReportChartsBlockProps {
  body: string;
  accent: string;
  accentSoft: string;
}

export function ReportChartsBlock({ body, accent, accentSoft }: ReportChartsBlockProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  const lines = body.split('\n').filter(Boolean);

  return (
    <View style={{ marginTop: theme.spacing.sm, gap: theme.spacing.sm }}>
      {lines.map((line, i) => (
        <View
          key={`${line.slice(0, 12)}-${i}`}
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: accentSoft,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${Math.min(95, 40 + (i + 1) * 12)}%`,
              height: '100%',
              backgroundColor: accent,
              opacity: 0.35 + i * 0.1,
              borderRadius: 4,
            }}
          />
        </View>
      ))}
      {lines.length === 0 ? (
        <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
          {t('reportBuilder.preview.chartPlaceholder')}
        </Text>
      ) : null}
    </View>
  );
}
