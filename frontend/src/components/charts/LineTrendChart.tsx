import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline, Line, Circle as SvgCircle } from 'react-native-svg';

import { useTheme } from '@/src/core/theme';

interface LineTrendChartProps {
  points: number[];
  height?: number;
  width?: number;
  color?: string;
}

export function LineTrendChart({ points, height = 80, width = 280, color }: LineTrendChartProps) {
  const theme = useTheme();
  const stroke = color ?? theme.colors.primary;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const pad = 8;

  const coords = points.map((v, i) => {
    const x = pad + (i / Math.max(points.length - 1, 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return { x, y };
  });

  const polyline = coords.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View>
      <Svg width={width} height={height}>
        <Line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke={theme.colors.border} strokeWidth={1} />
        <Polyline points={polyline} fill="none" stroke={stroke} strokeWidth={2.5} />
        {coords.map((p, i) => (
          <SvgCircle key={i} cx={p.x} cy={p.y} r={3} fill={stroke} />
        ))}
      </Svg>
    </View>
  );
}
