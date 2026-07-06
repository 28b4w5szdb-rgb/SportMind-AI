import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import type { KpiCardData } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';
import { AnimatedMetric } from './AnimatedMetric';

interface CockpitKpiGridProps {
  kpis: KpiCardData[];
}

export function CockpitKpiGrid({ kpis }: CockpitKpiGridProps) {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { flexRow, textAlign } = useDirection();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const minWidth = isDesktop ? '31%' : isTablet ? '47%' : '47%';

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[3], marginBottom: theme.spacing.lg }}>
      {kpis.map((kpi) => {
        const trendIcon = kpi.trend === 'up' ? 'trending-up' : kpi.trend === 'down' ? 'trending-down' : 'remove';
        const numeric = parseFloat(String(kpi.displayValue).replace(/[^\d.-]/g, '')) || 0;

        return (
          <View key={kpi.id} style={{ width: minWidth, flexGrow: 1 }}>
            <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius.xl, overflow: 'hidden', ...theme.shadows.sm }}>
              <LinearGradient colors={[kpi.color + '20', kpi.color + '08']} style={{ padding: theme.spacing[4], minHeight: 118 }}>
                <View style={{ flexDirection: flexRow(true), alignItems: 'center', justifyContent: 'space-between' }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: theme.borderRadius.lg,
                      backgroundColor: kpi.color + '25',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={kpi.icon} size={20} color={kpi.color} />
                  </View>
                  <Badge
                    label={`${kpi.trendDelta > 0 ? '+' : ''}${kpi.trendDelta}`}
                    toneColor={kpi.trend === 'down' ? theme.colors.warning : kpi.color}
                  />
                </View>
                <View style={{ flexDirection: flexRow(true), alignItems: 'baseline', marginTop: theme.spacing[3] }}>
                  <AnimatedMetric value={numeric} style={[type.numberMedium, { color: theme.colors.text }]} />
                  <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginStart: 4 }]}>{kpi.unit ?? ''}</Text>
                </View>
                <Text style={[type.captionBold, { color: theme.colors.textSecondary, marginTop: theme.spacing[1], textAlign: textAlign('start') }]} numberOfLines={2}>
                  {t(kpi.labelKey)}
                </Text>
                <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginTop: 6 }}>
                  <Ionicons name={trendIcon} size={14} color={kpi.color} />
                  <Text style={[type.caption, { color: kpi.color, marginStart: 4 }]}>
                    {kpi.trendDelta > 0 ? '+' : ''}
                    {kpi.trendDelta}
                  </Text>
                </View>
              </LinearGradient>
            </Card>
          </View>
        );
      })}
    </View>
  );
}
