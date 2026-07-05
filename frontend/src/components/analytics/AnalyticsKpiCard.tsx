import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/src/components/common/Card';
import type { KpiCardData } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface AnalyticsKpiCardProps {
  kpi: KpiCardData;
  label: string;
}

export function AnalyticsKpiCard({ kpi, label }: AnalyticsKpiCardProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const trendIcon = kpi.trend === 'up' ? 'trending-up' : kpi.trend === 'down' ? 'trending-down' : 'remove';

  return (
    <Card variant="filled" padding="md" style={{ flex: 1, minWidth: '46%', borderRadius: theme.borderRadius.xl }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: 6 }}>
        <Ionicons name={kpi.icon} size={18} color={kpi.color} />
        <Text style={[type.caption, { color: theme.colors.textSecondary, flex: 1, marginStart: 6, textAlign: textAlign('start') }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={[type.numberSm, { color: theme.colors.text }]}>{kpi.displayValue}</Text>
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginTop: 4 }}>
        <Ionicons name={trendIcon} size={14} color={kpi.color} />
        <Text style={[type.caption, { color: kpi.color, marginStart: 4 }]}>
          {kpi.trendDelta > 0 ? '+' : ''}{kpi.trendDelta}
        </Text>
      </View>
    </Card>
  );
}
