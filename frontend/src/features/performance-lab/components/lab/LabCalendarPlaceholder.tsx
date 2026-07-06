import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export function LabCalendarPlaceholder() {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card variant="outlined" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginVertical: theme.spacing.lg, borderStyle: 'dashed' }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: theme.spacing.md }}>
        <Ionicons name="calendar-outline" size={22} color={theme.colors.primary} />
        <Text style={[type.h5, { color: theme.colors.text, marginStart: theme.spacing.sm, textAlign: textAlign('start') }]}>
          {t('performanceLab.calendarTitle')}
        </Text>
        <Badge label={t('performanceLab.comingSoon')} variant="info" style={{ marginStart: 'auto' }} />
      </View>
      <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start'), lineHeight: 22 }]}>
        {t('performanceLab.calendarHint')}
      </Text>
      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8, marginTop: theme.spacing.md }}>
        {[1, 2, 3, 4, 5].map((d) => (
          <View key={d} style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: theme.colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
            <Text style={[type.caption, { color: theme.colors.textTertiary }]}>{d}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
