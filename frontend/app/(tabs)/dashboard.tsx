/**
 * SportMind AI - Dashboard Screen
 * Main overview screen with quick stats and actions
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/layout/Screen';
import { Card } from '@/src/components/common/Card';
import { useTheme } from '@/src/core/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  const quickActions = [
    { id: '1', title: 'AI Coach', icon: 'sparkles' as const, route: '/(tabs)/ai-coach' },
    { id: '2', title: 'Calculator', icon: 'calculator' as const, route: '/calculator' },
    { id: '3', title: 'Reports', icon: 'document-text' as const, route: '/reports' },
    { id: '4', title: 'Research', icon: 'book' as const, route: '/research' },
  ];
  
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* Header */}
        <View style={{ padding: theme.spacing.md, paddingTop: theme.spacing.lg }}>
          <Text style={[theme.typography.displaySmall, { color: theme.colors.text }]}>Dashboard</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
            Welcome to SportMind AI
          </Text>
        </View>
        
        {/* Quick Stats */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <Text style={[theme.typography.h3, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>Overview</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Ionicons name="people" size={32} color={theme.colors.primary} />
              <Text style={[theme.typography.h2, { color: theme.colors.text, marginTop: theme.spacing.sm }]}>0</Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Athletes</Text>
            </Card>
            <Card style={styles.statCard}>
              <Ionicons name="stats-chart" size={32} color={theme.colors.secondary} />
              <Text style={[theme.typography.h2, { color: theme.colors.text, marginTop: theme.spacing.sm }]}>0</Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Sessions</Text>
            </Card>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={{ padding: theme.spacing.md }}>
          <Text style={[theme.typography.h3, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <Card style={styles.actionCard}>
                  <View
                    style={[
                      styles.actionIcon,
                      {
                        backgroundColor: theme.colors.primary + '20',
                        borderRadius: theme.borderRadius.lg,
                      },
                    ]}
                  >
                    <Ionicons name={action.icon} size={24} color={theme.colors.primary} />
                  </View>
                  <Text style={[theme.typography.label, { color: theme.colors.text, marginTop: theme.spacing.sm }]}>
                    {action.title}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    width: 160,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
