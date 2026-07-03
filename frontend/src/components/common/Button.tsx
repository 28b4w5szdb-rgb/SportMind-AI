/**
 * SportMind AI - Button Component
 * Reusable button with multiple variants
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/src/core/theme';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const theme = useTheme();
  
  const buttonStyles = [styles.base];
  const textStyles: TextStyle[] = [];
  
  // Size styles
  if (size === 'small') {
    buttonStyles.push(styles.small);
    textStyles.push({ ...theme.typography.buttonSmall });
  } else if (size === 'large') {
    buttonStyles.push(styles.large);
    textStyles.push({ ...theme.typography.button });
  } else {
    buttonStyles.push(styles.medium);
    textStyles.push({ ...theme.typography.button });
  }
  
  // Variant styles
  if (variant === 'primary') {
    buttonStyles.push({ backgroundColor: theme.colors.primary });
    textStyles.push({ color: '#FFFFFF' });
  } else if (variant === 'secondary') {
    buttonStyles.push({ backgroundColor: theme.colors.secondary });
    textStyles.push({ color: '#FFFFFF' });
  } else if (variant === 'outline') {
    buttonStyles.push({
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    });
    textStyles.push({ color: theme.colors.primary });
  } else if (variant === 'ghost') {
    buttonStyles.push({ backgroundColor: 'transparent' });
    textStyles.push({ color: theme.colors.primary });
  }
  
  // Full width
  if (fullWidth) {
    buttonStyles.push(styles.fullWidth);
  }
  
  // Disabled state
  if (disabled || loading) {
    buttonStyles.push({ opacity: 0.5 });
  }
  
  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : 20}
              color={textStyles[textStyles.length - 1]?.color || '#FFFFFF'}
              style={{ marginRight: theme.spacing.sm }}
            />
          )}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 52,
  },
  fullWidth: {
    width: '100%',
  },
});
