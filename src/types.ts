// ============================================================
// Domain Types — Wohnkosten-Simulator
// E0: 42 atomare Parameter (Name CityParams40 ist historisch) + Kontext
// E1: lineare Marktvariablen plus provisorische Mietrechts-Zustände (CH-012)
// ============================================================
//
// Sotomo Wohnraumstudie ZH 2025 (Sep.):
//   - bau_ersatzneubau_effizienz: Netto-Neubau pro Abriss (Zürich: 2.8x, Westschweiz: 6+x) — als E0-Parameter
//   - mietbelastungs_grenze: Strukturelles Mietbelastungsniveau (tief: 30%, Viertel >40%) — als CityContext
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
  /**
   * Welches Missbrauchskriterium bindet. Provisorisch, CH-012.
   * 0 = Kosten plus Rendite exklusiv, 1 = heutiges Recht, 2 = Vergleichsmiete bindend.
   */
  mietrecht_kriterium: ParamValue;
  /**
   * Wie stark der Deckel vollzogen wird. Provisorisch, CH-012.
   * 0 = nur auf Klage, 1 = erleichterte Anfechtung, 2 = automatische Prüfung.
   */
  mietrecht_durchsetzung: ParamValue;
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
};

export interface CityContext {
  zinsniveau: ContextValue;
  zuwanderungsdruck: ContextValue;
  wirtschaftskraft: ContextValue;
  bevoelkerungstrend: ContextValue;
  /** Marktverfassung: -2=entspannt (>5% Leerstand), +2=extrem eng (<1% Leerstand) */
  marktenge: ContextValue;
  /**
   * Strukturelles Mietbelastungsniveau (Anteil am Haushaltseinkommen).
   * Quelle: Sotomo Wohnraumstudie ZH 2025 — tiefes Einkommen ~30%, Viertel >40%.
   *
   * Semantik: Read-only Kontextfaktor (nicht via Slider editierbar).
   * Default pro Stadt aus data/cities/switzerland.yaml. Steuert die
   * Marktfriktion als strukturelle Rahmenbedingung.
   */
  mietbelastungs_grenze: ContextValue;
  /**
   * LIK-Jahresteuerung, national, Bins in TEUERUNG_BINS (mietrecht-regime.ts).
   * 2025: +0.2 % → −1. CH-012. Fehlend in Tests = neutral (0), nicht der Stadtwert.
   */
  teuerung?: ContextValue;
  /**
   * ÄNDERUNG des hypothekarischen Referenzzinssatzes in den letzten zwölf
   * Monaten, national, Bins in REFERENZZINS_BINS (mietrecht-regime.ts).
   * Nicht das Niveau: ein tiefer, aber unveränderter Satz begründet weder
   * Erhöhung noch Senkung. Stand 2.9.2026 unverändert bei 1.25 % → 0. CH-012.
   * Fehlend = unverändert (0).
   */
  referenzzins_aenderung?: ContextValue;
  /**
   * Anteil Mietwohnungen in Gebäuden mit Baujahr ≤ Stichtag − 30.
   * BGE 144 III 514. Nicht gefüllt — fehlend heisst «nicht gemessen», nicht 0.
   */
  anteil_altliegenschaft?: number;
  /**
   * Abstand der Bestandsmiete über dem Kosten-plus-Rendite-Deckel, als Anteil.
   * Nicht belegt. Nur mit mietlueckeEstimated setzen.
   */
  mietluecke?: number;
  mietlueckeEstimated?: boolean;
  /**
   * Aktuelle Eigentumsverteilung (Anteile aller Wohneinheiten nach Eigentümertyp).
   *
   * Datenqualität ist NICHT einheitlich (siehe `ownershipBaselineEstimated`):
   * - Zürich beruht auf einer echten Grundbuch-Recherche (Tsüri.ch/WAV 2026),
   *   Summe ~0.94.
   * - Alle anderen Städte sind aus BFS-Mietmarkt-Kennzahlen abgeleitet
   *   (Eigentumsquote + institutioneller/genossenschaftlicher Mietanteil),
   *   NICHT aus einer Vollerhebung. Dort ist `privat` faktisch die
   *   Eigentümerquote (selbstgenutzt) und der grosse Rest zu 1 ("Übrige")
   *   enthält v.a. nicht separat erfasstes privates Vermietereigentum.
   *   Details: docs/recherche/CH/CH-011-eigentuemerschaft.md.
   *
   * Muss in der YAML unter `context` definiert sein (kein Default im Build).
   */
  ownershipBaseline: {
    privat: number;
    institutionell: number;
    genossenschaft: number;
    oeffentlich: number;
  };
  /**
   * true, wenn `ownershipBaseline` geschätzt ist (BFS-Mietmarkt-Proxy statt
   * Grundbuch-Vollerhebung). Steuert den Schätz-Hinweis im OwnershipDonut.
   * Fehlt/false = belastbare Quelldaten (aktuell nur Zürich).
   */
  ownershipBaselineEstimated?: boolean;
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
  marktfriktion: number;              // –1 … +1
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
  /**
   * Tor der Vergleichsmiete, 0…1. Provisorisch, CH-012.
   * Im Status quo 0, auch wenn der Altanteil hoch wäre.
   */
  vergleichsmiete_aktiv: number;
  /** Recht, den laufenden Vertrag zu bewegen. Plus = Erhöhungsspielraum. */
  erhoehungsspielraum: number;
  /** Bestandsmiete, plus = teuer. Nicht das Schutzlevel. */
  bestandsmiete: number;
  /** Anfangsmiete, plus = teuer. */
  anfangsmiete: number;
  /** Verweildauer, plus = länger. Nicht marktfriktion. */
  verweildauer: number;
}

// ── E2: Abgeleitete Indikatoren ──────────────────────────────────────────────

export interface DerivedIndicators {
  gentrifizierungsindex: number;    // –1 … +1
  neubau_hemmnisindex: number;      // –1 … +1 (invertiert von angebotspotenzial)
  verdraengungsrisiko_index: number; // –1 … +1
  fiskalische_wirkung: number;      // –1 … +1
}
