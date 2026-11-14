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
import type { GroupDriver, GroupId } from '../../groups';
import type { MarketState } from '../../../types';
import { REGIME_NEUTRAL } from '../market-state-fixtures';

const emptyState: MarketState = {
  angebotspotenzial: 0,
  nachfragedruck: 0,
  mietpreis_schutzlevel: 0,
  verdraengungsrisiko: 0,
  spekulationshemmung: 0,
  marktfriktion: 0,
  gemeinnuetzig_kraft: 0,
  eigentumsquoten_trend: 0,
  aufwertungsdruck: 0,
  investitionsattraktivitaet: 0,
  angebotspotenzial_regulation: 0,
  ...REGIME_NEUTRAL,
};

const allPositive: MarketState = {
  angebotspotenzial: 1, nachfragedruck: 1, mietpreis_schutzlevel: 1,
  verdraengungsrisiko: 1, spekulationshemmung: 1, marktfriktion: 1,
  gemeinnuetzig_kraft: 1, eigentumsquoten_trend: 1, aufwertungsdruck: 1,
  investitionsattraktivitaet: 1, angebotspotenzial_regulation: 1,
  ...REGIME_NEUTRAL,
};

const allNegative: MarketState = {
  angebotspotenzial: -1, nachfragedruck: -1, mietpreis_schutzlevel: -1,
  verdraengungsrisiko: -1, spekulationshemmung: -1, marktfriktion: -1,
  gemeinnuetzig_kraft: -1, eigentumsquoten_trend: -1, aufwertungsdruck: -1,
  investitionsattraktivitaet: -1, angebotspotenzial_regulation: -1,
  ...REGIME_NEUTRAL,
};

describe('computeGroupTrends — shape and invariants', () => {
  it('returns one entry per group in GROUPS', () => {
    const trends = computeGroupTrends(emptyState);
    expect(trends).toHaveLength(GROUPS.length);
    const ids = trends.map(t => t.group.id);
    for (const g of GROUPS) {
      expect(ids).toContain(g.id);
    }
  });

  it('each entry has group, value, drivers, tooltip fields', () => {
    const trends = computeGroupTrends(emptyState);
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
      const trends = computeGroupTrends(state);
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
      nachfragedruck: 1, marktfriktion: 0.5,
    };
    const trends = computeGroupTrends(tight);
    const angebot = trends.find(t => t.group.id === 'normalverdiener_angebot')!;
    const bestand = trends.find(t => t.group.id === 'normalverdiener_bestand')!;
    expect(angebot.value).toBeGreaterThan(bestand.value);
  });

  it('geringverdiener benefits from high mietpreis_schutzlevel (entlastet vs. empty state)', () => {
    const schutz: MarketState = {
      ...emptyState,
      mietpreis_schutzlevel: 1,
    };
    const trends = computeGroupTrends(schutz);
    const gering = trends.find(t => t.group.id === 'geringverdiener')!;
    const emptyTrends = computeGroupTrends(emptyState);
    const geringEmpty = emptyTrends.find(t => t.group.id === 'geringverdiener')!;
    expect(gering.value).toBeLessThan(geringEmpty.value);
  });

  it('rentner is more affected by verdraengungsrisiko than high_earner (rentner hat Verdrängungs-Komponente)', () => {
    const pressure: MarketState = { ...emptyState, verdraengungsrisiko: 1 };
    const trends = computeGroupTrends(pressure);
    const rentner = trends.find(t => t.group.id === 'rentner')!;
    const highEarner = trends.find(t => t.group.id === 'high_earner')!;
    expect(rentner.value).toBeGreaterThan(highEarner.value);
  });
});

describe('computeGroupTrends — tooltip', () => {
  it('tooltip contains "steigend" for high positive trend', () => {
    const pressure: MarketState = { ...emptyState, nachfragedruck: 1, marktfriktion: 1 };
    const trends = computeGroupTrends(pressure);
    const hasSteigend = trends.some(t => t.tooltip.includes('steigend'));
    expect(hasSteigend).toBe(true);
  });

  it('tooltip contains "sinkend" for strong negative trend', () => {
    const relief: MarketState = { ...emptyState, mietpreis_schutzlevel: 1, angebotspotenzial: 1 };
    const trends = computeGroupTrends(relief);
    const hasSinkend = trends.some(t => t.tooltip.includes('sinkend'));
    expect(hasSinkend).toBe(true);
  });

  it('tooltip nennt den stärksten Treiber, wenn Treiber übergeben werden', () => {
    const drivers = Object.fromEntries(GROUPS.map(g => [g.id, [
      { paramKey: 'mietrecht_kostenmiete', label: 'Kostenmiete', direction: 'down' as const, weight: 0.2 },
    ]])) as Record<GroupId, GroupDriver[]>;
    const gering = computeGroupTrends(emptyState, drivers).find(t => t.group.id === 'geringverdiener')!;
    expect(gering.drivers).toHaveLength(1);
    expect(gering.tooltip).toContain('Kostenmiete');
  });

  it('ohne übergebene Treiber bleibt die Treiberliste leer', () => {
    for (const t of computeGroupTrends(allPositive)) expect(t.drivers).toHaveLength(0);
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
