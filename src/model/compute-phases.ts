// ============================================================
// compute-phases.ts — Phase-based pipeline computation
// ============================================================

import type { CityContext, CityParams40, ParamsDiff40, MarketState } from '../types';
import type { Phase, PhaseResult } from './phases';
import { PHASE_NAMES, PHASE_YEAR_LABELS, PHASES } from './phases';
import { PHASE_WEIGHTED_EDGES } from './phase-weights';
import { computeDerivedIndicators } from './derived';
import { clamp } from './utils';

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Normalize a context value from –2…+2 to –1…+1 */
function normalizeContext(v: -2 | -1 | 0 | 1 | 2): number {
  return v / 2;
}

/** Normalize a param diff from –2…+2 to –1…+1 */
function normalizeDiff(diff: number): number {
  return diff / 2;
}


// ── E1 Node IDs ───────────────────────────────────────────────────────────────

export const E1_NODES = [
  'angebotspotenzial',
  'nachfragedruck',
  'mietpreis_schutzlevel',
  'verdraengungsrisiko',
  'spekulationshemmung',
  'marktfriktion',
  'gemeinnuetzig_kraft',
  'eigentumsquoten_trend',
  'aufwertungsdruck',
  'investitionsattraktivitaet',
  'angebotspotenzial_regulation',
] as const;

/**
 * Eingefrorene Normalisierungskonstanten pro E1-Node und Phase.
 *
 * Entspricht Σ|weights[phase]| aller eingehenden Kanten zum Kalibrierungs-
 * stand 2026-07. Früher wurde diese Summe dynamisch berechnet — dann hätte
 * jede NEUE Kante alle bestehenden Effekte auf denselben Node stillschweigend
 * abgeschwächt (Re-Skalierung durch grösseren Nenner). Mit den eingefrorenen
 * Konstanten addiert eine neue Kante ihren Effekt, statt die anderen zu
 * verwässern.
 *
 * NUR zusammen mit einer Re-Kalibrierung ändern (scripts/calibrate.ts
 * importiert diese Tabelle). Werte neu erzeugen:
 *   Σ|weights[p]| über alle Kanten mit to === node, p = 0..2.
 */
export const E1_NORMALIZATION: Record<(typeof E1_NODES)[number], readonly [number, number, number]> = {
  angebotspotenzial: [7.70, 12.00, 12.40],
  nachfragedruck: [8.40, 9.60, 9.20],
  mietpreis_schutzlevel: [3.80, 3.30, 3.00],
  verdraengungsrisiko: [7.30, 7.60, 6.60],
  spekulationshemmung: [7.20, 7.40, 6.90],
  marktfriktion: [4.60, 5.00, 5.00],
  gemeinnuetzig_kraft: [4.50, 5.30, 5.20],
  eigentumsquoten_trend: [5.30, 5.40, 5.20],
  aufwertungsdruck: [5.20, 5.90, 6.20],
  investitionsattraktivitaet: [8.40, 8.90, 8.50],
  angebotspotenzial_regulation: [4.40, 5.10, 4.60],
};

// ── getE0Delta ────────────────────────────────────────────────────────────────

export function getE0Delta(
  nodeId: string,
  diff: ParamsDiff40,
  context: CityContext,
): number {
  if (nodeId.startsWith('ctx:')) {
    const ctxKey = nodeId.slice(4) as Exclude<keyof CityContext, 'ownershipBaseline'>;
    const value = context[ctxKey];
    if (typeof value !== 'number') return 0;
    return normalizeContext(value as -2 | -1 | 0 | 1 | 2);
  }
  const paramKey = nodeId as keyof CityParams40;
  const diffEntry = diff[paramKey];
  if (!diffEntry) return 0;
  return normalizeDiff((diffEntry.to as number) - (diffEntry.from as number));
}

// ── computeE1WithPhaseAndCarry ────────────────────────────────────────────────

/**
 * Carry-over-Faktor: wie stark der Wert einer Phase auf die nächste Phase
 * übertragen wird. 0.8 = 80% des Vorwerts bleibt erhalten, 20% werden durch
 * den neuen gewichteten Input ersetzt.
 *
 * Wird von `scripts/calibrate.ts` importiert, damit Kalibrierung und
 * Laufzeit-Engine identisch rechnen.
 *
 * Höher = mehr Trägheit (Modell reagiert langsamer auf Policy-Wechsel).
 * Niedriger = mehr unmittelbare Reaktion pro Phase.
 */
export const PERSISTENCE = 0.8;

/**
 * Per-Phase Basis-Multiplikator: P1=0.4, P2=0.7, P3=1.0
 *
 * Der Wohnungsmarkt hat massive strukturelle Trägheit:
 * - P1 (0-2 Jahre): Verträge, Bewilligungen, Kapital allokiert — Reaktion minimal
 * - P2 (2-5 Jahre): Projekte werden angepasst, neue Investitionen fliessen
 * - P3 (5-10 Jahre): Langfristiges Gleichgewicht — alle Effekte voll wirksam
 *
 * Dieser Faktor skaliert ALLE Kantengewichte über alle Phasen hinweg.
 *
 * Kalibrierungs-Historie: Die Edge-Gewichte wurden ursprünglich mit einem
 * Forward-Pass OHNE diesen Multiplikator (und ohne marketModulator) gefittet.
 * `scripts/calibrate.ts` importiert inzwischen diese Engine 1:1; ein Dry-Run
 * mit der vereinheitlichten Engine erfüllt weiterhin alle Constraints
 * (0/446 Verletzungen, Stand 2026-07).
 * NICHT willkürlich ändern — würde alle Edge-Gewichte re-skalieren.
 */
export const PHASE_BASE_MULTIPLIER: readonly [number, number, number] = [0.4, 0.7, 1.0];

/**
 * Marktverengungs-Multiplikator: -2→0.4× (entspannt), 0→1.0× (normal), +2→1.6× (extrem eng)
 * Ein enger Markt reagiert stärker auf Policies weil wenig Ausgleich vorhanden ist.
 *
 * Kalibrierung: 0.3 entspricht einer ±30% Reaktion bei extremem Marktengpass.
 * Forschungsbasis: Sotomo ZH-Wohnraumstudie 2025 + CH-007 (Zonenreserve-Wirkung
 * ist in angespannten Märkten ~3× stärker als in entspannten).
 */
export function marketModulator(marktenge: number): number {
  return 1.0 + marktenge * 0.3;
}

export function computeE1WithPhaseAndCarry(
  context: CityContext,
  diff: ParamsDiff40,
  phase: Phase,
  carryE1: MarketState | null,
): MarketState {
  const phaseIndex = phase - 1; // 0, 1, 2
  const marketMult = marketModulator(context.marktenge);

  const newState = {} as MarketState;

  for (const nodeId of E1_NODES) {
    const prevValue = carryE1 ? carryE1[nodeId] : 0;

    const incomingEdges = PHASE_WEIGHTED_EDGES.filter(e => e.to === nodeId);
    if (incomingEdges.length === 0) {
      newState[nodeId] = clamp(prevValue * PERSISTENCE);
      continue;
    }

    let numerator = 0;

    for (const edge of incomingEdges) {
      const delta = getE0Delta(edge.from, diff, context);
      const weight = edge.weights[phaseIndex];
      numerator += edge.sign * weight * delta;
    }

    const denominator = E1_NORMALIZATION[nodeId][phaseIndex];
    const weightedSum = denominator === 0 ? 0 : numerator / denominator;
    newState[nodeId] = clamp(prevValue * PERSISTENCE + weightedSum * PHASE_BASE_MULTIPLIER[phaseIndex] * marketMult);
  }

  return newState;
}

// ── computePhasePipeline ───────────────────────────────────────────────────────

export function* computePhasePipeline(
  context: CityContext,
  diff: ParamsDiff40,
): Generator<PhaseResult, PhaseResult[], void> {
  let carryE1: MarketState | null = null;

  for (const phase of PHASES) {
    const e1 = computeE1WithPhaseAndCarry(context, diff, phase, carryE1);
    const e2 = computeDerivedIndicators(e1);
    carryE1 = e1;

    const result: PhaseResult = {
      phase,
      name: PHASE_NAMES[phase - 1],
      yearsLabel: PHASE_YEAR_LABELS[phase - 1],
      marketState: e1,
      derived: e2,
    };

    yield result;
  }

  return [];
}

// ── Caching ───────────────────────────────────────────────────────────────────

const _cache = new Map<string, PhaseResult[]>();

/**
 * Obergrenze für den Ergebnis-Cache. Jeder Slider-Schritt erzeugt einen
 * Eintrag; ohne Deckel wächst die Map über eine lange Session unbegrenzt.
 * Bei Überschreitung wird der älteste Eintrag entfernt (Map iteriert in
 * Einfüge-Reihenfolge → FIFO).
 */
const CACHE_MAX_ENTRIES = 500;

function _cacheKey(context: CityContext, diff: ParamsDiff40): string {
  return JSON.stringify({ context, diff });
}

export function computePhasesCached(
  context: CityContext,
  diff: ParamsDiff40,
): PhaseResult[] {
  const key = _cacheKey(context, diff);
  const cached = _cache.get(key);
  if (cached) return cached;

  const results = [...computePhasePipeline(context, diff)];
  if (_cache.size >= CACHE_MAX_ENTRIES) {
    _cache.delete(_cache.keys().next().value!);
  }
  _cache.set(key, results);
  return results;
}

export function invalidatePhasesCache(): void {
  _cache.clear();
}
