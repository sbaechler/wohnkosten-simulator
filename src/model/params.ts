import type { CityParams, ParamsDiff, ParamMeta, ContextMeta } from '../types';

const PARAM_KEYS = [
  'raumplanung', 'bauvorschriften', 'energetischeVorgaben', 'mietrecht',
  'steuerpolitik', 'foerderungGemeinnuetzig', 'subventionen',
  'einspracherechte', 'infrastruktur', 'auslaendischeInvestitionen',
] as const;

// Compile-time check: PARAM_KEYS must cover all CityParams keys (and nothing extra)
type _AssertAllParamKeys = typeof PARAM_KEYS[number] extends keyof CityParams
  ? keyof CityParams extends typeof PARAM_KEYS[number]
    ? true
    : never
  : never;
const _check: _AssertAllParamKeys = true;
void _check;

export function computeDiff(baseline: CityParams, modified: CityParams): ParamsDiff {
  const diff: ParamsDiff = {};
  for (const key of PARAM_KEYS) {
    if (baseline[key] !== modified[key]) {
      diff[key] = { from: baseline[key], to: modified[key] };
    }
  }
  return diff;
}

export function hasChanges(baseline: CityParams, modified: CityParams): boolean {
  return PARAM_KEYS.some(key => baseline[key] !== modified[key]);
}

export const paramMeta: ParamMeta[] = [
  { key: 'raumplanung', label: 'Raumplanung', helpText: 'Zonenpläne, Bauzonen, Ausnützungsziffern', levels: ['locker', 'mittel', 'streng'] },
  { key: 'bauvorschriften', label: 'Bauvorschriften', helpText: 'Brandschutz, Lärmschutz, Parkplatzvorgaben', levels: ['minimal', 'moderat', 'streng'] },
  { key: 'energetischeVorgaben', label: 'Energetische Vorgaben', helpText: 'Dämmung, Heizsysteme, Sanierungspflichten', levels: ['minimal', 'moderat', 'streng'] },
  { key: 'mietrecht', label: 'Mietrecht', helpText: 'Mietpreisbremse, Kündigungsschutz, Renditedeckelung', levels: ['schwach', 'moderat', 'streng'] },
  { key: 'steuerpolitik', label: 'Steuerpolitik', helpText: 'Grundsteuer, Handänderungssteuer, Eigenmietwert', levels: ['niedrig', 'mittel', 'hoch'] },
  { key: 'foerderungGemeinnuetzig', label: 'Förderung Gemeinnützig', helpText: 'Genossenschaften, Baurecht-Vergabe, Vorkaufsrechte', levels: ['keine', 'moderat', 'stark'] },
  { key: 'subventionen', label: 'Subventionen', helpText: 'Wohneigentum, Sanierungszuschüsse, Wohngeld', levels: ['keine', 'moderat', 'stark'] },
  { key: 'einspracherechte', label: 'Einspracherechte', helpText: 'Rekursmöglichkeiten gegen Bauprojekte', levels: ['eingeschränkt', 'normal', 'weitreichend'] },
  { key: 'infrastruktur', label: 'Infrastruktur', helpText: 'ÖV-Ausbau, Strassenanbindung, öffentliche Einrichtungen', levels: ['kein Ausbau', 'moderat', 'stark'] },
  { key: 'auslaendischeInvestitionen', label: 'Ausländische Investitionen', helpText: 'Regulierung von ausländischem Kapital (Lex Koller)', levels: ['offen', 'reguliert', 'restriktiv'] },
];

export const contextMeta: ContextMeta[] = [
  { key: 'zinsniveau', label: 'Zinsniveau', levels: ['sehr niedrig', 'niedrig', 'neutral', 'hoch', 'sehr hoch'] },
  { key: 'zuwanderungsdruck', label: 'Zuwanderung', levels: ['stark sinkend', 'sinkend', 'stabil', 'wachsend', 'stark wachsend'] },
  { key: 'wirtschaftskraft', label: 'Wirtschaftskraft', levels: ['sehr schwach', 'schwach', 'mittel', 'stark', 'sehr stark'] },
  { key: 'bevoelkerungstrend', label: 'Bevölkerung', levels: ['stark sinkend', 'sinkend', 'stabil', 'wachsend', 'stark wachsend'] },
];
