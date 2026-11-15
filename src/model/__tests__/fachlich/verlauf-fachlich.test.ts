/**
 * verlauf-fachlich.test.ts — Zeitprofil am STAND (Verbesserungsplan Fix-10)
 *
 * Geprüft wird der erreichte Stand über die drei Phasen, nicht der
 * Impulsvektor. Gerechnet wird die ganze Pipeline mit einem Schritt eines
 * Parameters gegen die Baseline, im neutralen Kontext (marketModulator = 1).
 *
 * Phasen: P1 = 0–2 Jahre, P2 = 2–5 Jahre, P3 = 5–10 Jahre.
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline } from '../../compute-phases';
import type { CityContext, MarketState, ParamsDiff40 } from '../../../types';

const NEUTRAL: CityContext = {
  ownershipBaseline: { privat: 0.39, institutionell: 0.30, genossenschaft: 0.175, oeffentlich: 0.066 },
  zinsniveau: 0, zuwanderungsdruck: 0, wirtschaftskraft: 0,
  bevoelkerungstrend: 0, marktenge: 0,
};

/** Effekt eines Diffs auf einen E1-Knoten je Phase, relativ zum P3-Stand. */
function verlauf(diff: ParamsDiff40, node: keyof MarketState): { abs: number[]; rel: number[] } {
  const mit = [...computePhasePipeline(NEUTRAL, diff)];
  const ohne = [...computePhasePipeline(NEUTRAL, {})];
  const abs = mit.map((r, i) => (r.marketState[node] as number) - (ohne[i].marketState[node] as number));
  return { abs, rel: abs.map(v => v / abs[2]) };
}

describe('Verlauf des Standes gegen Studien', () => {
  /**
   * FR-003 (APUR 2025): Pariser Mietdeckel −2.5 % im ersten Jahr, −5.9 % im
   * vierten, −8.2 % im fünften. Grob 0.3 nach einem, 0.7 nach vier Jahren
   * gemessen am letzten Wert: der Stand wächst.
   */
  it('[FACH] FR-003 Paris: Schutz durch Anfangsmiete-Regel wächst über die Phasen', () => {
    const { abs, rel } = verlauf({ mietrecht_anfangsmiete: { from: 1, to: 2 } }, 'mietpreis_schutzlevel');
    expect(abs[0]).toBeGreaterThan(0);
    expect(abs[1]).toBeGreaterThan(abs[0]);
    expect(abs[2]).toBeGreaterThan(abs[1]);
    expect(rel[0]).toBeGreaterThan(0.2);
    expect(rel[0]).toBeLessThan(0.5);
  });

  /**
   * DE-004 (Hahn et al. 2024): regulierte Mieten in Berlin sanken mechanisch
   * mit Inkrafttreten des Mietendeckels. Der Schutz muss schon in P1 nahezu
   * voll da sein.
   */
  it('[FACH] DE-004 Berlin: Schutz durch Kostenbindung wirkt schon in P1', () => {
    const { abs, rel } = verlauf({ mietrecht_kostenmiete: { from: 1, to: 2 } }, 'mietpreis_schutzlevel');
    expect(abs[0]).toBeGreaterThan(0);
    expect(rel[0]).toBeGreaterThanOrEqual(0.8);
  });

  /**
   * NZ-001 (Auckland Unitary Plan 2016): Neubau reagiert nach 2–4 Jahren.
   * In P1 höchstens ein kleiner Teil des P3-Standes, P2 deutlich darunter.
   */
  it('[FACH] NZ-001 Auckland: Angebot aus Verdichtung kommt verzögert', () => {
    const { abs, rel } = verlauf({ raumplanung_verdichtung: { from: 1, to: 2 } }, 'angebotspotenzial');
    expect(abs[2]).toBeGreaterThan(0);
    expect(rel[0]).toBeLessThanOrEqual(0.1);
    expect(rel[1]).toBeLessThan(0.75);
  });

  it('[FACH] US-005 Kanton Zürich: Angebot aus höherer Ausnützung kommt verzögert', () => {
    const { abs, rel } = verlauf({ raumplanung_ausnuetzungsziffer: { from: 1, to: 2 } }, 'angebotspotenzial');
    expect(abs[2]).toBeGreaterThan(0);
    expect(rel[0]).toBeLessThanOrEqual(0.1);
    expect(rel[1]).toBeLessThan(0.75);
  });

  /**
   * KR-003 / GLOBAL-003: Hypothekarregulierung wirkt kurzfristig auf die
   * Nachfrage, nicht nachhaltig. Der Stand ist in P1 am grössten.
   */
  it('[FACH] KR-003: Nachfragedämpfung durch Hypothekarregulierung ist in P1 am grössten', () => {
    const { abs } = verlauf({ kapital_hypothekarregulierung: { from: 1, to: 2 } }, 'nachfragedruck');
    expect(abs[0]).toBeLessThan(0);
    expect(Math.abs(abs[1])).toBeLessThan(Math.abs(abs[0]));
    expect(Math.abs(abs[2])).toBeLessThan(Math.abs(abs[1]));
  });
});
