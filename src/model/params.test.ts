import { describe, it, expect } from 'vitest';
import { computeDiff40, hasChanges40 } from './params';
import type { CityParams40 } from '../types';

// V2 baseline (entspricht Zürich: raumplanung=2, bauvorschriften=2, energetischeVorgaben=1,
// mietrecht=1, steuerpolitik=2, foerderungGemeinnuetzig=2, subventionen=1,
// einspracherechte=2, infrastruktur=2, auslaendischeInvestitionen=1)
const baseV2: CityParams40 = {
  raumplanung_zonenreserve: 2, raumplanung_verdichtung: 2, raumplanung_ausnuetzungsziffer: 2,
  boden_vorkaufsrecht: 1, boden_bauverpflichtung: 1, boden_mehrwertabgabe: 1, boden_bodeneigentumssteuer: 1,
  bau_energievorgaben: 1, bau_sanierungspflicht: 1,
  bau_einspracherecht_dritte: 2, bau_einspracherecht_suspensiv: 2,
  bau_bewilligungsverfahren: 2, bau_normenharmonisierung: 2,
  gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_foerderfonds: 2, gemeinnuetzig_baurecht: 2,
  gemeinnuetzig_belegungsvorschriften: 1, gemeinnuetzig_sozialmischung: 1,
  mietrecht_kostenmiete: 1, mietrecht_anfangsmiete: 1, mietrecht_mietzinstransparenz: 1,
  mietrecht_kuendigungsschutz: 1, mietrecht_mietzinsindex: 1, mietrecht_untervermietung: 1,
  steuer_grundstueckgewinn: 2, steuer_eigenmietwert: 2, steuer_leerstandsabgabe: 1,
  steuer_handaenderung: 2, steuer_kapitalgewinnprivatpersonen: 1,
  kapital_auslaendische_investoren: 1, kapital_institutionelle_regulierung: 1, kapital_hypothekarregulierung: 1,
  nutzung_kurzzeitvermietung: 1, nutzung_umnutzungsverbot: 1, nutzung_abbruchverbot: 1, nutzung_zweitwohnungen: 1,
  infra_oepnv: 2, infra_schule_kita: 2, infra_oeffentlicher_raum: 2, infra_wirtschaftsansiedlung: 2,
    bau_ersatzneubau_effizienz: 1,};

describe('V2 — computeDiff40 / hasChanges40', () => {
  it('returns empty diff when identical', () => {
    expect(computeDiff40(baseV2, { ...baseV2 })).toEqual({});
  });

  it('returns only changed params', () => {
    const modified: CityParams40 = {
      ...baseV2,
      mietrecht_kostenmiete: 2,
      infra_oepnv: 0,
    };
    const diff = computeDiff40(baseV2, modified);
    expect(diff).toEqual({
      mietrecht_kostenmiete: { from: 1, to: 2 },
      infra_oepnv: { from: 2, to: 0 },
    });
  });

  it('hasChanges40 returns correct boolean', () => {
    expect(hasChanges40(baseV2, { ...baseV2 })).toBe(false);
    expect(hasChanges40(baseV2, { ...baseV2, raumplanung_zonenreserve: 0 as const })).toBe(true);
  });
});
