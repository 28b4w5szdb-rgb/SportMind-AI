import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useFormAction } from '@/src/hooks/useFormAction';

export default function NewResearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const addResearch = useMockStore((s) => s.addResearch);
  const { loading, success, run } = useFormAction();

  const [title, setTitle] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [sample, setSample] = useState('');
  const [method, setMethod] = useState('');
  const [variables, setVariables] = useState('');
  const [notes, setNotes] = useState('');
  const [references, setReferences] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>();

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(t('features.research.titleRequired'));
      return;
    }
    run(() => {
      const project = addResearch({
        title: title.trim(),
        hypothesis: hypothesis.trim() || '—',
        sample: sample.trim() || undefined,
        method: method.trim() || undefined,
        variables: variables.trim() || undefined,
        notes: notes.trim() || undefined,
        references: references.trim() || undefined,
      });
      setTimeout(() => router.replace(APP_ROUTES.researchDetail(project.id)), 600);
    });
  };

  return (
    <FeatureScrollScreen title={t('features.research.newProject')}>
      <SuccessBanner message={t('features.research.saved')} visible={success} />

      <FormSection title={t('features.research.projectTitle')} subtitle={t('features.research.newSubtitle')}>
        <Input
          label={t('features.research.projectTitle')}
          value={title}
          onChangeText={(v) => {
            setTitle(v);
            setTitleError(undefined);
          }}
          error={titleError}
        />
        <Input label={t('features.research.hypothesis')} value={hypothesis} onChangeText={setHypothesis} multiline containerStyle={{ marginTop: 16 }} style={{ minHeight: 100, textAlignVertical: 'top' }} />
      </FormSection>

      <FormSection title={t('features.research.designTitle')} subtitle={t('features.research.designSubtitle')}>
        <Input label={t('features.research.sample')} value={sample} onChangeText={setSample} placeholder={t('features.research.samplePlaceholder')} />
        <Input label={t('features.research.method')} value={method} onChangeText={setMethod} multiline containerStyle={{ marginTop: 16 }} style={{ minHeight: 80, textAlignVertical: 'top' }} />
        <Input label={t('features.research.variables')} value={variables} onChangeText={setVariables} multiline containerStyle={{ marginTop: 16 }} style={{ minHeight: 80, textAlignVertical: 'top' }} />
        <Input label={t('features.research.notes')} value={notes} onChangeText={setNotes} multiline containerStyle={{ marginTop: 16 }} style={{ minHeight: 80, textAlignVertical: 'top' }} />
      </FormSection>

      <FormSection title={t('features.research.referencesTitle')} subtitle={t('features.research.referencesSubtitle')}>
        <Input label={t('features.research.references')} value={references} onChangeText={setReferences} multiline style={{ minHeight: 100, textAlignVertical: 'top' }} placeholder={t('features.research.referencesPlaceholder')} />
      </FormSection>

      <Button title={loading ? t('common.saving') : t('common.save')} onPress={handleSave} loading={loading} disabled={loading} fullWidth icon="book-outline" />
    </FeatureScrollScreen>
  );
}
