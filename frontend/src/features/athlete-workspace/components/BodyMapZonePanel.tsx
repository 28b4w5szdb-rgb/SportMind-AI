import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { AnalyticsModuleResult } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import {
  BODY_MAP_ZONES,
  SCORE_BANDS,
  bodyBalanceIndex,
  moduleForZone,
  scoreBandFor,
  scoreColor,
  zoneScore,
} from '../utils/bodyMapZones';

interface BodyMapZonePanelProps {
  modules: AnalyticsModuleResult[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string | null) => void;
}

export function BodyMapZonePanel({ modules, selectedZoneId, onSelectZone }: BodyMapZonePanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  const balance = bodyBalanceIndex(modules);
  const selected = BODY_MAP_ZONES.find((z) => z.id === selectedZoneId);
  const selectedModule = selected ? moduleForZone(modules, selected.moduleId) : undefined;
  const selectedScore = selected ? zoneScore(modules, selected.moduleId) : balance;

  return (
    <View style={{ flex: 1, minWidth: 180, gap: theme.spacing.sm }}>
      <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
        <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
          {t('athleteWorkspace.bodyMapBalance')}
        </Text>
        <View style={{ flexDirection: flexRow(true), alignItems: 'baseline', marginTop: 4, gap: 8 }}>
          <Text style={[type.h4, { color: scoreColor(balance) }]}>{balance}</Text>
          <Text style={[type.caption, { color: theme.colors.textTertiary }]}>/ 100</Text>
        </View>
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 6, textAlign: textAlign('start') }]}>
          {t('athleteWorkspace.bodyMapTapHint')}
        </Text>
      </Card>

      {selected && selectedModule ? (
        <Card
          variant="elevated"
          padding="md"
          style={{ borderRadius: theme.borderRadius.xl, borderLeftWidth: 3, borderLeftColor: scoreColor(selectedScore) }}
        >
          <View style={{ flexDirection: flexRow(true), justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={[type.overline, { color: theme.colors.textTertiary, letterSpacing: 1, textAlign: textAlign('start') }]}>
                {t('athleteWorkspace.bodyMapSelected')}
              </Text>
              <Text style={[type.body, { color: theme.colors.text, fontWeight: '700', marginTop: 4, textAlign: textAlign('start') }]}>
                {t(selected.labelKey)}
              </Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                {t(selectedModule.labelKey)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => onSelectZone(null)} hitSlop={8}>
              <Ionicons name="close-circle" size={22} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginTop: theme.spacing.md, gap: 8 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: scoreColor(selectedScore) }} />
            <Text style={[type.numberSm, { color: theme.colors.text }]}>{selectedScore}</Text>
            <Text style={[type.caption, { color: scoreColor(selectedScore) }]}>
              {t(`analytics.status.${scoreBandFor(selectedScore).id}`)}
            </Text>
          </View>
        </Card>
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {SCORE_BANDS.map((band) => (
          <View key={band.id} style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: band.color }} />
            <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t(band.labelKey)}</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 6 }}>
        {BODY_MAP_ZONES.map((zone) => {
          const score = zoneScore(modules, zone.moduleId);
          const mod = moduleForZone(modules, zone.moduleId);
          const active = selectedZoneId === zone.id;

          return (
            <TouchableOpacity key={zone.id} onPress={() => onSelectZone(zone.id)} activeOpacity={0.8}>
              <View
                style={{
                  flexDirection: flexRow(true),
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: active ? `${scoreColor(score)}18` : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: active ? scoreColor(score) : theme.colors.border,
                }}
              >
                <View style={{ width: 8, height: 28, borderRadius: 4, backgroundColor: scoreColor(score), marginEnd: 10 }} />
                <Text style={[type.bodySm, { color: theme.colors.text, flex: 1, textAlign: textAlign('start') }]} numberOfLines={1}>
                  {t(zone.labelKey)}
                </Text>
                <Text style={[type.caption, { color: theme.colors.textTertiary, marginEnd: 8 }]} numberOfLines={1}>
                  {mod ? t(mod.labelKey) : zone.moduleId}
                </Text>
                <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', width: 28, textAlign: 'right' }]}>
                  {score}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
        {t('athleteWorkspace.bodyMapHint')}
      </Text>
    </View>
  );
}
