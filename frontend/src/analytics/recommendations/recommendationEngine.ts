import type { AnalyticsModuleResult, RecommendationItem } from '../types';

interface RecommendationRule {
  id: string;
  moduleId: AnalyticsModuleResult['id'];
  when: (mod: AnalyticsModuleResult) => boolean;
  priority: RecommendationItem['priority'];
  titleKey: string;
  bodyKey: string;
  actionKey: string;
}

const RULES: RecommendationRule[] = [
  {
    id: 'flexibility_low',
    moduleId: 'flexibility',
    when: (m) => m.score < 55,
    priority: 'medium',
    titleKey: 'analytics.rec.flexibilityTitle',
    bodyKey: 'analytics.rec.flexibility',
    actionKey: 'analytics.rec.actionMobility',
  },
  {
    id: 'fatigue_high',
    moduleId: 'fatigue',
    when: (m) => m.score < 50,
    priority: 'high',
    titleKey: 'analytics.rec.fatigueTitle',
    bodyKey: 'analytics.rec.fatigue',
    actionKey: 'analytics.rec.actionReduceLoad',
  },
  {
    id: 'recovery_low',
    moduleId: 'recovery',
    when: (m) => m.score < 55,
    priority: 'high',
    titleKey: 'analytics.rec.recoveryTitle',
    bodyKey: 'analytics.rec.recovery',
    actionKey: 'analytics.rec.actionRecoveryProtocol',
  },
  {
    id: 'injury_high',
    moduleId: 'injury_risk',
    when: (m) => m.score < 50,
    priority: 'high',
    titleKey: 'analytics.rec.injuryTitle',
    bodyKey: 'analytics.rec.injury',
    actionKey: 'analytics.rec.actionPreventive',
  },
  {
    id: 'strength_low',
    moduleId: 'strength',
    when: (m) => m.score < 60,
    priority: 'medium',
    titleKey: 'analytics.rec.strengthTitle',
    bodyKey: 'analytics.rec.strength',
    actionKey: 'analytics.rec.actionStrength',
  },
  {
    id: 'compliance_low',
    moduleId: 'training_compliance',
    when: (m) => m.score < 60,
    priority: 'low',
    titleKey: 'analytics.rec.complianceTitle',
    bodyKey: 'analytics.rec.compliance',
    actionKey: 'analytics.rec.actionCompliance',
  },
];

export function generateRecommendations(modules: AnalyticsModuleResult[]): RecommendationItem[] {
  const moduleMap = new Map(modules.map((m) => [m.id, m]));
  return RULES.filter((rule) => {
    const mod = moduleMap.get(rule.moduleId);
    return mod && rule.when(mod);
  }).map((rule) => ({
    id: rule.id,
    moduleId: rule.moduleId,
    priority: rule.priority,
    titleKey: rule.titleKey,
    bodyKey: rule.bodyKey,
    actionKey: rule.actionKey,
  }));
}
