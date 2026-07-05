import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Polygon, Line, Circle as SvgCircle } from 'react-native-svg';

import { useTheme, useTypography } from '@/src/core/theme';

export interface RadarAxis {
  label: string;
  value: number;
  max: number;
}

interface RadarChartProps {
  axes: RadarAxis[];
  size?: number;
  color?: string;
}

export function RadarChart({ axes, size = 220, color }: RadarChartProps) {
  const theme = useTheme();
  const type = useTypography();
  const stroke = color ?? theme.colors.primary;
  const center = size / 2;
  const radius = size * 0.32;
  const levels = [0.25, 0.5, 0.75, 1];
  const count = axes.length;

  const pointAt = (index: number, scale: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * radius * scale,
      y: center + Math.sin(angle) * radius * scale,
    };
  };

  const dataPoints = axes.map((axis, i) => pointAt(i, axis.max > 0 ? axis.value / axis.max : 0));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {levels.map((level) => {
          const ring = axes.map((_, i) => pointAt(i, level));
          const pts = ring.map((p) => `${p.x},${p.y}`).join(' ');
          return <Polygon key={level} points={pts} fill="none" stroke={theme.colors.border} strokeWidth={1} />;
        })}
        {axes.map((_, i) => {
          const p = pointAt(i, 1);
          return <Line key={`axis-${i}`} x1={center} y1={center} x2={p.x} y2={p.y} stroke={theme.colors.border} strokeWidth={1} />;
        })}
        <Polygon points={polygon} fill={stroke + '33'} stroke={stroke} strokeWidth={2} />
        {dataPoints.map((p, i) => (
          <SvgCircle key={`dot-${i}`} cx={p.x} cy={p.y} r={4} fill={stroke} />
        ))}
      </Svg>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 8, maxWidth: size + 40 }}>
        {axes.map((axis) => (
          <Text key={axis.label} style={[type.caption, { color: theme.colors.textSecondary }]}>
            {axis.label}: {axis.value}
          </Text>
        ))}
      </View>
    </View>
  );
}
