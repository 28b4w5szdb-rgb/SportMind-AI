/**
 * Firebase & cloud data readiness screen.
 */

import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/src/components/layout/Screen';
import { Header } from '@/src/components/layout/Header';
import { CloudReadinessPanel } from '@/src/components/settings/CloudReadinessPanel';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function CloudSettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { textAlign } = useDirection();

  return (
    <Screen padding={false}>
      <Header title={t('cloud.title')} showBack />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing['2xl'] }}>
        <Text
          style={[
            theme.typography.body,
            {
              color: theme.colors.textSecondary,
              textAlign: textAlign('start'),
              marginBottom: theme.spacing.lg,
              lineHeight: 22,
            },
          ]}
        >
          {t('cloud.subtitle')}
        </Text>
        <CloudReadinessPanel />
      </ScrollView>
    </Screen>
  );
}
