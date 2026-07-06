import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { ANALYTICS_MODULES } from '@/src/analytics/registry/modules';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useFormAction } from '@/src/hooks/useFormAction';
import {
  computeTestAnalyticsImpact,
  PERFORMANCE_LEVEL_COLORS,
  getTestName,
  getTestText,
  useTestDefinition,
  useTestLibraryActions,
  getObjectiveLabelKey,
  TestKnowledgePanel,
  TestReferencePanel,
  interpretTestWithSsid,
} from '@/src/features/performance-lab';
import { SsidInterpretationView } from '@/src/features/ssid-engine';
import type { MockPerformanceTest } from '@/src/data/mock/types';

export default function TestDetailScreen() {
  const { testKey } = useLocalSearchParams<{ testKey: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const favorites = useMockStore((s) => s.favoriteTestKeys);
  const addTest = useMockStore((s) => s.addTest);
  const { loading, success, run } = useFormAction();
  const { pushRecent, toggleFavorite } = useTestLibraryActions();

  const definition = useTestDefinition(testKey);

  const [athleteId, setAthleteId] = useState(athletes[0]?.id ?? '');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ athlete?: string; value?: string; date?: string }>({});

  const athlete = athletes.find((a) => a.id === athleteId);
  const athleteTests = useMemo(() => tests.filter((tst) => tst.athlete_id === athleteId), [tests, athleteId]);

  const projectedImpact = useMemo(() => {
    if (!athlete || !definition || !value.trim() || Number.isNaN(Number(value))) return null;
    const simulated: MockPerformanceTest = {
      id: 'preview',
      athlete_id: athlete.id,
      athlete_name: `${athlete.first_name} ${athlete.last_name}`,
      test_type: getTestName(definition, isRTL),
      test_type_key: definition.key,
      value: Number(value),
      unit: definition.unit,
      date,
    };
    return computeTestAnalyticsImpact(athlete, athleteTests, simulated);
  }, [athlete, athleteTests, value, definition, date, isRTL]);

  const projectedSsid = useMemo(() => {
    if (!definition || !value.trim() || Number.isNaN(Number(value))) return null;
    return interpretTestWithSsid(definition, Number(value)).ssid;
  }, [definition, value]);

  const projectedLevel = useMemo(() => {
    if (!definition || !value.trim() || Number.isNaN(Number(value))) return null;
    return interpretTestWithSsid(definition, Number(value)).level;
  }, [definition, value]);

  if (!definition) {
    return (
      <FeatureScrollScreen title={t('testingCenter.testNotFound')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  const levelColor = projectedLevel ? PERFORMANCE_LEVEL_COLORS[projectedLevel] : theme.colors.primary;
  const isFavorite = favorites.includes(definition.key);

  const validate = () => {
    const next: typeof errors = {};
    if (!athleteId || !athlete) next.athlete = t('testingCenter.validation.athlete');
    if (!value.trim() || Number.isNaN(Number(value))) next.value = t('testingCenter.validation.value');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) next.date = t('testingCenter.validation.date');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate() || !athlete) return;
    run(() => {
      pushRecent(definition.key);
      const saved = addTest({
        athlete_id: athlete.id,
        athlete_name: `${athlete.first_name} ${athlete.last_name}`,
        test_type: getTestName(definition, isRTL),
        test_type_key: definition.key,
        value: Number(value),
        unit: definition.unit,
        date,
        notes: notes.trim() || undefined,
      });
      setTimeout(() => router.replace(APP_ROUTES.performanceLabResult(saved.id)), 800);
    });
  };

  return (
    <FeatureScrollScreen
      title={getTestName(definition, isRTL)}
      rightAction={{ icon: isFavorite ? 'star' : 'star-outline', onPress: () => toggleFavorite(definition.key) }}
    >
      <SuccessBanner message={t('features.lab.saved')} visible={success} />

      <Card variant="gradient" padding="lg" gradientColors={[levelColor, levelColor + '99']} style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <Ionicons name={definition.icon} size={36} color="#FFF" />
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.h4, { color: '#FFF', textAlign: textAlign('start') }]}>{getTestName(definition, isRTL)}</Text>
            <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.9)', marginTop: 4, textAlign: textAlign('start') }]}>
              {getTestText(definition, 'description', isRTL)}
            </Text>
          </View>
          <Badge label={t('testingCenter.analyticsBadge')} variant="info" />
        </View>
      </Card>

      <TestKnowledgePanel definition={definition} />
      <TestReferencePanel definition={definition} />

      <FormSection title={t('testingCenter.sections.analyticsImpact')}>
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginBottom: 8, textAlign: textAlign('start') }]}>
          {t(getObjectiveLabelKey(definition.objective))}
        </Text>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 6 }}>
          {definition.affectedModules.map((modId) => {
            const mod = ANALYTICS_MODULES.find((m) => m.id === modId);
            return mod ? <Badge key={modId} label={t(mod.labelKey)} variant="neutral" /> : null;
          })}
        </View>
      </FormSection>

      {definition.copy.notes ? (
        <FormSection title={t('features.lab.notes')}>
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{getTestText(definition, 'notes', isRTL)}</Text>
        </FormSection>
      ) : null}

      <FormSection title={t('features.lab.selectAthlete')}>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
          {athletes.map((a) => (
            <Button
              key={a.id}
              title={`${a.first_name} ${a.last_name}`}
              onPress={() => {
                setAthleteId(a.id);
                setErrors((e) => ({ ...e, athlete: undefined }));
              }}
              variant={athleteId === a.id ? 'primary' : 'outline'}
              size="small"
            />
          ))}
        </View>
        {errors.athlete ? <Text style={[type.caption, { color: theme.colors.error, marginTop: 8 }]}>{errors.athlete}</Text> : null}
      </FormSection>

      <FormSection title={t('testingCenter.sections.resultEntry')}>
        <Input
          label={`${t('features.lab.value')} (${definition.unit})`}
          value={value}
          onChangeText={(v) => {
            setValue(v);
            setErrors((e) => ({ ...e, value: undefined }));
          }}
          keyboardType="decimal-pad"
          error={errors.value}
        />
        <Input
          label={t('features.lab.date')}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          containerStyle={{ marginTop: theme.spacing.md }}
          error={errors.date}
        />
        <Input
          label={t('features.lab.notes')}
          value={notes}
          onChangeText={setNotes}
          multiline
          containerStyle={{ marginTop: theme.spacing.md }}
          style={{ minHeight: 72, textAlignVertical: 'top' }}
        />
        {projectedLevel ? (
          <Text style={[type.caption, { color: levelColor, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
            {t('testingCenter.performanceLevel')}: {t(`testingCenter.levels.${projectedLevel}`)}
          </Text>
        ) : null}
      </FormSection>

      {projectedSsid ? (
        <FormSection title={t('ssid.ui.sectionTitle')} subtitle={t('testingCenter.ssidPreviewSubtitle')}>
          <SsidInterpretationView interpretation={projectedSsid} titleOverride={getTestName(definition, isRTL)} compact />
        </FormSection>
      ) : null}

      {projectedImpact ? (
        <FormSection title={t('testingCenter.sections.impactPreview')}>
          <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
            <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('start') }]}>
              {t('analytics.overallScore')}: {projectedImpact.beforeScore} → {projectedImpact.afterScore} ({projectedImpact.delta >= 0 ? '+' : ''}{projectedImpact.delta})
            </Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 6, textAlign: textAlign('start') }]}>
              {t('analytics.kpi.readiness')} {projectedImpact.readinessDelta >= 0 ? '+' : ''}{projectedImpact.readinessDelta}% · {t('analytics.kpi.fatigue')} {projectedImpact.fatigueDelta >= 0 ? '+' : ''}{projectedImpact.fatigueDelta}%
            </Text>
          </Card>
        </FormSection>
      ) : null}

      <Button
        title={loading ? t('common.saving') : t('testingCenter.recordResult')}
        onPress={handleSave}
        loading={loading}
        disabled={loading || athletes.length === 0}
        fullWidth
        icon="checkmark"
      />
    </FeatureScrollScreen>
  );
}
