import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { AthleteTimelineEvent, AthleteTimelineEventType } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

interface AthleteTimelineSectionProps {
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
  ai_recommendation: { icon: 'sparkles', color: '#8B5CF6', labelKey: 'athleteWorkspace.timeline.ai' },
  report: { icon: 'document-text', color: '#64748B', labelKey: 'athleteWorkspace.timeline.report' },
};

export function AthleteTimelineSection({ events }: AthleteTimelineSectionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  const visible = events.slice(0, 12);

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader title={t('athleteWorkspace.timelineTitle')} subtitle={t('athleteWorkspace.timelineSubtitle')} />
      <Card variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
        {visible.length === 0 ? (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: 'center', paddingVertical: 16 }]}>
            {t('athleteWorkspace.timelineEmpty')}
          </Text>
        ) : (
          visible.map((event, index) => {
            const meta = EVENT_META[event.type];
            const title = isRTL ? event.titleAr : event.titleEn;
            const subtitle = isRTL ? event.subtitleAr : event.subtitleEn;
            const isLast = index === visible.length - 1;

            return (
              <View key={event.id} style={{ flexDirection: flexRow(true) }}>
                <View style={{ alignItems: 'center', width: 36 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: `${meta.color}18`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={meta.icon} size={16} color={meta.color} />
                  </View>
                  {!isLast ? (
                    <View style={{ width: 2, flex: 1, backgroundColor: theme.colors.border, marginVertical: 4 }} />
                  ) : null}
                </View>
                <View style={{ flex: 1, paddingBottom: isLast ? 0 : theme.spacing.md, marginStart: theme.spacing.sm }}>
                  <View style={{ flexDirection: flexRow(true), justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', flex: 1, textAlign: textAlign('start') }]}>
                      {title.startsWith('analytics.') ? t(title) : title}
                    </Text>
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginStart: 8 }]}>{event.date}</Text>
                  </View>
                  <Text style={[type.caption, { color: meta.color, marginTop: 2, textAlign: textAlign('start') }]}>{t(meta.labelKey)}</Text>
                  {subtitle ? (
                    <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                      {subtitle.startsWith('analytics.') ? t(subtitle) : subtitle}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </Card>
    </View>
  );
}
