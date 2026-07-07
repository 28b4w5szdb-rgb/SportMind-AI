/**
 * Export template metadata registry (Phase 7.3).
 */

import type { ExportTemplate, ExportTemplateId } from '../models/ExportDomain';

function bi(en: string, ar: string) {
  return { en, ar };
}

export const EXPORT_TEMPLATES: Record<ExportTemplateId, ExportTemplate> = {
  club_standard: {
    template_id: 'club_standard',
    label: bi('Club Standard', 'معيار النادي'),
    default_sections: [
      'cover',
      'executive_summary',
      'athlete_profile',
      'performance_summary',
      'recommendations',
      'signature',
    ],
    branding_slots: ['club_logo', 'club_name', 'accent_color'],
    page_orientation: 'portrait',
    locale_mode: 'bilingual',
    visibility_profile: 'coach',
    accent_color: '#0066FF',
  },
  university: {
    template_id: 'university',
    label: bi('University', 'جامعي'),
    default_sections: [
      'cover',
      'executive_summary',
      'athlete_profile',
      'assessment_results',
      'normative_comparison',
      'references',
      'signature',
    ],
    branding_slots: ['institution_logo', 'department', 'accent_color'],
    page_orientation: 'portrait',
    locale_mode: 'bilingual',
    visibility_profile: 'sports_scientist',
    accent_color: '#6366F1',
  },
  research: {
    template_id: 'research',
    label: bi('Research', 'بحثي'),
    default_sections: [
      'cover',
      'executive_summary',
      'assessment_results',
      'normative_comparison',
      'ssid_interpretation',
      'references',
      'evidence_limitations',
    ],
    branding_slots: ['study_id', 'protocol_ref'],
    page_orientation: 'portrait',
    locale_mode: 'en',
    visibility_profile: 'research',
    accent_color: '#64748B',
  },
  sports_medicine: {
    template_id: 'sports_medicine',
    label: bi('Sports Medicine', 'طب رياضي'),
    default_sections: [
      'cover',
      'executive_summary',
      'athlete_profile',
      'injury_medical_summary',
      'recovery_summary',
      'recommendations',
      'evidence_limitations',
      'signature',
    ],
    branding_slots: ['clinic_logo', 'medical_disclaimer'],
    page_orientation: 'portrait',
    locale_mode: 'bilingual',
    visibility_profile: 'clinical',
    accent_color: '#0D9488',
  },
  executive_summary: {
    template_id: 'executive_summary',
    label: bi('Executive Summary', 'ملخص تنفيذي'),
    default_sections: ['cover', 'executive_summary', 'recommendations', 'signature'],
    branding_slots: ['org_logo'],
    page_orientation: 'portrait',
    locale_mode: 'bilingual',
    visibility_profile: 'coach',
    accent_color: '#8B5CF6',
  },
};

export function resolveExportTemplate(templateId: ExportTemplateId): ExportTemplate {
  return EXPORT_TEMPLATES[templateId];
}
