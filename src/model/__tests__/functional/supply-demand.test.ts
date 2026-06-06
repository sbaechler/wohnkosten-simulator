/**
 * supply-demand.test.ts — Blackbox-Tests für Preis-Mengen-Diagramm
 *
 * Testet die öffentliche API von supply-demand.ts über beobachtbares
 * Verhalten. KEINE Kopplung an interne Konstanten wie
 * KNAPPHEIT_GEWICHTE, CURVE_POINTS, AXIS_MIN/MAX (ausser für invariante
 * Bounds, die in der UI gerendert werden).
 *
 * Dokumentiertes Verhalten:
 *   - knappheitSignal: Rohwert, Vorzeichen-abhängig von E1-Faktoren
 *   - regulationEffective: in [-1, 1] (UI-clamped)
 *   - supplyCurve / demandCurve: Punkte-Arrays, q monoton steigend,
 *     p im Achsenbereich
 *   - findEquilibrium: [q, p] im Achsenbereich
 *
 * Quelle (Kalibrierung): Wohnmonitor.admin.ch (BWO), UK-001 Crossrail.
 */

import { describe, it, expect } from 'vitest';
import {
  knappheitSignal,
  regulationEffective,
  supplySlope,
  supplyCurve,
  demandCurve,
  findEquilibrium,
} from '../../supply-demand';
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

describe('knappheitSignal', () => {
  it('returns 0 for all-zero state (keine Knappheitssignale)', () => {
    expect(knappheitSignal(emptyState)).toBe(0);
  });

  it('is positive when demand pressure dominates (knapper Markt)', () => {
    const tight: MarketState = {
      ...emptyState,
      nachfragedruck: 1, markfriktion: 1,
    };
    expect(knappheitSignal(tight)).toBeGreaterThan(0);
  });

  it('is negative when supply / gemeinnützig dominate (entspannter Markt)', () => {
    const loose: MarketState = {
      ...emptyState,
      angebotspotenzial: 1, gemeinnuetzig_kraft: 1,
    };
    expect(knappheitSignal(loose)).toBeLessThan(0);
  });

  it('increases monotonically with nachfragedruck', () => {
    const a = knappheitSignal({ ...emptyState, nachfragedruck: -1 });
    const b = knappheitSignal({ ...emptyState, nachfragedruck:  0 });
    const c = knappheitSignal({ ...emptyState, nachfragedruck:  1 });
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
  });

  it('decreases monotonically with angebotspotenzial (mehr Angebot = weniger knapp)', () => {
    const a = knappheitSignal({ ...emptyState, angebotspotenzial: -1 });
    const b = knappheitSignal({ ...emptyState, angebotspotenzial:  0 });
    const c = knappheitSignal({ ...emptyState, angebotspotenzial:  1 });
    expect(b).toBeLessThan(a);
    expect(c).toBeLessThan(b);
  });

  it('returns a raw (unclamped) value — can exceed ±1 for extreme inputs', () => {
    const extreme: MarketState = { ...emptyState, nachfragedruck: 5 };
    expect(Math.abs(knappheitSignal(extreme))).toBeGreaterThan(1);
  });
});

describe('regulationEffective', () => {
  it('returns baseReg when state is neutral', () => {
    expect(regulationEffective(0.5, emptyState)).toBeCloseTo(0.5, 10);
  });

  it('clamps to [-1, 1] under extreme baseReg', () => {
    expect(regulationEffective(2, emptyState)).toBeLessThanOrEqual(1);
    expect(regulationEffective(-2, emptyState)).toBeGreaterThanOrEqual(-1);
  });

  it('increases when state pushes toward knapp (Regulation verstärkt)', () => {
    const neutral = regulationEffective(0, emptyState);
    const tight   = regulationEffective(0, { ...emptyState, nachfragedruck: 1, markfriktion: 1 });
    expect(tight).toBeGreaterThan(neutral);
  });

  it('decreases when state pushes toward entspannt (Regulation schwächt)', () => {
    const neutral = regulationEffective(0, emptyState);
    const loose   = regulationEffective(0, { ...emptyState, angebotspotenzial: 1, gemeinnuetzig_kraft: 1 });
    expect(loose).toBeLessThan(neutral);
  });
});

describe('supplySlope', () => {
  it('returns a positive number for any input in [-1, 1] (steil > 0)', () => {
    for (const reg of [-1, -0.5, 0, 0.5, 1]) {
      expect(supplySlope(reg)).toBeGreaterThan(0);
    }
  });

  it('increases monotonically with regEff (mehr Regulation = steiler)', () => {
    expect(supplySlope(0.5)).toBeGreaterThan(supplySlope(0));
    expect(supplySlope(1)).toBeGreaterThan(supplySlope(0.5));
  });

  it('decreases monotonically with regEff (weniger Regulation = flacher)', () => {
    expect(supplySlope(-0.5)).toBeLessThan(supplySlope(0));
    expect(supplySlope(-1)).toBeLessThan(supplySlope(-0.5));
  });
});

describe('supplyCurve', () => {
  it('returns a non-empty array of [q, p] tuples', () => {
    const curve = supplyCurve(0, 0, emptyState);
    expect(curve.length).toBeGreaterThan(0);
    for (const [q, p] of curve) {
      expect(typeof q).toBe('number');
      expect(typeof p).toBe('number');
      expect(Number.isFinite(q)).toBe(true);
      expect(Number.isFinite(p)).toBe(true);
    }
  });

  it('q values are monotonically non-decreasing', () => {
    const curve = supplyCurve(0, 0, emptyState);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i][0]).toBeGreaterThanOrEqual(curve[i - 1][0]);
    }
  });

  it('all p values are within a finite, positive range (UI-achse)', () => {
    const curve = supplyCurve(0, 0, emptyState);
    for (const [, p] of curve) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(10);
    }
  });

  it('positive supply shift moves the curve (q for given p changes)', () => {
    const a = supplyCurve(0, 0, emptyState);
    const b = supplyCurve(1, 0, emptyState);
    let differs = false;
    for (let i = 0; i < a.length; i++) {
      if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) {
        differs = true;
        break;
      }
    }
    expect(differs).toBe(true);
  });
});

describe('demandCurve', () => {
  it('returns a non-empty array of [q, p] tuples', () => {
    const curve = demandCurve(0);
    expect(curve.length).toBeGreaterThan(0);
    for (const [q, p] of curve) {
      expect(Number.isFinite(q)).toBe(true);
      expect(Number.isFinite(p)).toBe(true);
    }
  });

  it('q values are monotonically non-decreasing', () => {
    const curve = demandCurve(0);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i][0]).toBeGreaterThanOrEqual(curve[i - 1][0]);
    }
  });

  it('p values are monotonically non-increasing (sinkende Nachfrage)', () => {
    const curve = demandCurve(0);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i][1]).toBeLessThanOrEqual(curve[i - 1][1]);
    }
  });

  it('all p values are within a finite, positive range', () => {
    const curve = demandCurve(0);
    for (const [, p] of curve) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(10);
    }
  });

  it('positive demand shift moves the curve (q for given p changes)', () => {
    const a = demandCurve(0);
    const b = demandCurve(1);
    let differs = false;
    for (let i = 0; i < a.length; i++) {
      if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) {
        differs = true;
        break;
      }
    }
    expect(differs).toBe(true);
  });
});

describe('findEquilibrium', () => {
  it('returns [q, p] within [0, 10] for valid inputs', () => {
    const [q, p] = findEquilibrium(0, 0, 0, emptyState);
    expect(q).toBeGreaterThanOrEqual(0);
    expect(q).toBeLessThanOrEqual(10);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(10);
  });

  it('returns finite values for any reasonable input', () => {
    for (const shift of [-1, 0, 1]) {
      for (const reg of [-0.5, 0, 0.5]) {
        const [q, p] = findEquilibrium(shift, shift, reg, allPositive);
        expect(Number.isFinite(q)).toBe(true);
        expect(Number.isFinite(p)).toBe(true);
      }
    }
  });

  it('positive supply shift increases equilibrium q (mehr Angebot = mehr Menge)', () => {
    const [qLow]  = findEquilibrium(-1, 0, 0, emptyState);
    const [qMid]  = findEquilibrium( 0, 0, 0, emptyState);
    const [qHigh] = findEquilibrium( 1, 0, 0, emptyState);
    expect(qMid).toBeGreaterThanOrEqual(qLow);
    expect(qHigh).toBeGreaterThanOrEqual(qMid);
  });

  it('positive demand shift increases equilibrium q (mehr Nachfrage = Kurve rechts = mehr Menge)', () => {
    const [qLow]  = findEquilibrium(0, -1, 0, emptyState);
    const [qMid]  = findEquilibrium(0,  0, 0, emptyState);
    const [qHigh] = findEquilibrium(0,  1, 0, emptyState);
    expect(qMid).toBeGreaterThanOrEqual(qLow);
    expect(qHigh).toBeGreaterThanOrEqual(qMid);
  });

  it('higher regulation → lower q (elastizität sinkt, Markt räumt weniger)', () => {
    const [qLow]  = findEquilibrium(0, 0, -1, emptyState);
    const [qHigh] = findEquilibrium(0, 0,  1, emptyState);
    expect(qHigh).toBeLessThanOrEqual(qLow);
  });
});
