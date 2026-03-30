// ============================================================
// Domain Types — Wohnkosten-Simulator
// E0: 40 atomic parameters + 4 context factors
// E1: 10 MarketState variables (normalized –1…+1)
// E2: 5 DerivedIndicators
// ============================================================

export type ParamValue = 0 | 1 | 2;
export type ContextValue = -2 | -1 | 0 | 1 | 2;

// ── E0: Rohparameter ─────────────────────────────────────────────────────────

/** 40 atomare Parameter (neu, ab V2) */
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
};

/** 10 alte Parameter (V1 — für Migration) */
export interface CityParams {
  raumplanung: ParamValue;
  bauvorschriften: ParamValue;
  energetischeVorgaben: ParamValue;
  mietrecht: ParamValue;
  steuerpolitik: ParamValue;
  foerderungGemeinnuetzig: ParamValue;
  subventionen: ParamValue;
  einspracherechte: ParamValue;
  infrastruktur: ParamValue;
  auslaendischeInvestitionen: ParamValue;
}

export interface CityContext {
  zinsniveau: ContextValue;
  zuwanderungsdruck: ContextValue;
  wirtschaftskraft: ContextValue;
  bevoelkerungstrend: ContextValue;
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

export type ParamsDiff = Partial<Record<keyof CityParams, {
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

export interface ParamMeta {
  key: keyof CityParams;
  label: string;
  helpText: string;
  levels: [string, string, string];
}

export interface ContextMeta {
  key: keyof CityContext;
  label: string;
  levels: [string, string, string, string, string];
}

// ── E1: Markt-Zustandsvariablen ───────────────────────────────────────────────

export interface MarketState {
  angebotspotenzial: number;        // –1 … +1
  nachfragedruck: number;            // –1 … +1
  mietpreis_schutzlevel: number;    // –1 … +1
  verdraengungsrisiko: number;       // –1 … +1
  spekulationshemmung: number;      // –1 … +1
  markfriktion: number;             // –1 … +1
  gemeinnuetzig_kraft: number;       // –1 … +1
  eigentumsquoten_trend: number;    // –1 … +1
  aufwertungsdruck: number;         // –1 … +1
  investitionsattraktivitaet: number; // –1 … +1
}

// ── E2: Abgeleitete Indikatoren ──────────────────────────────────────────────

export interface DerivedIndicators {
  gentrifizierungsindex: number;    // –1 … +1
  neubau_hemmnisindex: number;      // –1 … +1 (invertiert von angebotspotenzial)
  verdraengungsrisiko_index: number; // –1 … +1
  fiskalische_wirkung: number;      // –1 … +1
}
