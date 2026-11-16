// ============================================================
// compute-phases.ts — Phase-based pipeline computation
// ============================================================

import type { CityContext, CityParams40, ParamsDiff40, MarketState } from '../types';
import type { Phase, PhaseResult } from './phases';
import { PHASE_NAMES, PHASE_YEAR_LABELS, PHASES } from './phases';
import { PHASE_WEIGHTED_EDGES, type PhaseEdge } from './phase-weights';
import { computeDerivedIndicators } from './derived';
import { applyMietrechtRegime, type RegimeCarry } from './mietrecht-regime';
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
 * Gemeinsamer Nenner aller E1-Knoten (Verbesserungsplan Fix-9, 2026-11-15).
 *
 * Zweck: ein Gewicht bedeutet an jeder Kante dasselbe, nämlich die
 * Effektgrösse eines vollen Schritts (Δ = 1) auf der Skala −1…+1. Die Zahl
 * der Kanten eines Knotens verdünnt nichts mehr. Vorher wurde jeder Knoten
 * durch Σ|w| seiner eigenen Kanten geteilt (`angebotspotenzial` 12.4,
 * `mietpreis_schutzlevel` 3.0); ein Mietrechts-Schritt bewegte seinen Knoten
 * dadurch rund fünfmal stärker als ein gleich gewichteter Angebots-Schritt.
 *
 * Herleitung (Setzung mit Rechenweg): der ungünstigste denkbare Kontext soll
 * einen Knoten in P3 gerade an den Rand ±1 bringen, nicht darüber. Dafür
 * stehen alle Kontextfaktoren am Rand und alle in Richtung des Knotens
 * (Δ = 1 je Kontextkante), `marktenge` = +2 (marketModulator 1.6), ohne
 * Politik-Änderung. Mit Nenner 1 ist der P3-Stand eines Knotens
 *     1.6 · (0.64·Σ|w₁| + 0.8·Σ|w₂| + Σ|w₃|)   (Summen über seine ctx-Kanten).
 * Grösster Wert: `nachfragedruck` mit 11.17 (Σ|w| = 3.6 / 3.1 / 2.2), knapp
 * vor `eigentumsquoten_trend` mit 11.12. Aufgerundet auf eine Stelle: 11.2.
 * Reale Städte liegen darunter (Zürich: Nachfragedruck P3 ≈ 0.75), Politik-
 * Effekte bleiben so ausserhalb der Sättigung sichtbar.
 *
 * Gilt für den Stand der Kontextkanten vom 2026-11-15. Ändern sich deren
 * Gewichte, muss der Wert neu hergeleitet werden; ein Test
 * (`phase-pipeline.test.ts`) rechnet die Herleitung nach.
 * `scripts/calibrate.ts` rechnet über dieselbe Engine und damit mit
 * demselben Nenner.
 */
export const E1_NENNER = 11.2;

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

/**
 * Δ einer Kante. Für gewöhnliche Kanten gleich `getE0Delta(edge.from)`.
 *
 * Bedingte Kante (`ausgleichDurch`): gerechnet wird die Änderung des Produkts
 * `from · (1 − ausgleich)`, beide als Stand 0…1 (Stufe / 2). Dafür braucht es
 * die absoluten Stufen beider Parameter; `computeDiff40` trägt sie als
 * Begleiteinträge ins Diff ein (`DIFF_BEGLEITER`, params.ts).
 * Fehlt `from` im Diff, ist sein Stand unbekannt und die Kante wirkt nicht.
 * Fehlt der Ausgleich im Diff, gilt «kein Ausgleich» (Stufe 0, die Baseline
 * aller Städte): die Kante rechnet dann wie eine gewöhnliche.
 */
export function getEdgeDelta(edge: PhaseEdge, diff: ParamsDiff40, context: CityContext): number {
  if (!edge.ausgleichDurch) return getE0Delta(edge.from, diff, context);
  const haupt = diff[edge.from as keyof CityParams40];
  if (!haupt) return 0;
  const ausgleich = diff[edge.ausgleichDurch as keyof CityParams40];
  const a0 = ausgleich ? normalizeDiff(ausgleich.from as number) : 0;
  const a1 = ausgleich ? normalizeDiff(ausgleich.to as number) : 0;
  return normalizeDiff(haupt.to as number) * (1 - a1) - normalizeDiff(haupt.from as number) * (1 - a0);
}

// ── computeE1WithPhaseAndCarry ────────────────────────────────────────────────

/**
 * Übertrag: Anteil des Standes der Vorphase, der in die nächste Phase
 * mitgenommen wird. Der neue Impuls kommt dazu, er ersetzt nichts:
 *
 *     Stand[p] = PERSISTENCE · Stand[p−1] + Impuls[p]
 *
 * 0.8 heisst: ohne neuen Impuls verliert ein Stand 20 % pro Phase. Wie früh
 * ein Effekt kommt, steht im Impulsvektor der Kante (`phase-weights.ts`);
 * wie lange er hält, hier.
 *
 * Annahme (Verbesserungsplan Fix-10, Schritt 7): die Phasen sind 2, 3 und
 * 5 Jahre lang, der Übertrag ist trotzdem pro Phase gleich. Ein an die
 * Phasenlänge gekoppelter Übertrag (z. B. 0.9^Jahre) würde frühe Effekte in
 * P3 stärker abklingen lassen. Bewusst nicht gekoppelt: die Phasen sind
 * Anzeigeabschnitte, die Kantenvektoren sind je Phase gesetzt und
 * kalibriert, und keine Studie der Sammlung gibt eine Abklingrate pro Jahr
 * an. Wird das geändert, sind alle Vektoren neu zu prüfen.
 *
 * Wird von `scripts/calibrate.ts` über die Engine mitbenutzt.
 * `REGIME_PERSISTENCE` in mietrecht-regime.ts muss gleich sein.
 */
export const PERSISTENCE = 0.8;

/**
 * Marktverengungs-Multiplikator: -2→0.4× (entspannt), 0→1.0× (normal), +2→1.6× (extrem eng)
 * Ein enger Markt reagiert stärker auf Policies weil wenig Ausgleich vorhanden ist.
 *
 * `marktenge` kommt hier als Rohwert −2…+2 an (nicht normalisiert). 0.3 pro
 * Stufe ergibt also ±60 % bei extremem Markt, ±30 % bei einer Stufe.
 * Der Faktor skaliert auch den Kontext-Antrieb, nicht nur die Politik-Effekte.
 * 0.3 pro Stufe: Setzung. Richtung nach CH-007 (wo mehr Bauland vorhanden
 * ist, steigen die Kosten bei Nachfrageanstieg weniger stark; Aufzonungen
 * dämpfen dort, wo die Bauzonen bereits stark ausgeschöpft sind); eine
 * Grösse nennt die Quelle nicht. Die Formel ergibt 0.4× bis 1.6×, also
 * Faktor 4 zwischen den Extremen.
 * Prüfung 2026-11-15: keine Notiz in docs/recherche/ stützt eine Grösse.
 * AU-004 (Zonierung wirkt stärker, je enger die Beschränkung bindet) und
 * GLOBAL-025 (Angebotselastizität US-Städte >3 bis <0.5) stützen nur die
 * Richtung, und nur für die Angebotsseite; der Faktor skaliert hier alle
 * Kanten, auch Mietrecht, Nachfrage und Kontext.
 */
export function marketModulator(marktenge: number): number {
  return 1.0 + marktenge * 0.3;
}

/**
 * Stand aller E1-Knoten in einer Phase:
 * `clamp(PERSISTENCE · Vorstand + Σ sign·w·Δ · marketModulator / E1_NENNER)`.
 *
 * @param edges Kanten; Standard sind die Laufzeit-Kanten. `scripts/calibrate.ts`
 *              übergibt Kanten mit veränderten Gewichten.
 */
export function computeE1WithPhaseAndCarry(
  context: CityContext,
  diff: ParamsDiff40,
  phase: Phase,
  carryE1: MarketState | null,
  edges: readonly PhaseEdge[] = PHASE_WEIGHTED_EDGES,
): MarketState {
  const phaseIndex = phase - 1; // 0, 1, 2
  const marketMult = marketModulator(context.marktenge);

  const newState = {} as MarketState;

  for (const nodeId of E1_NODES) {
    const prevValue = carryE1 ? carryE1[nodeId] : 0;

    let impuls = 0;
    for (const edge of edges) {
      if (edge.to !== nodeId) continue;
      const delta = getEdgeDelta(edge, diff, context);
      impuls += edge.sign * edge.weights[phaseIndex] * delta;
    }

    newState[nodeId] = clamp(prevValue * PERSISTENCE + (impuls / E1_NENNER) * marketMult);
  }

  return newState;
}

// ── computePhasePipeline ───────────────────────────────────────────────────────

/**
 * @param edges Kanten; Standard sind die Laufzeit-Kanten. `scripts/calibrate.ts`
 *              rechnet mit derselben Pipeline und eigenen Gewichten.
 */
export function* computePhasePipeline(
  context: CityContext,
  diff: ParamsDiff40,
  edges: readonly PhaseEdge[] = PHASE_WEIGHTED_EDGES,
): Generator<PhaseResult, PhaseResult[], void> {
  let carryE1: MarketState | null = null;
  let regimeCarry: RegimeCarry | null = null;

  for (const phase of PHASES) {
    const linear = computeE1WithPhaseAndCarry(context, diff, phase, carryE1, edges);
    const applied = applyMietrechtRegime(linear, context, diff, regimeCarry);
    const e1 = applied.market;
    regimeCarry = applied.carry;
    const e2 = computeDerivedIndicators(e1);
    // Übertragen wird der lineare Stand, nicht der Stand nach Regime. Der
    // Regime-Abzug auf Investition und Angebot wird in jeder Phase neu auf
    // den linearen Stand gelegt. Mit `carryE1 = e1` wurde er zusätzlich
    // übertragen und wuchs über die Phasen auf das 2.44-Fache.
    carryE1 = linear;

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
