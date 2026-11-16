/**
 * gruppenmodell-fachlich.test.ts — Gruppenmodell und Mietbelastung (Fix-14)
 *
 * Verbesserungsplan 2026-11-13, Fix-14 (2026-11-15):
 *   1. Geringverdiener tragen einen Verdrängungsterm (CH-008, ETH SPUR 2025).
 *   2. Eigentümer mit Hypothek: direkter Zinskanal über die ÄNDERUNG des
 *      Referenzzinssatzes, nicht über das Zinsniveau.
 *   3. Mietbelastung: eine Basis für alle Städte; das ungemessene Kontextfeld
 *      `mietbelastungs_grenze` ist aus den Daten entfernt.
 *   4. Mietbelastung als Kennzahl über den Bestand: Kostenmiete entlastet
 *      kurzfristig (Schutz, DE-004), das kleinere Angebot holt die Entlastung
 *      langfristig ein (GLOBAL-029). Gemeinnützige Kraft senkt die
 *      Mietbelastung (AT-002).
 *
 * Geprüft werden Vorzeichen und Rangfolgen, keine Faktoren.
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline } from '../../compute-phases';
import { computeGroupTrends, type GroupId } from '../../groups';
import { computeMieteBelastung } from '../../belastung';
import { cities } from '../../../generated/cities';
import type { CityContext, MarketState, ParamsDiff } from '../../../types';
import { REGIME_NEUTRAL } from '../market-state-fixtures';

const leer: MarketState = {
  angebotspotenzial: 0, nachfragedruck: 0, mietpreis_schutzlevel: 0,
  verdraengungsrisiko: 0, spekulationshemmung: 0, marktfriktion: 0,
  gemeinnuetzig_kraft: 0, eigentumsquoten_trend: 0, aufwertungsdruck: 0,
  investitionsattraktivitaet: 0, angebotspotenzial_regulation: 0,
  ...REGIME_NEUTRAL,
};

function phases(ctx: CityContext, diff: ParamsDiff): MarketState[] {
  return [...computePhasePipeline(ctx, diff)].map(r => r.marketState);
}

function trend(s: MarketState, ctx: Pick<CityContext, 'referenzzins_aenderung'>, id: GroupId): number {
  return computeGroupTrends(s, ctx).find(g => g.group.id === id)!.value;
}

/** Anzeigeschwelle «steigend»/«sinkend» der Gruppen-Trends (groups.ts, makeTooltip). */
const ANZEIGESCHWELLE = 0.15;

const ZH = cities.find(c => c.slug === 'zuerich')!;

describe('Fix-14.1: Verdrängung trifft Geringverdiener (CH-008)', () => {
  const verdraengung: MarketState = { ...leer, verdraengungsrisiko: 1 };
  const delta = (id: GroupId) => trend(verdraengung, {}, id) - trend(leer, {}, id);

  it('[FACH] CH-008: höheres Verdrängungsrisiko hebt den Trend der Geringverdiener', () => {
    expect(delta('geringverdiener')).toBeGreaterThan(0);
  });

  it('[FACH] CH-008: Geringverdiener und Rentner reagieren gleich stark auf Verdrängung (Quelle nennt beide ohne Rangfolge)', () => {
    expect(delta('geringverdiener')).toBeCloseTo(delta('rentner'), 10);
  });

  it('[FACH] CH-008: Geringverdiener reagieren stärker auf Verdrängung als Bestandsmieter und High Earner', () => {
    expect(delta('geringverdiener')).toBeGreaterThan(delta('normalverdiener_bestand'));
    expect(delta('geringverdiener')).toBeGreaterThan(delta('high_earner'));
  });

  it('[FACH] CH-008: Lockerung des Abbruchverbots hebt die Verdrängung; Geringverdiener profitieren weniger als Bestandsmieter (Zürich, P3)', () => {
    const basis = phases(ZH.context, {});
    const mit = phases(ZH.context, { nutzung_abbruchverbot: { from: 2, to: 1 } });
    expect(mit[2].verdraengungsrisiko).toBeGreaterThan(basis[2].verdraengungsrisiko);
    const dGering = trend(mit[2], ZH.context, 'geringverdiener') - trend(basis[2], ZH.context, 'geringverdiener');
    const dBestand = trend(mit[2], ZH.context, 'normalverdiener_bestand') - trend(basis[2], ZH.context, 'normalverdiener_bestand');
    expect(dGering).toBeGreaterThan(dBestand);
  });
});

describe('Fix-14.2: Zinskanal der Eigentümer mit Hypothek', () => {
  const eig = (s: MarketState, ctx: Pick<CityContext, 'referenzzins_aenderung'>) =>
    trend(s, ctx, 'normalverdiener_eigentuemer');

  it('[FACH] steigender Referenzzinssatz hebt, sinkender senkt den Trend der Eigentümer', () => {
    expect(eig(leer, { referenzzins_aenderung: 1 })).toBeGreaterThan(eig(leer, { referenzzins_aenderung: 0 }));
    expect(eig(leer, { referenzzins_aenderung: -1 })).toBeLessThan(eig(leer, { referenzzins_aenderung: 0 }));
  });

  it('[FACH] unveränderter Satz wirkt wie fehlende Angabe', () => {
    expect(eig(leer, { referenzzins_aenderung: 0 })).toBe(eig(leer, {}));
  });

  it('[FACH] das Zinsniveau allein ist kein direkter Preistreiber (gleicher Markt-Zustand, anderes Niveau)', () => {
    const tiefCtx: CityContext = { ...ZH.context, zinsniveau: -2 };
    const hochCtx: CityContext = { ...ZH.context, zinsniveau: 2 };
    const tief = computeGroupTrends(leer, tiefCtx).map(t => t.value);
    const hoch = computeGroupTrends(leer, hochCtx).map(t => t.value);
    expect(hoch).toEqual(tief);
  });

  it('[FACH] der Zinskanal betrifft nur die Eigentümer, nicht die Mietergruppen', () => {
    const ohne = computeGroupTrends(leer, {});
    const mit = computeGroupTrends(leer, { referenzzins_aenderung: 2 });
    for (const [i, t] of ohne.entries()) {
      if (t.group.id === 'normalverdiener_eigentuemer') continue;
      expect(mit[i].value, t.group.id).toBe(t.value);
    }
  });

  describe.each(cities.map(c => [c.name, c.context] as const))('%s', (_name, ctx) => {
    it('[FACH] eine Stufe Zinserhöhung hebt den Eigentümer-Trend in jeder Phase sichtbar (≥ Anzeigeschwelle)', () => {
      const mitCtx: CityContext = { ...ctx, referenzzins_aenderung: 1 };
      const basis = phases(ctx, {});
      const mit = phases(mitCtx, {});
      for (const i of [0, 1, 2]) {
        expect(eig(mit[i], mitCtx) - eig(basis[i], ctx)).toBeGreaterThanOrEqual(ANZEIGESCHWELLE - 1e-9);
      }
    });
  });
});

describe('Fix-14.3: Mietbelastung ohne stadtspezifische Scheinbasis', () => {
  it('kein Stadtkontext trägt mehr das ungemessene Feld mietbelastungs_grenze', () => {
    for (const c of cities) expect('mietbelastungs_grenze' in c.context, c.slug).toBe(false);
  });

  it('die Basis ohne Marktabweichung ist der CH-Wert des Wohnmonitors (44.8 %)', () => {
    expect(computeMieteBelastung(leer)).toBeCloseTo(44.8, 10);
  });
});

describe.each(cities.map(c => [c.name, c.context] as const))('Fix-14.4: Mietbelastung — %s', (_name, ctx) => {
  const basis = phases(ctx, {});
  const dBelastung = (diff: ParamsDiff) => {
    const mit = phases(ctx, diff);
    return mit.map((s, i) => computeMieteBelastung(s) - computeMieteBelastung(basis[i]));
  };

  it('[FACH] DE-004/GLOBAL-029: Kostenmiete entlastet in P1, die Wirkung kippt über die Zeit nach oben (Angebot)', () => {
    const d = dBelastung({ mietrecht_kostenmiete: { from: 1, to: 2 } });
    expect(d[0]).toBeLessThan(0);
    expect(d[2]).toBeGreaterThan(d[0]);
  });

  it('[FACH] AT-002: Förderfonds und Baurecht senken die Mietbelastung in P3', () => {
    expect(dBelastung({ gemeinnuetzig_foerderfonds: { from: 1, to: 2 } })[2]).toBeLessThan(0);
    expect(dBelastung({ gemeinnuetzig_baurecht: { from: 1, to: 2 } })[2]).toBeLessThan(0);
  });

  it('[FACH] AT-002: Baurecht wirkt auf die Mietbelastung nur über gemeinnuetzig_kraft und senkt sie trotzdem', () => {
    const mit = phases(ctx, { gemeinnuetzig_baurecht: { from: 1, to: 2 } });
    expect(mit[2].gemeinnuetzig_kraft).toBeGreaterThan(basis[2].gemeinnuetzig_kraft);
    expect(computeMieteBelastung(mit[2])).toBeLessThan(computeMieteBelastung(basis[2]));
  });
});
