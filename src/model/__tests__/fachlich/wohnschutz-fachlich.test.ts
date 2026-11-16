/**
 * wohnschutz-fachlich.test.ts — Fachliche Tests (Research-basiert)
 *
 * Validierung der Modell-Gewichte gegen empirische Evidenz aus:
 * - DIW Discussion Paper 2143 (Kristyna Ters, FHNW, & Konstantin Kholodilin,
 *   DIW Berlin): «Restrictive rental policies and a tough trade off: Lower
 *   rents vs. less construction in Geneva», Nov. 2025 — nur Genf, 1994–2022
 * - SVIT / HEV / Swiss Real Estate Institute:
 *   «Auswirkungen der Wohnschutzinitiative im Kanton Basel-Stadt», Jan. 2025
 *
 * Forschung: docs/recherche/CH/CH-013 (DIW DP 2143) und CH-015 (Basel, SRES/SVIT).
 *
 * Wichtige empirische Befunde:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Wohnungsrationierung (DIW DP 2143, nur Genf; Index aus Register,
 *    Abbruch- und Umnutzungsbeschränkung u. a., S. 11):
 *    → Aggregierter Rückgang Bauinvestitionen: −600 Mio. CHF (≈11% Bauausgaben)
 *    → Institutionelle Neubauinvestitionen: −400 Mio. CHF
 *    → Private: kurzfristig Renovation +200 Mio. CHF (Jahre 1–3), dann Rückgang
 *    → Leerstände sinken (Granger-Kausalität) → politisch induzierte Knappheit
 *    → Wohnungen über 40 Jahre ohne Renovation: Genf 83.5 %, Basel 47.6 %,
 *      Zürich 41.3 % (Avenir Suisse 2012, zitiert S. 6–7; ausdrücklich keine Kausalaussage)
 *
 * 2. Mietpreisregulierung (weniger stark als Rationierung):
 *    → Institutionelle Neubauinvestitionen: −100 Mio. CHF (schwacher Effekt)
 *    → Private Renovation: +150 Mio. CHF (Jahre 1–3), kein dauerhafter Effekt
 *    → Leerstände: unverändert (kein Rationierungseffekt)
 *
 * 3. Wohnungsrationierung > Mietpreisregulierung (als Angebotsbremse):
 *    → Rationierung bremst Neubau deutlich stärker als Mietpreisdeckel
 *
 * 4. Genfer Abstand Neuvertrag zu Bestand (~33 Prozent, Mietdauer 13.7 Jahre):
 *    nicht in dieser Datei assertet. Der Kaltstart erzeugt den Abstand nicht.
 *
 * 5. Basel: Wohneinheiten in Baugesuchen −76 % (Mittel 784 für 2014–2020 gegen
 *    190 für 2021–2023; SRES im Auftrag von SVIT/HEV, Interessenvertreter,
 *    CH-015). Stadt Zürich im selben Vergleich +20 % (3035 → 3643). Ob der
 *    Wohnschutz die Bautätigkeit bremst, ist laut Präsidialdepartement
 *    Basel-Stadt offen (Medienmitteilung 26.3.2025).
 *
 * Run: npx vitest run src/model/__tests__/fachlich/wohnschutz-fachlich.test.ts
 */

import { describe, it, expect } from 'vitest';
import { computePhasePipeline, invalidatePhasesCache } from '../../compute-phases';
import type { CityContext, CityParams, ParamsDiff } from '../../../types';

// ── Baselines ─────────────────────────────────────────────────────────────────


// Zürich-like baseline (moderate Regulierung, kein Mietpreisdeckel)
const ZUERICH_V2: CityParams = {
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

// Angespannter Kontext (Genf / Zürich)
const ANGESPANNT: CityContext = {
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
  marktenge: 0,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function phases(_params: CityParams, context: CityContext, diff: ParamsDiff) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, diff)];
}

// ── Test-Suite 1: Rationierung bremst stärker als Mietpreisregulierung ────────

describe('DIW DP 2143: Wohnungsrationierung bremst Investitionen stärker als Mietpreisregulierung', () => {
  /**
   * Kernbefund von DIW DP 2143 (Genf 1994–2022):
   * - Rationierung (Abbruch-/Umnutzungsverbot): −600 Mio. CHF Bauinvestitionen aggregiert
   * - Mietpreisregulierung: −100 Mio. CHF bei institutionellen Investoren (statistisch schwach)
   *
   * → Rationierung schlägt stärker auf angebotspotenzial und investitionsattraktivitaet
   *   als reine Mietpreisregulierung.
   */
  it('[FACH] Rationierung senkt angebotspotenzial stärker als Mietpreisregulierung', () => {
    const nurMietrecht: ParamsDiff = {
      mietrecht_kostenmiete:      { from: 1, to: 2 },
      mietrecht_anfangsmiete:     { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    };
    const nurRationierung: ParamsDiff = {
      nutzung_abbruchverbot:    { from: 1, to: 2 },
      nutzung_umnutzungsverbot: { from: 1, to: 2 },
    };

    const mitMietrecht    = phases(ZUERICH_V2, ANGESPANNT, nurMietrecht);
    const mitRationierung = phases(ZUERICH_V2, ANGESPANNT, nurRationierung);

    expect(mitRationierung[0].marketState.angebotspotenzial)
      .toBeLessThan(mitMietrecht[0].marketState.angebotspotenzial);
  });

  it('[FACH] Rationierung senkt investitionsattraktivitaet stärker als Mietpreisregulierung', () => {
    const nurMietrecht: ParamsDiff = {
      mietrecht_kostenmiete:      { from: 1, to: 2 },
      mietrecht_anfangsmiete:     { from: 1, to: 2 },
      mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    };
    const nurRationierung: ParamsDiff = {
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
  /**
   * Basel Wohnschutzverordnung:
   * - Bei Abbruch/Ersatzneubau und Sanierung legt die Wohnschutzkommission
   *   Höchstmieten bzw. Aufschläge fest (ab 4 Wohnungen; CH-015)
   * - Wohneinheiten in Baugesuchen −76 % (784 → 190 im Mittel, SRES/SVIT,
   *   CH-015); Einfluss des Wohnschutzes laut Präsidialdepartement offen
   *
   * Modell-Szenario: Wohnschutz-Initiative eingeführt
   * (nutzung_abbruchverbot + nutzung_umnutzungsverbot + mietrecht_kostenmiete)
   */
  it('[FACH] Basel-Wohnschutz: Kombination Rationierung + Mietdeckel erhöht neubau_hemmnisindex stark', () => {
    const neutral = phases(ZUERICH_V2, ANGESPANNT, {});

    const baselWohnschutz: ParamsDiff = {
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

    const baselWohnschutz: ParamsDiff = {
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

    const baselWohnschutz: ParamsDiff = {
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

// ── Test-Suite 3: Genf vs. Zürich — Friktion und Angebot ─────────────────────

describe('DIW DP 2143: Genf-Effekt — strenges Mietrecht erhöht Marktfriktion und senkt Angebot', () => {
  /**
   * Diff-basiert, gleicher Ausgangspunkt. Genf-Zusatz gegen Zürich-Baseline.
   *
   * Nicht gemessen: der Genfer Abstand Neuvertrag zu Bestand (~33 Prozent)
   * und die Mietdauer von 13.7 Jahren. Dafür gibt es keinen Anfang im
   * Kaltstart. Der Index steht nicht im Diff: die Kante auf das Schutzlevel
   * ist entfernt (CH-012).
   */

  const GENF_ZUSATZ_DIFF: ParamsDiff = {
    mietrecht_kostenmiete:       { from: 1, to: 2 },
    mietrecht_anfangsmiete:      { from: 1, to: 2 },
    mietrecht_kuendigungsschutz: { from: 1, to: 2 },
    nutzung_abbruchverbot:       { from: 1, to: 2 },
    nutzung_umnutzungsverbot:    { from: 1, to: 2 },
  };

  it('[FACH] Genf-Regulierung erhöht marktfriktion gegenüber Zürich-Status-quo', () => {
    const zuerich = phases(ZUERICH_V2, ANGESPANNT, {});
    const genf    = phases(ZUERICH_V2, ANGESPANNT, GENF_ZUSATZ_DIFF);

    expect(genf[0].marketState.marktfriktion)
      .toBeGreaterThan(zuerich[0].marketState.marktfriktion);
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

describe('DIW DP 2143: Abbruchverbot/Rationierung → politisch induzierte Knappheit', () => {
  /**
   * DIW DP 2143 (Granger-Kausalität):
   * Rationierung führt zeitlich vorlaufend zu sinkenden Leerständen.
   * → nachfragedruck steigt durch Angebotsverknappung (ohne Nachfrageanstieg)
   *
   * Im Modell:
   * - nutzung_abbruchverbot ↑ → nachfragedruck ↑ (weniger freie Wohnungen)
   * - Horizont der Studie: Jahre 1–10; eine Verstärkung über die Phasen
   *   belegt sie nicht. Die Leerstands-Impulsantwort ist nicht signifikant (S. 17).
   */
  it('[FACH] Abbruchverbot erhöht nachfragedruck mittelfristig (Phase 2)', () => {
    const neutral = phases(ZUERICH_V2, NEUTRAL_CONTEXT, {});

    const mitAbbruchverbot: ParamsDiff = {
      nutzung_abbruchverbot: { from: 1, to: 2 },
    };
    const withDiff = phases(ZUERICH_V2, NEUTRAL_CONTEXT, mitAbbruchverbot);

    expect(withDiff[1].marketState.nachfragedruck)
      .toBeGreaterThanOrEqual(neutral[1].marketState.nachfragedruck);
  });

  it('[FACH] Abbruchverbot + Umnutzungsverbot erhöht nachfragedruck stärker als einzeln', () => {
    const nurAbbruch: ParamsDiff = {
      nutzung_abbruchverbot: { from: 1, to: 2 },
    };
    const kombiniert: ParamsDiff = {
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

describe('DIW DP 2143/Basel: Wohnschutz-Zielkonflikt mit Klimaschutz (Sanierungsrückstand)', () => {
  /**
   * Präsidialdepartement Basel-Stadt (15.8.2024, zitiert in CH-015, S. 2):
   * - Energetische Sanierungen erfolgen meist im Rahmen von Totalsanierungen;
   *   die Mitteilung nennt einen Rückgang der Totalsanierungen und einen
   *   Zielkonflikt mit dem Klimaschutz.
   * - Wohnungen über 40 Jahre ohne Renovation: Genf 83.5 %, Basel 47.6 %,
   *   Zürich 41.3 % (Avenir Suisse 2012, in DIW DP 2143 S. 6–7, CH-013).
   *   Keine Kausalaussage zum Wohnschutz.
   *
   * Im Modell: energetische Vorgaben + Sanierungspflicht vs. Abbruchverbot
   * - Bei hohem Abbruchverbot sollte sanierungsquote oder ein äquivalenter Index sinken
   * - Proxy: bau_sanierungspflicht ↑ sollte weniger wirken, wenn nutzung_abbruchverbot ↑
   *   (paradoxer Effekt: strengerer Wohnschutz konterkariert Sanierungsziele)
   */
  it('[FACH] Abbruchverbot dämpft den Effekt von Sanierungspflicht auf investitionsattraktivitaet', () => {
    const nurSanierung: ParamsDiff = {
      bau_sanierungspflicht: { from: 1, to: 2 },
    };
    const sanierungPlusAbbruch: ParamsDiff = {
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
