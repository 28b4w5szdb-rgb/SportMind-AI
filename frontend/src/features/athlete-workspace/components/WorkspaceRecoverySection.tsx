import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import type { DailyCheckIn } from '@/src/data/mock/types';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { RecoveryCenterPanel } from '@/src/features/recovery/components/RecoveryCenterPanel';
import { useTheme, useTypography } from '@/src/core/theme';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

interface WorkspaceRecoverySectionProps {
  athleteId: string;
  checkIn?: DailyCheckIn;
}

export function WorkspaceRecoverySection({ athleteId, checkIn }: WorkspaceRecoverySectionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader
        title={t('recovery.title')}
        subtitle={t('recovery.subtitle')}
        action={
          <TouchableOpacity onPress={() => router.push(APP_ROUTES.recoveryCenter(athleteId))}>
            <Text style={[type.bodySm, { color: theme.colors.primary, fontWeight: '600' }]}>{t('recovery.openCenter')}</Text>
          </TouchableOpacity>
        }
      />
      <RecoveryCenterPanel checkIn={checkIn} compact />
    </View>
  );
}
