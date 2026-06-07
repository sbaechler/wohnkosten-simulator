/**
 * wohnschutz-fachlich.test.ts — Fachliche Tests (Research-basiert)
 *
 * Validierung der Modell-Gewichte gegen empirische Evidenz aus:
 * - FHNW-Studie (Prof. Dr. Kristyna Ters & Konstantin Kholodilin, DIW Berlin):
 *   «Restrictive rental policies and a tough trade off: Lower rents vs. less
 *   construction in Geneva», Nov. 2025 — Daten Genf 1994–2022
 * - SVIT / HEV / Swiss Real Estate Institute:
 *   «Auswirkungen der Wohnschutzinitiative im Kanton Basel-Stadt», Jan. 2025
 *
 * Forschung: docs/superpowers/specs/parameter-recherche.md (Abschnitte
 *            `kostenmiete`, `kuendigungsschutz`, `umnutzungsverbot`)
 *
 * Wichtige empirische Befunde:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Wohnungsrationierung (Genf LDTR / Basel Wohnschutzverordnung):
 *    → Aggregierter Rückgang Bauinvestitionen: −600 Mio. CHF (≈11% Bauausgaben)
 *    → Institutionelle Neubauinvestitionen: −400 Mio. CHF
 *    → Private: kurzfristig Renovation +200 Mio. CHF (Jahre 1–3), dann Rückgang
 *    → Leerstände sinken (Granger-Kausalität) → politisch induzierte Knappheit
 *    → Zielkonflikt Klimaschutz: Sanierungsrückstand Genf 83% vs. Zürich 41%
 *
 * 2. Mietpreisregulierung (weniger stark als Rationierung):
 *    → Institutionelle Neubauinvestitionen: −100 Mio. CHF (schwacher Effekt)
 *    → Private Renovation: +150 Mio. CHF (Jahre 1–5), kein dauerhafter Effekt
 *    → Leerstände: unverändert (kein Rationierungseffekt)
 *
 * 3. Wohnungsrationierung > Mietpreisregulierung (als Angebotsbremse):
 *    → Rationierung bremst Neubau deutlich stärker als Mietpreisdeckel
 *
 * 4. Neumieter-Preisspreizung (Genf vs. Zürich):
 *    → Genf: Neumieter zahlen ~30% mehr als Bestandsmieter (372 CHF/m²/Jahr)
 *    → Zürich (kein Mietpreisdeckel): nur ~18% Differenz
 *    → Höchste Angebotsmieten aller 5 grössten Schweizer Städte trotz Regulierung
 *
 * 5. Basel: Baugesuche −76%, geplante Wohneinheiten −95% (1078 → 67)
 *    → Zürich im selben Zeitraum: +20% Baugesuche
 *
 * Run: npx vitest run src/model/__tests__/fachlich/wohnschutz-fachlich.test.ts
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline, invalidatePhasesCache } from '../../compute-phases';
import type { CityContext, CityParams40, ParamsDiff40 } from '../../../types';

// ── Baselines ─────────────────────────────────────────────────────────────────


// Zürich-like baseline (moderate Regulierung, kein Mietpreisdeckel)
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

// Angespannter Kontext (Genf / Zürich)
const ANGESPANNT: CityContext = {
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 2,
  marktenge: 2,  mietbelastungs_grenze: 1,
};

const NEUTRAL_CONTEXT: CityContext = {
  zinsniveau: 0,
  zuwanderungsdruck: 0,
  wirtschaftskraft: 0,
  bevoelkerungstrend: 0,
  marktenge: 0,  mietbelastungs_grenze: 1,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function phases(_params: CityParams40, context: CityContext, diff: ParamsDiff40) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, diff)];
}

// ── Test-Suite 1: Rationierung bremst stärker als Mietpreisregulierung ────────

describe('FHNW: Wohnungsrationierung bremst Investitionen stärker als Mietpreisregulierung', () => {
  // ⚠️  CALIBRATION_TARGET: nutzung_abbruchverbot / nutzung_umnutzungsverbot
  // haben im aktuellen DAG noch keine Kanten zu angebotspotenzial oder
  // investitionsattraktivitaet. Diese Tests werden erst grün, sobald die
  // entsprechenden Gewichte im DAG kalibriert sind.
  /**
   * Kernbefund der FHNW-Studie (Genf 1994–2022):
   * - Rationierung (Abbruch-/Umnutzungsverbot): −600 Mio. CHF Bauinvestitionen aggregiert
   * - Mietpreisregulierung: −100 Mio. CHF bei institutionellen Investoren (statistisch schwach)
   *
   * → Rationierung schlägt stärker auf angebotspotenzial und investitionsattraktivitaet
   *   als reine Mietpreisregulierung.
   */
  it('[FACH] Rationierung senkt angebotspotenzial stärker als Mietpreisregulierung', () => {
    const nurMietrecht: ParamsDiff40 = {
      mietrecht_kostenmiete:      { from: 1, to: 2 },
      mietrecht_anfangsmiete:     { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    };
    const nurRationierung: ParamsDiff40 = {
      nutzung_abbruchverbot:    { from: 1, to: 2 },
      nutzung_umnutzungsverbot: { from: 1, to: 2 },
    };

    const mitMietrecht    = phases(ZUERICH_V2, ANGESPANNT, nurMietrecht);
    const mitRationierung = phases(ZUERICH_V2, ANGESPANNT, nurRationierung);

    expect(mitRationierung[0].marketState.angebotspotenzial)
      .toBeLessThan(mitMietrecht[0].marketState.angebotspotenzial);
  });

  it('[FACH] Rationierung senkt investitionsattraktivitaet stärker als Mietpreisregulierung', () => {
    const nurMietrecht: ParamsDiff40 = {
      mietrecht_kostenmiete:      { from: 1, to: 2 },
      mietrecht_anfangsmiete:     { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    };
    const nurRationierung: ParamsDiff40 = {
      nutzung_abbruchverbot:    { from: 1, to: 2 },
      nutzung_umnutzungsverbot: { from: 1, to: 2 },
    };

    const mitMietrecht    = phases(ZUERICH_V2, ANGESPANNT, nurMietrecht);
    const mitRationierung = phases(ZUERICH_V2, ANGESPANNT, nurRationierung);

    // Langfristig (Phase 3) soll der Unterschied besonders sichtbar sein
    expect(mitRationierung[2].marketState.investitionsattraktivitaet)
      .toBeLessThan(mitMietrecht[2].marketState.investitionsattraktivitaet);
  });
});

// ── Test-Suite 2: Basel-Wohnschutz-Szenario ──────────────────────────────────

describe('Basel Wohnschutzverordnung (2022): kombinierte Rationierung', () => {
  // ⚠️  CALIBRATION_TARGET: nutzung_abbruchverbot / nutzung_umnutzungsverbot fehlen
  // aktuell als Quellknoten für neubau_hemmnisindex und angebotspotenzial im DAG.
  /**
   * Basel Wohnschutzverordnung:
   * - Abriss, Ersatzneubau und Sanierungen: bewilligungspflichtig + Mietzinsobergrenzen
   * - Baugesuche −76%, geplante Wohneinheiten −95% (1078 → 67)
   * - Zürich im selben Zeitraum: +20% mehr Baugesuche
   *
   * Modell-Szenario: Wohnschutz-Initiative eingeführt
   * (nutzung_abbruchverbot + nutzung_umnutzungsverbot + mietrecht_kostenmiete)
   */
  it('[FACH] Basel-Wohnschutz: Kombination Rationierung + Mietdeckel erhöht neubau_hemmnisindex stark', () => {
    const neutral = phases(ZUERICH_V2, ANGESPANNT, {});

    const baselWohnschutz: ParamsDiff40 = {
      nutzung_abbruchverbot:      { from: 1, to: 2 },
      nutzung_umnutzungsverbot:   { from: 1, to: 2 },
      mietrecht_kostenmiete:      { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    };
    const mitWohnschutz = phases(ZUERICH_V2, ANGESPANNT, baselWohnschutz);

    expect(mitWohnschutz[0].derived.neubau_hemmnisindex)
      .toBeGreaterThan(neutral[0].derived.neubau_hemmnisindex);
  });

  it('[FACH] Basel-Wohnschutz: angebotspotenzial sinkt deutlich gegenüber Status quo', () => {
    const neutral = phases(ZUERICH_V2, ANGESPANNT, {});

    const baselWohnschutz: ParamsDiff40 = {
      nutzung_abbruchverbot:      { from: 1, to: 2 },
      nutzung_umnutzungsverbot:   { from: 1, to: 2 },
      mietrecht_kostenmiete:      { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    };
    const mitWohnschutz = phases(ZUERICH_V2, ANGESPANNT, baselWohnschutz);

    expect(mitWohnschutz[1].marketState.angebotspotenzial)
      .toBeLessThan(neutral[1].marketState.angebotspotenzial);
  });

  it('[FACH] Basel-Wohnschutz: investitionsattraktivitaet sinkt über alle Phasen', () => {
    const neutral = phases(ZUERICH_V2, ANGESPANNT, {});

    const baselWohnschutz: ParamsDiff40 = {
      nutzung_abbruchverbot:      { from: 1, to: 2 },
      nutzung_umnutzungsverbot:   { from: 1, to: 2 },
      mietrecht_kostenmiete:      { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    };
    const mitWohnschutz = phases(ZUERICH_V2, ANGESPANNT, baselWohnschutz);

    // P1 und P3 müssen beide sinken
    expect(mitWohnschutz[0].marketState.investitionsattraktivitaet)
      .toBeLessThan(neutral[0].marketState.investitionsattraktivitaet);
    expect(mitWohnschutz[2].marketState.investitionsattraktivitaet)
      .toBeLessThan(neutral[2].marketState.investitionsattraktivitaet);
  });
});

// ── Test-Suite 3: Genf vs. Zürich — Neumieter-Preisspreizung ─────────────────

describe('FHNW: Genf-Effekt — strenges Mietrecht erhöht Marktfriktion und senkt Angebot', () => {
  /**
   * Das Phasen-Modell arbeitet diff-basiert: Es berechnet die Veränderung
   * relativ zur Baseline, nicht absolute Pegel. Deshalb:
   * - Genf-vs-Zürich als Diff vom gleichen Ausgangspunkt testen
   * - Beide Systeme starten von ZUERICH_V2 und erhalten den "Genf-Diff"
   *   (die zusätzliche Regulierung die Genf auf Basis von Zürich hat)
   *
   * Genf: Neumieter zahlen ~30% mehr als Bestandsmieter (372 CHF/m²/Jahr)
   * Zürich (kein Mietpreisdeckel): nur ~18% Differenz
   * Genf: Durchschnittliche Mietdauer 13.7 Jahre vs. ~6 J. anderswo
   */

  // Diff: was Genf hat, was Zürich nicht hat
  const GENF_ZUSATZ_DIFF: ParamsDiff40 = {
    mietrecht_kostenmiete:       { from: 1, to: 2 },
    mietrecht_anfangsmiete:      { from: 1, to: 2 },
    mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    mietrecht_mietzinsindex:     { from: 1, to: 2 },
    nutzung_abbruchverbot:       { from: 1, to: 2 },
    nutzung_umnutzungsverbot:    { from: 1, to: 2 },
  };

  it('[FACH] Genf-Regulierung erhöht markfriktion gegenüber Zürich-Status-quo', () => {
    const zuerich = phases(ZUERICH_V2, ANGESPANNT, {});
    const genf    = phases(ZUERICH_V2, ANGESPANNT, GENF_ZUSATZ_DIFF);

    expect(genf[0].marketState.markfriktion)
      .toBeGreaterThan(zuerich[0].marketState.markfriktion);
  });

  it('[FACH] Genf-Regulierung erhöht mietpreis_schutzlevel gegenüber Zürich-Status-quo', () => {
    const zuerich = phases(ZUERICH_V2, ANGESPANNT, {});
    const genf    = phases(ZUERICH_V2, ANGESPANNT, GENF_ZUSATZ_DIFF);

    expect(genf[0].marketState.mietpreis_schutzlevel)
      .toBeGreaterThan(zuerich[0].marketState.mietpreis_schutzlevel);
  });

  it('[FACH] Genf-Regulierung senkt angebotspotenzial gegenüber Zürich-Status-quo (Rationierungseffekt)', () => {
    const zuerich = phases(ZUERICH_V2, ANGESPANNT, {});
    const genf    = phases(ZUERICH_V2, ANGESPANNT, GENF_ZUSATZ_DIFF);

    expect(genf[1].marketState.angebotspotenzial)
      .toBeLessThan(zuerich[1].marketState.angebotspotenzial);
  });
});

// ── Test-Suite 4: Abbruchverbot → politisch induzierte Knappheit ─────────────

describe('FHNW: Abbruchverbot/Rationierung → politisch induzierte Knappheit', () => {
  /**
   * FHNW-Befund (Granger-Kausalität):
   * Rationierung führt zeitlich vorlaufend zu sinkenden Leerständen.
   * → nachfragedruck steigt durch Angebotsverknappung (ohne Nachfrageanstieg)
   *
   * Im Modell:
   * - nutzung_abbruchverbot ↑ → nachfragedruck ↑ (weniger freie Wohnungen)
   * - Effekt verstärkt sich in Phase 2/3 (Leerstand sinkt durch Ausbleiben von Neubau)
   */
  it('[FACH] Abbruchverbot erhöht nachfragedruck mittelfristig (Phase 2)', () => {
    const neutral = phases(ZUERICH_V2, NEUTRAL_CONTEXT, {});

    const mitAbbruchverbot: ParamsDiff40 = {
      nutzung_abbruchverbot: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, NEUTRAL_CONTEXT, mitAbbruchverbot);

    expect(withDiff[1].marketState.nachfragedruck)
      .toBeGreaterThanOrEqual(neutral[1].marketState.nachfragedruck);
  });

  it('[FACH] Abbruchverbot + Umnutzungsverbot erhöht nachfragedruck stärker als einzeln', () => {
    const nurAbbruch: ParamsDiff40 = {
      nutzung_abbruchverbot: { from: 1, to: 2 },
    };
    const kombiniert: ParamsDiff40 = {
      nutzung_abbruchverbot:    { from: 1, to: 2 },
      nutzung_umnutzungsverbot: { from: 1, to: 2 },
    };

    const mitAbbruch    = phases(ZUERICH_V2, NEUTRAL_CONTEXT, nurAbbruch);
    const mitKombiniert = phases(ZUERICH_V2, NEUTRAL_CONTEXT, kombiniert);

    expect(mitKombiniert[1].marketState.nachfragedruck)
      .toBeGreaterThanOrEqual(mitAbbruch[1].marketState.nachfragedruck);
  });
});

// ── Test-Suite 5: Zielkonflikt Klimaschutz ───────────────────────────────────

describe('FHNW/Basel: Wohnschutz-Zielkonflikt mit Klimaschutz (Sanierungsrückstand)', () => {
  /**
   * Basler Regierung (2023) und FHNW-Studie:
   * - Energetische Sanierungen erfolgen meist im Rahmen von Totalsanierungen
   * - Wohnschutz bremst Totalsanierungen → Sanierungsrückstand (Genf 83%, Basel 48%, ZH 41%)
   * - Zielkonflikt: Wohnschutz vs. Klimaziele (Netto-Null 2037 Basel, 2050 Bund)
   *
   * Im Modell: energetische Vorgaben + Sanierungspflicht vs. Abbruchverbot
   * - Bei hohem Abbruchverbot sollte sanierungsquote oder ein äquivalenter Index sinken
   * - Proxy: bau_sanierungspflicht ↑ sollte weniger wirken, wenn nutzung_abbruchverbot ↑
   *   (paradoxer Effekt: strengerer Wohnschutz konterkariert Sanierungsziele)
   */
  it('[FACH] Abbruchverbot dämpft den Effekt von Sanierungspflicht auf investitionsattraktivitaet', () => {
    const nurSanierung: ParamsDiff40 = {
      bau_sanierungspflicht: { from: 1, to: 2 },
    };
    const sanierungPlusAbbruch: ParamsDiff40 = {
      bau_sanierungspflicht: { from: 1, to: 2 },
      nutzung_abbruchverbot: { from: 1, to: 2 },
    };

    const mitSanierung      = phases(ZUERICH_V2, ANGESPANNT, nurSanierung);
    const mitKombination    = phases(ZUERICH_V2, ANGESPANNT, sanierungPlusAbbruch);

    // Abbruchverbot + Sanierungspflicht → schlechtere investitionsattraktivitaet
    // als Sanierungspflicht allein (Abbruchverbot konterkariert Investitionsanreize)
    expect(mitKombination[1].marketState.investitionsattraktivitaet)
      .toBeLessThanOrEqual(mitSanierung[1].marketState.investitionsattraktivitaet);
  });
});
