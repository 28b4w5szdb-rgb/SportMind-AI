/**
 * SportMind AI - TypeScript Type Definitions
 */

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach' | 'scientist' | 'athlete';
  avatar?: string;
  createdAt: Date;
}

// Athlete types
export interface Athlete {
  id: string;
  name: string;
  position: string;
  age: number;
  height: number;
  weight: number;
  avatar?: string;
  teamId?: string;
  metrics?: PerformanceMetrics;
}

// Performance metrics
export interface PerformanceMetrics {
  speed: number;
  endurance: number;
  strength: number;
  agility: number;
  recovery: number;
  lastUpdated: Date;
}

// Team types
export interface Team {
  id: string;
  name: string;
  sport: string;
  athletes: string[];
  createdAt: Date;
}

// Report types
export interface Report {
  id: string;
  title: string;
  type: 'performance' | 'health' | 'training' | 'research';
  athleteId?: string;
  teamId?: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

// AI Coach message types
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Calculator types
export type CalculatorType = 
  | 'vo2max'
  | 'bmi'
  | 'body-fat'
  | 'heart-rate-zone'
  | 'training-load'
  | 'recovery-time';

export interface CalculatorResult {
  value: number;
  unit: string;
  interpretation: string;
  recommendations?: string[];
}
