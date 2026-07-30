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
//   marktfriktion:        +1 → weniger Mobilisierung (steiler)
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
  marktfriktion:         0.15,
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

/** p-Bereich in der Achse. */
const AXIS_MIN = 0;
const AXIS_MAX = 10;

/**
 * Gewicht der Investitionsattraktivität im Angebots-Shift.
 *
 * Das Angebot im Diagramm wird nicht nur vom physischen Angebotspotenzial
 * (Bauland, Verdichtung) getrieben, sondern auch von der Bereitschaft des
 * Kapitals, tatsächlich zu bauen. Renditebegrenzende Politik (Kostenmiete,
 * Kapitalregulierung) verschiebt so die Angebotskurve nach links, ohne dass
 * sich das physische Potenzial ändert. 0.4 = Kapitalbereitschaft wirkt
 * knapp halb so stark wie das physische Potenzial (GLOBAL-029: Investoren
 * weichen aus, verschwinden aber nicht vollständig).
 */
export const INVEST_SUPPLY_GEWICHT = 0.4;

/**
 * Horizontaler Shift der Angebotskurve aus dem E1-Zustand.
 * Kombiniert physisches Angebotspotenzial und Investitionsbereitschaft.
 */
export function supplyShiftFromState(s: MarketState): number {
  return s.angebotspotenzial + s.investitionsattraktivitaet * INVEST_SUPPLY_GEWICHT;
}

/** Knappheitssignal aus E1-Zustand (Rohwert vor Clamping). */
export function knappheitSignal(s: MarketState): number {
  const w = KNAPPHEIT_GEWICHTE;
  return (
    s.nachfragedruck * w.nachfragedruck
    + (-s.angebotspotenzial) * w.angebotspotenzial
    + s.marktfriktion * w.marktfriktion
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

/**
 * Geradenkoeffizienten [a, b] der Angebotskurve als p = a + b·q.
 * Single source of truth — wird von `supplyCurve` UND `findEquilibrium`
 * verwendet, damit der Gleichgewichts-Punkt mathematisch garantiert
 * auf der gezeichneten Angebotslinie liegt.
 */
export function supplyLine(supplyShift: number, regulationBase: number, s: MarketState): [number, number] {
  const slope = supplySlope(regulationEffective(regulationBase, s));
  return [1 - slope * SHIFT_SCALE * supplyShift, slope];
}

/**
 * Geradenkoeffizienten [a, b] der Nachfragekurve als p = a + b·q
 * (Steigung ist negativ). Single source of truth — wird von
 * `demandCurve` UND `findEquilibrium` verwendet.
 */
export function demandLine(demandShift: number): [number, number] {
  return [DEMAND_INTERCEPT + DEMAND_SLOPE * SHIFT_SCALE * demandShift, -DEMAND_SLOPE];
}

/**
 * Schnittpunkt zweier Geraden p = a1 + b1·q und p = a2 + b2·q.
 * Wirft eine Fehlermeldung, falls die Geraden parallel sind
 * (in diesem Simulator: nicht erreichbar, da DEMAND_SLOPE > 0
 * und supplySlope > 0, b2 < 0 immer).
 */
function lineIntersection(a1: number, b1: number, a2: number, b2: number): [number, number] {
  const denom = b1 - b2;
  if (denom === 0) throw new Error('Parallele Geraden haben keinen Schnittpunkt');
  const q = (a2 - a1) / denom;
  return [q, a1 + b1 * q];
}

/** Angebotskurve (Preis-Mengen) als Punkte-Array. */
export function supplyCurve(shift: number, regulationBase: number, s: MarketState): [number, number][] {
  const [a, b] = supplyLine(shift, regulationBase, s);
  return Array.from({ length: CURVE_POINTS }, (_, i) => {
    const q = (i / (CURVE_POINTS - 1)) * AXIS_MAX;
    const p = a + b * q;
    return [q, Math.max(AXIS_MIN, Math.min(AXIS_MAX, p))] as [number, number];
  });
}

/** Nachfragekurve (Preis-Mengen) als Punkte-Array. */
export function demandCurve(shift: number): [number, number][] {
  const [a, b] = demandLine(shift);
  return Array.from({ length: CURVE_POINTS }, (_, i) => {
    const q = (i / (CURVE_POINTS - 1)) * AXIS_MAX;
    const p = a + b * q;
    return [q, Math.max(AXIS_MIN, Math.min(AXIS_MAX, p))] as [number, number];
  });
}

/**
 * Gleichgewichts-Punkt (Menge, Preis) aus Angebots-/Nachfrage-Parametern.
 * Wird aus denselben Linien-Koeffizienten berechnet, die auch die
 * `supplyCurve`/`demandCurve` verwenden — der Punkt liegt also
 * mathematisch exakt auf beiden Geraden.
 */
export function findEquilibrium(
  supplyShift: number,
  demandShift: number,
  regulationBase: number,
  s: MarketState,
): [number, number] {
  const [aS, bS] = supplyLine(supplyShift, regulationBase, s);
  const [aD, bD] = demandLine(demandShift);
  const [q, p] = lineIntersection(aS, bS, aD, bD);
  return [
    Math.max(AXIS_MIN, Math.min(AXIS_MAX, q)),
    Math.max(AXIS_MIN, Math.min(AXIS_MAX, p)),
  ];
}

// ── Mietpreisdeckel ──────────────────────────────────────────────────────────

/**
 * Preis-Einheiten, um die ein voller Mietpreis-Schutzlevel (+1) den
 * Deckel unter den Gleichgewichtspreis drückt. 2 von 10 Achseneinheiten
 * = ein maximal ausgebauter Mietpreisschutz senkt den regulierten Preis
 * um ~20% der Preisskala unter das Marktgleichgewicht (Sotomo 2025:
 * Bestandsmieten in stark regulierten Märkten ~18–30% unter Marktmiete).
 */
export const MIETPREISDECKEL_FAKTOR = 2;

/**
 * Unterhalb dieses Schutzlevels wird kein Deckel gezeichnet — vermeidet
 * einen visuell bedeutungslosen Deckel direkt auf dem Gleichgewichtspunkt.
 */
export const MIETPREISDECKEL_MIN_SCHUTZ = 0.02;

export interface Mietpreisdeckel {
  /** Regulierter Höchstpreis (Deckel-Linie) */
  p: number;
  /** Angebotene Menge zum Deckelpreis (auf der Angebotskurve) */
  qAngebot: number;
  /** Nachgefragte Menge zum Deckelpreis (auf der Nachfragekurve) */
  qNachfrage: number;
}

/**
 * Mietpreisdeckel als klassische Preisobergrenze im Preis-Mengen-Diagramm.
 *
 * Positiver `mietpreis_schutzlevel` (relativ zu heute verschärftes Mietrecht:
 * Kostenmiete, Anfechtung Anfangsmiete, Mietzinsindex, Transparenz) begrenzt
 * den erzielbaren Preis unterhalb des Marktgleichgewichts. Lehrbuch-Folge:
 * Zum gedeckelten Preis wird weniger angeboten (qAngebot) als nachgefragt
 * (qNachfrage) — die Differenz ist die Angebotslücke (Wohnungsnot trotz
 * tieferem Preis).
 *
 * Gibt `null` zurück, wenn kein (bindender) Deckel besteht
 * (schutzlevel ≤ MIETPREISDECKEL_MIN_SCHUTZ).
 */
export function mietpreisdeckel(
  supplyShift: number,
  demandShift: number,
  regulationBase: number,
  s: MarketState,
): Mietpreisdeckel | null {
  if (s.mietpreis_schutzlevel <= MIETPREISDECKEL_MIN_SCHUTZ) return null;

  const [aS, bS] = supplyLine(supplyShift, regulationBase, s);
  const [aD, bD] = demandLine(demandShift);
  const [, pStar] = lineIntersection(aS, bS, aD, bD);

  const clampAxis = (v: number) => Math.max(AXIS_MIN, Math.min(AXIS_MAX, v));
  const p = clampAxis(pStar - s.mietpreis_schutzlevel * MIETPREISDECKEL_FAKTOR);

  return {
    p,
    qAngebot: clampAxis((p - aS) / bS),
    qNachfrage: clampAxis((p - aD) / bD),
  };
}