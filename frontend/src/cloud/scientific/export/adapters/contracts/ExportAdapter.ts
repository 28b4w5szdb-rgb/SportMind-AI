/**
 * Export adapter contract (Phase 7.3).
 *
 * Format adapters produce metadata artifacts only — no real file generation.
 */

import type { ExportArtifact, ExportFormat, ExportJob, ExportRequest } from '../../models/ExportDomain';
import type { FormattedExportDocument } from '../../formatting/reportFormatter';

export interface ExportAdapterInput {
  request: ExportRequest;
  job: ExportJob;
  document: FormattedExportDocument;
}

export interface ExportAdapter {
  readonly format: ExportFormat;
  prepare(input: ExportAdapterInput): Promise<ExportArtifact>;
}

export interface ExportAdapterRegistry {
  getAdapter(format: ExportFormat): ExportAdapter | null;
  listFormats(): ExportFormat[];
}
