/**
 * Export pipeline — evidence filter stage (Phase 7.3).
 */

import type { ScientificReport, ScientificReportSection } from '../../models/report';
import type { ExportFormat } from '../models/ExportDomain';

const CLINICAL_FORMATS: ExportFormat[] = ['pdf', 'word', 'print'];
const RESEARCH_FORMATS: ExportFormat[] = ['json_archive', 'research_dataset', 'api_payload'];

/** Apply evidence-tier language constraints per export format. */
export function applyExportEvidenceFilter(
  report: ScientificReport,
  format: ExportFormat
): ScientificReport {
  const tier = report.evidence_summary.primary_tier;

  const sections = report.sections.map((section) => {
    if (format === 'research_dataset' && section.section_id === 'athlete_profile') {
      return redactForResearch(section);
    }
    if (RESEARCH_FORMATS.includes(format) && tier === 'screening') {
      return appendCaution(section);
    }
    if (CLINICAL_FORMATS.includes(format) && section.evidence_tier === 'clinical') {
      return appendClinicalNote(section);
    }
    return section;
  });

  return { ...report, sections };
}

function redactForResearch(section: ScientificReportSection): ScientificReportSection {
  return {
    ...section,
    body: {
      en: 'De-identified participant profile.',
      ar: 'ملف مشارك مجهول الهوية.',
    },
  };
}

function appendCaution(section: ScientificReportSection): ScientificReportSection {
  const note = {
    en: ' (Screening-level — export for orientation only.)',
    ar: ' (مستوى فحص أولي — للتوجيه فقط.)',
  };
  return {
    ...section,
    body: { en: section.body.en + note.en, ar: section.body.ar + note.ar },
  };
}

function appendClinicalNote(section: ScientificReportSection): ScientificReportSection {
  const note = {
    en: ' Clinical disclaimer applies.',
    ar: ' ينطبق إخلاء المسؤولية السريرية.',
  };
  return {
    ...section,
    body: { en: section.body.en + note.en, ar: section.body.ar + note.ar },
  };
}
