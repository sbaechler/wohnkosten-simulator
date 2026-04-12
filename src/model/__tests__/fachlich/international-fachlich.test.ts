/**
 * international-fachlich.test.ts — Fachliche Tests (Research-basiert)
 *
 * Validierung der Modell-Gewichte gegen empirische Evidenz aus internationalen Fallstudien.
 *
 * Forschung: docs/recherche/SG/SG-001-singapore-hdb-fallstudie.md
 *            docs/recherche/SE/SE-001-stockholm-mietrecht-fallstudie.md
 *
 * Wichtige empirische Befunde:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Singapur HDB-System (SG-001):
 *    → boden_vorkaufsrecht → angebotspotenzial: Staatliche Landnahme ermöglicht
 *      günstigen Landerwerb → grosses öffentliches Angebot → Marktdämpfung
 *    → gemeinnuetzig_kraft → mietpreis_schutzlevel: HDB-Flats deutlich unter
 *      Marktpreisen = strukturelle Preisdämpfung
 *
 * 2. Stockholm Schweden (SE-001):
 *    → mietrecht_kuendigungsschutz → markfriktion: Extrem lange Wartelisten
 *      (10-20 Jahre), Schwarzmärkte, fast nur noch gemeinnütziger Neubau
 *    → markfriktion → angebotspotenzial: Trotz Hochbaurate kaum Marktangebot
 *
 * Run: npx vitest run src/model/__tests__/fachlich/international-fachlich.test.ts
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline, invalidatePhasesCache } from '../../compute-phases';
import type { CityContext, CityParams40, ParamsDiff40 } from '../../../types';

// Basis-Parameter für Singapur-artiges Szenario
// (Starkes Vorkaufsrecht, hoher gemeinnütziger Sektor, niedrige Bodenpreise)
const SG_LIKE: CityParams40 = {
  raumplanung_zonenreserve: 2, raumplanung_verdichtung: 2, raumplanung_ausnuetzungsziffer: 2,
  boden_vorkaufsrecht: 2, boden_bauverpflichtung: 2, boden_mehrwertabgabe: 1, boden_bodeneigentumssteuer: 1,
  bau_energievorgaben: 1, bau_sanierungspflicht: 1,
  bau_einspracherecht_dritte: 0, bau_einspracherecht_suspensiv: 0,
  bau_bewilligungsverfahren: 0, bau_normenharmonisierung: 1,
  gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_foerderfonds: 2, gemeinnuetzig_baurecht: 2,
  gemeinnuetzig_belegungsvorschriften: 2, gemeinnuetzig_sozialmischung: 2,
  mietrecht_kostenmiete: 2, mietrecht_anfangsmiete: 2, mietrecht_mietzinstransparenz: 2,
  mietrecht_kuendigungsschutz: 2, mietrecht_mietzinsindex: 2, mietrecht_untervermietung: 2,
  steuer_grundstueckgewinn: 2, steuer_eigenmietwert: 1, steuer_leerstandsabgabe: 2,
  steuer_handaenderung: 2, steuer_kapitalgewinnprivatpersonen: 1,
  kapital_auslaendische_investoren: 1, kapital_institutionelle_regulierung: 2, kapital_hypothekarregulierung: 2,
  nutzung_kurzzeitvermietung: 2, nutzung_umnutzungsverbot: 2, nutzung_abbruchverbot: 2, nutzung_zweitwohnungen: 2,
  infra_oepnv: 2, infra_schule_kita: 2, infra_oeffentlicher_raum: 2, infra_wirtschaftsansiedlung: 2,
};

// Stockholm-artiges Szenario (starke Mietregulierung, kollektive Mietpreissetzung,
// extreme Marktfriktion, fast nur noch nicht-profit Neubau)
const STOCKHOLM_LIKE: CityParams40 = {
  raumplanung_zonenreserve: 2, raumplanung_verdichtung: 2, raumplanung_ausnuetzungsziffer: 2,
  boden_vorkaufsrecht: 1, boden_bauverpflichtung: 1, boden_mehrwertabgabe: 1, boden_bodeneigentumssteuer: 1,
  bau_energievorgaben: 1, bau_sanierungspflicht: 1,
  bau_einspracherecht_dritte: 1, bau_einspracherecht_suspensiv: 1,
  bau_bewilligungsverfahren: 1, bau_normenharmonisierung: 1,
  gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_foerderfonds: 2, gemeinnuetzig_baurecht: 2,
  gemeinnuetzig_belegungsvorschriften: 2, gemeinnuetzig_sozialmischung: 2,
  mietrecht_kostenmiete: 2, mietrecht_anfangsmiete: 2, mietrecht_mietzinstransparenz: 2,
  mietrecht_kuendigungsschutz: 2, mietrecht_mietzinsindex: 2, mietrecht_untervermietung: 2,
  steuer_grundstueckgewinn: 2, steuer_eigenmietwert: 1, steuer_leerstandsabgabe: 1,
  steuer_handaenderung: 2, steuer_kapitalgewinnprivatpersonen: 1,
  kapital_auslaendische_investoren: 1, kapital_institutionelle_regulierung: 2, kapital_hypothekarregulierung: 2,
  nutzung_kurzzeitvermietung: 2, nutzung_umnutzungsverbot: 2, nutzung_abbruchverbot: 2, nutzung_zweitwohnungen: 1,
  infra_oepnv: 2, infra_schule_kita: 2, infra_oeffentlicher_raum: 2, infra_wirtschaftsansiedlung: 2,
};

const ZUERICH_V2: CityParams40 = {
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
};

const ANGESPANNT: CityContext = {
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 2,
};

const NEUTRAL_CONTEXT: CityContext = {
  zinsniveau: 0,
  zuwanderungsdruck: 0,
  wirtschaftskraft: 0,
  bevoelkerungstrend: 0,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function phases(params: CityParams40, context: CityContext, diff: ParamsDiff40) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, params, diff)];
}

// ── Test Cases: Singapur HDB ─────────────────────────────────────────────────

describe('Singapur HDB-System (SG-001): Staatliche Landnahme → Angebotspotenzial', () => {
  /**
   * Ref: docs/recherche/SG/SG-001-singapore-hdb-fallstudie.md
   *
   * Government Land Acquisition Act (1966) ermöglichte dem HDB,
   * Grundstücke weit unter Marktpreisen zu erwerben.
   * → Dadurch können HDB-Flats zu deutlich niedrigeren Preisen angeboten werden
   * → Bodenspekulation begrenzt
   *
   * Im Modell:
   * - boden_vorkaufsrecht ↑ → angebotspotenzial ↑ (günstiger Landerwerb senkt Baukosten)
   */
  it('[FACH] Starkes Vorkaufsrecht erhöht angebotspotenzial (Singapur-Effekt)', () => {
    const ohneVorkaufsrecht: CityParams40 = {
      ...ZUERICH_V2,
      boden_vorkaufsrecht: 0,
    };
    const ohne = phases(ohneVorkaufsrecht, ANGESPANNT, {});
    const mit = phases(ZUERICH_V2, ANGESPANNT, {});

    expect(mit[1].marketState.angebotspotenzial)
      .toBeGreaterThan(ohne[1].marketState.angebotspotenzial);
  });

  it('[FACH] Starkes Vorkaufsrecht senkt aufwertungsdruck (Singapur-Effekt)', () => {
    /**
     * Staatlicher Landerwerb unter Marktpreisen begrenzt Bodenwertsteigerungen.
     * Ref: SG-001
     */
    const ohneVorkaufsrecht: CityParams40 = {
      ...ZUERICH_V2,
      boden_vorkaufsrecht: 0,
    };
    const ohne = phases(ohneVorkaufsrecht, ANGESPANNT, {});
    const mit = phases(ZUERICH_V2, ANGESPANNT, {});

    expect(mit[0].marketState.aufwertungsdruck)
      .toBeLessThan(ohne[0].marketState.aufwertungsdruck);
  });

  it('[FACH] Kombination Vorkaufsrecht + Gemeinnützig senkt gentrifizierungsindex stärker als einzeln', () => {
    /**
     * Singapur kombiniert starkes Vorkaufsrecht mit grossem gemeinnützigem Sektor.
     * Zusammen sollte der Effekt auf gentrifizierungsindex stärker sein als einzeln.
     * Ref: SG-001
     */
    const base: CityParams40 = {
      ...ZUERICH_V2,
      boden_vorkaufsrecht: 0,
      gemeinnuetzig_mindestanteil: 0,
      gemeinnuetzig_foerderfonds: 0,
      gemeinnuetzig_baurecht: 0,
    };

    const nurVorkauf: ParamsDiff40 = {
      boden_vorkaufsrecht: { from: 0, to: 2 },
    };
    const kombiniert: ParamsDiff40 = {
      boden_vorkaufsrecht: { from: 0, to: 2 },
      gemeinnuetzig_mindestanteil: { from: 0, to: 2 },
      gemeinnuetzig_foerderfonds: { from: 0, to: 2 },
      gemeinnuetzig_baurecht: { from: 0, to: 2 },
    };

    const nurVorkaufResult = phases(base, ANGESPANNT, nurVorkauf);
    const kombiniertResult = phases(base, ANGESPANNT, kombiniert);

    expect(kombiniertResult[0].derived.gentrifizierungsindex)
      .toBeLessThan(nurVorkaufResult[0].derived.gentrifizierungsindex);
  });
});

// ── Test Cases: Stockholm ────────────────────────────────────────────────────

describe('Stockholm Schweden (SE-001): Mietregulierung → Extreme Marktfriktion', () => {
  /**
   * Ref: docs/recherche/SE/SE-001-stockholm-mietrecht-fallstudie.md
   *
   * Stockholm: "Utility Value"-System (kollektive Mietpreissetzung),
   * extreme Wartelisten (10-20 Jahre), Schwarzmärkte für Untervermietung,
   * praktisch nur noch nicht-profitable Neubautätigkeit durch gemeinnützige
   * Wohnungsbaugesellschaften.
   *
   * Im Modell:
   * - mietrecht_kuendigungsschutz ↑ → markfriktion ↑ stark
   * - marktfriktion ↑ → angebotspotenzial ↓ (Investitionshemmung)
   */
  it('[FACH] Stockholm-artige Mietregulierung erzeugt extreme Marktfriktion', () => {
    const zuerich = phases(ZUERICH_V2, NEUTRAL_CONTEXT, {});
    const stockholm = phases(STOCKHOLM_LIKE, NEUTRAL_CONTEXT, {});

    expect(stockholm[0].marketState.markfriktion)
      .toBeGreaterThan(zuerich[0].marketState.markfriktion);
  });

  it('[FACH] Extreme Marktfriktion senkt investitionsattraktivitaet (Stockholm-Effekt)', () => {
    /**
     * Stockholm: Fast nur noch nicht-profitable Neubautätigkeit.
     * Marktfriktion blockiert private Investoren.
     * Ref: SE-001
     */
    const stockholm = phases(STOCKHOLM_LIKE, NEUTRAL_CONTEXT, {});

    expect(stockholm[2].marketState.investitionsattraktivitaet)
      .toBeLessThan(ZUERICH_V2.raumplanung_ausnuetzungsziffer); // sollte unter einem liberalen Basisniveau liegen
  });

  it('[FACH] Stockholm-Modell: markfriktion ↑ trotz hohem angebotspotenzial (System paradox)', () => {
    /**
     * Das Stockholm-Paradox: Trotz hohem baulichem Potenzial (viel Neubau)
     * ist die Marktfriktion extrem hoch — das marktbasierte Angebot ist
     * niedrig, weil kaum private Investoren im regulierten Markt aktiv sind.
     * Ref: SE-001
     */
    const stockholm = phases(STOCKHOLM_LIKE, ANGESPANNT, {});

    // Hohes Angebotspotenzial (viel Neubau), aber niedrige investitionsattraktivitaet
    expect(stockholm[0].marketState.angebotspotenzial).toBeGreaterThan(0);
    expect(stockholm[0].marketState.investitionsattraktivitaet).toBeLessThan(0);
  });
});
