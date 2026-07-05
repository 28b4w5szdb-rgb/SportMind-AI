import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/src/components/common/Card';
import type { DecisionSupportResult } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface DecisionSupportCardProps {
  decision: DecisionSupportResult;
}

export function DecisionSupportCard({ decision }: DecisionSupportCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, borderLeftWidth: 4, borderLeftColor: decision.color }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
        <View style={{ width: 44, height: 44, borderRadius: theme.borderRadius.lg, backgroundColor: decision.color + '18', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="shield-checkmark" size={24} color={decision.color} />
        </View>
        <View style={{ flex: 1, marginStart: theme.spacing.md }}>
          <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t(decision.titleKey)}</Text>
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 6, textAlign: textAlign('start'), lineHeight: 20 }]}>
            {t(decision.bodyKey)}
          </Text>
          <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 8, textAlign: textAlign('start') }]}>
            {t('analytics.decision.confidence')}: {decision.confidence}%
          </Text>
        </View>
      </View>
    </Card>
  );
}
