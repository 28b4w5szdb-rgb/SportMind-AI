import React from 'react';
import { View } from 'react-native';

import { AnalyticsKpiCard } from '@/src/components/analytics/AnalyticsKpiCard';
import type { KpiCardData } from '@/src/analytics/types';
import { useTheme } from '@/src/core/theme';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';
import { useTranslation } from 'react-i18next';

interface WorkspaceKpiGridProps {
  kpis: KpiCardData[];
}

export function WorkspaceKpiGrid({ kpis }: WorkspaceKpiGridProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isTablet, isDesktop } = useResponsiveLayout();
  const minWidth = isDesktop ? '31%' : isTablet ? '47%' : '47%';

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
      {kpis.map((kpi) => (
        <View key={kpi.id} style={{ width: minWidth, flexGrow: 1 }}>
          <AnalyticsKpiCard kpi={kpi} label={t(kpi.labelKey)} />
        </View>
      ))}
    </View>
  );
}
