// ============================================================
// derived.ts — E1 → E2 computation
// Berechnet die 4 abgeleiteten Indikatoren aus E1
// ============================================================

import type { MarketState, DerivedIndicators } from '../types';
import { clamp } from './utils';

// ── E2-Berechnung ───────────────────────────────────────────────────────────

/**
 * Berechnet E2 (abgeleitete Indikatoren) aus E1 (Markt-Zustand).
 *
 * Formeln aus dag-berechnungsmodell.md:
 *
 * gentrifizierungsindex =
 *   w1*aufwertungsdruck + w2*(1–mietpreis_schutzlevel)
 *   + w3*verdraengungsrisiko + w4*(1–gemeinnuetzig_kraft)
 *
 * neubau_hemmnisindex = -1 * angebotspotenzial
 *
 * verdraengungsrisiko_index = verdraengungsrisiko (alias)
 *
 * fiskalische_wirkung =
 *   w1*spekulationshemmung + w2*(1-markfriktion) + w3*gemeinnuetzig_kraft
 *   (Gewichte 1.5/1.0/1.0 gemäss Spezifikation)
 */
export function computeDerivedIndicators(
  state: MarketState,
): DerivedIndicators {
  // ── gentrifizierungsindex ─────────────────────────────────────────────────
  // Gewichte: aufwertungsdruck=1.5, (1-mietpreis_schutzlevel)=1.5,
  //           verdraengungsrisiko=1.5, (1-gemeinnuetzig_kraft)=1.0
  const gi_numerator =
    1.5 * state.aufwertungsdruck +
    1.5 * (1 - state.mietpreis_schutzlevel) +
    1.5 * state.verdraengungsrisiko +
    1.0 * (1 - state.gemeinnuetzig_kraft);
  const gi_denominator = 1.5 + 1.5 + 1.5 + 1.0;
  const gentrifizierungsindex = clamp(gi_numerator / gi_denominator);

  // ── neubau_hemmnisindex ───────────────────────────────────────────────────
  // Invertiert: hohes Angebotspotenzial → tiefer Hemmnisindex
  const neubau_hemmnisindex = clamp(-state.angebotspotenzial);

  // ── verdraengungsrisiko_index ──────────────────────────────────────────────
  // Direkter Alias aus E1
  const verdraengungsrisiko_index = clamp(state.verdraengungsrisiko);

  // ── fiskalische_wirkung ───────────────────────────────────────────────────
  // spekulationshemmung=1.5, (1-markfriktion)=1.0, gemeinnuetzig_kraft=1.0,
  // aufwertungsdruck=0.8 (UK-001 Crossrail / GLOBAL-020 TIF: Aufwertung → höhere Steuereinnahmen)
  const fw_numerator =
    1.5 * state.spekulationshemmung +
    1.0 * (1 - state.markfriktion) +
    1.0 * state.gemeinnuetzig_kraft +
    0.8 * state.aufwertungsdruck;
  const fw_denominator = 1.5 + 1.0 + 1.0 + 0.8;
  const fiskalische_wirkung = clamp(fw_numerator / fw_denominator);

  return {
    gentrifizierungsindex,
    neubau_hemmnisindex,
    verdraengungsrisiko_index,
    fiskalische_wirkung,
  };
}
