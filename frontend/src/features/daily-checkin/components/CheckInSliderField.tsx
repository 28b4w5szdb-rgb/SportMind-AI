import React from 'react';
import { View, Text, Platform } from 'react-native';
import Slider from '@react-native-community/slider';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface CheckInSliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  unit?: string;
  error?: string;
  hint?: string;
}

export function CheckInSliderField({
  label,
  value,
  onChange,
  minimumValue,
  maximumValue,
  step = 1,
  unit,
  error,
  hint,
}: CheckInSliderFieldProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <View style={{ flexDirection: flexRow(true), justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>{label}</Text>
        <Text style={[type.bodySm, { color: theme.colors.primary, fontWeight: '700' }]}>
          {Number.isInteger(step) ? Math.round(value) : value.toFixed(1)}
          {unit ? ` ${unit}` : ''}
        </Text>
      </View>
      <Slider
        value={value}
        onValueChange={onChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={Platform.OS === 'ios' ? theme.colors.primary : undefined}
      />
      {hint ? (
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>{hint}</Text>
      ) : null}
      {error ? <Text style={[type.caption, { color: theme.colors.error, marginTop: 4 }]}>{error}</Text> : null}
    </View>
  );
}
