/**
 * SportMind AI - Research Assistant
 * Tools for sports science research
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '@/src/components/layout/Screen';
import { Header } from '@/src/components/layout/Header';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useTheme } from '@/src/core/theme';

export default function ResearchScreen() {
  const theme = useTheme();
  
  return (
    <Screen padding={false}>
      <Header title="Research Assistant" showBack />
      
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <EmptyState
          icon="book"
          title="Research Tools Coming Soon"
          description="Access sports science research papers and analysis tools"
        />
      </View>
    </Screen>
  );
}
