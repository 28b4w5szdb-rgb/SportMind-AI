/**
 * Stable mock-store hooks — avoid derived arrays/objects inside Zustand selectors.
 */

import { useMemo } from 'react';

import type { AiMessage } from './ai-coach';
import { useMockStore } from './store';
import type { MockAthlete, MockPerformanceTest, MockReport, MockResearchProject, MockTeam } from './types';

const EMPTY_MESSAGES: AiMessage[] = [];
const EMPTY_TESTS: MockPerformanceTest[] = [];
const EMPTY_ATHLETES: MockAthlete[] = [];

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

export function useReportById(id: string | undefined): MockReport | undefined {
  return useMockStore((s) => (id ? s.reports.find((r) => r.id === id) : undefined));
}

export function useResearchById(id: string | undefined): MockResearchProject | undefined {
  return useMockStore((s) => (id ? s.research.find((p) => p.id === id) : undefined));
}

export function useTeamById(id: string | undefined): MockTeam | undefined {
  return useMockStore((s) => (id ? s.teams.find((t) => t.id === id) : undefined));
}

export function useTestById(id: string | undefined): MockPerformanceTest | undefined {
  return useMockStore((s) => (id ? s.tests.find((t) => t.id === id) : undefined));
}

export function useTeamRoster(team: MockTeam | undefined): MockAthlete[] {
  const athletes = useMockStore((s) => s.athletes);
  return useMemo(() => {
    if (!team || team.athlete_ids.length === 0) return EMPTY_ATHLETES;
    const roster = team.athlete_ids
      .map((aid) => athletes.find((a) => a.id === aid))
      .filter((a): a is MockAthlete => Boolean(a));
    return roster.length > 0 ? roster : EMPTY_ATHLETES;
  }, [athletes, team]);
}

export function useTestsForTeam(team: MockTeam | undefined): MockPerformanceTest[] {
  const tests = useMockStore((s) => s.tests);
  return useMemo(() => {
    if (!team || team.athlete_ids.length === 0) return EMPTY_TESTS;
    const ids = new Set(team.athlete_ids);
    const filtered = tests.filter((t) => ids.has(t.athlete_id));
    return filtered.length > 0 ? filtered : EMPTY_TESTS;
  }, [tests, team]);
}
