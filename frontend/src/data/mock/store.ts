import { create } from 'zustand';

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

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export interface MockStore {
  athletes: MockAthlete[];
  teams: MockTeam[];
  tests: MockPerformanceTest[];
  reports: MockReport[];
  research: MockResearchProject[];
  calculations: MockCalculationRecord[];

  addAthlete: (input: Omit<MockAthlete, 'id' | 'created_at' | 'tests_count' | 'trend_percent'>) => MockAthlete;
  updateAthlete: (id: string, patch: Partial<MockAthlete>) => void;
  getAthlete: (id: string) => MockAthlete | undefined;

  addTeam: (input: Omit<MockTeam, 'id' | 'created_at'>) => MockTeam;
  addTest: (input: Omit<MockPerformanceTest, 'id'>) => MockPerformanceTest;
  addReport: (input: Omit<MockReport, 'id' | 'created_at' | 'status'>) => MockReport;
  addResearch: (input: Omit<MockResearchProject, 'id' | 'updated_at' | 'progress' | 'status'>) => MockResearchProject;
  runCalculation: (
    type: CalculatorType,
    title: string,
    inputs: Record<string, number>
  ) => MockCalculationRecord;
}

export const useMockStore = create<MockStore>((set, get) => ({
  athletes: SEED_ATHLETES,
  teams: SEED_TEAMS,
  tests: SEED_TESTS,
  reports: SEED_REPORTS,
  research: SEED_RESEARCH,
  calculations: SEED_CALCULATIONS,

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
}));

/** Read-only selectors for future Supabase repository swap. */
export const mockSelectors = {
  athletes: () => useMockStore.getState().athletes,
  teams: () => useMockStore.getState().teams,
  tests: () => useMockStore.getState().tests,
  reports: () => useMockStore.getState().reports,
  research: () => useMockStore.getState().research,
};
