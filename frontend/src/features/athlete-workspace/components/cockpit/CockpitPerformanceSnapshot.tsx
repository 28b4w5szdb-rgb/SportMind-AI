import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export interface PerformanceSnapshotItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  labelKey: string;
  title: string;
  meta?: string;
  emptyKey: string;
}

interface CockpitPerformanceSnapshotProps {
  items: PerformanceSnapshotItem[];
}

export function CockpitPerformanceSnapshot({ items }: CockpitPerformanceSnapshotProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
      {items.map((item) => (
        <Card key={item.id} variant="filled" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: theme.borderRadius.md,
                backgroundColor: item.color + '18',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={item.icon} size={16} color={item.color} />
            </View>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginStart: 8, flex: 1, textAlign: textAlign('start') }]}>
              {t(item.labelKey)}
            </Text>
          </View>
          {item.title ? (
            <>
              <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]} numberOfLines={2}>
                {item.title}
              </Text>
              {item.meta ? (
                <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]} numberOfLines={1}>
                  {item.meta}
                </Text>
              ) : null}
            </>
          ) : (
            <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{t(item.emptyKey)}</Text>
          )}
        </Card>
      ))}
    </View>
  );
}
