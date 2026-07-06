import type { MockReportSections } from '@/src/data/mock/types';
import type { ReportPreviewBlock, ReportSectionId } from '../types';
import { REPORT_SECTION_OPTIONS } from '../constants';

type SectionExtractor = (sections: MockReportSections) => string | undefined;

const SECTION_EXTRACTORS: Record<ReportSectionId, SectionExtractor> = {
  athlete_profile: (s) => s.athlete_summary,
  kpi: (s) => s.kpi_summary,
  charts: (s) => [s.strengths, s.weaknesses].filter(Boolean).join('\n\n'),
  performance_analytics: (s) => [s.overall_score, s.performance_tests].filter(Boolean).join('\n\n'),
  recovery: (s) =>
    [s.training_summary, s.training_compliance_summary].filter(Boolean).join('\n\n') ||
    s.kpi_summary,
  nutrition: (s) =>
    [s.nutrition_summary, s.nutrition_hydration_status, s.nutrition_body_comp_trend, s.nutrition_recommendations]
      .filter(Boolean)
      .join('\n\n'),
  training_load: (s) => [s.training_summary, s.training_compliance_summary].filter(Boolean).join('\n\n'),
  wearables: (s) => s.wearable_summary,
  laboratory: (s) => s.performance_tests,
  injury: (s) => [s.injury_summary, s.rtp_status, s.prevention_recommendations].filter(Boolean).join('\n\n'),
  ai_interpretation: (s) => s.ai_insights,
  ssid: (s) =>
    [s.ssid_interpretation, s.ssid_decision, s.ssid_recommendations].filter(Boolean).join('\n\n'),
  recommendations: (s) => s.recommendations,
  training_decision: (s) => s.decision_support ?? s.ssid_decision,
  references: (s) => s.ssid_reference,
};

const TEAM_SECTION_EXTRACTORS: Partial<Record<ReportSectionId, SectionExtractor>> = {
  athlete_profile: (s) => s.team_overview,
  kpi: (s) => s.team_rankings,
  charts: (s) => s.team_position_analysis,
  performance_analytics: (s) => s.team_overview,
  recovery: (s) => s.team_risk_players,
  ai_interpretation: (s) => s.team_recommendations,
  recommendations: (s) => s.team_recommendations,
  training_decision: (s) => s.team_recommendations,
};

function sectionIcon(id: ReportSectionId): ReportPreviewBlock['icon'] {
  const meta = REPORT_SECTION_OPTIONS.find((o) => o.id === id);
  return (meta?.icon ?? 'document-text') as ReportPreviewBlock['icon'];
}

function sectionLabelKey(id: ReportSectionId): string {
  return REPORT_SECTION_OPTIONS.find((o) => o.id === id)?.labelKey ?? `reportBuilder.sections.${id}`;
}

export function buildPreviewBlocks(
  sectionOrder: ReportSectionId[],
  sections: MockReportSections,
  isTeam: boolean,
  fallback: string
): ReportPreviewBlock[] {
  return sectionOrder
    .map((id) => {
      const extractor = (isTeam && TEAM_SECTION_EXTRACTORS[id]) || SECTION_EXTRACTORS[id];
      const body = extractor(sections)?.trim() || fallback;
      return {
        id,
        titleKey: sectionLabelKey(id),
        body,
        icon: sectionIcon(id),
      };
    })
    .filter((block) => block.body.length > 0);
}

export function sectionsToMockReportSections(
  sectionOrder: ReportSectionId[],
  allSections: MockReportSections
): MockReportSections {
  const result: MockReportSections = {
    athlete_summary: '',
    performance_tests: '',
    ai_insights: '',
    recommendations: '',
  };

  for (const id of sectionOrder) {
    const body = SECTION_EXTRACTORS[id](allSections)?.trim();
    if (!body) continue;

    switch (id) {
      case 'athlete_profile':
        result.athlete_summary = body;
        break;
      case 'kpi':
        result.kpi_summary = body;
        break;
      case 'charts':
        result.strengths = allSections.strengths;
        result.weaknesses = allSections.weaknesses;
        break;
      case 'performance_analytics':
        result.overall_score = allSections.overall_score;
        result.performance_tests = allSections.performance_tests;
        break;
      case 'recovery':
        result.training_summary = allSections.training_summary;
        break;
      case 'nutrition':
        Object.assign(result, {
          nutrition_summary: allSections.nutrition_summary,
          nutrition_hydration_status: allSections.nutrition_hydration_status,
          nutrition_body_comp_trend: allSections.nutrition_body_comp_trend,
          nutrition_recommendations: allSections.nutrition_recommendations,
        });
        break;
      case 'training_load':
        result.training_summary = allSections.training_summary;
        result.training_compliance_summary = allSections.training_compliance_summary;
        break;
      case 'wearables':
        result.wearable_summary = body;
        break;
      case 'laboratory':
        result.performance_tests = body;
        break;
      case 'injury':
        Object.assign(result, {
          injury_summary: allSections.injury_summary,
          rtp_status: allSections.rtp_status,
          prevention_recommendations: allSections.prevention_recommendations,
        });
        break;
      case 'ai_interpretation':
        result.ai_insights = body;
        break;
      case 'ssid':
        Object.assign(result, {
          ssid_interpretation: allSections.ssid_interpretation,
          ssid_decision: allSections.ssid_decision,
          ssid_recommendations: allSections.ssid_recommendations,
        });
        break;
      case 'recommendations':
        result.recommendations = body;
        break;
      case 'training_decision':
        result.decision_support = body;
        break;
      case 'references':
        result.ssid_reference = body;
        break;
      default:
        break;
    }
  }

  if (!result.athlete_summary && allSections.athlete_summary) {
    result.athlete_summary = allSections.athlete_summary;
  }
  if (!result.ai_insights && allSections.ai_insights) {
    result.ai_insights = allSections.ai_insights;
  }
  if (!result.recommendations && allSections.recommendations) {
    result.recommendations = allSections.recommendations;
  }
  if (!result.performance_tests && allSections.performance_tests) {
    result.performance_tests = allSections.performance_tests;
  }

  return result;
}

export function mapBuilderTypeToMockType(
  type: import('../types').ReportBuilderTypeId
): 'athlete' | 'team' | 'session' | 'custom' {
  if (type === 'athlete') return 'athlete';
  if (type === 'team') return 'team';
  return 'custom';
}
