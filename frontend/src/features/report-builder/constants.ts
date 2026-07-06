import type { ReportBuilderStep, ReportBuilderTypeId, ReportSectionId, ReportThemeId, ReportThemeStyle } from './types';

export const REPORT_BUILDER_STEPS: ReportBuilderStep[] = ['type', 'scope', 'dateRange', 'sections', 'theme', 'preview'];

export const REPORT_TYPE_OPTIONS: Array<{ id: ReportBuilderTypeId; icon: string; labelKey: string; descriptionKey: string; defaultScope: 'athlete' | 'team' }> = [
  { id: 'athlete', icon: 'person', labelKey: 'reportBuilder.types.athlete', descriptionKey: 'reportBuilder.types.athleteDesc', defaultScope: 'athlete' },
  { id: 'team', icon: 'people', labelKey: 'reportBuilder.types.team', descriptionKey: 'reportBuilder.types.teamDesc', defaultScope: 'team' },
  { id: 'performance', icon: 'analytics', labelKey: 'reportBuilder.types.performance', descriptionKey: 'reportBuilder.types.performanceDesc', defaultScope: 'athlete' },
  { id: 'recovery', icon: 'heart', labelKey: 'reportBuilder.types.recovery', descriptionKey: 'reportBuilder.types.recoveryDesc', defaultScope: 'athlete' },
  { id: 'nutrition', icon: 'nutrition', labelKey: 'reportBuilder.types.nutrition', descriptionKey: 'reportBuilder.types.nutritionDesc', defaultScope: 'athlete' },
  { id: 'wearables', icon: 'watch', labelKey: 'reportBuilder.types.wearables', descriptionKey: 'reportBuilder.types.wearablesDesc', defaultScope: 'athlete' },
  { id: 'sports_medicine', icon: 'medkit', labelKey: 'reportBuilder.types.sportsMedicine', descriptionKey: 'reportBuilder.types.sportsMedicineDesc', defaultScope: 'athlete' },
  { id: 'laboratory', icon: 'flask', labelKey: 'reportBuilder.types.laboratory', descriptionKey: 'reportBuilder.types.laboratoryDesc', defaultScope: 'athlete' },
  { id: 'comparison', icon: 'git-compare', labelKey: 'reportBuilder.types.comparison', descriptionKey: 'reportBuilder.types.comparisonDesc', defaultScope: 'team' },
  { id: 'research', icon: 'library', labelKey: 'reportBuilder.types.research', descriptionKey: 'reportBuilder.types.researchDesc', defaultScope: 'team' },
];

export const REPORT_SECTION_OPTIONS: Array<{ id: ReportSectionId; labelKey: string; icon: string }> = [
  { id: 'athlete_profile', labelKey: 'reportBuilder.sections.athleteProfile', icon: 'person' },
  { id: 'kpi', labelKey: 'reportBuilder.sections.kpi', icon: 'stats-chart' },
  { id: 'charts', labelKey: 'reportBuilder.sections.charts', icon: 'bar-chart' },
  { id: 'performance_analytics', labelKey: 'reportBuilder.sections.performanceAnalytics', icon: 'analytics' },
  { id: 'recovery', labelKey: 'reportBuilder.sections.recovery', icon: 'heart' },
  { id: 'nutrition', labelKey: 'reportBuilder.sections.nutrition', icon: 'nutrition' },
  { id: 'training_load', labelKey: 'reportBuilder.sections.trainingLoad', icon: 'barbell' },
  { id: 'wearables', labelKey: 'reportBuilder.sections.wearables', icon: 'watch' },
  { id: 'laboratory', labelKey: 'reportBuilder.sections.laboratory', icon: 'flask' },
  { id: 'injury', labelKey: 'reportBuilder.sections.injury', icon: 'medkit' },
  { id: 'ai_interpretation', labelKey: 'reportBuilder.sections.aiInterpretation', icon: 'sparkles' },
  { id: 'ssid', labelKey: 'reportBuilder.sections.ssid', icon: 'school' },
  { id: 'recommendations', labelKey: 'reportBuilder.sections.recommendations', icon: 'bulb' },
  { id: 'training_decision', labelKey: 'reportBuilder.sections.trainingDecision', icon: 'flag' },
  { id: 'references', labelKey: 'reportBuilder.sections.references', icon: 'library' },
];

export const DEFAULT_SECTIONS_BY_TYPE: Record<ReportBuilderTypeId, ReportSectionId[]> = {
  athlete: ['athlete_profile', 'kpi', 'performance_analytics', 'ai_interpretation', 'recommendations', 'training_decision'],
  team: ['kpi', 'charts', 'performance_analytics', 'ai_interpretation', 'recommendations'],
  performance: ['athlete_profile', 'kpi', 'charts', 'performance_analytics', 'laboratory', 'ssid', 'recommendations'],
  recovery: ['athlete_profile', 'kpi', 'recovery', 'wearables', 'recommendations', 'training_decision'],
  nutrition: ['athlete_profile', 'nutrition', 'charts', 'recommendations', 'references'],
  wearables: ['athlete_profile', 'wearables', 'recovery', 'kpi', 'ai_interpretation'],
  sports_medicine: ['athlete_profile', 'injury', 'recovery', 'ssid', 'training_decision', 'references'],
  laboratory: ['laboratory', 'performance_analytics', 'charts', 'ssid', 'references'],
  comparison: ['kpi', 'charts', 'performance_analytics', 'ai_interpretation', 'recommendations'],
  research: ['athlete_profile', 'ssid', 'references', 'ai_interpretation', 'recommendations'],
};

export const REPORT_THEMES: ReportThemeStyle[] = [
  { id: 'professional', labelKey: 'reportBuilder.themes.professional', accent: '#0066FF', accentSoft: '#0066FF18', headerText: '#FFFFFF', descriptionKey: 'reportBuilder.themes.professionalDesc' },
  { id: 'university', labelKey: 'reportBuilder.themes.university', accent: '#6366F1', accentSoft: '#6366F118', headerText: '#FFFFFF', descriptionKey: 'reportBuilder.themes.universityDesc' },
  { id: 'medical', labelKey: 'reportBuilder.themes.medical', accent: '#0D9488', accentSoft: '#0D948818', headerText: '#FFFFFF', descriptionKey: 'reportBuilder.themes.medicalDesc' },
  { id: 'club', labelKey: 'reportBuilder.themes.club', accent: '#8B5CF6', accentSoft: '#8B5CF618', headerText: '#FFFFFF', descriptionKey: 'reportBuilder.themes.clubDesc' },
  { id: 'research', labelKey: 'reportBuilder.themes.research', accent: '#64748B', accentSoft: '#64748B18', headerText: '#FFFFFF', descriptionKey: 'reportBuilder.themes.researchDesc' },
];

export function getThemeById(id: ReportThemeId): ReportThemeStyle {
  return REPORT_THEMES.find((t) => t.id === id) ?? REPORT_THEMES[0];
}

export function stepLabelKey(step: ReportBuilderStep): string {
  return `reportBuilder.steps.${step}`;
}
