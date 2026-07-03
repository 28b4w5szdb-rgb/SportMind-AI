/**
 * SportMind AI - Storage Service
 * Local storage utilities
 */

import { storage } from '@/src/utils/storage';

export const storageService = {
  // User preferences
  saveUserPreferences: async (preferences: any) => {
    await storage.setItem('user_preferences', preferences);
  },
  
  getUserPreferences: async () => {
    return await storage.getItem('user_preferences', null);
  },
  
  // Auth tokens
  saveAuthToken: async (token: string) => {
    await storage.secureSet('auth_token', token);
  },
  
  getAuthToken: async () => {
    return await storage.secureGet('auth_token', null);
  },
  
  clearAuthToken: async () => {
    await storage.secureRemove('auth_token');
  },
};

export default storageService;
