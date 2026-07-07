import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMockStore } from '@/src/data/mock/store';
import {
  buildDefaultReportSections,
  buildTeamIntelligenceReportSections,
} from '@/src/utils/moduleHelpers';
import type { MockReportSections } from '@/src/data/mock/types';
import { DEFAULT_SECTIONS_BY_TYPE, REPORT_TYPE_OPTIONS } from '../constants';
import type {
  ReportBuilderConfig,
  ReportBuilderStep,
  ReportBuilderTypeId,
  ReportPreviewBlock,
  ReportScope,
  ReportSectionId,
  ReportThemeId,
} from '../types';
import { buildPreviewBlocks, mapBuilderTypeToMockType } from '../utils/reportContent';
import { buildReportSubtitle } from '../utils/reportMeta';
import { useScientificReport } from '@/src/features/scientific-report';

const DEFAULT_DATE_TO = new Date().toISOString().slice(0, 10);
const DEFAULT_DATE_FROM = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);

function defaultTitle(type: ReportBuilderTypeId, isRTL: boolean): string {
  const labels: Record<ReportBuilderTypeId, { en: string; ar: string }> = {
    athlete: { en: 'Athlete Performance Report', ar: 'تقرير أداء اللاعب' },
    team: { en: 'Team Intelligence Report', ar: 'تقرير ذكاء الفريق' },
    performance: { en: 'Performance Analysis Report', ar: 'تقرير تحليل الأداء' },
    recovery: { en: 'Recovery & Readiness Report', ar: 'تقرير التعافي والجاهزية' },
    nutrition: { en: 'Nutrition Science Report', ar: 'تقرير علوم التغذية' },
    wearables: { en: 'Wearables Integration Report', ar: 'تقرير الأجهزة القابلة للارتداء' },
    sports_medicine: { en: 'Sports Medicine Report', ar: 'تقرير الطب الرياضي' },
    laboratory: { en: 'Laboratory Assessment Report', ar: 'تقرير التقييم المخبري' },
    comparison: { en: 'Comparative Analysis Report', ar: 'تقرير التحليل المقارن' },
    research: { en: 'Research & Evidence Report', ar: 'تقرير البحث والأدلة' },
  };
  return isRTL ? labels[type].ar : labels[type].en;
}

export function useReportBuilderState(initial?: {
  athleteId?: string | null;
  reportType?: ReportBuilderTypeId;
  sectionOrder?: ReportSectionId[];
  scientificSectionOrder?: ReportBuilderConfig['scientificSectionOrder'];
  scope?: ReportScope;
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const initType = initial?.reportType ?? 'athlete';
  const [step, setStep] = useState<ReportBuilderStep>('type');
  const [config, setConfig] = useState<ReportBuilderConfig>(() => ({
    title: defaultTitle(initType, isRTL),
    reportType: initType,
    scope: initial?.scope ?? 'athlete',
    athleteId: initial?.athleteId ?? null,
    teamId: null,
    dateFrom: DEFAULT_DATE_FROM,
    dateTo: DEFAULT_DATE_TO,
    sectionOrder: initial?.sectionOrder ? [...initial.sectionOrder] : [...DEFAULT_SECTIONS_BY_TYPE[initType]],
    theme: 'professional',
    scientificSectionOrder: initial?.scientificSectionOrder,
  }));

  const setReportType = useCallback(
    (reportType: ReportBuilderTypeId) => {
      const meta = REPORT_TYPE_OPTIONS.find((o) => o.id === reportType);
      setConfig((prev) => ({
        ...prev,
        reportType,
        scope: meta?.defaultScope ?? prev.scope,
        title: defaultTitle(reportType, isRTL),
        sectionOrder: [...DEFAULT_SECTIONS_BY_TYPE[reportType]],
      }));
    },
    [isRTL]
  );

  const setScope = useCallback((scope: ReportScope) => {
    setConfig((prev) => ({ ...prev, scope }));
  }, []);

  const toggleSection = useCallback((id: ReportSectionId) => {
    setConfig((prev) => {
      const has = prev.sectionOrder.includes(id);
      return {
        ...prev,
        sectionOrder: has ? prev.sectionOrder.filter((s) => s !== id) : [...prev.sectionOrder, id],
      };
    });
  }, []);

  const moveSection = useCallback((id: ReportSectionId, direction: 'up' | 'down') => {
    setConfig((prev) => {
      const idx = prev.sectionOrder.indexOf(id);
      if (idx < 0) return prev;
      const next = [...prev.sectionOrder];
      const swap = direction === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...prev, sectionOrder: next };
    });
  }, []);

  const nextStep = useCallback(() => {
    setStep((s) => {
      const order: ReportBuilderStep[] = ['type', 'scope', 'dateRange', 'sections', 'theme', 'preview'];
      const idx = order.indexOf(s);
      return order[Math.min(idx + 1, order.length - 1)];
    });
  }, []);

  const prevStep = useCallback(() => {
    setStep((s) => {
      const order: ReportBuilderStep[] = ['type', 'scope', 'dateRange', 'sections', 'theme', 'preview'];
      const idx = order.indexOf(s);
      return order[Math.max(idx - 1, 0)];
    });
  }, []);

  const goToStep = useCallback((target: ReportBuilderStep) => setStep(target), []);

  const patchConfig = useCallback((patch: Partial<ReportBuilderConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const setTheme = useCallback((theme: ReportThemeId) => {
    setConfig((prev) => ({ ...prev, theme }));
  }, []);

  return {
    step,
    config,
    setReportType,
    setScope,
    toggleSection,
    moveSection,
    nextStep,
    prevStep,
    goToStep,
    patchConfig,
    setTheme,
  };
}

export function useReportBuilderContent(config: ReportBuilderConfig) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const injuries = useMockStore((s) => s.injuryRecords);
  const checkIns = useMockStore((s) => s.dailyCheckIns);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);
  const wearableConnections = useMockStore((s) => s.wearableConnections);
  const wearableRecords = useMockStore((s) => s.wearableRecords);

  const athlete = useMemo(
    () => athletes.find((a) => a.id === config.athleteId),
    [athletes, config.athleteId]
  );

  const filteredTests = useMemo(() => {
    const from = config.dateFrom;
    const to = config.dateTo;
    return tests.filter((test) => {
      const d = test.date.slice(0, 10);
      const athleteMatch = config.scope === 'team' || !config.athleteId || test.athlete_id === config.athleteId;
      return athleteMatch && d >= from && d <= to;
    });
  }, [tests, config.athleteId, config.dateFrom, config.dateTo, config.scope]);

  const mockType = mapBuilderTypeToMockType(config.reportType);
  const isTeam = config.scope === 'team' || mockType === 'team';
  const { scientificReport, legacySections } = useScientificReport(config);

  const allSections: MockReportSections = useMemo(() => {
    if (legacySections && !isTeam) {
      return legacySections;
    }

    const summary = config.title;
    const checkIn = checkIns.find((c) => c.athlete_id === config.athleteId);

    if (isTeam) {
      const teamSections = buildTeamIntelligenceReportSections(
        athletes,
        filteredTests,
        injuries,
        checkIns,
        trainingPlans,
        nutritionLogs,
        bodyCompositionRecords,
        nutritionGoalSettings,
        t,
        isRTL
      );
      return {
        athlete_summary: teamSections.team_overview ?? '',
        performance_tests: teamSections.team_rankings ?? '',
        ai_insights: teamSections.team_recommendations ?? '',
        recommendations: teamSections.team_recommendations ?? '',
        ...teamSections,
      };
    }

    return buildDefaultReportSections(athlete, filteredTests, summary, isRTL, t, {
      injuries,
      checkIn,
      trainingPlans,
      nutritionLogs,
      bodyCompositionRecords,
      nutritionGoalSettings,
      wearableConnections,
      wearableRecords,
    });
  }, [
    athlete,
    athletes,
    bodyCompositionRecords,
    checkIns,
    config.athleteId,
    config.title,
    filteredTests,
    injuries,
    isRTL,
    isTeam,
    legacySections,
    nutritionGoalSettings,
    nutritionLogs,
    t,
    trainingPlans,
    wearableConnections,
    wearableRecords,
  ]);

  const previewBlocks: ReportPreviewBlock[] = useMemo(() => {
    const fallback = t('reportBuilder.preview.noContent');
    return buildPreviewBlocks(config.sectionOrder, allSections, isTeam, fallback);
  }, [allSections, config.sectionOrder, isTeam, t]);

  const subtitle = useMemo(() => {
    const name = athlete ? `${athlete.first_name} ${athlete.last_name}` : undefined;
    return buildReportSubtitle(config, name, t);
  }, [athlete, config, t]);

  return { allSections, previewBlocks, athlete, subtitle, mockType, isTeam, scientificReport };
}
