// ============================================================
// belastung.ts — Miet- und Wohneigentum-Belastungsberechnung
//
// Kalibrierungsreferenzen aus Wohnmonitor.admin.ch (BWO 2026):
//
// Mietbelastungsquoten (Anteil Wohnkosten am Bruttohaushaltseinkommen):
//   Gruppe                           |  2018  |  2023  | Trend
//   --------------------------------|--------|--------|------
//   Alle Mieter                     |  25.0% |  25.1% | → stabil
//   Einkommensschwache Mieter       |  43.6% |  44.8% | ↗ steigend
//   Wohneigentum (Zins+Betrieb)     |    —   |  12.9% | Referenzwert
//   Wohneigentum (inkl. Opportunität) | —   |  25.7% | Referenzwert
//
// Einkommensklassen (äquivalentes Medianeinkommen, SILC):
//   - einkommensschwach:    <  70% des äquiv. Medians
//   - unterer Mittelstand:  70–100%
//   - oberer Mittelstand:  100–150%
//   - einkommensstark:     > 150%
//
// Zugehörige "Höchstmiete" 90. Perzentil (2021 Bsp.):
//   Tiefes Einkommen, 1-Zi-Whg: 1126 CHF
//
// Quelle: https://wohnmonitor.admin.ch/method-and-source
// ============================================================

import type { MarketState } from '../types';

// ── Referenzwerte ────────────────────────────────────────────────────────────

export const WOHNMONITOR_BASELINE = {
  alleMieter:          25.1,
  schwacheMieter:      44.8,
  wohneigentumBetrieb: 12.9,
  wohneigentumOpp:     25.7,
} as const;

// ── Berechnungen ─────────────────────────────────────────────────────────────

/**
 * Berechnet die Mietbelastungsquote (%) für einkommensschwache Haushalte
 * basierend auf E1-Marktzustand.
 *
 * Mechanismus (Wohnmonitor-kalibriert):
 * - Hoher nachfragedruck   → knapper Markt → steigende Mieten → +8pp pro +1 E1
 * - Hohes angebotspotenzial → mehr Angebot  → sinkender Druck → −6pp pro +1 E1
 * - Hoher mietpreis_schutzlevel → schützt Bestandsmieter → −5pp pro +1 E1
 * - Hohe markfriktion      → weniger Mobilisierung → +3pp pro +1 E1
 *
 * Basis: CH-Durchschnitt einkommensschwache Mieter 2023 = 44.8%
 */
export function computeMieteBelastung(state: MarketState | undefined): number {
  const base = WOHNMONITOR_BASELINE.schwacheMieter;
  if (!state) return base;

  const delta =
    state.nachfragedruck * 8
    + (-state.angebotspotenzial) * 6
    + (-state.mietpreis_schutzlevel) * 5
    + state.markfriktion * 3;

  return Math.max(20, Math.min(70, base + delta));
}

/**
 * Berechnet die Wohneigentum-Belastungsquote (%) inkl. Opportunitätskosten.
 * Basis: 25.7% (2023), reagiert auf Nachfragedruck und Investitionsattraktivität.
 */
export function computeEigentumBelastung(state: MarketState | undefined): number {
  const base = WOHNMONITOR_BASELINE.wohneigentumOpp;
  if (!state) return base;

  const delta =
    state.nachfragedruck * 4
    + (-state.investitionsattraktivitaet) * 3;

  return Math.max(10, Math.min(45, base + delta));
}

/**
 * Stufe aus Prozentwert ableiten.
 * 0 = tief (<30%), 1 = mittel (30–45%), 2 = hoch (>45%)
 */
export function belastungLevel(pct: number): 0 | 1 | 2 {
  if (pct < 30) return 0;
  if (pct < 45) return 1;
  return 2;
}