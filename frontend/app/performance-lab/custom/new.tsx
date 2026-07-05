import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useFormAction } from '@/src/hooks/useFormAction';
import { useTestLibraryActions } from '@/src/features/performance-lab/hooks/useTestLibrary';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function CustomTestCreateScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { addCustomTest } = useTestLibraryActions();
  const { loading, success, run } = useFormAction();

  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [unit, setUnit] = useState('');
  const [protocol, setProtocol] = useState('');
  const [targetMetric, setTargetMetric] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; unit?: string; protocol?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = t('testingCenter.custom.nameRequired');
    if (!unit.trim()) next.unit = t('testingCenter.custom.unitRequired');
    if (!protocol.trim()) next.protocol = t('testingCenter.custom.protocolRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    run(() => {
      const def = addCustomTest({
        name: name.trim(),
        nameAr: nameAr.trim() || undefined,
        unit: unit.trim(),
        protocol: protocol.trim(),
        protocolAr: protocol.trim(),
        targetMetric: targetMetric.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setTimeout(() => router.replace(APP_ROUTES.performanceLabTest(def.key)), 600);
    });
  };

  return (
    <FeatureScrollScreen title={t('testingCenter.custom.title')}>
      <SuccessBanner message={t('testingCenter.custom.saved')} visible={success} />

      <FormSection title={t('testingCenter.custom.subtitle')}>
        <Input label={t('testingCenter.custom.name')} value={name} onChangeText={setName} error={errors.name} />
        <Input
          label={t('testingCenter.custom.nameAr')}
          value={nameAr}
          onChangeText={setNameAr}
          containerStyle={{ marginTop: 12 }}
          placeholder={isRTL ? name : undefined}
        />
        <Input label={t('testingCenter.custom.unit')} value={unit} onChangeText={setUnit} containerStyle={{ marginTop: 12 }} error={errors.unit} />
        <Input
          label={t('testingCenter.custom.protocol')}
          value={protocol}
          onChangeText={setProtocol}
          multiline
          containerStyle={{ marginTop: 12 }}
          style={{ minHeight: 88, textAlignVertical: 'top' }}
          error={errors.protocol}
        />
        <Input
          label={t('testingCenter.custom.targetMetric')}
          value={targetMetric}
          onChangeText={setTargetMetric}
          containerStyle={{ marginTop: 12 }}
        />
        <Input
          label={t('testingCenter.custom.notes')}
          value={notes}
          onChangeText={setNotes}
          multiline
          containerStyle={{ marginTop: 12 }}
          style={{ minHeight: 72, textAlignVertical: 'top' }}
        />
      </FormSection>

      <Button title={loading ? t('common.saving') : t('testingCenter.custom.create')} onPress={handleSave} loading={loading} fullWidth icon="checkmark" />
    </FeatureScrollScreen>
  );
}
