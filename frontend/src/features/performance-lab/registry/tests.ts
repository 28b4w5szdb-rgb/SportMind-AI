import type { TestDefinition } from '../types';
import { SPEED_TESTS } from './catalog/speed.catalog';
import { STRENGTH_TESTS } from './catalog/strength.catalog';
import { ENDURANCE_TESTS } from './catalog/endurance.catalog';
import { AGILITY_TESTS } from './catalog/agility.catalog';
import { POWER_TESTS } from './catalog/power.catalog';
import { FLEXIBILITY_TESTS } from './catalog/flexibility.catalog';
import { BALANCE_TESTS } from './catalog/balance.catalog';
import { BODY_COMPOSITION_TESTS } from './catalog/bodyComposition.catalog';
import { REACTION_TIME_TESTS } from './catalog/reactionTime.catalog';
import { NEUROMUSCULAR_TESTS } from './catalog/neuromuscular.catalog';
import { FUNCTIONAL_MOVEMENT_TESTS } from './catalog/functionalMovement.catalog';
import { CUSTOM_TESTS } from './catalog/custom.catalog';

/** Built-in Sports Science Test Library — add catalog files only to scale. */
export const TEST_REGISTRY: TestDefinition[] = [
  ...SPEED_TESTS,
  ...STRENGTH_TESTS,
  ...ENDURANCE_TESTS,
  ...AGILITY_TESTS,
  ...POWER_TESTS,
  ...FLEXIBILITY_TESTS,
  ...BALANCE_TESTS,
  ...BODY_COMPOSITION_TESTS,
  ...REACTION_TIME_TESTS,
  ...NEUROMUSCULAR_TESTS,
  ...FUNCTIONAL_MOVEMENT_TESTS,
  ...CUSTOM_TESTS,
];

const baseMap = new Map(TEST_REGISTRY.map((t) => [t.key, t]));

export function getMergedRegistry(customTests: TestDefinition[] = []): TestDefinition[] {
  if (customTests.length === 0) return TEST_REGISTRY;
  return [...TEST_REGISTRY, ...customTests];
}

export function getTestDefinition(key: string, customTests: TestDefinition[] = []): TestDefinition | undefined {
  const custom = customTests.find((t) => t.key === key);
  if (custom) return custom;
  return baseMap.get(key);
}

export function getTestsByCategory(categoryId: string, customTests: TestDefinition[] = []): TestDefinition[] {
  return getMergedRegistry(customTests).filter((t) => t.categoryId === categoryId);
}

export function getFeaturedTestForCategory(categoryId: string, customTests: TestDefinition[] = []): TestDefinition | undefined {
  return getMergedRegistry(customTests).find((t) => t.categoryId === categoryId && t.featured);
}

export function countTestsInCategory(categoryId: string, customTests: TestDefinition[] = []): number {
  return getTestsByCategory(categoryId, customTests).length;
}

export function buildModuleImpactMap(customTests: TestDefinition[] = []): Record<string, TestDefinition['affectedModules']> {
  return Object.fromEntries(getMergedRegistry(customTests).map((t) => [t.key, t.affectedModules]));
}

export function getTotalTestCount(customTests: TestDefinition[] = []): number {
  return getMergedRegistry(customTests).length;
}
