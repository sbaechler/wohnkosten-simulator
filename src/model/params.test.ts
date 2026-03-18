import { describe, it, expect } from 'vitest';
import { computeDiff, hasChanges } from './params';
import type { CityParams } from '../types';

const base: CityParams = {
  raumplanung: 2, bauvorschriften: 2, energetischeVorgaben: 1,
  mietrecht: 1, steuerpolitik: 2, foerderungGemeinnuetzig: 2,
  subventionen: 1, einspracherechte: 2, infrastruktur: 2,
  auslaendischeInvestitionen: 1,
};

describe('computeDiff', () => {
  it('returns empty diff when params are identical', () => {
    expect(computeDiff(base, { ...base })).toEqual({});
  });

  it('returns changed params only', () => {
    const modified = { ...base, raumplanung: 0 as const, mietrecht: 2 as const };
    const diff = computeDiff(base, modified);
    expect(diff).toEqual({
      raumplanung: { from: 2, to: 0 },
      mietrecht: { from: 1, to: 2 },
    });
  });
});

describe('hasChanges', () => {
  it('returns false for identical params', () => {
    expect(hasChanges(base, { ...base })).toBe(false);
  });

  it('returns true when any param differs', () => {
    expect(hasChanges(base, { ...base, steuerpolitik: 0 as const })).toBe(true);
  });
});
