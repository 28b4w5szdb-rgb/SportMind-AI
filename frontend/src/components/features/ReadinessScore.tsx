import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme, useTypography } from '@/src/core/theme';
import { readinessColor } from '@/src/utils/athleteMetrics';

interface ReadinessScoreProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ReadinessScore({ score, label, size = 'md' }: ReadinessScoreProps) {
  const theme = useTheme();
  const type = useTypography();
  const color = readinessColor(score);
  const dim = size === 'lg' ? 72 : size === 'md' ? 56 : 44;
  const fontSize = size === 'lg' ? 22 : size === 'md' ? 18 : 14;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.ring,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            borderColor: color,
            backgroundColor: color + '12',
          },
        ]}
      >
        <Text style={[type.numberSm, { color, fontSize, fontWeight: '700' }]}>{score}</Text>
      </View>
      {label ? (
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: 'center' }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  ring: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
