import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/src/components/common/Card';
import type { SsidInterpretation } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface CoachingDecisionCardProps {
  interpretation: SsidInterpretation;
}

export function CoachingDecisionCard({ interpretation }: CoachingDecisionCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card
      variant="elevated"
      padding="lg"
      style={{
        borderRadius: theme.borderRadius['2xl'],
        marginBottom: theme.spacing.md,
        borderStartWidth: 4,
        borderStartColor: theme.colors.secondary,
      }}
    >
      <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.secondary + '18',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="shield-checkmark" size={24} color={theme.colors.secondary} />
        </View>
        <View style={{ flex: 1, marginStart: theme.spacing.md }}>
          <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>{t('ssid.ui.coachingDecision')}</Text>
          <Text style={[type.h5, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>{t(interpretation.coachingDecisionKey)}</Text>
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 8, textAlign: textAlign('start'), lineHeight: 20 }]}>
            {t(interpretation.aiRecommendationKey)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
