import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type CockpitSectionId =
  | 'overview'
  | 'performance'
  | 'training'
  | 'recovery'
  | 'nutrition'
  | 'medical'
  | 'wearables'
  | 'ai'
  | 'timeline';

export interface CockpitNavItem {
  id: CockpitSectionId;
  labelKey: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}

export const COCKPIT_NAV_ITEMS: CockpitNavItem[] = [
  { id: 'overview', labelKey: 'athleteWorkspace.cockpit.nav.overview', icon: 'grid-outline' },
  { id: 'performance', labelKey: 'athleteWorkspace.cockpit.nav.performance', icon: 'analytics-outline' },
  { id: 'training', labelKey: 'athleteWorkspace.cockpit.nav.training', icon: 'barbell-outline' },
  { id: 'recovery', labelKey: 'athleteWorkspace.cockpit.nav.recovery', icon: 'heart-outline' },
  { id: 'nutrition', labelKey: 'athleteWorkspace.cockpit.nav.nutrition', icon: 'nutrition-outline' },
  { id: 'medical', labelKey: 'athleteWorkspace.cockpit.nav.medical', icon: 'medkit-outline' },
  { id: 'wearables', labelKey: 'athleteWorkspace.cockpit.nav.wearables', icon: 'watch-outline' },
  { id: 'ai', labelKey: 'athleteWorkspace.cockpit.nav.ai', icon: 'sparkles-outline' },
  { id: 'timeline', labelKey: 'athleteWorkspace.cockpit.nav.timeline', icon: 'time-outline' },
];
