/**
 * gruppen-divergenz.test.ts — Fachliche Tests für Bevölkerungsgruppen
 *
 * Validiert die Preistrends pro Gruppe, insbesondere die Divergenz
 * zwischen Bestandsmietern und Neumietern bei hoher Regulierung.
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline } from '../../compute-phases';
import { computeGroupTrends } from '../../groups';
import type { CityContext, CityParams40, ParamValue } from '../../../types';

const NEUTRAL_PARAMS: CityParams40 = {
  raumplanung_zonenreserve: 1 as ParamValue, raumplanung_verdichtung: 1 as ParamValue, raumplanung_ausnuetzungsziffer: 1 as ParamValue,
  boden_vorkaufsrecht: 1 as ParamValue, boden_bauverpflichtung: 1 as ParamValue, boden_mehrwertabgabe: 1 as ParamValue, boden_bodeneigentumssteuer: 1 as ParamValue,
  bau_energievorgaben: 1 as ParamValue, bau_sanierungspflicht: 1 as ParamValue,
  bau_einspracherecht_dritte: 1 as ParamValue, bau_einspracherecht_suspensiv: 1 as ParamValue,
  bau_bewilligungsverfahren: 1 as ParamValue, bau_normenharmonisierung: 1 as ParamValue,
  gemeinnuetzig_mindestanteil: 1 as ParamValue, gemeinnuetzig_foerderfonds: 1 as ParamValue, gemeinnuetzig_baurecht: 1 as ParamValue,
  gemeinnuetzig_belegungsvorschriften: 1 as ParamValue, gemeinnuetzig_sozialmischung: 1 as ParamValue,
  mietrecht_kostenmiete: 1 as ParamValue, mietrecht_anfangsmiete: 1 as ParamValue, mietrecht_mietzinstransparenz: 1 as ParamValue,
  mietrecht_kuendigungsschutz: 1 as ParamValue, mietrecht_mietzinsindex: 1 as ParamValue, mietrecht_untervermietung: 1 as ParamValue,
  steuer_grundstueckgewinn: 1 as ParamValue, steuer_eigenmietwert: 1 as ParamValue, steuer_leerstandsabgabe: 1 as ParamValue,
  steuer_handaenderung: 1 as ParamValue, steuer_kapitalgewinnprivatpersonen: 1 as ParamValue,
  kapital_auslaendische_investoren: 1 as ParamValue, kapital_institutionelle_regulierung: 1 as ParamValue, kapital_hypothekarregulierung: 1 as ParamValue,
  nutzung_kurzzeitvermietung: 1 as ParamValue, nutzung_umnutzungsverbot: 1 as ParamValue, nutzung_abbruchverbot: 1 as ParamValue, nutzung_zweitwohnungen: 1 as ParamValue,
  infra_oepnv: 1 as ParamValue, infra_schule_kita: 1 as ParamValue, infra_oeffentlicher_raum: 1 as ParamValue, infra_wirtschaftsansiedlung: 1 as ParamValue,
  bau_ersatzneubau_effizienz: 1 as ParamValue,
};

const ANGESPANNT_CONTEXT: CityContext = {
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 2,
  marktenge: 2,  mietbelastungs_grenze: 1,
};

describe('Gruppen-Divergenz: Bestand vs. Angebot', () => {
  it('Bei strenger Regulierung steigen Bestandsmieten weniger stark als Angebotsmieten', () => {
    // Szenario: Hoher Marktdruck + Strenge Regulierung (Wohnschutz)
    const params = { ...NEUTRAL_PARAMS };
    const modified: CityParams40 = { 
      ...params,
      mietrecht_kostenmiete: 2 as ParamValue,
      mietrecht_kuendigungsschutz: 2 as ParamValue,
      nutzung_abbruchverbot: 2 as ParamValue
    };
    
    const results = [...computePhasePipeline(ANGESPANNT_CONTEXT, modified, {})];
    const phase2 = results[1];
    const trends = computeGroupTrends(phase2.marketState, params, modified);
    
    const bestand = trends.find(t => t.group.id === 'normalverdiener_bestand')!;
    const angebot = trends.find(t => t.group.id === 'normalverdiener_angebot')!;
    
    // Erwartung: Angebotspreis-Trend ist höher als Bestandspreis-Trend
    expect(angebot.value).toBeGreaterThan(bestand.value);
    
    // Erwartung: Bestand profitiert von Schutz
    expect(bestand.value).toBeLessThan(0.8);
  });

  it('Geringverdiener sind besser geschützt als Normalverdiener (Angebot)', () => {
    const params = { ...NEUTRAL_PARAMS };
    const modified: CityParams40 = { ...params, mietrecht_kostenmiete: 2 as ParamValue };
    
    const results = [...computePhasePipeline(ANGESPANNT_CONTEXT, modified, {})];
    const trends = computeGroupTrends(results[0].marketState, params, modified);
    
    const gering = trends.find(t => t.group.id === 'geringverdiener')!;
    const angebot = trends.find(t => t.group.id === 'normalverdiener_angebot')!;
    
    expect(gering.value).toBeLessThan(angebot.value);
  });
});
