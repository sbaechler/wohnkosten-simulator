// ============================================================
// groups.ts — Preistrends pro Bevölkerungsgruppe
//
// Berechnet für jede der 9 festen Bevölkerungsgruppen den
// erwarteten Preistrend (–1 … +1).
//
// Granularitätsregel: Effekte sind pro Gruppe granular,
// dort wo eine Aufsplittung inhaltlich Sinn macht.
// ============================================================

import type { CityContext, MarketState } from '../types';
import { clamp } from './utils';

/**
 * Kontext, den das Gruppenmodell neben dem Markt-Zustand liest. Heute nur
 * die Änderung des Referenzzinssatzes (Zinskanal der Eigentümer, Fix-14).
 * Als Pick von CityContext, damit jeder Aufrufer den Stadt-Kontext direkt
 * übergeben kann; fehlendes Feld = unverändert.
 */
export type GroupContext = Pick<CityContext, 'referenzzins_aenderung'>;

/** Die 9 festen Bevölkerungsgruppen */
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

/**
 * Ein geänderter Parameter und sein Beitrag zum Preistrend einer Gruppe.
 * Wird in group-drivers.ts per Leave-one-out aus der Pipeline bestimmt.
 */
export interface GroupDriver {
  paramKey: string;
  label: string;
  /** 'up' = dieser Parameter hebt den Preistrend der Gruppe, 'down' = er senkt ihn */
  direction: 'up' | 'down';
  /** Betrag des Beitrags zum Trend (Index-Punkte) */
  weight: number;
}

/** Ergebnis pro Gruppe */
export interface GroupPriceTrend {
  group: GroupMeta;
  /** Preistrend: –1 = stark sinkend, 0 = stabil, +1 = stark steigend */
  value: number;
  /** Die wichtigsten Treiber für diese Gruppe, aus der Rechnung abgeleitet (group-drivers.ts) */
  drivers: GroupDriver[];
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
 * | geringverdiener            | 0.5         | -1.0          | +verd*0.2   | —             | Sozialhilfe/EL entkoppeln vom Markt; voller Schutz; Verdrängung (CH-008) |
 * | normalverdiener_bestand    | 0.4         | -1.2          | —           | —             | Regulierung schützt stark; reagiert träge |
 * | normalverdiener_angebot    | 1.2         | +0.2          | —           | -gemkraft*0.25| Volle Marktdynamik; Spillover vom Bestandsschutz; gemeinnützige Konkurrenz dämpft die Marktmiete (AT-002) |
 * | glueckspilze               | 0.1         | —             | —           | —             | Fast vollständig markt-entkoppelt |
 * | normalverdiener_eigentuemer| 0.5         | —             | —           | -angebot*0.3, +zinsÄnd*0.3 | Vermögensaufbau, aber Neubau-Kosten; Hypothekarzins (Referenzzins-Änderung) |
 * | junge_familien             | 1.1         | +0.1          | —           | —             | Preissensitiv, grosser Bedarf |
 * | genossenschafter           | 0.3         | —             | —           | -gemkraft*0.5 | Genossenschaft schützt gut |
 * | rentner                    | 0.7         | -0.8          | +verd*0.2   | —             | Fixeinkommen (Schutz+Verdrängung; ETH SPUR CH-008) |
 * | high_earner                | 0.4         | —             | —           | +invest*0.3   | Standort-/Steuer-motiviert, nicht preissensitiv |
 *
 * Der Schutz-Faktor (protectionEffect = mietpreis_schutzlevel × 0.4) dämpft
 * den Preisanstieg für Mieter. 0.4 ist eine Setzung (siehe unten).
 */
/**
 * Verdrängungsterm der Geringverdiener (Fix-14, 2026-11-15).
 *
 * Quelle: CH-008 (ETH SPUR 2025 im Auftrag des BWO): Verdrängt werden vor
 * allem vulnerable Personen, «besonders Haushalte mit niedrigem Einkommen und
 * ältere Personen», die nur schwer wieder bezahlbaren Wohnraum finden. Der
 * Marktfaktor 0.5 bildet ab, dass Sozialhilfe/EL die laufende Miete vom
 * Markt entkoppeln; eine Kündigung wegen Ersatzneubau trifft die Haushalte
 * trotzdem, weil die Ersatzwohnung innerhalb der Mietzinslimite gefunden
 * werden muss.
 *
 * Grösse 0.2: Setzung, gleich wie bei den Rentnern. CH-008 nennt beide
 * Gruppen ohne Rangfolge und quantifiziert die Belastung nicht.
 */
const VERDRAENGUNG_GERINGVERDIENER = 0.2;

/**
 * Direkter Zinskanal der Eigentümer mit Hypothek (Fix-14, 2026-11-15).
 *
 * Antrieb ist die ÄNDERUNG des hypothekarischen Referenzzinssatzes
 * (`referenzzins_aenderung`, normiert −1…+1), nicht `zinsniveau`. Gründe:
 * - Der Referenzzinssatz ist der volumengewichtete Durchschnittszins aller
 *   ausstehenden Hypotheken in der Schweiz (BWO). Seine Änderung ist damit
 *   direkt die Änderung der durchschnittlichen Zinskosten der Hypothekar-
 *   schuldner, inklusive der Verzögerung durch Festhypotheken.
 * - Ein tiefes, unverändertes Niveau verändert die laufenden Kosten einer
 *   bestehenden Hypothek nicht und ist kein Preistreiber; der Gruppen-Trend
 *   misst die Kostenentwicklung, nicht das Kostenniveau. Gleiche Logik wie im
 *   Mietrecht-Regime (mietrecht-regime.ts, Referenzzins-Regime).
 * - Das Niveau wirkt bereits über die Kanten `ctx:zinsniveau → …` auf
 *   Nachfrage und Investition; ein zweiter Niveau-Term würde es doppelt zählen.
 *
 * Grösse 0.3: Setzung. Eine Stufe (+0.25 Prozentpunkte, normiert +0.5) hebt
 * den Trend um 0.15, also genau um die Anzeigeschwelle «steigend». Bei
 * 1.25 % Referenzzins sind +0.25 Punkte rund ein Fünftel mehr Zinskosten.
 * Keine Quelle im Repo quantifiziert die Weitergabe auf die Wohnkosten.
 */
const ZINSKANAL_EIGENTUEMER = 0.3;

/** Normierung −2…+2 → −1…+1; fehlend = unverändert (wie normContext in mietrecht-regime.ts). */
function zinsAenderung(context: GroupContext): number {
  const v = context.referenzzins_aenderung;
  return typeof v === 'number' ? v / 2 : 0;
}

function basePriceTrend(state: MarketState, context: GroupContext, group: GroupId): { trend: number } {
  // Angebot fördert Preise (negatives angebotspotenzial = mehr Angebot = sinkt)
  const supplyEffect = -state.angebotspotenzial;
  // Nachfrage erhöht Preise
  const demandEffect = state.nachfragedruck;

  const base = supplyEffect + demandEffect;

  // Mietschutz dämpft Preisanstieg für Mieter.
  // Faktor 0.4: Setzung, nicht kalibriert. Sotomo 2025 (S. 27) zeigt für die
  // Agglomeration Zürich Bestandsmieten rund 9 % unter der Miete nach
  // Mieterwechsel (245 gegen 268 CHF/m²·a); Genf rund 33 % (DIW DP 2143, CH-005).
  // Einen Vergleich geschützter mit ungeschützten Mietern liefert keine Quelle
  // im Repo.
  const protectionEffect = state.mietpreis_schutzlevel * 0.4;

  // Gruppe-spezifische Basis-Anpassung (siehe JSDoc oben)
  let groupBase = base;

  if (group === 'geringverdiener') {
    // Geringverdiener sind stärker vom Markt entkoppelt (Sozialhilfe, Ergänzungsleistungen),
    // aber von Verdrängung betroffen (CH-008, VERDRAENGUNG_GERINGVERDIENER)
    groupBase = base * 0.5 + state.verdraengungsrisiko * VERDRAENGUNG_GERINGVERDIENER - protectionEffect * 1.0;
  } else if (group === 'normalverdiener_bestand') {
    // Bestandsmieter: Starke Dämpfung durch Regulierung, reagiert träge auf Markt
    groupBase = base * 0.4 - protectionEffect * 1.2;
  } else if (group === 'normalverdiener_angebot') {
    // Neumieter: Volle Marktdynamik, kaum Schutz durch Bestandshürden
    // Hoher Mietschutz für den Bestand kann das Angebot für Neumieter sogar verknappen (Spillover)
    // Gemeinnützige Konkurrenz (Fix-11, 2026-11-15): AT-002 (WIFO) findet eine
    // preisdämpfende Wirkung des gemeinnützigen Wohnbaus auch auf den privaten
    // Mietmarkt («Public Option»; Wien: Gemeindewohnung ø 5.10 €/m² gegenüber
    // deutlich höheren Marktmieten). Diese Wirkung lief bis 2026-11 als
    // Nachfragedämpfung über nachfragedruck; jene Kanten sind gestrichen
    // (Fix-12). Faktor 0.25 ist eine Setzung: halb so stark wie der direkte
    // Schutz der Genossenschafter (0.5), weil Neumieter nur indirekt über die
    // Konkurrenz profitieren. AT-002 quantifiziert den Spillover nicht.
    groupBase = base * 1.2 + protectionEffect * 0.2 - state.gemeinnuetzig_kraft * 0.25;
  } else if (group === 'glueckspilze') {
    // Glückspilze sind fast vollständig vom Markt entkoppelt
    // Ihre "Preise" (Kostenlimite) steigen nur minimal mit dem Markt
    groupBase = base * 0.1;
  } else if (group === 'normalverdiener_eigentuemer') {
    // Eigentümer profitieren von steigenden Preisen (Vermögensaufbau)
    // aber zahlen auch mehr bei Neubau/Renovation.
    // Hypothekarzins direkt über die Änderung des Referenzzinssatzes (ZINSKANAL_EIGENTUEMER)
    groupBase = base * 0.5 + (-state.angebotspotenzial) * 0.3 + zinsAenderung(context) * ZINSKANAL_EIGENTUEMER;
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
    //     hohem verdraengungsrisiko steigt ihre Belastung. Faktor 0.2: Setzung.
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
 * Berechnet die Preistrends für alle 9 Bevölkerungsgruppen.
 *
 * @param state   Markt-Zustand (E1) einer Phase aus computePhasesCached()
 * @param context Stadt-Kontext (oder Teil davon, GroupContext). Pflicht, damit
 *                kein Aufrufer den Zinskanal stillschweigend weglässt.
 * @param drivers Treiber je Gruppe für diese Phase (computeGroupDrivers);
 *                ohne Angabe bleibt die Treiberliste leer.
 */
export function computeGroupTrends(
  state: MarketState,
  context: GroupContext,
  drivers?: Record<GroupId, GroupDriver[]>,
): GroupPriceTrend[] {
  return GROUPS.map(group => {
    const { trend } = basePriceTrend(state, context, group.id);
    const groupDrivers = drivers?.[group.id] ?? [];
    return {
      group,
      value: trend,
      drivers: groupDrivers,
      tooltip: makeTooltip(trend, groupDrivers),
    };
  });
}
