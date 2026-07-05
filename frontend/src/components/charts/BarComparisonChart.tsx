import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { useTheme } from '@/src/core/theme';

interface BarComparisonChartProps {
  values: number[];
  labels?: string[];
  height?: number;
  width?: number;
  color?: string;
}

export function BarComparisonChart({ values, height = 100, width = 280, color }: BarComparisonChartProps) {
  const theme = useTheme();
  const stroke = color ?? theme.colors.primary;
  const max = Math.max(...values, 1);
  const barWidth = (width - 24) / values.length - 8;

  return (
    <Svg width={width} height={height}>
      {values.map((v, i) => {
        const barHeight = (v / max) * (height - 16);
        const x = 12 + i * (barWidth + 8);
        const y = height - barHeight - 8;
        return <Rect key={i} x={x} y={y} width={barWidth} height={barHeight} rx={4} fill={stroke} opacity={0.85} />;
      })}
    </Svg>
  );
}
