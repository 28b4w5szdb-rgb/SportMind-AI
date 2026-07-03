/**
 * SportMind AI - Container Component
 * Content container with max width
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/src/core/theme';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Container({ children, style }: ContainerProps) {
  const theme = useTheme();
  
  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: theme.layout.containerMaxWidth,
          paddingHorizontal: theme.layout.screenPadding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
});
