import type { CloudDocumentMeta, ReportScope, ReportStatus } from './common';

/** Scientific / performance report. Collection: `reports/{id}`. */
export interface Report extends CloudDocumentMeta {
  organization_id: string;
  title: string;
  type: ReportScope;
  status: ReportStatus;
  summary: string;
  athlete_id?: string;
  team_id?: string;
  sections: Record<string, string>;
  builder_meta?: Record<string, unknown>;
}

export type ReportInput = Omit<Report, keyof CloudDocumentMeta>;
