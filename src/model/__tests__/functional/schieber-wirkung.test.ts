/**
 * Jeder Schieber im Panel muss etwas bewegen, das ein Widget zeigt
 * (Verbesserungsplan 2026-11, Fix-5). Ein Schieber ohne sichtbare Wirkung
 * ist ein Testfehler: Entweder fehlt die Kante, oder das Widget.
 */
import { describe, it, expect } from 'vitest';
import { computePhasesCached } from '../../compute-phases';
import { computeGroupTrends } from '../../groups';
import { PARAM_KEYS_40, computeDiff40 } from '../../params';
import { cities } from '../../../generated/cities';
import type { CityParams40, MarketState, DerivedIndicators, ParamsDiff40, ParamValue } from '../../../types';

/** E1-Zustände, die ein Widget in WidgetGrid direkt anzeigt. */
const GEZEIGTE_E1: Array<keyof MarketState> = [
  'nachfragedruck', 'angebotspotenzial', 'angebotspotenzial_regulation', 'aufwertungsdruck',
  'eigentumsquoten_trend', 'gemeinnuetzig_kraft', 'investitionsattraktivitaet', 'marktfriktion',
  // MietrechtRegimeWidget
  'vergleichsmiete_aktiv', 'erhoehungsspielraum', 'bestandsmiete', 'anfangsmiete', 'verweildauer',
];

/** E2-Indikatoren, die ein Widget anzeigt. */
const GEZEIGTE_E2: Array<keyof DerivedIndicators> = [
  'gentrifizierungsindex', 'neubau_hemmnisindex', 'fiskalische_wirkung',
];

/** Kleinster Unterschied, der in einer Anzeige mit zwei Nachkommastellen erscheint. */
const SICHTBAR = 0.005;

/**
 * Schieber, die allein nichts bewegen. Jeder Eintrag braucht eine Begründung
 * und einen Test, der die Wirkung in Kombination zeigt.
 */
const NUR_IN_KOMBINATION: Partial<Record<keyof CityParams40, string>> = {
  mietrecht_durchsetzung:
    'Vollzieht nur einen Senkungsanspruch (negativer Erhöhungsspielraum) oder zieht eine gestiegene Miete an den Deckel zurück; im Ausgangszustand gibt es beides nicht.',
  gemeinnuetzig_ausgleich:
    'Schaltet nur die Kante des Pflichtanteils (bedingte Kante). Zürich hat seit 2026-11-16 keinen Pflichtanteil in Kraft (Stufe 0). Wirkung in Kombination: ausgleich-pflichtanteil.test.ts.',
};

const ZH = cities.find(c => c.slug === 'zuerich')!;

function gezeigt(diff: ParamsDiff40): number[] {
  return computePhasesCached(ZH.context, diff).flatMap(p => [
    ...GEZEIGTE_E1.map(f => p.marketState[f]),
    ...GEZEIGTE_E2.map(f => p.derived[f]),
    ...computeGroupTrends(p.marketState, ZH.context).map(t => t.value),
  ]);
}

function maxAbweichung(diff: ParamsDiff40, gegen: ParamsDiff40 = {}): number {
  const a = gezeigt(gegen);
  const b = gezeigt(diff);
  return Math.max(...a.map((v, i) => Math.abs(v - b[i])));
}

describe('Jeder Schieber bewegt eine angezeigte Grösse', () => {
  for (const key of PARAM_KEYS_40) {
    if (key in NUR_IN_KOMBINATION) continue;
    it(key, () => {
      const from = ZH.params[key];
      const wirkung = ([0, 1, 2] as ParamValue[])
        .filter(to => to !== from)
        // Diff wie in der App (computeDiff40), damit Begleiteinträge für
        // bedingte Kanten (DIFF_BEGLEITER) enthalten sind.
        .map(to => maxAbweichung(computeDiff40(ZH.params, { ...ZH.params, [key]: to })));
      expect(Math.max(...wirkung)).toBeGreaterThan(SICHTBAR);
    });
  }

  it('mietrecht_durchsetzung wirkt, sobald die Miete steigt (Index auf LIK): der Deckel wird vollzogen', () => {
    const lik: ParamsDiff40 = { mietrecht_mietzinsindex: { from: ZH.params.mietrecht_mietzinsindex, to: 1 } };
    const mitDurchsetzung: ParamsDiff40 = {
      ...lik,
      mietrecht_durchsetzung: { from: ZH.params.mietrecht_durchsetzung, to: 2 },
    };
    expect(maxAbweichung(mitDurchsetzung, lik)).toBeGreaterThan(SICHTBAR);
  });

  it('die Ausnahmeliste enthält nur Schieber, die allein wirklich nichts bewegen', () => {
    for (const key of Object.keys(NUR_IN_KOMBINATION) as Array<keyof CityParams40>) {
      const from = ZH.params[key];
      for (const to of ([0, 1, 2] as ParamValue[]).filter(t => t !== from)) {
        expect(maxAbweichung({ [key]: { from, to } }), key).toBeLessThan(SICHTBAR);
      }
    }
  });
});
