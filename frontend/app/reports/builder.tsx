import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { MockReport } from '@/src/data/mock/types';

const REPORT_TYPES: MockReport['type'][] = ['athlete', 'team', 'session', 'custom'];

export default function ReportBuilderScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const addReport = useMockStore((s) => s.addReport);

  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState<MockReport['type']>('athlete');
  const [summary, setSummary] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    addReport({ title: title.trim(), type: reportType, summary: summary.trim() || 'Draft report' });
    Alert.alert(t('features.reports.saved'), '', [
      { text: t('common.done'), onPress: () => router.replace(APP_ROUTES.reports) },
    ]);
  };

  return (
    <FeatureScrollScreen title={t('features.reports.builderTitle')}>
      <Input label={t('features.reports.reportTitle')} value={title} onChangeText={setTitle} />

      <Text style={[type.label, { color: theme.colors.textSecondary, marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm, textAlign: textAlign('start') }]}>
        {t('features.reports.reportType')}
      </Text>
      <View style={[ { flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }]}>
        {REPORT_TYPES.map((rt) => {
          const active = reportType === rt;
          return (
            <TouchableOpacity
              key={rt}
              onPress={() => setReportType(rt)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                borderWidth: 1,
                borderColor: active ? theme.colors.primary : theme.colors.border,
              }}
            >
              <Text style={[type.bodySm, { color: active ? '#FFF' : theme.colors.text }]}>
                {t(`features.reports.types.${rt}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Input
        label={t('features.reports.summary')}
        value={summary}
        onChangeText={setSummary}
        multiline
        numberOfLines={4}
        containerStyle={{ marginTop: theme.spacing.lg }}
        style={{ minHeight: 100, textAlignVertical: 'top' }}
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={!title.trim()}
        style={{
          marginTop: theme.spacing.xl,
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
