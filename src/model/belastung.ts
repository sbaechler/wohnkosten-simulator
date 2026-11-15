// ============================================================
// belastung.ts — Miet- und Wohneigentum-Belastungsberechnung
//
// Referenzwerte aus dem Wohnmonitor des BWO, Ausgabe «Die Lage auf dem
// Wohnungsmarkt 2026/1» (wohnmonitor.admin.ch):
//
// Wohnkostenbelastung (Anteil Wohnkosten am Bruttohaushaltseinkommen):
//   Gruppe                           |  2018  |  2023  | Trend
//   --------------------------------|--------|--------|------
//   Alle Mieter                     |  25.0% |  25.1% | → stabil
//   Einkommensschwache Mieter       |  43.6% |  44.8% | ↗ steigend
//   Wohneigentum (Zins+Betrieb)     |    —   |  12.9% | Referenzwert
//   Wohneigentum (inkl. Opportunität) | —   |  25.7% | Referenzwert
//
// Der Wert 44.8 % gilt nur für Haushalte mit mehr als 20'000 CHF
// Äquivalenzeinkommen pro Person. Er ist ein Querschnitt über ALLE
// einkommensschwachen Mieterhaushalte, also überwiegend Bestandsmieter;
// Neumieter sind der kleinere Teil (Fix-14).
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
//
// Die Basis ist für alle Städte der CH-Wert. Ein stadtspezifischer Wert
// fehlt in den Daten; das frühere Kontextfeld `mietbelastungs_grenze` war
// nicht gemessen und ist entfernt (Fix-14, 2026-11-15).
// ============================================================

import type { MarketState } from '../types';

// ── Referenzwerte ────────────────────────────────────────────────────────────

/**
 * Wohnmonitor BWO, «Die Lage auf dem Wohnungsmarkt 2026/1» — Belastungsquoten 2023:
 * - alleMieter:          CH-Durchschnitt aller Mieterhaushalte
 * - schwacheMieter:      einkommensschwache Mieter (<70% Median-Einkommen);
 *                        nur Haushalte mit mehr als 20'000 CHF
 *                        Äquivalenzeinkommen pro Person
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
 * Alle Werte sind Setzungen, nicht kalibriert. Keine Quelle im Repo liefert
 * Sensitivitäten: Der Wohnmonitor gibt nur Niveaus, Sotomo nur ein Niveau
 * (unteres Einkommensdrittel Agglomeration Zürich rund 30 %, Nachfrage-
 * monitor 2022). Gewählt so, dass ein voller Schritt eines E1-Werts die
 * Quote um einige Prozentpunkte verschiebt.
 *
 * Lesart (Fix-14): Die Kennzahl ist ein Querschnitt, überwiegend Bestands-
 * mieter. Marktdruck (Nachfrage, Angebot) erreicht diese Haushalte über
 * Mieterwechsel und Neuvermietung; der Schutz wirkt direkt auf den Bestand.
 */
export const MIETBELASTUNG_SENSITIVITY = {
  /** Nachfragedruck → +X pp pro +1 (knapper Markt = höhere Mieten). Setzung. */
  nachfragedruck:        8,
  /** Angebotspotenzial → -X pp pro +1 (mehr Angebot = Entlastung). Setzung. */
  angebotspotenzial:     6,
  /** Mietpreis-Schutzlevel → -X pp pro +1 (Bestandsmieter geschützt). Setzung. */
  mietpreis_schutzlevel: 5,
  /**
   * Gemeinnützige Kraft → -X pp pro +1 (Fix-14, 2026-11-15). Quelle für die
   * Richtung: AT-002 (WIFO 2023): gemeinnütziger Wohnbau dämpft die Mieten,
   * direkt für seine Bewohner (Wien: Gemeindewohnung ø 5.10 €/m², rund ein
   * Viertel unter dem Privatmarkt) und über die Konkurrenz auch im privaten
   * Markt. Seit Fix-12 laufen Mindestanteil, Förderfonds und Baurecht nicht
   * mehr über `nachfragedruck`; ohne diesen Term erreichte ihre Preiswirkung
   * die Mietbelastung nicht.
   *
   * Grösse 2: Setzung. Grössenordnung: hätte bei +1 rund jeder sechste
   * weitere einkommensschwache Haushalt eine um ein Viertel günstigere
   * Wohnung, sänke die Quote um 44.8 × 0.25 / 6 ≈ 1.9 pp. Wie viele Haushalte
   * +1 entspricht, ist nicht belegt.
   */
  gemeinnuetzig_kraft:   2,
} as const;

/*
 * Kein Term für `marktfriktion` (bis 2026-11-15: +3 pp pro +1, «weniger
 * Wechsel = mehr Belastung», ohne Quelle). Für eine Kennzahl über den
 * Bestand ist schon das Vorzeichen offen: weniger Wechsel heisst auch,
 * dass weniger Haushalte zu Marktmieten neu abschliessen. Der Term machte
 * eine Stufe Kostenmiete in P3 um 0.41 pp teurer (Fix-14).
 */

/** Floor und Ceiling für Mietbelastungsquote (realistische Extreme) */
const MIETBELASTUNG_MIN = 20;
const MIETBELASTUNG_MAX = 70;

/**
 * Sensitivitätskoeffizienten für `computeEigentumBelastung` (in Prozentpunkten
 * pro +1.0 E1-Wert). Analog zu MIETBELASTUNG_SENSITIVITY, aber für
 * Wohneigentum inkl. Opportunitätskosten. Setzungen, nicht kalibriert.
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
 * basierend auf E1-Marktzustand. Basis aus dem Wohnmonitor, Sensitivitäten
 * gesetzt.
 *
 * Basis: CH-Durchschnitt einkommensschwache Mieter 2023 = 44.8% (alle Städte)
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
    + (-state.gemeinnuetzig_kraft) * s.gemeinnuetzig_kraft;

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