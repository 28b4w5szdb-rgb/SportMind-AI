import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { Card } from '@/src/components/common/Card';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useFormAction } from '@/src/hooks/useFormAction';
import { computeAthleteAnalytics, getAffectedModules, ANALYTICS_MODULES } from '@/src/analytics';
import type { MockPerformanceTest } from '@/src/data/mock/types';

const TEST_TYPES = [
  { key: 'yoyo', unit: 'm', labelEn: 'Yo-Yo IR1', labelAr: 'Yo-Yo IR1' },
  { key: 'sprint30', unit: 's', labelEn: '30m Sprint', labelAr: 'Sprint 30m' },
  { key: 'cmj', unit: 'cm', labelEn: 'CMJ', labelAr: 'CMJ' },
  { key: 'beep', unit: 'level', labelEn: 'Beep Test', labelAr: 'Beep Test' },
] as const;

export default function PerformanceLabEntryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const addTest = useMockStore((s) => s.addTest);
  const { loading, success, run } = useFormAction();

  const [athleteId, setAthleteId] = useState(athletes[0]?.id ?? '');
  const [testKey, setTestKey] = useState<(typeof TEST_TYPES)[number]['key']>('yoyo');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ athlete?: string; value?: string; date?: string }>({});
  const [impactPreview, setImpactPreview] = useState<{ before: number; after: number; recKey?: string } | null>(null);

  const selectedTest = TEST_TYPES.find((tt) => tt.key === testKey)!;
  const athlete = athletes.find((a) => a.id === athleteId);

  const athleteTests = useMemo(() => {
    if (!athleteId) return [];
    return tests.filter((tst) => tst.athlete_id === athleteId);
  }, [tests, athleteId]);

  const currentAnalytics = useMemo(() => {
    if (!athlete) return null;
    return computeAthleteAnalytics({ athlete, tests: athleteTests });
  }, [athlete, athleteTests]);

  const affectedModules = useMemo(() => getAffectedModules(testKey), [testKey]);

  const projectedAnalytics = useMemo(() => {
    if (!athlete || !value.trim() || Number.isNaN(Number(value))) return null;
    const simulated: MockPerformanceTest = {
      id: 'preview',
      athlete_id: athlete.id,
      athlete_name: `${athlete.first_name} ${athlete.last_name}`,
      test_type: t(`features.lab.testTypes.${testKey}`),
      test_type_key: testKey,
      value: Number(value),
      unit: selectedTest.unit,
      date,
    };
    return computeAthleteAnalytics({ athlete, tests: [...athleteTests, simulated] });
  }, [athlete, athleteTests, value, testKey, date, selectedTest.unit, t]);

  const validate = () => {
    const next: typeof errors = {};
    if (!athleteId || !athlete) next.athlete = isRTL ? 'اختر لاعباً' : 'Select an athlete';
    if (!value.trim() || Number.isNaN(Number(value))) next.value = isRTL ? 'أدخل قيمة صالحة' : 'Enter a valid result value';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) next.date = isRTL ? 'استخدم YYYY-MM-DD' : 'Use YYYY-MM-DD format';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate() || !athlete || !currentAnalytics) return;
    run(() => {
      addTest({
        athlete_id: athlete.id,
        athlete_name: `${athlete.first_name} ${athlete.last_name}`,
        test_type: t(`features.lab.testTypes.${testKey}`),
        test_type_key: testKey,
        value: Number(value),
        unit: selectedTest.unit,
        date,
        notes: notes.trim() || undefined,
      });
      const afterScore = projectedAnalytics?.overall.score ?? currentAnalytics.overall.score;
      setImpactPreview({
        before: currentAnalytics.overall.score,
        after: afterScore,
        recKey: projectedAnalytics?.recommendations[0]?.bodyKey ?? currentAnalytics.recommendations[0]?.bodyKey,
      });
      setTimeout(() => router.replace(APP_ROUTES.performanceLabHistory), 2200);
    });
  };

  return (
    <FeatureScrollScreen title={t('features.lab.entryTitle')}>
      <SuccessBanner message={t('features.lab.saved')} visible={success} />

      {impactPreview && success && (
        <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, borderColor: theme.colors.success, borderWidth: 1 }}>
          <Text style={[type.label, { color: theme.colors.success, textAlign: textAlign('start') }]}>
            {isRTL ? 'معاينة تأثير التحليلات' : 'Analytics impact preview'}
          </Text>
          <Text style={[type.body, { color: theme.colors.text, marginTop: theme.spacing[2], textAlign: textAlign('start') }]}>
            {isRTL
              ? `النتيجة الإجمالية: ${impactPreview.before} → ${impactPreview.after}/1000`
              : `Overall score: ${impactPreview.before} → ${impactPreview.after}/1000`}
          </Text>
          {impactPreview.recKey ? (
            <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: theme.spacing[2], textAlign: textAlign('start') }]}>
              {t(impactPreview.recKey)}
            </Text>
          ) : null}
        </Card>
      )}

      <FormSection title={t('features.lab.selectAthlete')} subtitle={isRTL ? 'من سجّل الاختبار؟' : 'Who is being tested?'}>
        {athletes.length === 0 ? (
          <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
            {t('athletes.empty.description')}
          </Text>
        ) : (
          <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
            {athletes.map((a) => {
              const active = athleteId === a.id;
              return (
                <Button
                  key={a.id}
                  title={`${a.first_name} ${a.last_name}`}
                  onPress={() => {
                    setAthleteId(a.id);
                    setErrors((e) => ({ ...e, athlete: undefined }));
                  }}
                  variant={active ? 'primary' : 'outline'}
                  size="small"
                />
              );
            })}
          </View>
        )}
        {errors.athlete ? <Text style={[type.caption, { color: theme.colors.error, marginTop: 8 }]}>{errors.athlete}</Text> : null}
      </FormSection>

      <FormSection title={t('features.lab.testType')} subtitle={isRTL ? 'اختر بروتوكول الاختبار' : 'Choose the test protocol'}>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
          {TEST_TYPES.map((tt) => {
            const active = testKey === tt.key;
            return (
              <Button
                key={tt.key}
                title={isRTL ? tt.labelAr : tt.labelEn}
                onPress={() => setTestKey(tt.key)}
                variant={active ? 'secondary' : 'outline'}
                size="small"
              />
            );
          })}
        </View>
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing[3], textAlign: textAlign('start') }]}>
          {isRTL ? 'الوحدات المتأثرة: ' : 'Affected modules: '}
          {affectedModules
            .map((id) => {
              const mod = ANALYTICS_MODULES.find((m) => m.id === id);
              return mod ? t(mod.labelKey) : id;
            })
            .join(' · ')}
        </Text>
      </FormSection>

      {projectedAnalytics && currentAnalytics && value.trim() && (
        <FormSection title={isRTL ? 'معاينة التأثير' : 'Impact preview'} subtitle={isRTL ? 'تقدير قبل الحفظ' : 'Estimated before save'}>
          <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
            <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('start') }]}>
              {isRTL
                ? `النتيجة: ${currentAnalytics.overall.score} → ${projectedAnalytics.overall.score}/1000`
                : `Score: ${currentAnalytics.overall.score} → ${projectedAnalytics.overall.score}/1000`}
            </Text>
            {projectedAnalytics.recommendations[0] ? (
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 8, textAlign: textAlign('start') }]}>
                {t(projectedAnalytics.recommendations[0].bodyKey)}
              </Text>
            ) : null}
          </Card>
        </FormSection>
      )}

      <FormSection title={isRTL ? 'النتائج' : 'Results'} subtitle={`${selectedTest.unit} · ${date}`}>
        <Input
          label={`${t('features.lab.value')} (${selectedTest.unit})`}
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
          onChangeText={(v) => {
            setDate(v);
            setErrors((e) => ({ ...e, date: undefined }));
          }}
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
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />
      </FormSection>

      <Button
        title={loading ? t('common.saving') : t('common.save')}
        onPress={handleSave}
        loading={loading}
        disabled={loading || athletes.length === 0}
        fullWidth
        icon="checkmark"
      />
    </FeatureScrollScreen>
  );
}
