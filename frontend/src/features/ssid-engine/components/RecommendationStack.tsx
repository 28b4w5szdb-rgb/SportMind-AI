import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/src/components/common/Card';
import type { SsidInterpretation } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface RecommendationStackProps {
  interpretation: SsidInterpretation;
}

function RecRow({ labelKey, bodyKey, icon }: { labelKey: string; bodyKey: string; icon: 'flash' | 'calendar' | 'trending-up' }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <View style={{ flexDirection: flexRow(true), marginBottom: 12 }}>
      <Ionicons name={icon} size={18} color={theme.colors.primary} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, marginStart: 10 }}>
        <Text style={[type.caption, { color: theme.colors.primary, fontWeight: '600', textAlign: textAlign('start') }]}>{t(labelKey)}</Text>
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start'), lineHeight: 20 }]}>
          {t(bodyKey)}
        </Text>
      </View>
    </View>
  );
}

export function RecommendationStack({ interpretation }: RecommendationStackProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  const recs = interpretation.recommendations;

  return (
    <Card variant="outlined" padding="lg" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.md }}>
      <Text style={[type.h6, { color: theme.colors.text, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
        {t('ssid.ui.recommendations')}
      </Text>
      <RecRow labelKey="ssid.ui.immediate" bodyKey={recs.immediateKey} icon="flash" />
      <RecRow labelKey="ssid.ui.weekly" bodyKey={recs.weeklyKey} icon="calendar" />
      <RecRow labelKey="ssid.ui.longTerm" bodyKey={recs.longTermKey} icon="trending-up" />
    </Card>
  );
}
