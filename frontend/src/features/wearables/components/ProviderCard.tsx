import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import type { WearableProviderConnection, WearableProviderDefinition } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface ProviderCardProps {
  provider: WearableProviderDefinition;
  connection?: WearableProviderConnection;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function ProviderCard({ provider, connection, onConnect, onDisconnect }: ProviderCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  const status = connection?.status ?? 'not_connected';
  const statusVariant =
    status === 'connected' ? 'success' : status === 'mock_sync' ? 'info' : 'neutral';

  return (
    <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: theme.colors.primary + '15',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={provider.icon as keyof typeof Ionicons.glyphMap} size={22} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
          <Text style={[type.body, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>
            {t(provider.labelKey)}
          </Text>
          <View style={{ flexDirection: flexRow(true), gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            <Badge label={t(`wearables.status.${status}`)} variant={statusVariant} />
            {connection?.last_sync_at ? (
              <Badge
                label={t('wearables.lastSyncShort', {
                  value: new Date(connection.last_sync_at).toLocaleString(isRTL ? 'ar' : 'en', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                })}
                variant="neutral"
              />
            ) : null}
          </View>
        </View>
      </View>

      <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
        {t('wearables.permissions')}: {connection?.permissions?.length ?? provider.defaultPermissions.length} {t('wearables.metrics')}
      </Text>
      <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]} numberOfLines={2}>
        {t('wearables.supportedMetrics')}: {provider.supportedMetrics.slice(0, 6).map((m) => t(`wearables.metric.${m}`)).join(' · ')}
      </Text>

      <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
        {status === 'not_connected' ? (
          <Button title={t('wearables.connect')} onPress={onConnect} size="small" variant="primary" icon="link" />
        ) : (
          <Button title={t('wearables.disconnect')} onPress={onDisconnect} size="small" variant="outline" icon="unlink" />
        )}
      </View>
    </Card>
  );
}
