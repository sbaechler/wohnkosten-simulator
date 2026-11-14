/**
 * rangfolge-fachlich.test.ts — Rangfolge der Hebel (Verbesserungsplan Fix-13)
 *
 * Dieselben Rangfolgen wie die RANG_CONSTRAINTS in scripts/calibrate.ts,
 * gerechnet mit den Kontexten aller Städte aus switzerland.yaml. Je eine
 * Stufe pro Hebel.
 *
 * Quellen:
 *   - summary.md: Angebot ist der dominante Hebel.
 *   - CH-003: Anfechtung der Anfangsmiete ohne messbaren Effekt.
 *   - GLOBAL-027 / GLOBAL-029: Mietregulierung schützt den Bestand, hebt die
 *     Marktmieten und senkt das Angebot langfristig.
 *   - US-007 Minneapolis: Upzoning ohne messbaren Preiseffekt in den ersten
 *     Jahren.
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline } from '../../compute-phases';
import { computeGroupTrends, type GroupId } from '../../groups';
import { computeMieteBelastung } from '../../belastung';
import { cities } from '../../../generated/cities';
import type { CityContext, MarketState, ParamsDiff40 } from '../../../types';

function phases(ctx: CityContext, diff: ParamsDiff40): MarketState[] {
  return [...computePhasePipeline(ctx, diff)].map(r => r.marketState);
}

function trend(s: MarketState, id: GroupId): number {
  return computeGroupTrends(s).find(g => g.group.id === id)!.value;
}

const ANGEBOTSHEBEL: Record<string, ParamsDiff40> = {
  'Zonierung (mehr Bauland)': { raumplanung_zonenreserve: { from: 2, to: 1 } },
  'Verdichtung': { raumplanung_verdichtung: { from: 1, to: 2 } },
  'Ausnützung': { raumplanung_ausnuetzungsziffer: { from: 1, to: 2 } },
};
const VERGLEICHSHEBEL: Record<string, ParamsDiff40> = {
  'Förderfonds': { gemeinnuetzig_foerderfonds: { from: 1, to: 2 } },
  'ÖV-Ausbau': { infra_oepnv: { from: 1, to: 2 } },
};
const MIETREGULIERUNG: ParamsDiff40 = {
  mietrecht_kostenmiete: { from: 1, to: 2 },
  mietrecht_kuendigungsschutz: { from: 1, to: 2 },
};

/** Gleiche Setzung wie KEIN_MESSBARER_EFFEKT in scripts/calibrate.ts. */
const KEIN_MESSBARER_EFFEKT = 0.02;

describe.each(cities.map(c => [c.name, c.context] as const))('Rangfolge der Hebel — %s', (_name, ctx) => {
  const basis = phases(ctx, {});
  const deltaNeumieterP3 = (diff: ParamsDiff40) =>
    Math.abs(trend(phases(ctx, diff)[2], 'normalverdiener_angebot') - trend(basis[2], 'normalverdiener_angebot'));

  for (const [a, diffA] of Object.entries(ANGEBOTSHEBEL)) {
    for (const [b, diffB] of Object.entries(VERGLEICHSHEBEL)) {
      it(`[FACH] summary.md: ${a} wirkt auf Neumieter in P3 stärker als ${b}`, () => {
        expect(deltaNeumieterP3(diffA)).toBeGreaterThan(deltaNeumieterP3(diffB));
      });
    }
  }

  it('[FACH] CH-003: Anfangsmiete wirkt auf die Mietbelastung schwächer als Kostenmiete (P3)', () => {
    const belastung = (diff: ParamsDiff40) =>
      Math.abs(computeMieteBelastung(phases(ctx, diff)[2]) - computeMieteBelastung(basis[2]));
    expect(belastung({ mietrecht_anfangsmiete: { from: 1, to: 2 } }))
      .toBeLessThan(belastung({ mietrecht_kostenmiete: { from: 1, to: 2 } }));
  });

  it('[FACH] GLOBAL-027/-029: Mietregulierung — Bestand sinkt, Neumieter steigt, Angebot sinkt in P3 stärker als in P1', () => {
    const mit = phases(ctx, MIETREGULIERUNG);
    expect(trend(mit[2], 'normalverdiener_bestand')).toBeLessThan(trend(basis[2], 'normalverdiener_bestand'));
    expect(trend(mit[2], 'normalverdiener_angebot')).toBeGreaterThan(trend(basis[2], 'normalverdiener_angebot'));
    const dAngebotP1 = mit[0].angebotspotenzial - basis[0].angebotspotenzial;
    const dAngebotP3 = mit[2].angebotspotenzial - basis[2].angebotspotenzial;
    expect(dAngebotP3).toBeLessThan(dAngebotP1);
    expect(dAngebotP1).toBeLessThanOrEqual(0);
  });

  it('[FACH] US-007: Upzoning (Ausnützung) ohne messbaren Preiseffekt für Neumieter in P1', () => {
    const mit = phases(ctx, ANGEBOTSHEBEL['Ausnützung']);
    const delta = trend(mit[0], 'normalverdiener_angebot') - trend(basis[0], 'normalverdiener_angebot');
    expect(Math.abs(delta)).toBeLessThanOrEqual(KEIN_MESSBARER_EFFEKT);
  });
});
