/**
 * SportMind AI - Team Management
 * Manage teams and rosters
 */

import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/src/components/layout/Screen';
import { Header } from '@/src/components/layout/Header';
import { EmptyState } from '@/src/components/common/EmptyState';

export default function TeamManagementScreen() {
  return (
    <Screen padding={false}>
      <Header title="Team Management" showBack />
      
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <EmptyState
          icon="people-circle"
          title="No Teams Yet"
          description="Create and manage your teams"
          actionLabel="Create Team"
          onAction={() => console.log('Create team')}
        />
      </View>
    </Screen>
  );
}
