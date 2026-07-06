import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { FormSection } from '@/src/components/common/FormSection';
import { CheckInSliderField } from '@/src/features/daily-checkin';
import type { DailyNutritionLogInput, MealEntry } from '@/src/data/mock/types';
import { MEAL_SLOTS, SUPPLEMENT_CATALOG, NUTRITION_GOALS } from '../registry/nutritionCatalog';
import type { MealSlotId, NutritionGoalId } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface MealDraft {
  calories: string;
  protein_g: string;
  carbs_g: string;
  fat_g: string;
  description: string;
}

interface NutritionLogFormProps {
  athleteId: string;
  initialGoal?: NutritionGoalId;
  existingMeals?: MealEntry[];
  initialWater?: number;
  initialSupplements?: string[];
  initialNotes?: string;
  onSubmit: (values: DailyNutritionLogInput, goal: NutritionGoalId) => void;
  loading?: boolean;
}

function emptyMealDraft(): MealDraft {
  return { calories: '', protein_g: '', carbs_g: '', fat_g: '', description: '' };
}

function parseNum(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export function NutritionLogForm({
  athleteId,
  initialGoal = 'performance',
  existingMeals,
  initialWater = 0,
  initialSupplements = [],
  initialNotes = '',
  onSubmit,
  loading,
}: NutritionLogFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  const [goal, setGoal] = useState<NutritionGoalId>(initialGoal);
  const [water, setWater] = useState(initialWater || 2);
  const [supplements, setSupplements] = useState<string[]>(initialSupplements);
  const [notes, setNotes] = useState(initialNotes);
  const [meals, setMeals] = useState<Record<MealSlotId, MealDraft>>(() => {
    const draft: Record<string, MealDraft> = {};
    for (const slot of MEAL_SLOTS) {
      const existing = existingMeals?.find((m) => m.slot === slot.id);
      draft[slot.id] = existing
        ? {
            calories: String(existing.calories || ''),
            protein_g: String(existing.protein_g || ''),
            carbs_g: String(existing.carbs_g || ''),
            fat_g: String(existing.fat_g || ''),
            description: existing.description ?? '',
          }
        : emptyMealDraft();
    }
    return draft as Record<MealSlotId, MealDraft>;
  });

  const totals = useMemo(() => {
    return MEAL_SLOTS.reduce(
      (acc, slot) => {
        const m = meals[slot.id];
        return {
          calories: acc.calories + parseNum(m.calories),
          protein_g: acc.protein_g + parseNum(m.protein_g),
          carbs_g: acc.carbs_g + parseNum(m.carbs_g),
          fat_g: acc.fat_g + parseNum(m.fat_g),
        };
      },
      { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
    );
  }, [meals]);

  const updateMeal = (slot: MealSlotId, field: keyof MealDraft, value: string) => {
    setMeals((prev) => ({ ...prev, [slot]: { ...prev[slot], [field]: value } }));
  };

  const toggleSupplement = (key: string) => {
    setSupplements((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const handleSubmit = () => {
    const mealEntries: MealEntry[] = MEAL_SLOTS.map((slot) => ({
      slot: slot.id,
      calories: parseNum(meals[slot.id].calories),
      protein_g: parseNum(meals[slot.id].protein_g),
      carbs_g: parseNum(meals[slot.id].carbs_g),
      fat_g: parseNum(meals[slot.id].fat_g),
      description: meals[slot.id].description.trim() || undefined,
    })).filter((m) => m.calories > 0 || m.protein_g > 0 || m.carbs_g > 0 || m.fat_g > 0);

    onSubmit(
      {
        athlete_id: athleteId,
        meals: mealEntries,
        water_liters: water,
        supplement_keys: supplements,
        notes: notes.trim() || undefined,
      },
      goal
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <FormSection title={t('nutrition.goalTitle')}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {NUTRITION_GOALS.map((g) => {
            const active = goal === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => setGoal(g.id)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: 1,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                  backgroundColor: active ? `${theme.colors.primary}15` : theme.colors.surface,
                }}
              >
                <Text style={[type.caption, { color: active ? theme.colors.primary : theme.colors.text, fontWeight: '600' }]}>
                  {t(g.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </FormSection>

      <FormSection title={t('nutrition.logMealsTitle')}>
        {MEAL_SLOTS.map((slot) => (
          <View
            key={slot.id}
            style={{
              marginBottom: theme.spacing.md,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.xl,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', marginBottom: 8, textAlign: textAlign('start') }]}>
              {t(slot.labelKey)}
            </Text>
            <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
              <View style={{ flex: 1, minWidth: 70 }}>
                <Input
                  label={t('nutrition.calories')}
                  value={meals[slot.id].calories}
                  onChangeText={(v) => updateMeal(slot.id, 'calories', v)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={{ flex: 1, minWidth: 70 }}>
                <Input
                  label={t('nutrition.protein')}
                  value={meals[slot.id].protein_g}
                  onChangeText={(v) => updateMeal(slot.id, 'protein_g', v)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={{ flex: 1, minWidth: 70 }}>
                <Input
                  label={t('nutrition.carbs')}
                  value={meals[slot.id].carbs_g}
                  onChangeText={(v) => updateMeal(slot.id, 'carbs_g', v)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={{ flex: 1, minWidth: 70 }}>
                <Input
                  label={t('nutrition.fat')}
                  value={meals[slot.id].fat_g}
                  onChangeText={(v) => updateMeal(slot.id, 'fat_g', v)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>
            <Input
              label={t('nutrition.mealNotes')}
              value={meals[slot.id].description}
              onChangeText={(v) => updateMeal(slot.id, 'description', v)}
              placeholder={t('nutrition.mealNotesPlaceholder')}
            />
          </View>
        ))}
      </FormSection>

      <FormSection title={t('nutrition.hydrationTitle')}>
        <CheckInSliderField
          label={t('nutrition.waterIntake')}
          value={water}
          onChange={setWater}
          minimumValue={0}
          maximumValue={5}
          step={0.1}
          unit="L"
        />
      </FormSection>

      <FormSection title={t('nutrition.supplementsTitle')}>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
          {SUPPLEMENT_CATALOG.map((sup) => {
            const active = supplements.includes(sup.key);
            return (
              <TouchableOpacity
                key={sup.key}
                onPress={() => toggleSupplement(sup.key)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: 1,
                  borderColor: active ? '#F97316' : theme.colors.border,
                  backgroundColor: active ? '#F9731615' : theme.colors.surface,
                }}
              >
                <Text style={[type.caption, { color: active ? '#F97316' : theme.colors.text }]}>{t(sup.labelKey)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </FormSection>

      <FormSection title={t('nutrition.notesTitle')}>
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholder={t('nutrition.notesPlaceholder')}
          multiline
          numberOfLines={3}
        />
      </FormSection>

      <CardTotals totals={totals} water={water} />

      <Button title={t('nutrition.saveLog')} onPress={handleSubmit} loading={loading} style={{ marginTop: theme.spacing.lg, marginBottom: theme.spacing.xl }} />
    </ScrollView>
  );
}

function CardTotals({ totals, water }: { totals: { calories: number; protein_g: number; carbs_g: number; fat_g: number }; water: number }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow } = useDirection();

  return (
    <View
      style={{
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: `${theme.colors.primary}10`,
        flexDirection: flexRow(true),
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <Text style={[type.caption, { color: theme.colors.textSecondary, width: '100%' }]}>{t('nutrition.dailyTotals')}</Text>
      <Text style={[type.bodySm, { color: theme.colors.text }]}>{totals.calories} kcal</Text>
      <Text style={[type.bodySm, { color: theme.colors.text }]}>P {totals.protein_g}g</Text>
      <Text style={[type.bodySm, { color: theme.colors.text }]}>C {totals.carbs_g}g</Text>
      <Text style={[type.bodySm, { color: theme.colors.text }]}>F {totals.fat_g}g</Text>
      <Text style={[type.bodySm, { color: theme.colors.text }]}>{water}L {t('nutrition.waterShort')}</Text>
    </View>
  );
}
