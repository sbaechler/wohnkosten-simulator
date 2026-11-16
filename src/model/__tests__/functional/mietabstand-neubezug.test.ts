/**
 * `mietabstand_neubezug` (BFS Strukturerhebung 2024) ist ein Anzeige-Indikator
 * und darf in keine Rechnung einfliessen. `mietluecke` bleibt leer (CH-012):
 * Der Mietabstand ist nicht der Abstand zum zulässigen Ertrag.
 */
import { describe, it, expect } from 'vitest';
import { cities } from '../../../generated/cities';
import { computePhasePipeline } from '../../compute-phases';
import type { CityContext, ParamsDiff } from '../../../types';

function ohneAbstand(context: CityContext): CityContext {
  const rest = { ...context };
  delete rest.mietabstand_neubezug;
  return rest;
}

describe('mietabstand_neubezug', () => {
  it('ist für alle Städte gesetzt: Neubezug teurer als lange Mietdauer, Ebene benannt', () => {
    for (const city of cities) {
      const abstand = city.context.mietabstand_neubezug;
      expect(abstand, city.slug).toBeDefined();
      expect(abstand!.faktor, city.slug).toBeGreaterThan(1);
      expect(abstand!.faktor, city.slug).toBeLessThan(3);
      expect(['stadt', 'kanton'], city.slug).toContain(abstand!.ebene);
    }
  });

  it('Stadtwerte gibt es nur für die fünf Grossstädte der BFS-Tabelle T 09.03.03.67', () => {
    const stadt = cities.filter(c => c.context.mietabstand_neubezug?.ebene === 'stadt').map(c => c.slug).sort();
    expect(stadt).toEqual(['basel', 'bern', 'genf', 'lausanne', 'zuerich']);
  });

  it('mietluecke bleibt in allen Städten leer', () => {
    for (const city of cities) expect(city.context.mietluecke, city.slug).toBeUndefined();
  });

  for (const city of cities) {
    const diffs: Record<string, ParamsDiff> = {
      'leeres Diff': {},
      'Durchsetzung und Kostenmiete': {
        mietrecht_durchsetzung: { from: city.params.mietrecht_durchsetzung, to: 2 },
        mietrecht_kostenmiete: { from: city.params.mietrecht_kostenmiete, to: 2 },
      },
    };
    for (const [name, diff] of Object.entries(diffs)) {
      it(`${city.slug}, ${name}: Rechnung gleich mit und ohne Mietabstand`, () => {
        const mit = [...computePhasePipeline(city.context, diff)];
        const ohne = [...computePhasePipeline(ohneAbstand(city.context), diff)];
        expect(mit.map(p => [p.marketState, p.derived])).toEqual(ohne.map(p => [p.marketState, p.derived]));
      });
    }
  }
});
