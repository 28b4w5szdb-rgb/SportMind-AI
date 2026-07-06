import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import type { AnalyticsModuleResult } from '@/src/analytics/types';
import type { BodyRegion } from '@/src/features/sports-medicine/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';
import { useDirection } from '@/src/providers/DirectionProvider';
import { AthleteBodyMapFigure } from '../AthleteBodyMapFigure';
import { BodyMapZonePanel } from '../BodyMapZonePanel';

interface CockpitBodyIntelligenceProps {
  modules: AnalyticsModuleResult[];
  regionRisks?: Partial<Record<BodyRegion, number>>;
  injuryRegions?: BodyRegion[];
  attentionRegions?: BodyRegion[];
}

export function CockpitBodyIntelligence({ modules, regionRisks, injuryRegions, attentionRegions }: CockpitBodyIntelligenceProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { isTablet, width } = useResponsiveLayout();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const figureSize = isTablet ? 260 : Math.min(240, width - 80);
  const stackVertical = width < 520;
  const hasRisk = (injuryRegions?.length ?? 0) > 0 || Object.keys(regionRisks ?? {}).length > 0;
  const hasRecovery = (attentionRegions?.length ?? 0) > 0;

  return (
    <View>
      <View style={{ flexDirection: flexRow(true), gap: 8, marginBottom: theme.spacing.md, flexWrap: 'wrap' }}>
        <Badge label={t('athleteWorkspace.cockpit.bodyInteractive')} variant="info" />
        {hasRisk ? <Badge label={t('athleteWorkspace.cockpit.bodyRiskOverlay')} variant="warning" /> : null}
        {hasRecovery ? <Badge label={t('athleteWorkspace.cockpit.bodyRecoveryOverlay')} variant="success" /> : null}
      </View>

      <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden', ...theme.shadows.md }}>
        <LinearGradient
          colors={[theme.colors.primary + '14', theme.colors.secondary + '10', theme.colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: theme.spacing.lg }}
        >
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
            {t('athleteWorkspace.bodyMapTapHint')}
          </Text>
          <View
            style={{
              flexDirection: stackVertical ? 'column' : flexRow(true),
              alignItems: stackVertical ? 'stretch' : 'flex-start',
              gap: theme.spacing.lg,
            }}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: theme.spacing.sm }}>
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
