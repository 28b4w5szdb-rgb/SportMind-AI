import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { Chip } from '@/src/components/common/Chip';
import { Input } from '@/src/components/common/Input';
import { FormSection } from '@/src/components/common/FormSection';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useFormAction } from '@/src/hooks/useFormAction';
import { REPORT_SECTION_OPTIONS, REPORT_THEMES, REPORT_TYPE_OPTIONS } from '../constants';
import { useReportBuilderState, useReportBuilderContent } from '../hooks/useReportBuilder';
import { sectionsToMockReportSections } from '../utils/reportContent';
import { configToBuilderMeta } from '../utils/reportMeta';
import { WizardStepIndicator } from './wizard/WizardStepIndicator';
import { ReportPreview } from './ReportPreview';

export function ReportBuilderWizard() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const addReport = useMockStore((s) => s.addReport);
  const { loading, success, run } = useFormAction();

  const {
    step,
    config,
    setReportType,
    setScope,
    toggleSection,
    moveSection,
    nextStep,
    prevStep,
    patchConfig,
    setTheme,
  } = useReportBuilderState();

  const { allSections, previewBlocks, subtitle, mockType } = useReportBuilderContent(config);

  useEffect(() => {
    if (!config.athleteId && athletes[0]?.id) {
      patchConfig({ athleteId: athletes[0].id });
    }
  }, [athletes, config.athleteId, patchConfig]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 'type':
        return Boolean(config.reportType);
      case 'scope':
        if (config.scope === 'team') return true;
        return Boolean(config.athleteId);
      case 'dateRange':
        return config.dateFrom <= config.dateTo;
      case 'sections':
        return config.sectionOrder.length > 0;
      case 'theme':
        return Boolean(config.theme);
      default:
        return true;
    }
  }, [step, config]);

  const handleSave = () => {
    if (!config.title.trim()) return;
    run(() => {
      const sections = sectionsToMockReportSections(config.sectionOrder, allSections);
      const summary = sections.athlete_summary?.slice(0, 160) || config.title;
      const report = addReport({
        title: config.title.trim(),
        type: mockType,
        summary,
        athlete_id: config.scope === 'athlete' ? config.athleteId ?? undefined : undefined,
        sections,
        builder_meta: configToBuilderMeta(config),
      });
      setTimeout(() => router.replace(APP_ROUTES.reportDetail(report.id)), 600);
    });
  };

  const renderStep = () => {
    switch (step) {
      case 'type':
        return (
          <FormSection title={t('reportBuilder.steps.type')} subtitle={t('reportBuilder.typeSubtitle')}>
            <View style={{ gap: theme.spacing.sm }}>
              {REPORT_TYPE_OPTIONS.map((option) => {
                const selected = config.reportType === option.id;
                return (
                  <TouchableOpacity key={option.id} activeOpacity={0.85} onPress={() => setReportType(option.id)}>
                    <Card
                      variant={selected ? 'elevated' : 'filled'}
                      padding="md"
                      style={{
                        borderRadius: theme.borderRadius.xl,
                        borderWidth: selected ? 2 : 0,
                        borderColor: selected ? theme.colors.primary : 'transparent',
                      }}
                    >
                      <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: theme.borderRadius.lg,
                            backgroundColor: theme.colors.primary + '18',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name={option.icon as keyof typeof Ionicons.glyphMap} size={22} color={theme.colors.primary} />
                        </View>
                        <View style={{ flex: 1, marginStart: theme.spacing.md }}>
                          <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t(option.labelKey)}</Text>
                          <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                            {t(option.descriptionKey)}
                          </Text>
                        </View>
                        {selected ? <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} /> : null}
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FormSection>
        );

      case 'scope':
        return (
          <>
            <FormSection title={t('reportBuilder.steps.scope')} subtitle={t('reportBuilder.scopeSubtitle')}>
              <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
                <Chip
                  label={t('reportBuilder.scope.athlete')}
                  selected={config.scope === 'athlete'}
                  onPress={() => setScope('athlete')}
                  icon="person"
                  style={{ flex: 1 }}
                />
                <Chip
                  label={t('reportBuilder.scope.team')}
                  selected={config.scope === 'team'}
                  onPress={() => setScope('team')}
                  icon="people"
                  style={{ flex: 1 }}
                />
              </View>
              <Input
                label={t('features.reports.reportTitle')}
                value={config.title}
                onChangeText={(title) => patchConfig({ title })}
              />
            </FormSection>
            {config.scope === 'athlete' && athletes.length > 0 ? (
              <FormSection title={t('features.reports.selectAthlete')} subtitle={t('features.reports.selectAthleteHint')}>
                <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
                  {athletes.map((a) => (
                    <Chip
                      key={a.id}
                      label={`${a.first_name} ${a.last_name}`}
                      selected={config.athleteId === a.id}
                      onPress={() => patchConfig({ athleteId: a.id })}
                    />
                  ))}
                </View>
              </FormSection>
            ) : null}
            {config.scope === 'team' ? (
              <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
                <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
                  {t('reportBuilder.scope.teamHint')}
                </Text>
              </Card>
            ) : null}
          </>
        );

      case 'dateRange':
        return (
          <FormSection title={t('reportBuilder.steps.dateRange')} subtitle={t('reportBuilder.dateRangeSubtitle')}>
            <Input
              label={t('reportBuilder.dateFrom')}
              value={config.dateFrom}
              onChangeText={(dateFrom) => patchConfig({ dateFrom })}
              placeholder="YYYY-MM-DD"
            />
            <Input
              label={t('reportBuilder.dateTo')}
              value={config.dateTo}
              onChangeText={(dateTo) => patchConfig({ dateTo })}
              placeholder="YYYY-MM-DD"
              containerStyle={{ marginTop: theme.spacing.md }}
            />
          </FormSection>
        );

      case 'sections':
        return (
          <>
            <FormSection title={t('reportBuilder.steps.sections')} subtitle={t('reportBuilder.sectionsSubtitle')}>
              <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
                {REPORT_SECTION_OPTIONS.map((section) => {
                  const selected = config.sectionOrder.includes(section.id);
                  return (
                    <Chip
                      key={section.id}
                      label={t(section.labelKey)}
                      selected={selected}
                      onPress={() => toggleSection(section.id)}
                      icon={section.icon as keyof typeof Ionicons.glyphMap}
                    />
                  );
                })}
              </View>
            </FormSection>
            {config.sectionOrder.length > 0 ? (
              <FormSection title={t('reportBuilder.sectionOrder')} subtitle={t('reportBuilder.sectionOrderHint')}>
                {config.sectionOrder.map((id, index) => {
                  const meta = REPORT_SECTION_OPTIONS.find((s) => s.id === id);
                  if (!meta) return null;
                  return (
                    <Card key={id} variant="filled" padding="md" style={{ marginBottom: theme.spacing.sm, borderRadius: theme.borderRadius.lg }}>
                      <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                        <Text style={[type.captionBold, { color: theme.colors.textTertiary, width: 24 }]}>{index + 1}</Text>
                        <Text style={[type.bodySm, { flex: 1, color: theme.colors.text, textAlign: textAlign('start') }]}>{t(meta.labelKey)}</Text>
                        <TouchableOpacity onPress={() => moveSection(id, 'up')} disabled={index === 0} style={{ padding: 6, opacity: index === 0 ? 0.3 : 1 }}>
                          <Ionicons name="chevron-up" size={18} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => moveSection(id, 'down')}
                          disabled={index === config.sectionOrder.length - 1}
                          style={{ padding: 6, opacity: index === config.sectionOrder.length - 1 ? 0.3 : 1 }}
                        >
                          <Ionicons name="chevron-down" size={18} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </Card>
                  );
                })}
              </FormSection>
            ) : null}
          </>
        );

      case 'theme':
        return (
          <FormSection title={t('reportBuilder.steps.theme')} subtitle={t('reportBuilder.themeSubtitle')}>
            <View style={{ gap: theme.spacing.sm }}>
              {REPORT_THEMES.map((item) => {
                const selected = config.theme === item.id;
                return (
                  <TouchableOpacity key={item.id} activeOpacity={0.85} onPress={() => setTheme(item.id)}>
                    <Card
                      variant={selected ? 'elevated' : 'filled'}
                      padding="md"
                      style={{
                        borderRadius: theme.borderRadius.xl,
                        borderWidth: selected ? 2 : 0,
                        borderColor: selected ? item.accent : 'transparent',
                      }}
                    >
                      <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                        <View style={{ width: 40, height: 40, borderRadius: theme.borderRadius.lg, backgroundColor: item.accent }} />
                        <View style={{ flex: 1, marginStart: theme.spacing.md }}>
                          <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t(item.labelKey)}</Text>
                          <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                            {t(item.descriptionKey)}
                          </Text>
                        </View>
                        {selected ? <Ionicons name="checkmark-circle" size={22} color={item.accent} /> : null}
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FormSection>
        );

      case 'preview':
        return (
          <ReportPreview
            config={config}
            blocks={previewBlocks}
            subtitle={subtitle}
            sections={allSections}
            onSave={handleSave}
            saving={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FeatureScrollScreen title={t('reportBuilder.title')} subtitle={t('reportBuilder.subtitle')}>
      <SuccessBanner message={t('features.reports.saved')} visible={success} />
      <WizardStepIndicator currentStep={step} />
      {renderStep()}

      {step !== 'preview' ? (
        <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          {step !== 'type' ? (
            <Button title={t('common.back')} onPress={prevStep} variant="outline" style={{ flex: 1 }} icon="arrow-back" />
          ) : null}
          <Button
            title={t('common.next')}
            onPress={nextStep}
            disabled={!canProceed}
            style={{ flex: 1 }}
            icon="arrow-forward"
          />
        </View>
      ) : (
        <Button title={t('common.back')} onPress={prevStep} variant="outline" fullWidth style={{ marginTop: theme.spacing.md }} />
      )}
    </FeatureScrollScreen>
  );
}
