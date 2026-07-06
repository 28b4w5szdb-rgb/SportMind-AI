import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import type { SsidInterpretation } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface ReferenceConfidenceFooterProps {
  interpretation: SsidInterpretation;
}

export function ReferenceConfidenceFooter({ interpretation }: ReferenceConfidenceFooterProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <View
      style={{
        flexDirection: flexRow(true),
        alignItems: 'flex-start',
        paddingTop: theme.spacing.md,
        marginTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      }}
    >
      <Ionicons name="document-text-outline" size={16} color={theme.colors.textTertiary} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, marginStart: theme.spacing.sm }}>
        <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
          {t('ssid.ui.scientificReference')}: {t(interpretation.scientificReferenceKey)}
        </Text>
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
          {t('ssid.confidenceLabel')}: {interpretation.confidence}%
        </Text>
      </View>
    </View>
  );
}
