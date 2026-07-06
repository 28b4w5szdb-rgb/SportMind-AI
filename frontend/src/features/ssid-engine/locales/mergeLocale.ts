/** Deep-merge SSID locale trees (English base + Arabic overrides). */
export function deepMergeLocale<T extends Record<string, unknown>>(base: T, override?: Partial<T>): T {
  if (!override) return base;
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const b = base[key];
    const o = override[key];
    if (b && o && typeof b === 'object' && typeof o === 'object' && !Array.isArray(b)) {
      out[key] = deepMergeLocale(b as Record<string, unknown>, o as Record<string, unknown>);
    } else if (o !== undefined) {
      out[key] = o;
    }
  }
  return out as T;
}
