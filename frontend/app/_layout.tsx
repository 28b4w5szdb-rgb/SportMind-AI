import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthGate } from '@/src/components/auth';
import { useIconFonts } from '@/src/hooks/use-icon-fonts';
import { useAppFonts } from '@/src/hooks/use-app-fonts';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { DirectionProvider, useDirection } from '@/src/providers/DirectionProvider';

// Disable logbox errors etc so that users can see the app
// and agent works as expected.
LogBox.ignoreAllLogs(true);

// Keep the native splash visible from cold start until fonts + i18n are ready.
SplashScreen.preventAutoHideAsync();

/**
 * Inner shell: sits inside DirectionProvider so it can wait for i18n boot,
 * then hides the splash and mounts the router. Note we do NOT block on font
 * CDN failures — if fonts fail to load, we still boot with system fallbacks
 * so the app remains usable offline / on restricted networks.
 */
function AppShell() {
  const [iconsLoaded, iconsError] = useIconFonts();
  const [appFontsLoaded, appFontsError] = useAppFonts();
  const { ready: i18nReady } = useDirection();

  const iconsSettled = iconsLoaded || !!iconsError;
  const fontsSettled = appFontsLoaded || !!appFontsError;
  const ready = iconsSettled && fontsSettled && i18nReady;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {
        // ignore — splash may already be gone in dev
      });
    }
  }, [ready]);

  if (!ready) {
    // Splash is still visible native-side; render nothing to avoid flash.
    return <View style={{ flex: 1 }} />;
  }

  return (
    <AuthGate>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="calculator" />
        <Stack.Screen name="research" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="team-management" />
        <Stack.Screen name="team-intelligence" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="athletes" />
        <Stack.Screen name="check-in" />
        <Stack.Screen name="recovery" />
        <Stack.Screen name="sports-medicine" />
        <Stack.Screen name="training-builder" />
        <Stack.Screen name="nutrition" />
        <Stack.Screen name="wearables" />
        <Stack.Screen name="performance-lab" />
        <Stack.Screen name="help" />
        <Stack.Screen name="knowledge" />
      </Stack>
    </AuthGate>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DirectionProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </DirectionProvider>
    </GestureHandlerRootView>
  );
}
