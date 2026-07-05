/**
 * SportMind AI - Reports Center
 * Generate and view reports
 */

import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/src/components/layout/Screen';
import { Header } from '@/src/components/layout/Header';
import { EmptyState } from '@/src/components/common/EmptyState';

export default function ReportsScreen() {
  return (
    <Screen padding={false}>
      <Header title="Reports Center" showBack />
      
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <EmptyState
          icon="document-text"
          title="No Reports Yet"
          description="Create comprehensive reports from your data"
          actionLabel="Create Report"
          onAction={() => console.log('Create report')}
        />
      </View>
    </Screen>
  );
}
