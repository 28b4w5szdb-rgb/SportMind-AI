import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { SyncHistoryEntry } from '../utils/syncHistoryBuilder';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface SyncHistoryTimelineProps {
  entries: SyncHistoryEntry[];
}

export function SyncHistoryTimeline({ entries }: SyncHistoryTimelineProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  if (entries.length === 0) {
    return (
      <Card variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{t('wearables.syncHistory.empty')}</Text>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius['2xl'] }}>
      {entries.map((entry, index) => (
        <View key={entry.id} style={{ flexDirection: flexRow(true), marginBottom: index < entries.length - 1 ? theme.spacing.md : 0 }}>
          <View style={{ alignItems: 'center', width: 28, marginEnd: theme.spacing.sm }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.primary, marginTop: 4 }} />
            {index < entries.length - 1 ? (
              <View style={{ flex: 1, width: 2, backgroundColor: theme.colors.border, marginTop: 4, minHeight: 24 }} />
            ) : null}
          </View>
          <View style={{ flex: 1, paddingBottom: index < entries.length - 1 ? theme.spacing.xs : 0 }}>
            <Text style={[type.caption, { color: theme.colors.primary, fontWeight: '700', textAlign: textAlign('start') }]}>{entry.time}</Text>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} />
              <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('start'), flex: 1 }]}>{t(entry.labelKey)}</Text>
            </View>
          </View>
        </View>
      ))}
    </Card>
  );
}
