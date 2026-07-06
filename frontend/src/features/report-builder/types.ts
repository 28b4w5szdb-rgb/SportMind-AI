import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type ReportBuilderStep =
  | 'type'
  | 'scope'
  | 'dateRange'
  | 'sections'
  | 'theme'
  | 'preview';

export type ReportBuilderTypeId =
  | 'athlete'
  | 'team'
  | 'performance'
  | 'recovery'
  | 'nutrition'
  | 'wearables'
  | 'sports_medicine'
  | 'laboratory'
  | 'comparison'
  | 'research';

export type ReportScope = 'athlete' | 'team';

export type ReportSectionId =
  | 'athlete_profile'
  | 'kpi'
  | 'charts'
  | 'performance_analytics'
  | 'recovery'
  | 'nutrition'
  | 'training_load'
  | 'wearables'
  | 'laboratory'
  | 'injury'
  | 'ai_interpretation'
  | 'ssid'
  | 'recommendations'
  | 'training_decision'
  | 'references';

export type ReportThemeId = 'professional' | 'university' | 'medical' | 'club' | 'research';

export interface ReportBuilderConfig {
  title: string;
  reportType: ReportBuilderTypeId;
  scope: ReportScope;
  athleteId: string | null;
  teamId: string | null;
  dateFrom: string;
  dateTo: string;
  sectionOrder: ReportSectionId[];
  theme: ReportThemeId;
}

export interface ReportPreviewBlock {
  id: ReportSectionId;
  titleKey: string;
  body: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}

export interface ReportThemeStyle {
  id: ReportThemeId;
  labelKey: string;
  accent: string;
  accentSoft: string;
  headerText: string;
  descriptionKey: string;
}
