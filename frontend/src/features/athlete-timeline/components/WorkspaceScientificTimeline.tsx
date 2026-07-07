import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { AthleteScientificTimeline, ScientificTimelineEvent, ScientificTimelineEventType } from '@/src/cloud/scientific/models/timeline';
import { filterTimelineByCategory } from '@/src/cloud/scientific/security/timelineAccess';

interface WorkspaceScientificTimelineProps {
  timeline: AthleteScientificTimeline;
}

type FilterKey = 'all' | ScientificTimelineEventType | 'performance' | 'medical';

const EVENT_META: Record<
  ScientificTimelineEventType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; labelKey: string }
> = {
  assessment: { icon: 'flask', color: '#0066FF', labelKey: 'scientificTimeline.types.assessment' },
  training: { icon: 'barbell', color: '#0D9488', labelKey: 'scientificTimeline.types.training' },
  match: { icon: 'football', color: '#2563EB', labelKey: 'scientificTimeline.types.match' },
  injury: { icon: 'medkit', color: '#EF4444', labelKey: 'scientificTimeline.types.injury' },
  recovery: { icon: 'bed', color: '#10B981', labelKey: 'scientificTimeline.types.recovery' },
  nutrition: { icon: 'nutrition', color: '#F97316', labelKey: 'scientificTimeline.types.nutrition' },
  wearable: { icon: 'watch', color: '#0EA5E9', labelKey: 'scientificTimeline.types.wearable' },
  gps: { icon: 'navigate', color: '#6366F1', labelKey: 'scientificTimeline.types.gps' },
  laboratory: { icon: 'beaker', color: '#7C3AED', labelKey: 'scientificTimeline.types.laboratory' },
  report: { icon: 'document-text', color: '#64748B', labelKey: 'scientificTimeline.types.report' },
  research: { icon: 'analytics', color: '#0891B2', labelKey: 'scientificTimeline.types.research' },
  ai_recommendation: { icon: 'sparkles', color: '#8B5CF6', labelKey: 'scientificTimeline.types.ai_recommendation' },
  passport_version: { icon: 'id-card', color: '#059669', labelKey: 'scientificTimeline.types.passport_version' },
};

const FILTER_OPTIONS: FilterKey[] = [
  'all',
  'assessment',
  'training',
  'injury',
  'recovery',
  'nutrition',
  'wearable',
  'report',
];

function severityVariant(severity: ScientificTimelineEvent['severity']): 'success' | 'warning' | 'error' | 'neutral' | 'info' {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'neutral';
  }
}

function TimelineEventCard({ event, expanded, onToggle }: { event: ScientificTimelineEvent; expanded: boolean; onToggle: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const meta = EVENT_META[event.event_type];
  const dateLabel = event.occurred_at.slice(0, 10);

  return (
    <Card variant="ghost" padding="md" style={{ marginBottom: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border }}>
      <Pressable onPress={onToggle} accessibilityRole="button">
        <View style={{ flexDirection: flexRow(true), justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8, flex: 1 }}>
            <Ionicons name={meta.icon} size={18} color={meta.color} />
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', flex: 1, textAlign: textAlign('start') }]}>
              {event.title.startsWith('analytics.') ? t(event.title) : event.title}
            </Text>
          </View>
          <Text style={[type.caption, { color: theme.colors.textTertiary }]}>{dateLabel}</Text>
        </View>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 6, marginTop: theme.spacing.sm }}>
          <Badge label={t(meta.labelKey)} variant="info" toneColor={meta.color} />
          <Badge label={t(`scientificTimeline.severity.${event.severity}`)} variant={severityVariant(event.severity)} />
          <Badge label={event.source_reference.collection} variant="neutral" />
        </View>
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
          {event.summary.startsWith('analytics.') ? t(event.summary) : event.summary}
        </Text>
        {expanded && event.key_metrics.length > 0 ? (
          <View style={{ marginTop: theme.spacing.sm, gap: 4 }}>
            {event.key_metrics.map((m) => (
              <Text key={m.key} style={[type.caption, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                {m.label}: {m.value ?? '—'}{m.unit ? ` ${m.unit}` : ''}
              </Text>
            ))}
            <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
              {t('scientificTimeline.sourceRef')}: {event.source_reference.collection}
              {event.source_reference.document_id ? ` / ${event.source_reference.document_id}` : ''}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </Card>
  );
}

export function WorkspaceScientificTimeline({ timeline }: WorkspaceScientificTimelineProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow } = useDirection();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return timeline.events;
    if (filter === 'performance') {
      return timeline.events.filter((e) => e.category === 'performance' || e.event_type === 'assessment');
    }
    if (filter === 'medical') {
      return timeline.events.filter((e) => e.category === 'medical');
    }
    return filterTimelineByCategory(timeline.events, filter);
  }, [timeline.events, filter]);

  const visible = filteredEvents.slice(0, 20);

  return (
    <View>
      <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
        {t('scientificTimeline.subtitle', { count: timeline.events.length })}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: theme.spacing.sm }}>
        {FILTER_OPTIONS.map((key) => {
          const active = filter === key;
          return (
            <Pressable
              key={key}
              onPress={() => setFilter(key)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: theme.borderRadius.full,
                backgroundColor: active ? theme.colors.primary : theme.colors.backgroundTertiary,
              }}
            >
              <Text style={[type.captionBold, { color: active ? '#fff' : theme.colors.textSecondary }]}>
                {t(`scientificTimeline.filters.${key}`)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {visible.length === 0 ? (
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: 'center', paddingVertical: 16 }]}>
          {t('scientificTimeline.empty')}
        </Text>
      ) : (
        visible.map((evt) => (
          <TimelineEventCard
            key={evt.event_id}
            event={evt}
            expanded={expandedId === evt.event_id}
            onToggle={() => setExpandedId((cur) => (cur === evt.event_id ? null : evt.event_id))}
          />
        ))
      )}
    </View>
  );
}
