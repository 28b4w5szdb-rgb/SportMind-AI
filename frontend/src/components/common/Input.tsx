/**
 * SportMind AI - Input Component
 * Reusable text input with label and error states
 */

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, icon, containerStyle, style, onFocus, onBlur, ...props }: InputProps) {
  const theme = useTheme();
  const { flexRow, textAlign, isRTL } = useDirection();
  const [focused, setFocused] = useState(false);
  const { tokens, layout } = theme;

  const borderColor = error
    ? theme.colors.error
    : focused
      ? theme.colors.primary
      : theme.colors.border;
  const borderWidth = error || focused ? tokens.border.focus : tokens.border.hairline;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            theme.typography.label,
            { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
          ]}
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            flexDirection: flexRow(true),
            backgroundColor: theme.colors.surface,
            borderColor,
            borderWidth,
            borderRadius: theme.borderRadius[tokens.radius.input],
            minHeight: layout.inputHeightMd,
            paddingHorizontal: theme.spacing[4],
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? theme.colors.primary : theme.colors.textTertiary}
            style={{ marginEnd: theme.spacing.sm }}
          />
        )}
        <TextInput
          style={[
            styles.input,
            theme.typography.body,
            {
              color: theme.colors.text,
              flex: 1,
              textAlign: textAlign('start'),
              writingDirection: isRTL ? 'rtl' : 'ltr',
              minHeight: layout.inputHeightMd,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {error && (
        <Text
          style={[theme.typography.caption, { color: theme.colors.error, marginTop: theme.spacing.xs }]}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    paddingVertical: 0,
  },
});
