/**
 * gemeinnuetzig-fachlich.test.ts — Fachliche Tests (Research-basiert)
 *
 * Forschung: docs/superpowers/research/gemeinnuetzig-nutzung-parameter-wirkung.md
 *
 * Wichtige empirische Befunde:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Vancouver Empty Homes Tax (EHT): Leerstand 0.90 % (2017) → 0.49 % (2024),
 *    rund 2'900 Wohnungen zurück auf dem Markt (CA-001/CA-003)
 *    → nutzung_kurzzeitvermietung ↑ (Regulierung verschärft)
 *
 * 2. BC Speculation and Vacancy Tax (SVT, provinziell, nicht EHT): 20'000
 *    Condos in Metro Vancouver 2018–2020 zum Mietmarkt (CA-002)
 *    → steuer_leerstandsabgabe ↑, spekulationshemmung ↑
 *
 * 3. NYC LL18: 90% Inserate-Rückgang nach Regulierung; Leerstand und Mieten
 *    ohne messbare Änderung (US-013)
 *    → nutzung_kurzzeitvermietung ↑ stark
 *
 * 4. Barcelona: Airbnb-Aktivität erhöhte die Mieten um 1.9 % und die
 *    Transaktionspreise um 4.6 % (Garcia-López et al. 2020, ES-001).
 *    Effekt der Aktivität, nicht der Regulierung.
 *
 * 5. Gemeinnütziger Anteil 33%+:
 *    → Dämpft Mietpreise durch Wettbewerb
 *    → gentrifizierungsindex sollte sinken
 *
 * Run: npx vitest run src/model/__tests__/fachlich/gemeinnuetzig-fachlich.test.ts
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline, invalidatePhasesCache } from '../../compute-phases';
import type { CityContext, CityParams40, ParamsDiff40 } from '../../../types';

// Zürich-like baseline
// V1: raumplanung=2, bauvorschriften=2, energetischeVorgaben=1, mietrecht=1, steuerpolitik=2,
//      foerderungGemeinnuetzig=2, subventionen=1, einspracherechte=2, infrastruktur=2,
//      auslaendischeInvestitionen=1
const ZUERICH_V2: CityParams40 = {
  raumplanung_zonenreserve: 2, raumplanung_verdichtung: 2, raumplanung_ausnuetzungsziffer: 2,
  boden_vorkaufsrecht: 1, boden_bauverpflichtung: 1, boden_mehrwertabgabe: 1, boden_bodeneigentumssteuer: 1,
  bau_energievorgaben: 1, bau_sanierungspflicht: 1,
  bau_einspracherecht_dritte: 2, bau_einspracherecht_suspensiv: 2,
  bau_bewilligungsverfahren: 2, bau_normenharmonisierung: 2,
  gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_ausgleich: 0, gemeinnuetzig_foerderfonds: 2, gemeinnuetzig_baurecht: 2,
  gemeinnuetzig_belegungsvorschriften: 1, gemeinnuetzig_sozialmischung: 1,
  mietrecht_kostenmiete: 1, mietrecht_anfangsmiete: 1, mietrecht_mietzinstransparenz: 1,
  mietrecht_kuendigungsschutz: 1, mietrecht_mietzinsindex: 1, mietrecht_kriterium: 1, mietrecht_durchsetzung: 0, mietrecht_untervermietung: 1,
  steuer_grundstueckgewinn: 2, steuer_eigenmietwert: 2, steuer_leerstandsabgabe: 1,
  steuer_handaenderung: 2, steuer_kapitalgewinnprivatpersonen: 1,
  kapital_auslaendische_investoren: 1, kapital_institutionelle_regulierung: 1, kapital_hypothekarregulierung: 1,
  nutzung_kurzzeitvermietung: 1, nutzung_umnutzungsverbot: 1, nutzung_abbruchverbot: 1, nutzung_zweitwohnungen: 1,
  infra_oepnv: 2, infra_schule_kita: 2, infra_oeffentlicher_raum: 2, infra_wirtschaftsansiedlung: 2,
    bau_ersatzneubau_effizienz: 1,
};

const ZUERICH_CONTEXT: CityContext = {
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
  marktenge: 2,
};

function phases(_params: CityParams40, context: CityContext, diff: ParamsDiff40) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, diff)];
}

describe('Gemeinnützigkeit: Vancouver EHT (Leerstand −0.4 Prozentpunkte)', () => {
  /**
   * Vancouver Empty Home Tax:
   * - Einführung 2017 (0.5% → 2018 auf 2.5% erhöht)
   * - Leerstand 0.90 % (2017) → 0.49 % (2024), rund 2'900 Wohnungen (CA-001/CA-003)
   * - Die 20'000 Condos (Metro Vancouver 2018–2020) gehören zur provinziellen
   *   Speculation and Vacancy Tax, nicht zur EHT (CA-002)
   *
   * Hinweis: steuer_leerstandsabgabe hat im aktuellen DAG keine direkte
   * Verbindung zu spekulationshemmung. Die Tests hier dokumentieren die
   * erwartete Wirkung (Research-Bedarf für DAG-Kalibrierung).
   */
  it('[FACH] Vancouver EHT: Leerstandsabgabe erhöht spekulationshemmung', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withEHT: ParamsDiff40 = {
      steuer_leerstandsabgabe: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withEHT);

    expect(withDiff[0].marketState.spekulationshemmung)
      .toBeGreaterThan(neutral[0].marketState.spekulationshemmung);
  });

  it('[FACH] Vancouver EHT: spekulationshemmung bleibt hoch über alle Phasen', () => {
    const withEHT: ParamsDiff40 = {
      steuer_leerstandsabgabe: { from: 1, to: 2 },
    };
    const results = phases(ZUERICH_V2, ZUERICH_CONTEXT, withEHT);

    expect(results[2].marketState.spekulationshemmung).toBeGreaterThan(0);
  });
});

describe('Gemeinnützigkeit: NYC LL18 (90% Inserate-Rückgang)', () => {
  /**
   * New York City Local Law 18 (2023):
   * - Airbnb-Inserate −90%
   * - hundreds of hosts left the platform
   *
   * Hinweis: nutzung_kurzzeitvermietung hat im aktuellen DAG keine direkte
   * Verbindung zu verdraengungsrisiko.
   */
  it('[FACH] NYC LL18: Strikte Kurzzeitvermietung senkt verdraengungsrisiko (Research-Bedarf)', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withLL18: ParamsDiff40 = {
      nutzung_kurzzeitvermietung: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withLL18);

    /**
     * DAG-Kalibrierungsbedarf: nutzung_kurzzeitvermietung → verdraengungsrisiko
     * Kante fehlt im aktuellen DAG.
     */
    expect(withDiff[0].marketState.verdraengungsrisiko)
      .toBeLessThan(neutral[0].marketState.verdraengungsrisiko);
  });
});

describe('Gemeinnützigkeit: Barcelona Airbnb-Regulierung Paradox', () => {
  /**
   * Barcelona: Airbnb-Aktivität erhöhte die Mieten um 1.9 % und die
   * Transaktionspreise um 4.6 % (Garcia-López et al. 2020, ES-001). Effekt der
   * Aktivität, nicht der Regulierung; ein «Paradox» zeigt die Studie nicht.
   *
   * Hinweis: nutzung_kurzzeitvermietung hat im aktuellen DAG keine direkte
   * Verbindung zu investitionsattraktivitaet.
   */
  it('[FACH] Barcelona: Strikte Kurzzeitvermietung senkt investitionsattraktivitaet (Research-Bedarf)', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withBarcelona: ParamsDiff40 = {
      nutzung_kurzzeitvermietung: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withBarcelona);

    /**
     * DAG-Kalibrierungsbedarf: nutzung_kurzzeitvermietung → investitionsattraktivitaet
     * Kante fehlt im aktuellen DAG.
     */
    expect(withDiff[0].marketState.investitionsattraktivitaet)
      .toBeLessThan(neutral[0].marketState.investitionsattraktivitaet);
  });
});

describe('Gemeinnütziger Wohnungsbau: Mindestanteil + Baurecht', () => {
  /**
   * Wiener Modell / Zürich: Gemeinnütziger Anteil 33%+:
   * - Dämpft Mietpreise durch Wettbewerb
   * - Gemeinnützige Wohnungen haben 20-40% tiefere Mieten
   *
   * Im Modell:
   * - gemeinnuetzig_mindestanteil ↑ → gemeinnuetzig_kraft ↑ → gentrifizierungsindex ↓
   */
  it('[FACH] Hoher Mindestanteil senkt Gentrifizierungsindex (im Vergleich zu keinem Mindestanteil)', () => {
    const restrictiveBasis: CityParams40 = {
      ...ZUERICH_V2,
      gemeinnuetzig_mindestanteil: 0, gemeinnuetzig_ausgleich: 0,
      gemeinnuetzig_foerderfonds: 0,
      gemeinnuetzig_baurecht: 0,
    };

    const ohneReform = phases(restrictiveBasis, ZUERICH_CONTEXT, {});

    const reformDiff: ParamsDiff40 = {
      gemeinnuetzig_mindestanteil: { from: 0, to: 2 },
      gemeinnuetzig_foerderfonds:  { from: 0, to: 2 },
      gemeinnuetzig_baurecht:      { from: 0, to: 2 },
    };
    const mitReform = phases(restrictiveBasis, ZUERICH_CONTEXT, reformDiff);

    expect(mitReform[0].derived.gentrifizierungsindex)
      .toBeLessThan(ohneReform[0].derived.gentrifizierungsindex);
  });

  it('[FACH] Hoher Mindestanteil erhöht angebotspotenzial über den Foerderfonds-Kanal', () => {
    const ohneFonds: CityParams40 = {
      ...ZUERICH_V2,
      gemeinnuetzig_foerderfonds: 0,
    };

    const ohneReform = phases(ohneFonds, ZUERICH_CONTEXT, {});
    const reformDiff: ParamsDiff40 = {
      gemeinnuetzig_foerderfonds: { from: 0, to: 2 },
    };
    const mitReform = phases(ohneFonds, ZUERICH_CONTEXT, reformDiff);

    expect(mitReform[2].marketState.angebotspotenzial)
      .toBeGreaterThan(ohneReform[2].marketState.angebotspotenzial);
  });
});

describe('Nutzungsregulierung: Abbruchverbot schützt Bestand', () => {
  /**
   * Abbruchverbot: Schützt Wohnraum vor Abriss bei Wohnungsknappheit
   *
   * Im Modell:
   * - nutzung_abbruchverbot ↑ → verdraengungsrisiko ↓
   * - nutzung_abbruchverbot ↑ → angebotspotenzial ↑ (Bestand bleibt)
   */
  it('[FACH] Abbruchverbot senkt Verdraengungsrisiko', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withBan: ParamsDiff40 = {
      nutzung_abbruchverbot: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withBan);

    expect(withDiff[0].marketState.verdraengungsrisiko)
      .toBeLessThan(neutral[0].marketState.verdraengungsrisiko);
  });

  it('[FACH] Abbruchverbot senkt Angebotspotenzial (FHNW: Neubau-Bremse dominiert Bestandsschutz)', () => {
    /**
     * Ursprünglich: Abbruchverbot → angebotspotenzial ↑ (Bestand bleibt)
     *
     * Korrektur per DIW Discussion Paper 2143 (Ters/Kholodilin 2025, nur Genf 1994–2022):
     * Die Wohnungsrationierung (Abbruch-/Umnutzungsverbot) ist die SCHADLICHSTE
     * aller Regulierungsformen für das Angebot:
     * −600 Mio. CHF Bauinvestitionen aggregiert; −400 Mio. CHF institutionelle Neubauinvestitionen.
     * Basel: Baugesuche für Wohnungen −76 % (784 → 190 im Mittel; SRES im
     * Auftrag des SVIT, Interessenvertreter; Ursache laut Regierungsrat offen).
     * Dominanter Effekt: Neubau-Verhinderung überwiegt Bestandserhalt bei weitem.
     */
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withBan: ParamsDiff40 = {
      nutzung_abbruchverbot: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withBan);

    expect(withDiff[0].marketState.angebotspotenzial)
      .toBeLessThan(neutral[0].marketState.angebotspotenzial);
  });
});
