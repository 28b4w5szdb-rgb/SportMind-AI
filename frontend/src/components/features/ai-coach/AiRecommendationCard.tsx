/**
 * AI Coach SSDI recommendation card (Phase 9.0) — reuses existing bubble styling.
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/src/components/common/Badge';
import type { ScientificRecommendation } from '@/src/cloud/scientific/sdss/models/SdssRecommendation';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface AiRecommendationCardProps {
  recommendation: ScientificRecommendation;
}

const CONFIDENCE_VARIANT: Record<
  ScientificRecommendation['confidence'],
  'success' | 'info' | 'warning' | 'error'
> = {
  very_high: 'success',
  high: 'success',
  moderate: 'info',
  low: 'warning',
  insufficient_evidence: 'error',
};

export const AiRecommendationCard = memo(function AiRecommendationCard({
  recommendation: rec,
}: AiRecommendationCardProps) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign, isRTL } = useDirection();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.backgroundSecondary,
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.sm + 4,
          marginBottom: theme.spacing.sm,
        },
      ]}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
        <Badge label={rec.category.replace(/_/g, ' ')} variant="info" />
        <Badge label={t(`aiCoach.sdss.confidence.${rec.confidence}`)} variant={CONFIDENCE_VARIANT[rec.confidence]} />
        <Badge label={rec.evidence_level} variant="info" />
      </View>
      <Text style={[type.label, { color: theme.colors.text, textAlign: textAlign('start') }]}>{rec.title}</Text>
      <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
        {rec.summary}
      </Text>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
        <Ionicons name="school-outline" size={14} color={theme.colors.primary} />
        <Text style={[type.caption, { color: theme.colors.text, flex: 1, textAlign: textAlign('start') }]}>
          {rec.scientific_reasoning}
        </Text>
      </View>
      <Text style={[type.bodySm, { color: theme.colors.primary, marginTop: 8, fontWeight: '600', textAlign: textAlign('start') }]}>
        {rec.recommended_action}
      </Text>
      <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 6, textAlign: textAlign('start') }]}>
        {t('aiCoach.whyLabel')}: {rec.explainability.why}
      </Text>
      {rec.limitations.length > 0 ? (
        <Text style={[type.caption, { color: theme.colors.warning, marginTop: 4, textAlign: textAlign('start') }]}>
          {rec.limitations.join(' · ')}
        </Text>
      ) : null}
      {rec.disclaimer ? (
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, fontStyle: 'italic', textAlign: textAlign('start') }]}>
          {rec.disclaimer}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
