/**
 * SportMind AI - Athletes Screen
 * Athlete profiles and management
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/src/components/layout/Screen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useTheme } from '@/src/core/theme';

export default function AthletesScreen() {
  const theme = useTheme();
  
  return (
    <Screen padding={false}>
      <View style={{ padding: theme.spacing.md, paddingTop: theme.spacing.lg }}>
        <Text style={[theme.typography.displaySmall, { color: theme.colors.text }]}>Athletes</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
          Manage athlete profiles and data
        </Text>
      </View>
      
      <View style={styles.content}>
        <EmptyState
          icon="people"
          title="No Athletes Yet"
          description="Add athletes to start tracking their performance"
          actionLabel="Add Athlete"
          onAction={() => console.log('Add athlete')}
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
