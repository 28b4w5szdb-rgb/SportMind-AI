/**
 * SportMind AI - Input Component
 * Reusable text input with label and error states
 */

import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@/src/core/theme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, icon, containerStyle, style, ...props }: InputProps) {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.borderRadius.lg,
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={theme.colors.textTertiary}
            style={{ marginRight: theme.spacing.sm }}
          />
        )}
        <TextInput
          style={[
            styles.input,
            theme.typography.body,
            { color: theme.colors.text, flex: 1 },
            style,
          ]}
          placeholderTextColor={theme.colors.textTertiary}
          {...props}
        />
      </View>
      {error && (
        <Text style={[theme.typography.caption, { color: theme.colors.error, marginTop: theme.spacing.xs }]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    minHeight: 48,
  },
});
