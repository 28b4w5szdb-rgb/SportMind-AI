import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleProp, TextStyle } from 'react-native';

interface AnimatedMetricProps {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
}

export function AnimatedMetric({ value, suffix = '', decimals = 0, duration = 700, style }: AnimatedMetricProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const listener = anim.addListener(({ value: v }) => {
      setDisplay(v);
    });
    Animated.timing(anim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(listener);
  }, [anim, duration, value]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : String(Math.round(display));

  return (
    <Text style={style}>
      {formatted}
      {suffix}
    </Text>
  );
}
