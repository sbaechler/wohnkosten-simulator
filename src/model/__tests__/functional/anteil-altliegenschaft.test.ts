/**
 * `anteil_altliegenschaft` (CH-012, BFS GWS 31.12.2025) ist gemessen und in
 * switzerland.yaml gesetzt. Solange WIRKSAMKEIT_OQU 0 ist, darf er kein
 * Rechenergebnis verändern: weder im Status quo noch beim Gegenvorschlag
 * (`mietrecht_kriterium` 1 → 2, dort ist das Tor unabhängig vom Anteil offen).
 */
import { describe, it, expect } from 'vitest';
import { cities } from '../../../generated/cities';
import { computePhasePipeline } from '../../compute-phases';
import { WIRKSAMKEIT_OQU } from '../../mietrecht-regime';
import type { CityContext, ParamsDiff40 } from '../../../types';

function ohneAnteil(context: CityContext): CityContext {
  const rest = { ...context };
  delete rest.anteil_altliegenschaft;
  return rest;
}

describe('anteil_altliegenschaft', () => {
  it('ist für alle Städte als Anteil in [0, 1] gesetzt', () => {
    expect(cities).toHaveLength(10);
    for (const city of cities) {
      const anteil = city.context.anteil_altliegenschaft;
      expect(typeof anteil, city.slug).toBe('number');
      expect(anteil!, city.slug).toBeGreaterThanOrEqual(0);
      expect(anteil!, city.slug).toBeLessThanOrEqual(1);
    }
  });

  it('Voraussetzung: Orts- und Quartierüblichkeit gilt als nicht durchgesetzt', () => {
    // Wird WIRKSAMKEIT_OQU gesetzt, wirkt der Anteil im Status quo. Dann diesen
    // Test bewusst anpassen und die Messvorschrift in CH-012 prüfen.
    expect(WIRKSAMKEIT_OQU).toBe(0);
  });

  for (const city of cities) {
    const diffs: Record<string, ParamsDiff40> = {
      'leeres Diff': {},
      'Kriterium 1 → 2': {
        mietrecht_kriterium: { from: city.params.mietrecht_kriterium, to: 2 },
      },
    };
    for (const [name, diff] of Object.entries(diffs)) {
      it(`${city.slug}, ${name}: alle Phasen gleich mit und ohne Anteil`, () => {
        const mit = [...computePhasePipeline(city.context, diff)];
        const ohne = [...computePhasePipeline(ohneAnteil(city.context), diff)];
        expect(mit).toHaveLength(3);
        expect(mit).toEqual(ohne);
      });
    }
  }
});
