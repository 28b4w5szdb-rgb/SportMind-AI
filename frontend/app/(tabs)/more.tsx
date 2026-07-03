/**
 * SportMind AI - More Screen
 * Hub for additional features and settings
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/src/components/common/Card';
import { useTheme } from '@/src/core/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  const menuItems = [
    { id: '1', title: 'Sports Science Calculator', icon: 'calculator' as const, route: '/calculator' },
    { id: '2', title: 'Research Assistant', icon: 'book' as const, route: '/research' },
    { id: '3', title: 'Reports Center', icon: 'document-text' as const, route: '/reports' },
    { id: '4', title: 'Team Management', icon: 'people-circle' as const, route: '/team-management' },
    { id: '5', title: 'Settings', icon: 'settings' as const, route: '/settings' },
  ];
  
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing.md, paddingTop: theme.spacing.lg }}>
          <Text style={[theme.typography.displaySmall, { color: theme.colors.text }]}>More</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
            Additional tools and settings
          </Text>
        </View>
        
        <View style={{ padding: theme.spacing.md }}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => router.push(item.route as any)} activeOpacity={0.7}>
              <Card style={[styles.menuItem, { marginBottom: theme.spacing.sm }]}>
                <View style={styles.menuItemContent}>
                  <View
                    style={[
                      styles.menuIcon,
                      {
                        backgroundColor: theme.colors.primary + '20',
                        borderRadius: theme.borderRadius.md,
                      },
                    ]}
                  >
                    <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
                  </View>
                  <Text style={[theme.typography.body, { color: theme.colors.text, flex: 1 }]}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  menuItem: {
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
