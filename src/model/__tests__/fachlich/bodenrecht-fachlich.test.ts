/**
 * bodenrecht-fachlich.test.ts — Fachliche Tests (Research-basiert)
 *
 * Forschung: docs/superpowers/research/bodenrecht-parameter-wirkung.md
 *            docs/superpowers/research/bau-planungs-parameter-wirkung.md
 *
 * Wichtige empirische Befunde:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Minneapolis 2040 Upzoning: Preise −16–34% nach 5 Jahren
 *    → raumplanung_ausnuetzungsziffer 0→2 über 5 Jahre (P2→P3)
 *
 * 2. Auckland Unitary Plan: Mieten −14–35% (3–7 Jahre)
 *    → raumplanung_ausnuetzungsziffer, raumplanung_verdichtung, bau_bewilligungsverfahren
 *
 * 3. Zürich (Büchler & Lutz 2024): +9% Wohnungen, keine Mietpreiserhöhung
 *    → Moderate Upzoning + gute Bewilligungsverfahren
 *
 * 4. Land Value Tax / Bodensteuer: Vollständige Kapitalisierung in Bodenpreise
 *    → boden_bodeneigentumssteuer ↑ → aufwertungsdruck ↓ (Bodenpreise sinken)
 *
 * 5. Inclusionary Zoning: Gemischte Ergebnisse; Policy-Design entscheidend
 *    → Upzoning mit Sozialmischungsauflage kann Aufwertungsdruck dämpfen
 *
 * Run: npx vitest run src/model/__tests__/fachlich/bodenrecht-fachlich.test.ts
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
    markt_mietbelastungs_grenze: 1,
};

// Lockere Baseline (lockere Zonen: AZ=0, Verdichtung=0)
const LOCKERE_BASIS: CityParams40 = {
  ...ZUERICH_V2,
  raumplanung_ausnuetzungsziffer: 0,
  raumplanung_verdichtung: 0,
  bau_bewilligungsverfahren: 0,
};

const ZUERICH_CONTEXT: CityContext = {
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 2,
  marktenge: 2,
};

const NEUTRAL_CONTEXT: CityContext = {
  zinsniveau: 0,
  zuwanderungsdruck: 0,
  wirtschaftskraft: 0,
  bevoelkerungstrend: 0,
  marktenge: 0,
};

function phases(params: CityParams40, context: CityContext, diff: ParamsDiff40) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, params, diff)];
}

describe('Bodenrecht: Minneapolis 2040 Upzoning (−16–34% Preise nach 5 Jahren)', () => {
  /**
   * Minneapolis Upzoning (2040 Plan):
   * - Zonen von Ein-/Zweifamilienhäusern → Mehrfamilienhäuser
   * - Preise −16–34% nach 5 Jahren
   * - Effekt braucht Zeit: P1 gering, P2+P3 stark
   *
   * Im Modell:
   * - raumplanung_ausnuetzungsziffer: 0→2 (+1 in der Skala)
   * - Erwartung: angebotspotenzial steigt über P1→P3
   * - neubau_hemmnisindex sinkt (invertiert von angebotspotenzial)
   * - Aufwertungsdruck kurzfristig hoch (Bodenpreiserwartungen),
   *   langfristig gedämpft wenn Angebot tatsächlich kommt
   */
  it('[FACH] Upzoning (AZ 0→2): angebotspotenzial in Phase 3 höher als ohne Reform', () => {
    const ohneReform = phases(LOCKERE_BASIS, ZUERICH_CONTEXT, {});

    const upzoningDiff: ParamsDiff40 = {
      raumplanung_ausnuetzungsziffer: { from: 0, to: 2 },
      raumplanung_verdichtung:         { from: 0, to: 2 },
    };
    const mitReform = phases(LOCKERE_BASIS, ZUERICH_CONTEXT, upzoningDiff);

    expect(mitReform[2].marketState.angebotspotenzial)
      .toBeGreaterThan(ohneReform[2].marketState.angebotspotenzial);
  });

  it('[FACH] Upzoning: neubau_hemmnisindex sinkt langfristig (mehr Angebot = weniger Hemnis)', () => {
    const ohneReform = phases(LOCKERE_BASIS, ZUERICH_CONTEXT, {});
    const upzoningDiff: ParamsDiff40 = {
      raumplanung_ausnuetzungsziffer: { from: 0, to: 2 },
      raumplanung_verdichtung:         { from: 0, to: 2 },
    };
    const mitReform = phases(LOCKERE_BASIS, ZUERICH_CONTEXT, upzoningDiff);

    expect(mitReform[2].derived.neubau_hemmnisindex)
      .toBeLessThan(ohneReform[2].derived.neubau_hemmnisindex);
  });

  it('[FACH] Upzoning: aufwertungsdruck steigt durch AZ-Erhöhung (kurzfristig)', () => {
    const ohneReform = phases(LOCKERE_BASIS, ZUERICH_CONTEXT, {});
    const upzoningDiff: ParamsDiff40 = {
      raumplanung_ausnuetzungsziffer: { from: 0, to: 2 },
      raumplanung_verdichtung:         { from: 0, to: 2 },
    };
    const mitReform = phases(LOCKERE_BASIS, ZUERICH_CONTEXT, upzoningDiff);

    expect(mitReform[0].marketState.aufwertungsdruck)
      .toBeGreaterThan(ohneReform[0].marketState.aufwertungsdruck);
  });
});

describe('Bodenrecht: Bodensteuer / Land Value Tax → senkt Aufwertungsdruck', () => {
  /**
   * Forschung Dänemark: Bodensteuer → vollständige Kapitalisierung in Bodenpreisen
   * Hohe Bodensteuer macht Horten unrentabel → Bodenpreise sinken
   *
   * Im Modell:
   * - boden_bodeneigentumssteuer ↑ → aufwertungsdruck ↓
   * - boden_bodeneigentumssteuer ↑ → spekulationshemmung ↑ (Horten wird besteuert)
   */
  it('[FACH] Bodensteuer-Erhöhung senkt aufwertungsdruck', () => {
    const neutral = phases(ZUERICH_V2, NEUTRAL_CONTEXT, {});

    const withLVT: ParamsDiff40 = {
      boden_bodeneigentumssteuer: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, NEUTRAL_CONTEXT, withLVT);

    expect(withDiff[0].marketState.aufwertungsdruck)
      .toBeLessThan(neutral[0].marketState.aufwertungsdruck);
  });

  it('[FACH] Bodensteuer-Erhöhung erhöht spekulationshemmung (Horten wird besteuert)', () => {
    const neutral = phases(ZUERICH_V2, NEUTRAL_CONTEXT, {});

    const withLVT: ParamsDiff40 = {
      boden_bodeneigentumssteuer: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, NEUTRAL_CONTEXT, withLVT);

    expect(withDiff[0].marketState.spekulationshemmung)
      .toBeGreaterThan(neutral[0].marketState.spekulationshemmung);
  });
});

describe('Bau: Auckland Unitary Plan (−14–35% Mieten, 3–7 Jahre)', () => {
  /**
   * Auckland: Umfassende Aufzonung + Verfahrenseffizienz
   * → Baugenehmigungen "skyrocketed"
   * → Mieten −14–35% über 3–7 Jahre
   *
   * Im Modell: kombinierte Verbesserung von
   * - raumplanung_ausnuetzungsziffer
   * - raumplanung_verdichtung
   * - bau_bewilligungsverfahren
   */
  it('[FACH] Auckland-Szenario: kombinierte Reform erhöht Angebotspotenzial deutlich', () => {
    const lockedBasis: CityParams40 = {
      ...ZUERICH_V2,
      raumplanung_ausnuetzungsziffer: 0,
      raumplanung_verdichtung: 0,
      bau_bewilligungsverfahren: 0,
    };

    const ohneReform = phases(lockedBasis, ZUERICH_CONTEXT, {});

    const aucklandDiff: ParamsDiff40 = {
      raumplanung_ausnuetzungsziffer: { from: 0, to: 2 },
      raumplanung_verdichtung:         { from: 0, to: 2 },
      bau_bewilligungsverfahren:       { from: 0, to: 2 },
    };
    const mitReform = phases(lockedBasis, ZUERICH_CONTEXT, aucklandDiff);

    expect(mitReform[2].marketState.angebotspotenzial)
      .toBeGreaterThan(ohneReform[2].marketState.angebotspotenzial);
  });
});

describe('Bau: Einspracherechte verzögern Angebot (Forschungs-Befund)', () => {
  /**
   * Forschung: Einspracherechte sind stark verzögernd auf das Angebot.
   * - Jedermann-Einspracherecht → längere Verfahrensdauer
   * - Suspensiveffekt → Projekt-Stopp möglich
   *
   * Im Modell:
   * - bau_einspracherecht_dritte ↑ → angebotspotenzial ↓
   * - bau_einspracherecht_suspensiv ↑ → angebotspotenzial ↓ (noch stärker)
   */
  it('[FACH] Jedermann-Einspracherecht senkt Angebotspotenzial', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withEinspracherecht: ParamsDiff40 = {
      bau_einspracherecht_dritte: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withEinspracherecht);

    expect(withDiff[0].marketState.angebotspotenzial)
      .toBeLessThan(neutral[0].marketState.angebotspotenzial);
  });

  it('[FACH] Suspensiveffekt senkt Angebotspotenzial stärker als nur Dritte-Einsprache', () => {
    const withDritte: ParamsDiff40 = {
      bau_einspracherecht_dritte: { from: 1, to: 2 },
    };
    const withSuspensiv: ParamsDiff40 = {
      bau_einspracherecht_suspensiv: { from: 1, to: 2 },
    };

    const dritte  = phases(ZUERICH_V2, ZUERICH_CONTEXT, withDritte);
    const susp    = phases(ZUERICH_V2, ZUERICH_CONTEXT, withSuspensiv);

    expect(susp[0].marketState.angebotspotenzial)
      .toBeLessThan(dritte[0].marketState.angebotspotenzial);
  });
});

describe('Bodenrecht: CH-007 BWO Raumplanung — Zonenreserve dämpft Kostenanstieg', () => {
  /**
   * Ref: docs/recherche/CH/CH-007-bwo-raumplanung-wohnkosten-2023.md
   *
   * BWO/CRED-Studie: Mieten CH 2000–2021 +30%, Wohneigentum +80%.
   * In Regionen mit mehr Bauland steigen Kosten bei Nachfrageanstieg weniger stark.
   * Lange Bewilligungs- und Einspracheverfahren tragen zur Kostensteigerung bei.
   *
   * Im Modell:
   * - raumplanung_zonenreserve ↑ → nachfragedruck ↓ (reagiert auf Anspannung)
   * - raumplanung_zonenreserve ↑ → angebotspotenzial ↑ (Baulandoffensive)
   */
  it('[FACH] CH-007: Mehr Zonenreserve senkt langfristig den nachfragedruck', () => {
    const basis: CityParams40 = {
      ...ZUERICH_V2,
      raumplanung_zonenreserve: 0,
    };
    const ohne = phases(basis, ZUERICH_CONTEXT, {});

    const mitReserve: ParamsDiff40 = {
      raumplanung_zonenreserve: { from: 0, to: 2 },
    };
    const mit = phases(basis, ZUERICH_CONTEXT, mitReserve);
    // Mehr Bauland → mehr Angebotspotenzial → weniger Nachfragedruck
    expect(mit[2].marketState.nachfragedruck)
      .toBeLessThan(ohne[2].marketState.nachfragedruck);
  });
});

describe('Bodenrecht: CH-008 / CH-009 ETH Verdichtung → Verdrängungsrisiko', () => {
  /**
   * Ref: docs/recherche/CH/CH-008-eth-spur-verdichtung-verdraengung-2025.md
   * Ref: docs/recherche/CH/CH-009-bautatigkeit-verdraengung-eth-bwo-2025.md
   *
   * ETH SPUR: Verdichtung via Ersatzbauten verdrängt vulnerable Bewohnende —
   * insbesondere Einkommensschwache. Neubauaktivitäten haben negativen Effekt auf
   * vulnerable Personen in urbanem Raum.
   *
   * Key Findings:
   * - In Basel: ~15% neue Wohngebäude 2020–2023 auf Industrie-/Gewerbezonen; 24% aller neuen Wohnungen
   * - Verdrängung betrifft überproportional einkommensschwache, ältere, niedriggebildete Haushalte
   * - Für CH: Kombination Verdichtungsgebot + Verdrängungsschutz nötig
   *
   * Im Modell:
   * - raumplanung_verdichtung ↑ → verdraengungsrisiko ↑ (NEUE Kante)
   * - raumplanung_verdichtung ↑ → angebotspotenzial ↑ (Bestätigt in CH-008)
   * - raumplanung_verdichtung ↑ → gentrifizierungsindex ↑
   */
  it('[FACH] CH-008: Verdichtung erhöht Verdrängungsrisiko (ETH-SPUR-Befund)', () => {
    const basis: CityParams40 = {
      ...ZUERICH_V2,
      raumplanung_verdichtung: 0,
    };
    const ohne = phases(basis, ZUERICH_CONTEXT, {});
    const mitVerdichtung: ParamsDiff40 = {
      raumplanung_verdichtung: { from: 0, to: 2 },
    };
    const mit = phases(basis, ZUERICH_CONTEXT, mitVerdichtung);
    // Verdichtung → Verdrängung vulnerabler Gruppen (Ersatzneubau verdrängt Mieter)
    expect(mit[0].marketState.verdraengungsrisiko)
      .toBeGreaterThan(ohne[0].marketState.verdraengungsrisiko);
  });
  it('[FACH] CH-009: Verdichtung erhöht Gentrifizierungsindex (soziale Aufwertung)', () => {
    const basis: CityParams40 = {
      ...ZUERICH_V2,
      raumplanung_verdichtung: 0,
    };
    const ohne = phases(basis, ZUERICH_CONTEXT, {});
    const mitVerdichtung: ParamsDiff40 = {
      raumplanung_verdichtung: { from: 0, to: 2 },
    };
    const mit = phases(basis, ZUERICH_CONTEXT, mitVerdichtung);
    // Verdichtung → Gentrifizierung (soziale Aufwertung ohne Sozialmischung)
    expect(mit[0].derived.gentrifizierungsindex)
      .toBeGreaterThan(ohne[0].derived.gentrifizierungsindex);
  });
  it('[FACH] CH-008: Verdichtung erhöht Angebotspotenzial (Bestätigung)', () => {
    const basis: CityParams40 = {
      ...ZUERICH_V2,
      raumplanung_verdichtung: 0,
    };
    const ohne = phases(basis, ZUERICH_CONTEXT, {});
    const mitVerdichtung: ParamsDiff40 = {
      raumplanung_verdichtung: { from: 0, to: 2 },
    };
    const mit = phases(basis, ZUERICH_CONTEXT, mitVerdichtung);
    // Verdichtung → mehr Neubau auf innerstädtischen Flächen
    expect(mit[2].marketState.angebotspotenzial)
      .toBeGreaterThan(ohne[2].marketState.angebotspotenzial);
  });
});

