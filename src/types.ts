export type ParamValue = 0 | 1 | 2;
export type ContextValue = -2 | -1 | 0 | 1 | 2;

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
  params: CityParams;
}

export type ParamsDiff = Partial<Record<keyof CityParams, {
  from: ParamValue;
  to: ParamValue;
}>>;

export interface ParamMeta {
  key: keyof CityParams;
  label: string;
  helpText: string;
  levels: [string, string, string]; // labels for 0, 1, 2
}

export interface ContextMeta {
  key: keyof CityContext;
  label: string;
  levels: [string, string, string, string, string]; // labels for -2, -1, 0, +1, +2
}
