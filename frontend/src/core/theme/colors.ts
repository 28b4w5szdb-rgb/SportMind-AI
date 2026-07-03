/**
 * SportMind AI - Color System
 * Premium color palette with dark/light mode support
 */

export const colors = {
  // Light Mode Colors
  light: {
    // Primary - Professional Blue
    primary: '#0066FF',
    primaryLight: '#3385FF',
    primaryDark: '#0052CC',
    
    // Secondary - Sports Green
    secondary: '#00C853',
    secondaryLight: '#5FFC82',
    secondaryDark: '#00A844',
    
    // Accent - Premium Gold
    accent: '#FFB300',
    accentLight: '#FFCA28',
    accentDark: '#FF8F00',
    
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F5F7FA',
    backgroundTertiary: '#E8EDF2',
    
    // Surface (Cards, Panels)
    surface: '#FFFFFF',
    surfaceElevated: '#FAFBFC',
    
    // Text
    text: '#0A1929',
    textSecondary: '#4A5568',
    textTertiary: '#718096',
    textDisabled: '#A0AEC0',
    
    // Borders
    border: '#E2E8F0',
    borderLight: '#EDF2F7',
    
    // Status Colors
    success: '#00C853',
    warning: '#FFB300',
    error: '#F44336',
    info: '#2196F3',
    
    // Overlay
    overlay: 'rgba(10, 25, 41, 0.5)',
  },
  
  // Dark Mode Colors
  dark: {
    // Primary - Professional Blue
    primary: '#3385FF',
    primaryLight: '#5C9FFF',
    primaryDark: '#0066FF',
    
    // Secondary - Sports Green
    secondary: '#00E676',
    secondaryLight: '#69F0AE',
    secondaryDark: '#00C853',
    
    // Accent - Premium Gold
    accent: '#FFD54F',
    accentLight: '#FFE082',
    accentDark: '#FFCA28',
    
    // Backgrounds
    background: '#0A0E14',
    backgroundSecondary: '#11151C',
    backgroundTertiary: '#1A1F28',
    
    // Surface (Cards, Panels)
    surface: '#14181F',
    surfaceElevated: '#1E232A',
    
    // Text
    text: '#F7FAFC',
    textSecondary: '#CBD5E0',
    textTertiary: '#A0AEC0',
    textDisabled: '#4A5568',
    
    // Borders
    border: '#2D3748',
    borderLight: '#1A202C',
    
    // Status Colors
    success: '#00E676',
    warning: '#FFD54F',
    error: '#FF5252',
    info: '#40C4FF',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Semantic Colors (mode-independent)
  semantic: {
    successLight: '#E8F5E9',
    warningLight: '#FFF9E6',
    errorLight: '#FFEBEE',
    infoLight: '#E3F2FD',
  },
};

export type ColorScheme = 'light' | 'dark';
export type Colors = typeof colors.light;
