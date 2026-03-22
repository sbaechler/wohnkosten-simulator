// ============================================================
// derived.ts — E1 → E2 computation
// Berechnet die 5 abgeleiteten Indikatoren aus E1 + zeit_bis_wirkung aus E0
// ============================================================

import type { MarketState, DerivedIndicators, ParamsDiff40, Zeitprofil, ZeitKlasse } from '../types';
import { TIME_CLASS_MAP } from './graph';

// ── zeit_bis_wirkung ─────────────────────────────────────────────────────────

/**
 * Aggregiert die Zeitklassen der geänderten Parameter (E0 → zeit_bis_wirkung).
 * Kein Edge-Eintrag — berechnet sich direkt aus diff + TIME_CLASS_MAP.
 */
export function computeZeitprofil(diff: ParamsDiff40): Zeitprofil {
  const kurzfristig: string[] = [];
  const mittelfristig: string[] = [];
  const langfristig: string[] = [];

  for (const key of Object.keys(diff) as (keyof ParamsDiff40)[]) {
    const timeClass = TIME_CLASS_MAP[key as string];
    if (!timeClass) continue;

    if (timeClass === 'short') {
      kurzfristig.push(key as string);
    } else if (timeClass === 'medium') {
      mittelfristig.push(key as string);
    } else {
      langfristig.push(key as string);
    }
  }

  // Dominante Klasse: die mit den meisten geänderten Parametern
  const counts: Record<ZeitKlasse, number> = {
    kurzfristig: kurzfristig.length,
    mittelfristig: mittelfristig.length,
    langfristig: langfristig.length,
  };
  const dominanteKlasse = (Object.entries(counts) as [ZeitKlasse, number][])
    .sort(([, a], [, b]) => b - a)[0][0];

  return { kurzfristig, mittelfristig, langfristig, dominanteKlasse };
}

// ── Hilfsfunktion: clamp ──────────────────────────────────────────────────────

function clamp(v: number, lo = -1, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

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
  _context: unknown,
  diff: ParamsDiff40,
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
  // spekulationshemmung=1.5, (1-markfriktion)=1.0, gemeinnuetzig_kraft=1.0
  const fw_numerator =
    1.5 * state.spekulationshemmung +
    1.0 * (1 - state.markfriktion) +
    1.0 * state.gemeinnuetzig_kraft;
  const fw_denominator = 1.5 + 1.0 + 1.0;
  const fiskalische_wirkung = clamp(fw_numerator / fw_denominator);

  // ── zeit_bis_wirkung ──────────────────────────────────────────────────────
  const zeit_bis_wirkung = computeZeitprofil(diff);

  return {
    gentrifizierungsindex,
    neubau_hemmnisindex,
    verdraengungsrisiko_index,
    fiskalische_wirkung,
    zeit_bis_wirkung,
  };
}
