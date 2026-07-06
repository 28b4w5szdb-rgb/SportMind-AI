import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AlertBanner } from '@/src/components/common/AlertBanner';
import type { InjuryAlert } from '../types';
import { useTheme } from '@/src/core/theme';

interface InjuryAlertsBannerProps {
  alerts: InjuryAlert[];
}

export function InjuryAlertsBanner({ alerts }: InjuryAlertsBannerProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (alerts.length === 0) return null;

  return (
    <View style={{ gap: theme.spacing[2], marginBottom: theme.spacing[4] }}>
      {alerts.map((alert) => (
        <AlertBanner
          key={alert.id}
          variant={alert.priority === 'high' ? 'error' : 'warning'}
          message={`${t(alert.titleKey)} — ${t(alert.bodyKey)}`}
        />
      ))}
    </View>
  );
}
