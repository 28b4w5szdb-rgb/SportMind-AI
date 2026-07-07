/**
 * SSDI privacy policy — PII patterns and forbidden prompt content (Phase 9.2).
 */

import type { PromptSafetyReason } from './privacyModels';

export const PLACEHOLDER_PREFIX: Record<string, string> = {
  ATHLETE: 'ATHLETE',
  TEAM: 'TEAM',
  ORG: 'ORG',
  COACH: 'COACH',
  RESEARCHER: 'RESEARCHER',
  PHYSICIAN: 'PHYSICIAN',
  PHYSIOTHERAPIST: 'PHYSIOTHERAPIST',
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  ADDRESS: 'ADDRESS',
  LOCATION: 'LOCATION',
  DOB: 'DOB',
  PASSPORT: 'PASSPORT',
  NATIONAL_ID: 'NATIONAL_ID',
  MEDICAL_RECORD: 'MRN',
  CUSTOM_ID: 'ID',
};

/** Regex patterns for automatic PII detection in free text. */
export const PII_PATTERNS: Array<{ category: keyof typeof PLACEHOLDER_PREFIX; pattern: RegExp }> = [
  { category: 'EMAIL', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
  { category: 'PHONE', pattern: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g },
  { category: 'DOB', pattern: /\b(?:19|20)\d{2}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\d|3[01])\b/g },
  { category: 'PASSPORT', pattern: /\b[A-Z]{1,2}\d{6,9}\b/g },
  { category: 'NATIONAL_ID', pattern: /\b\d{9,14}\b/g },
  { category: 'MEDICAL_RECORD', pattern: /\bMRN[-:\s]?\d{4,10}\b/gi },
  { category: 'LOCATION', pattern: /\b(?:lat|lng|latitude|longitude)[:\s]+-?\d+\.\d+\b/gi },
  { category: 'ADDRESS', pattern: /\b\d{1,5}\s+[A-Za-z\u0600-\u06FF\s]{3,40}(?:Street|St|Road|Rd|Avenue|Ave| Blvd)\b/gi },
];

export interface PromptSafetyRule {
  reason: PromptSafetyReason;
  pattern: RegExp;
  message_en: string;
  message_ar: string;
}

export const PROMPT_SAFETY_RULES: PromptSafetyRule[] = [
  {
    reason: 'diagnosis_request',
    pattern: /(?:^|[\s,.!?])(diagnos(e|is|ing)\b|what disease|what condition do i have|تشخيص|ما المرض|التشخيص)(?:[\s,.!?]|$)/i,
    message_en: 'Prompt requests medical diagnosis — not permitted.',
    message_ar: 'الطلب يتضمن تشخيصاً طبياً — غير مسموح.',
  },
  {
    reason: 'medication_request',
    pattern: /\b(prescrib(e|ing)|medication|antibiotic|dosage|drug for|وصف دواء|جرعة|دواء)\b/i,
    message_en: 'Prompt requests medication advice — not permitted.',
    message_ar: 'الطلب يتضمن وصف دواء — غير مسموح.',
  },
  {
    reason: 'fabricated_laboratory',
    pattern: /\b(invent lab|make up lab|fake blood test|fabricate mri|اختراع نتائج|تزوير مختبر)\b/i,
    message_en: 'Prompt requests fabricated laboratory values.',
    message_ar: 'الطلب يطلب تزييف نتائج مختبرية.',
  },
  {
    reason: 'fabricated_evidence',
    pattern: /\b(invent evidence|fake study|make up citation|cite fake|أدلة مزيفة|دراسة وهمية)\b/i,
    message_en: 'Prompt requests fabricated scientific evidence.',
    message_ar: 'الطلب يطلب أدلة علمية مزيفة.',
  },
  {
    reason: 'override_scientific_core',
    pattern: /\b(ignore scientific core|override calculation|recalculate bmi|skip ssid|تجاهل الحسابات|تخطي SSID)\b/i,
    message_en: 'Prompt attempts to override Scientific Core calculations.',
    message_ar: 'الطلب يحاول تجاوز الحسابات العلمية.',
  },
  {
    reason: 'hidden_rbac_exposure',
    pattern: /\b(hidden permission|rbac field|role_ids|permission_ids|membership secret|صلاحيات مخفية)\b/i,
    message_en: 'Prompt requests hidden RBAC fields.',
    message_ar: 'الطلب يطلب حقول صلاحيات مخفية.',
  },
  {
    reason: 'confidential_medical',
    pattern: /\b(confidential medical|private health record|hipaa|patient ssn|سجل طبي سري)\b/i,
    message_en: 'Prompt requests confidential medical information.',
    message_ar: 'الطلب يطلب معلومات طبية سرية.',
  },
  {
    reason: 'governance_bypass',
    pattern: /\b(bypass governance|skip validation|ignore safety layer|تجاوز الحوكمة|تخطي التحقق)\b/i,
    message_en: 'Prompt attempts to bypass governance.',
    message_ar: 'الطلب يحاول تجاوز الحوكمة.',
  },
  {
    reason: 'evidence_requirement_bypass',
    pattern: /\b(no evidence needed|skip evidence|without proof|بدون أدلة|تخطي الأدلة)\b/i,
    message_en: 'Prompt attempts to bypass evidence requirements.',
    message_ar: 'الطلب يحاول تجاوز متطلبات الأدلة.',
  },
  {
    reason: 'forbidden_internal_path',
    pattern: /\b(organizations\/|firestore\/|role_views\/|\/memberships\/|gs:\/\/)\b/i,
    message_en: 'Prompt contains internal database paths.',
    message_ar: 'الطلب يحتوي على مسارات قاعدة بيانات داخلية.',
  },
  {
    reason: 'forbidden_raw_document',
    pattern: /\b(raw firestore|full document dump|export all records|تصدير كل السجلات)\b/i,
    message_en: 'Prompt requests raw document exposure.',
    message_ar: 'الطلب يطلب كشف مستندات خام.',
  },
];

export const DEFAULT_ALLOWED_CATEGORIES = [
  'training',
  'recovery',
  'readiness',
  'monitoring',
  'testing',
  'nutrition',
  'hydration',
  'injury_risk',
  'return_to_play',
  'travel',
  'sleep',
  'workload',
  'sports_medicine',
  'research_notes',
] as const;
