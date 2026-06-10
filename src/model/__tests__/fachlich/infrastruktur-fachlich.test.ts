/**
 * infrastruktur-fachlich.test.ts — Fachliche Tests (Research-basiert)
 *
 * Validierung der Modell-Gewichte gegen empirische Evidenz aus der Forschung.
 *
 * Forschung: docs/recherche/UK/UK-001-crossrail-lvc-2025.md
 *            docs/recherche/GLOBAL/GLOBAL-007-crossrail-grand-paris-lvc-2025.md
 *            docs/recherche/GLOBAL/GLOBAL-020-tax-increment-financing-1998.md
 *
 * Wichtige empirische Befunde:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Crossrail (London): Infra_oepnv ↑ → aufwertungsdruck ↑ (signifikanter
 *    Bodenwertzuwachs für umliegende Grundstücke nach Eisenbahnerschliessung)
 *
 * 2. Tax Increment Financing (TIF): Aufwertungszone generiert fiskalische
 *    Rückflüsse, die infrastruktur refinanzieren können
 *
 * Run: npx vitest run src/model/__tests__/fachlich/infrastruktur-fachlich.test.ts
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline, invalidatePhasesCache } from '../../compute-phases';
import type { CityContext, CityParams40, ParamsDiff40 } from '../../../types';

// Zürich-like baseline
const ZUERICH_V2: CityParams40 = {
  raumplanung_zonenreserve: 2, raumplanung_verdichtung: 2, raumplanung_ausnuetzungsziffer: 2,
  boden_vorkaufsrecht: 1, boden_bauverpflichtung: 1, boden_mehrwertabgabe: 1, boden_bodeneigentumssteuer: 1,
  bau_energievorgaben: 1, bau_sanierungspflicht: 1,
  bau_einspracherecht_dritte: 2, bau_einspracherecht_suspensiv: 2,
  bau_bewilligungsverfahren: 2, bau_normenharmonisierung: 2,
  gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_foerderfonds: 2, gemeinnuetzig_baurecht: 2,
  gemeinnuetzig_belegungsvorschriften: 1, gemeinnuetzig_sozialmischung: 1,
  mietrecht_kostenmiete: 1, mietrecht_anfangsmiete: 1, mietrecht_mietzinstransparenz: 1,
  mietrecht_kuendigungsschutz: 1, mietrecht_mietzinsindex: 1, mietrecht_untervermietung: 1,
  steuer_grundstueckgewinn: 2, steuer_eigenmietwert: 2, steuer_leerstandsabgabe: 1,
  steuer_handaenderung: 2, steuer_kapitalgewinnprivatpersonen: 1,
  kapital_auslaendische_investoren: 1, kapital_institutionelle_regulierung: 1, kapital_hypothekarregulierung: 1,
  nutzung_kurzzeitvermietung: 1, nutzung_umnutzungsverbot: 1, nutzung_abbruchverbot: 1, nutzung_zweitwohnungen: 1,
  infra_oepnv: 2, infra_schule_kita: 2, infra_oeffentlicher_raum: 2, infra_wirtschaftsansiedlung: 2,
    bau_ersatzneubau_effizienz: 1,
};

const NEUTRAL_CONTEXT: CityContext = {
  ownershipBaseline: {
    privat: 0.39,
    institutionell: 0.30,
    genossenschaft: 0.175,
    oeffentlich: 0.066
  },
  zinsniveau: 0,
  zuwanderungsdruck: 0,
  wirtschaftskraft: 0,
  bevoelkerungstrend: 0,
  marktenge: 0,  mietbelastungs_grenze: 1,
};

const ZUERICH_CONTEXT: CityContext = {
  ownershipBaseline: {
    privat: 0.39,
    institutionell: 0.30,
    genossenschaft: 0.175,
    oeffentlich: 0.066
  },
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 2,
  marktenge: 2,  mietbelastungs_grenze: 1,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function phases(_params: CityParams40, context: CityContext, diff: ParamsDiff40) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, diff)];
}

// ── Test Cases ────────────────────────────────────────────────────────────────

describe('Infrastruktur: Crossrail London (UK-001) — OEPNV ↑ → Aufwertungsdruck ↑', () => {
  /**
   * Crossrail (Elizabeth Line, London):
   * Ref: docs/recherche/UK/UK-001-crossrail-lvc-2025.md
   * Ref: docs/recherche/GLOBAL/GLOBAL-007-crossrail-grand-paris-lvc-2025.md
   *
   * - Signifikanter Wertzuwachs für umliegende Grundstücke nach Eröffnung
   * - CIF (Community Infrastructure Levy) und s.102 BPLAN: dokumentierter Anstieg
   *   der Bodenwerte im Einzugsgebiet
   * - LVC für Crossrail umstritten — viele Grundstückseigentümer profitierten
   *   ohne Abgabe
   *
   * Im Modell:
   * - infra_oepnv ↑ → aufwertungsdruck ↑
   * - infra_oepnv ↑ → fiskalische_wirkung ↑ (langfristig durch höhere Steuereinnahmen)
   */
  it('[FACH] OEPNV-Ausbau erhöht aufwertungsdruck (Crossrail-Effekt)', () => {
    const ohneAusbau: CityParams40 = {
      ...ZUERICH_V2,
      infra_oepnv: 0,
    };
    const ohne = phases(ohneAusbau, NEUTRAL_CONTEXT, {});
    const mitOepnvDiff: ParamsDiff40 = {
      infra_oepnv: { from: 0, to: 2 },
    };
    const mitOepnv = phases(ohneAusbau, NEUTRAL_CONTEXT, mitOepnvDiff);

    expect(mitOepnv[0].marketState.aufwertungsdruck)
      .toBeGreaterThan(ohne[0].marketState.aufwertungsdruck);
  });

  it('[FACH] OEPNV-Ausbau erhöht fiskalische_wirkung langfristig (Crossrail-TIF-Mechanismus)', () => {
    /**
     * Ref: docs/recherche/GLOBAL/GLOBAL-020-tax-increment-financing-1998.md
     *
     * Tax Increment Financing (TIF): Aufwertungszone generiert fiskalische
     * Rückflüsse, die infrastruktur refinanzieren können.
     * Im Modell sollte ein OEPNV-Ausbau die fiskalische_wirkung über Zeit erhöhen.
     */
    const ohneAusbau: CityParams40 = {
      ...ZUERICH_V2,
      infra_oepnv: 0,
    };
    const ohne = phases(ohneAusbau, ZUERICH_CONTEXT, {});
    const mitOepnvDiff: ParamsDiff40 = {
      infra_oepnv: { from: 0, to: 2 },
    };
    const mit = phases(ohneAusbau, ZUERICH_CONTEXT, mitOepnvDiff);

    expect(mit[2].derived.fiskalische_wirkung)
      .toBeGreaterThan(ohne[2].derived.fiskalische_wirkung);
  });
});

describe('Infrastruktur: OEPNV + Wirtschaftsansiedlung kombiniert', () => {
  /**
   * Ref: docs/recherche/GLOBAL/GLOBAL-007-crossrail-grand-paris-lvc-2025.md
   *
   * Kombination von OEPNV-Ausbau und Wirtschaftsansiedlung verstärkt den
   * Aufwertungsdruck über den reinen OEPNV-Effekt hinaus.
   * Grand Paris Express zeigt ähnliche Dynamik.
   */
  it('[FACH] Kombinierter OEPNV + Wirtschaftsansiedlung erhöht Aufwertungsdruck stärker als einzeln', () => {
    const base: CityParams40 = {
      ...ZUERICH_V2,
      infra_oepnv: 0,
      infra_wirtschaftsansiedlung: 0,
    };
    const nurOepnv: ParamsDiff40 = {
      infra_oepnv: { from: 0, to: 2 },
    };
    const kombiniert: ParamsDiff40 = {
      infra_oepnv: { from: 0, to: 2 },
      infra_wirtschaftsansiedlung: { from: 0, to: 2 },
    };

    const nurOepnvResult    = phases(base, ZUERICH_CONTEXT, nurOepnv);
    const kombiniertResult = phases(base, ZUERICH_CONTEXT, kombiniert);

    expect(kombiniertResult[1].marketState.aufwertungsdruck)
      .toBeGreaterThan(nurOepnvResult[1].marketState.aufwertungsdruck);
  });
});
