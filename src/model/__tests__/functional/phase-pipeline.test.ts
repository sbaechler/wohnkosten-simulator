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
import {
  computePhasePipeline, computePhasesCached, invalidatePhasesCache,
  E1_NENNER, E1_NODES, PERSISTENCE, marketModulator,
} from '../../compute-phases';
import { PHASE_WEIGHTED_EDGES, type PhaseEdge } from '../../phase-weights';
import type { CityContext, ParamsDiff40 } from '../../../types';

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
  marktenge: 2,
};

const EMPTY_DIFF = {} as ParamsDiff40;

function inRange(value: number): void {
  expect(value).toBeGreaterThanOrEqual(-1);
  expect(value).toBeLessThanOrEqual(1);
}

describe('computePhasePipeline', () => {
  beforeEach(() => {
    invalidatePhasesCache();
  });

  it('yields exactly 3 phases', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, EMPTY_DIFF)];
    expect(results).toHaveLength(3);
    expect(results[0].phase).toBe(1);
    expect(results[1].phase).toBe(2);
    expect(results[2].phase).toBe(3);
  });

  it('phase names are kurzfristig / mittelfristig / langfristig', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, EMPTY_DIFF)];
    expect(results[0].name).toBe('kurzfristig');
    expect(results[1].name).toBe('mittelfristig');
    expect(results[2].name).toBe('langfristig');
  });

  it('year labels are correct', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, EMPTY_DIFF)];
    expect(results[0].yearsLabel).toBe('0–2 Jahre');
    expect(results[1].yearsLabel).toBe('2–5 Jahre');
    expect(results[2].yearsLabel).toBe('5–10 Jahre');
  });

  it('all E1 values are in [-1, 1] for zuerich config', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, EMPTY_DIFF)];
    for (const r of results) {
      for (const value of Object.values(r.marketState)) {
        inRange(value);
      }
    }
  });

  it('all E2 values are in [-1, 1] for zuerich config', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, EMPTY_DIFF)];
    for (const r of results) {
      for (const value of Object.values(r.derived)) {
        inRange(value);
      }
    }
  });

  it('zero diff produces stable but non-random E1 values (deterministic)', () => {
    const results1 = [...computePhasePipeline(ZUERICH_CONTEXT, EMPTY_DIFF)];
    const results2 = [...computePhasePipeline(ZUERICH_CONTEXT, EMPTY_DIFF)];
    expect(results1[0].marketState).toEqual(results2[0].marketState);
  });

  it('non-zero diff in phase 1 produces different E1 than zero diff', () => {
    const diff = { raumplanung_zonenreserve: { from: 2 as const, to: 0 as const } };
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, diff)];
    const neutral = [...computePhasePipeline(ZUERICH_CONTEXT, EMPTY_DIFF)];
    expect(results[0].marketState.angebotspotenzial).not.toBe(neutral[0].marketState.angebotspotenzial);
  });

  it('context-only changes affect E1 (ctx:zuwanderungsdruck → nachfragedruck)', () => {
    const neutral = [...computePhasePipeline({ ...ZUERICH_CONTEXT, zuwanderungsdruck: 0 }, EMPTY_DIFF)];
    const high   = [...computePhasePipeline({ ...ZUERICH_CONTEXT, zuwanderungsdruck: 2 }, EMPTY_DIFF)];
    expect(high[0].marketState.nachfragedruck).toBeGreaterThan(neutral[0].marketState.nachfragedruck);
  });

  it('E1 persistence: phase 2 continues from phase 1 (not reset to 0)', () => {
    const results = [...computePhasePipeline(ZUERICH_CONTEXT, EMPTY_DIFF)];
    expect(results[1].marketState.nachfragedruck).not.toBe(0);
  });
});

describe('computePhasesCached', () => {
  beforeEach(() => {
    invalidatePhasesCache();
  });

  it('returns cached result on second call', () => {
    const first  = computePhasesCached(ZUERICH_CONTEXT, EMPTY_DIFF);
    const second = computePhasesCached(ZUERICH_CONTEXT, EMPTY_DIFF);
    expect(first).toBe(second); // Same reference
  });

  it('returns different cache entry for different diff', () => {
    const a = computePhasesCached(ZUERICH_CONTEXT, EMPTY_DIFF);
    const b = computePhasesCached(ZUERICH_CONTEXT, { raumplanung_zonenreserve: { from: 2, to: 0 } });
    expect(a).not.toBe(b);
  });

  it('invalidating cache returns fresh result', () => {
    const first  = computePhasesCached(ZUERICH_CONTEXT, EMPTY_DIFF);
    invalidatePhasesCache();
    const second = computePhasesCached(ZUERICH_CONTEXT, EMPTY_DIFF);
    expect(first).not.toBe(second);
  });

  it('different contexts with same params/diff produce different cache entries', () => {
    const zuerich = computePhasesCached(ZUERICH_CONTEXT, EMPTY_DIFF);
    const winterthur = computePhasesCached(
      { ...ZUERICH_CONTEXT, zuwanderungsdruck: 0 },
      EMPTY_DIFF,
    );
    expect(zuerich).not.toEqual(winterthur);
  });
});

// Verbesserungsplan Fix-9/Fix-10 (2026-11-15)
describe('Generator: Stand = PERSISTENCE · Vorstand + Impuls / E1_NENNER', () => {
  const NEUTRAL: CityContext = {
    ownershipBaseline: ZUERICH_CONTEXT.ownershipBaseline,
    zinsniveau: 0, zuwanderungsdruck: 0, wirtschaftskraft: 0,
    bevoelkerungstrend: 0, marktenge: 0,
  };

  it('eine Kante, ein Schritt: Stand folgt der Formel ohne weiteren Phasenfaktor', () => {
    const kante: PhaseEdge = {
      from: 'infra_oepnv', to: 'nachfragedruck', sign: 1, weights: [0.3, 0.6, 0.9],
    };
    const diff: ParamsDiff40 = { infra_oepnv: { from: 0, to: 2 } };
    const stand = [...computePhasePipeline(NEUTRAL, diff, [kante])].map(r => r.marketState.nachfragedruck);
    let erwartet = 0;
    kante.weights.forEach((w, p) => {
      erwartet = PERSISTENCE * erwartet + w / E1_NENNER;
      expect(stand[p]).toBeCloseTo(erwartet, 12);
    });
  });

  it('gleiches Gewicht → gleicher Impuls, unabhängig von der Kantenzahl des Zielknotens', () => {
    const diff: ParamsDiff40 = { infra_oepnv: { from: 0, to: 2 } };
    const allein: PhaseEdge[] = [{ from: 'infra_oepnv', to: 'nachfragedruck', sign: 1, weights: [0.5, 0.5, 0.5] }];
    const mitAnderen: PhaseEdge[] = [
      ...allein,
      ...Array.from({ length: 10 }, (): PhaseEdge => ({ from: 'infra_schule_kita', to: 'nachfragedruck', sign: 1, weights: [1, 1, 1] })),
      { from: 'infra_oepnv', to: 'mietpreis_schutzlevel', sign: 1, weights: [0.5, 0.5, 0.5] },
    ];
    const a = [...computePhasePipeline(NEUTRAL, diff, allein)];
    const b = [...computePhasePipeline(NEUTRAL, diff, mitAnderen)];
    for (const p of [0, 1, 2]) {
      expect(b[p].marketState.nachfragedruck).toBeCloseTo(a[p].marketState.nachfragedruck, 12);
      expect(b[p].marketState.mietpreis_schutzlevel).toBeCloseTo(a[p].marketState.nachfragedruck, 12);
    }
  });

  it('E1_NENNER entspricht der dokumentierten Herleitung (Kontext am Rand → P3 höchstens 1)', () => {
    const mult = marketModulator(2);
    const p3 = E1_NODES.map(node => {
      const ctx = PHASE_WEIGHTED_EDGES.filter(e => e.to === node && e.from.startsWith('ctx:'));
      const sum = (p: 0 | 1 | 2) => ctx.reduce((acc, e) => acc + Math.abs(e.weights[p]), 0);
      return mult * (PERSISTENCE ** 2 * sum(0) + PERSISTENCE * sum(1) + sum(2));
    });
    const max = Math.max(...p3);
    expect(E1_NENNER).toBeGreaterThanOrEqual(max);
    expect(E1_NENNER).toBeCloseTo(Math.ceil(max * 10) / 10, 10);
  });
});
