/**
 * Cloud & Firebase readiness panel.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { getCloudReadinessSnapshot, getFirebaseEnvChecks } from '@/src/cloud/sync/cloudReadiness';

export function CloudReadinessPanel() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { flexRow, textAlign } = useDirection();
  const snapshot = getCloudReadinessSnapshot();
  const envChecks = getFirebaseEnvChecks();

  const dataModeVariant = snapshot.dataMode === 'cloud' ? 'success' : 'info';

  return (
    <View>
      <Card style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.md }}>
        <View style={[styles.row, { flexDirection: flexRow(true) }]}>
          <Ionicons
            name={snapshot.firebaseConfigured ? 'cloud-done' : 'cloud-offline'}
            size={24}
            color={snapshot.firebaseConfigured ? theme.colors.success : theme.colors.warning}
          />
          <View style={{ flex: 1, marginStart: theme.spacing.md }}>
            <Text style={[theme.typography.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>
              {t('cloud.firebaseStatus')}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
              {snapshot.firebaseConfigured ? t('cloud.firebaseConfigured') : t('cloud.firebaseNotConfigured')}
            </Text>
          </View>
          <Badge
            label={snapshot.firebaseConfigured ? t('cloud.statusReady') : t('cloud.statusPending')}
            variant={snapshot.firebaseConfigured ? 'success' : 'warning'}
          />
        </View>
      </Card>

      <Card style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.md }}>
        <Text style={[theme.typography.label, { color: theme.colors.textTertiary, marginBottom: theme.spacing.sm, textAlign: textAlign('start') }]}>
          {t('cloud.dataMode')}
        </Text>
        <View style={[styles.row, { flexDirection: flexRow(true) }]}>
          <Ionicons name="server-outline" size={22} color={theme.colors.primary} />
          <Text style={[theme.typography.h5, { color: theme.colors.text, flex: 1, marginStart: theme.spacing.sm, textAlign: textAlign('start') }]}>
            {snapshot.dataMode === 'cloud' ? t('cloud.modeCloud') : t('cloud.modeMock')}
          </Text>
          <Badge label={snapshot.dataMode === 'cloud' ? 'Cloud' : 'Mock'} variant={dataModeVariant} />
        </View>
        <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
          {t('cloud.dataModeHint')}
        </Text>
        {snapshot.useCloudDataFlag && !snapshot.firebaseConfigured ? (
          <Text style={[theme.typography.caption, { color: theme.colors.warning, marginTop: theme.spacing.xs, textAlign: textAlign('start') }]}>
            {t('cloud.cloudFlagWithoutFirebase')}
          </Text>
        ) : null}
      </Card>

      <Card style={{ borderRadius: theme.borderRadius['2xl'] }}>
        <Text style={[theme.typography.label, { color: theme.colors.textTertiary, marginBottom: theme.spacing.sm, textAlign: textAlign('start') }]}>
          {t('cloud.envKeys')}
        </Text>
        {envChecks.map((check) => (
          <View
            key={check.envVar}
            style={[
              styles.envRow,
              {
                flexDirection: flexRow(true),
                borderBottomColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons
              name={check.configured ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={check.configured ? theme.colors.success : theme.colors.textTertiary}
            />
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, flex: 1, marginStart: theme.spacing.sm, textAlign: textAlign('start') }]}>
              {check.envVar}
            </Text>
          </View>
        ))}
        <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing.md, textAlign: textAlign('start') }]}>
          {t('cloud.envHint')}
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
  },
  envRow: {
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
