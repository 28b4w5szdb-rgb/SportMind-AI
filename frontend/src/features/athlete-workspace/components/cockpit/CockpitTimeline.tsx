import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { AthleteTimelineEvent, AthleteTimelineEventType } from '../../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface CockpitTimelineProps {
  events: AthleteTimelineEvent[];
}

const EVENT_META: Record<
  AthleteTimelineEventType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; labelKey: string }
> = {
  test: { icon: 'flask', color: '#0066FF', labelKey: 'athleteWorkspace.timeline.test' },
  training: { icon: 'barbell', color: '#0D9488', labelKey: 'athleteWorkspace.timeline.training' },
  recovery: { icon: 'bed', color: '#10B981', labelKey: 'athleteWorkspace.timeline.recovery' },
  injury: { icon: 'medkit', color: '#EF4444', labelKey: 'athleteWorkspace.timeline.injury' },
  nutrition: { icon: 'nutrition', color: '#F97316', labelKey: 'athleteWorkspace.timeline.nutrition' },
  wearables: { icon: 'watch', color: '#0EA5E9', labelKey: 'athleteWorkspace.timeline.wearables' },
  ai_recommendation: { icon: 'sparkles', color: '#8B5CF6', labelKey: 'athleteWorkspace.timeline.ai' },
  report: { icon: 'document-text', color: '#64748B', labelKey: 'athleteWorkspace.timeline.report' },
};

export function CockpitTimeline({ events }: CockpitTimelineProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  const visible = events.slice(0, 16);

  if (visible.length === 0) {
    return (
      <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: 'center', paddingVertical: 16 }]}>
        {t('athleteWorkspace.timelineEmpty')}
      </Text>
    );
  }

  return (
    <View>
      {visible.map((event, index) => {
        const meta = EVENT_META[event.type];
        const title = isRTL ? event.titleAr : event.titleEn;
        const summary = isRTL ? event.subtitleAr : event.subtitleEn;
        const isLast = index === visible.length - 1;

        return (
          <View key={event.id} style={{ flexDirection: flexRow(true) }}>
            <View style={{ alignItems: 'center', width: 40 }}>
              <LinearGradient colors={[meta.color + '30', meta.color + '10']} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={meta.icon} size={16} color={meta.color} />
              </LinearGradient>
              {!isLast ? <View style={{ width: 2, flex: 1, backgroundColor: theme.colors.border, marginVertical: 4 }} /> : null}
            </View>
            <Card variant="ghost" padding="none" style={{ flex: 1, marginBottom: isLast ? 0 : theme.spacing.sm, marginStart: theme.spacing.sm }}>
              <View style={{ flexDirection: flexRow(true), justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', flex: 1, textAlign: textAlign('start') }]}>
                  {title.startsWith('analytics.') || title.startsWith('athleteWorkspace.') ? t(title) : title}
                </Text>
                <Text style={[type.caption, { color: theme.colors.textTertiary, marginStart: 8 }]}>{event.date}</Text>
              </View>
              <Text style={[type.captionBold, { color: meta.color, marginTop: 4, textAlign: textAlign('start') }]}>{t(meta.labelKey)}</Text>
              {summary ? (
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start'), lineHeight: isRTL ? 20 : 18 }]}>
                  {summary.startsWith('analytics.') || summary.startsWith('athleteWorkspace.') ? t(summary) : summary}
                </Text>
              ) : null}
            </Card>
          </View>
        );
      })}
    </View>
  );
}
