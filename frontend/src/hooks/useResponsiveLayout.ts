import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isWeb = Platform.OS === 'web';
    const isTablet = width >= 768;
    const isDesktop = width >= 1024;
    const contentMaxWidth = isDesktop ? 1400 : undefined;
    const formMaxWidth = isDesktop ? 720 : isTablet ? 600 : undefined;
    const horizontalPadding = isWeb && isDesktop ? 48 : 16;

    return {
      width,
      isWeb,
      isTablet,
      isDesktop,
      contentMaxWidth,
      formMaxWidth,
      horizontalPadding,
      columns: isDesktop ? 3 : isTablet ? 2 : 1,
    };
  }, [width]);
}
