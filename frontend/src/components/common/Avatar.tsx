/**
 * SportMind AI - Avatar Component
 * User avatar with initials fallback
 */

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/src/core/theme';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  name: string;
  imageUri?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

export function Avatar({ name, imageUri, size = 'medium', style }: AvatarProps) {
  const theme = useTheme();
  
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const sizeStyles = {
    small: { width: 32, height: 32, borderRadius: 16 },
    medium: { width: 40, height: 40, borderRadius: 20 },
    large: { width: 56, height: 56, borderRadius: 28 },
    xlarge: { width: 80, height: 80, borderRadius: 40 },
  };
  
  const fontSizes = {
    small: theme.typography.caption,
    medium: theme.typography.body,
    large: theme.typography.h4,
    xlarge: theme.typography.h3,
  };
  
  return (
    <View
      style={[
        styles.container,
        sizeStyles[size],
        { backgroundColor: theme.colors.primary },
        style,
      ]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[StyleSheet.absoluteFill, sizeStyles[size]]} />
      ) : (
        <Text style={[fontSizes[size], { color: '#FFFFFF', fontWeight: '600' }]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
