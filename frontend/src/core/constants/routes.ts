import type { Href } from 'expo-router';

/** Typed auth stack routes (Expo Router). */
export const AUTH_ROUTES = {
  signIn: '/(auth)/sign-in' as Href,
  signUp: '/(auth)/sign-up' as Href,
  forgotPassword: '/(auth)/forgot-password' as Href,
  resetPassword: '/(auth)/reset-password' as Href,
  verifyEmail: (email: string): Href =>
    `/(auth)/verify-email?email=${encodeURIComponent(email)}` as Href,
};

/** Typed main app routes. */
export const APP_ROUTES = {
  dashboard: '/(tabs)/dashboard' as Href,
  home: '/' as Href,
  athletes: '/(tabs)/athletes' as Href,
  athleteAdd: '/athletes/add' as Href,
  athleteDetail: (id: string): Href => `/athletes/${id}` as Href,
  athleteEdit: (id: string): Href => `/athletes/${id}/edit` as Href,
  calculator: '/calculator' as Href,
  calculatorType: (type: string): Href => `/calculator/${type}` as Href,
  reports: '/reports' as Href,
  reportBuilder: '/reports/builder' as Href,
  reportDetail: (id: string): Href => `/reports/${id}` as Href,
  research: '/research' as Href,
  researchNew: '/research/new' as Href,
  researchDetail: (id: string): Href => `/research/${id}` as Href,
  teamManagement: '/team-management' as Href,
  teamNew: '/team-management/new' as Href,
  teamDetail: (id: string): Href => `/team-management/${id}` as Href,
  performanceLabEntry: '/performance-lab/entry' as Href,
  performanceLabCompare: '/performance-lab/compare' as Href,
  performanceLabBenchmark: '/performance-lab/benchmark' as Href,
  performanceLabHistory: '/performance-lab/history' as Href,
  performanceLabCategory: (id: string): Href => `/performance-lab/category/${id}` as Href,
  knowledgeCategory: (key: string): Href => `/knowledge/${key}` as Href,
  settings: '/settings' as Href,
  help: '/help' as Href,
  knowledge: '/knowledge' as Href,
};
