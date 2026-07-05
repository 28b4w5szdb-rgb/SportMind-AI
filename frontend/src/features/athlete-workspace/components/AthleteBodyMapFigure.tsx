import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Rect, Ellipse, G, Line } from 'react-native-svg';

import {
  BODY_MAP_VIEWBOX,
  BODY_MAP_ZONES,
  type BodyMapZoneDef,
  resolveZoneVisual,
} from '../utils/bodyMapZones';
import type { AnalyticsModuleResult } from '@/src/analytics/types';
import type { BodyRegion } from '@/src/features/sports-medicine/types';
import { useTheme } from '@/src/core/theme';

interface AthleteBodyMapFigureProps {
  modules: AnalyticsModuleResult[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  size?: number;
  regionRisks?: Partial<Record<BodyRegion, number>>;
  injuryRegions?: BodyRegion[];
  attentionRegions?: BodyRegion[];
}

function ZoneShape({
  zone,
  modules,
  selected,
  onPress,
  ghostStroke,
  regionRisks,
  injuryRegions,
  attentionRegions,
}: {
  zone: BodyMapZoneDef;
  modules: AnalyticsModuleResult[];
  selected: boolean;
  onPress: () => void;
  ghostStroke: string;
  regionRisks?: Partial<Record<BodyRegion, number>>;
  injuryRegions?: BodyRegion[];
  attentionRegions?: BodyRegion[];
}) {
  const visual = resolveZoneVisual(zone.id, zone.moduleId, modules, regionRisks, injuryRegions, attentionRegions);
  const fillOpacity = selected ? Math.min(0.85, visual.opacity + 0.2) : visual.opacity;
  const stroke = selected ? visual.stroke ?? visual.fill : ghostStroke;
  const strokeWidth = selected ? 2.5 : visual.stroke ? 1.5 : 1;

  const common = {
    fill: visual.fill,
    fillOpacity,
    stroke,
    strokeWidth,
    onPress,
  };

  switch (zone.kind) {
    case 'circle':
      return <Circle cx={zone.props.cx} cy={zone.props.cy} r={zone.props.r} {...common} />;
    case 'ellipse':
      return (
        <Ellipse
          cx={zone.props.cx}
          cy={zone.props.cy}
          rx={zone.props.rx}
          ry={zone.props.ry}
          {...common}
        />
      );
    case 'rect':
      return (
        <Rect
          x={zone.props.x}
          y={zone.props.y}
          width={zone.props.width}
          height={zone.props.height}
          rx={zone.props.rx ?? 0}
          {...common}
        />
      );
    default:
      return null;
  }
}

export function AthleteBodyMapFigure({
  modules,
  selectedZoneId,
  onSelectZone,
  size = 220,
  regionRisks,
  injuryRegions,
  attentionRegions,
}: AthleteBodyMapFigureProps) {
  const theme = useTheme();
  const scale = size / BODY_MAP_VIEWBOX.width;
  const height = BODY_MAP_VIEWBOX.height * scale;
  const ghost = theme.colors.border;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={height} viewBox={`0 0 ${BODY_MAP_VIEWBOX.width} ${BODY_MAP_VIEWBOX.height}`}>
        <G opacity={0.35}>
          <Ellipse cx={100} cy={165} rx={42} ry={118} fill="none" stroke={ghost} strokeWidth={1.5} strokeDasharray="4 4" />
          <Line x1={100} y1={52} x2={100} y2={300} stroke={ghost} strokeWidth={1} />
        </G>

        {BODY_MAP_ZONES.map((zone) => (
          <ZoneShape
            key={zone.id}
            zone={zone}
            modules={modules}
            selected={selectedZoneId === zone.id}
            onPress={() => onSelectZone(zone.id)}
            ghostStroke={ghost}
            regionRisks={regionRisks}
            injuryRegions={injuryRegions}
            attentionRegions={attentionRegions}
          />
        ))}
      </Svg>
    </View>
  );
}
