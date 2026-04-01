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
import { migrateParamsV1ToV2 } from '../../params';
import type { CityContext, CityParams40, ParamsDiff40 } from '../../../types';

const ZUERICH_V2: CityParams40 = migrateParamsV1ToV2({
  raumplanung: 2, bauvorschriften: 2, energetischeVorgaben: 1,
  mietrecht: 1, steuerpolitik: 2, foerderungGemeinnuetzig: 2,
  subventionen: 1, einspracherechte: 2, infrastruktur: 2,
  auslaendischeInvestitionen: 1,
});

const ZUERICH_CONTEXT: CityContext = {
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
    // Basis-Stadt mit lockeren Zonen (AZ=0, Verdichtung=0)
    const lockereBasis: CityParams40 = {
      ...ZUERICH_V2,
      raumplanung_ausnuetzungsziffer: 0,
      raumplanung_verdichtung: 0,
    };

    const ohneReform = phases(lockereBasis, ZUERICH_CONTEXT, {});

    // Reform: Aufzoning von locker (0) → dicht (2)
    const upzoningDiff: ParamsDiff40 = {
      raumplanung_ausnuetzungsziffer: { from: 0, to: 2 },
      raumplanung_verdichtung:         { from: 0, to: 2 },
    };
    const mitReform = phases(lockereBasis, ZUERICH_CONTEXT, upzoningDiff);

    // Phase 3 (langfristig): Mit Reform sollte angebotspotenzial höher sein
    expect(mitReform[2].marketState.angebotspotenzial)
      .toBeGreaterThan(ohneReform[2].marketState.angebotspotenzial);
  });

  it('[FACH] Upzoning: neubau_hemmnisindex sinkt langfristig (mehr Angebot = weniger Hemnis)', () => {
    const lockereBasis: CityParams40 = {
      ...ZUERICH_V2,
      raumplanung_ausnuetzungsziffer: 0,
      raumplanung_verdichtung: 0,
    };

    const ohneReform = phases(lockereBasis, ZUERICH_CONTEXT, {});
    const upzoningDiff: ParamsDiff40 = {
      raumplanung_ausnuetzungsziffer: { from: 0, to: 2 },
      raumplanung_verdichtung:         { from: 0, to: 2 },
    };
    const mitReform = phases(lockereBasis, ZUERICH_CONTEXT, upzoningDiff);

    // neubau_hemmnisindex = -angebotspotenzial
    // Mit Reform: höheres Angebot → tieferer Hemmnisindex
    expect(mitReform[2].derived.neubau_hemmnisindex)
      .toBeLessThan(ohneReform[2].derived.neubau_hemmnisindex);
  });

  it('[FACH] Upzoning: aufwertungsdruck steigt durch AZ-Erhöhung (kurzfristig)', () => {
    const lockereBasis: CityParams40 = {
      ...ZUERICH_V2,
      raumplanung_ausnuetzungsziffer: 0,
      raumplanung_verdichtung: 0,
    };

    const ohneReform = phases(lockereBasis, ZUERICH_CONTEXT, {});
    const upzoningDiff: ParamsDiff40 = {
      raumplanung_ausnuetzungsziffer: { from: 0, to: 2 },
      raumplanung_verdichtung:         { from: 0, to: 2 },
    };
    const mitReform = phases(lockereBasis, ZUERICH_CONTEXT, upzoningDiff);

    // Aufwertungsdruck steigt durch höhere AZ (Bodenpreiserwartungen)
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

    // Phase 3 (langfristig): Reform sollte Angebotspotenzial erhöhen
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

    // Suspensiveffekt sollte stärker hemmen als nur Dritte-Einsprache
    expect(susp[0].marketState.angebotspotenzial)
      .toBeLessThan(dritte[0].marketState.angebotspotenzial);
  });
});
