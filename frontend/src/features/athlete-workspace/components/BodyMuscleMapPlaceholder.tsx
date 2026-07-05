import React, { useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { AnalyticsModuleResult } from '@/src/analytics/types';
import type { BodyRegion } from '@/src/features/sports-medicine/types';
import { useTheme } from '@/src/core/theme';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';
import { AthleteBodyMapFigure } from './AthleteBodyMapFigure';
import { BodyMapZonePanel } from './BodyMapZonePanel';

interface BodyMuscleMapPlaceholderProps {
  modules: AnalyticsModuleResult[];
  regionRisks?: Partial<Record<BodyRegion, number>>;
  injuryRegions?: BodyRegion[];
  attentionRegions?: BodyRegion[];
}

export function BodyMuscleMapPlaceholder({ modules, regionRisks, injuryRegions, attentionRegions }: BodyMuscleMapPlaceholderProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { flexRow } = useDirection();
  const { isTablet, width } = useResponsiveLayout();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const figureSize = isTablet ? 240 : Math.min(220, width - 80);
  const stackVertical = width < 520;

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader title={t('athleteWorkspace.bodyMapTitle')} subtitle={t('athleteWorkspace.bodyMapSubtitle')} />
      <Card variant="outlined" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden' }}>
        <LinearGradient
          colors={[theme.colors.primary50 ?? '#E6F0FF', theme.colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: theme.spacing.lg }}
        >
          <View
            style={{
              flexDirection: stackVertical ? 'column' : flexRow(true),
              alignItems: stackVertical ? 'stretch' : 'flex-start',
              gap: theme.spacing.lg,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: theme.spacing.sm,
                minWidth: stackVertical ? undefined : figureSize + 24,
              }}
            >
              <AthleteBodyMapFigure
                modules={modules}
                selectedZoneId={selectedZoneId}
                onSelectZone={setSelectedZoneId}
                size={figureSize}
                regionRisks={regionRisks}
                injuryRegions={injuryRegions}
                attentionRegions={attentionRegions}
              />
            </View>
            <BodyMapZonePanel modules={modules} selectedZoneId={selectedZoneId} onSelectZone={setSelectedZoneId} />
          </View>
        </LinearGradient>
      </Card>
    </View>
  );
}
