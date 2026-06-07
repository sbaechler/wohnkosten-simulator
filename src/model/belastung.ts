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

/**
 * Wohnmonitor.admin.ch (BWO 2026) — Mietbelastungsquoten 2023:
 * - alleMieter:          CH-Durchschnitt aller Mieterhaushalte
 * - schwacheMieter:      einkommensschwache Mieter (<70% Median-Einkommen)
 * - wohneigentumBetrieb: Eigenmietwert-Belastung (Zins + Betrieb, ohne Opp.kosten)
 * - wohneigentumOpp:     inkl. Opportunitätskosten (entgangene Anlage)
 */
export const WOHNMONITOR_BASELINE = {
  alleMieter:          25.1,
  schwacheMieter:      44.8,
  wohneigentumBetrieb: 12.9,
  wohneigentumOpp:     25.7,
} as const;

/**
 * Sensitivitätskoeffizienten für `computeMieteBelastung` (in Prozentpunkten
 * pro +1.0 E1-Wert, normalisiert). Bestimmen, wie stark jeder E1-Markt-Faktor
 * die Mietbelastungsquote einkommensschwacher Haushalte verschiebt.
 *
 * Kalibrierung: Wohnmonitor 2023-Querschnitt + Sotomo ZH-Wohnraumstudie 2025.
 * Werte sind so gewählt, dass eine 1-Sigma-Veränderung in einem E1-Wert
 * die Mietbelastung um ~3-8 Prozentpunkte verschiebt (realistisch).
 */
export const MIETBELASTUNG_SENSITIVITY = {
  /** Nachfragedruck → +X pp pro +1 (knapper Markt = höhere Mieten) */
  nachfragedruck:        8,
  /** Angebotspotenzial → -X pp pro +1 (mehr Angebot = Entlastung) */
  angebotspotenzial:     6,
  /** Mietpreis-Schutzlevel → -X pp pro +1 (Bestandsmieter geschützt) */
  mietpreis_schutzlevel: 5,
  /** Marktfriktion → +X pp pro +1 (weniger Wechsel = mehr Belastung) */
  markfriktion:          3,
} as const;

/** Floor und Ceiling für Mietbelastungsquote (realistische Extreme) */
const MIETBELASTUNG_MIN = 20;
const MIETBELASTUNG_MAX = 70;

/**
 * Sensitivitätskoeffizienten für `computeEigentumBelastung` (in Prozentpunkten
 * pro +1.0 E1-Wert). Analog zu MIETBELASTUNG_SENSITIVITY, aber für
 * Wohneigentum inkl. Opportunitätskosten.
 */
export const EIGENTUM_SENSITIVITY = {
  /** Nachfragedruck → +X pp pro +1 (mehr Nachfrage = teurer) */
  nachfragedruck:            4,
  /** Investitionsattraktivität → -X pp pro +1 (mehr Bau = mehr Eigentum = Entlastung) */
  investitionsattraktivitaet: 3,
} as const;

const EIGENTUM_MIN = 10;
const EIGENTUM_MAX = 45;

// ── Berechnungen ─────────────────────────────────────────────────────────────

/**
 * Berechnet die Mietbelastungsquote (%) für einkommensschwache Haushalte
 * basierend auf E1-Marktzustand. Wohnmonitor-kalibriert.
 *
 * Basis: CH-Durchschnitt einkommensschwache Mieter 2023 = 44.8%
 * Sensitivitäten: siehe `MIETBELASTUNG_SENSITIVITY`
 * Range:          [MIETBELASTUNG_MIN, MIETBELASTUNG_MAX] Prozent
 */
export function computeMieteBelastung(state: MarketState | undefined): number {
  const base = WOHNMONITOR_BASELINE.schwacheMieter;
  if (!state) return base;

  const s = MIETBELASTUNG_SENSITIVITY;
  const delta =
    state.nachfragedruck * s.nachfragedruck
    + (-state.angebotspotenzial) * s.angebotspotenzial
    + (-state.mietpreis_schutzlevel) * s.mietpreis_schutzlevel
    + state.markfriktion * s.markfriktion;

  return Math.max(MIETBELASTUNG_MIN, Math.min(MIETBELASTUNG_MAX, base + delta));
}

/**
 * Berechnet die Wohneigentum-Belastungsquote (%) inkl. Opportunitätskosten.
 * Basis: 25.7% (2023), reagiert auf Nachfragedruck und Investitionsattraktivität.
 * Sensitivitäten: siehe `EIGENTUM_SENSITIVITY`
 * Range:          [EIGENTUM_MIN, EIGENTUM_MAX] Prozent
 */
export function computeEigentumBelastung(state: MarketState | undefined): number {
  const base = WOHNMONITOR_BASELINE.wohneigentumOpp;
  if (!state) return base;

  const s = EIGENTUM_SENSITIVITY;
  const delta =
    state.nachfragedruck * s.nachfragedruck
    + (-state.investitionsattraktivitaet) * s.investitionsattraktivitaet;

  return Math.max(EIGENTUM_MIN, Math.min(EIGENTUM_MAX, base + delta));
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