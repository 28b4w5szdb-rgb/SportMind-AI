import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { InjuryAlert } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface InjuryAlertsBannerProps {
  alerts: InjuryAlert[];
}

export function InjuryAlertsBanner({ alerts }: InjuryAlertsBannerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  if (alerts.length === 0) return null;

  return (
    <View style={{ gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          variant="filled"
          padding="md"
          style={{
            borderRadius: theme.borderRadius.xl,
            borderLeftWidth: 3,
            borderLeftColor: alert.priority === 'high' ? theme.colors.error : theme.colors.warning,
          }}
        >
          <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start', gap: theme.spacing.sm }}>
            <Ionicons name="warning" size={18} color={alert.priority === 'high' ? theme.colors.error : theme.colors.warning} />
            <View style={{ flex: 1 }}>
              <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>{t(alert.titleKey)}</Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{t(alert.bodyKey)}</Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
}
