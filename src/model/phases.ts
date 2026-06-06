// ============================================================
// phases.ts — Phase type definitions
// ============================================================

import type { MarketState, DerivedIndicators } from '../types';

export type Phase = 1 | 2 | 3;
export type PhaseName = 'kurzfristig' | 'mittelfristig' | 'langfristig';

export const PHASES: readonly Phase[] = [1, 2, 3] as const;
export const PHASE_NAMES: readonly PhaseName[] = ['kurzfristig', 'mittelfristig', 'langfristig'];
export const PHASE_YEAR_LABELS: readonly string[] = ['0–2 Jahre', '2–5 Jahre', '5–10 Jahre'];

export interface PhaseResult {
  phase: Phase;
  name: PhaseName;
  yearsLabel: string;
  marketState: MarketState;
  derived: DerivedIndicators;
}
