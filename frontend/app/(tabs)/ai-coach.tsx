/**
 * SportMind AI - AI Coach Screen
 * AI-powered coaching assistant
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/src/components/layout/Screen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useTheme } from '@/src/core/theme';

export default function AICoachScreen() {
  const theme = useTheme();
  
  return (
    <Screen padding={false}>
      <View style={{ padding: theme.spacing.md, paddingTop: theme.spacing.lg }}>
        <Text style={[theme.typography.displaySmall, { color: theme.colors.text }]}>AI Coach</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
          Your intelligent sports science assistant
        </Text>
      </View>
      
      <View style={styles.content}>
        <EmptyState
          icon="sparkles"
          title="AI Coach Coming Soon"
          description="Get AI-powered insights and recommendations for your athletes"
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
