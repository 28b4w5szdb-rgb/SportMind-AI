import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FormSection } from '@/src/components/common/FormSection';
import type { RecommendationItem } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface RecommendationPanelProps {
  items: RecommendationItem[];
}

export function RecommendationPanel({ items }: RecommendationPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  if (items.length === 0) return null;

  return (
    <FormSection title={t('analytics.recommendations')} subtitle={t('analytics.recommendationsHint')}>
      {items.map((item) => (
        <View key={item.id} style={{ marginBottom: theme.spacing.md, paddingBottom: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
            <Ionicons name="bulb-outline" size={18} color={item.priority === 'high' ? theme.colors.error : theme.colors.primary} />
            <Text style={[type.body, { color: theme.colors.text, flex: 1, marginStart: 8, textAlign: textAlign('start'), fontWeight: '600' }]}>
              {t(item.titleKey)}
            </Text>
          </View>
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 6, textAlign: textAlign('start'), lineHeight: 20 }]}>
            {t(item.bodyKey)}
          </Text>
          {item.actionKey ? (
            <Text style={[type.caption, { color: theme.colors.primary, marginTop: 6, textAlign: textAlign('start') }]}>{t(item.actionKey)}</Text>
          ) : null}
        </View>
      ))}
    </FormSection>
  );
}
