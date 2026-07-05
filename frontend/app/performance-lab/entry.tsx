import { Redirect } from 'expo-router';

/** Legacy entry route — redirects to Testing Center tab. */
export default function PerformanceLabEntryRedirect() {
  return <Redirect href="/(tabs)/performance-lab" />;
}
