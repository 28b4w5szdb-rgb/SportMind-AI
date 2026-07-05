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
};
