// ============================================================
// group-drivers.ts — Treiber der Gruppen-Preistrends
//
// Welcher geänderte Parameter bewegt den Preistrend einer Gruppe,
// in welche Richtung und wie stark? Die Antwort kommt aus der
// Rechnung selbst (Leave-one-out), nicht aus einer von Hand
// gepflegten Liste: Pipeline mit allen Änderungen gegen Pipeline
// ohne diesen einen Parameter, Differenz im Gruppen-Trend.
// ============================================================

import type { CityContext, ParamsDiff40 } from '../types';
import { computePhasesCached } from './compute-phases';
import { computeGroupTrends, GROUPS } from './groups';
import type { GroupDriver, GroupId } from './groups';
import { paramMeta40, changedParamKeys } from './params';

/**
 * Anzeige-Schwelle: Beiträge unter 0.005 Index-Punkten gelten nicht als
 * Treiber. Die Trends werden als Pfeile mit Schwelle ±0.15 gezeigt; ein
 * Beitrag dieser Grösse ist dort nicht sichtbar und wäre in der Treiberliste
 * irreführend. UI-Konvention, kein Modellwert.
 */
const DRIVER_MIN_BEITRAG = 0.005;

/** Anzahl angezeigter Treiber je Gruppe. UI-Konvention. */
const TOP_N_DRIVERS = 3;

const PARAM_LABEL = new Map<string, string>(paramMeta40.map(m => [m.key, m.label]));

function trendByGroup(context: CityContext, diff: ParamsDiff40): Array<Record<GroupId, number>> {
  return computePhasesCached(context, diff).map(phase =>
    Object.fromEntries(
      computeGroupTrends(phase.marketState, context).map(t => [t.group.id, t.value]),
    ) as Record<GroupId, number>,
  );
}

/**
 * Treiber je Phase und Gruppe.
 *
 * Beitrag eines Parameters = Trend mit allen Änderungen − Trend ohne diesen
 * Parameter. Richtung 'up' heisst: Die Änderung dieses Parameters hebt den
 * Preistrend der Gruppe. Bei mehreren Änderungen misst das den Grenzbeitrag
 * im Zusammenspiel mit den übrigen (Clamp und Regime sind nicht linear), die
 * Beiträge summieren sich deshalb nicht zwingend zur Gesamtänderung.
 *
 * @returns Ein Eintrag pro Phase (Index 0 = Phase 1).
 */
export function computeGroupDrivers(
  context: CityContext,
  diff: ParamsDiff40,
): Array<Record<GroupId, GroupDriver[]>> {
  const full = trendByGroup(context, diff);
  const result: Array<Record<GroupId, GroupDriver[]>> = full.map(() =>
    Object.fromEntries(GROUPS.map(g => [g.id, [] as GroupDriver[]])) as Record<GroupId, GroupDriver[]>,
  );

  // Nur wirklich geänderte Parameter; Begleiteinträge (from === to) sind keine Treiber.
  for (const paramKey of changedParamKeys(diff)) {
    const rest = { ...diff };
    delete rest[paramKey as keyof ParamsDiff40];
    const without = trendByGroup(context, rest);

    full.forEach((trends, phaseIdx) => {
      for (const group of GROUPS) {
        const beitrag = trends[group.id] - without[phaseIdx][group.id];
        if (Math.abs(beitrag) < DRIVER_MIN_BEITRAG) continue;
        result[phaseIdx][group.id].push({
          paramKey,
          label: PARAM_LABEL.get(paramKey) ?? paramKey,
          direction: beitrag > 0 ? 'up' : 'down',
          weight: Math.abs(beitrag),
        });
      }
    });
  }

  for (const phase of result) {
    for (const group of GROUPS) {
      phase[group.id] = phase[group.id]
        .sort((a, b) => b.weight - a.weight)
        .slice(0, TOP_N_DRIVERS);
    }
  }
  return result;
}
