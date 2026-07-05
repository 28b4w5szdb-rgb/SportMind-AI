import type { TestingCategoryDefinition } from '../types';

export const TESTING_CATEGORIES: TestingCategoryDefinition[] = [
  { id: 'speed', icon: 'flash', color: '#F97316', nameKey: 'testingCenter.categories.speed.name', descriptionKey: 'testingCenter.categories.speed.description' },
  { id: 'strength', icon: 'barbell', color: '#0066FF', nameKey: 'testingCenter.categories.strength.name', descriptionKey: 'testingCenter.categories.strength.description' },
  { id: 'endurance', icon: 'heart', color: '#EF4444', nameKey: 'testingCenter.categories.endurance.name', descriptionKey: 'testingCenter.categories.endurance.description' },
  { id: 'agility', icon: 'shuffle', color: '#8B5CF6', nameKey: 'testingCenter.categories.agility.name', descriptionKey: 'testingCenter.categories.agility.description' },
  { id: 'power', icon: 'rocket', color: '#10B981', nameKey: 'testingCenter.categories.power.name', descriptionKey: 'testingCenter.categories.power.description' },
  { id: 'flexibility', icon: 'body', color: '#EC4899', nameKey: 'testingCenter.categories.flexibility.name', descriptionKey: 'testingCenter.categories.flexibility.description' },
  { id: 'balance', icon: 'git-commit', color: '#0D9488', nameKey: 'testingCenter.categories.balance.name', descriptionKey: 'testingCenter.categories.balance.description' },
  { id: 'body_composition', icon: 'scale', color: '#6366F1', nameKey: 'testingCenter.categories.bodyComposition.name', descriptionKey: 'testingCenter.categories.bodyComposition.description' },
  { id: 'reaction_time', icon: 'timer', color: '#EAB308', nameKey: 'testingCenter.categories.reactionTime.name', descriptionKey: 'testingCenter.categories.reactionTime.description' },
  { id: 'neuromuscular', icon: 'pulse', color: '#14B8A6', nameKey: 'testingCenter.categories.neuromuscular.name', descriptionKey: 'testingCenter.categories.neuromuscular.description' },
  { id: 'functional_movement', icon: 'accessibility', color: '#A855F7', nameKey: 'testingCenter.categories.functionalMovement.name', descriptionKey: 'testingCenter.categories.functionalMovement.description' },
  { id: 'custom', icon: 'create', color: '#64748B', nameKey: 'testingCenter.categories.custom.name', descriptionKey: 'testingCenter.categories.custom.description' },
];

export function getCategoryById(id: string): TestingCategoryDefinition | undefined {
  return TESTING_CATEGORIES.find((c) => c.id === id);
}
