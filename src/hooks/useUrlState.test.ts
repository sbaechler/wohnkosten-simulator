import { describe, it, expect } from 'vitest';
import { parseUrl, buildUrl } from './useUrlState';

describe('parseUrl', () => {
  it('parses city slug from pathname', () => {
    const result = parseUrl('/zuerich', '');
    expect(result.citySlug).toBe('zuerich');
  });

  it('parses param overrides from query string', () => {
    const result = parseUrl('/zuerich', 'raumplanung=0&mietrecht=2');
    expect(result.overrides).toEqual({ raumplanung: 0, mietrecht: 2 });
  });

  it('returns empty slug for root path', () => {
    const result = parseUrl('/', '');
    expect(result.citySlug).toBe('');
  });

  it('ignores invalid param names', () => {
    const result = parseUrl('/zuerich', 'invalid=1&raumplanung=0');
    expect(result.overrides).toEqual({ raumplanung: 0 });
  });

  it('clamps param values to 0-2', () => {
    const result = parseUrl('/zuerich', 'raumplanung=5');
    expect(result.overrides).toEqual({ raumplanung: 2 });
  });
});

describe('buildUrl', () => {
  it('returns slug path with no query when no overrides', () => {
    expect(buildUrl('zuerich', {})).toBe('/zuerich');
  });

  it('appends only changed params as query', () => {
    expect(buildUrl('zuerich', { raumplanung: 0 })).toBe('/zuerich?raumplanung=0');
  });
});
