import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useFormAction } from '@/src/hooks/useFormAction';
import type { MockReport } from '@/src/data/mock/types';

const REPORT_TYPES: MockReport['type'][] = ['athlete', 'team', 'session', 'custom'];

export default function ReportBuilderScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const addReport = useMockStore((s) => s.addReport);
  const { loading, success, run } = useFormAction();

  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState<MockReport['type']>('athlete');
  const [summary, setSummary] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>();

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(t('features.reports.titleRequired'));
      return;
    }
    run(() => {
      addReport({ title: title.trim(), type: reportType, summary: summary.trim() || 'Draft report' });
      setTimeout(() => router.replace(APP_ROUTES.reports), 600);
    });
  };

  return (
    <FeatureScrollScreen title={t('features.reports.builderTitle')}>
      <SuccessBanner message={t('features.reports.saved')} visible={success} />

      <FormSection title={t('features.reports.reportTitle')} subtitle={t('features.reports.builderSubtitle')}>
        <Input
          label={t('features.reports.reportTitle')}
          value={title}
          onChangeText={(v) => {
            setTitle(v);
            setTitleError(undefined);
          }}
          error={titleError}
        />
      </FormSection>

      <FormSection title={t('features.reports.reportType')}>
        <View style={[{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }]}>
          {REPORT_TYPES.map((rt) => {
            const active = reportType === rt;
            return (
              <Button
                key={rt}
                title={t(`features.reports.types.${rt}`)}
                onPress={() => setReportType(rt)}
                variant={active ? 'primary' : 'outline'}
                size="small"
              />
            );
          })}
        </View>
      </FormSection>

      <FormSection title={t('features.reports.summary')}>
        <Input
          value={summary}
          onChangeText={setSummary}
          multiline
          numberOfLines={4}
          style={{ minHeight: 100, textAlignVertical: 'top' }}
        />
      </FormSection>

      <Button
        title={loading ? t('common.saving') : t('common.save')}
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        fullWidth
        icon="document-text"
      />
    </FeatureScrollScreen>
  );
}
