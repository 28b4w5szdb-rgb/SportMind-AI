/**
 * Evidence language unit tests (Phase 7.0).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  applyEvidenceLanguage,
  evidenceTierDisclaimer,
  resolvePrimaryEvidenceTier,
  buildEvidenceSummary,
} from '../evidenceLanguage';

describe('evidenceLanguage', () => {
  it('applies screening prefix without overclaiming', () => {
    const result = applyEvidenceLanguage({ en: 'Score is elevated.', ar: 'النتيجة مرتفعة.' }, 'screening');
    assert.ok(result.en.startsWith('Preliminary indication:'));
    assert.ok(result.ar.includes('مؤشر أولي'));
  });

  it('provides clinical disclaimer', () => {
    const d = evidenceTierDisclaimer('clinical');
    assert.ok(d.en.includes('clinical') || d.en.includes('Clinical'));
    assert.ok(d.ar.length > 0);
  });

  it('resolves primary tier by rigor order', () => {
    assert.equal(resolvePrimaryEvidenceTier(['screening', 'professional']), 'professional');
    assert.equal(resolvePrimaryEvidenceTier(['field', 'research', 'clinical']), 'clinical');
  });

  it('builds evidence summary with protocol refs', () => {
    const summary = buildEvidenceSummary(['field', 'professional'], 5, ['sprint30']);
    assert.equal(summary.source_count, 5);
    assert.deepEqual(summary.protocol_refs, ['sprint30']);
  });
});
