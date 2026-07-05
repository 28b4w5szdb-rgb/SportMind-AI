/**
 * Stable mock-store hooks — avoid derived arrays/objects inside Zustand selectors.
 * Zustand compares selector output with Object.is; new []/filter results cause infinite re-renders.
 */

import { useMemo } from 'react';

import type { AiMessage } from './ai-coach';
import { useMockStore } from './store';
import type { MockAthlete, MockPerformanceTest } from './types';

const EMPTY_MESSAGES: AiMessage[] = [];
const EMPTY_TESTS: MockPerformanceTest[] = [];

export function useAthleteById(id: string | undefined): MockAthlete | undefined {
  return useMockStore((s) => (id ? s.athletes.find((a) => a.id === id) : undefined));
}

export function useTestsForAthlete(athleteId: string | undefined): MockPerformanceTest[] {
  const tests = useMockStore((s) => s.tests);
  return useMemo(() => {
    if (!athleteId) return EMPTY_TESTS;
    const filtered = tests.filter((t) => t.athlete_id === athleteId);
    return filtered.length > 0 ? filtered : EMPTY_TESTS;
  }, [tests, athleteId]);
}

export function useActiveConversationMessages(): AiMessage[] {
  const activeConversationId = useMockStore((s) => s.activeConversationId);
  const conversations = useMockStore((s) => s.conversations);
  return useMemo(() => {
    if (!activeConversationId) return EMPTY_MESSAGES;
    return conversations.find((c) => c.id === activeConversationId)?.messages ?? EMPTY_MESSAGES;
  }, [activeConversationId, conversations]);
}
