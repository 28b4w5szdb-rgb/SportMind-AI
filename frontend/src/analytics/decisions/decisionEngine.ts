import type { AnalyticsModuleResult, DecisionLevel, DecisionSupportResult } from '../types';

export function generateDecision(modules: AnalyticsModuleResult[]): DecisionSupportResult {
  const readiness = modules.find((m) => m.id === 'readiness')!;
  const fatigue = modules.find((m) => m.id === 'fatigue')!;
  const injury = modules.find((m) => m.id === 'injury_risk')!;
  const load = modules.find((m) => m.id === 'training_load')!;

  let level: DecisionLevel = 'ready_to_train';
  if (injury.score < 45) level = 'medical_evaluation';
  else if (readiness.score < 50 || fatigue.score < 45) level = 'recovery_day';
  else if (load.score > 82 && fatigue.score < 60) level = 'train_reduced_load';

  const map: Record<DecisionLevel, Omit<DecisionSupportResult, 'level' | 'confidence'>> = {
    ready_to_train: {
      titleKey: 'analytics.decision.readyTitle',
      bodyKey: 'analytics.decision.readyBody',
      color: '#10B981',
    },
    train_reduced_load: {
      titleKey: 'analytics.decision.reducedTitle',
      bodyKey: 'analytics.decision.reducedBody',
      color: '#F97316',
    },
    recovery_day: {
      titleKey: 'analytics.decision.recoveryTitle',
      bodyKey: 'analytics.decision.recoveryBody',
      color: '#0EA5E9',
    },
    medical_evaluation: {
      titleKey: 'analytics.decision.medicalTitle',
      bodyKey: 'analytics.decision.medicalBody',
      color: '#EF4444',
    },
  };

  const confidence = Math.round((readiness.score + injury.score + fatigue.score) / 3);

  return { level, confidence, ...map[level] };
}
