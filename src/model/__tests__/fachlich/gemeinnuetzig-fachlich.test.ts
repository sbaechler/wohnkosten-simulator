/**
 * gemeinnuetzig-fachlich.test.ts — Fachliche Tests (Research-basiert)
 *
 * Forschung: docs/superpowers/research/gemeinnuetzig-nutzung-parameter-wirkung.md
 *
 * Wichtige empirische Befunde:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Vancouver Empty Home Tax (EHT): Leerstand 0.9% → 0.49%
 *    → nutzung_kurzzeitvermietung ↑ (Regulierung verschärft)
 *
 * 2. BC Speculation and Vacancy Tax (SVT): 20'000 Einheiten zum Mietmarkt
 *    → steuer_leerstandsabgabe ↑, spekulationshemmung ↑
 *
 * 3. NYC LL18: 90% Inserate-Rückgang nach Regulierung
 *    → nutzung_kurzzeitvermietung ↑ stark
 *
 * 4. Airbnb-Regulierung Barcelona: +1.9% Miete, +4.6% Kaufpreise
 *    → Verlagerungseffekt auf Kaufmarkt
 *
 * 5. Gemeinnütziger Anteil 33%+:
 *    → Dämpft Mietpreise durch Wettbewerb
 *    → gentrifizierungsindex sollte sinken
 *
 * Run: npx vitest run src/model/__tests__/fachlich/gemeinnuetzig-fachlich.test.ts
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

function phases(params: CityParams40, context: CityContext, diff: ParamsDiff40) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, params, diff)];
}

describe('Gemeinnützigkeit: Vancouver EHT (Leerstand −0.4 Prozentpunkte)', () => {
  /**
   * Vancouver Empty Home Tax:
   * - Einführung 2017 (0.5% → 2018 auf 2.5% erhöht)
   * - Leerstand 0.9% → 0.49%
   * - 20'000 Einheiten kamen zum Mietmarkt
   *
   * Hinweis: steuer_leerstandsabgabe hat im aktuellen DAG keine direkte
   * Verbindung zu spekulationshemmung. Die Tests hier dokumentieren die
   * erwartete Wirkung (Research-bedarf für DAG-Kalibrierung).
   */
  it('[FACH] Vancouver EHT: Leerstandsabgabe erhöht spekulationshemmung', () => {
    // Basis ohne Abgabe (steuer_leerstandsabgabe=0 in ZUERICH_V2, migrated from V1.subventionen=1 → default=1)
    // ZUERICH_V2 setzt steuer_leerstandsabgabe=1 (via Migration), also: diff 1→2
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
     * ⚠️ DAG-Kalibrierungsbedarf: nutzung_kurzzeitvermietung → verdraengungsrisiko
     * Kante fehlt im aktuellen DAG.
     */
    expect(withDiff[0].marketState.verdraengungsrisiko)
      .toBeLessThan(neutral[0].marketState.verdraengungsrisiko);
  });
});

describe('Gemeinnützigkeit: Barcelona Airbnb-Regulierung Paradox', () => {
  /**
   * Barcelona Regulierung: +1.9% Miete, +4.6% Kaufpreise
   * → Verlagerungseffekt! Regulierung treibt Mieten nach oben statt sie zu senken.
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
     * ⚠️ DAG-Kalibrierungsbedarf: nutzung_kurzzeitvermietung → investitionsattraktivitaet
     * Kante fehlt im aktuellen DAG. Wenn Vermieter Airbnb nicht mehr nutzen können,
     * investieren sie möglicherweise woanders → Investitionsattraktivitaet sinkt.
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
   *
   * Korrekte Teststruktur: Basis mit quot=0, dann Reform (diff: 0→2)
   */
  it('[FACH] Hoher Mindestanteil senkt Gentrifizierungsindex (im Vergleich zu keinem Mindestanteil)', () => {
    // Basis mit quot=0 (restrictive)
    const restrictiveBasis: CityParams40 = {
      ...ZUERICH_V2,
      gemeinnuetzig_mindestanteil: 0,
      gemeinnuetzig_foerderfonds: 0,
      gemeinnuetzig_baurecht: 0,
    };

    // Ohne Reform: keine Änderung
    const ohneReform = phases(restrictiveBasis, ZUERICH_CONTEXT, {});

    // Reform: quot 0→2
    const reformDiff: ParamsDiff40 = {
      gemeinnuetzig_mindestanteil: { from: 0, to: 2 },
      gemeinnuetzig_foerderfonds:  { from: 0, to: 2 },
      gemeinnuetzig_baurecht:      { from: 0, to: 2 },
    };
    const mitReform = phases(restrictiveBasis, ZUERICH_CONTEXT, reformDiff);

    // gentrifizierungsindex sollte mit Reform tiefer sein
    expect(mitReform[0].derived.gentrifizierungsindex)
      .toBeLessThan(ohneReform[0].derived.gentrifizierungsindex);
  });

  it('[FACH] Hoher Mindestanteil erhöht angebotspotenzial über den Foerderfonds-Kanal', () => {
    // Test: Foerderfonds (ohne Mindestanteil) → angebotspotenzial
    // Der Effekt ist indirekt und braucht PERSISTENCE-Carry-over.
    // Der Test zeigt: die DAG-Kante foerderfonds→angebotspotenzial existiert
    // (Gewicht P1=0.1, P2=0.5, P3=0.8), aber der Effekt ist aufgrund der
    // many-to-one-Verteilung auf 16 Edges relatively schwach.
    const ohneFonds: CityParams40 = {
      ...ZUERICH_V2,
      gemeinnuetzig_foerderfonds: 0,
    };

    const ohneReform = phases(ohneFonds, ZUERICH_CONTEXT, {});
    const reformDiff: ParamsDiff40 = {
      gemeinnuetzig_foerderfonds: { from: 0, to: 2 },
    };
    const mitReform = phases(ohneFonds, ZUERICH_CONTEXT, reformDiff);

    // Phase 3 (langfristig, Gewicht=0.8): Reform sollte Angebotspotenzial erhöhen
    // Der Effekt ist klein (nur 1/16tel der Gesamtgewichtung), aber messbar
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

  it('[FACH] Abbruchverbot erhöht Angebotspotenzial (Bestand bleibt)', () => {
    const neutral = phases(ZUERICH_V2, ZUERICH_CONTEXT, {});

    const withBan: ParamsDiff40 = {
      nutzung_abbruchverbot: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, ZUERICH_CONTEXT, withBan);

    expect(withDiff[0].marketState.angebotspotenzial)
      .toBeGreaterThan(neutral[0].marketState.angebotspotenzial);
  });
});
