// ============================================================
// supply-demand.ts — Preis-Mengen-Diagramm Berechnungen
//
// Knappheitsindikator (Wohnmonitor BWO):
// Misst die Abweichung der Insertionsdauer vom Gleichgewicht.
// Werte: –5 (Überangebot) … 0 (Gleichgewicht) … +5 (Nachfrageüberhang)
//
// Drei E1-Treiber:
//   nachfragedruck:      +1 → Markt enger (steiler)
//   angebotspotenzial:   +1 → mehr Angebot (flacher)
//   markfriktion:        +1 → weniger Mobilisierung (steiler)
//   gemeinnuetzig_kraft: +1 → mehr Genossenschaften puffern ab (flacher)
//
// Quelle: https://wohnmonitor.admin.ch/method-and-source
// ============================================================

import type { MarketState } from '../types';

export const CURVE_POINTS = 200;
export const SHIFT_SCALE  = 5;

/** Knappheitssignal aus E1-Zustand (Rohwert vor Clamping). */
export function knappheitSignal(s: MarketState): number {
  return (
    s.nachfragedruck * 0.4
    + (-s.angebotspotenzial) * 0.3
    + s.markfriktion * 0.15
    + (-s.gemeinnuetzig_kraft) * 0.15
  );
}

/** Effektiver Regulationsgrad für die Angebotskurven-Steigung. */
export function regulationEffective(baseReg: number, s: MarketState): number {
  return Math.max(-1, Math.min(1, baseReg + knappheitSignal(s) * 0.4));
}

/** Steilheit der Angebotskurve aus effektivem Regulationsgrad. */
export function supplySlope(regEff: number): number {
  return 0.8 * (1 + regEff * 0.5);
}

/** Angebotskurve (Preis-Mengen) als Punkte-Array. */
export function supplyCurve(shift: number, regulationBase: number, s: MarketState): [number, number][] {
  const regEff = regulationEffective(regulationBase, s);
  const slope  = supplySlope(regEff);
  return Array.from({ length: CURVE_POINTS }, (_, i) => {
    const q = (i / (CURVE_POINTS - 1)) * 10;
    const p = 1 + (q - shift * SHIFT_SCALE) * slope;
    return [q, Math.max(0, Math.min(10, p))] as [number, number];
  });
}

/** Nachfragekurve (Preis-Mengen) als Punkte-Array. */
export function demandCurve(shift: number): [number, number][] {
  return Array.from({ length: CURVE_POINTS }, (_, i) => {
    const q = (i / (CURVE_POINTS - 1)) * 10;
    const p = 9 - (q - shift * SHIFT_SCALE) * 0.8;
    return [q, Math.max(0, Math.min(10, p))] as [number, number];
  });
}

/** Gleichgewichts-Punkt (Menge, Preis) aus Angebots-/Nachfrage-Parametern. */
export function findEquilibrium(
  supplyShift: number,
  demandShift: number,
  regulationBase: number,
  s: MarketState,
): [number, number] {
  const regEff = regulationEffective(regulationBase, s);
  const slope  = supplySlope(regEff);
  const qEq = Math.max(0, Math.min(10,
    (8 + 7 * slope * supplyShift + 5.6 * demandShift) / (slope + 0.8)
  ));
  const pEq = Math.max(0, Math.min(10, 1 + slope * (qEq - 7 * supplyShift)));
  return [qEq, pEq];
}