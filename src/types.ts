// ============================================================
// Domain Types — Wohnkosten-Simulator
// E0: 44 atomare Parameter (Name CityParams40 ist historisch) + Kontext
// E1: lineare Marktvariablen plus provisorische Mietrechts-Zustände (CH-012)
// ============================================================
//
// Sotomo Wohnraumstudie ZH 2025 (Sep.):
//   - bau_ersatzneubau_effizienz: Netto-Neubau pro Abriss (Zürich: 2.8x, Westschweiz: 6+x) — als E0-Parameter
//   Quelle: https://www.sotomo.ch/files/data/projectfile/2025/09/Sotomo-Wohnraumstudie-%E2%80%93-ZHK-2025-09.pdf
//

export type ParamValue = 0 | 1 | 2;
export type ContextValue = -2 | -1 | 0 | 1 | 2;

// ── E0: Rohparameter ─────────────────────────────────────────────────────────

/** 44 atomare Parameter (Typname historisch) */
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
  /** Ausgleich für den Pflichtanteil (Dichtebonus u. ä.); schaltet die Angebotswirkung des Mindestanteils. */
  gemeinnuetzig_ausgleich: ParamValue;
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
   * LIK-Jahresteuerung, national, Bins in TEUERUNG_BINS (mietrecht-regime.ts).
   * 2025: +0.2 % → −1. CH-012. Die Stufe ist eine Lage in der Reihe, keine
   * Grösse: Stufe 0 ist 0.5–1.5 %, nicht null Teuerung (TEUERUNG_STUFE_PROZENT).
   * Fehlend in Tests = keine Teuerung, nicht der Stadtwert.
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
   * Anteil Wohnungen in Gebäuden mit Baujahr ≤ Stichtag − 30, Rohwert 0…1.
   * BGE 144 III 514. Gefüllt aus BFS GWS 31.12.2025 (DF_GWS_REG5): Wohnungen
   * ohne Einfamilienhäuser, Bauperiode bis 1995. Nicht nur Mietwohnungen (pro
   * Gemeinde nicht publiziert), eher unterschätzt; Messvorschrift im Kopf von
   * switzerland.yaml und in CH-012. Wirkt nur über WIRKSAMKEIT_OQU (heute 0).
   * Fehlend heisst «nicht gemessen», nicht 0.
   */
  anteil_altliegenschaft?: number;
  /**
   * NUR ANZEIGE, fliesst in keine Rechnung. Verhältnis der Nettomiete bei
   * Neubezug zur Nettomiete bei 21 und mehr Jahren Mietdauer (BFS
   * Strukturerhebung 2024). `ebene` sagt, ob der Wert für die Stadt
   * (T 09.03.03.67) oder nur für den Kanton (T 09.03.03.64) vorliegt; die
   * beiden Ebenen sind nicht vergleichbar. Messvorschrift im Kopf von
   * switzerland.yaml. Nicht mit `mietluecke` verwechseln: Das ist nicht der
   * Abstand zum zulässigen Ertrag (CH-012).
   */
  mietabstand_neubezug?: { faktor: number; ebene: 'stadt' | 'kanton' };
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
  /**
   * Was eine HÖHERE Stufe (0 → 2) inhaltlich bedeutet, in einem Halbsatz.
   * Pflichtfeld, damit das Vorzeichen einer Kante gegen die Skala gelesen
   * wird und nicht gegen den Namen des Parameters. Zwei Kanten hatten bis
   * 2026-11 das falsche Vorzeichen, weil «Zonenreserve ↑» als «mehr Bauland»
   * gelesen wurde (die Skala läuft umgekehrt). Erscheint in der generierten
   * docs/architektur/01-graph-kanten.md.
   */
  hoeherBedeutet: string;
  /**
   * 'nicht_belegt': Für die Wirkung dieses Parameters fehlt in
   * docs/recherche/ (summary.md und Einzelnotizen) die empirische Evidenz. Der Schieber bleibt,
   * wird im Panel aber gekennzeichnet (Entscheid 5, Verbesserungsplan 2026-11).
   */
  evidenz?: 'nicht_belegt';
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
