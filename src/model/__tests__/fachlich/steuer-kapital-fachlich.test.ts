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
import { migrateParamsV1ToV2 } from '../../params';
import type { CityContext, CityParams40, ParamsDiff40 } from '../../../types';

const ZUERICH_V2: CityParams40 = migrateParamsV1ToV2({
  raumplanung: 2, bauvorschriften: 2, energetischeVorgaben: 1,
  mietrecht: 1, steuerpolitik: 2, foerderungGemeinnuetzig: 2,
  subventionen: 1, einspracherechte: 2, infrastruktur: 2,
  auslaendischeInvestitionen: 1,
});

const NEUTRAL_CONTEXT: CityContext = {
  zinsniveau: 0,
  zuwanderungsdruck: 0,
  wirtschaftskraft: 0,
  bevoelkerungstrend: 0,
};

const ZUERICH_CONTEXT: CityContext = {
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 2,
};

function phases(params: CityParams40, context: CityContext, diff: ParamsDiff40) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, params, diff)];
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
