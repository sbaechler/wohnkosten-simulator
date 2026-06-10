/**
 * steuer-kapital-fachlich.test.ts — Fachliche Tests (Research-basiert)
 *
 * Forschung: docs/superpowers/research/steuer-kapital-parameter-wirkung.md
 *
 * Wichtige empirische Befunde:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Grunderwerbsteuer +1%-Punkt → −3% Immobilienpreise (Deutschland)
 *    → steuer_handaenderung ↑ → markfriktion ↑ → fiskalische_wirkung ↓
 *
 * 2. UK Stamp Duty: −20% Mobilität an der £250k Schwelle
 *    → steuer_handaenderung ↑ → markfriktion ↑ stark
 *
 * 3. Singapore ABSD Ausländer: 10% → 60% → deutliche Dämpfung
 *    → kapital_auslaendische_investoren ↑ → nachfragedruck ↓
 *
 * 4. Bodenwertsteuer: Vollständige Kapitalisierung in Bodenpreise
 *    → boden_bodeneigentumssteuer ↑ → aufwertungsdruck ↓
 *
 * 5. MID-Abschaffung (US): Minimaler messbarer Preiseffekt
 *    → Hypothekarzins-Abzug hat wenig Wirkung auf Bodenpreise
 *
 * Run: npx vitest run src/model/__tests__/fachlich/steuer-kapital-fachlich.test.ts
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
  gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_foerderfonds: 2, gemeinnuetzig_baurecht: 2,
  gemeinnuetzig_belegungsvorschriften: 1, gemeinnuetzig_sozialmischung: 1,
  mietrecht_kostenmiete: 1, mietrecht_anfangsmiete: 1, mietrecht_mietzinstransparenz: 1,
  mietrecht_kuendigungsschutz: 1, mietrecht_mietzinsindex: 1, mietrecht_untervermietung: 1,
  steuer_grundstueckgewinn: 2, steuer_eigenmietwert: 2, steuer_leerstandsabgabe: 1,
  steuer_handaenderung: 2, steuer_kapitalgewinnprivatpersonen: 1,
  kapital_auslaendische_investoren: 1, kapital_institutionelle_regulierung: 1, kapital_hypothekarregulierung: 1,
  nutzung_kurzzeitvermietung: 1, nutzung_umnutzungsverbot: 1, nutzung_abbruchverbot: 1, nutzung_zweitwohnungen: 1,
  infra_oepnv: 2, infra_schule_kita: 2, infra_oeffentlicher_raum: 2, infra_wirtschaftsansiedlung: 2,
    bau_ersatzneubau_effizienz: 1,
};

const NEUTRAL_CONTEXT: CityContext = {
  ownershipBaseline: {
    privat: 0.39,
    institutionell: 0.30,
    genossenschaft: 0.175,
    oeffentlich: 0.066
  },
  zinsniveau: 0,
  zuwanderungsdruck: 0,
  wirtschaftskraft: 0,
  bevoelkerungstrend: 0,
  marktenge: 0,  mietbelastungs_grenze: 1,
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
  marktenge: 2,  mietbelastungs_grenze: 1,
};

function phases(_params: CityParams40, context: CityContext, diff: ParamsDiff40) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, diff)];
}

describe('Steuern: Grunderwerbsteuer / Handänderungssteuer', () => {
  /**
   * Deutschland Grunderwerbsteuer +1%-Punkt → −3% Immobilienpreise
   * UK Stamp Duty → −20% Mobilität an der £250k Schwelle
   *
   * Im Modell:
   * - steuer_handaenderung ↑ → markfriktion ↑ (sofort)
   * - steuer_handaenderung ↑ → fiskalische_wirkung ↑ kurzfristig (mehr Einnahmen),
   *   dann ggf. rückläufig wenn Transaktionsvolumen sinkt
   */
  it('[FACH] Handaänderungssteuer-Erhöhung erhöht markfriktion sofort', () => {
    const neutral = phases(ZUERICH_V2, NEUTRAL_CONTEXT, {});

    const withTax: ParamsDiff40 = {
      steuer_handaenderung: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, NEUTRAL_CONTEXT, withTax);

    expect(withDiff[0].marketState.markfriktion)
      .toBeGreaterThan(neutral[0].marketState.markfriktion);
  });

  it('[FACH] Handaänderungssteuer-Erhöhung erhöht spekulationshemmung (Transaktionskosten ↑)', () => {
    const neutral = phases(ZUERICH_V2, NEUTRAL_CONTEXT, {});

    const withTax: ParamsDiff40 = {
      steuer_handaenderung: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, NEUTRAL_CONTEXT, withTax);

    expect(withDiff[0].marketState.spekulationshemmung)
      .toBeGreaterThan(neutral[0].marketState.spekulationshemmung);
  });
});

describe('Kapital: Lex Koller / ABSD Singapore', () => {
  /**
   * Singapore ABSD: 10% → 60% für Ausländer
   * → Deutliche Dämpfung der Auslandsnachfrage
   *
   * Im Modell:
   * - kapital_auslaendische_investoren ↑ → nachfragedruck ↓
   * - kapital_auslaendische_investoren ↑ → investitionsattraktivitaet ↓
   */
  it('[FACH] Verschärfte Lex Koller senkt nachfragedruck', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withLexKoller: ParamsDiff40 = {
      kapital_auslaendische_investoren: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withLexKoller);

    expect(withDiff[0].marketState.nachfragedruck)
      .toBeLessThan(neutral[0].marketState.nachfragedruck);
  });

  it('[FACH] Verschärfte Lex Koller senkt investitionsattraktivitaet', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withLexKoller: ParamsDiff40 = {
      kapital_auslaendische_investoren: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withLexKoller);

    expect(withDiff[0].marketState.investitionsattraktivitaet)
      .toBeLessThan(neutral[0].marketState.investitionsattraktivitaet);
  });
});

describe('Kapital: Hypothekarregulierung (LTV / Tragbarkeit)', () => {
  /**
   * Strenge Hypothekarregulierung (Belehnung ≤ 80%, Tragbarkeitsprüfung):
   * → Dämpft Nachfrage unmittelbar
   * → Reduziert Kaufquote (eigentumsquoten_trend ↓)
   *
   * Im Modell:
   * - kapital_hypothekarregulierung ↑ → nachfragedruck ↓
   * - kapital_hypothekarregulierung ↑ → eigentumsquoten_trend ↓
   */
  it('[FACH] Strenge Hypothekarregulierung senkt nachfragedruck', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withRegulierung: ParamsDiff40 = {
      kapital_hypothekarregulierung: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withRegulierung);

    expect(withDiff[0].marketState.nachfragedruck)
      .toBeLessThan(neutral[0].marketState.nachfragedruck);
  });

  it('[FACH] Strenge Hypothekarregulierung senkt eigentumsquoten_trend', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withRegulierung: ParamsDiff40 = {
      kapital_hypothekarregulierung: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withRegulierung);

    expect(withDiff[0].marketState.eigentumsquoten_trend)
      .toBeLessThan(neutral[0].marketState.eigentumsquoten_trend);
  });
});

describe('Steuern: Kapitalgewinnbesteuerung für Privatpersonen', () => {
  /**
   * Einführung/Erhöhung der Kapitalgewinnbesteuerung:
   * → spekulationshemmung ↑ (Halten wird attraktiver als Handeln)
   * → Transaktionsvolumen sinkt langfristig
   *
   * Im Modell:
   * - steuer_kapitalgewinnprivatpersonen ↑ → spekulationshemmung ↑
   * - steuer_kapitalgewinnprivatpersonen ↑ → markfriktion ↑ (mittelbar)
   */
  it('[FACH] Kapitalgewinnbesteuerung erhöht spekulationshemmung', () => {
    const neutral = phases(ZUERICH_V2, NEUTRAL_CONTEXT, {});

    const withKapGewSt: ParamsDiff40 = {
      steuer_kapitalgewinnprivatpersonen: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, NEUTRAL_CONTEXT, withKapGewSt);

    expect(withDiff[0].marketState.spekulationshemmung)
      .toBeGreaterThan(neutral[0].marketState.spekulationshemmung);
  });
});

describe('Steuern: Grundstückgewinnsteuer (Spekulationsbremse)', () => {
  /**
   * Progressive Grundstückgewinnsteuer (lange Haltung = tiefer Satz):
   * → spekulationshemmung ↑ (kurzfristige Gewinne besteuert)
   * → fiskalische_wirkung kurzfristig positiv (viele Transaktionen bei Spekulation)
   *
   * Im Modell:
   * - steuer_grundstueckgewinn ↑ → spekulationshemmung ↑
   */
  it('[FACH] Hohe Grundstückgewinnsteuer erhöht spekulationshemmung', () => {
    const neutral = phases(ZUERICH_V2, NEUTRAL_CONTEXT, {});

    const withGewSt: ParamsDiff40 = {
      steuer_grundstueckgewinn: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, NEUTRAL_CONTEXT, withGewSt);

    expect(withDiff[0].marketState.spekulationshemmung)
      .toBeGreaterThan(neutral[0].marketState.spekulationshemmung);
  });
});

describe('Steuern: Eigenmietwert → senkt Wohneigentumsnachfrage', () => {
  /**
   * Erhöhter Eigenmietwert:
   * → efteremietwert ↑ → eigentumsquoten_trend ↓
   * → nachfragedruck ↓ (weniger Kaufinteresse)
   *
   * Im Modell:
   * - steuer_eigenmietwert ↑ → eigentumsquoten_trend ↓
   * - steuer_eigenmietwert ↑ → nachfragedruck ↓
   */
  it('[FACH] Hoher Eigenmietwert senkt eigentumsquoten_trend', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withEMW: ParamsDiff40 = {
      steuer_eigenmietwert: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withEMW);

    expect(withDiff[0].marketState.eigentumsquoten_trend)
      .toBeLessThan(neutral[0].marketState.eigentumsquoten_trend);
  });

  it('[FACH] Hoher Eigenmietwert senkt nachfragedruck', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withEMW: ParamsDiff40 = {
      steuer_eigenmietwert: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withEMW);

    expect(withDiff[0].marketState.nachfragedruck)
      .toBeLessThan(neutral[0].marketState.nachfragedruck);
  });
});

describe('Steuern: CH-006 Lex Weber — Zweitwohnungsinitiative paradox', () => {
  /**
   * Ref: docs/recherche/CH/CH-006-lex-weber-fallstudie.md
   *
   * Lex Weber (Volksinitiative, angenommen März 2012, Inkrafttreten Jan. 2016):
   * Beschränkung Zweitwohnungsbau auf 20% in betroffenen Gemeinden.
   *
   * Key Finding: Paradoxer Effekt — Lex Weber schränkte den Bau von
   * Mietwohnungen in betroffenen Gemeinden ein, weil generelle Bauaktivität
   * zurückging. Zweitwohnungspreise stiegen trotz Beschränkung (2021: +10%).
   *
   * Im Modell:
   * - nutzung_zweitwohnungen ↑ → angebotspotenzial ↓ (paradox: weniger Bau overall)
   */
  it('[FACH] CH-006: Zweitwohnungsbeschränkung senkt angebotspotenzial (paradox)', () => {
    const ohneLex: CityParams40 = {
      ...ZUERICH_V2,
      nutzung_zweitwohnungen: 0,
    };
    const ohne = phases(ohneLex, ZUERICH_CONTEXT, {});

    const mitLex: ParamsDiff40 = {
      nutzung_zweitwohnungen: { from: 0, to: 2 },
    };
    const mit = phases(ohneLex, ZUERICH_CONTEXT, mitLex);
    // Lex Weber: Einschränkung → paradoxerweise weniger Gesamtbauaktivität
    expect(mit[2].marketState.angebotspotenzial)
      .toBeLessThan(ohne[2].marketState.angebotspotenzial);
  });
});

describe('Steuern: AT-002 — Gemeinnütziger Wohnbau dämpft Mietpreise', () => {
  /**
   * Ref: docs/recherche/AT/AT-002-wifo-gemeinnuetziger-wohnbau-preisdaempfung.md
   *
   * WIFO-Studie (2023): Gemeinnütziger Wohnbau dämpft Mietpreise auch im
   * privaten Sektor durch Konkurrenz-Effekt ("Public Option").
   * Wien: Gemeindewohnung €5.10/m² vs. Privatmarkt deutlich höher.
   * 60% aller Wiener Wohnungen sozial/gemeinnützig → strukturelle Marktdämpfung.
   *
   * Im Modell:
   * - gemeinnuetzig_mindestanteil ↑ → mietpreis_schutzlevel ↑
   * - gemeinnuetzig_kraft ↑ → nachfragedruck ↓ (Konkurrenzeffekt)
   */
  it('[FACH] AT-002: Hoher Gemeinnützig-Anteil senkt nachfragedruck', () => {
    const ohneGemeinnuetzig: CityParams40 = {
      ...ZUERICH_V2,
      gemeinnuetzig_mindestanteil: 0,
      gemeinnuetzig_foerderfonds: 0,
      gemeinnuetzig_baurecht: 0,
    };
    const ohne = phases(ohneGemeinnuetzig, ZUERICH_CONTEXT, {});

    const mitGemeinnuetzig: ParamsDiff40 = {
      gemeinnuetzig_mindestanteil: { from: 0, to: 2 },
      gemeinnuetzig_foerderfonds:  { from: 0, to: 2 },
      gemeinnuetzig_baurecht:      { from: 0, to: 2 },
    };
    const mit = phases(ohneGemeinnuetzig, ZUERICH_CONTEXT, mitGemeinnuetzig);
    // Grosser Gemeinnützig-Sektor → Konkurrenz dämpft Privatmarktnachfrage
    expect(mit[0].marketState.nachfragedruck)
      .toBeLessThan(ohne[0].marketState.nachfragedruck);
  });
});

