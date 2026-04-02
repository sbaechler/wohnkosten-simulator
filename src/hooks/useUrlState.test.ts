import { describe, it, expect } from 'vitest';
import { parseUrl, buildUrl } from './useUrlState';

describe('parseUrl (V2)', () => {
  it('parses city slug from pathname', () => {
    const result = parseUrl('/zuerich', '');
    expect(result.citySlug).toBe('zuerich');
  });

  it('parses V2 param overrides directly', () => {
    const result = parseUrl('/zuerich', 'raumplanung_zonenreserve=0&mietrecht_kostenmiete=2');
    expect(result.overrides).toEqual({
      raumplanung_zonenreserve: 0,
      mietrecht_kostenmiete: 2,
    });
  });



  it('returns empty slug for root path', () => {
    const result = parseUrl('/', '');
    expect(result.citySlug).toBe('');
  });

  it('ignores invalid param names', () => {
    const result = parseUrl('/zuerich', 'invalid=1&mietrecht_kostenmiete=0');
    expect(result.overrides).toEqual({ mietrecht_kostenmiete: 0 });
  });

  it('clamps param values to 0-2', () => {
    const result = parseUrl('/zuerich', 'mietrecht_kostenmiete=5');
    expect(result.overrides).toEqual({ mietrecht_kostenmiete: 2 });
  });
});

describe('buildUrl (V2)', () => {
  it('returns slug path with no query when no overrides', () => {
    expect(buildUrl('zuerich', {})).toBe('/zuerich');
  });

  it('appends only changed params as query', () => {
    expect(buildUrl('zuerich', { raumplanung_zonenreserve: 0 })).toBe('/zuerich?raumplanung_zonenreserve=0');
  });
});
