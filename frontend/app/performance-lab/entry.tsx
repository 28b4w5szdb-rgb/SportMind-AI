import { Redirect } from 'expo-router';

/** Legacy entry route — redirects to Testing Center tab. Custom test entry uses test/[testKey] via scientific bridge. */
export default function PerformanceLabEntryRedirect() {
  return <Redirect href="/(tabs)/performance-lab" />;
}
