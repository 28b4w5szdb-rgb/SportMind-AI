/**
 * SportMind AI - App Constants
 */

export const APP_CONFIG = {
  name: 'SportMind AI',
  version: '1.0.0',
  description: 'Professional AI-powered Sports Science Platform',
};

// Module identifiers
export const MODULES = {
  DASHBOARD: 'dashboard',
  AI_COACH: 'ai-coach',
  ATHLETES: 'athletes',
  PERFORMANCE_LAB: 'performance-lab',
  CALCULATOR: 'calculator',
  RESEARCH: 'research',
  REPORTS: 'reports',
  TEAM_MANAGEMENT: 'team-management',
  SETTINGS: 'settings',
} as const;

// Tab icons mapping
export const TAB_ICONS = {
  dashboard: 'home',
  'ai-coach': 'brain',
  athletes: 'people',
  'performance-lab': 'stats-chart',
  more: 'grid',
} as const;

// Feature flags
export const FEATURES = {
  AI_COACH_ENABLED: true,
  REPORTS_EXPORT_ENABLED: true,
  TEAM_MANAGEMENT_ENABLED: true,
  DARK_MODE_ENABLED: true,
};
