import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useFormAction } from '@/src/hooks/useFormAction';
import { useTestLibraryActions } from '@/src/features/performance-lab/hooks/useTestLibrary';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useTheme, useTypography } from '@/src/core/theme';
import { TESTING_CATEGORIES } from '@/src/features/performance-lab/registry/categories';
import { validateCustomAssessmentInput } from '@/src/features/performance-lab/bridge/customAssessmentBridge';
import { useCustomTestDefinitions } from '@/src/features/performance-lab/hooks/useTestLibrary';
import type { EvidenceTier } from '@/src/cloud/scientific/models/common';
import type { TestCategoryId } from '@/src/features/performance-lab/types';

const ADVANCED_EVIDENCE_TIERS: EvidenceTier[] = ['screening', 'field', 'professional'];
const RESEARCH_EVIDENCE_TIERS: EvidenceTier[] = ['clinical', 'research'];

export default function CustomTestCreateScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, flexRow } = useDirection();
  const theme = useTheme();
  const type = useTypography();
  const { addCustomTest } = useTestLibraryActions();
  const customTests = useCustomTestDefinitions();
  const { loading, success, run } = useFormAction();

  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [unit, setUnit] = useState('');
  const [protocol, setProtocol] = useState('');
  const [targetMetric, setTargetMetric] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState<TestCategoryId>('custom');
  const [evidenceTier, setEvidenceTier] = useState<EvidenceTier>('screening');
  const [primaryMetricKey, setPrimaryMetricKey] = useState('');
  const [validityNotes, setValidityNotes] = useState('');
  const [reliabilityNotes, setReliabilityNotes] = useState('');
  const [citation, setCitation] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const existingKeys = useMemo(() => customTests.map((item) => item.key), [customTests]);

  const buildInput = () => ({
    name: name.trim(),
    nameAr: nameAr.trim() || undefined,
    unit: unit.trim(),
    protocol: protocol.trim(),
    protocolAr: protocol.trim(),
    targetMetric: targetMetric.trim() || undefined,
    primaryMetricKey: primaryMetricKey.trim() || undefined,
    notes: notes.trim() || undefined,
    categoryId,
    evidenceTier,
    sourceType: 'manual' as const,
    researchMetadata:
      RESEARCH_EVIDENCE_TIERS.includes(evidenceTier)
        ? {
            validityNotes: validityNotes.trim(),
            reliabilityNotes: reliabilityNotes.trim(),
            citation: citation.trim() || undefined,
          }
        : undefined,
  });

  const validate = () => {
    const result = validateCustomAssessmentInput(buildInput(), existingKeys);
    if (result.valid) {
      setErrors({});
      return true;
    }
    const key = result.errorKey ?? 'testingCenter.custom.validationFailed';
    const field =
      key.includes('nameRequired') ? 'name'
      : key.includes('unitRequired') ? 'unit'
      : key.includes('protocolRequired') ? 'protocol'
      : key.includes('metricRequired') ? 'primaryMetricKey'
      : key.includes('researchMetadataRequired') ? 'validityNotes'
      : 'form';
    setErrors({ [field]: t(key) });
    return false;
  };

  const handleSave = () => {
    if (!validate()) return;
    run(() => {
      const def = addCustomTest(buildInput());
      setTimeout(() => router.replace(APP_ROUTES.performanceLabTest(def.key)), 600);
    });
  };

  const categoryOptions = TESTING_CATEGORIES;

  return (
    <FeatureScrollScreen title={t('testingCenter.custom.title')}>
      <SuccessBanner message={t('testingCenter.custom.saved')} visible={success} />

      <FormSection title={t('testingCenter.custom.basicTitle')} subtitle={t('testingCenter.custom.basicSubtitle')}>
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

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setShowAdvanced((value) => !value)}
        style={{ marginTop: theme.spacing.md, paddingVertical: theme.spacing.sm, flexDirection: flexRow(true), alignItems: 'center' }}
      >
        <Ionicons name={showAdvanced ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.primary} />
        <Text style={[type.body, { color: theme.colors.primary, marginStart: 8, fontWeight: '600' }]}>
          {t('testingCenter.custom.advancedTitle')}
        </Text>
      </TouchableOpacity>

      {showAdvanced ? (
        <FormSection title={t('testingCenter.custom.advancedTitle')} subtitle={t('testingCenter.custom.advancedSubtitle')}>
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: 8 }]}>
            {t('testingCenter.custom.categoryLabel')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {categoryOptions.map((cat) => (
              <Button
                key={cat.id}
                title={t(cat.nameKey)}
                size="small"
                variant={categoryId === cat.id ? 'secondary' : 'outline'}
                onPress={() => setCategoryId(cat.id as TestCategoryId)}
              />
            ))}
          </ScrollView>

          <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>
            {t('testingCenter.custom.evidenceTierLabel')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {ADVANCED_EVIDENCE_TIERS.map((tier) => (
              <Button
                key={tier}
                title={t(`testingCenter.library.evidenceTier.${tier}`)}
                size="small"
                variant={evidenceTier === tier ? 'secondary' : 'outline'}
                onPress={() => setEvidenceTier(tier)}
              />
            ))}
          </ScrollView>

          <Input
            label={t('testingCenter.custom.primaryMetricKey')}
            value={primaryMetricKey}
            onChangeText={setPrimaryMetricKey}
            containerStyle={{ marginTop: 12 }}
            error={errors.primaryMetricKey}
            placeholder={t('testingCenter.custom.primaryMetricKeyHint')}
          />
        </FormSection>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setShowResearch((value) => !value)}
        style={{ marginTop: theme.spacing.md, paddingVertical: theme.spacing.sm, flexDirection: flexRow(true), alignItems: 'center' }}
      >
        <Ionicons name={showResearch ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.primary} />
        <Text style={[type.body, { color: theme.colors.primary, marginStart: 8, fontWeight: '600' }]}>
          {t('testingCenter.custom.researchTitle')}
        </Text>
      </TouchableOpacity>

      {showResearch ? (
        <FormSection title={t('testingCenter.custom.researchTitle')} subtitle={t('testingCenter.custom.researchSubtitle')}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {RESEARCH_EVIDENCE_TIERS.map((tier) => (
              <Button
                key={tier}
                title={t(`testingCenter.library.evidenceTier.${tier}`)}
                size="small"
                variant={evidenceTier === tier ? 'secondary' : 'outline'}
                onPress={() => setEvidenceTier(tier)}
              />
            ))}
          </ScrollView>
          <Input
            label={t('testingCenter.custom.validityNotes')}
            value={validityNotes}
            onChangeText={setValidityNotes}
            multiline
            containerStyle={{ marginTop: 12 }}
            style={{ minHeight: 72, textAlignVertical: 'top' }}
            error={errors.validityNotes}
          />
          <Input
            label={t('testingCenter.custom.reliabilityNotes')}
            value={reliabilityNotes}
            onChangeText={setReliabilityNotes}
            multiline
            containerStyle={{ marginTop: 12 }}
            style={{ minHeight: 72, textAlignVertical: 'top' }}
          />
          <Input
            label={t('testingCenter.custom.citation')}
            value={citation}
            onChangeText={setCitation}
            containerStyle={{ marginTop: 12 }}
          />
        </FormSection>
      ) : null}

      {errors.form ? (
        <Text style={[type.caption, { color: theme.colors.error, marginTop: theme.spacing.sm }]}>{errors.form}</Text>
      ) : null}

      <Button title={loading ? t('common.saving') : t('testingCenter.custom.create')} onPress={handleSave} loading={loading} fullWidth icon="checkmark" />
    </FeatureScrollScreen>
  );
}
