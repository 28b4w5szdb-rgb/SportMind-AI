/** Performance Lab mock data — backward-compatible re-exports from Testing Center registry. */

import {
  TESTING_CATEGORIES,
  TEST_REGISTRY,
  getTestsByCategory,
  getBenchmarkNormsFromRegistry,
  benchmarkRating,
} from '@/src/features/performance-lab';

export { benchmarkRating };
export { KNOWLEDGE_ARTICLES } from './labKnowledge';

export const LAB_CATEGORIES = TESTING_CATEGORIES.map((cat) => ({
  id: cat.id,
  icon: cat.icon,
  labelEn: cat.nameKey,
  labelAr: cat.nameKey,
  color: cat.color,
  tests: getTestsByCategory(cat.id).map((t) => t.key),
}));

export const BENCHMARK_NORMS = getBenchmarkNormsFromRegistry(TEST_REGISTRY);

export { TEST_REGISTRY };
