/**
 * SportMind AI - Settings
 * App configuration and preferences
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/layout/Screen';
import { Header } from '@/src/components/layout/Header';
import { Card } from '@/src/components/common/Card';
import { useTheme } from '@/src/core/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [darkMode, setDarkMode] = React.useState(theme.isDark);
  
  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        { id: '1', label: 'Dark Mode', type: 'toggle' as const, value: darkMode },
        { id: '2', label: 'Notifications', type: 'link' as const, icon: 'notifications' as const },
        { id: '3', label: 'Language', type: 'link' as const, icon: 'language' as const },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: '4', label: 'Profile', type: 'link' as const, icon: 'person' as const },
        { id: '5', label: 'Privacy', type: 'link' as const, icon: 'shield-checkmark' as const },
        { id: '6', label: 'Security', type: 'link' as const, icon: 'lock-closed' as const },
      ],
    },
    {
      title: 'About',
      items: [
        { id: '7', label: 'Help & Support', type: 'link' as const, icon: 'help-circle' as const },
        { id: '8', label: 'Terms of Service', type: 'link' as const, icon: 'document' as const },
        { id: '9', label: 'Privacy Policy', type: 'link' as const, icon: 'document-text' as const },
      ],
    },
  ];
  
  return (
    <Screen padding={false}>
      <Header title="Settings" showBack />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: theme.spacing.md }}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: theme.spacing.lg }}>
            <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
              {section.title}
            </Text>
            <Card>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                      {item.icon && <Ionicons name={item.icon} size={20} color={theme.colors.textSecondary} />}
                      <Text style={[theme.typography.body, { color: theme.colors.text }]}>{item.label}</Text>
                    </View>
                    {item.type === 'toggle' ? (
                      <Switch
                        value={item.value}
                        onValueChange={setDarkMode}
                        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                    )}
                  </View>
                  {index < section.items.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                  )}
                </View>
              ))}
            </Card>
          </View>
        ))}
        
        <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, textAlign: 'center', marginTop: theme.spacing.xl }]}>
          SportMind AI v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    height: 1,
    marginLeft: 32,
  },
});
