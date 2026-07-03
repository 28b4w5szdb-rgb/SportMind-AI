/**
 * SportMind AI - Sports Science Calculator
 * Scientific calculations for sports performance
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/layout/Screen';
import { Header } from '@/src/components/layout/Header';
import { Card } from '@/src/components/common/Card';
import { useTheme } from '@/src/core/theme';
import { Ionicons } from '@expo/vector-icons';

export default function CalculatorScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  const calculators = [
    { id: '1', title: 'VO2 Max', icon: 'fitness' as const, description: 'Calculate maximum oxygen uptake' },
    { id: '2', title: 'BMI Calculator', icon: 'body' as const, description: 'Body Mass Index calculation' },
    { id: '3', title: 'Body Fat %', icon: 'analytics' as const, description: 'Estimate body fat percentage' },
    { id: '4', title: 'Heart Rate Zones', icon: 'heart' as const, description: 'Training heart rate zones' },
    { id: '5', title: 'Training Load', icon: 'barbell' as const, description: 'Calculate training load' },
    { id: '6', title: 'Recovery Time', icon: 'time' as const, description: 'Optimal recovery duration' },
  ];
  
  return (
    <Screen padding={false}>
      <Header title="Calculator" showBack />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: theme.spacing.md }}>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }]}>
          Professional sports science calculations
        </Text>
        
        {calculators.map((calc) => (
          <TouchableOpacity key={calc.id} activeOpacity={0.7}>
            <Card style={[styles.calcCard, { marginBottom: theme.spacing.md }]}>
              <View
                style={[
                  styles.calcIcon,
                  {
                    backgroundColor: theme.colors.primary + '20',
                    borderRadius: theme.borderRadius.lg,
                  },
                ]}
              >
                <Ionicons name={calc.icon} size={28} color={theme.colors.primary} />
              </View>
              <View style={styles.calcContent}>
                <Text style={[theme.typography.h4, { color: theme.colors.text }]}>{calc.title}</Text>
                <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: 4 }]}>
                  {calc.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  calcCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  calcIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcContent: {
    flex: 1,
  },
});
