/** Knowledge articles placeholder — titles resolved via i18n keys. */

export const KNOWLEDGE_ARTICLES: Record<string, Array<{ id: string; readMin: number }>> = {
  testing: [
    { id: 't1', readMin: 8 },
    { id: 't2', readMin: 6 },
  ],
  training: [
    { id: 'tr1', readMin: 5 },
    { id: 'tr2', readMin: 10 },
  ],
  recovery: [
    { id: 'r1', readMin: 7 },
    { id: 'r2', readMin: 6 },
  ],
  nutrition: [
    { id: 'n1', readMin: 5 },
    { id: 'n2', readMin: 4 },
  ],
};
