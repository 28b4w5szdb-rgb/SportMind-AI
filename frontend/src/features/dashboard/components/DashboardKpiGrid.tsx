import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export interface DashboardKpiItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  value: string;
  unit: string;
  color: string;
  trend: string;
}

interface DashboardKpiGridProps {
  kpis: DashboardKpiItem[];
  columns: number;
}

export function DashboardKpiGrid({ kpis, columns }: DashboardKpiGridProps) {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { flexRow, textAlign } = useDirection();

  return (
    <View>
      <SectionHeader title={t('dashboard.kpiGrid')} />
      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing[3] }}>
        {kpis.map((kpi) => (
          <View
            key={kpi.id}
            style={{
              width: columns >= 4 ? '24%' : '48%',
              minWidth: columns >= 4 ? 150 : 140,
              flexGrow: columns >= 4 ? 0 : 1,
            }}
          >
            <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius[theme.tokens.radius.card], overflow: 'hidden' }}>
              <LinearGradient colors={[kpi.color + '18', kpi.color + '06']} style={{ padding: theme.spacing[4], minHeight: 118 }}>
                <View style={{ flexDirection: flexRow(true), alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ width: 40, height: 40, borderRadius: theme.borderRadius.lg, backgroundColor: kpi.color + '22', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={kpi.icon} size={20} color={kpi.color} />
                  </View>
                  <Badge label={kpi.trend} toneColor={kpi.color} />
                </View>
                <Text style={[type.numberMedium, { color: theme.colors.text, marginTop: theme.spacing[3], textAlign: textAlign('start') }]}>
                  {kpi.value}
                  <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{kpi.unit}</Text>
                </Text>
                <Text style={[type.captionBold, { color: theme.colors.textSecondary, marginTop: theme.spacing[1], textAlign: textAlign('start') }]} numberOfLines={2}>
                  {t(kpi.labelKey)}
                </Text>
              </LinearGradient>
            </Card>
          </View>
        ))}
      </View>
    </View>
  );
}
