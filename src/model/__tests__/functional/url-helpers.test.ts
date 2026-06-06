/**
 * url-helpers.test.ts — Blackbox-Tests für URL-State-Helpers
 *
 * Testet die öffentliche API von url-helpers.ts:
 *   - clampParam: rundet + clamp'd eine Zahl in {0, 1, 2}
 *   - PARAM_KEYS_40_SET: Set-Form von PARAM_KEYS_40
 *
 * KEINE Kopplung an interne Implementation — Tests bleiben grün, solange
 * die dokumentierten Verhaltens-Invarianten (Wertebereich, Rundung)
 * erhalten bleiben.
 */

import { describe, it, expect } from 'vitest';
import { clampParam, PARAM_KEYS_40_SET } from '../../url-helpers';
import { PARAM_KEYS_40 } from '../../params';

describe('clampParam', () => {
  it('returns 0 for values in [-Infinity, 0.5)', () => {
    expect(clampParam(-100)).toBe(0);
    expect(clampParam(-1)).toBe(0);
    expect(clampParam(0)).toBe(0);
    expect(clampParam(0.4)).toBe(0);
  });

  it('returns 1 for values in [0.5, 1.5)', () => {
    expect(clampParam(0.5)).toBe(1);
    expect(clampParam(1)).toBe(1);
    expect(clampParam(1.4)).toBe(1);
  });

  it('returns 2 for values in [1.5, Infinity]', () => {
    expect(clampParam(1.5)).toBe(2);
    expect(clampParam(2)).toBe(2);
    expect(clampParam(100)).toBe(2);
  });

  it('result is always a valid ParamValue (0 | 1 | 2)', () => {
    for (const v of [-5, -0.3, 0, 0.4, 0.6, 1, 1.4, 1.6, 2, 5]) {
      const result = clampParam(v);
      expect([0, 1, 2]).toContain(result);
    }
  });
});

describe('PARAM_KEYS_40_SET', () => {
  it('has the same size as PARAM_KEYS_40 (no duplicates lost in Set conversion)', () => {
    expect(PARAM_KEYS_40_SET.size).toBe(PARAM_KEYS_40.length);
  });

  it('has no duplicates (Set semantics matches input array)', () => {
    expect(PARAM_KEYS_40_SET.size).toBe(new Set(PARAM_KEYS_40).size);
  });

  it('contains every key from PARAM_KEYS_40', () => {
    for (const key of PARAM_KEYS_40) {
      expect(PARAM_KEYS_40_SET.has(key)).toBe(true);
    }
  });

  it('all entries are non-empty strings', () => {
    for (const key of PARAM_KEYS_40_SET) {
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    }
  });
});
