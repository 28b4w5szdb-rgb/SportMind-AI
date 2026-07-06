import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { FormSection } from '@/src/components/common/FormSection';
import type { BodyCompositionInput, BodyCompositionRecord } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface BodyCompositionFormProps {
  athleteId: string;
  existing?: BodyCompositionRecord;
  onSubmit: (values: BodyCompositionInput) => void;
  loading?: boolean;
}

function parseOptional(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : undefined;
}

export function BodyCompositionForm({ athleteId, existing, onSubmit, loading }: BodyCompositionFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  const [weight, setWeight] = useState(existing ? String(existing.weight_kg) : '');
  const [bodyFat, setBodyFat] = useState(existing?.body_fat_percent != null ? String(existing.body_fat_percent) : '');
  const [muscleMass, setMuscleMass] = useState(existing?.muscle_mass_kg != null ? String(existing.muscle_mass_kg) : '');
  const [leanMass, setLeanMass] = useState(existing?.lean_mass_kg != null ? String(existing.lean_mass_kg) : '');
  const [bodyWater, setBodyWater] = useState(existing?.body_water_percent != null ? String(existing.body_water_percent) : '');
  const [waist, setWaist] = useState(existing?.waist_cm != null ? String(existing.waist_cm) : '');
  const [hip, setHip] = useState(existing?.hip_cm != null ? String(existing.hip_cm) : '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [weightError, setWeightError] = useState<string | undefined>();

  const handleSubmit = () => {
    const weightKg = parseFloat(weight);
    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      setWeightError(t('nutrition.bodyComp.weightRequired'));
      return;
    }
    setWeightError(undefined);
    onSubmit({
      athlete_id: athleteId,
      weight_kg: weightKg,
      body_fat_percent: parseOptional(bodyFat),
      muscle_mass_kg: parseOptional(muscleMass),
      lean_mass_kg: parseOptional(leanMass),
      body_water_percent: parseOptional(bodyWater),
      waist_cm: parseOptional(waist),
      hip_cm: parseOptional(hip),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <View>
      <FormSection title={t('nutrition.bodyComp.entryTitle')}>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Input label={`${t('nutrition.weight')} (kg)`} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" error={weightError} />
          </View>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Input label={`${t('nutrition.bodyFat')} (%)`} value={bodyFat} onChangeText={setBodyFat} keyboardType="decimal-pad" />
          </View>
        </View>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Input label={`${t('nutrition.bodyComp.muscleMass')} (kg)`} value={muscleMass} onChangeText={setMuscleMass} keyboardType="decimal-pad" />
          </View>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Input label={`${t('nutrition.leanMass')} (kg)`} value={leanMass} onChangeText={setLeanMass} keyboardType="decimal-pad" />
          </View>
        </View>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Input label={`${t('nutrition.bodyComp.bodyWater')} (%)`} value={bodyWater} onChangeText={setBodyWater} keyboardType="decimal-pad" />
          </View>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Input label={`${t('nutrition.bodyComp.waist')} (cm)`} value={waist} onChangeText={setWaist} keyboardType="decimal-pad" />
          </View>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Input label={`${t('nutrition.bodyComp.hip')} (cm)`} value={hip} onChangeText={setHip} keyboardType="decimal-pad" />
          </View>
        </View>
        <Input
          label={t('nutrition.notesTitle')}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('nutrition.bodyComp.notesPlaceholder')}
          multiline
          containerStyle={{ marginTop: theme.spacing.md }}
          style={{ minHeight: 72, textAlignVertical: 'top', textAlign: textAlign('start') }}
        />
      </FormSection>
      <Button title={t('nutrition.bodyComp.saveEntry')} onPress={handleSubmit} loading={loading} fullWidth />
    </View>
  );
}

function ChangeRow({ label, value, unit }: { label: string; value?: number; unit?: string }) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow } = useDirection();
  if (value === undefined) return null;
  const color = value > 0 ? theme.colors.warning : value < 0 ? theme.colors.success : theme.colors.textSecondary;
  const prefix = value > 0 ? '+' : '';

  return (
    <View style={{ flexDirection: flexRow(true), justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text style={[type.caption, { color, fontWeight: '700' }]}>
        {prefix}
        {value}
        {unit ?? ''}
      </Text>
    </View>
  );
}

interface BodyCompositionHistoryPanelProps {
  analysis: import('../types').BodyCompositionAnalysis;
  trend: BodyCompositionRecord[];
  showSectionTitle?: boolean;
}

export function BodyCompositionHistoryPanel({ analysis, trend, showSectionTitle = true }: BodyCompositionHistoryPanelProps) {
  const { t } = useTranslation();

  return (
    <View>
      {showSectionTitle ? (
        <FormSection title={t('nutrition.bodyComp.historyTitle')}>
          <HistoryBody analysis={analysis} trend={trend} />
        </FormSection>
      ) : (
        <HistoryBody analysis={analysis} trend={trend} />
      )}
    </View>
  );
}

function HistoryBody({ analysis, trend }: { analysis: import('../types').BodyCompositionAnalysis; trend: BodyCompositionRecord[] }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { latest, previous, weightChange, bodyFatChange, muscleMassChange, bmi, waistHipRatio, statusKey, trendDirection } = analysis;

  const statusColor =
    analysis.status === 'optimal' ? theme.colors.success : analysis.status === 'attention' ? theme.colors.error : theme.colors.warning;

  return (
    <>
      {!latest ? (
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{t('nutrition.bodyComp.noHistory')}</Text>
      ) : (
          <View
            style={{
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.xl,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            }}
          >
            <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.md, marginBottom: theme.spacing.sm }}>
              <View>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.bodyComp.latest')}</Text>
                <Text style={[type.body, { color: theme.colors.text, fontWeight: '700' }]}>
                  {latest.weight_kg} kg · {latest.date}
                </Text>
              </View>
              {previous ? (
                <View>
                  <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.bodyComp.previous')}</Text>
                  <Text style={[type.bodySm, { color: theme.colors.text }]}>
                    {previous.weight_kg} kg · {previous.date}
                  </Text>
                </View>
              ) : null}
            </View>

            <ChangeRow label={t('nutrition.bodyComp.weightChange')} value={weightChange} unit=" kg" />
            <ChangeRow label={t('nutrition.bodyComp.bodyFatChange')} value={bodyFatChange} unit="%" />
            <ChangeRow label={t('nutrition.bodyComp.muscleChange')} value={muscleMassChange} unit=" kg" />

            <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.md, marginTop: theme.spacing.sm }}>
              {bmi !== undefined ? (
                <View>
                  <Text style={[type.caption, { color: theme.colors.textSecondary }]}>BMI</Text>
                  <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700' }]}>{bmi}</Text>
                </View>
              ) : null}
              {waistHipRatio !== undefined ? (
                <View>
                  <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.bodyComp.whr')}</Text>
                  <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700' }]}>{waistHipRatio}</Text>
                </View>
              ) : null}
              <View>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.bodyComp.trend')}</Text>
                <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700' }]}>{t(`nutrition.bodyComp.trendDir.${trendDirection}`)}</Text>
              </View>
              <View>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.bodyComp.status')}</Text>
                <Text style={[type.bodySm, { color: statusColor, fontWeight: '700' }]}>{t(statusKey)}</Text>
              </View>
            </View>
          </View>
        )}

      {trend.length > 1 ? (
        <View style={{ flexDirection: flexRow(true), alignItems: 'flex-end', height: 64, gap: 6, marginTop: 4 }}>
          {[...trend].reverse().map((pt) => {
            const h = Math.max(12, Math.min(56, pt.weight_kg * 0.6));
            return (
              <View key={pt.id} style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ width: 14, height: h, backgroundColor: theme.colors.primary, borderRadius: 4, opacity: 0.85 }} />
                <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, fontSize: 9 }]} numberOfLines={1}>
                  {pt.date.slice(5)}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </>
  );
}
