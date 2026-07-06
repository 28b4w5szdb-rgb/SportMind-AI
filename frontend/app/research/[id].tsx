import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useResearchById } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useFormAction } from '@/src/hooks/useFormAction';
import { researchStatusVariant } from '@/src/utils/moduleHelpers';

function FieldRow({ label, value, textAlign }: { label: string; value?: string; textAlign: (s: 'start' | 'end' | 'center') => 'left' | 'right' | 'center' }) {
  const theme = useTheme();
  const type = useTypography();
  if (!value?.trim()) return null;
  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text style={[type.label, { color: theme.colors.textTertiary, textAlign: textAlign('start'), marginBottom: 4 }]}>{label}</Text>
      <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start'), lineHeight: 22 }]}>{value}</Text>
    </View>
  );
}

export default function ResearchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const project = useResearchById(id);
  const updateResearch = useMockStore((s) => s.updateResearch);
  const { loading, success, run } = useFormAction();

  if (!project) {
    return (
      <FeatureScrollScreen title={t('features.research.detailTitle')}>
        <EmptyState icon="library-outline" title={t('features.research.notFoundTitle')} description={t('features.research.notFoundDesc')} />
      </FeatureScrollScreen>
    );
  }

  const setStatus = (status: typeof project.status) => {
    run(() => updateResearch(project.id, { status, progress: status === 'completed' ? 100 : status === 'active' ? 45 : project.progress }));
  };

  return (
    <FeatureScrollScreen title={t('features.research.detailTitle')}>
      <SuccessBanner message={t('features.research.updated')} visible={success} />

      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, ...theme.shadows.md }}>
        <Text style={[type.h4, { color: theme.colors.text, textAlign: textAlign('start') }]}>{project.title}</Text>
        <Badge label={t(`features.research.status.${project.status}`)} variant={researchStatusVariant(project.status)} style={{ marginTop: theme.spacing.sm }} />
        <View style={{ marginTop: theme.spacing.md, height: 8, backgroundColor: theme.colors.border, borderRadius: 4 }}>
          <View style={{ width: `${project.progress}%`, height: 8, backgroundColor: theme.colors.secondary, borderRadius: 4 }} />
        </View>
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 6, textAlign: textAlign('start') }]}>
          {t('features.research.progress')}: {project.progress}% · {new Date(project.updated_at).toLocaleDateString(isRTL ? 'ar' : 'en')}
        </Text>
      </Card>

      <FormSection title={t('features.research.designTitle')}>
        <FieldRow label={t('features.research.hypothesis')} value={project.hypothesis} textAlign={textAlign} />
        <FieldRow label={t('features.research.sample')} value={project.sample} textAlign={textAlign} />
        <FieldRow label={t('features.research.method')} value={project.method} textAlign={textAlign} />
        <FieldRow label={t('features.research.variables')} value={project.variables} textAlign={textAlign} />
        <FieldRow label={t('features.research.notes')} value={project.notes} textAlign={textAlign} />
      </FormSection>

      <FormSection title={t('features.research.analysisTitle')} subtitle={t('features.research.analysisSubtitle')}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
          <Ionicons name="analytics" size={20} color={theme.colors.primary} />
          <Text style={[type.body, { color: theme.colors.text, flex: 1, marginStart: theme.spacing.sm, textAlign: textAlign('start'), lineHeight: 22 }]}>
            {project.mock_analysis || t('features.research.analysisPlaceholder')}
          </Text>
        </View>
      </FormSection>

      <FormSection title={t('features.research.referencesTitle')} subtitle={t('features.research.referencesSubtitle')}>
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start'), lineHeight: 22 }]}>
          {project.references?.trim() || t('features.research.referencesEmpty')}
        </Text>
        <Button
          title={t('features.research.importReferences')}
          variant="outline"
          size="small"
          icon="library-outline"
          style={{ marginTop: theme.spacing.md }}
          onPress={() =>
            Alert.alert(t('features.research.referencesTitle'), t('features.research.importComingSoon'))
          }
        />
      </FormSection>

      <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, flexWrap: 'wrap' }}>
        {project.status === 'planning' && (
          <Button title={t('features.research.activate')} onPress={() => setStatus('active')} loading={loading} disabled={loading} variant="primary" style={{ flex: 1, minWidth: 140 }} />
        )}
        {project.status === 'active' && (
          <Button title={t('features.research.complete')} onPress={() => setStatus('completed')} loading={loading} disabled={loading} variant="success" style={{ flex: 1, minWidth: 140 }} />
        )}
      </View>
      <Button title={t('common.back')} onPress={() => router.replace(APP_ROUTES.research)} variant="ghost" fullWidth style={{ marginTop: theme.spacing.md }} />
    </FeatureScrollScreen>
  );
}
