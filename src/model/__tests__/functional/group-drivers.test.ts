/**
 * Treiber der Gruppen-Trends kommen aus der Rechnung (Leave-one-out),
 * nicht aus einer von Hand gepflegten Liste. Geprüft wird, dass Richtung
 * und Rangfolge zur gerechneten Trendänderung passen.
 */
import { describe, it, expect } from 'vitest';
import { computePhasesCached } from '../../compute-phases';
import { computeGroupDrivers } from '../../group-drivers';
import { computeGroupTrends, GROUPS } from '../../groups';
import { PARAM_KEYS_40 } from '../../params';
import { cities } from '../../../generated/cities';
import type { ParamsDiff40, ParamValue } from '../../../types';

const ZH = cities.find(c => c.slug === 'zuerich')!;

function trends(diff: ParamsDiff40) {
  return computePhasesCached(ZH.context, diff).map(p =>
    Object.fromEntries(computeGroupTrends(p.marketState, ZH.context).map(t => [t.group.id, t.value])),
  );
}

describe('Gruppen-Treiber aus der Rechnung', () => {
  it('ohne Änderung gibt es keine Treiber', () => {
    for (const phase of computeGroupDrivers(ZH.context, {})) {
      for (const g of GROUPS) expect(phase[g.id]).toHaveLength(0);
    }
  });

  it('bei einer einzelnen Änderung stimmt die Treiberrichtung mit der Trendänderung überein (alle Parameter, Gruppen, Phasen)', () => {
    const base = trends({});
    let geprueft = 0;
    for (const key of PARAM_KEYS_40) {
      const from = ZH.params[key];
      for (const to of [0, 1, 2] as ParamValue[]) {
        if (to === from) continue;
        const diff: ParamsDiff40 = { [key]: { from, to } };
        const mod = trends(diff);
        computeGroupDrivers(ZH.context, diff).forEach((phase, i) => {
          for (const g of GROUPS) {
            const delta = mod[i][g.id] - base[i][g.id];
            for (const d of phase[g.id]) {
              expect(d.paramKey).toBe(key);
              expect(d.direction, `${key} ${from}→${to}, ${g.id}, P${i + 1}`).toBe(delta > 0 ? 'up' : 'down');
              expect(d.weight).toBeCloseTo(Math.abs(delta), 9);
              geprueft++;
            }
          }
        });
      }
    }
    expect(geprueft).toBeGreaterThan(100);
  });

  it('strengere Anfangsmiete-Regel wirkt bei Neumietern preistreibend, wie gerechnet', () => {
    // Die alte Handliste führte sie als «senkend»; die Rechnung (Spillover des
    // Bestandsschutzes auf Neumieter, groups.ts) hebt den Trend.
    // Seit 2026-11-15 (CH-003: kein messbarer Effekt der Anfechtung) liegt
    // der Beitrag einer Stufe unter der Anzeigeschwelle DRIVER_MIN_BEITRAG.
    // Geprüft wird darum die Richtung der Rechnung und, falls angezeigt, die
    // Richtung des Treibers.
    const from = ZH.params.mietrecht_anfangsmiete;
    const to = (from === 2 ? 0 : 2) as ParamValue;
    const diff: ParamsDiff40 = { mietrecht_anfangsmiete: { from, to } };
    const delta = trends(diff)[1].normalverdiener_angebot - trends({})[1].normalverdiener_angebot;
    expect(Math.sign(delta)).toBe(to > from ? 1 : -1);
    const phase2 = computeGroupDrivers(ZH.context, diff)[1];
    const d = phase2.normalverdiener_angebot.find(x => x.paramKey === 'mietrecht_anfangsmiete');
    if (d) expect(d.direction).toBe(to > from ? 'up' : 'down');
  });

  it('ein Parameter ohne Wirkung auf den Trend erscheint nicht als Treiber', () => {
    const from = ZH.params.mietrecht_mietzinsindex;
    const diff: ParamsDiff40 = {
      mietrecht_mietzinsindex: { from, to: (from === 2 ? 0 : 2) as ParamValue },
      mietrecht_kostenmiete: { from: ZH.params.mietrecht_kostenmiete, to: (ZH.params.mietrecht_kostenmiete === 2 ? 0 : 2) as ParamValue },
    };
    for (const phase of computeGroupDrivers(ZH.context, diff)) {
      for (const g of GROUPS) {
        expect(phase[g.id].map(d => d.paramKey)).not.toContain('mietrecht_mietzinsindex');
      }
    }
  });

  it('höchstens drei Treiber je Gruppe, absteigend nach Beitrag', () => {
    const diff: ParamsDiff40 = {};
    for (const key of ['mietrecht_kostenmiete', 'raumplanung_ausnuetzungsziffer', 'infra_oepnv', 'gemeinnuetzig_foerderfonds', 'mietrecht_kuendigungsschutz'] as const) {
      const from = ZH.params[key];
      diff[key] = { from, to: (from === 2 ? 0 : 2) as ParamValue };
    }
    for (const phase of computeGroupDrivers(ZH.context, diff)) {
      for (const g of GROUPS) {
        const list = phase[g.id];
        expect(list.length).toBeLessThanOrEqual(3);
        for (let i = 1; i < list.length; i++) expect(list[i - 1].weight).toBeGreaterThanOrEqual(list[i].weight);
      }
    }
  });
});
