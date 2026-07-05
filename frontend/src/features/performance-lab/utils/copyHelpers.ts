import type { TestCopyBundle, TestDefinition, BilingualText } from '../types';

type CopyField = keyof TestCopyBundle;

export function getTestText(def: TestDefinition, field: CopyField, isRTL: boolean): string {
  const bundle = def.copy[field];
  if (bundle && typeof bundle === 'object' && 'en' in bundle) {
    return isRTL ? bundle.ar : bundle.en;
  }
  return '';
}

export function getTestName(def: TestDefinition, isRTL: boolean): string {
  return getTestText(def, 'name', isRTL);
}

export function matchesLibraryQuery(def: TestDefinition, query: string, isRTL: boolean): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    def.key,
    getTestName(def, false),
    getTestName(def, true),
    getTestText(def, 'description', false),
    getTestText(def, 'purpose', false),
    def.unit,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function mergeCopy(base: BilingualText, override?: Partial<BilingualText>): BilingualText {
  return { en: override?.en ?? base.en, ar: override?.ar ?? base.ar };
}
