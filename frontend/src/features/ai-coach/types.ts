import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { AiAgentId } from '@/src/data/mock/ai-coach';

export type AiContextScope = 'athlete' | 'team';

export type AiModuleId =
  | 'performance'
  | 'testing'
  | 'recovery'
  | 'nutrition'
  | 'injury'
  | 'training'
  | 'wearables'
  | 'reports';

export type StructuredSectionId =
  | 'summary'
  | 'indicators'
  | 'interpretation'
  | 'decision'
  | 'recommendations'
  | 'nextActions'
  | 'confidence'
  | 'references';

export interface StructuredAiSection {
  id: StructuredSectionId;
  titleKey: string;
  items: string[];
}

export interface StructuredAiResponse {
  sections: StructuredAiSection[];
  confidence?: number;
  referencePlaceholder?: string;
}

export interface AiModule {
  id: AiModuleId;
  icon: ComponentProps<typeof Ionicons>['name'];
  labelKey: string;
  color: string;
  agentId: AiAgentId;
}

export interface AiActionCard {
  id: string;
  labelKey: string;
  promptKey: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  color: string;
  moduleId: AiModuleId;
}

export interface AiRoleExample {
  id: string;
  roleKey: string;
  promptKey: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}

export interface MockResponseResult {
  content: string;
  structured?: StructuredAiResponse;
  sdssRecommendations?: import('@/src/cloud/scientific/sdss/models/SdssRecommendation').ScientificRecommendation[];
}
