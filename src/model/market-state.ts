// ============================================================
// market-state.ts — E0 → E1 computation
// Berechnet die 10 Markt-Zustandsvariablen aus den 40 Parametern
// ============================================================

import type { CityParams40, CityContext, ParamsDiff40, MarketState, ParamValue } from '../types';
import { edgesForTarget } from './graph';

/** Kontextfaktor auf –1…+1 normalisieren */
function normalizeContext(v: ParamValue | -2 | -1 | 0 | 1 | 2): number {
  return (v as number) / 2;
}

/**
 * Param-Diff auf –1…+1 normalisieren.
 * diff = modified – baseline ∈ {–2, –1, 0, +1, +2}
 * normalized = diff / 2 ∈ {–1, –0.5, 0, +0.5, +1}
 */
function normalizeDiff(diff: number): number {
  return diff / 2;
}

/**
 * Einzelne E1-Variable berechnen: gewichtete Summe aller eingehenden Kanten.
 * score = Σ(sign × weight × normalized_input) / Σ|weight|
 */
function aggregateNode(
  target: keyof MarketState,
  paramDiff: (key: string) => number,
  ctxValue: (key: string) => number,
): number {
  const edges = edgesForTarget(target);
  if (edges.length === 0) return 0;

  let numerator = 0;
  let denominator = 0;

  for (const edge of edges) {
    let normalized: number;
    if (edge.from.startsWith('ctx:')) {
      const ctxKey = edge.from.slice(4) as keyof CityContext;
      normalized = ctxValue(ctxKey);
    } else {
      const paramKey = edge.from as keyof CityParams40;
      normalized = normalizeDiff(paramDiff(paramKey));
    }
    numerator += edge.sign * edge.weight * normalized;
    denominator += Math.abs(edge.weight);
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

// ── Hauptfunktion ─────────────────────────────────────────────────────────────

/**
 * Berechnet den Markt-Zustand (E1) aus Kontext, Baseline, Modified und Diff.
 *
 * Alle E1-Variablen liegen in –1…+1:
 *   –1 = maximal angebotsfördernd / preissenkend / schützend
 *    0 = kein Effekt
 *   +1 = maximal angebotshemmend / preistreibend / verdrängend
 */
export function computeMarketState(
  context: CityContext,
  baseline: CityParams40,
  modified: CityParams40,
  _diff: ParamsDiff40, // wird hier nicht direkt benötigt, aber Teil der Signatur
): MarketState {
  // Diff-Callback für Parameter — key ist ein NodeId-String (nicht nur CityParams40-Key)
  const paramDiff = (key: string): number => {
    if (key.startsWith('ctx:')) return 0; // ctx-Keys werden separat behandelt
    return ((modified[key as keyof CityParams40] as number) - (baseline[key as keyof CityParams40] as number));
  };

  // Context-Callback
  const ctxValue = (key: string): number => {
    const ctxKey = key.replace('ctx:', '') as keyof CityContext;
    return normalizeContext(context[ctxKey]);
  };

  return {
    angebotspotenzial: aggregateNode('angebotspotenzial', paramDiff, ctxValue),
    nachfragedruck:    aggregateNode('nachfragedruck',    paramDiff, ctxValue),
    mietpreis_schutzlevel: aggregateNode('mietpreis_schutzlevel', paramDiff, ctxValue),
    verdraengungsrisiko:    aggregateNode('verdraengungsrisiko',   paramDiff, ctxValue),
    spekulationshemmung:    aggregateNode('spekulationshemmung',   paramDiff, ctxValue),
    markfriktion:           aggregateNode('markfriktion',          paramDiff, ctxValue),
    gemeinnuetzig_kraft:    aggregateNode('gemeinnuetzig_kraft',   paramDiff, ctxValue),
    eigentumsquoten_trend: aggregateNode('eigentumsquoten_trend',  paramDiff, ctxValue),
    aufwertungsdruck:       aggregateNode('aufwertungsdruck',      paramDiff, ctxValue),
    investitionsattraktivitaet: aggregateNode('investitionsattraktivitaet', paramDiff, ctxValue),
  };
}

/**
 * Clampt E1-Werte auf den gültigen Bereich –1…+1 (Sicherheitsnetz nach Fließkomma)
 */
export function clampE1(state: MarketState): MarketState {
  const c = (v: number) => Math.max(-1, Math.min(1, v));
  return {
    angebotspotenzial:         c(state.angebotspotenzial),
    nachfragedruck:             c(state.nachfragedruck),
    mietpreis_schutzlevel:     c(state.mietpreis_schutzlevel),
    verdraengungsrisiko:        c(state.verdraengungsrisiko),
    spekulationshemmung:        c(state.spekulationshemmung),
    markfriktion:               c(state.markfriktion),
    gemeinnuetzig_kraft:        c(state.gemeinnuetzig_kraft),
    eigentumsquoten_trend:     c(state.eigentumsquoten_trend),
    aufwertungsdruck:           c(state.aufwertungsdruck),
    investitionsattraktivitaet: c(state.investitionsattraktivitaet),
  };
}
