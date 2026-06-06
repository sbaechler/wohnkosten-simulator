/**
 * belastung.test.ts — Blackbox-Tests für Belastungs-Berechnungen
 *
 * Testet die öffentliche API von belastung.ts über beobachtbares Verhalten
 * (Ranges, Monotonie, Edge-Cases). KEINE Kopplung an interne Konstanten
 * wie MIETBELASTUNG_SENSITIVITY — Implementation darf refactored werden
 * (andere Gewichte, andere Formel), solange das dokumentierte Verhalten
 * erhalten bleibt.
 *
 * Dokumentiertes Verhalten:
 *   - Mietbelastung: %-Anteil am Bruttohaushaltseinkommen, in [20, 70]%
 *   - Eigentum-Belastung: inkl. Opportunitätskosten, in [10, 45]%
 *   - belastungLevel(p): 0|1|2 je nach Schwellwert 30% / 45%
 *
 * Quelle (Kalibrierung): WOHNMONITOR.admin.ch (BWO 2026), Sotomo 2025.
 */

import { describe, it, expect } from 'vitest';
import {
  computeMieteBelastung,
  computeEigentumBelastung,
  belastungLevel,
} from '../../belastung';
import type { MarketState } from '../../../types';

const emptyState: MarketState = {
  angebotspotenzial: 0,
  nachfragedruck: 0,
  mietpreis_schutzlevel: 0,
  verdraengungsrisiko: 0,
  spekulationshemmung: 0,
  markfriktion: 0,
  gemeinnuetzig_kraft: 0,
  eigentumsquoten_trend: 0,
  aufwertungsdruck: 0,
  investitionsattraktivitaet: 0,
  angebotspotenzial_regulation: 0,
};

const allPositive: MarketState = {
  angebotspotenzial: 1, nachfragedruck: 1, mietpreis_schutzlevel: 1,
  verdraengungsrisiko: 1, spekulationshemmung: 1, markfriktion: 1,
  gemeinnuetzig_kraft: 1, eigentumsquoten_trend: 1, aufwertungsdruck: 1,
  investitionsattraktivitaet: 1, angebotspotenzial_regulation: 1,
};

const allNegative: MarketState = {
  angebotspotenzial: -1, nachfragedruck: -1, mietpreis_schutzlevel: -1,
  verdraengungsrisiko: -1, spekulationshemmung: -1, markfriktion: -1,
  gemeinnuetzig_kraft: -1, eigentumsquoten_trend: -1, aufwertungsdruck: -1,
  investitionsattraktivitaet: -1, angebotspotenzial_regulation: -1,
};

describe('computeMieteBelastung', () => {
  it('returns a finite number in [20, 70] for any input', () => {
    for (const s of [undefined, emptyState, allPositive, allNegative]) {
      const result = computeMieteBelastung(s);
      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(20);
      expect(result).toBeLessThanOrEqual(70);
    }
  });

  it('returns the same value for undefined and all-zero state (baseline)', () => {
    expect(computeMieteBelastung(undefined)).toBe(computeMieteBelastung(emptyState));
  });

  it('baseline is positive and in valid range (CH Mieter tiefes Einkommen)', () => {
    const baseline = computeMieteBelastung(undefined);
    expect(baseline).toBeGreaterThan(20);
    expect(baseline).toBeLessThan(70);
  });

  it('increases monotonically with nachfragedruck', () => {
    const low  = computeMieteBelastung({ ...emptyState, nachfragedruck: -1 });
    const mid  = computeMieteBelastung({ ...emptyState, nachfragedruck:  0 });
    const high = computeMieteBelastung({ ...emptyState, nachfragedruck:  1 });
    expect(mid).toBeGreaterThan(low);
    expect(high).toBeGreaterThan(mid);
  });

  it('decreases monotonically with angebotspotenzial (mehr Angebot = weniger Belastung)', () => {
    const low  = computeMieteBelastung({ ...emptyState, angebotspotenzial: -1 });
    const mid  = computeMieteBelastung({ ...emptyState, angebotspotenzial:  0 });
    const high = computeMieteBelastung({ ...emptyState, angebotspotenzial:  1 });
    expect(mid).toBeLessThan(low);
    expect(high).toBeLessThan(mid);
  });

  it('decreases monotonically with mietpreis_schutzlevel', () => {
    const low  = computeMieteBelastung({ ...emptyState, mietpreis_schutzlevel: -1 });
    const mid  = computeMieteBelastung({ ...emptyState, mietpreis_schutzlevel:  0 });
    const high = computeMieteBelastung({ ...emptyState, mietpreis_schutzlevel:  1 });
    expect(mid).toBeLessThan(low);
    expect(high).toBeLessThan(mid);
  });

  it('increases monotonically with markfriktion', () => {
    const low  = computeMieteBelastung({ ...emptyState, markfriktion: -1 });
    const mid  = computeMieteBelastung({ ...emptyState, markfriktion:  0 });
    const high = computeMieteBelastung({ ...emptyState, markfriktion:  1 });
    expect(mid).toBeGreaterThan(low);
    expect(high).toBeGreaterThan(mid);
  });

  it('clamps to upper bound [70] under extreme pressure', () => {
    const extreme: MarketState = {
      ...emptyState,
      nachfragedruck: 5, markfriktion: 5,
    };
    expect(computeMieteBelastung(extreme)).toBeLessThanOrEqual(70);
  });

  it('clamps to lower bound [20] under extreme relief', () => {
    const extreme: MarketState = {
      ...emptyState,
      nachfragedruck: -5, angebotspotenzial: 5, mietpreis_schutzlevel: 5,
    };
    expect(computeMieteBelastung(extreme)).toBeGreaterThanOrEqual(20);
  });
});

describe('computeEigentumBelastung', () => {
  it('returns a finite number in [10, 45] for any input', () => {
    for (const s of [undefined, emptyState, allPositive, allNegative]) {
      const result = computeEigentumBelastung(s);
      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThanOrEqual(45);
    }
  });

  it('returns the same value for undefined and all-zero state (baseline)', () => {
    expect(computeEigentumBelastung(undefined)).toBe(computeEigentumBelastung(emptyState));
  });

  it('baseline is positive and in valid range (CH Eigentum inkl. Opp.kosten)', () => {
    const baseline = computeEigentumBelastung(undefined);
    expect(baseline).toBeGreaterThan(10);
    expect(baseline).toBeLessThan(45);
  });

  it('increases monotonically with nachfragedruck', () => {
    const low  = computeEigentumBelastung({ ...emptyState, nachfragedruck: -1 });
    const mid  = computeEigentumBelastung({ ...emptyState, nachfragedruck:  0 });
    const high = computeEigentumBelastung({ ...emptyState, nachfragedruck:  1 });
    expect(mid).toBeGreaterThan(low);
    expect(high).toBeGreaterThan(mid);
  });

  it('decreases monotonically with investmentsattraktivitaet', () => {
    const low  = computeEigentumBelastung({ ...emptyState, investitionsattraktivitaet: -1 });
    const mid  = computeEigentumBelastung({ ...emptyState, investitionsattraktivitaet:  0 });
    const high = computeEigentumBelastung({ ...emptyState, investitionsattraktivitaet:  1 });
    expect(mid).toBeLessThan(low);
    expect(high).toBeLessThan(mid);
  });

  it('clamps to upper bound [45] under extreme pressure', () => {
    const extreme: MarketState = { ...emptyState, nachfragedruck: 10 };
    expect(computeEigentumBelastung(extreme)).toBeLessThanOrEqual(45);
  });

  it('clamps to lower bound [10] under extreme relief', () => {
    const extreme: MarketState = { ...emptyState, investmentsattraktivitaet: 10 };
    expect(computeEigentumBelastung(extreme)).toBeGreaterThanOrEqual(10);
  });
});

describe('belastungLevel', () => {
  it('returns 0 for low pct (< 30)', () => {
    expect(belastungLevel(0)).toBe(0);
    expect(belastungLevel(20)).toBe(0);
    expect(belastungLevel(29.99)).toBe(0);
  });

  it('returns 1 for medium pct (30 to < 45)', () => {
    expect(belastungLevel(30)).toBe(1);
    expect(belastungLevel(35)).toBe(1);
    expect(belastungLevel(44.99)).toBe(1);
  });

  it('returns 2 for high pct (>= 45)', () => {
    expect(belastungLevel(45)).toBe(2);
    expect(belastungLevel(50)).toBe(2);
    expect(belastungLevel(70)).toBe(2);
  });

  it('is monotonic non-decreasing in input', () => {
    const levels = [10, 25, 30, 35, 45, 50, 70].map(belastungLevel);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]).toBeGreaterThanOrEqual(levels[i - 1]);
    }
  });
});
