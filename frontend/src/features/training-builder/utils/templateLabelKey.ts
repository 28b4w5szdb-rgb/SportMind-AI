import type { TrainingTemplateId } from '../types';

const LABEL_KEYS: Record<TrainingTemplateId, string> = {
  strength: 'trainingBuilder.templates.strength',
  hypertrophy: 'trainingBuilder.templates.hypertrophy',
  power: 'trainingBuilder.templates.power',
  speed: 'trainingBuilder.templates.speed',
  acceleration: 'trainingBuilder.templates.acceleration',
  agility: 'trainingBuilder.templates.agility',
  endurance: 'trainingBuilder.templates.endurance',
  aerobic: 'trainingBuilder.templates.aerobic',
  anaerobic: 'trainingBuilder.templates.anaerobic',
  recovery: 'trainingBuilder.templates.recovery',
  mobility: 'trainingBuilder.templates.mobility',
  injury_prevention: 'trainingBuilder.templates.injuryPrevention',
  return_to_play: 'trainingBuilder.templates.returnToPlay',
};

export function templateLabelKey(id: TrainingTemplateId): string {
  return LABEL_KEYS[id];
}
