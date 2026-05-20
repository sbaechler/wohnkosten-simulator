// ============================================================
// Domain Types — Wohnkosten-Simulator
// E0: 42 atomic parameters (40 + 2 new from Sotomo ZH-Wohnraumstudie 2025)
// E1: 10 MarketState variables (normalized –1…+1)
// E2: 5 DerivedIndicators
// ============================================================
//
// Neue Parameter (Sotomo Wohnraumstudie ZH, September 2025):
//   - bau_ersatzneubau_effizienz: Netto-Neubau pro Abriss (Zürich: 2.8x, Westschweiz: 6+x)
//   - markt_mietbelastungs_grenze: Strukturelles Mietbelastungsniveau (tief: 30%, Viertel >40%)
//   Quelle: https://www.sotomo.ch/files/data/projectfile/2025/09/Sotomo-Wohnraumstudie-%E2%80%93-ZHK-2025-09.pdf
//

export type ParamValue = 0 | 1 | 2;
export type ContextValue = -2 | -1 | 0 | 1 | 2;

// ── E0: Rohparameter ─────────────────────────────────────────────────────────

/** 40 atomare Parameter */
export type CityParams40 = {
  // 1. Bodenrecht & Landnutzung
  raumplanung_zonenreserve: ParamValue;
  raumplanung_verdichtung: ParamValue;
  raumplanung_ausnuetzungsziffer: ParamValue;
  boden_vorkaufsrecht: ParamValue;
  boden_bauverpflichtung: ParamValue;
  boden_mehrwertabgabe: ParamValue;
  boden_bodeneigentumssteuer: ParamValue;
  // 2. Bau & Bewilligung
  bau_energievorgaben: ParamValue;
  bau_sanierungspflicht: ParamValue;
  bau_ersatzneubau_effizienz: ParamValue; // Sotomo 2025: Netto-Neubau pro Abriss (Zürich 2.8x, WSchweiz 6+x)
  bau_einspracherecht_dritte: ParamValue;
  bau_einspracherecht_suspensiv: ParamValue;
  bau_bewilligungsverfahren: ParamValue;
  bau_normenharmonisierung: ParamValue;
  // 3. Gemeinnütziger Wohnungsbau
  gemeinnuetzig_mindestanteil: ParamValue;
  gemeinnuetzig_foerderfonds: ParamValue;
  gemeinnuetzig_baurecht: ParamValue;
  gemeinnuetzig_belegungsvorschriften: ParamValue;
  gemeinnuetzig_sozialmischung: ParamValue;
  // 4. Mietrecht
  mietrecht_kostenmiete: ParamValue;
  mietrecht_anfangsmiete: ParamValue;
  mietrecht_mietzinstransparenz: ParamValue;
  mietrecht_kuendigungsschutz: ParamValue;
  mietrecht_mietzinsindex: ParamValue;
  mietrecht_untervermietung: ParamValue;
  // 5. Steuern & Abgaben
  steuer_grundstueckgewinn: ParamValue;
  steuer_eigenmietwert: ParamValue;
  steuer_leerstandsabgabe: ParamValue;
  steuer_handaenderung: ParamValue;
  steuer_kapitalgewinnprivatpersonen: ParamValue;
  // 6. Kapital & Investitionen
  kapital_auslaendische_investoren: ParamValue;
  kapital_institutionelle_regulierung: ParamValue;
  kapital_hypothekarregulierung: ParamValue;
  // 7. Nutzungsregulierung
  nutzung_kurzzeitvermietung: ParamValue;
  nutzung_umnutzungsverbot: ParamValue;
  nutzung_abbruchverbot: ParamValue;
  nutzung_zweitwohnungen: ParamValue;
  // 8. Infrastruktur & Standortqualität
  infra_oepnv: ParamValue;
  infra_schule_kita: ParamValue;
  infra_oeffentlicher_raum: ParamValue;
  infra_wirtschaftsansiedlung: ParamValue;
  // 9. Markt-Kontext (statistische Referenzwerte, keine Steuerung)
  /** Strukturelles Mietbelastungsniveau (Anteil am Haushaltseinkommen) */
  markt_mietbelastungs_grenze: ParamValue; // Sotomo 2025: tiefes Einkommen 30%, Viertel >40%
};

export interface CityContext {
  zinsniveau: ContextValue;
  zuwanderungsdruck: ContextValue;
  wirtschaftskraft: ContextValue;
  bevoelkerungstrend: ContextValue;
  /** Marktverfassung: -2=entspannt (>5% Leerstand), +2=extrem eng (<1% Leerstand) */
  marktenge: ContextValue;
}

export interface CityConfig {
  slug: string;
  name: string;
  context: CityContext;
  params: CityParams40;
}

// ── Diffs ───────────────────────────────────────────────────────────────────

export type ParamsDiff40 = Partial<Record<keyof CityParams40, {
  from: ParamValue;
  to: ParamValue;
}>>;

// ── Metadaten ───────────────────────────────────────────────────────────────

export type ParamGroup =
  | 'bodenrecht'
  | 'bau'
  | 'gemeinnuetzig'
  | 'mietrecht'
  | 'steuern'
  | 'kapital'
  | 'nutzung'
  | 'infrastruktur';

export interface ParamMeta40 {
  key: keyof CityParams40;
  label: string;
  helpText: string;
  levels: [string, string, string];
  group: ParamGroup;
}

export interface ContextMeta {
  key: keyof CityContext;
  label: string;
  levels: [string, string, string, string, string];
}

// ── E1: Markt-Zustandsvariablen ───────────────────────────────────────────────

export interface MarketState {
  /** Physisches Bau-/Planungspotenzial — Beeinflusst MAXIMALE Menge (Verschiebung der Angebotskurve nach rechts) */
  angebotspotenzial: number;        // –1 … +1
  /** Nachfragedruck — Beeinflusst die nachgefragte Menge bei gegebenem Preis (Verschiebung der Nachfragekurve) */
  nachfragedruck: number;            // –1 … +1
  /** Mietpreis-Schutzniveau — Wie stark schützt Regulierung Bestandsmieter */
  mietpreis_schutzlevel: number;     // –1 … +1
  /** Verdrängungsrisiko — Wahrscheinlichkeit, dass Mieter durch Aufwertung verdrängt werden */
  verdraengungsrisiko: number;        // –1 … +1
  /** Spekulationshemmung — Wie stark hemmen Steuern/Abgaben spekulatives Halten */
  spekulationshemmung: number;        // –1 … +1
  /** Marktfriktion — Wie stark bremst Regulierung den Wohnungswechsel */
  markfriktion: number;              // –1 … +1
  /** Gemeinnützige Kraft — Stärke des gemeinnützigen Sektors */
  gemeinnuetzig_kraft: number;       // –1 … +1
  /** Eigentumsquoten-Trend — Trend zu Wohneigentum vs. Miete */
  eigentumsquoten_trend: number;    // –1 … +1
  /** Aufwertungsdruck — Wie stark wird der Stadtraum aufgewertet (Gentifizierungstreiber) */
  aufwertungsdruck: number;         // –1 … +1
  /** Investitionsattraktivität — Wie attraktiv ist der Markt für Immobilieninvestoren */
  investitionsattraktivitaet: number; // –1 … +1
  /**
   * Angebotsregulation (Phase 3 Trennung): Elastizität des Angebots in Bezug auf Preisänderungen.
   *
   * -1 = dereguliert, elastisch: Angebot reagiert stark auf Preissignale (Milei-Effekt)
   *  0 = neutral
   * +1 = stark reguliert, unelastisch: Angebot reagiert kaum auf Preissignale (Stockholm)
   *
   * Beeinflusst die STEGUNG der Angebotskurve im Preis-Mengen-Diagramm:
   * steepness = 0.8 × (1 + ang ebotsregulation × 0.5)
   * → Hohe Regulation → steilere Kurve (weniger Elastizität)
   */
  angebotspotenzial_regulation: number; // –1 … +1
}

// ── E2: Abgeleitete Indikatoren ──────────────────────────────────────────────

export interface DerivedIndicators {
  gentrifizierungsindex: number;    // –1 … +1
  neubau_hemmnisindex: number;      // –1 … +1 (invertiert von angebotspotenzial)
  verdraengungsrisiko_index: number; // –1 … +1
  fiskalische_wirkung: number;      // –1 … +1
}
