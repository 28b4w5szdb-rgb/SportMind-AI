import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { FormSection } from '@/src/components/common/FormSection';
import type { NutritionSnapshot } from '../types';
import { NUTRITION_GOALS } from '../registry/nutritionCatalog';
import { BodyCompositionHistoryPanel } from './BodyCompositionPanel';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface NutritionCenterPanelProps {
  snapshot: NutritionSnapshot;
}

function MacroBar({ label, value, target, unit, color }: { label: string; value: number; target: number; unit: string; color: string }) {
  const theme = useTheme();
  const type = useTypography();
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;

  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{label}</Text>
        <Text style={[type.caption, { color: theme.colors.text }]}>
          {value}/{target} {unit}
        </Text>
      </View>
      <View style={{ height: 8, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: 8, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function NutritionCenterPanel({ snapshot }: NutritionCenterPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { totals, targets, hydration, compliance, compliancePercent, goal, goalProgress, bodyCompositionAnalysis, bodyCompositionTrend, recommendations } =
    snapshot;

  return (
    <View>
      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg }}>
        <Text style={[type.overline, { color: theme.colors.textSecondary, letterSpacing: 1.2, textAlign: textAlign('start') }]}>
          {t('nutrition.dailyTitle')}
        </Text>
        <Text style={[type.h3, { color: theme.colors.text, marginTop: 8 }]}>{compliancePercent}%</Text>
        <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.complianceLabel')}</Text>
        <Text style={[type.bodySm, { color: theme.colors.primary, marginTop: 8, textAlign: textAlign('start') }]}>
          {t(NUTRITION_GOALS.find((g) => g.id === goal)?.labelKey ?? 'nutrition.goals.performance')} · {goalProgress}%
        </Text>
      </Card>

      <FormSection title={t('nutrition.macrosTitle')}>
        <MacroBar label={t('nutrition.calories')} value={totals.calories} target={targets.calories} unit="kcal" color="#F97316" />
        <MacroBar label={t('nutrition.protein')} value={totals.protein_g} target={targets.protein_g} unit="g" color="#0066FF" />
        <MacroBar label={t('nutrition.carbs')} value={totals.carbs_g} target={targets.carbs_g} unit="g" color="#10B981" />
        <MacroBar label={t('nutrition.fat')} value={totals.fat_g} target={targets.fat_g} unit="g" color="#8B5CF6" />
      </FormSection>

      <FormSection title={t('nutrition.hydrationTitle')}>
        <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
          <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.md }}>
            <View style={{ minWidth: 100 }}>
              <Text style={[type.h4, { color: theme.colors.text }]}>{hydration.hydrationPercent}%</Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.hydrationPercent')}</Text>
            </View>
            <View style={{ minWidth: 100 }}>
              <Text style={[type.h4, { color: theme.colors.text }]}>
                {hydration.intakeLiters}/{hydration.goalLiters}L
              </Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.waterIntake')}</Text>
            </View>
            <View style={{ minWidth: 100 }}>
              <Text style={[type.h4, { color: theme.colors.text }]}>{t(`nutrition.sweatRisk.${hydration.sweatRisk}`)}</Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.sweatRiskLabel')}</Text>
            </View>
          </View>
          {hydration.reminderKey ? (
            <Text style={[type.caption, { color: theme.colors.warning, marginTop: 8, textAlign: textAlign('start') }]}>
              {t(hydration.reminderKey)}
            </Text>
          ) : null}
        </Card>
      </FormSection>

      <FormSection title={t('nutrition.bodyCompTitle')}>
        {bodyCompositionAnalysis ? (
          <BodyCompositionHistoryPanel analysis={bodyCompositionAnalysis} trend={bodyCompositionTrend} showSectionTitle={false} />
        ) : (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{t('nutrition.bodyComp.noHistory')}</Text>
        )}
      </FormSection>

      <FormSection title={t('nutrition.recommendationsTitle')}>
        {recommendations.length === 0 ? (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{t('nutrition.allGood')}</Text>
        ) : (
          recommendations.map((rec) => (
            <Card key={rec.id} variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
              <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>{t(rec.titleKey)}</Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{t(rec.bodyKey)}</Text>
            </Card>
          ))
        )}
      </FormSection>
    </View>
  );
}
