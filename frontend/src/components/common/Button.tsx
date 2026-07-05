/**
 * SportMind AI - Premium Button Component
 * Multiple variants with smooth hover/press states
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '@/src/core/theme';
import { Ionicons } from '@expo/vector-icons';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'success'
  | 'warning'
  | 'error'
  | 'link';

export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const theme = useTheme();

  // Get variant colors
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: theme.colors.primary },
          text: { color: '#FFFFFF' },
        };
      case 'secondary':
        return {
          container: { backgroundColor: theme.colors.secondary },
          text: { color: '#FFFFFF' },
        };
      case 'accent':
        return {
          container: { backgroundColor: theme.colors.accent },
          text: { color: '#FFFFFF' },
        };
      case 'success':
        return {
          container: { backgroundColor: theme.colors.success },
          text: { color: '#FFFFFF' },
        };
      case 'warning':
        return {
          container: { backgroundColor: theme.colors.warning },
          text: { color: '#FFFFFF' },
        };
      case 'error':
        return {
          container: { backgroundColor: theme.colors.error },
          text: { color: '#FFFFFF' },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: theme.colors.primary,
          },
          text: { color: theme.colors.primary },
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent' },
          text: { color: theme.colors.primary },
        };
      case 'link':
        return {
          container: { backgroundColor: 'transparent', paddingHorizontal: 0 },
          text: { color: theme.colors.primary, textDecorationLine: 'underline' },
        };
      default:
        return {
          container: { backgroundColor: theme.colors.primary },
          text: { color: '#FFFFFF' },
        };
    }
  };

  // Get size dimensions
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 16,
          paddingVertical: 8,
          minHeight: 32,
          borderRadius: theme.borderRadius.md,
        };
      case 'large':
        return {
          paddingHorizontal: 32,
          paddingVertical: 16,
          minHeight: 52,
          borderRadius: theme.borderRadius.xl,
        };
      case 'xlarge':
        return {
          paddingHorizontal: 40,
          paddingVertical: 20,
          minHeight: 60,
          borderRadius: theme.borderRadius['2xl'],
        };
      default:
        return {
          paddingHorizontal: 24,
          paddingVertical: 12,
          minHeight: 44,
          borderRadius: theme.borderRadius.lg,
        };
    }
  };

  // Get text style based on size
  const getTextStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return theme.typography.buttonSm;
      case 'large':
      case 'xlarge':
        return theme.typography.buttonLg;
      default:
        return theme.typography.button;
    }
  };

  // Get icon size based on button size
  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 22;
      case 'xlarge':
        return 24;
      default:
        return 18;
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const textColor = variantStyles.text.color || theme.colors.text;

  const containerStyles: ViewStyle[] = [
    styles.base,
    sizeStyles,
    variantStyles.container,
  ];

  if (fullWidth) {
    containerStyles.push(styles.fullWidth);
  }

  if (disabled || loading) {
    containerStyles.push({ opacity: 0.5 });
  }

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={textColor}
          size={size === 'small' ? 'small' : 'small'}
        />
      );
    }

    const iconElement = icon ? (
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={textColor}
        style={{
          marginRight: iconPosition === 'left' ? theme.spacing[2] : 0,
          marginLeft: iconPosition === 'right' ? theme.spacing[2] : 0,
        }}
      />
    ) : null;

    return (
      <View style={styles.content}>
        {iconPosition === 'left' && iconElement}
        <Text
          style={[
            getTextStyle(),
            variantStyles.text,
            textStyle,
          ]}
        >
          {title}
        </Text>
        {iconPosition === 'right' && iconElement}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[containerStyles, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});
