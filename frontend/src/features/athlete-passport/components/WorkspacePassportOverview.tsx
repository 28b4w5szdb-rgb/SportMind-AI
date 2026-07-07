import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { AthletePassport, PassportSectionSummary } from '@/src/cloud/scientific/models/passport';

interface WorkspacePassportOverviewProps {
  passport: AthletePassport;
}

function badgeVariant(score: number | null): 'success' | 'warning' | 'error' | 'neutral' {
  if (score == null) return 'neutral';
  if (score >= 70) return 'success';
  if (score >= 45) return 'warning';
  return 'error';
}

function fieldValue(section: PassportSectionSummary | undefined, key: string): string | null {
  const f = section?.summary_fields.find((x) => x.key === key);
  return f?.display_value ?? (f?.value != null ? String(f.value) : null);
}

function numericField(section: PassportSectionSummary | undefined, key: string): number | null {
  const f = section?.summary_fields.find((x) => x.key === key);
  if (typeof f?.value === 'number') return f.value;
  if (f?.display_value) {
    const n = parseFloat(f.display_value.replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function WorkspacePassportOverview({ passport }: WorkspacePassportOverviewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const [expanded, setExpanded] = React.useState(false);

  const { sections } = passport;
  const identity = sections.identity;
  const readiness = sections.readiness;
  const performance = sections.performance;
  const injury = sections.injury;
  const ssid = sections.ssid_insights;

  const readinessScore = numericField(readiness, 'readiness_score');
  const injuryRisk = numericField(injury, 'injury_risk_score');
  const overallScore = numericField(performance, 'overall_score');

  const missingSections = useMemo(
    () =>
      Object.values(sections).filter(
        (s) => s.is_missing && !['privacy', 'version', 'laboratory', 'equipment', 'research'].includes(s.section_id)
      ),
    [sections]
  );

  const fullName = fieldValue(identity, 'full_name') ?? t('athletePassport.unknownAthlete');
  const position = fieldValue(identity, 'position');
  const latestTest = fieldValue(performance, 'latest_test');
  const ssidDecision = fieldValue(ssid, 'coaching_decision');
  const ssidClass = fieldValue(ssid, 'classification');

  return (
    <Card variant="elevated" padding="lg" style={{ marginBottom: theme.spacing.lg }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={[type.caption, { color: theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.6 }]}>
            {t('athletePassport.title')}
          </Text>
          <Text style={[type.h4, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>
            {fullName}
          </Text>
          {position ? (
            <Text style={[type.bodySmall, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
              {position}
            </Text>
          ) : null}
        </View>
        <Ionicons name="id-card-outline" size={28} color={theme.colors.primary} />
      </View>

      <View
        style={{
          flexDirection: flexRow(true),
          flexWrap: 'wrap',
          gap: theme.spacing.sm,
          marginTop: theme.spacing.md,
        }}
      >
        <Badge label={`${t('athletePassport.badges.readiness')}: ${readinessScore != null ? `${readinessScore}%` : '—'}`} variant={badgeVariant(readinessScore)} />
        <Badge label={`${t('athletePassport.badges.performance')}: ${overallScore != null ? overallScore : '—'}`} variant={badgeVariant(overallScore)} />
        <Badge
          label={`${t('athletePassport.badges.injuryRisk')}: ${injuryRisk != null ? `${injuryRisk}%` : fieldValue(injury, 'injury_status') ?? '—'}`}
          variant={badgeVariant(injuryRisk != null ? 100 - injuryRisk : null)}
        />
      </View>

      {(ssidClass || latestTest) && (
        <View style={{ marginTop: theme.spacing.md, padding: theme.spacing.md, backgroundColor: theme.colors.backgroundTertiary, borderRadius: theme.borderRadius.lg }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary, textTransform: 'uppercase' }]}>
            {t('athletePassport.latestInsights')}
          </Text>
          {latestTest ? (
            <Text style={[type.body, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>
              {fieldValue(performance, 'latest_test') ?? latestTest}
            </Text>
          ) : null}
          {ssidClass ? (
            <Text style={[type.bodySmall, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
              SSID: {ssidClass}{ssidDecision ? ` · ${ssidDecision}` : ''}
            </Text>
          ) : null}
        </View>
      )}

      {missingSections.length > 0 && (
        <View style={{ marginTop: theme.spacing.md }}>
          <Text style={[type.caption, { color: theme.colors.warning, textAlign: textAlign('start') }]}>
            {t('athletePassport.missingData', { count: missingSections.length })}
          </Text>
        </View>
      )}

      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={{ flexDirection: flexRow(true), alignItems: 'center', marginTop: theme.spacing.md, gap: 6 }}
        accessibilityRole="button"
      >
        <Text style={[type.bodySmall, { color: theme.colors.primary }]}>
          {expanded ? t('athletePassport.hideDetails') : t('athletePassport.showDetails')}
        </Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.primary} />
      </Pressable>

      {expanded && (
        <View style={{ marginTop: theme.spacing.sm, gap: theme.spacing.sm }}>
          {(['recovery', 'training_load', 'nutrition', 'wearable', 'medical'] as const).map((sectionId) => {
            const section = sections[sectionId];
            if (!section || section.is_missing) return null;
            return (
              <View
                key={sectionId}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Text style={[type.caption, { color: theme.colors.textSecondary, textTransform: 'uppercase' }]}>
                  {t(`athletePassport.sections.${sectionId}`, { defaultValue: section.title })}
                </Text>
                {section.summary_fields.slice(0, 3).map((f) => (
                  <Text key={f.key} style={[type.bodySmall, { color: theme.colors.text, marginTop: 2, textAlign: textAlign('start') }]}>
                    {f.label}: {f.display_value ?? '—'}
                  </Text>
                ))}
              </View>
            );
          })}
          <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
            {t('athletePassport.sourceNote')}
          </Text>
        </View>
      )}
    </Card>
  );
}
