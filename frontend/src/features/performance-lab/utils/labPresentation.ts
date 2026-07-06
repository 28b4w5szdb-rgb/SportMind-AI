import type { TestCategoryId, TestDefinition } from '../types';

export interface TestProtocolMeta {
  durationKey: string;
  difficultyKey: string;
  validityKey: string;
  reliabilityKey: string;
}

const CATEGORY_PROTOCOL_META: Record<TestCategoryId, TestProtocolMeta> = {
  speed: {
    durationKey: 'performanceLab.protocol.duration.short',
    difficultyKey: 'performanceLab.protocol.difficulty.moderate',
    validityKey: 'performanceLab.protocol.validity.high',
    reliabilityKey: 'performanceLab.protocol.reliability.high',
  },
  strength: {
    durationKey: 'performanceLab.protocol.duration.medium',
    difficultyKey: 'performanceLab.protocol.difficulty.high',
    validityKey: 'performanceLab.protocol.validity.high',
    reliabilityKey: 'performanceLab.protocol.reliability.high',
  },
  endurance: {
    durationKey: 'performanceLab.protocol.duration.long',
    difficultyKey: 'performanceLab.protocol.difficulty.high',
    validityKey: 'performanceLab.protocol.validity.veryHigh',
    reliabilityKey: 'performanceLab.protocol.reliability.high',
  },
  agility: {
    durationKey: 'performanceLab.protocol.duration.short',
    difficultyKey: 'performanceLab.protocol.difficulty.moderate',
    validityKey: 'performanceLab.protocol.validity.high',
    reliabilityKey: 'performanceLab.protocol.reliability.moderate',
  },
  power: {
    durationKey: 'performanceLab.protocol.duration.short',
    difficultyKey: 'performanceLab.protocol.difficulty.moderate',
    validityKey: 'performanceLab.protocol.validity.high',
    reliabilityKey: 'performanceLab.protocol.reliability.high',
  },
  flexibility: {
    durationKey: 'performanceLab.protocol.duration.short',
    difficultyKey: 'performanceLab.protocol.difficulty.low',
    validityKey: 'performanceLab.protocol.validity.moderate',
    reliabilityKey: 'performanceLab.protocol.reliability.moderate',
  },
  balance: {
    durationKey: 'performanceLab.protocol.duration.short',
    difficultyKey: 'performanceLab.protocol.difficulty.low',
    validityKey: 'performanceLab.protocol.validity.moderate',
    reliabilityKey: 'performanceLab.protocol.reliability.moderate',
  },
  body_composition: {
    durationKey: 'performanceLab.protocol.duration.medium',
    difficultyKey: 'performanceLab.protocol.difficulty.low',
    validityKey: 'performanceLab.protocol.validity.high',
    reliabilityKey: 'performanceLab.protocol.reliability.high',
  },
  reaction_time: {
    durationKey: 'performanceLab.protocol.duration.short',
    difficultyKey: 'performanceLab.protocol.difficulty.low',
    validityKey: 'performanceLab.protocol.validity.moderate',
    reliabilityKey: 'performanceLab.protocol.reliability.moderate',
  },
  neuromuscular: {
    durationKey: 'performanceLab.protocol.duration.medium',
    difficultyKey: 'performanceLab.protocol.difficulty.high',
    validityKey: 'performanceLab.protocol.validity.high',
    reliabilityKey: 'performanceLab.protocol.reliability.high',
  },
  functional_movement: {
    durationKey: 'performanceLab.protocol.duration.medium',
    difficultyKey: 'performanceLab.protocol.difficulty.moderate',
    validityKey: 'performanceLab.protocol.validity.moderate',
    reliabilityKey: 'performanceLab.protocol.reliability.moderate',
  },
  custom: {
    durationKey: 'performanceLab.protocol.duration.variable',
    difficultyKey: 'performanceLab.protocol.difficulty.variable',
    validityKey: 'performanceLab.protocol.validity.variable',
    reliabilityKey: 'performanceLab.protocol.reliability.variable',
  },
};

export function getTestProtocolMeta(definition: TestDefinition): TestProtocolMeta {
  return CATEGORY_PROTOCOL_META[definition.categoryId] ?? CATEGORY_PROTOCOL_META.custom;
}

export function levelToPercentile(level: string): number {
  switch (level) {
    case 'elite':
      return 92;
    case 'good':
      return 75;
    case 'average':
      return 50;
    default:
      return 28;
  }
}
