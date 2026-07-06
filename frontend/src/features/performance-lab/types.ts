import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { AnalyticsModuleId, TrendDirection } from '@/src/analytics/types';

export type TestCategoryId =
  | 'speed'
  | 'strength'
  | 'endurance'
  | 'agility'
  | 'power'
  | 'flexibility'
  | 'balance'
  | 'body_composition'
  | 'reaction_time'
  | 'neuromuscular'
  | 'functional_movement'
  | 'custom';

export type PerformanceLevel = 'elite' | 'good' | 'average' | 'below';

/** Filter taxonomy — scalable objective tags for library search. */
export type TestObjective =
  | 'linear_speed'
  | 'max_force'
  | 'aerobic_capacity'
  | 'change_of_direction'
  | 'explosive_power'
  | 'range_of_motion'
  | 'stability'
  | 'body_composition'
  | 'reaction_cognition'
  | 'neuromuscular'
  | 'movement_quality'
  | 'custom_metric';

export interface BilingualText {
  en: string;
  ar: string;
}

export interface TestReferenceValues {
  elite: number;
  good: number;
  average: number;
  lowerIsBetter?: boolean;
}

export interface TestCopyBundle {
  name: BilingualText;
  description: BilingualText;
  purpose: BilingualText;
  equipment: BilingualText;
  protocol: BilingualText;
  scoring: BilingualText;
  interpretation: BilingualText;
  aiRec: BilingualText;
  notes?: BilingualText;
}

/** Structured testing knowledge — Part 6 requirements. */
export interface TestKnowledgeBundle {
  whatMeasures: BilingualText;
  whyImportant: BilingualText;
  howPerformed: BilingualText;
  whatAffects: BilingualText;
  commonMistakes: BilingualText;
}

/** Registry entry — extend catalog rows only to scale to 300+ tests. */
export interface TestDefinition {
  key: string;
  categoryId: TestCategoryId;
  icon: ComponentProps<typeof Ionicons>['name'];
  unit: string;
  referenceValues: TestReferenceValues;
  affectedModules: AnalyticsModuleId[];
  analyticsWeight: number;
  expectedTrend: TrendDirection;
  objective: TestObjective;
  featured: boolean;
  isCustom?: boolean;
  /** Days until suggested retest (category default if omitted). */
  retestIntervalDays: number;
  /** Structured knowledge surfaced in Testing Center UI. */
  knowledge: TestKnowledgeBundle;
  /** Optional SSID metric bridge for body-comp tests mapped to calculator metrics. */
  ssidMetricId?: import('@/src/features/ssid-engine').SsidMetricId;
  /** Legacy i18n keys — optional when copy bundle is present. */
  nameKey?: string;
  descriptionKey?: string;
  protocolKey?: string;
  equipmentKey?: string;
  aiRecommendationKey?: string;
  copy: TestCopyBundle;
  defaultRecommendationKey?: string;
}

export interface TestingCategoryDefinition {
  id: TestCategoryId;
  icon: ComponentProps<typeof Ionicons>['name'];
  color: string;
  nameKey: string;
  descriptionKey: string;
}

export interface TestAnalyticsImpact {
  beforeScore: number;
  afterScore: number;
  delta: number;
  affectedModules: AnalyticsModuleId[];
  readinessDelta: number;
  fatigueDelta: number;
  loadDelta: number;
  recoveryDelta: number;
  injuryRiskDelta: number;
}

export interface CustomTestInput {
  name: string;
  nameAr?: string;
  unit: string;
  protocol: string;
  protocolAr?: string;
  targetMetric?: string;
  targetMetricAr?: string;
  notes?: string;
  notesAr?: string;
}

export interface TestLibraryFilters {
  query: string;
  categoryId: TestCategoryId | 'all';
  objective: TestObjective | 'all';
  favoritesOnly: boolean;
}
