/**
 * Athlete form fields — shared by add/edit screens.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Input } from '@/src/components/common/Input';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { AthleteStatus, MockAthlete } from '@/src/data/mock/types';

export interface AthleteFormValues {
  first_name: string;
  last_name: string;
  position: string;
  status: AthleteStatus;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  jersey_number: string;
  height_cm: string;
  weight_kg: string;
}

const STATUS_OPTIONS: AthleteStatus[] = ['active', 'injured', 'rest'];

export function athleteToFormValues(a?: MockAthlete): AthleteFormValues {
  return {
    first_name: a?.first_name ?? '',
    last_name: a?.last_name ?? '',
    position: a?.position ?? '',
    status: a?.status ?? 'active',
    date_of_birth: a?.date_of_birth ?? '',
    gender: a?.gender ?? 'male',
    nationality: a?.nationality ?? '',
    jersey_number: a?.jersey_number != null ? String(a.jersey_number) : '',
    height_cm: a?.height_cm != null ? String(a.height_cm) : '',
    weight_kg: a?.weight_kg != null ? String(a.weight_kg) : '',
  };
}

export function formValuesToAthleteInput(v: AthleteFormValues) {
  return {
    first_name: v.first_name.trim(),
    last_name: v.last_name.trim(),
    position: v.position.trim(),
    status: v.status,
    date_of_birth: v.date_of_birth || undefined,
    gender: v.gender,
    nationality: v.nationality || undefined,
    jersey_number: v.jersey_number ? Number(v.jersey_number) : undefined,
    height_cm: v.height_cm ? Number(v.height_cm) : undefined,
    weight_kg: v.weight_kg ? Number(v.weight_kg) : undefined,
  };
}

interface AthleteFormProps {
  initial?: AthleteFormValues;
  onSubmit: (values: AthleteFormValues) => void;
  submitLabel: string;
  loading?: boolean;
}

export function AthleteForm({ initial, onSubmit, submitLabel, loading }: AthleteFormProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { flexRow, textAlign } = useDirection();
  const [values, setValues] = useState<AthleteFormValues>(initial ?? athleteToFormValues());
  const [errors, setErrors] = useState<Partial<Record<keyof AthleteFormValues, string>>>({});

  const set = (key: keyof AthleteFormValues, val: string | AthleteStatus) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!values.first_name.trim()) next.first_name = t('features.athletes.validation.firstName');
    if (!values.last_name.trim()) next.last_name = t('features.athletes.validation.lastName');
    if (!values.position.trim()) next.position = t('features.athletes.validation.position');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(values);
  };

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Input
        label={t('features.athletes.fields.firstName')}
        value={values.first_name}
        onChangeText={(v) => set('first_name', v)}
        error={errors.first_name}
        autoCapitalize="words"
      />
      <Input
        label={t('features.athletes.fields.lastName')}
        value={values.last_name}
        onChangeText={(v) => set('last_name', v)}
        error={errors.last_name}
        autoCapitalize="words"
      />
      <Input
        label={t('features.athletes.fields.position')}
        value={values.position}
        onChangeText={(v) => set('position', v)}
        error={errors.position}
      />
      <Text style={[theme.typography.label, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
        {t('features.athletes.fields.status')}
      </Text>
      <View style={[styles.chips, { flexDirection: flexRow(true), gap: theme.spacing.sm }]}>
        {STATUS_OPTIONS.map((s) => {
          const active = values.status === s;
          return (
            <TouchableOpacity
              key={s}
              onPress={() => set('status', s)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.borderRadius.lg,
                },
              ]}
            >
              <Text style={[theme.typography.bodySm, { color: active ? '#FFF' : theme.colors.text }]}>
                {t(`features.athletes.status.${s}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Input
        label={t('features.athletes.fields.dateOfBirth')}
        value={values.date_of_birth}
        onChangeText={(v) => set('date_of_birth', v)}
        placeholder="YYYY-MM-DD"
      />
      <Input
        label={t('features.athletes.fields.jerseyNumber')}
        value={values.jersey_number}
        onChangeText={(v) => set('jersey_number', v)}
        keyboardType="number-pad"
      />
      <View style={{ flexDirection: flexRow(true), gap: theme.spacing.md }}>
        <View style={{ flex: 1 }}>
          <Input
            label={t('features.athletes.fields.height')}
            value={values.height_cm}
            onChangeText={(v) => set('height_cm', v)}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label={t('features.athletes.fields.weight')}
            value={values.weight_kg}
            onChangeText={(v) => set('weight_kg', v)}
            keyboardType="decimal-pad"
          />
        </View>
      </View>
      <Input
        label={t('features.athletes.fields.nationality')}
        value={values.nationality}
        onChangeText={(v) => set('nationality', v)}
        autoCapitalize="characters"
      />
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={[
          styles.submit,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.lg,
            opacity: loading ? 0.6 : 1,
          },
        ]}
      >
        <Text style={[theme.typography.button, { color: '#FFF' }]}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexWrap: 'wrap', marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  submit: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 8,
  },
});
