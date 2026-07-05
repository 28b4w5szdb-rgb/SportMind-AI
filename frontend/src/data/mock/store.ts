import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AiAgentId, AiMessage } from './ai-coach';
import type {
  MockAthlete,
  MockCalculationRecord,
  MockPerformanceTest,
  MockReport,
  MockResearchProject,
  MockTeam,
  CalculatorType,
} from './types';
import { computeCalculator } from './calculators';
import {
  SEED_ATHLETES,
  SEED_CALCULATIONS,
  SEED_REPORTS,
  SEED_RESEARCH,
  SEED_TEAMS,
  SEED_TESTS,
} from './seed';

const STORAGE_KEY = '@sportmind/mock-store-v1';

/** Stable empty list for store getters (avoid accidental new [] references). */
const EMPTY_STORE_MESSAGES: AiMessage[] = [];

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export interface StoredConversation {
  id: string;
  title: string;
  agentId: AiAgentId;
  messages: AiMessage[];
  updatedAt: string;
}

export interface MockStore {
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  athletes: MockAthlete[];
  teams: MockTeam[];
  tests: MockPerformanceTest[];
  reports: MockReport[];
  research: MockResearchProject[];
  calculations: MockCalculationRecord[];
  conversations: StoredConversation[];
  activeConversationId: string | null;
  selectedAgent: AiAgentId;

  addAthlete: (input: Omit<MockAthlete, 'id' | 'created_at' | 'tests_count' | 'trend_percent'>) => MockAthlete;
  updateAthlete: (id: string, patch: Partial<MockAthlete>) => void;
  getAthlete: (id: string) => MockAthlete | undefined;

  addTeam: (input: Omit<MockTeam, 'id' | 'created_at'>) => MockTeam;
  addTest: (input: Omit<MockPerformanceTest, 'id'>) => MockPerformanceTest;
  addReport: (input: Omit<MockReport, 'id' | 'created_at' | 'status'>) => MockReport;
  addResearch: (input: Omit<MockResearchProject, 'id' | 'updated_at' | 'progress' | 'status'>) => MockResearchProject;
  runCalculation: (type: CalculatorType, title: string, inputs: Record<string, number>) => MockCalculationRecord;

  setSelectedAgent: (agentId: AiAgentId) => void;
  startNewConversation: () => string;
  setActiveConversation: (id: string) => void;
  getActiveConversation: () => StoredConversation | undefined;
  getActiveMessages: () => AiMessage[];
  setActiveMessages: (messages: AiMessage[]) => void;
  appendActiveMessage: (message: AiMessage) => void;
  touchActiveConversation: () => void;
}

function ensureActiveConversation(get: () => MockStore, set: (partial: Partial<MockStore>) => void): string {
  const state = get();
  if (state.activeConversationId) {
    const exists = state.conversations.some((c) => c.id === state.activeConversationId);
    if (exists) return state.activeConversationId;
  }
  const id = uid('conv');
  const conversation: StoredConversation = {
    id,
    title: 'New chat',
    agentId: state.selectedAgent,
    messages: [],
    updatedAt: new Date().toISOString(),
  };
  set({
    conversations: [conversation, ...state.conversations],
    activeConversationId: id,
  });
  return id;
}

export const useMockStore = create<MockStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      athletes: SEED_ATHLETES,
      teams: SEED_TEAMS,
      tests: SEED_TESTS,
      reports: SEED_REPORTS,
      research: SEED_RESEARCH,
      calculations: SEED_CALCULATIONS,
      conversations: [],
      activeConversationId: null,
      selectedAgent: 'performance',

      addAthlete: (input) => {
        const athlete: MockAthlete = {
          ...input,
          id: uid('ath'),
          tests_count: 0,
          trend_percent: 0,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ athletes: [athlete, ...s.athletes] }));
        return athlete;
      },

      updateAthlete: (id, patch) => {
        set((s) => ({
          athletes: s.athletes.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        }));
      },

      getAthlete: (id) => get().athletes.find((a) => a.id === id),

      addTeam: (input) => {
        const team: MockTeam = {
          ...input,
          id: uid('team'),
          created_at: new Date().toISOString(),
        };
        set((s) => ({ teams: [team, ...s.teams] }));
        return team;
      },

      addTest: (input) => {
        const test: MockPerformanceTest = { ...input, id: uid('test') };
        set((s) => ({
          tests: [test, ...s.tests],
          athletes: s.athletes.map((a) =>
            a.id === input.athlete_id ? { ...a, tests_count: a.tests_count + 1 } : a
          ),
        }));
        return test;
      },

      addReport: (input) => {
        const report: MockReport = {
          ...input,
          id: uid('rep'),
          status: 'draft',
          created_at: new Date().toISOString(),
        };
        set((s) => ({ reports: [report, ...s.reports] }));
        return report;
      },

      addResearch: (input) => {
        const project: MockResearchProject = {
          ...input,
          id: uid('res'),
          status: 'planning',
          progress: 10,
          updated_at: new Date().toISOString(),
        };
        set((s) => ({ research: [project, ...s.research] }));
        return project;
      },

      runCalculation: (type, title, inputs) => {
        const result = computeCalculator(type, inputs);
        const record: MockCalculationRecord = {
          id: uid('calc'),
          calculator_type: type,
          title,
          inputs,
          result,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ calculations: [record, ...s.calculations] }));
        return record;
      },

      setSelectedAgent: (agentId) => set({ selectedAgent: agentId }),

      startNewConversation: () => {
        const id = uid('conv');
        const conversation: StoredConversation = {
          id,
          title: 'New chat',
          agentId: get().selectedAgent,
          messages: [],
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({
          conversations: [conversation, ...s.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      setActiveConversation: (id) => {
        const conv = get().conversations.find((c) => c.id === id);
        if (conv) {
          set({ activeConversationId: id, selectedAgent: conv.agentId });
        }
      },

      getActiveConversation: () => {
        const { activeConversationId, conversations } = get();
        if (!activeConversationId) return undefined;
        return conversations.find((c) => c.id === activeConversationId);
      },

      getActiveMessages: () => {
        const conv = get().getActiveConversation();
        return conv?.messages ?? EMPTY_STORE_MESSAGES;
      },

      setActiveMessages: (messages) => {
        const activeId = ensureActiveConversation(get, set);
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  messages,
                  updatedAt: new Date().toISOString(),
                  title:
                    c.title === 'New chat'
                      ? messages.find((m) => m.role === 'user')?.content.slice(0, 48) ?? c.title
                      : c.title,
                }
              : c
          ),
        }));
      },

      appendActiveMessage: (message) => {
        const activeId = ensureActiveConversation(get, set);
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== activeId) return c;
            const messages = [...c.messages, message];
            const title =
              c.title === 'New chat' && message.role === 'user'
                ? message.content.slice(0, 48)
                : c.title;
            return { ...c, messages, title, updatedAt: new Date().toISOString() };
          }),
        }));
      },

      touchActiveConversation: () => {
        const activeId = get().activeConversationId;
        if (!activeId) return;
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === activeId ? { ...c, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        athletes: state.athletes,
        teams: state.teams,
        tests: state.tests,
        reports: state.reports,
        research: state.research,
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        selectedAgent: state.selectedAgent,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const mockSelectors = {
  athletes: () => useMockStore.getState().athletes,
  teams: () => useMockStore.getState().teams,
  tests: () => useMockStore.getState().tests,
  reports: () => useMockStore.getState().reports,
  research: () => useMockStore.getState().research,
  conversations: () => useMockStore.getState().conversations,
};

/** Wait until AsyncStorage hydration completes. */
export function useMockStoreHydrated(): boolean {
  return useMockStore((s) => s._hasHydrated);
}
