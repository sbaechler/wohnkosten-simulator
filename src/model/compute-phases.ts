// ============================================================
// compute-phases.ts — Phase-based pipeline computation
// ============================================================

import type { CityContext, CityParams40, ParamsDiff40, MarketState } from '../types';
import type { Phase, PhaseResult } from './phases';
import { PHASE_NAMES, PHASE_YEAR_LABELS, PHASES } from './phases';
import { PHASE_WEIGHTED_EDGES } from './phase-weights';
import { computeDerivedIndicators } from './derived';

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Normalize a context value from –2…+2 to –1…+1 */
function normalizeContext(v: -2 | -1 | 0 | 1 | 2): number {
  return v / 2;
}

/** Normalize a param diff from –2…+2 to –1…+1 */
function normalizeDiff(diff: number): number {
  return diff / 2;
}

/** Clamp to –1…+1 */
function clamp(v: number, lo = -1, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

// ── E1 Node IDs ───────────────────────────────────────────────────────────────

const E1_NODES = [
  'angebotspotenzial',
  'nachfragedruck',
  'mietpreis_schutzlevel',
  'verdraengungsrisiko',
  'spekulationshemmung',
  'markfriktion',
  'gemeinnuetzig_kraft',
  'eigentumsquoten_trend',
  'aufwertungsdruck',
  'investitionsattraktivitaet',
  'angebotspotenzial_regulation',
] as const;

// ── getE0Delta ────────────────────────────────────────────────────────────────

function getE0Delta(
  nodeId: string,
  diff: ParamsDiff40,
  context: CityContext,
): number {
  if (nodeId.startsWith('ctx:')) {
    const ctxKey = nodeId.slice(4) as keyof CityContext;
    return normalizeContext(context[ctxKey]);
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
 * Kalibrierung: Gradient-Descent in `scripts/calibrate.ts` (PERSISTENCE dort
 * hartkodiert — bei Änderung hier UND dort synchron halten).
 *
 * Höher = mehr Trägheit (Modell reagiert langsamer auf Policy-Wechsel).
 * Niedriger = mehr unmittelbare Reaktion pro Phase.
 */
const PERSISTENCE = 0.8;

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
 * Kalibrierung: resultiert aus den 60+ Constraints in `scripts/calibrate.ts`.
 * NICHT willkürlich ändern — würde alle 246 Edge-Gewichte re-skaliert bedeuten.
 */
const PHASE_BASE_MULTIPLIER: readonly [number, number, number] = [0.4, 0.7, 1.0];

/**
 * Marktverengungs-Multiplikator: -2→0.4× (entspannt), 0→1.0× (normal), +2→1.6× (extrem eng)
 * Ein enger Markt reagiert stärker auf Policies weil wenig Ausgleich vorhanden ist.
 *
 * Kalibrierung: 0.3 entspricht einer ±30% Reaktion bei extremem Marktengpass.
 * Forschungsbasis: Sotomo ZH-Wohnraumstudie 2025 + CH-007 (Zonenreserve-Wirkung
 * ist in angespannten Märkten ~3× stärker als in entspannten).
 */
function marketModulator(marktenge: number): number {
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
    let denominator = 0;

    for (const edge of incomingEdges) {
      const delta = getE0Delta(edge.from, diff, context);
      const weight = edge.weights[phaseIndex];
      numerator += edge.sign * weight * delta;
      denominator += Math.abs(weight);
    }

    const weightedSum = denominator === 0 ? 0 : numerator / denominator;
    newState[nodeId] = clamp(prevValue * PERSISTENCE + weightedSum * PHASE_BASE_MULTIPLIER[phaseIndex] * marketMult);
  }

  return newState;
}

// ── computePhasePipeline ───────────────────────────────────────────────────────

export function* computePhasePipeline(
  context: CityContext,
  params: CityParams40,
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

function _cacheKey(context: CityContext, params: CityParams40, diff: ParamsDiff40): string {
  return JSON.stringify({ context, params, diff });
}

export function computePhasesCached(
  context: CityContext,
  params: CityParams40,
  diff: ParamsDiff40,
): PhaseResult[] {
  const key = _cacheKey(context, params, diff);
  const cached = _cache.get(key);
  if (cached) return cached;

  const results = [...computePhasePipeline(context, params, diff)];
  _cache.set(key, results);
  return results;
}

export function invalidatePhasesCache(): void {
  _cache.clear();
}
