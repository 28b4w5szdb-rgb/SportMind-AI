/**
 * SportMind AI - Settings
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/src/components/layout/Screen';
import { Header } from '@/src/components/layout/Header';
import { Card } from '@/src/components/common/Card';
import { LanguageToggle } from '@/src/components/common/LanguageToggle';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, chevronIcon, textAlign } = useDirection();
  const [darkModePreview, setDarkModePreview] = React.useState(theme.isDark);

  const settingsSections = [
    {
      title: t('settings.preferences'),
      items: [
        { id: 'dark', label: t('settings.theme'), type: 'toggle' as const, value: darkModePreview, note: true },
        { id: 'lang', label: t('settings.language'), type: 'language' as const },
        { id: 'notif', label: t('features.settings.notifications'), type: 'link' as const, icon: 'notifications' as const },
      ],
    },
    {
      title: t('features.settings.account'),
      items: [
        { id: 'profile', label: t('features.settings.profile'), type: 'link' as const, icon: 'person' as const },
        { id: 'privacy', label: t('features.settings.privacy'), type: 'link' as const, icon: 'shield-checkmark' as const },
        { id: 'security', label: t('features.settings.security'), type: 'link' as const, icon: 'lock-closed' as const },
      ],
    },
    {
      title: t('settings.about'),
      items: [
        { id: 'help', label: t('features.settings.help'), type: 'route' as const, icon: 'help-circle' as const, route: APP_ROUTES.help },
        { id: 'terms', label: t('features.settings.terms'), type: 'link' as const, icon: 'document' as const },
        { id: 'privacyPolicy', label: t('features.settings.privacyPolicy'), type: 'link' as const, icon: 'document-text' as const },
      ],
    },
  ];

  return (
    <Screen padding={false}>
      <Header title={t('settings.title')} showBack />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing['2xl'] }}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: theme.spacing.lg }}>
            <Text
              style={[
                theme.typography.label,
                { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm, textAlign: textAlign('start') },
              ]}
            >
              {section.title}
            </Text>
            <Card>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  <View style={[styles.settingRow, { flexDirection: flexRow(true) }]}>
                    <View style={[styles.settingLeft, { flexDirection: flexRow(true) }]}>
                      {'icon' in item && item.icon && (
                        <Ionicons name={item.icon} size={20} color={theme.colors.textSecondary} />
                      )}
                      <Text style={[theme.typography.body, { color: theme.colors.text }]}>{item.label}</Text>
                    </View>
                    {item.type === 'toggle' ? (
                      <Switch
                        value={item.value}
                        onValueChange={setDarkModePreview}
                        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                      />
                    ) : item.type === 'language' ? (
                      <LanguageToggle variant="compact" />
                    ) : item.type === 'route' ? (
                      <TouchableOpacity onPress={() => router.push(item.route)}>
                        <Ionicons name={chevronIcon()} size={20} color={theme.colors.textTertiary} />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons name={chevronIcon()} size={20} color={theme.colors.textTertiary} />
                    )}
                  </View>
                  {item.type === 'toggle' && 'note' in item && item.note && (
                    <Text
                      style={[
                        theme.typography.caption,
                        {
                          color: theme.colors.textTertiary,
                          marginBottom: theme.spacing.sm,
                          textAlign: textAlign('start'),
                          paddingHorizontal: 4,
                        },
                      ]}
                    >
                      {t('features.settings.darkModeNote')}
                    </Text>
                  )}
                  {index < section.items.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                  )}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <Text
          style={[
            theme.typography.caption,
            { color: theme.colors.textTertiary, textAlign: 'center', marginTop: theme.spacing.xl },
          ]}
        >
          SportMind AI v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    height: 1,
    marginStart: 32,
  },
});
