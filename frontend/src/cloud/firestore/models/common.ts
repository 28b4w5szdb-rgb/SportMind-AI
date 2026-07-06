/** Shared Firestore document metadata. */

export interface CloudDocumentMeta {
  id: string;
  created_at: string;
  updated_at: string;
}

export type CloudWriteMeta = Omit<CloudDocumentMeta, 'id'> & { id?: string };

export type UserRole = 'admin' | 'head_coach' | 'coach' | 'analyst' | 'physio' | 'viewer';

export type AppLanguage = 'en' | 'ar';

export type AppThemePreference = 'light' | 'dark' | 'system';

export type AthleteStatus = 'active' | 'injured' | 'rest';

export type ReportStatus = 'draft' | 'ready' | 'exported';

export type ReportScope = 'athlete' | 'team' | 'session' | 'custom';
