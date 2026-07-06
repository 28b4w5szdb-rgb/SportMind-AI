import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import type { WearableProviderConnection, WearableProviderDefinition } from '../types';
import { getMockDeviceMeta } from '../utils/mockDeviceMeta';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface PremiumProviderCardProps {
  provider: WearableProviderDefinition;
  athleteId: string;
  connection?: WearableProviderConnection;
  isSyncing?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
}

export function PremiumProviderCard({
  provider,
  athleteId,
  connection,
  isSyncing,
  onConnect,
  onDisconnect,
  onSync,
}: PremiumProviderCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const spin = useRef(new Animated.Value(0)).current;

  const status = connection?.status ?? 'not_connected';
  const connected = status !== 'not_connected';
  const meta = getMockDeviceMeta(provider.id, athleteId, connected);
  const statusVariant = status === 'connected' ? 'success' : status === 'mock_sync' ? 'info' : 'neutral';

  useEffect(() => {
    if (!isSyncing) {
      spin.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [isSyncing, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const lastSyncLabel = connection?.last_sync_at
    ? new Date(connection.last_sync_at).toLocaleString(isRTL ? 'ar' : 'en', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : t('wearables.neverSynced');

  return (
    <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.md, overflow: 'hidden' }}>
      <LinearGradient colors={[provider.brandColor + '14', provider.brandColor + '04']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={{ padding: theme.spacing.md }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
            <LinearGradient
              colors={[provider.brandColor, provider.brandColor + 'CC']}
              style={{ width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name={provider.icon as keyof typeof Ionicons.glyphMap} size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
              <Text style={[type.body, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>
                {t(provider.labelKey)}
              </Text>
              <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                <Badge label={t(`wearables.status.${status}`)} variant={statusVariant} />
                {connected ? (
                  <Badge label={t(`wearables.dataQuality.${meta.dataQuality}`)} variant="neutral" />
                ) : null}
              </View>
            </View>
            {connected ? (
              <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                <Ionicons name="battery-half" size={16} color={theme.colors.textSecondary} />
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>{meta.batteryPercent}%</Text>
              </View>
            ) : null}
          </View>

          <View style={{ flexDirection: flexRow(true), gap: theme.spacing.md, marginTop: theme.spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>{t('wearables.lastSync')}</Text>
              <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', marginTop: 2, textAlign: textAlign('start') }]}>{lastSyncLabel}</Text>
            </View>
            {connected ? (
              <View style={{ flex: 1 }}>
                <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>{t('wearables.signalStrength')}</Text>
                <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', marginTop: 2, textAlign: textAlign('start') }]}>{meta.signalStrength}%</Text>
              </View>
            ) : null}
          </View>

          <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
            {t('wearables.supportedMetrics')}: {provider.supportedMetrics.slice(0, 5).map((m) => t(`wearables.metric.${m}`)).join(' · ')}
            {provider.supportedMetrics.length > 5 ? '…' : ''}
          </Text>

          <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
            {!connected ? (
              <TouchableOpacity onPress={onConnect} activeOpacity={0.85} style={{ flex: 1 }}>
                <LinearGradient colors={['#0066FF', '#0D9488']} style={{ borderRadius: theme.borderRadius.lg, paddingVertical: 11, alignItems: 'center', flexDirection: flexRow(true), justifyContent: 'center', gap: 6 }}>
                  <Ionicons name="link" size={16} color="#FFF" />
                  <Text style={[type.button, { color: '#FFF', fontSize: 13 }]}>{t('wearables.connect')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity onPress={onSync} disabled={isSyncing} activeOpacity={0.85} style={{ flex: 1 }}>
                  <View style={{ borderRadius: theme.borderRadius.lg, paddingVertical: 11, alignItems: 'center', flexDirection: flexRow(true), justifyContent: 'center', gap: 6, backgroundColor: theme.colors.primary + '12', borderWidth: 1, borderColor: theme.colors.primary + '40' }}>
                    <Animated.View style={{ transform: [{ rotate }] }}>
                      <Ionicons name="sync" size={16} color={theme.colors.primary} />
                    </Animated.View>
                    <Text style={[type.button, { color: theme.colors.primary, fontSize: 13 }]}>{isSyncing ? t('wearables.syncing') : t('wearables.syncNow')}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDisconnect} activeOpacity={0.85} style={{ paddingHorizontal: 14, justifyContent: 'center', borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border }}>
                  <Ionicons name="unlink" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </LinearGradient>
    </Card>
  );
}
