import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';

export default function NewResearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const addResearch = useMockStore((s) => s.addResearch);
  const [title, setTitle] = useState('');
  const [hypothesis, setHypothesis] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    addResearch({ title: title.trim(), hypothesis: hypothesis.trim() || '—' });
    Alert.alert(t('features.research.saved'), '', [
      { text: t('common.done'), onPress: () => router.replace(APP_ROUTES.research) },
    ]);
  };

  return (
    <FeatureScrollScreen title={t('features.research.newProject')}>
      <Input label={t('features.research.projectTitle')} value={title} onChangeText={setTitle} />
      <Input
        label={t('features.research.hypothesis')}
        value={hypothesis}
        onChangeText={setHypothesis}
        multiline
        numberOfLines={5}
        containerStyle={{ marginTop: 16 }}
        style={{ minHeight: 120, textAlignVertical: 'top' }}
      />
      <Input
        label={t('features.research.progress')}
        value="10%"
        editable={false}
        containerStyle={{ marginTop: 16, opacity: 0.6 }}
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={!title.trim()}
        style={{
          marginTop: 24,
          backgroundColor: theme.colors.primary,
          borderRadius: theme.borderRadius.lg,
          minHeight: 48,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: title.trim() ? 1 : 0.5,
        }}
      >
        <Text style={[type.button, { color: '#FFF' }]}>{t('common.save')}</Text>
      </TouchableOpacity>
    </FeatureScrollScreen>
  );
}
