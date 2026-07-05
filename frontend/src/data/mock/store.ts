import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AiAgentId, AiMessage } from './ai-coach';
import type { CustomTestInput } from '@/src/features/performance-lab/types';
import { buildCustomTestDefinition } from '@/src/features/performance-lab/registry/factory';
import type { TestDefinition } from '@/src/features/performance-lab/types';
import type {
  MockAthlete,
  MockCalculationRecord,
  DailyCheckIn,
  DailyCheckInInput,
  InjuryRecord,
  InjuryRecordInput,
  TrainingPlan,
  TrainingPlanInput,
  TrainingSessionLogInput,
  MockPerformanceTest,
  MockReport,
  MockResearchProject,
  MockTeam,
  CalculatorType,
} from './types';
import { todayDateKey } from '@/src/features/daily-checkin/validation';
import { computeCalculator } from './calculators';
import {
  SEED_ATHLETES,
  SEED_CALCULATIONS,
  SEED_CHECKINS,
  SEED_INJURIES,
  SEED_REPORTS,
  SEED_RESEARCH,
  SEED_TEAMS,
  SEED_TESTS,
  SEED_TRAINING_PLANS,
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

  favoriteTestKeys: string[];
  recentTestKeys: string[];
  customTestDefinitions: TestDefinition[];
  dailyCheckIns: DailyCheckIn[];
  injuryRecords: InjuryRecord[];
  trainingPlans: TrainingPlan[];

  addAthlete: (input: Omit<MockAthlete, 'id' | 'created_at' | 'tests_count' | 'trend_percent'>) => MockAthlete;
  updateAthlete: (id: string, patch: Partial<MockAthlete>) => void;
  getAthlete: (id: string) => MockAthlete | undefined;

  addTeam: (input: Omit<MockTeam, 'id' | 'created_at'>) => MockTeam;
  addTest: (input: Omit<MockPerformanceTest, 'id'>) => MockPerformanceTest;
  addReport: (input: Omit<MockReport, 'id' | 'created_at' | 'status'>) => MockReport;
  updateReport: (id: string, patch: Partial<MockReport>) => void;
  addResearch: (input: Omit<MockResearchProject, 'id' | 'updated_at' | 'progress' | 'status'>) => MockResearchProject;
  updateResearch: (id: string, patch: Partial<MockResearchProject>) => void;
  updateTeam: (id: string, patch: Partial<MockTeam>) => void;
  runCalculation: (type: CalculatorType, title: string, inputs: Record<string, number>) => MockCalculationRecord;

  setSelectedAgent: (agentId: AiAgentId) => void;
  startNewConversation: () => string;
  setActiveConversation: (id: string) => void;
  getActiveConversation: () => StoredConversation | undefined;
  getActiveMessages: () => AiMessage[];
  setActiveMessages: (messages: AiMessage[]) => void;
  appendActiveMessage: (message: AiMessage) => void;
  touchActiveConversation: () => void;

  toggleFavoriteTest: (key: string) => void;
  pushRecentTest: (key: string) => void;
  addCustomTestDefinition: (input: CustomTestInput) => TestDefinition;
  addDailyCheckIn: (input: DailyCheckInInput) => DailyCheckIn;
  addInjuryRecord: (input: InjuryRecordInput) => InjuryRecord;
  updateInjuryRecord: (id: string, patch: Partial<InjuryRecord>) => void;
  addTrainingPlan: (input: TrainingPlanInput | TrainingPlan) => TrainingPlan;
  updateTrainingPlan: (id: string, patch: Partial<TrainingPlan>) => void;
  logTrainingSession: (planId: string, sessionId: string, input: TrainingSessionLogInput) => void;
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
      favoriteTestKeys: [],
      recentTestKeys: [],
      customTestDefinitions: [],
      dailyCheckIns: SEED_CHECKINS,
      injuryRecords: SEED_INJURIES,
      trainingPlans: SEED_TRAINING_PLANS,

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
        const staff = input.staff ?? (input.head_coach ? [{ role: 'Head coach', name: input.head_coach }] : []);
        const team: MockTeam = {
          ...input,
          staff,
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
          sections: input.sections ?? {
            athlete_summary: input.summary,
            performance_tests: '',
            ai_insights: '',
            recommendations: '',
          },
          id: uid('rep'),
          status: 'draft',
          created_at: new Date().toISOString(),
        };
        set((s) => ({ reports: [report, ...s.reports] }));
        return report;
      },

      updateReport: (id, patch) => {
        set((s) => ({
          reports: s.reports.map((r) => (r.id === id ? { ...r, ...patch, sections: patch.sections ? { ...r.sections, ...patch.sections } : r.sections } : r)),
        }));
      },

      addResearch: (input) => {
        const project: MockResearchProject = {
          ...input,
          id: uid('res'),
          status: 'planning',
          progress: 10,
          mock_analysis:
            input.mock_analysis ??
            'Preliminary mock analysis: effect sizes and confidence intervals will populate when data collection begins.',
          updated_at: new Date().toISOString(),
        };
        set((s) => ({ research: [project, ...s.research] }));
        return project;
      },

      updateResearch: (id, patch) => {
        set((s) => ({
          research: s.research.map((p) =>
            p.id === id ? { ...p, ...patch, updated_at: new Date().toISOString() } : p
          ),
        }));
      },

      updateTeam: (id, patch) => {
        set((s) => ({
          teams: s.teams.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }));
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

      toggleFavoriteTest: (key) => {
        set((s) => ({
          favoriteTestKeys: s.favoriteTestKeys.includes(key)
            ? s.favoriteTestKeys.filter((k) => k !== key)
            : [key, ...s.favoriteTestKeys],
        }));
      },

      pushRecentTest: (key) => {
        set((s) => ({
          recentTestKeys: [key, ...s.recentTestKeys.filter((k) => k !== key)].slice(0, 12),
        }));
      },

      addCustomTestDefinition: (input) => {
        const key = uid('custom_test');
        const def = buildCustomTestDefinition(input, key);
        def.isCustom = true;
        set((s) => ({ customTestDefinitions: [def, ...s.customTestDefinitions] }));
        return def;
      },

      addDailyCheckIn: (input) => {
        const date = input.date ?? todayDateKey();
        const existingIdx = get().dailyCheckIns.findIndex(
          (c) => c.athlete_id === input.athlete_id && c.date === date
        );
        const record: DailyCheckIn = {
          ...input,
          id: existingIdx >= 0 ? get().dailyCheckIns[existingIdx].id : uid('checkin'),
          date,
          created_at: new Date().toISOString(),
        };
        set((s) => ({
          dailyCheckIns:
            existingIdx >= 0
              ? s.dailyCheckIns.map((c, i) => (i === existingIdx ? record : c))
              : [record, ...s.dailyCheckIns],
        }));
        return record;
      },

      addInjuryRecord: (input) => {
        const record: InjuryRecord = {
          ...input,
          id: uid('inj'),
          created_at: new Date().toISOString(),
        };
        set((s) => ({ injuryRecords: [record, ...s.injuryRecords] }));
        return record;
      },

      updateInjuryRecord: (id, patch) => {
        set((s) => ({
          injuryRecords: s.injuryRecords.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        }));
      },

      addTrainingPlan: (input) => {
        const plan: TrainingPlan = {
          ...input,
          id: 'id' in input && input.id ? input.id : uid('plan'),
          created_at: 'created_at' in input && input.created_at ? input.created_at : new Date().toISOString(),
        };
        set((s) => ({
          trainingPlans: [
            plan,
            ...s.trainingPlans.map((p) =>
              p.athlete_id === plan.athlete_id && plan.is_active ? { ...p, is_active: false } : p
            ),
          ],
        }));
        return plan;
      },

      updateTrainingPlan: (id, patch) => {
        set((s) => ({
          trainingPlans: s.trainingPlans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },

      logTrainingSession: (planId, sessionId, input) => {
        set((s) => ({
          trainingPlans: s.trainingPlans.map((plan) => {
            if (plan.id !== planId) return plan;
            return {
              ...plan,
              sessions: plan.sessions.map((session) => {
                if (session.id !== sessionId) return session;
                const actual_session_load =
                  input.status === 'skipped' ? 0 : input.actual_duration_min * input.actual_rpe;
                return {
                  ...session,
                  status: input.status,
                  execution: {
                    actual_duration_min: input.actual_duration_min,
                    actual_rpe: input.actual_rpe,
                    actual_session_load,
                    post_session_fatigue: input.post_session_fatigue,
                    post_session_pain: input.post_session_pain,
                    notes: input.notes,
                    logged_at: new Date().toISOString(),
                  },
                };
              }),
            };
          }),
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
        favoriteTestKeys: state.favoriteTestKeys,
        recentTestKeys: state.recentTestKeys,
        customTestDefinitions: state.customTestDefinitions,
        dailyCheckIns: state.dailyCheckIns,
        injuryRecords: state.injuryRecords,
        trainingPlans: state.trainingPlans,
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
