import type { Href } from 'expo-router';

/** First-launch onboarding. */
export const ONBOARDING_ROUTES = {
  index: '/onboarding' as Href,
};

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
  aiCoach: '/(tabs)/ai-coach' as Href,
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
  teamIntelligence: (teamId?: string): Href =>
    (teamId ? `/team-intelligence?teamId=${encodeURIComponent(teamId)}` : '/team-intelligence') as Href,
  performanceLabEntry: '/performance-lab/entry' as Href,
  performanceLabCompare: '/performance-lab/compare' as Href,
  performanceLabBenchmark: '/performance-lab/benchmark' as Href,
  performanceLabHistory: '/performance-lab/history' as Href,
  performanceLabCategory: (id: string): Href => `/performance-lab/category/${id}` as Href,
  performanceLabTest: (testKey: string): Href => `/performance-lab/test/${testKey}` as Href,
  performanceLabResult: (id: string): Href => `/performance-lab/result/${id}` as Href,
  performanceLabLibrary: '/performance-lab/library' as Href,
  performanceLabCustomNew: '/performance-lab/custom/new' as Href,
  dailyCheckIn: (athleteId?: string): Href =>
    (athleteId ? `/check-in?athleteId=${encodeURIComponent(athleteId)}` : '/check-in') as Href,
  recoveryCenter: (athleteId?: string): Href =>
    (athleteId ? `/recovery?athleteId=${encodeURIComponent(athleteId)}` : '/recovery') as Href,
  sportsMedicine: (athleteId?: string): Href =>
    (athleteId ? `/sports-medicine?athleteId=${encodeURIComponent(athleteId)}` : '/sports-medicine') as Href,
  addInjury: (athleteId?: string): Href =>
    (athleteId ? `/sports-medicine/injury/new?athleteId=${encodeURIComponent(athleteId)}` : '/sports-medicine/injury/new') as Href,
  trainingBuilder: (athleteId?: string): Href =>
    (athleteId ? `/training-builder?athleteId=${encodeURIComponent(athleteId)}` : '/training-builder') as Href,
  logTrainingSession: (sessionId: string, athleteId?: string): Href =>
    (athleteId
      ? `/training-builder/session/log?sessionId=${encodeURIComponent(sessionId)}&athleteId=${encodeURIComponent(athleteId)}`
      : `/training-builder/session/log?sessionId=${encodeURIComponent(sessionId)}`) as Href,
  nutritionCenter: (athleteId?: string): Href =>
    (athleteId ? `/nutrition?athleteId=${encodeURIComponent(athleteId)}` : '/nutrition') as Href,
  nutritionLog: (athleteId?: string): Href =>
    (athleteId ? `/nutrition/log?athleteId=${encodeURIComponent(athleteId)}` : '/nutrition/log') as Href,
  bodyComposition: (athleteId?: string): Href =>
    (athleteId ? `/nutrition/body-composition?athleteId=${encodeURIComponent(athleteId)}` : '/nutrition/body-composition') as Href,
  wearables: (athleteId?: string): Href =>
    (athleteId ? `/wearables?athleteId=${encodeURIComponent(athleteId)}` : '/wearables') as Href,
  knowledgeCategory: (key: string): Href => `/knowledge/${key}` as Href,
  settings: '/settings' as Href,
  help: '/help' as Href,
  knowledge: '/knowledge' as Href,
};
