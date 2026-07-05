import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { AnalyticsModuleId } from '@/src/analytics/types';

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

export interface TestReferenceValues {
  elite: number;
  good: number;
  average: number;
  lowerIsBetter?: boolean;
}

/** Registry entry — add hundreds of tests by extending TEST_REGISTRY only. */
export interface TestDefinition {
  key: string;
  categoryId: TestCategoryId;
  icon: ComponentProps<typeof Ionicons>['name'];
  nameKey: string;
  descriptionKey: string;
  protocolKey: string;
  equipmentKey: string;
  unit: string;
  referenceValues: TestReferenceValues;
  affectedModules: AnalyticsModuleId[];
  aiRecommendationKey: string;
  /** Primary demo test shown for its category card. */
  featured: boolean;
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
