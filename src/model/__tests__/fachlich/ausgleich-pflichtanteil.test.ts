/**
 * Ausgleich beim Pflichtanteil (Entscheid 2026-11-16).
 *
 * US-018 (Schuetz/Been/Ellen 2012): Ein gemeinnütziger Pflichtanteil senkt das
 * Gesamtangebot nur, wenn kein Ausgleich (Dichtebonus u. ä.) besteht. Im
 * Modell schaltet `gemeinnuetzig_ausgleich` die Kante
 * `gemeinnuetzig_mindestanteil → angebotspotenzial` (bedingte Kante,
 * `getEdgeDelta`). Wie stark eine Stufe ausgleicht, ist eine Setzung.
 */
import { describe, it, expect } from 'vitest';
import { computePhasePipeline } from '../../compute-phases';
import { computeDiff, changedParamKeys } from '../../params';
import { cities } from '../../../generated/cities';
import type { CityParams, ParamValue } from '../../../types';

const ZH = cities.find(c => c.slug === 'zuerich')!;
/** Genf: Pflichtanteil in Kraft (Art. 4A LGZD) mit vollem Ausgleich. */
const GE = cities.find(c => c.slug === 'genf')!;

function angebotP3(basis: CityParams, neu: Partial<CityParams>): number {
  const diff = computeDiff(basis, { ...basis, ...neu });
  return [...computePhasePipeline(ZH.context, diff)][2].marketState.angebotspotenzial;
}

/** Stadt ohne Pflichtanteil und ohne Ausgleich als Ausgangslage. */
const OHNE: CityParams = { ...ZH.params, gemeinnuetzig_mindestanteil: 0, gemeinnuetzig_ausgleich: 0 };
const basisOhne = angebotP3(OHNE, {});
/** Stadt mit hohem Pflichtanteil, aber ohne Ausgleich. */
const PFLICHT: CityParams = { ...ZH.params, gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_ausgleich: 0 };

describe('Ausgleich beim Pflichtanteil', () => {
  it('Stand je Stadt wie erhoben (2026-11-16, alle geklärt, Begründung in switzerland.yaml)', () => {
    const stand = Object.fromEntries(cities.map(c => [c.slug, c.params.gemeinnuetzig_ausgleich]));
    expect(stand).toEqual({
      zuerich: 2, genf: 2, bern: 2, winterthur: 2, basel: 2, // Pflicht nur bei Mehrausnützung
      luzern: 1, lausanne: 1, lugano: 1,                     // ausdrücklicher Bonus
      'st-gallen': 0, biel: 0,                               // kein Ausgleich
    });
  });

  it('Mindestanteil je Stadt: nur Recht in Kraft, wirksamer Anteil an allen Neubauten (2026-11-16)', () => {
    const stand = Object.fromEntries(cities.map(c => [c.slug, c.params.gemeinnuetzig_mindestanteil]));
    expect(stand).toEqual({
      genf: 1, basel: 1, // Pflicht in Kraft für Teilflächen, wirksam 5 bis 21.5 %
      zuerich: 0, winterthur: 0, bern: 0, lausanne: 0, luzern: 0, 'st-gallen': 0, lugano: 0, biel: 0,
    });
  });

  it('wo der Ausgleich schon voll ist, ändert der Pflichtanteil das Angebot nicht (Genf)', () => {
    expect(GE.params.gemeinnuetzig_ausgleich).toBe(2);
    const basis = angebotP3(GE.params, {});
    for (const m of [0, 1, 2] as ParamValue[]) {
      expect(angebotP3(GE.params, { gemeinnuetzig_mindestanteil: m })).toBeCloseTo(basis, 10);
    }
  });

  it('wird ein bestehender Ausgleich gestrichen, sinkt das Angebot (Genf)', () => {
    expect(GE.params.gemeinnuetzig_mindestanteil).toBeGreaterThan(0);
    expect(angebotP3(GE.params, { gemeinnuetzig_ausgleich: 0 })).toBeLessThan(angebotP3(GE.params, {}));
  });

  it('ohne Pflichtanteil in Kraft bewirkt der Ausgleich allein nichts (Zürich)', () => {
    expect(ZH.params.gemeinnuetzig_mindestanteil).toBe(0);
    const basis = angebotP3(ZH.params, {});
    for (const a of [0, 1] as ParamValue[]) {
      expect(angebotP3(ZH.params, { gemeinnuetzig_ausgleich: a })).toBeCloseTo(basis, 10);
    }
  });

  it('[FACH] US-018: Pflichtanteil ohne Ausgleich senkt das Angebot', () => {
    expect(angebotP3(OHNE, { gemeinnuetzig_mindestanteil: 2 })).toBeLessThan(basisOhne);
  });

  it('[FACH] US-018: mit vollem Ausgleich senkt der Pflichtanteil das Angebot nicht', () => {
    expect(angebotP3(OHNE, { gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_ausgleich: 2 }))
      .toBeCloseTo(basisOhne, 10);
  });

  it('teilweiser Ausgleich liegt dazwischen, genau in der Mitte', () => {
    const ohne = angebotP3(OHNE, { gemeinnuetzig_mindestanteil: 2 });
    const halb = angebotP3(OHNE, { gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_ausgleich: 1 });
    expect(halb).toBeGreaterThan(ohne);
    expect(halb).toBeLessThan(basisOhne);
    expect(halb).toBeCloseTo((ohne + basisOhne) / 2, 10);
  });

  it('ohne Pflichtanteil bewirkt der Ausgleich nichts', () => {
    for (const a of [1, 2] as ParamValue[]) {
      expect(angebotP3(OHNE, { gemeinnuetzig_ausgleich: a })).toBeCloseTo(basisOhne, 10);
    }
  });

  it('bei bestehendem Pflichtanteil hebt ein neuer Ausgleich das Angebot', () => {
    const basis = angebotP3(PFLICHT, {});
    const teil = angebotP3(PFLICHT, { gemeinnuetzig_ausgleich: 1 });
    const voll = angebotP3(PFLICHT, { gemeinnuetzig_ausgleich: 2 });
    expect(teil).toBeGreaterThan(basis);
    expect(voll).toBeGreaterThan(teil);
  });

  it('ohne Ausgleich rechnet die Kante wie bisher (Diff von Hand, ohne Begleiteintrag)', () => {
    const vonHand = [...computePhasePipeline(ZH.context, { gemeinnuetzig_mindestanteil: { from: 2, to: 1 } })];
    const app = [...computePhasePipeline(ZH.context, computeDiff(PFLICHT, { ...PFLICHT, gemeinnuetzig_mindestanteil: 1 }))];
    expect(app.map(p => p.marketState)).toEqual(vonHand.map(p => p.marketState));
  });

  it('der Begleiteintrag zählt nicht als Änderung', () => {
    const diff = computeDiff(PFLICHT, { ...PFLICHT, gemeinnuetzig_ausgleich: 2 });
    expect(Object.keys(diff).sort()).toEqual(['gemeinnuetzig_ausgleich', 'gemeinnuetzig_mindestanteil']);
    expect(changedParamKeys(diff)).toEqual(['gemeinnuetzig_ausgleich']);
  });

  it('die übrigen Kanten des Mindestanteils bleiben vom Ausgleich unberührt', () => {
    const kraft = (neu: Partial<CityParams>) =>
      [...computePhasePipeline(ZH.context, computeDiff(OHNE, { ...OHNE, ...neu }))][2].marketState.gemeinnuetzig_kraft;
    expect(kraft({ gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_ausgleich: 2 }))
      .toBeCloseTo(kraft({ gemeinnuetzig_mindestanteil: 2 }), 10);
  });
});
