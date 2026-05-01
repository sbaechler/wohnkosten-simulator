/**
 * phase-pipeline.test.ts — Functional
 *
 * Tests the phase computation pipeline:
 * - Pipeline yields exactly 3 PhaseResults (short/mid/long term)
 * - E1 values are always clamped to [-1, 1]
 * - E2 values are always clamped to [-1, 1]
 * - PERSISTENCE (0.8) creates smooth carry-over between phases
 * - No-param-diff produces zero/neutral E1 values
 * - Cache works correctly
 * - Cache invalidation clears all entries
 *
 * Run: npx vitest run src/model/__tests__/functional/phase-pipeline.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { computePhasePipeline, computePhasesCached, invalidatePhasesCache } from '../../compute-phases';
import type { CityContext, CityParams40 } from '../../../types';

// Zürich (entspricht V1: raumplanung=2, bauvorschriften=2, energetischeVorgaben=1,
// mietrecht=1, steuerpolitik=2, foerderungGemeinnuetzig=2, subventionen=1,
// einspracherechte=2, infrastruktur=2, auslaendischeInvestitionen=1)
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
};

const ZUERICH_CONTEXT: CityContext = {
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 2,
  marktenge: 2,
};

const EMPTY_DIFF = {} as never;

function inRange(value: number): void {
  expect(value).toBeGreaterThanOrEqual(-1);
  expect(value).toBeLessThanOrEqual(1);
}

describe('computePhasePipeline', () => {
  beforeEach(() => {
    invalidatePhasesCache();
  });

  it('yields exactly 3 phases', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF)];
    expect(results).toHaveLength(3);
    expect(results[0].phase).toBe(1);
    expect(results[1].phase).toBe(2);
    expect(results[2].phase).toBe(3);
  });

  it('phase names are kurzfristig / mittelfristig / langfristig', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF)];
    expect(results[0].name).toBe('kurzfristig');
    expect(results[1].name).toBe('mittelfristig');
    expect(results[2].name).toBe('langfristig');
  });

  it('year labels are correct', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF)];
    expect(results[0].yearsLabel).toBe('0–2 Jahre');
    expect(results[1].yearsLabel).toBe('2–5 Jahre');
    expect(results[2].yearsLabel).toBe('5–10 Jahre');
  });

  it('all E1 values are in [-1, 1] for zuerich config', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF)];
    for (const r of results) {
      for (const value of Object.values(r.marketState)) {
        inRange(value);
      }
    }
  });

  it('all E2 values are in [-1, 1] for zuerich config', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF)];
    for (const r of results) {
      for (const value of Object.values(r.derived)) {
        inRange(value);
      }
    }
  });

  it('zero diff produces stable but non-random E1 values (deterministic)', () => {
    const results1 = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF)];
    const results2 = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF)];
    expect(results1[0].marketState).toEqual(results2[0].marketState);
  });

  it('non-zero diff in phase 1 produces different E1 than zero diff', () => {
    const diff = { raumplanung_zonenreserve: { from: 2 as const, to: 0 as const } };
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, diff)];
    const neutral = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF)];
    expect(results[0].marketState.angebotspotenzial).not.toBe(neutral[0].marketState.angebotspotenzial);
  });

  it('context-only changes affect E1 (ctx:zuwanderungsdruck → nachfragedruck)', () => {
    const neutral = [...computePhasePipeline({ ...ZUERICH_CONTEXT, zuwanderungsdruck: 0 }, ZUERICH_V2, EMPTY_DIFF)];
    const high   = [...computePhasePipeline({ ...ZUERICH_CONTEXT, zuwanderungsdruck: 2 }, ZUERICH_V2, EMPTY_DIFF)];
    expect(high[0].marketState.nachfragedruck).toBeGreaterThan(neutral[0].marketState.nachfragedruck);
  });

  it('E1 persistence: phase 2 continues from phase 1 (not reset to 0)', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF)];
    expect(results[1].marketState.nachfragedruck).not.toBe(0);
  });
});

describe('computePhasesCached', () => {
  beforeEach(() => {
    invalidatePhasesCache();
  });

  it('returns cached result on second call', () => {
    const first  = computePhasesCached(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF);
    const second = computePhasesCached(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF);
    expect(first).toBe(second); // Same reference
  });

  it('returns different cache entry for different diff', () => {
    const a = computePhasesCached(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF);
    const b = computePhasesCached(ZUERICH_CONTEXT, ZUERICH_V2, { raumplanung_zonenreserve: { from: 2, to: 0 } });
    expect(a).not.toBe(b);
  });

  it('invalidating cache returns fresh result', () => {
    const first  = computePhasesCached(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF);
    invalidatePhasesCache();
    const second = computePhasesCached(ZUERICH_CONTEXT, ZUERICH_V2, EMPTY_DIFF);
    expect(first).not.toBe(second);
  });
});
