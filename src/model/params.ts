// ============================================================
// params.ts — Parameter-Metadaten & Diff-Funktionen
// V2: 40 atomare Parameter
// ============================================================

import type {
  CityParams40,
  ParamsDiff40,
  ParamMeta40,
  ParamGroup,
  ContextMeta,
} from '../types';

// ── Key-Array ────────────────────────────────────────────────────────────────

/** Die 40 atomaren Parameter-Keys */
export const PARAM_KEYS_40 = [
  // 1. Bodenrecht & Landnutzung
  'raumplanung_zonenreserve',
  'raumplanung_verdichtung',
  'raumplanung_ausnuetzungsziffer',
  'boden_vorkaufsrecht',
  'boden_bauverpflichtung',
  'boden_mehrwertabgabe',
  'boden_bodeneigentumssteuer',
  // 2. Bau & Bewilligung
  'bau_energievorgaben',
  'bau_sanierungspflicht',
  'bau_ersatzneubau_effizienz',
  'bau_einspracherecht_dritte',
  'bau_einspracherecht_suspensiv',
  'bau_bewilligungsverfahren',
  'bau_normenharmonisierung',
  // 3. Gemeinnütziger Wohnungsbau
  'gemeinnuetzig_mindestanteil',
  'gemeinnuetzig_foerderfonds',
  'gemeinnuetzig_baurecht',
  'gemeinnuetzig_belegungsvorschriften',
  'gemeinnuetzig_sozialmischung',
  // 4. Mietrecht
  'mietrecht_kostenmiete',
  'mietrecht_anfangsmiete',
  'mietrecht_mietzinstransparenz',
  'mietrecht_kuendigungsschutz',
  'mietrecht_mietzinsindex',
  'mietrecht_untervermietung',
  // 5. Steuern & Abgaben
  'steuer_grundstueckgewinn',
  'steuer_eigenmietwert',
  'steuer_leerstandsabgabe',
  'steuer_handaenderung',
  'steuer_kapitalgewinnprivatpersonen',
  // 6. Kapital & Investitionen
  'kapital_auslaendische_investoren',
  'kapital_institutionelle_regulierung',
  'kapital_hypothekarregulierung',
  // 7. Nutzungsregulierung
  'nutzung_kurzzeitvermietung',
  'nutzung_umnutzungsverbot',
  'nutzung_abbruchverbot',
  'nutzung_zweitwohnungen',
  // 8. Infrastruktur & Standortqualität
  'infra_oepnv',
  'infra_schule_kita',
  'infra_oeffentlicher_raum',
  'infra_wirtschaftsansiedlung',
  // 9. Markt-Kontext (Sotomo 2025)
  'markt_mietbelastungs_grenze',
] as const;

// Compile-time check: PARAM_KEYS_40 must cover all CityParams40 keys
type _AssertAllKeys40 = typeof PARAM_KEYS_40[number] extends keyof CityParams40
  ? keyof CityParams40 extends typeof PARAM_KEYS_40[number]
    ? true
    : never
  : never;
const _check40: _AssertAllKeys40 = true;
void _check40;

// ── Metadaten: 40 Parameter ─────────────────────────────────────────────────

export const paramMeta40: ParamMeta40[] = [
  // ── 1. Bodenrecht & Landnutzung ──────────────────────────────────────────
  {
    key: 'raumplanung_zonenreserve',
    label: 'Verfügbares Bauland',
    helpText: 'Wie gross ist das Reservoir an ungenutztem Bauland?',
    levels: ['Grosszügige Reserven', 'Knapp bemessen', 'Sehr knapp'],
    group: 'bodenrecht',
  },
  {
    key: 'raumplanung_verdichtung',
    label: 'Pflicht zur Innenverdichtung',
    helpText: 'Innenverdichtung vs. Arealüberbauungen am Stadtrand',
    levels: ['Freiwillig', 'RPG-konform empfohlen', 'Gesetzlich verpflichtend'],
    group: 'bodenrecht',
  },
  {
    key: 'raumplanung_ausnuetzungsziffer',
    label: 'Bebauungsdichte',
    helpText: 'Wie dicht darf in der Zone gebaut werden?',
    levels: ['Lockere Bebauung', 'Städtisch mittel', 'Dichte Überbauung'],
    group: 'bodenrecht',
  },
  {
    key: 'boden_vorkaufsrecht',
    label: 'Kommunales Vorkaufsrecht',
    helpText: 'Kann die Gemeinde Land vorkaufen, bevor es am Markt verkauft wird?',
    levels: ['Kein Vorkaufsrecht', 'Für gemeinnützige Zwecke', 'Umfassendes Recht'],
    group: 'bodenrecht',
  },
  {
    key: 'boden_bauverpflichtung',
    label: 'Baulandhortung',
    helpText: 'Massnahmen gegen das Horten von unbebautem Land',
    levels: ['Hortung erlaubt', 'Mehrwertabgabe bei Nicht-Bebauung', 'Bauverpflichtung mit Frist'],
    group: 'bodenrecht',
  },
  {
    key: 'boden_mehrwertabgabe',
    label: 'Mehrwertabgabe',
    helpText: 'Anteil des Planungsmehrwerts, der bei Umzonung abgeschöpft wird',
    levels: ['Keine Abgabe', '20% (RPG-Minimum)', '50% oder mehr'],
    group: 'bodenrecht',
  },
  {
    key: 'boden_bodeneigentumssteuer',
    label: 'Bodensteuer',
    helpText: 'Separate Steuer auf den Bodenwert (unabhängig vom Gebäudeertrag)',
    levels: ['Keine Bodensteuer', 'Leichte Steuer', 'Hohe Steuer (Hortung unrentabel)'],
    group: 'bodenrecht',
  },

  // ── 2. Bau & Bewilligung ──────────────────────────────────────────────────
  {
    key: 'bau_energievorgaben',
    label: 'Energetische Neubau-Anforderungen',
    helpText: 'Energetische Pflichten für Neubauten',
    levels: ['Keine Pflicht', 'Minergie empfohlen', 'Netto-Null-Pflicht'],
    group: 'bau',
  },
  {
    key: 'bau_sanierungspflicht',
    label: 'Sanierungspflicht Bestand',
    helpText: 'Gesetzliche Pflicht zur energetischen Sanierung von Bestandsbauten',
    levels: ['Keine Pflicht', 'Zielwert empfohlen', 'Gesetzliche Pflicht mit Frist'],
    group: 'bau',
  },
  {
    key: 'bau_ersatzneubau_effizienz',
    label: 'Ersatzneubau-Effizienz',
    helpText: 'Wie viele Netto-Neubauwohnungen entstehen pro abgerissener Wohnung? (Zürich: 2.8x, Lausanne: 6.5x)',
    levels: ['Ineffizient (2–3x)', 'Mittel (3–5x)', 'Effizient (5x+)'],
    group: 'bau',
  },
  {
    key: 'bau_einspracherecht_dritte',
    label: 'Einspracherecht Dritter',
    helpText: 'Wer darf gegen ein Baugesuch Einsprache erheben?',
    levels: ['Nur direkt Betroffene', 'Anrainer im Umkreis', 'Jedermann'],
    group: 'bau',
  },
  {
    key: 'bau_einspracherecht_suspensiv',
    label: 'Suspensiveffekt von Einsprachen',
    helpText: 'Hält eine Einsprache den Bau auf?',
    levels: ['Kein Baustopp', 'Baustopp in begründeten Fällen', 'Automatischer Baustopp'],
    group: 'bau',
  },
  {
    key: 'bau_bewilligungsverfahren',
    label: 'Baubewilligungsverfahren',
    helpText: 'Effizienz und Geschwindigkeit des Verfahrens',
    levels: ['Analog, lange Wartezeiten', 'Teildigital, moderat', 'Volldigital, standardisiert'],
    group: 'bau',
  },
  {
    key: 'bau_normenharmonisierung',
    label: 'Harmonisierung Bauvorschriften',
    helpText: 'Harmonisierung kantonaler Bauvorschriften',
    levels: ['26 kantonale Systeme', 'Teilweise harmonisiert', 'Einheitlicher CH-Standard (SIA)'],
    group: 'bau',
  },

  // ── 3. Gemeinnütziger Wohnungsbau ─────────────────────────────────────────
  {
    key: 'gemeinnuetzig_mindestanteil',
    label: 'Mindestanteil Neubauten',
    helpText: 'Wie viel Prozent der Neubauten müssen gemeinnützig sein?',
    levels: ['0% (kein Mindestanteil)', '10% (Volksinitiative)', '33% (Stadtratsziel)'],
    group: 'gemeinnuetzig',
  },
  {
    key: 'gemeinnuetzig_foerderfonds',
    label: 'Wohnbauförderungsfonds',
    helpText: 'Staatlicher Fonds zur Förderung des gemeinnützigen Wohnungsbaus',
    levels: ['Kein Fonds', 'Kantonaler Fonds, begrenzt', 'Nationaler Fonds, gut ausgestattet'],
    group: 'gemeinnuetzig',
  },
  {
    key: 'gemeinnuetzig_baurecht',
    label: 'Landvergabe im Baurecht',
    helpText: 'Vergabe von Land im Baurecht an Genossenschaften',
    levels: ['Selten, kein Vorrang', 'Aktiv bei freiem Land', 'Systematisches Prioritätsprinzip'],
    group: 'gemeinnuetzig',
  },
  {
    key: 'gemeinnuetzig_belegungsvorschriften',
    label: 'Belegungsvorschriften',
    helpText: 'Regeln zur effizienten Nutzung von Wohnraum',
    levels: ['Keine', 'Empfehlung (freiwillig)', 'Verbindliche Pflicht mit Kontrolle'],
    group: 'gemeinnuetzig',
  },
  {
    key: 'gemeinnuetzig_sozialmischung',
    label: 'Sozialmischung bei Aufzonung',
    helpText: 'Pflicht zu preisgünstigem Wohnanteil bei Quartier-Aufwertung',
    levels: ['Keine Auflage', 'Empfehlung (freiwillig)', 'Gesetzliche Pflicht'],
    group: 'gemeinnuetzig',
  },

  // ── 4. Mietrecht ──────────────────────────────────────────────────────────
  {
    key: 'mietrecht_kostenmiete',
    label: 'Mietzinsprinzip',
    helpText: 'Wie wird der maximal zulässige Mietzins bestimmt?',
    levels: ['Freie Marktmiete', 'Rendite gedeckelt (OR)', 'Kostenmiete (BV verankert)'],
    group: 'mietrecht',
  },
  {
    key: 'mietrecht_anfangsmiete',
    label: 'Anfechtung Anfangsmietzins',
    helpText: 'Unter welchen Bedingungen kann der Anfangsmietzins angefochten werden?',
    levels: ['Nur bei persönlicher Notlage', 'Bei angespanntem Markt', 'Generell anfechtbar'],
    group: 'mietrecht',
  },
  {
    key: 'mietrecht_mietzinstransparenz',
    label: 'Mietzins-Transparenz',
    helpText: 'Welche Informationen über die Mietgeschichte müssen offengelegt werden?',
    levels: ['Keine Pflicht', 'Formular mit Vormietzins + Referenzzinssatz', 'Vollständige Mietzinsgeschichte'],
    group: 'mietrecht',
  },
  {
    key: 'mietrecht_kuendigungsschutz',
    label: 'Kündigungsschutz',
    helpText: 'Schutz vor Kündigung wegen Eigenbedarf oder Sanierung',
    levels: ['Schwacher Schutz', 'Erstreckungsrecht + Entschädigung', 'Vorabprüfung bei Massenkündigungen'],
    group: 'mietrecht',
  },
  {
    key: 'mietrecht_mietzinsindex',
    label: 'Mietzinsanpassungs-Mechanismus',
    helpText: 'Wonach darf die Miete bei Indexierung angepasst werden?',
    levels: ['Referenzzinssatz (heute)', 'Landesindex der Konsumentenpreise (LIK)', 'Gesetzliche Kostenbindung'],
    group: 'mietrecht',
  },
  {
    key: 'mietrecht_untervermietung',
    label: 'Untervermietung / Airbnb',
    helpText: 'Regulierung von Kurzzeitvermietung und Untervermietung',
    levels: ['Frei (keine Einschränkung)', 'Zustimmung nötig', 'Tageslimit + Kündigungsrecht'],
    group: 'mietrecht',
  },

  // ── 5. Steuern & Abgaben ──────────────────────────────────────────────────
  {
    key: 'steuer_grundstueckgewinn',
    label: 'Grundstückgewinnsteuer',
    helpText: 'Steuer auf den Gewinn beim Verkauf von Liegenschaften',
    levels: ['Tief, zeitunabhängig', 'Progressiv (lange Haltung = tiefer)', 'Hoch, auch bei langer Haltung'],
    group: 'steuern',
  },
  {
    key: 'steuer_eigenmietwert',
    label: 'Eigenmietwert',
    helpText: 'Besteuerung des fiktiven Mietwerts von Wohneigentum',
    levels: ['Abgeschafft', 'Heutiges System', 'Erhöhter Ansatz'],
    group: 'steuern',
  },
  {
    key: 'steuer_leerstandsabgabe',
    label: 'Leerstandsabgabe',
    helpText: 'Abgabe auf leer stehende Wohnungen',
    levels: ['Keine', 'Kommunal möglich', 'Gesetzlich verpflichtend'],
    group: 'steuern',
  },
  {
    key: 'steuer_handaenderung',
    label: 'Handänderungssteuer',
    helpText: 'Steuer beim Kauf/Verkauf einer Liegenschaft',
    levels: ['Keine', 'Moderat (1–2%)', 'Hoch (3%+)'],
    group: 'steuern',
  },
  {
    key: 'steuer_kapitalgewinnprivatpersonen',
    label: 'Kapitalgewinnbesteuerung',
    helpText: 'Besteuerung von Kapitalgewinnen aus Liegenschaften für Privatpersonen',
    levels: ['Keine (CH-Standard)', 'Ab einem Schwellenwert', 'Vollständige Besteuerung'],
    group: 'steuern',
  },

  // ── 6. Kapital & Investitionen ─────────────────────────────────────────────
  {
    key: 'kapital_auslaendische_investoren',
    label: 'Lex Koller',
    helpText: 'Beschränkung des Kaufs von Schweizer Liegenschaften durch Ausländer',
    levels: ['Aufgehoben / offen', 'Heutiger Standard (bewilligungspflichtig)', 'Verschärft restriktiv'],
    group: 'kapital',
  },
  {
    key: 'kapital_institutionelle_regulierung',
    label: 'Institutionelle Anleger',
    helpText: 'Regulierung von Fonds, REITs und Pensionskassen',
    levels: ['Keine Regulierung', 'Transparenzpflicht', 'Gesetzliche Renditebegrenzung'],
    group: 'kapital',
  },
  {
    key: 'kapital_hypothekarregulierung',
    label: 'Hypothekarregulierung',
    helpText: 'Regulierung der Kreditvergabe für Immobilienkäufe (LTV, Tragbarkeit)',
    levels: ['Locker (hohe Belehnung)', 'FINMA-Standard (80% LTV)', 'Streng (tieferer LTV, mehr EK)'],
    group: 'kapital',
  },

  // ── 7. Nutzungsregulierung ────────────────────────────────────────────────
  {
    key: 'nutzung_kurzzeitvermietung',
    label: 'Kurzzeitvermietung (Airbnb)',
    helpText: 'Regulierung von gewerblicher Kurzzeitvermietung',
    levels: ['Vollständig frei', 'Meldepflicht + Tageslimit', 'Bewilligungspflicht, strikte Beschränkung'],
    group: 'nutzung',
  },
  {
    key: 'nutzung_umnutzungsverbot',
    label: 'Umwandlungsverbot',
    helpText: 'Verbot der Umwandlung von Wohn- in Nicht-Wohnraum',
    levels: ['Ohne Einschränkung', 'Bewilligungspflicht', 'In Wohnzonen grundsätzlich verboten'],
    group: 'nutzung',
  },
  {
    key: 'nutzung_abbruchverbot',
    label: 'Abbruchschutz',
    helpText: 'Schutz von Wohnraum vor Abriss bei Wohnungsknappheit',
    levels: ['Kein Schutz', 'Prüfpflicht', 'Nur mit gleichwertigem Ersatzneubau'],
    group: 'nutzung',
  },
  {
    key: 'nutzung_zweitwohnungen',
    label: 'Zweitwohnungen',
    helpText: 'Regulierung des Anteils zulässiger Zweitwohnungen',
    levels: ['Unbegrenzt', '20%-Deckel (Weber-Initiative)', 'Strengere kommunale Limits'],
    group: 'nutzung',
  },

  // ── 8. Infrastruktur & Standortqualität ──────────────────────────────────
  {
    key: 'infra_oepnv',
    label: 'Öffentlicher Verkehr',
    helpText: 'Ausbau des ÖV-Angebots (Tram, Bus, S-Bahn)',
    levels: ['Kein Ausbau', 'Moderater Ausbau', 'Starker Ausbau, neue Linien'],
    group: 'infrastruktur',
  },
  {
    key: 'infra_schule_kita',
    label: 'Schulen & Kinderbetreuung',
    helpText: 'Angebot an Schulplätzen und Kitas',
    levels: ['Unterdurchschnittlich', 'Bedarfsgerecht', 'Überdurchschnittlich'],
    group: 'infrastruktur',
  },
  {
    key: 'infra_oeffentlicher_raum',
    label: 'Öffentlicher Raum',
    helpText: 'Qualität von Parks, Plätzen und Grünflächen',
    levels: ['Minimal, wenig Aufenthaltsqualität', 'Bedarfsgerecht', 'Hochwertig, begrünte Quartiere'],
    group: 'infrastruktur',
  },
  {
    key: 'infra_wirtschaftsansiedlung',
    label: 'Wirtschaftsförderung',
    helpText: 'Aktive Ansiedlung von Gewerbe und Unternehmen',
    levels: ['Keine aktive Förderung', 'Moderate Anreize', 'Starke Förderung (Gewerbezonen)'],
    group: 'infrastruktur',
  },
  {
    key: 'markt_mietbelastungs_grenze',
    label: 'Mietbelastungsgrenze',
    helpText: 'Strukturelles Niveau der Mietbelastung (Anteil am Haushaltseinkommen). Sotomo 2025: Tiefes Einkommen 30%, Viertel über 40%.',
    levels: ['Tief (<20%)', 'Mittel (20–30%)', 'Hoch (>30%)'],
    group: 'infrastruktur',
  },
];

export const contextMeta: ContextMeta[] = [
  { key: 'zinsniveau', label: 'Zinsniveau', levels: ['sehr niedrig', 'niedrig', 'neutral', 'hoch', 'sehr hoch'] },
  { key: 'zuwanderungsdruck', label: 'Zuwanderung', levels: ['stark sinkend', 'sinkend', 'stabil', 'wachsend', 'stark wachsend'] },
  { key: 'wirtschaftskraft', label: 'Wirtschaftskraft', levels: ['sehr schwach', 'schwach', 'mittel', 'stark', 'sehr stark'] },
  { key: 'bevoelkerungstrend', label: 'Bevölkerung', levels: ['stark sinkend', 'sinkend', 'stabil', 'wachsend', 'stark wachsend'] },
  { key: 'marktenge', label: 'Marktenge', levels: ['entspannt', 'leicht eng', 'moderat', 'angespannt', 'extrem eng'] },
];

// ── Diff-Funktionen ──────────────────────────────────────────────────────────

export function computeDiff40(baseline: CityParams40, modified: CityParams40): ParamsDiff40 {
  const diff: ParamsDiff40 = {};
  for (const key of PARAM_KEYS_40) {
    if (baseline[key] !== modified[key]) {
      diff[key] = { from: baseline[key], to: modified[key] };
    }
  }
  return diff;
}

export function hasChanges40(baseline: CityParams40, modified: CityParams40): boolean {
  return PARAM_KEYS_40.some(key => baseline[key] !== modified[key]);
}

// ── Group-Map für UI ─────────────────────────────────────────────────────────

export const PARAM_GROUP_LABELS: Record<ParamGroup, string> = {
  bodenrecht:    'Bodenrecht & Landnutzung',
  bau:           'Bau & Bewilligung',
  gemeinnuetzig: 'Gemeinnütziger Wohnungsbau',
  mietrecht:     'Mietrecht',
  steuern:       'Steuern & Abgaben',
  kapital:       'Kapital & Investitionen',
  nutzung:       'Nutzungsregulierung',
  infrastruktur: 'Infrastruktur & Standortqualität',
};

export const PARAM_GROUP_ORDER: ParamGroup[] = [
  'bodenrecht', 'bau', 'gemeinnuetzig', 'mietrecht',
  'steuern', 'kapital', 'nutzung', 'infrastruktur',
];

/** paramMeta40 nach Gruppe gruppiert */
export function paramsByGroup(): Record<ParamGroup, ParamMeta40[]> {
  const result = {} as Record<ParamGroup, ParamMeta40[]>;
  for (const g of PARAM_GROUP_ORDER) {
    result[g] = paramMeta40.filter(p => p.group === g);
  }
  return result;
}
