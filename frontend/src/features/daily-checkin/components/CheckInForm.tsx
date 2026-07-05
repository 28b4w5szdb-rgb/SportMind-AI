import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import type { DailyCheckInInput } from '@/src/data/mock/types';
import { defaultCheckInValues, validateCheckInInput } from '../validation';
import { CheckInSliderField } from './CheckInSliderField';

interface CheckInFormProps {
  athleteId: string;
  onSubmit: (values: DailyCheckInInput) => void;
  loading?: boolean;
}

export function CheckInForm({ athleteId, onSubmit, loading }: CheckInFormProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<DailyCheckInInput>(() => defaultCheckInValues(athleteId));
  const [errors, setErrors] = useState<ReturnType<typeof validateCheckInInput>['errors']>({});

  useEffect(() => {
    setValues(defaultCheckInValues(athleteId));
    setErrors({});
  }, [athleteId]);

  const setField = <K extends keyof DailyCheckInInput>(key: K, value: DailyCheckInInput[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const payload = { ...values, athlete_id: athleteId };
    const result = validateCheckInInput(payload);
    setErrors(result.errors);
    if (result.valid) onSubmit(payload);
  };

  const err = (key: keyof DailyCheckInInput) => (errors[key] ? t(String(errors[key])) : undefined);

  return (
    <View>
      <FormSection title={t('dailyCheckIn.sections.sleep')} subtitle={t('dailyCheckIn.sections.sleepHint')}>
        <CheckInSliderField
          label={t('dailyCheckIn.fields.sleepDuration')}
          value={values.sleep_duration_hours}
          onChange={(v) => setField('sleep_duration_hours', v)}
          minimumValue={0}
          maximumValue={12}
          step={0.5}
          unit={t('dailyCheckIn.units.hours')}
          error={err('sleep_duration_hours')}
        />
        <CheckInSliderField
          label={t('dailyCheckIn.fields.sleepQuality')}
          value={values.sleep_quality}
          onChange={(v) => setField('sleep_quality', Math.round(v))}
          minimumValue={1}
          maximumValue={10}
          error={err('sleep_quality')}
        />
      </FormSection>

      <FormSection title={t('dailyCheckIn.sections.wellness')} subtitle={t('dailyCheckIn.sections.wellnessHint')}>
        <CheckInSliderField label={t('dailyCheckIn.fields.fatigue')} value={values.fatigue} onChange={(v) => setField('fatigue', Math.round(v))} minimumValue={1} maximumValue={10} error={err('fatigue')} />
        <CheckInSliderField label={t('dailyCheckIn.fields.soreness')} value={values.muscle_soreness} onChange={(v) => setField('muscle_soreness', Math.round(v))} minimumValue={1} maximumValue={10} error={err('muscle_soreness')} />
        <CheckInSliderField label={t('dailyCheckIn.fields.mood')} value={values.mood} onChange={(v) => setField('mood', Math.round(v))} minimumValue={1} maximumValue={10} error={err('mood')} />
        <CheckInSliderField label={t('dailyCheckIn.fields.stress')} value={values.stress} onChange={(v) => setField('stress', Math.round(v))} minimumValue={1} maximumValue={10} error={err('stress')} />
        <CheckInSliderField label={t('dailyCheckIn.fields.pain')} value={values.pain_level} onChange={(v) => setField('pain_level', Math.round(v))} minimumValue={0} maximumValue={10} error={err('pain_level')} />
      </FormSection>

      <FormSection title={t('dailyCheckIn.sections.physiology')} subtitle={t('dailyCheckIn.sections.physiologyHint')}>
        <CheckInSliderField label={t('dailyCheckIn.fields.hydration')} value={values.hydration_liters} onChange={(v) => setField('hydration_liters', v)} minimumValue={0} maximumValue={5} step={0.1} unit="L" error={err('hydration_liters')} />
        <CheckInSliderField label={t('dailyCheckIn.fields.heartRate')} value={values.morning_heart_rate} onChange={(v) => setField('morning_heart_rate', Math.round(v))} minimumValue={40} maximumValue={110} unit="bpm" error={err('morning_heart_rate')} />
        <CheckInSliderField label={t('dailyCheckIn.fields.rpe')} value={values.rpe} onChange={(v) => setField('rpe', Math.round(v))} minimumValue={1} maximumValue={10} hint={t('dailyCheckIn.fields.rpeHint')} error={err('rpe')} />
      </FormSection>

      <FormSection title={t('dailyCheckIn.sections.notes')}>
        <Input
          label={t('dailyCheckIn.fields.notes')}
          value={values.notes ?? ''}
          onChangeText={(text) => setField('notes', text)}
          multiline
          numberOfLines={4}
          error={err('notes')}
          placeholder={t('dailyCheckIn.fields.notesPlaceholder')}
        />
      </FormSection>

      <Button title={t('dailyCheckIn.submit')} onPress={handleSubmit} loading={loading} fullWidth icon="checkmark-circle" />
    </View>
  );
}
