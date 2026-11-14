/**
 * gruppen-divergenz.test.ts — Fachliche Tests für Bevölkerungsgruppen
 *
 * Validiert die Preistrends pro Gruppe, insbesondere die Divergenz
 * zwischen Bestandsmietern und Neumietern bei hoher Regulierung.
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline } from '../../compute-phases';
import { computeGroupTrends } from '../../groups';
import type { CityContext, ParamsDiff40 } from '../../../types';

const ANGESPANNT_CONTEXT: CityContext = {
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
  marktenge: 2,  mietbelastungs_grenze: 1,
};

describe('Gruppen-Divergenz: Bestand vs. Angebot', () => {
  it('Bei strenger Regulierung steigen Bestandsmieten weniger stark als Angebotsmieten', () => {
    // Szenario: Hoher Marktdruck + Strenge Regulierung (Wohnschutz)
    const diff: ParamsDiff40 = {
      mietrecht_kostenmiete: { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
      nutzung_abbruchverbot: { from: 1, to: 2 },
    };

    const results = [...computePhasePipeline(ANGESPANNT_CONTEXT, diff)];
    const phase2 = results[1];
    const trends = computeGroupTrends(phase2.marketState);
    
    const bestand = trends.find(t => t.group.id === 'normalverdiener_bestand')!;
    const angebot = trends.find(t => t.group.id === 'normalverdiener_angebot')!;
    
    // Erwartung: Angebotspreis-Trend ist höher als Bestandspreis-Trend
    expect(angebot.value).toBeGreaterThan(bestand.value);
    
    // Erwartung: Bestand profitiert von Schutz
    expect(bestand.value).toBeLessThan(0.8);
  });

  it('Geringverdiener sind besser geschützt als Normalverdiener (Angebot)', () => {
    const diff: ParamsDiff40 = { mietrecht_kostenmiete: { from: 1, to: 2 } };

    const results = [...computePhasePipeline(ANGESPANNT_CONTEXT, diff)];
    const trends = computeGroupTrends(results[0].marketState);
    
    const gering = trends.find(t => t.group.id === 'geringverdiener')!;
    const angebot = trends.find(t => t.group.id === 'normalverdiener_angebot')!;
    
    expect(gering.value).toBeLessThan(angebot.value);
  });
});
