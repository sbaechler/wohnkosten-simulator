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
import { computeDiff40, changedParamKeys } from '../../params';
import { cities } from '../../../generated/cities';
import type { CityParams40, ParamValue } from '../../../types';

const ZH = cities.find(c => c.slug === 'zuerich')!;

function angebotP3(basis: CityParams40, neu: Partial<CityParams40>): number {
  const diff = computeDiff40(basis, { ...basis, ...neu });
  return [...computePhasePipeline(ZH.context, diff)][2].marketState.angebotspotenzial;
}

/** Stadt ohne Pflichtanteil und ohne Ausgleich als Ausgangslage. */
const OHNE: CityParams40 = { ...ZH.params, gemeinnuetzig_mindestanteil: 0, gemeinnuetzig_ausgleich: 0 };
const basisOhne = angebotP3(OHNE, {});

describe('Ausgleich beim Pflichtanteil', () => {
  it('alle Städte stehen auf «kein Ausgleich» (nicht erhoben)', () => {
    for (const c of cities) expect(c.params.gemeinnuetzig_ausgleich, c.slug).toBe(0);
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

  it('bei bestehendem Pflichtanteil hebt ein neuer Ausgleich das Angebot (Zürich)', () => {
    expect(ZH.params.gemeinnuetzig_mindestanteil).toBeGreaterThan(0);
    const basis = angebotP3(ZH.params, {});
    const teil = angebotP3(ZH.params, { gemeinnuetzig_ausgleich: 1 });
    const voll = angebotP3(ZH.params, { gemeinnuetzig_ausgleich: 2 });
    expect(teil).toBeGreaterThan(basis);
    expect(voll).toBeGreaterThan(teil);
  });

  it('ohne Ausgleich rechnet die Kante wie bisher (Diff von Hand, ohne Begleiteintrag)', () => {
    const vonHand = [...computePhasePipeline(ZH.context, { gemeinnuetzig_mindestanteil: { from: 2, to: 1 } })];
    const app = [...computePhasePipeline(ZH.context, computeDiff40(ZH.params, { ...ZH.params, gemeinnuetzig_mindestanteil: 1 }))];
    expect(app.map(p => p.marketState)).toEqual(vonHand.map(p => p.marketState));
  });

  it('der Begleiteintrag zählt nicht als Änderung', () => {
    const diff = computeDiff40(ZH.params, { ...ZH.params, gemeinnuetzig_ausgleich: 2 });
    expect(Object.keys(diff).sort()).toEqual(['gemeinnuetzig_ausgleich', 'gemeinnuetzig_mindestanteil']);
    expect(changedParamKeys(diff)).toEqual(['gemeinnuetzig_ausgleich']);
  });

  it('die übrigen Kanten des Mindestanteils bleiben vom Ausgleich unberührt', () => {
    const kraft = (neu: Partial<CityParams40>) =>
      [...computePhasePipeline(ZH.context, computeDiff40(OHNE, { ...OHNE, ...neu }))][2].marketState.gemeinnuetzig_kraft;
    expect(kraft({ gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_ausgleich: 2 }))
      .toBeCloseTo(kraft({ gemeinnuetzig_mindestanteil: 2 }), 10);
  });
});
