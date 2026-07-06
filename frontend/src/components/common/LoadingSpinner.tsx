/**
 * SportMind AI - Loading Spinner Component
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme, useTypography } from '@/src/core/theme';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message, fullScreen = false }: LoadingSpinnerProps) {
  const theme = useTheme();
  const type = useTypography();

  const content = (
    <>
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        accessibilityLabel={message ?? 'Loading'}
      />
      {message && (
        <Text
          style={[
            type.body,
            { color: theme.colors.textSecondary, marginTop: theme.spacing[4], textAlign: 'center' },
          ]}
        >
          {message}
        </Text>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <View
        style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}
        accessibilityRole="progressbar"
        accessibilityLiveRegion="polite"
      >
        {content}
      </View>
    );
  }

  return (
    <View style={[styles.container, { padding: theme.spacing[6] }]} accessibilityRole="progressbar">
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
