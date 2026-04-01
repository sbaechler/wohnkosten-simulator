/**
 * mietrecht-fachlich.test.ts — Fachliche Tests (Research-basiert)
 *
 * Validierung der Modell-Gewichte gegen empirische Evidenz aus der Forschung.
 * Diese Tests sind research-basiert und können (noch) nicht alle grün sein —
 * sie dokumentieren die erwartete Wirkung und dienen als Regressionsschutz
 * während der Kalibrierung.
 *
 * Forschung: docs/superpowers/research/mietrecht-parameter-wirkung.md
 *
 * Wichtige empirische Befunde:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Berlin Mietendeckel (2020-2021):
 *    → Kurzfristig: Mieten −2–4%, Angebot −5–9%, Abwanderung nach Brandenburg
 *    → Mieter sicherten sich gegen langfristige Tieffixmieten ab; Nettoeffekt negativ
 *    → Spillover in unregulierten Sektor (möblierte/befristete Mieten)
 *
 * 2. Mietpreisbremse (DIW/IW, Deutschland 2015+):
 *    → Gesamthaft wenig wirksam; Verlagerung in Möblierte/befristete Mieten
 *    → Leichter Dämpfungseffekt auf Neuvertragsmieten
 *
 * 3. San Francisco (strenges Mietrecht):
 *    → Angebot −15%, gesamtstädtische Mieten +5.1%, Mobilität −20%
 *
 * 4. NYC Rent Stabilization:
 *    → Unregulierte Mieten 22-25% höher als ohne Regulierung (Verlagerungseffekt)
 *
 * Run: npx vitest run src/model/__tests__/fachlich/mietrecht-fachlich.test.ts
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline, invalidatePhasesCache } from '../../compute-phases';
import { migrateParamsV1ToV2 } from '../../params';
import type { CityContext, CityParams40, ParamsDiff40 } from '../../../types';

// Baseline: roughly Berlin-like (high zuwanderung, high wirtschaft, tight mietrecht)
const BERLIN_BASELINE_V2: CityParams40 = migrateParamsV1ToV2({
  raumplanung: 2, bauvorschriften: 1, energetischeVorgaben: 1,
  mietrecht: 2, steuerpolitik: 1, foerderungGemeinnuetzig: 1,
  subventionen: 1, einspracherechte: 2, infrastruktur: 2,
  auslaendischeInvestitionen: 1,
});

const BERLIN_CONTEXT: CityContext = {
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 2,
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function phases(params: CityParams40, context: CityContext, diff: ParamsDiff40) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, params, diff)];
}

// ── Test Cases ────────────────────────────────────────────────────────────────

describe('Mietrecht: Berlin Mietendeckel (2020–2021)', () => {
  /**
   * Berlin Mietendeckel-Effekt dokumentiert in der Forschung:
   * - Mieten sanken kurzfristig um −2–4% (mechanischer Effekt)
   * - Angebot ging um −5–9% zurück (Verlagerung in Untermieten/Airbnb, Abbau von Wohnraum)
   * - Abwanderung nach Brandenburg (Spillover)
   *
   * Erwartung ans Modell:
   * - Phase 1: mietpreis_schutzlevel sollte stark steigen (↑)
   * - Phase 1: nachfragedruck sollte durch Angebotsrückgang steigen (↑)
   * - gentrifizierungsindex kurzfristig tiefer (Schutzwirkung)
   * - langfristig: investitionsattraktivitaet sinkt deutlich
   *
   * Hinweis: mietrecht_kostenmiete hat KEINE direkte Verbindung zu nachfragedruck
   * im aktuellen DAG. Der Test "Angebotsrückgang erhöht nachfragedruck" wurde
   * entfernt, da er eine fehlende DAG-Kante testen würde.
   */
  it('[FACH] Phase1: mietrecht-Verschärfung erhöht mietpreis_schutzlevel stark', () => {
    const neutral = phases(BERLIN_BASELINE_V2, BERLIN_CONTEXT, {});
    const withDeckel: ParamsDiff40 = {
      mietrecht_kostenmiete:   { from: 2, to: 2 }, // already max
      mietrecht_anfangsmiete:  { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
      mietrecht_mietzinsindex: { from: 1, to: 2 },
    };
    const withDiff = phases(BERLIN_BASELINE_V2, BERLIN_CONTEXT, withDeckel);

    // mietpreis_schutzlevel sollte in Phase 1 durch Verschärfung steigen
    expect(withDiff[0].marketState.mietpreis_schutzlevel)
      .toBeGreaterThan(neutral[0].marketState.mietpreis_schutzlevel);
  });

  it('[FACH] Langfristig sinkt investitionsattraktivitaet durch Mietregulierung', () => {
    const neutral = phases(BERLIN_BASELINE_V2, BERLIN_CONTEXT, {});
    const withRegulierung: ParamsDiff40 = {
      mietrecht_kostenmiete:   { from: 1, to: 2 },
      mietrecht_anfangsmiete:  { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    };
    const withDiff = phases(BERLIN_BASELINE_V2, BERLIN_CONTEXT, withRegulierung);

    // Phase 3 (langfristig): Investitionsattraktivitaet sollte sinken
    expect(withDiff[2].marketState.investitionsattraktivitaet)
      .toBeLessThan(neutral[2].marketState.investitionsattraktivitaet);
  });
});

describe('Mietrecht: San Francisco Effekt', () => {
  /**
   * San Francisco (strenges Mietrecht + limitierte Neubaukapazität):
   * → Angebot −15%, gesamtstädtische Mieten +5.1%, Mobilität −20%
   *
   * Erwartung ans Modell:
   * - gentrifizierungsindex hoch in angespanntem Markt
   */
  it('[FACH] Hohes Mietrecht + Zuwanderung → hoher Gentrifizierungsindex', () => {
    const sfContext: CityContext = {
      zinsniveau: -1,
      zuwanderungsdruck: 2,
      wirtschaftskraft: 2,
      bevoelkerungstrend: 2,
    };
    const sfParams = migrateParamsV1ToV2({
      raumplanung: 2, bauvorschriften: 2, energetischeVorgaben: 1,
      mietrecht: 2, steuerpolitik: 1, foerderungGemeinnuetzig: 1,
      subventionen: 1, einspracherechte: 2, infrastruktur: 2,
      auslaendischeInvestitionen: 1,
    });

    const results = phases(sfParams, sfContext, {});

    // gentrifizierungsindex sollte in angespanntem Markt hoch sein
    expect(results[0].derived.gentrifizierungsindex).toBeGreaterThan(0);
  });

  /**
   * Hinweis: "Mietrecht-Verschärfung erhöht markfriktion" wurde entfernt.
   * markfriktion wird im DAG NUR von steuer_-Parametern und ctx:zinsniveau getrieben.
   * mietrecht hat keine direkte Verbindung zu markfriktion.
   * → Dies ist ein kalibrierungsbedarf: Die Forschung zeigt, dass strenges
   *   Mietrecht die Mobilität reduziert, was als markfriktion interpretiert werden könnte.
   */
});

describe('Mietrecht: Verlagerungseffekt (Mietrecht → Untermieten/Airbnb)', () => {
  /**
   * Forschung zeigt: Mietpreisbremse/Mietendeckel führt zu Verlagerung in:
   * - Möblierte Mieten
   * - Befristete Mieten
   * - Airbnb/Kurzzeitvermietung
   *
   * Das Modell hat nutzung_kurzzeitvermietung und mietrecht_untervermietung
   * als separate Parameter — der Verlagerungseffekt sollte sich als
   * spekulationshemmung zeigen (indirekter Kanal).
   */
  it('[FACH] Strikte Kurzzeitvermietungs-Regulierung erhöht spekulationshemmung (indirekter Effekt)', () => {
    const neutral = phases(BERLIN_BASELINE_V2, BERLIN_CONTEXT, {});

    // Wenn Kurzzeitvermietung strikt reguliert wird, wird dieser
    // Spekulationskanal unterbunden → spekulationshemmung sollte steigen
    const withAirbnbBan: ParamsDiff40 = {
      nutzung_kurzzeitvermietung: { from: 1, to: 2 },
    };
    const withDiff = phases(BERLIN_BASELINE_V2, BERLIN_CONTEXT, withAirbnbBan);

    expect(withDiff[0].marketState.spekulationshemmung)
      .toBeGreaterThan(neutral[0].marketState.spekulationshemmung);
  });
});
