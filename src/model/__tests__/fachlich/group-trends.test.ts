/**
 * group-trends.test.ts — Blackbox-Tests für computeGroupTrends
 *
 * Testet die öffentliche API von groups.ts über beobachtbares Verhalten
 * (Range, Monotonie, Driver-Logik, Tooltip-Inhalt). KEINE Kopplung an
 * interne Per-Group-Faktoren (0.5, 1.2, 0.1, ...) oder Schwellwerte
 * (E1_DRIVER_THRESHOLD, TREND_CLASSIFY_THRESHOLD, TOP_N_DRIVERS) —
 * Implementation darf umgewichtet/refactored werden, solange die
 * dokumentierten Verhaltens-Invarianten erhalten bleiben.
 *
 * Dokumentiertes Verhalten:
 *   - computeGroupTrends: liefert einen Trend-Eintrag pro Gruppe in GROUPS
 *   - jeder Eintrag: value in [-1, 1], drivers (Array), tooltip (String)
 *   - drivers: Top-Treiber sortiert nach Gewicht, aufsteigend begrenzt
 *   - tooltip: enthält "steigend" / "sinkend" / "stabil" + Top-Treiber
 *
 * Bestehende Integration-Tests in gruppen-divergenz.test.ts (Bestand vs.
 * Angebot, Geringverdiener vs. Normalverdiener) bleiben unberührt.
 */

import { describe, it, expect } from 'vitest';
import { computeGroupTrends, GROUPS } from '../../groups';
import type { CityParams40, MarketState, ParamValue } from '../../../types';

const emptyState: MarketState = {
  angebotspotenzial: 0,
  nachfragedruck: 0,
  mietpreis_schutzlevel: 0,
  verdraengungsrisiko: 0,
  spekulationshemmung: 0,
  markfriktion: 0,
  gemeinnuetzig_kraft: 0,
  eigentumsquoten_trend: 0,
  aufwertungsdruck: 0,
  investitionsattraktivitaet: 0,
  angebotspotenzial_regulation: 0,
};

const allPositive: MarketState = {
  angebotspotenzial: 1, nachfragedruck: 1, mietpreis_schutzlevel: 1,
  verdraengungsrisiko: 1, spekulationshemmung: 1, markfriktion: 1,
  gemeinnuetzig_kraft: 1, eigentumsquoten_trend: 1, aufwertungsdruck: 1,
  investitionsattraktivitaet: 1, angebotspotenzial_regulation: 1,
};

const allNegative: MarketState = {
  angebotspotenzial: -1, nachfragedruck: -1, mietpreis_schutzlevel: -1,
  verdraengungsrisiko: -1, spekulationshemmung: -1, markfriktion: -1,
  gemeinnuetzig_kraft: -1, eigentumsquoten_trend: -1, aufwertungsdruck: -1,
  investitionsattraktivitaet: -1, angebotspotenzial_regulation: -1,
};

const NEUTRAL_PARAMS: CityParams40 = Object.fromEntries(
  Object.keys({
    raumplanung_zonenreserve: 0, raumplanung_verdichtung: 0, raumplanung_ausnuetzungsziffer: 0,
    boden_vorkaufsrecht: 0, boden_bauverpflichtung: 0, boden_mehrwertabgabe: 0, boden_bodeneigentumssteuer: 0,
    bau_energievorgaben: 0, bau_sanierungspflicht: 0,
    bau_einspracherecht_dritte: 0, bau_einspracherecht_suspensiv: 0,
    bau_bewilligungsverfahren: 0, bau_normenharmonisierung: 0,
    gemeinnuetzig_mindestanteil: 0, gemeinnuetzig_foerderfonds: 0, gemeinnuetzig_baurecht: 0,
    gemeinnuetzig_belegungsvorschriften: 0, gemeinnuetzig_sozialmischung: 0,
    mietrecht_kostenmiete: 0, mietrecht_anfangsmiete: 0, mietrecht_mietzinstransparenz: 0,
    mietrecht_kuendigungsschutz: 0, mietrecht_mietzinsindex: 0, mietrecht_untervermietung: 0,
    steuer_grundstueckgewinn: 0, steuer_eigenmietwert: 0, steuer_leerstandsabgabe: 0,
    steuer_handaenderung: 0, steuer_kapitalgewinnprivatpersonen: 0,
    kapital_auslaendische_investoren: 0, kapital_institutionelle_regulierung: 0, kapital_hypothekarregulierung: 0,
    nutzung_kurzzeitvermietung: 0, nutzung_umnutzungsverbot: 0, nutzung_abbruchverbot: 0, nutzung_zweitwohnungen: 0,
    infra_oepnv: 0, infra_schule_kita: 0, infra_oeffentlicher_raum: 0, infra_wirtschaftsansiedlung: 0,
    bau_ersatzneubau_effizienz: 0,
  }).map(k => [k, 1 as ParamValue])
) as unknown as CityParams40;

function withMod(p: CityParams40, k: keyof CityParams40, v: ParamValue): CityParams40 {
  return { ...p, [k]: v } as CityParams40;
}

describe('computeGroupTrends — shape and invariants', () => {
  it('returns one entry per group in GROUPS', () => {
    const trends = computeGroupTrends(emptyState, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    expect(trends).toHaveLength(GROUPS.length);
    const ids = trends.map(t => t.group.id);
    for (const g of GROUPS) {
      expect(ids).toContain(g.id);
    }
  });

  it('each entry has group, value, drivers, tooltip fields', () => {
    const trends = computeGroupTrends(emptyState, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    for (const t of trends) {
      expect(t.group).toBeDefined();
      expect(t.group.id).toBeTruthy();
      expect(typeof t.value).toBe('number');
      expect(Array.isArray(t.drivers)).toBe(true);
      expect(typeof t.tooltip).toBe('string');
      expect(t.tooltip.length).toBeGreaterThan(0);
    }
  });

  it('all values are clamped to [-1, 1] for any input', () => {
    for (const state of [emptyState, allPositive, allNegative]) {
      const trends = computeGroupTrends(state, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
      for (const t of trends) {
        expect(t.value).toBeGreaterThanOrEqual(-1);
        expect(t.value).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('computeGroupTrends — group divergence (sachlich)', () => {
  it('normalverdiener_angebot is more sensitive to positive market pressure than normalverdiener_bestand', () => {
    const tight: MarketState = {
      ...emptyState,
      nachfragedruck: 1, markfriktion: 0.5,
    };
    const trends = computeGroupTrends(tight, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    const angebot = trends.find(t => t.group.id === 'normalverdiener_angebot')!;
    const bestand = trends.find(t => t.group.id === 'normalverdiener_bestand')!;
    expect(angebot.value).toBeGreaterThan(bestand.value);
  });

  it('geringverdiener benefits from high mietpreis_schutzlevel (entlastet vs. empty state)', () => {
    const schutz: MarketState = {
      ...emptyState,
      mietpreis_schutzlevel: 1,
    };
    const trends = computeGroupTrends(schutz, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    const gering = trends.find(t => t.group.id === 'geringverdiener')!;
    const emptyTrends = computeGroupTrends(emptyState, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    const geringEmpty = emptyTrends.find(t => t.group.id === 'geringverdiener')!;
    expect(gering.value).toBeLessThan(geringEmpty.value);
  });

  it('rentner is more affected by verdraengungsrisiko than high_earner (rentner hat Verdrängungs-Komponente)', () => {
    const pressure: MarketState = { ...emptyState, verdraengungsrisiko: 1 };
    const trends = computeGroupTrends(pressure, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    const rentner = trends.find(t => t.group.id === 'rentner')!;
    const highEarner = trends.find(t => t.group.id === 'high_earner')!;
    expect(rentner.value).toBeGreaterThan(highEarner.value);
  });
});

describe('computeGroupTrends — driver logic', () => {
  it('returns no parameter drivers when baseline === modified (no diff)', () => {
    const trends = computeGroupTrends(allPositive, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    for (const t of trends) {
      const paramDrivers = t.drivers.filter(d => !d.paramKey.startsWith('ctx:') && d.paramKey !== 'aufwertungsdruck' && d.paramKey !== 'verdraengungsrisiko');
      expect(paramDrivers).toHaveLength(0);
    }
  });

  it('includes parameter driver when baseline differs from modified', () => {
    const modified = withMod(NEUTRAL_PARAMS, 'mietrecht_kostenmiete', 2 as ParamValue);
    const trends = computeGroupTrends(emptyState, NEUTRAL_PARAMS, modified);
    const gering = trends.find(t => t.group.id === 'geringverdiener')!;
    const kostenmieteDriver = gering.drivers.find(d => d.paramKey === 'mietrecht_kostenmiete');
    expect(kostenmieteDriver).toBeDefined();
    expect(kostenmieteDriver!.weight).toBeGreaterThan(0);
  });

  it('driver direction is "down" for positive parameter delta with "down"-effect (XOR-inversion)', () => {
    const modified = withMod(NEUTRAL_PARAMS, 'mietrecht_kostenmiete', 2 as ParamValue);
    const trends = computeGroupTrends(emptyState, NEUTRAL_PARAMS, modified);
    const gering = trends.find(t => t.group.id === 'geringverdiener')!;
    const driver = gering.drivers.find(d => d.paramKey === 'mietrecht_kostenmiete')!;
    // Kostenmiete ist "down"-Effekt: positives delta → "down" (Preise sinken)
    expect(driver.direction).toBe('down');
  });

  it('driver direction is "up" for positive parameter delta with "up"-effect', () => {
    const modified = withMod(NEUTRAL_PARAMS, 'bau_sanierungspflicht', 2 as ParamValue);
    const trends = computeGroupTrends(emptyState, NEUTRAL_PARAMS, modified);
    const gering = trends.find(t => t.group.id === 'geringverdiener')!;
    const driver = gering.drivers.find(d => d.paramKey === 'bau_sanierungspflicht')!;
    // Sanierungspflicht ist "up"-Effekt: positives delta → "up" (Preise steigen)
    expect(driver.direction).toBe('up');
  });

  it('driver direction inverts when parameter delta is negative (XOR-logic)', () => {
    const modified = withMod(NEUTRAL_PARAMS, 'bau_sanierungspflicht', 0 as ParamValue);
    const trends = computeGroupTrends(emptyState, NEUTRAL_PARAMS, modified);
    const gering = trends.find(t => t.group.id === 'geringverdiener')!;
    const driver = gering.drivers.find(d => d.paramKey === 'bau_sanierungspflicht')!;
    // Sanierungspflicht = "up"-Effekt, delta = 0 - 1 = -1 → invertiert zu "down"
    expect(driver.direction).toBe('down');
  });

  it('includes aufwertungsdruck driver when |aufwertungsdruck| is substantial', () => {
    const pressure: MarketState = { ...emptyState, aufwertungsdruck: 1 };
    const trends = computeGroupTrends(pressure, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    const hasAufwertungsdruck = trends.some(t =>
      t.drivers.some(d => d.paramKey === 'aufwertungsdruck')
    );
    expect(hasAufwertungsdruck).toBe(true);
  });

  it('excludes aufwertungsdruck driver when |aufwertungsdruck| is small', () => {
    const tiny: MarketState = { ...emptyState, aufwertungsdruck: 0.1 };
    const trends = computeGroupTrends(tiny, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    const hasAufwertungsdruck = trends.some(t =>
      t.drivers.some(d => d.paramKey === 'aufwertungsdruck')
    );
    expect(hasAufwertungsdruck).toBe(false);
  });

  it('includes verdraengungsrisiko driver when |verdraengungsrisiko| is substantial', () => {
    const pressure: MarketState = { ...emptyState, verdraengungsrisiko: 1 };
    const trends = computeGroupTrends(pressure, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    const hasVerdraengung = trends.some(t =>
      t.drivers.some(d => d.paramKey === 'verdraengungsrisiko')
    );
    expect(hasVerdraengung).toBe(true);
  });

  it('drivers are sorted by weight descending (top driver first)', () => {
    const modified: CityParams40 = {
      ...NEUTRAL_PARAMS,
      mietrecht_kostenmiete: 2 as ParamValue,
      mietrecht_kuendigungsschutz: 2 as ParamValue,
      bau_sanierungspflicht: 2 as ParamValue,
    };
    const trends = computeGroupTrends(allPositive, NEUTRAL_PARAMS, modified);
    for (const t of trends) {
      for (let i = 1; i < t.drivers.length; i++) {
        expect(t.drivers[i - 1].weight).toBeGreaterThanOrEqual(t.drivers[i].weight);
      }
    }
  });

  it('limits drivers to a small fixed number (Top-N UI-Konvention)', () => {
    const pressure: MarketState = {
      ...emptyState, aufwertungsdruck: 1, verdraengungsrisiko: 1, nachfragedruck: 1,
    };
    const modified: CityParams40 = {
      ...NEUTRAL_PARAMS,
      mietrecht_kostenmiete: 2 as ParamValue,
      mietrecht_kuendigungsschutz: 2 as ParamValue,
      bau_sanierungspflicht: 2 as ParamValue,
      raumplanung_verdichtung: 2 as ParamValue,
    };
    const trends = computeGroupTrends(pressure, NEUTRAL_PARAMS, modified);
    for (const t of trends) {
      expect(t.drivers.length).toBeLessThanOrEqual(5);
    }
  });
});

describe('computeGroupTrends — tooltip', () => {
  it('tooltip contains "steigend" for high positive trend', () => {
    const pressure: MarketState = { ...emptyState, nachfragedruck: 1, markfriktion: 1 };
    const trends = computeGroupTrends(pressure, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    const hasSteigend = trends.some(t => t.tooltip.includes('steigend'));
    expect(hasSteigend).toBe(true);
  });

  it('tooltip contains "sinkend" for strong negative trend', () => {
    const relief: MarketState = { ...emptyState, mietpreis_schutzlevel: 1, angebotspotenzial: 1 };
    const trends = computeGroupTrends(relief, NEUTRAL_PARAMS, NEUTRAL_PARAMS);
    const hasSinkend = trends.some(t => t.tooltip.includes('sinkend'));
    expect(hasSinkend).toBe(true);
  });

  it('tooltip mentions top driver when drivers are non-empty', () => {
    const modified = withMod(NEUTRAL_PARAMS, 'mietrecht_kostenmiete', 2 as ParamValue);
    const trends = computeGroupTrends(emptyState, NEUTRAL_PARAMS, modified);
    const gering = trends.find(t => t.group.id === 'geringverdiener')!;
    // Geringverdiener + Kostenmiete driver: tooltip should mention "Kostenmiete"
    if (gering.drivers.length > 0) {
      expect(gering.tooltip).toContain('Kostenmiete');
    } else {
      expect(gering.tooltip).toMatch(/steigend|sinkend|stabil/);
    }
  });
});

describe('GROUPS (public constant)', () => {
  it('contains unique group ids', () => {
    const ids = GROUPS.map(g => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every group has non-empty label, shortLabel and description', () => {
    for (const g of GROUPS) {
      expect(g.label.length).toBeGreaterThan(0);
      expect(g.shortLabel.length).toBeGreaterThan(0);
      expect(g.description.length).toBeGreaterThan(0);
    }
  });
});
