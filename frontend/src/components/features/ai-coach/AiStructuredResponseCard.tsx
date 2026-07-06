import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { StructuredAiSection, StructuredSectionId } from '@/src/features/ai-coach/types';
import { useTranslation } from 'react-i18next';

const SECTION_ICONS: Record<StructuredSectionId, keyof typeof Ionicons.glyphMap> = {
  summary: 'document-text-outline',
  indicators: 'stats-chart-outline',
  interpretation: 'school-outline',
  decision: 'flag-outline',
  recommendations: 'bulb-outline',
  nextActions: 'arrow-forward-circle-outline',
  confidence: 'shield-checkmark-outline',
  references: 'library-outline',
};

interface AiStructuredResponseCardProps {
  section: StructuredAiSection;
}

export function AiStructuredResponseCard({ section }: AiStructuredResponseCardProps) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign, isRTL } = useDirection();
  const { t } = useTranslation();
  const lineHeight = isRTL ? 26 : 22;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.backgroundSecondary,
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.lg,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm + 4,
          marginBottom: theme.spacing.sm,
        },
      ]}
    >
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Ionicons name={SECTION_ICONS[section.id]} size={16} color={theme.colors.primary} />
        <Text
          style={[
            type.label,
            {
              color: theme.colors.text,
              marginStart: isRTL ? 0 : 8,
              marginEnd: isRTL ? 8 : 0,
              textAlign: textAlign('start'),
              writingDirection: isRTL ? 'rtl' : 'ltr',
            },
          ]}
        >
          {t(section.titleKey)}
        </Text>
      </View>
      {section.items.map((item, index) => (
        <Text
          key={`${section.id}-${index}`}
          style={[
            type.bodySm,
            {
              color: theme.colors.textSecondary,
              textAlign: textAlign('start'),
              lineHeight,
              writingDirection: isRTL ? 'rtl' : 'ltr',
              marginTop: index === 0 ? 6 : 4,
              flexShrink: 1,
              ...(Platform.OS === 'android' ? { textAlignVertical: 'top' as const } : {}),
            },
          ]}
        >
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'visible',
  },
  header: {
    alignItems: 'center',
  },
});
