import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormSection } from '@/src/components/common/FormSection';
import { Button } from '@/src/components/common/Button';
import { WEARABLE_PROVIDERS } from '../registry/providerRegistry';
import { ProviderCard } from './ProviderCard';
import type { MockSyncType, WearableProviderConnection, WearableProviderId } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const SYNC_TYPES: MockSyncType[] = ['sleep', 'hr_hrv', 'activity', 'calories', 'steps', 'training_load'];

interface ConnectDevicesPanelProps {
  athleteId: string;
  connections: WearableProviderConnection[];
  selectedProviderId?: WearableProviderId;
  onSelectProvider: (providerId: WearableProviderId) => void;
  onConnect: (providerId: WearableProviderId) => void;
  onDisconnect: (providerId: WearableProviderId) => void;
  onMockSync: (providerId: WearableProviderId, syncType: MockSyncType) => void;
}

export function ConnectDevicesPanel({
  athleteId,
  connections,
  selectedProviderId,
  onSelectProvider,
  onConnect,
  onDisconnect,
  onMockSync,
}: ConnectDevicesPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  const athleteConnections = connections.filter((c) => c.athlete_id === athleteId);
  const activeProviderId = selectedProviderId ?? athleteConnections[0]?.provider_id ?? WEARABLE_PROVIDERS[0].id;
  const activeConnection = athleteConnections.find((c) => c.provider_id === activeProviderId);

  return (
    <View>
      <FormSection title={t('wearables.connectTitle')} subtitle={t('wearables.connectSubtitle')}>
        {WEARABLE_PROVIDERS.map((provider) => {
          const connection = athleteConnections.find((c) => c.provider_id === provider.id);
          return (
            <ProviderCard
              key={provider.id}
              provider={provider}
              connection={connection}
              onConnect={() => {
                onSelectProvider(provider.id);
                onConnect(provider.id);
              }}
              onDisconnect={() => onDisconnect(provider.id)}
            />
          );
        })}
      </FormSection>

      <FormSection title={t('wearables.mockSyncTitle')} subtitle={t('wearables.mockSyncSubtitle')}>
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm, textAlign: textAlign('start') }]}>
          {t('wearables.mockSyncHint')}
        </Text>
        {!activeConnection || activeConnection.status === 'not_connected' ? (
          <Text style={[type.bodySm, { color: theme.colors.warning, textAlign: textAlign('start') }]}>
            {t('wearables.connectFirst')}
          </Text>
        ) : (
          <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
            {SYNC_TYPES.map((syncType) => (
              <Button
                key={syncType}
                title={t(`wearables.sync.${syncType}`)}
                onPress={() => onMockSync(activeProviderId, syncType)}
                size="small"
                variant="outline"
                icon="cloud-download-outline"
              />
            ))}
          </View>
        )}
      </FormSection>
    </View>
  );
}
