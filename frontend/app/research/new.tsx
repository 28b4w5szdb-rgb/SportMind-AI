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
  const [titleError, setTitleError] = useState<string | undefined>();

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(t('features.research.titleRequired'));
      return;
    }
    run(() => {
      addResearch({ title: title.trim(), hypothesis: hypothesis.trim() || '—' });
      setTimeout(() => router.replace(APP_ROUTES.research), 600);
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
        <Input
          label={t('features.research.hypothesis')}
          value={hypothesis}
          onChangeText={setHypothesis}
          multiline
          numberOfLines={5}
          containerStyle={{ marginTop: 16 }}
          style={{ minHeight: 120, textAlignVertical: 'top' }}
        />
      </FormSection>

      <FormSection title={t('features.research.progress')}>
        <Input label={t('features.research.progress')} value="10%" editable={false} containerStyle={{ opacity: 0.7 }} />
      </FormSection>

      <Button
        title={loading ? t('common.saving') : t('common.save')}
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        fullWidth
        icon="book-outline"
      />
    </FeatureScrollScreen>
  );
}
