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

/**
 * Sampling-Auflösung der geplotteten Kurven.
 * 200 Punkte geben glatte SVG-Linien bei minimaler Render-Last.
 */
export const CURVE_POINTS = 200;

/**
 * Skalierungsfaktor für horizontale Kurven-Shifts (pro E1-Δ).
 * 5 = eine ±1 E1-Verschiebung schiebt die Kurve um 5 Mengen-Einheiten.
 */
export const SHIFT_SCALE  = 5;

/**
 * E1-Gewichte für `knappheitSignal` (Wohnmonitor-Insertionsdauer-Reagibilität).
 * Höherer Wert = stärkerer Einfluss auf Knappheits-Signal.
 *
 * Kalibrierung: Wohnmonitor 2023 + UK-001 Crossrail-Marktreaktion.
 * Werte sind so kalibriert, dass eine 1-σ E1-Bewegung ~1σ auf der
 * Knappheitsskala (−5..+5) erzeugt.
 */
export const KNAPPHEIT_GEWICHTE = {
  /** Nachfragedruck: mehr Nachfrage = knapper → +X */
  nachfragedruck:       0.4,
  /** Angebotspotenzial: mehr Angebot = weniger knapp → -X */
  angebotspotenzial:    0.3,
  /** Marktfriktion: weniger Mobilisierung = knapper → +X */
  markfriktion:         0.15,
  /** Gemeinnützig: Genossenschaften puffern Knappheit → -X */
  gemeinnuetzig_kraft:  0.15,
} as const;

/** Skalierungsfaktor: wie stark das Knappheitssignal die Regulation verstärkt. */
const KNAPPHEIT_REGULATION_FAKTOR = 0.4;

/** Basis-Steigung der Angebotskurve (Punkte/Mengeneinheit). */
const SUPPLY_BASE_SLOPE = 0.8;
/** Modulationsfaktor: wie stark die Regulation die Angebotssteigung beeinflusst. */
const SUPPLY_SLOPE_REGULATION_FAKTOR = 0.5;

/** Achsenabschnitt der Nachfragekurve bei q=0 (Preis-Achse). */
const DEMAND_INTERCEPT = 9;
/** Steigung der Nachfragekurve. */
const DEMAND_SLOPE = 0.8;

/** Intercept der q-Gleichung (q=0-Baseline bei p=1). */
const EQUILIBRIUM_Q_INTERCEPT = 8;
/** q-Verschiebungs-Empfindlichkeit pro supplyShift. */
const EQUILIBRIUM_Q_SUPPLY_FAKTOR = 7;
/** q-Verschiebungs-Empfindlichkeit pro demandShift. */
const EQUILIBRIUM_Q_DEMAND_FAKTOR = 5.6;
/** p-Bereich in der Achse. */
const AXIS_MIN = 0;
const AXIS_MAX = 10;

/** Knappheitssignal aus E1-Zustand (Rohwert vor Clamping). */
export function knappheitSignal(s: MarketState): number {
  const w = KNAPPHEIT_GEWICHTE;
  return (
    s.nachfragedruck * w.nachfragedruck
    + (-s.angebotspotenzial) * w.angebotspotenzial
    + s.markfriktion * w.markfriktion
    + (-s.gemeinnuetzig_kraft) * w.gemeinnuetzig_kraft
  );
}

/** Effektiver Regulationsgrad für die Angebotskurven-Steigung. */
export function regulationEffective(baseReg: number, s: MarketState): number {
  return Math.max(-1, Math.min(1, baseReg + knappheitSignal(s) * KNAPPHEIT_REGULATION_FAKTOR));
}

/** Steilheit der Angebotskurve aus effektivem Regulationsgrad. */
export function supplySlope(regEff: number): number {
  return SUPPLY_BASE_SLOPE * (1 + regEff * SUPPLY_SLOPE_REGULATION_FAKTOR);
}

/** Angebotskurve (Preis-Mengen) als Punkte-Array. */
export function supplyCurve(shift: number, regulationBase: number, s: MarketState): [number, number][] {
  const regEff = regulationEffective(regulationBase, s);
  const slope  = supplySlope(regEff);
  return Array.from({ length: CURVE_POINTS }, (_, i) => {
    const q = (i / (CURVE_POINTS - 1)) * AXIS_MAX;
    const p = 1 + (q - shift * SHIFT_SCALE) * slope;
    return [q, Math.max(AXIS_MIN, Math.min(AXIS_MAX, p))] as [number, number];
  });
}

/** Nachfragekurve (Preis-Mengen) als Punkte-Array. */
export function demandCurve(shift: number): [number, number][] {
  return Array.from({ length: CURVE_POINTS }, (_, i) => {
    const q = (i / (CURVE_POINTS - 1)) * AXIS_MAX;
    const p = DEMAND_INTERCEPT - (q - shift * SHIFT_SCALE) * DEMAND_SLOPE;
    return [q, Math.max(AXIS_MIN, Math.min(AXIS_MAX, p))] as [number, number];
  });
}

/**
 * Gleichgewichts-Punkt (Menge, Preis) aus Angebots-/Nachfrage-Parametern.
 *
 * q-Gleichung (linearisiert aus Kurvenschnitt):
 *   q = (EQUILIBRIUM_Q_INTERCEPT + EQUILIBRIUM_Q_SUPPLY_FAKTOR × slope × supplyShift
 *        + EQUILIBRIUM_Q_DEMAND_FAKTOR × demandShift)
 *       / (slope + DEMAND_SLOPE)
 *
 * p-Gleichung: p = 1 + slope × (q − EQUILIBRIUM_Q_SUPPLY_FAKTOR × supplyShift)
 */
export function findEquilibrium(
  supplyShift: number,
  demandShift: number,
  regulationBase: number,
  s: MarketState,
): [number, number] {
  const regEff = regulationEffective(regulationBase, s);
  const slope  = supplySlope(regEff);
  const qEq = Math.max(AXIS_MIN, Math.min(AXIS_MAX,
    (EQUILIBRIUM_Q_INTERCEPT + EQUILIBRIUM_Q_SUPPLY_FAKTOR * slope * supplyShift + EQUILIBRIUM_Q_DEMAND_FAKTOR * demandShift) / (slope + DEMAND_SLOPE)
  ));
  const pEq = Math.max(AXIS_MIN, Math.min(AXIS_MAX, 1 + slope * (qEq - EQUILIBRIUM_Q_SUPPLY_FAKTOR * supplyShift)));
  return [qEq, pEq];
}