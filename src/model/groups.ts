// ============================================================
// groups.ts — Preistrends pro Bevölkerungsgruppe
//
// Berechnet für jede der 8 festen Bevölkerungsgruppen den
// erwarteten Preistrend (–1 … +1).
//
// Granularitätsregel: Effekte sind pro Gruppe granular,
// dort wo eine Aufsplittung inhaltlich Sinn macht.
// ============================================================

import type { MarketState, CityParams40, ParamsDiff40 } from '../types';
import { clamp } from './utils';

/** Die 8 festen Bevölkerungsgruppen */
export type GroupId =
  | 'geringverdiener'
  | 'normalverdiener_bestand'
  | 'normalverdiener_angebot'
  | 'glueckspilze'
  | 'normalverdiener_eigentuemer'
  | 'junge_familien'
  | 'genossenschafter'
  | 'rentner'
  | 'high_earner';

export interface GroupMeta {
  id: GroupId;
  label: string;
  shortLabel: string;
  emoji: string;
  description: string;
}

export const GROUPS: GroupMeta[] = [
  {
    id: 'geringverdiener',
    label: 'Geringverdiener',
    shortLabel: 'Geringverd.',
    emoji: '📉',
    description: 'Tiefe Einkommen, auf Sozialhilfe oder stark geförderte Wohnungen angewiesen',
  },
  {
    id: 'normalverdiener_bestand',
    label: 'Bestandsmieter',
    shortLabel: 'Bestand',
    emoji: '🏠',
    description: 'Bestehende Mietverhältnisse, geschützt durch Mietrecht und Regulierung',
  },
  {
    id: 'normalverdiener_angebot',
    label: 'Neumieter (Angebot)',
    shortLabel: 'Angebot',
    emoji: '🔑',
    description: 'Wohnungssuchende auf dem freien Markt zu aktuellen Konditionen',
  },
  {
    id: 'glueckspilze',
    label: 'Glückspilze',
    shortLabel: 'Glückspilze',
    emoji: '🎲',
    description: 'Stark subventionierte/preisgebundene Wohnung (Kostenlimite, Genossenschaftslos)',
  },
  {
    id: 'normalverdiener_eigentuemer',
    label: 'Normalverdiener Eigentümer',
    shortLabel: 'Eigentümer',
    emoji: '🔑',
    description: 'Mittleres Einkommen mit Hypothek',
  },
  {
    id: 'junge_familien',
    label: 'Junge Familien',
    shortLabel: 'Familien',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Haushalte mit Kindern in der Familiengründungsphase',
  },
  {
    id: 'genossenschafter',
    label: 'Genossenschafter',
    shortLabel: 'Genoss.',
    emoji: '🤝',
    description: 'Mitglieder von Wohnbaugenossenschaften',
  },
  {
    id: 'rentner',
    label: 'Rentner',
    shortLabel: 'Rentner',
    emoji: '👴',
    description: 'Pensionierte mit meist fixem Einkommen',
  },
  {
    id: 'high_earner',
    label: 'High Earner',
    shortLabel: 'High Earner',
    emoji: '💼',
    description: 'Gut bis sehr gut verdienende Haushalte',
  },
];

/** Ergebnis pro Gruppe */
export interface GroupPriceTrend {
  group: GroupMeta;
  /** Preistrend: –1 = stark sinkend, 0 = stabil, +1 = stark steigend */
  value: number;
  /** Die wichtigsten Treiber für diese Gruppe (paramKey → Einflussstärke) */
  drivers: Array<{ paramKey: string; label: string; direction: 'up' | 'down'; weight: number }>;
  /** Kurzer Text für Tooltip */
  tooltip: string;
}


// ── Hilfsfunktionen ────────────────────────────────────────────────────────

/**
 * Berechnet den Basis-Preistrend aus dem Markt-Zustand.
 * Positive Werte = Preise steigen.
 * Beruht auf Angebot-Nachfrage-Differenz, modifiziert durch Mietschutz.
 *
 * Die gruppen-spezifischen Faktoren sind **Modell-Design** (nicht Kalibrierung):
 * sie definieren, WAS eine Gruppe ist, nicht WIE STARK sie reagiert. Daher
 * inline statt in `calibration.ts` extrahiert. Jeder Faktor ist mit seiner
 * Design-Rationale kommentiert.
 *
 * Übersicht der Faktoren:
 *
 * | Gruppe                     | Markt-Faktor | Schutz-Faktor | Verdrängung | Andere        | Rationale |
 * |----------------------------|-------------|---------------|-------------|---------------|-----------|
 * | geringverdiener            | 0.5         | -1.0          | —           | —             | Sozialhilfe/EL entkoppeln vom Markt; voller Schutz |
 * | normalverdiener_bestand    | 0.4         | -1.2          | —           | —             | Regulierung schützt stark; reagiert träge |
 * | normalverdiener_angebot    | 1.2         | +0.2          | —           | —             | Volle Marktdynamik; Spillover vom Bestandsschutz |
 * | glueckspilze               | 0.1         | —             | —           | —             | Fast vollständig markt-entkoppelt |
 * | normalverdiener_eigentuemer| 0.5         | —             | —           | -angebot*0.3  | Vermögensaufbau, aber Neubau-Kosten |
 * | junge_familien             | 1.1         | +0.1          | —           | —             | Preissensitiv, grosser Bedarf |
 * | genossenschafter           | 0.3         | —             | —           | -gemkraft*0.5 | Genossenschaft schützt gut |
 * | rentner                    | 0.7         | -0.8          | +verd*0.2   | —             | Fixeinkommen (Schutz+Verdrängung; ETH SPUR CH-008) |
 * | high_earner                | 0.4         | —             | —           | +invest*0.3   | Standort-/Steuer-motiviert, nicht preissensitiv |
 *
 * Der Schutz-Faktor (protectionEffect = mietpreis_schutzlevel × 0.4) dämpft
 * Preisanstieg für Mieter. Der Faktor 0.4 entspricht einer ~40%igen Dämpfung
 * des Marktdrucks bei maximalem Mietpreis-Schutzlevel.
 */
function basePriceTrend(state: MarketState, group: GroupId): { trend: number } {
  // Angebot fördert Preise (negatives angebotspotenzial = mehr Angebot = sinkt)
  const supplyEffect = -state.angebotspotenzial;
  // Nachfrage erhöht Preise
  const demandEffect = state.nachfragedruck;

  const base = supplyEffect + demandEffect;

  // Mietschutz dämpft Preisanstieg für Mieter.
  // Faktor 0.4: ~40% Dämpfung des Marktdrucks bei mietpreis_schutzlevel = +1.
  // Kalibrierung: Sotomo ZH-Wohnraumstudie 2025 — Mieter mit vollem Mietrechtsschutz
  // zahlen ~40% weniger Miete als ungeschützte bei gleicher Marktlage.
  const protectionEffect = state.mietpreis_schutzlevel * 0.4;

  // Gruppe-spezifische Basis-Anpassung (siehe JSDoc oben)
  let groupBase = base;

  if (group === 'geringverdiener') {
    // Geringverdiener sind stärker vom Markt entkoppelt (Sozialhilfe, Ergänzungsleistungen)
    groupBase = base * 0.5 - protectionEffect * 1.0;
  } else if (group === 'normalverdiener_bestand') {
    // Bestandsmieter: Starke Dämpfung durch Regulierung, reagiert träge auf Markt
    groupBase = base * 0.4 - protectionEffect * 1.2;
  } else if (group === 'normalverdiener_angebot') {
    // Neumieter: Volle Marktdynamik, kaum Schutz durch Bestandshürden
    // Hoher Mietschutz für den Bestand kann das Angebot für Neumieter sogar verknappen (Spillover)
    groupBase = base * 1.2 + protectionEffect * 0.2;
  } else if (group === 'glueckspilze') {
    // Glückspilze sind fast vollständig vom Markt entkoppelt
    // Ihre "Preise" (Kostenlimite) steigen nur minimal mit dem Markt
    groupBase = base * 0.1;
  } else if (group === 'normalverdiener_eigentuemer') {
    // Eigentümer profitieren von steigenden Preisen (Vermögensaufbau)
    // aber zahlen auch mehr bei Neubau/Renovation
    groupBase = base * 0.5 + (-state.angebotspotenzial) * 0.3;
  } else if (group === 'junge_familien') {
    // Familien sind sehr preissensitiv, grosser Wohnungsbedarf
    // Oft Neumieter, daher belastet durch Marktdruck
    groupBase = base * 1.1 + protectionEffect * 0.1;
  } else if (group === 'genossenschafter') {
    // Genossenschafter sind gut geschützt durch Gemeinnützigkeit
    groupBase = base * 0.3 - state.gemeinnuetzig_kraft * 0.5;
  } else if (group === 'rentner') {
    // Rentner: zwei gegenläufige Mechaniken.
    // (1) Schutz: Als Bestandsmieter mit fixiertem Einkommen profitieren sie
    //     stark vom Mietrecht (protectionEffect dämpft Preistrend).
    // (2) Verdrängung: ETH SPUR 2025 listet ältere Personen explizit als
    //     verletzliche Gruppe auf dem Wohnungsmarkt (vgl. CH-008). Bei
    //     hohem verdraengungsrisiko steigt ihre Belastung.
    // Die Preissensitivität (Faktor 0.7) reflektiert das fixe Einkommen.
    groupBase = base * 0.7 + state.verdraengungsrisiko * 0.2 - protectionEffect * 0.8;
  } else if (group === 'high_earner') {
    // High Earner sind weniger preissensitiv, mehr steuer- und standortmotiviert
    groupBase = base * 0.4 + state.investitionsattraktivitaet * 0.3;
  }

  return {
    trend: clamp(groupBase),
  };
}

/**
 * Berechnet die wichtigsten Treiber für eine Gruppe.
 * Gibt die Parameter zurück, die den grössten Einfluss auf diese Gruppe haben.
 */
function computeDrivers(
  state: MarketState,
  baseline: CityParams40,
  modified: CityParams40,
  group: GroupId,
): Array<{ paramKey: string; label: string; direction: 'up' | 'down'; weight: number }> {
  const drivers: Array<{ paramKey: string; label: string; direction: 'up' | 'down'; weight: number }> = [];

  // Parameter-Labels für Tooltips
  const paramLabels: Record<string, string> = {
    raumplanung_zonenreserve: 'Zonenreserve',
    raumplanung_verdichtung: 'Verdichtung',
    raumplanung_ausnuetzungsziffer: 'Ausnützungsziffer',
    boden_vorkaufsrecht: 'Vorkaufsrecht',
    boden_bauverpflichtung: 'Bauverpflichtung',
    boden_mehrwertabgabe: 'Mehrwertabgabe',
    boden_bodeneigentumssteuer: 'Bodeneigentumssteuer',
    bau_energievorgaben: 'Energievorgaben',
    bau_sanierungspflicht: 'Sanierungspflicht',
    bau_einspracherecht_dritte: 'Einsprache Dritte',
    bau_einspracherecht_suspensiv: 'Einsprache suspensiv',
    bau_bewilligungsverfahren: 'Bewilligungsverfahren',
    bau_normenharmonisierung: 'Normenharmonisierung',
    gemeinnuetzig_mindestanteil: 'Mindestanteil',
    gemeinnuetzig_foerderfonds: 'Förderfonds',
    gemeinnuetzig_baurecht: 'Baurecht',
    gemeinnuetzig_belegungsvorschriften: 'Belegungsvorschriften',
    gemeinnuetzig_sozialmischung: 'Sozialmischung',
    mietrecht_kostenmiete: 'Kostenmiete',
    mietrecht_anfangsmiete: 'Anfangsmiete',
    mietrecht_mietzinstransparenz: 'Mietspiegel',
    mietrecht_kuendigungsschutz: 'Kündigungsschutz',
    mietrecht_mietzinsindex: 'Mietzinsindex',
    mietrecht_untervermietung: 'Untervermietung',
    steuer_grundstueckgewinn: 'Grundstückgewinnsteuer',
    steuer_eigenmietwert: 'Eigenmietwert',
    steuer_leerstandsabgabe: 'Leerstandsabgabe',
    steuer_handaenderung: 'Handänderungssteuer',
    steuer_kapitalgewinnprivatpersonen: 'Kapitalgewinnsteuer',
    kapital_auslaendische_investoren: 'Ausländ. Investoren',
    kapital_institutionelle_regulierung: 'Instit. Regulierung',
    kapital_hypothekarregulierung: 'Hypothekarregulierung',
    nutzung_kurzzeitvermietung: 'Kurzzeitvermietung',
    nutzung_umnutzungsverbot: 'Umnutzungsverbot',
    nutzung_abbruchverbot: 'Abbruchverbot',
    nutzung_zweitwohnungen: 'Zweitwohnungen',
    infra_oepnv: 'ÖV',
    infra_schule_kita: 'Schule/Kita',
    infra_oeffentlicher_raum: 'Öfftl. Raum',
    infra_wirtschaftsansiedlung: 'Wirtschaftsansiedlung',
  };

  // Gruppe-spezifische Schlüssel-Parameter und ihre Richtungen
  const groupKeyParams: Record<GroupId, Array<{ key: string; direction: 'up' | 'down'; weight: number }>> = {
    geringverdiener: [
      { key: 'mietrecht_kostenmiete', direction: 'down', weight: 1.5 },
      { key: 'mietrecht_kuendigungsschutz', direction: 'down', weight: 1.0 },
      { key: 'nutzung_abbruchverbot', direction: 'down', weight: 0.8 },
      { key: 'bau_sanierungspflicht', direction: 'up', weight: 1.0 },
    ],
    normalverdiener_bestand: [
      { key: 'mietrecht_kuendigungsschutz', direction: 'down', weight: 1.5 },
      { key: 'mietrecht_mietzinsindex', direction: 'down', weight: 1.0 },
      { key: 'mietrecht_kostenmiete', direction: 'down', weight: 0.8 },
    ],
    normalverdiener_angebot: [
      { key: 'raumplanung_verdichtung', direction: 'down', weight: 1.2 },
      { key: 'mietrecht_anfangsmiete', direction: 'down', weight: 1.0 },
      { key: 'bau_ersatzneubau_effizienz', direction: 'down', weight: 1.0 },
    ],
    glueckspilze: [
      { key: 'gemeinnuetzig_foerderfonds', direction: 'down', weight: 1.0 },
      { key: 'gemeinnuetzig_baurecht', direction: 'down', weight: 0.8 },
    ],
    normalverdiener_eigentuemer: [
      { key: 'steuer_eigenmietwert', direction: 'up', weight: 1.5 },
      { key: 'ctx:zinsniveau', direction: 'up', weight: 1.0 },
      { key: 'kapital_hypothekarregulierung', direction: 'down', weight: 0.8 },
    ],
    junge_familien: [
      { key: 'infra_schule_kita', direction: 'up', weight: 1.2 },
      { key: 'infra_oepnv', direction: 'up', weight: 1.0 },
      { key: 'mietrecht_kostenmiete', direction: 'down', weight: 0.8 },
      { key: 'raumplanung_ausnuetzungsziffer', direction: 'up', weight: 0.8 },
    ],
    genossenschafter: [
      { key: 'gemeinnuetzig_mindestanteil', direction: 'down', weight: 1.5 },
      { key: 'gemeinnuetzig_foerderfonds', direction: 'down', weight: 1.2 },
      { key: 'gemeinnuetzig_baurecht', direction: 'down', weight: 1.0 },
    ],
    rentner: [
      { key: 'mietrecht_kuendigungsschutz', direction: 'down', weight: 1.5 },
      { key: 'bau_sanierungspflicht', direction: 'up', weight: 1.2 },
      { key: 'mietrecht_kostenmiete', direction: 'down', weight: 0.8 },
      { key: 'nutzung_abbruchverbot', direction: 'down', weight: 0.8 },
    ],
    high_earner: [
      { key: 'steuer_eigenmietwert', direction: 'up', weight: 1.0 },
      { key: 'infra_oepnv', direction: 'up', weight: 0.8 },
      { key: 'ctx:wirtschaftskraft', direction: 'up', weight: 1.0 },
      { key: 'kapital_institutionelle_regulierung', direction: 'down', weight: 0.8 },
    ],
  };

  const keyParams = groupKeyParams[group] ?? [];

  for (const kp of keyParams) {
    const baseVal = (baseline[kp.key as keyof CityParams40] as number) ?? 1;
    const modVal = (modified[kp.key as keyof CityParams40] as number) ?? 1;
    if (baseVal !== modVal) {
      const delta = modVal - baseVal;
      drivers.push({
        paramKey: kp.key,
        label: paramLabels[kp.key] ?? kp.key,
        // Bei positivem delta bleibt die Richtung, bei negativem dreht sie um.
        // XOR-Logik: Richtung invertiert wenn genau einer der Faktoren (delta oder kp.direction) „negativ" ist.
        direction: (delta > 0) === (kp.direction === 'up') ? 'up' : 'down',
        weight: Math.abs(delta) * kp.weight,
      });
    }
  }

  // Nachbarschafts-Effekte (E1-Werte) wenn sie besonders hoch sind.
  // Schwellwert 0.5 = nur E1-Werte, die substanziell von 0 abweichen (>50% der
  // normalisierten Skala), werden als Treiber aufgenommen. Verhindert, dass
  // schwache E1-Signale als „Top-Treiber" angezeigt werden.
  const E1_DRIVER_THRESHOLD = 0.5;
  if (Math.abs(state.aufwertungsdruck) > E1_DRIVER_THRESHOLD) {
    drivers.push({
      paramKey: 'aufwertungsdruck',
      label: 'Aufwertungsdruck',
      direction: state.aufwertungsdruck > 0 ? 'up' : 'down',
      weight: Math.abs(state.aufwertungsdruck),
    });
  }

  if (Math.abs(state.verdraengungsrisiko) > E1_DRIVER_THRESHOLD) {
    drivers.push({
      paramKey: 'verdraengungsrisiko',
      label: 'Verdrängungsrisiko',
      direction: state.verdraengungsrisiko > 0 ? 'up' : 'down',
      weight: Math.abs(state.verdraengungsrisiko),
    });
  }

  // Sortiere nach Gewicht absteigend, nimm Top 3.
  // Top-3 ist die UI-Konvention für „die wichtigsten Treiber" in der Treiber-Liste.
  const TOP_N_DRIVERS = 3;
  return drivers
    .sort((a, b) => b.weight - a.weight)
    .slice(0, TOP_N_DRIVERS);
}

/**
 * Erstellt einen kurzen Tooltip-Text für eine Gruppe.
 */
function makeTooltip(trend: number, drivers: GroupPriceTrend['drivers']): string {
  // Schwellwert ±0.15 = ±15% der normalisierten Trendskala.
  // Unterhalb: „stabil", oberhalb: „steigend"/"sinkend". Vermeidet
  // über-reaktive Trend-Beschriftungen bei kleinen Schwankungen.
  const TREND_CLASSIFY_THRESHOLD = 0.15;
  const direction = trend > TREND_CLASSIFY_THRESHOLD ? 'steigend' : trend < -TREND_CLASSIFY_THRESHOLD ? 'sinkend' : 'stabil';
  if (drivers.length === 0) return `Preise ${direction}`;
  const topDriver = drivers[0];
  return `Preise ${direction} (v.a. ${topDriver.label})`;
}

// ── Hauptfunktion ──────────────────────────────────────────────────────────

/**
 * Berechnet die Preistrends für alle 8 Bevölkerungsgruppen.
 *
 * @param state   Markt-Zustand (E1) aus computePhasesCached()
 * @param baseline Original-Parameter (Ist-Zustand)
 * @param modified Geänderte Parameter (Nutzer-Szenario)
 * @param diff    Geänderte Parameter (from/to)
 */
export function computeGroupTrends(
  state: MarketState,
  baseline: CityParams40,
  modified: CityParams40,
): GroupPriceTrend[] {
  return GROUPS.map(group => {
    const { trend } = basePriceTrend(state, group.id);
    const drivers = computeDrivers(state, baseline, modified, group.id);
    const tooltip = makeTooltip(trend, drivers);

    return {
      group,
      value: trend,
      drivers,
      tooltip,
    };
  });
}
