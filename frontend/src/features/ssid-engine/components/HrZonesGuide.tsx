import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { HrZoneRange } from '../utils/hrZoneHelpers';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface HrZonesGuideProps {
  maxHr: number;
  zones: HrZoneRange[];
  activeZoneId?: string;
}

export function HrZonesGuide({ maxHr, zones, activeZoneId }: HrZonesGuideProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card variant="outlined" padding="lg" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.md }}>
      <Text style={[type.h6, { color: theme.colors.text, marginBottom: theme.spacing.sm, textAlign: textAlign('start') }]}>
        {t('ssid.ui.hrZonesTableTitle')}
      </Text>
      <Text style={[type.caption, { color: theme.colors.textTertiary, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
        {t('ssid.ui.hrZonesTableSubtitle', { maxHr })}
      </Text>
      {zones.map((zone) => {
        const active = zone.id === activeZoneId;
        return (
          <View
            key={zone.id}
            style={{
              flexDirection: flexRow(true),
              justifyContent: 'space-between',
              paddingVertical: 10,
              paddingHorizontal: theme.spacing.sm,
              marginBottom: 6,
              borderRadius: theme.borderRadius.md,
              backgroundColor: active ? theme.colors.primary + '12' : 'transparent',
              borderWidth: active ? 1 : 0,
              borderColor: theme.colors.primary + '40',
            }}
          >
            <Text style={[type.bodySm, { color: theme.colors.text, flex: 1, textAlign: textAlign('start'), fontWeight: active ? '700' : '400' }]}>
              {t(zone.labelKey)}
            </Text>
            <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('end') }]}>
              {zone.minBpm}–{zone.maxBpm} {t('ssid.ui.bpm')} ({Math.round(zone.minPct)}–{Math.round(zone.maxPct)}%)
            </Text>
          </View>
        );
      })}
    </Card>
  );
}
