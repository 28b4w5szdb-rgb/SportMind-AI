import type { AiActionCard, AiModule, AiRoleExample } from './types';

export const AI_MODULES: AiModule[] = [
  { id: 'performance', icon: 'analytics', labelKey: 'aiCoach.modules.performance', color: '#0066FF', agentId: 'performance' },
  { id: 'testing', icon: 'flask', labelKey: 'aiCoach.modules.testing', color: '#6366F1', agentId: 'performance' },
  { id: 'recovery', icon: 'heart', labelKey: 'aiCoach.modules.recovery', color: '#10B981', agentId: 'recovery' },
  { id: 'nutrition', icon: 'nutrition', labelKey: 'aiCoach.modules.nutrition', color: '#F97316', agentId: 'nutrition' },
  { id: 'injury', icon: 'medkit', labelKey: 'aiCoach.modules.injury', color: '#EF4444', agentId: 'performance' },
  { id: 'training', icon: 'barbell', labelKey: 'aiCoach.modules.training', color: '#8B5CF6', agentId: 'planning' },
  { id: 'wearables', icon: 'watch', labelKey: 'aiCoach.modules.wearables', color: '#0EA5E9', agentId: 'recovery' },
  { id: 'reports', icon: 'document-text', labelKey: 'aiCoach.modules.reports', color: '#64748B', agentId: 'planning' },
];

export const AI_ACTION_CARDS: AiActionCard[] = [
  { id: 'readiness', labelKey: 'aiCoach.actions.readiness', promptKey: 'aiCoach.prompts.readiness', icon: 'flash', color: '#10B981', moduleId: 'performance' },
  { id: 'injury', labelKey: 'aiCoach.actions.injuryRisk', promptKey: 'aiCoach.prompts.injuryRisk', icon: 'medkit', color: '#EF4444', moduleId: 'injury' },
  { id: 'load', labelKey: 'aiCoach.actions.trainingLoad', promptKey: 'aiCoach.prompts.trainingLoad', icon: 'barbell', color: '#8B5CF6', moduleId: 'training' },
  { id: 'recovery', labelKey: 'aiCoach.actions.recoverySession', promptKey: 'aiCoach.prompts.recoverySession', icon: 'heart', color: '#0D9488', moduleId: 'recovery' },
  { id: 'nutrition', labelKey: 'aiCoach.actions.nutritionRec', promptKey: 'aiCoach.prompts.nutritionRec', icon: 'nutrition', color: '#F97316', moduleId: 'nutrition' },
  { id: 'report', labelKey: 'aiCoach.actions.generateReport', promptKey: 'aiCoach.prompts.generateReport', icon: 'document-text', color: '#64748B', moduleId: 'reports' },
  { id: 'compare', labelKey: 'aiCoach.actions.compareAthletes', promptKey: 'aiCoach.prompts.compareAthletes', icon: 'people', color: '#0066FF', moduleId: 'performance' },
  { id: 'focus', labelKey: 'aiCoach.actions.weeklyFocus', promptKey: 'aiCoach.prompts.weeklyFocus', icon: 'flag', color: '#6366F1', moduleId: 'training' },
];

export const AI_ROLE_EXAMPLES: AiRoleExample[] = [
  { id: 'coach', roleKey: 'aiCoach.roles.coach', promptKey: 'aiCoach.rolePrompts.coach', icon: 'fitness' },
  { id: 'researcher', roleKey: 'aiCoach.roles.researcher', promptKey: 'aiCoach.rolePrompts.researcher', icon: 'library' },
  { id: 'physio', roleKey: 'aiCoach.roles.physiologist', promptKey: 'aiCoach.rolePrompts.physiologist', icon: 'pulse' },
  { id: 'medicine', roleKey: 'aiCoach.roles.sportsMedicine', promptKey: 'aiCoach.rolePrompts.sportsMedicine', icon: 'medkit' },
];
