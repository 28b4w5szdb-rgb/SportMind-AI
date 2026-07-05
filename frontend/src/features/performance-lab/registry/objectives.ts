import type { TestObjective } from '../types';

export const TEST_OBJECTIVES: Array<{ id: TestObjective; labelKey: string }> = [
  { id: 'linear_speed', labelKey: 'testingCenter.objectives.linearSpeed' },
  { id: 'max_force', labelKey: 'testingCenter.objectives.maxForce' },
  { id: 'aerobic_capacity', labelKey: 'testingCenter.objectives.aerobicCapacity' },
  { id: 'change_of_direction', labelKey: 'testingCenter.objectives.changeOfDirection' },
  { id: 'explosive_power', labelKey: 'testingCenter.objectives.explosivePower' },
  { id: 'range_of_motion', labelKey: 'testingCenter.objectives.rangeOfMotion' },
  { id: 'stability', labelKey: 'testingCenter.objectives.stability' },
  { id: 'body_composition', labelKey: 'testingCenter.objectives.bodyComposition' },
  { id: 'reaction_cognition', labelKey: 'testingCenter.objectives.reactionCognition' },
  { id: 'neuromuscular', labelKey: 'testingCenter.objectives.neuromuscular' },
  { id: 'movement_quality', labelKey: 'testingCenter.objectives.movementQuality' },
  { id: 'custom_metric', labelKey: 'testingCenter.objectives.customMetric' },
];

export function getObjectiveLabelKey(objective: TestObjective): string {
  return TEST_OBJECTIVES.find((o) => o.id === objective)?.labelKey ?? 'testingCenter.objectives.customMetric';
}
