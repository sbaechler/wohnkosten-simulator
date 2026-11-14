/**
 * Gemeinsame Test-Fixtures für MarketState.
 *
 * Neutrale Werte der Mietrecht-Regime-Felder (siehe src/model/mietrecht-regime.ts):
 * 0 = Status quo — keine Vergleichsmiete aktiv (CH-012, provisorisch),
 * kein zusätzlicher Erhöhungsspielraum, Bestands-/Anfangsmiete und
 * Verweildauer unverändert gegenüber der Baseline.
 */

import type { MarketState } from '../../types';

export const REGIME_NEUTRAL: Pick<
  MarketState,
  'vergleichsmiete_aktiv' | 'erhoehungsspielraum' | 'bestandsmiete' | 'anfangsmiete' | 'verweildauer'
> = {
  vergleichsmiete_aktiv: 0,
  erhoehungsspielraum: 0,
  bestandsmiete: 0,
  anfangsmiete: 0,
  verweildauer: 0,
};
