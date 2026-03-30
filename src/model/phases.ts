// ============================================================
// phases.ts — Phase type definitions
// ============================================================

import type { MarketState, DerivedIndicators } from '../types';

export type Phase = 1 | 2 | 3;
export type PhaseName = 'kurzfristig' | 'mittelfristig' | 'langfristig';

export interface PhaseResult {
  phase: Phase;
  name: PhaseName;
  yearsLabel: string;
  marketState: MarketState;
  derived: DerivedIndicators;
  dominantParams: string[];
}
