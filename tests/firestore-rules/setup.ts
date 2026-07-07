/**
 * Shared Firestore rules test environment (Phase 6C.10.1).
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

export const RULES_TEST_PROJECT_ID = 'sportmind-rules-test';

const RULES_PATH = resolve(process.cwd(), 'firestore.rules');

function emulatorHost(): string {
  const fromEnv = process.env.FIRESTORE_EMULATOR_HOST;
  if (fromEnv?.includes(':')) {
    return fromEnv.split(':')[0] ?? '127.0.0.1';
  }
  return '127.0.0.1';
}

function emulatorPort(): number {
  const fromEnv = process.env.FIRESTORE_EMULATOR_HOST;
  if (fromEnv?.includes(':')) {
    return Number(fromEnv.split(':')[1] ?? 8080);
  }
  return 8080;
}

let testEnv: RulesTestEnvironment | undefined;

export async function initRulesTestEnv(): Promise<RulesTestEnvironment> {
  if (testEnv) return testEnv;
  testEnv = await initializeTestEnvironment({
    projectId: RULES_TEST_PROJECT_ID,
    firestore: {
      rules: readFileSync(RULES_PATH, 'utf8'),
      host: emulatorHost(),
      port: emulatorPort(),
    },
  });
  return testEnv;
}

export function getRulesTestEnv(): RulesTestEnvironment {
  if (!testEnv) {
    throw new Error('Rules test environment not initialized — call initRulesTestEnv() first');
  }
  return testEnv;
}

export async function cleanupRulesTestEnv(): Promise<void> {
  if (testEnv) {
    await testEnv.cleanup();
    testEnv = undefined;
  }
}

export async function clearRulesFirestore(): Promise<void> {
  await getRulesTestEnv().clearFirestore();
}
