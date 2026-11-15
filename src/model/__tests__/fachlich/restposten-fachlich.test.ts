/**
 * restposten-fachlich.test.ts — Restposten aus dem Verbesserungsplan
 * 2026-11-13 (Prüfung 2026-11-15)
 *
 * Je Modelländerung ein fachlicher Test, gerechnet mit den Kontexten aller
 * Städte aus switzerland.yaml:
 *   - Fiskalische Wirkung: gemeinnuetzig_kraft geht mit −1 ein. Förderfonds
 *     und Baurecht kosten die öffentliche Hand Geld (Lesart: plus =
 *     Mehreinnahmen/Entlastung).
 *   - Kurzzeitvermietung → Verdrängung: Richtung bleibt, Grösse unter den
 *     direkten Schutzinstrumenten (US-013, US-014, ES-002: keine messbare
 *     Mietwirkung der Regulierung; US-003, ES-001: rund 2 % Mietwirkung der
 *     Aktivität).
 *   - Geringverdiener: ein stärkerer gemeinnütziger Sektor senkt den
 *     Preistrend (AT-002), schwächer als bei den Genossenschaftern.
 *   - Strittige Kanten aus Fix-1: als Annahme gekennzeichnet, Parameter ohne
 *     Wirkungsstudie als «Wirkung nicht belegt».
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline } from '../../compute-phases';
import { computeGroupTrends, type GroupId } from '../../groups';
import { PHASE_WEIGHTED_EDGES } from '../../phase-weights';
import { E2_TERMS } from '../../derived';
import { paramMeta40 } from '../../params';
import { cities } from '../../../generated/cities';
import type { CityContext, ParamsDiff40 } from '../../../types';
import type { PhaseResult } from '../../phases';

function run(ctx: CityContext, diff: ParamsDiff40): PhaseResult[] {
  return [...computePhasePipeline(ctx, diff)];
}

function trend(ctx: CityContext, r: PhaseResult, id: GroupId): number {
  return computeGroupTrends(r.marketState, ctx).find(g => g.group.id === id)!.value;
}

function edge(from: string, to: string) {
  const e = PHASE_WEIGHTED_EDGES.find(x => x.from === from && x.to === to);
  expect(e, `${from} → ${to}`).toBeDefined();
  return e!;
}

describe('Fiskalische Wirkung: Vorzeichen des gemeinnützigen Sektors', () => {
  it('gemeinnuetzig_kraft geht mit −1 in fiskalische_wirkung ein', () => {
    const term = E2_TERMS.fiskalische_wirkung.find(t => t.from === 'gemeinnuetzig_kraft');
    expect(term?.sign).toBe(-1);
  });

  describe.each(cities.map(c => [c.name, c.context] as const))('%s', (_name, ctx) => {
    const basis = run(ctx, {});

    it('[FACH] Förderfonds 1→2 senkt die fiskalische Wirkung (Fondsmittel kosten)', () => {
      const mit = run(ctx, { gemeinnuetzig_foerderfonds: { from: 1, to: 2 } });
      for (const p of [0, 1, 2]) {
        expect(mit[p].derived.fiskalische_wirkung).toBeLessThan(basis[p].derived.fiskalische_wirkung);
      }
    });

    it('[FACH] Baurecht 1→2 senkt die fiskalische Wirkung (Baurechtszins unter Marktwert)', () => {
      const mit = run(ctx, { gemeinnuetzig_baurecht: { from: 1, to: 2 } });
      expect(mit[2].derived.fiskalische_wirkung).toBeLessThan(basis[2].derived.fiskalische_wirkung);
    });

    it('[FACH] Mehrwertabgabe 1→2 hebt die fiskalische Wirkung weiterhin (Abschöpfung)', () => {
      const mit = run(ctx, { boden_mehrwertabgabe: { from: 1, to: 2 } });
      expect(mit[2].derived.fiskalische_wirkung).toBeGreaterThan(basis[2].derived.fiskalische_wirkung);
    });
  });
});

describe('Kurzzeitvermietung → Verdrängung: Grösse nach Evidenz', () => {
  it('Richtung bleibt: strengere Regeln senken das Verdrängungsrisiko', () => {
    expect(edge('nutzung_kurzzeitvermietung', 'verdraengungsrisiko').sign).toBe(-1);
  });

  it('[FACH] schwächer als die direkten Schutzinstrumente (Kündigungsschutz, Abbruch-, Umnutzungsverbot)', () => {
    const w = (from: string) => edge(from, 'verdraengungsrisiko').weights[2];
    const str = w('nutzung_kurzzeitvermietung');
    for (const schutz of ['mietrecht_kuendigungsschutz', 'nutzung_abbruchverbot', 'nutzung_umnutzungsverbot']) {
      expect(str).toBeLessThan(w(schutz) / 2);
    }
  });

  describe.each(cities.map(c => [c.name, c.context] as const))('%s', (_name, ctx) => {
    it('[FACH] Kurzzeitvermietung 1→2 senkt das Verdrängungsrisiko weniger als Kündigungsschutz 1→2 (P3)', () => {
      const basis = run(ctx, {});
      const d = (diff: ParamsDiff40) =>
        basis[2].marketState.verdraengungsrisiko - run(ctx, diff)[2].marketState.verdraengungsrisiko;
      const str = d({ nutzung_kurzzeitvermietung: { from: 1, to: 2 } });
      const kuendigung = d({ mietrecht_kuendigungsschutz: { from: 1, to: 2 } });
      expect(str).toBeGreaterThan(0);
      expect(str).toBeLessThan(kuendigung);
    });
  });
});

describe('Geringverdiener: gemeinnütziger Sektor (AT-002)', () => {
  describe.each(cities.map(c => [c.name, c.context] as const))('%s', (_name, ctx) => {
    const basis = run(ctx, {});

    it('[FACH] Baurecht 1→2 senkt den Preistrend der Geringverdiener (P3)', () => {
      // Baurecht wirkt im Modell nur über gemeinnuetzig_kraft; vor dem Term
      // war die Änderung für Geringverdiener 0.
      const mit = run(ctx, { gemeinnuetzig_baurecht: { from: 1, to: 2 } });
      expect(trend(ctx, mit[2], 'geringverdiener')).toBeLessThan(trend(ctx, basis[2], 'geringverdiener'));
    });

    it('[FACH] die Wirkung ist kleiner als bei den Genossenschaftern', () => {
      const mit = run(ctx, { gemeinnuetzig_baurecht: { from: 1, to: 2 } });
      const d = (id: GroupId) => trend(ctx, basis[2], id) - trend(ctx, mit[2], id);
      expect(d('geringverdiener')).toBeLessThan(d('genossenschafter'));
    });
  });
});

describe('Strittige Kanten aus Fix-1: gekennzeichnet statt umgedreht', () => {
  it('die drei Kanten sind Annahme-Kanten mit unverändertem Vorzeichen', () => {
    expect(edge('nutzung_zweitwohnungen', 'angebotspotenzial')).toMatchObject({ sign: -1, profilQuelle: 'Annahme' });
    expect(edge('mietrecht_untervermietung', 'verdraengungsrisiko')).toMatchObject({ sign: -1, profilQuelle: 'Annahme' });
    expect(edge('mietrecht_mietzinstransparenz', 'marktfriktion')).toMatchObject({ sign: 1, profilQuelle: 'Annahme' });
  });

  it('Zweitwohnungen und Untervermietung tragen «Wirkung nicht belegt»', () => {
    const meta = (key: string) => paramMeta40.find(m => m.key === key)!;
    expect(meta('nutzung_zweitwohnungen').evidenz).toBe('nicht_belegt');
    expect(meta('mietrecht_untervermietung').evidenz).toBe('nicht_belegt');
    // Mietzinstransparenz hat schwache, aber vorhandene Evidenz für das
    // Schutzlevel (summary.md, DE-006); nur die Friktionskante ist Annahme.
    expect(meta('mietrecht_mietzinstransparenz').evidenz).toBeUndefined();
  });
});
