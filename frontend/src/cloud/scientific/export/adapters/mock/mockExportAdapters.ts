/**
 * Mock export adapters — metadata only, no file generation (Phase 7.3).
 */

import type { ExportAdapter, ExportAdapterInput } from '../contracts/ExportAdapter';
import type { ExportArtifact, ExportFormat } from '../../models/ExportDomain';

const MIME_PLACEHOLDERS: Record<ExportFormat, string> = {
  pdf: 'application/pdf',
  word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  print: 'text/html',
  share: 'text/plain',
  json_archive: 'application/json',
  research_dataset: 'application/json',
  api_payload: 'application/json',
};

const EXTENSIONS: Record<ExportFormat, string> = {
  pdf: 'pdf',
  word: 'docx',
  excel: 'xlsx',
  print: 'html',
  share: 'txt',
  json_archive: 'json',
  research_dataset: 'json',
  api_payload: 'json',
};

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function createMockAdapter(format: ExportFormat): ExportAdapter {
  return {
    format,
    async prepare(input: ExportAdapterInput): Promise<ExportArtifact> {
      const { request, job, document } = input;
      const ext = EXTENSIONS[format];
      const baseName = `sportmind_report_${document.report_id}`;

      return {
        artifact_id: `artifact_${job.job_id}_${format}`,
        job_id: job.job_id,
        format,
        template_id: request.template_id,
        locale_mode: request.locale_mode,
        section_count: document.blocks.length,
        page_count_estimate: Math.max(1, Math.ceil(document.blocks.length / 4)),
        file_name_placeholder: `${baseName}.${ext}`,
        mime_type_placeholder: MIME_PLACEHOLDERS[format],
        content_hash: simpleHash(JSON.stringify({ format, blocks: document.blocks.length })),
        prepared_at: new Date().toISOString(),
        disclaimer: {
          en: 'Export prepared — format rendering coming soon. No file generated.',
          ar: 'تم تجهيز التصدير — عرض الصيغة قريباً. لم يتم إنشاء ملف.',
        },
        file_url: null,
      };
    },
  };
}

export const PdfExportAdapter = createMockAdapter('pdf');
export const WordExportAdapter = createMockAdapter('word');
export const ExcelExportAdapter = createMockAdapter('excel');
export const PrintExportAdapter = createMockAdapter('print');
export const ShareExportAdapter = createMockAdapter('share');
export const JsonArchiveAdapter = createMockAdapter('json_archive');
export const ResearchDatasetAdapter = createMockAdapter('research_dataset');
export const ApiPayloadAdapter = createMockAdapter('api_payload');

export const MOCK_EXPORT_ADAPTERS: ExportAdapter[] = [
  PdfExportAdapter,
  WordExportAdapter,
  ExcelExportAdapter,
  PrintExportAdapter,
  ShareExportAdapter,
  JsonArchiveAdapter,
  ResearchDatasetAdapter,
  ApiPayloadAdapter,
];

export function createMockExportAdapterRegistry(): import('../contracts/ExportAdapter').ExportAdapterRegistry {
  const map = new Map<ExportFormat, ExportAdapter>(MOCK_EXPORT_ADAPTERS.map((a) => [a.format, a]));
  return {
    getAdapter(format: ExportFormat) {
      return map.get(format) ?? null;
    },
    listFormats() {
      return [...map.keys()];
    },
  };
}
