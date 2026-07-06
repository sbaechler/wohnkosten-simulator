// ============================================================
// derived.ts — E1 → E2 computation
// Berechnet die 4 abgeleiteten Indikatoren aus E1
//
// SOURCE OF TRUTH für alle E1→E2 Beziehungen: `E2_TERMS` unten.
// `computeDerivedIndicators` rechnet damit, `dag-topology.ts`
// projiziert dieselben Terme als Kanten für die DAG-Visualisierung.
// ============================================================

import type { MarketState, DerivedIndicators } from '../types';
import { clamp } from './utils';

/**
 * Ein Summand eines E2-Indikators: coeff · sign · x.
 *
 * Alle Terme sind nullpunkt-treu: ein neutraler Markt (alle E1 = 0) ergibt
 * für jeden Indikator 0. Historische Anmerkung: Frühere Formeln (aus
 * dag-berechnungsmodell.md) nutzten `(1 − x)`-Terme aus einer 0…1-Spezifikation
 * auf der −1…+1-Skala — das verschob den Nullpunkt (neutraler Markt →
 * Gentrifizierung ≈ 0.45) und drückte angespannte Städte an den +1-Clamp,
 * wodurch gegenläufige Politik-Effekte asymmetrisch abgeschnitten wurden.
 * Seit 2026-07 bewusst korrigiert.
 */
export interface E2Term {
  from: keyof MarketState;
  coeff: number;
  sign: 1 | -1;
}

/**
 * E1→E2 Koeffizienten (Gewichte gemäss Spezifikation dag-berechnungsmodell.md).
 * Jeder Indikator ist die gewichtete Summe seiner Terme, normiert durch die
 * Koeffizienten-Summe, danach auf −1…+1 geclampt.
 */
export const E2_TERMS: Record<keyof DerivedIndicators, readonly E2Term[]> = {
  gentrifizierungsindex: [
    { from: 'aufwertungsdruck',      coeff: 1.5, sign: +1 },
    { from: 'mietpreis_schutzlevel', coeff: 1.5, sign: -1 },
    { from: 'verdraengungsrisiko',   coeff: 1.5, sign: +1 },
    { from: 'gemeinnuetzig_kraft',   coeff: 1.0, sign: -1 },
  ],
  // Invertiert: hohes Angebotspotenzial → tiefer Hemmnisindex
  neubau_hemmnisindex: [
    { from: 'angebotspotenzial', coeff: 1.0, sign: -1 },
  ],
  // Direkter Alias aus E1
  verdraengungsrisiko_index: [
    { from: 'verdraengungsrisiko', coeff: 1.0, sign: +1 },
  ],
  // aufwertungsdruck=0.8: UK-001 Crossrail / GLOBAL-020 TIF —
  // Aufwertung → höhere Steuereinnahmen
  fiskalische_wirkung: [
    { from: 'spekulationshemmung', coeff: 1.5, sign: +1 },
    { from: 'marktfriktion',       coeff: 1.0, sign: -1 },
    { from: 'gemeinnuetzig_kraft', coeff: 1.0, sign: +1 },
    { from: 'aufwertungsdruck',    coeff: 0.8, sign: +1 },
  ],
};

function computeIndicator(state: MarketState, terms: readonly E2Term[]): number {
  let numerator = 0;
  let denominator = 0;
  for (const t of terms) {
    numerator += t.coeff * t.sign * state[t.from];
    denominator += t.coeff;
  }
  return clamp(numerator / denominator);
}

/**
 * Berechnet E2 (abgeleitete Indikatoren) aus E1 (Markt-Zustand)
 * gemäss `E2_TERMS`.
 */
export function computeDerivedIndicators(
  state: MarketState,
): DerivedIndicators {
  return {
    gentrifizierungsindex: computeIndicator(state, E2_TERMS.gentrifizierungsindex),
    neubau_hemmnisindex: computeIndicator(state, E2_TERMS.neubau_hemmnisindex),
    verdraengungsrisiko_index: computeIndicator(state, E2_TERMS.verdraengungsrisiko_index),
    fiskalische_wirkung: computeIndicator(state, E2_TERMS.fiskalische_wirkung),
  };
}
