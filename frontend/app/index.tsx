/**
 * SportMind AI - Entry Point
 * Redirects to main app tabs
 */

import { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/dashboard" />;
}
