/**
 * SportMind AI - Performance Lab Screen
 * Performance analysis and metrics
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/src/components/layout/Screen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useTheme } from '@/src/core/theme';

export default function PerformanceLabScreen() {
  const theme = useTheme();
  
  return (
    <Screen padding={false}>
      <View style={{ padding: theme.spacing.md, paddingTop: theme.spacing.lg }}>
        <Text style={[theme.typography.displaySmall, { color: theme.colors.text }]}>Performance Lab</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
          Analyze performance metrics and trends
        </Text>
      </View>
      
      <View style={styles.content}>
        <EmptyState
          icon="stats-chart"
          title="No Data Available"
          description="Start collecting performance data to see analysis here"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
