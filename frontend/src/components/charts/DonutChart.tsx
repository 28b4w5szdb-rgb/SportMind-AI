import React from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useTheme, useTypography } from '@/src/core/theme';

interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = {
    x: cx + r * Math.cos(startAngle),
    y: cy + r * Math.sin(startAngle),
  };
  const end = {
    x: cx + r * Math.cos(endAngle),
    y: cy + r * Math.sin(endAngle),
  };
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

export function DonutChart({ segments, size = 140, strokeWidth = 18, centerLabel }: DonutChartProps) {
  const theme = useTheme();
  const type = useTypography();
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  let angle = -Math.PI / 2;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <G>
          {segments.map((seg, i) => {
            const slice = (seg.value / total) * Math.PI * 2;
            const path = describeArc(center, center, radius, angle, angle + slice);
            angle += slice;
            return (
              <Path
                key={i}
                d={path}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="butt"
              />
            );
          })}
        </G>
      </Svg>
      {centerLabel ? (
        <View style={{ position: 'absolute', top: size / 2 - 12, alignItems: 'center' }}>
          <Text style={[type.h5, { color: theme.colors.text }]}>{centerLabel}</Text>
        </View>
      ) : null}
      <View style={{ marginTop: 8, gap: 4 }}>
        {segments.map((seg) => (
          <Text key={seg.label} style={[type.caption, { color: theme.colors.textSecondary }]}>
            ● {seg.label}: {seg.value}
          </Text>
        ))}
      </View>
    </View>
  );
}
