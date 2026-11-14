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
 *   - regulationEffective: in [-1, 1] (UI-clamped), hängt nur vom Regulationsgrad ab
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
  supplyLine,
  demandLine,
  supplyCurve,
  demandCurve,
  findEquilibrium,
  supplyShiftFromState,
  mietpreisdeckel,
} from '../../supply-demand';
import type { MarketState } from '../../../types';
import { REGIME_NEUTRAL } from '../market-state-fixtures';

const emptyState: MarketState = {
  angebotspotenzial: 0,
  nachfragedruck: 0,
  mietpreis_schutzlevel: 0,
  verdraengungsrisiko: 0,
  spekulationshemmung: 0,
  marktfriktion: 0,
  gemeinnuetzig_kraft: 0,
  eigentumsquoten_trend: 0,
  aufwertungsdruck: 0,
  investitionsattraktivitaet: 0,
  angebotspotenzial_regulation: 0,
  ...REGIME_NEUTRAL,
};

describe('knappheitSignal', () => {
  it('returns 0 for all-zero state (keine Knappheitssignale)', () => {
    expect(knappheitSignal(emptyState)).toBe(0);
  });

  it('is positive when demand pressure dominates (knapper Markt)', () => {
    const tight: MarketState = {
      ...emptyState,
      nachfragedruck: 1, marktfriktion: 1,
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
  it('returns baseReg inside [-1, 1]', () => {
    expect(regulationEffective(0.5)).toBeCloseTo(0.5, 10);
  });

  it('clamps to [-1, 1] under extreme baseReg', () => {
    expect(regulationEffective(2)).toBeLessThanOrEqual(1);
    expect(regulationEffective(-2)).toBeGreaterThanOrEqual(-1);
  });

  // Fix-12, Punkt 4 (2026-11-15): das Knappheitssignal steckt nicht mehr in
  // der Steigung. Mehr Nachfrage verschiebt nur die Nachfragekurve; die
  // Steigung hängt nur noch vom Regulationsgrad ab.
  it('Steigung hängt nur vom Regulationsgrad ab, nicht vom Knappheitssignal', () => {
    const knapp = { ...emptyState, nachfragedruck: 1, marktfriktion: 1 };
    expect(knappheitSignal(knapp)).toBeGreaterThan(0);
    expect(regulationEffective.length).toBe(1);
    expect(supplyLine.length).toBe(2);
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
    const curve = supplyCurve(0, 0);
    expect(curve.length).toBeGreaterThan(0);
    for (const [q, p] of curve) {
      expect(typeof q).toBe('number');
      expect(typeof p).toBe('number');
      expect(Number.isFinite(q)).toBe(true);
      expect(Number.isFinite(p)).toBe(true);
    }
  });

  it('q values are monotonically non-decreasing', () => {
    const curve = supplyCurve(0, 0);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i][0]).toBeGreaterThanOrEqual(curve[i - 1][0]);
    }
  });

  it('all p values are within a finite, positive range (UI-achse)', () => {
    const curve = supplyCurve(0, 0);
    for (const [, p] of curve) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(10);
    }
  });

  it('positive supply shift moves the curve (q for given p changes)', () => {
    const a = supplyCurve(0, 0);
    const b = supplyCurve(1, 0);
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
    const [q, p] = findEquilibrium(0, 0, 0);
    expect(q).toBeGreaterThanOrEqual(0);
    expect(q).toBeLessThanOrEqual(10);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(10);
  });

  it('returns finite values for any reasonable input', () => {
    for (const shift of [-1, 0, 1]) {
      for (const reg of [-0.5, 0, 0.5]) {
        const [q, p] = findEquilibrium(shift, shift, reg);
        expect(Number.isFinite(q)).toBe(true);
        expect(Number.isFinite(p)).toBe(true);
      }
    }
  });

  it('positive supply shift increases equilibrium q (mehr Angebot = mehr Menge)', () => {
    const [qLow]  = findEquilibrium(-1, 0, 0);
    const [qMid]  = findEquilibrium( 0, 0, 0);
    const [qHigh] = findEquilibrium( 1, 0, 0);
    expect(qMid).toBeGreaterThanOrEqual(qLow);
    expect(qHigh).toBeGreaterThanOrEqual(qMid);
  });

  it('positive demand shift increases equilibrium q (mehr Nachfrage = Kurve rechts = mehr Menge)', () => {
    const [qLow]  = findEquilibrium(0, -1, 0);
    const [qMid]  = findEquilibrium(0, 0, 0);
    const [qHigh] = findEquilibrium(0, 1, 0);
    expect(qMid).toBeGreaterThanOrEqual(qLow);
    expect(qHigh).toBeGreaterThanOrEqual(qMid);
  });

  // Seit Fix-12, Punkt 5 dreht die Kurve um das neutrale Gleichgewicht: ohne
  // Nachfrageverschiebung ändert Regulierung die Menge nicht (Test unten).
  // Steigt die Nachfrage, räumt ein unelastisches Angebot weniger Menge.
  it('higher regulation → lower q bei gestiegener Nachfrage (Elastizität sinkt)', () => {
    const [qLow]  = findEquilibrium(0, 0.5, -1);
    const [qHigh] = findEquilibrium(0, 0.5, 1);
    expect(qHigh).toBeLessThan(qLow);
  });

  // Fix-12, Punkt 5: die Kurve dreht um das neutrale Gleichgewicht.
  it('Regulierung allein verschiebt das neutrale Gleichgewicht nicht', () => {
    const [q0, p0] = findEquilibrium(0, 0, 0);
    for (const reg of [-1, -0.5, 0.5, 1]) {
      const [q, p] = findEquilibrium(0, 0, reg);
      expect(q).toBeCloseTo(q0, 10);
      expect(p).toBeCloseTo(p0, 10);
    }
  });

  it('bei mehr Nachfrage steigt der Preis stärker, je unelastischer das Angebot', () => {
    const [, pElastisch] = findEquilibrium(0, 0.5, -1);
    const [, pUnelastisch] = findEquilibrium(0, 0.5, 1);
    expect(pUnelastisch).toBeGreaterThan(pElastisch);
  });
});

/**
 * Regression-Tests: Der Gleichgewichts-Punkt MUSS mathematisch exakt
 * auf beiden Geraden liegen (Angebot + Nachfrage). Vorher koppelt der
 * Code Konstanten (EQUILIBRIUM_Q_SUPPLY_FAKTOR, EQUILIBRIUM_Q_DEMAND_FAKTOR)
 * die nicht zu SHIFT_SCALE × DEMAND_SLOPE passten — Dot driftete vom
 * Schnittpunkt weg.
 */
describe('findEquilibrium — Konsistenz mit Linien-Gleichungen', () => {
  /**
   * Interpoliert p aus einer geplotteten Kurve an einer gegebenen q-Stelle.
   * CURVE_POINTS = 200, also Abstand 0.05025 — Toleranz ~ 0.06 (Schrittweite).
   */
  function pAt(curve: [number, number][], q: number): number {
    if (q <= curve[0][0]) return curve[0][1];
    if (q >= curve[curve.length - 1][0]) return curve[curve.length - 1][1];
    for (let i = 0; i < curve.length - 1; i++) {
      const [q0, p0] = curve[i];
      const [q1, p1] = curve[i + 1];
      if (q >= q0 && q <= q1) {
        const t = (q - q0) / (q1 - q0);
        return p0 + t * (p1 - p0);
      }
    }
    return curve[curve.length - 1][1];
  }

  it('Gleichgewichts-Punkt liegt auf der Angebots-Linie (sampling-Toleranz)', () => {
    for (const [sSupply, sDemand, reg] of [[-1, -1, -1], [0, 0, 0], [1, 1, 1], [-0.5, 0.3, 0.7], [0.5, -0.5, -0.3]] as [number, number, number][]) {
      const [q, p] = findEquilibrium(sSupply, sDemand, reg);
      if (q > 0 && q < 10) {
        const supplyP = pAt(supplyCurve(sSupply, reg), q);
        expect(Math.abs(p - supplyP)).toBeLessThan(0.06);
      }
    }
  });

  it('Gleichgewichts-Punkt liegt auf der Nachfrage-Linie (sampling-Toleranz)', () => {
    for (const [sSupply, sDemand, reg] of [[-1, -1, -1], [0, 0, 0], [1, 1, 1], [-0.5, 0.3, 0.7], [0.5, -0.5, -0.3]] as [number, number, number][]) {
      const [q, p] = findEquilibrium(sSupply, sDemand, reg);
      if (q > 0 && q < 10) {
        const demandP = pAt(demandCurve(sDemand), q);
        expect(Math.abs(p - demandP)).toBeLessThan(0.06);
      }
    }
  });

  it('Gleichgewichts-Punkt erfüllt beide Linien-Gleichungen EXAKT (kein Sampling-Fehler)', () => {
    // Innerhalb [0,10]×[0,10] ist die Übereinstimmung exakt (modulo Float-Rundung).
    // An Clamping-Grenzen erwarten wir eine Abweichung (geclampter Wert
    // entspricht nicht der Linie). Daher nur inside-window testen.
    for (const [sSupply, sDemand, reg] of [[-0.3, -0.3, 0], [0, 0, 0], [0.3, 0.3, 0], [0, 0, 0.5]] as [number, number, number][]) {
      const [q, p] = findEquilibrium(sSupply, sDemand, reg);
      expect(q).toBeGreaterThan(0);
      expect(q).toBeLessThan(10);
      const [aS, bS] = supplyLine(sSupply, reg);
      const [aD, bD] = demandLine(sDemand);
      expect(p).toBeCloseTo(aS + bS * q, 10);
      expect(p).toBeCloseTo(aD + bD * q, 10);
    }
  });

  it('Clamping an [0, 10] ist aktiv wenn Linien-Schnitt ausserhalb', () => {
    // Extrem grosse Shifts: Linien-Schnitt liegt links von q=0.
    const [q, p] = findEquilibrium(-5, 5, 0);
    expect(q).toBeGreaterThanOrEqual(0);
    expect(q).toBeLessThanOrEqual(10);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(10);
  });
});

describe('supplyShiftFromState', () => {
  it('entspricht angebotspotenzial bei neutraler Investitionsattraktivität', () => {
    expect(supplyShiftFromState({ ...emptyState, angebotspotenzial: 0.7 })).toBeCloseTo(0.7, 10);
  });

  it('sinkt, wenn Investitionsattraktivität sinkt (Kapital baut weniger)', () => {
    const neutral = supplyShiftFromState(emptyState);
    const unattraktiv = supplyShiftFromState({ ...emptyState, investitionsattraktivitaet: -1 });
    expect(unattraktiv).toBeLessThan(neutral);
  });

  it('Investitionsattraktivität wirkt schwächer als das physische Potenzial', () => {
    const viaPotenzial = supplyShiftFromState({ ...emptyState, angebotspotenzial: 1 });
    const viaInvest = supplyShiftFromState({ ...emptyState, investitionsattraktivitaet: 1 });
    expect(Math.abs(viaInvest)).toBeLessThan(Math.abs(viaPotenzial));
  });
});

describe('mietpreisdeckel', () => {
  it('gibt null zurück ohne Mietpreisschutz (schutzlevel = 0)', () => {
    expect(mietpreisdeckel(0, 0, 0, emptyState)).toBeNull();
  });

  it('gibt null zurück bei gelockertem Mietrecht (schutzlevel < 0)', () => {
    expect(mietpreisdeckel(0, 0, 0, { ...emptyState, mietpreis_schutzlevel: -0.5 })).toBeNull();
  });

  it('Deckel liegt unter dem Gleichgewichtspreis', () => {
    const s = { ...emptyState, mietpreis_schutzlevel: 0.5 };
    const [, pStar] = findEquilibrium(0, 0, 0);
    const deckel = mietpreisdeckel(0, 0, 0, s);
    expect(deckel).not.toBeNull();
    expect(deckel!.p).toBeLessThan(pStar);
  });

  it('höherer Schutz drückt den Deckel tiefer', () => {
    const low = mietpreisdeckel(0, 0, 0, { ...emptyState, mietpreis_schutzlevel: 0.3 })!;
    const high = mietpreisdeckel(0, 0, 0, { ...emptyState, mietpreis_schutzlevel: 0.8 })!;
    expect(high.p).toBeLessThan(low.p);
  });

  it('zum Deckelpreis: angebotene Menge < nachgefragte Menge (Angebotslücke)', () => {
    const deckel = mietpreisdeckel(0, 0, 0, { ...emptyState, mietpreis_schutzlevel: 0.5 })!;
    expect(deckel.qAngebot).toBeLessThan(deckel.qNachfrage);
  });

  it('höherer Schutz vergrössert die Angebotslücke', () => {
    const low = mietpreisdeckel(0, 0, 0, { ...emptyState, mietpreis_schutzlevel: 0.3 })!;
    const high = mietpreisdeckel(0, 0, 0, { ...emptyState, mietpreis_schutzlevel: 0.8 })!;
    expect(high.qNachfrage - high.qAngebot).toBeGreaterThan(low.qNachfrage - low.qAngebot);
  });

  it('alle Werte liegen im Achsenbereich [0, 10] — auch bei Extremen', () => {
    for (const schutz of [0.1, 0.5, 1]) {
      for (const shift of [-2, 0, 2]) {
        const d = mietpreisdeckel(shift, -shift, 0, { ...emptyState, mietpreis_schutzlevel: schutz })!;
        for (const v of [d.p, d.qAngebot, d.qNachfrage]) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(10);
        }
      }
    }
  });

  // Fix-12, Punkt 3 (2026-11-15): der Angebotsrückgang steckt in der
  // Kurvenverschiebung. Die angebotene Menge zum Deckelpreis ist die
  // Gleichgewichtsmenge, nicht ein Punkt weiter unten auf der Angebotskurve.
  it('angebotene Menge = Gleichgewichtsmenge, Nachfragepunkt auf der Nachfragekurve', () => {
    const s = { ...emptyState, mietpreis_schutzlevel: 0.5 };
    const d = mietpreisdeckel(0.2, 0.3, 0.1, s)!;
    const [qStar] = findEquilibrium(0.2, 0.3, 0.1);
    const [aD, bD] = demandLine(0.3);
    expect(d.qAngebot).toBeCloseTo(qStar, 10);
    expect(d.p).toBeCloseTo(aD + bD * d.qNachfrage, 10);
  });
});

describe('supplyLine / demandLine', () => {
  it('supplyLine gibt (a, b) zurück, p_s(0) = 1 − slope·5·supplyShift (Anker bei shift=0 ist p=1)', () => {
    const [a] = supplyLine(0, 0);
    expect(a).toBe(1);
  });

  it('demandLine gibt (a, b) zurück, p_d(0) = 9 (Anker unabhängig vom shift)', () => {
    const [a] = demandLine(0);
    expect(a).toBe(9);
    const [aShifted] = demandLine(0.5);
    expect(aShifted).toBeGreaterThan(9);
  });

  it('supplyLine Steigung ist positiv (positive Steigung = normale Angebotskurve)', () => {
    const [, b] = supplyLine(0, 0);
    expect(b).toBeGreaterThan(0);
  });

  it('demandLine Steigung ist negativ (fallende Nachfragekurve)', () => {
    const [, b] = demandLine(0);
    expect(b).toBeLessThan(0);
  });

  it('supplyLine Steigung wächst mit Regulation (mehr Reg = steiler)', () => {
    const [, bLow]  = supplyLine(0, -1);
    const [, bHigh] = supplyLine(0, 1);
    expect(bHigh).toBeGreaterThan(bLow);
  });
});
