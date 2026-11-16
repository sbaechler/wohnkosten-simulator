// ============================================================
// dag-topology.ts — DAG topology for visualization
// E0/ctx→E1 aus PHASE_WEIGHTED_EDGES, E1→E2 aus den E2_TERMS
// von derived.ts — die Visualisierung zeigt damit exakt das
// Modell, das auch gerechnet wird.
// ============================================================

import { PHASE_WEIGHTED_EDGES, type PhaseEdge } from './phase-weights';
import { E2_TERMS } from './derived';
import { PERSISTENCE } from './compute-phases';

export type NodeId =
  | 'raumplanung_zonenreserve' | 'raumplanung_verdichtung' | 'raumplanung_ausnuetzungsziffer'
  | 'boden_vorkaufsrecht' | 'boden_bauverpflichtung' | 'boden_mehrwertabgabe' | 'boden_bodeneigentumssteuer'
  | 'bau_energievorgaben' | 'bau_sanierungspflicht' | 'bau_ersatzneubau_effizienz'
  | 'bau_einspracherecht_dritte' | 'bau_einspracherecht_suspensiv'
  | 'bau_bewilligungsverfahren' | 'bau_normenharmonisierung'
  | 'gemeinnuetzig_mindestanteil' | 'gemeinnuetzig_ausgleich' | 'gemeinnuetzig_foerderfonds' | 'gemeinnuetzig_baurecht'
  | 'gemeinnuetzig_belegungsvorschriften' | 'gemeinnuetzig_sozialmischung'
  | 'mietrecht_kostenmiete' | 'mietrecht_anfangsmiete' | 'mietrecht_mietzinstransparenz'
  | 'mietrecht_kuendigungsschutz' | 'mietrecht_mietzinsindex' | 'mietrecht_untervermietung'
  | 'steuer_grundstueckgewinn' | 'steuer_eigenmietwert' | 'steuer_leerstandsabgabe'
  | 'steuer_handaenderung' | 'steuer_kapitalgewinnprivatpersonen'
  | 'kapital_auslaendische_investoren' | 'kapital_institutionelle_regulierung' | 'kapital_hypothekarregulierung'
  | 'nutzung_kurzzeitvermietung' | 'nutzung_umnutzungsverbot' | 'nutzung_abbruchverbot' | 'nutzung_zweitwohnungen'
  | 'infra_oepnv' | 'infra_schule_kita' | 'infra_oeffentlicher_raum' | 'infra_wirtschaftsansiedlung'
  | 'ctx:zinsniveau' | 'ctx:zuwanderungsdruck' | 'ctx:wirtschaftskraft' | 'ctx:bevoelkerungstrend'
  | 'angebotspotenzial' | 'nachfragedruck' | 'mietpreis_schutzlevel' | 'verdraengungsrisiko'
  | 'spekulationshemmung' | 'marktfriktion' | 'gemeinnuetzig_kraft'
  | 'eigentumsquoten_trend' | 'aufwertungsdruck' | 'investitionsattraktivitaet'
  | 'angebotspotenzial_regulation'
  | 'gentrifizierungsindex' | 'neubau_hemmnisindex' | 'verdraengungsrisiko_index'
  | 'fiskalische_wirkung';

/**
 * Verlaufsklasse einer Kante, gelesen am Stand über die Phasen, nicht am
 * Impulsvektor (Verbesserungsplan Fix-10):
 *   - 'sofort':     der Stand ist in P1 schon nahe am Höchststand.
 *   - 'aufbauend':  der Stand wächst über die Phasen.
 *   - 'verzoegert': in P1 praktisch noch kein Stand.
 *   - 'annahme':    Politik-Kante mit `profilQuelle: 'Annahme'`. Ihr neutraler
 *                   Impuls `[w, w, w]` heisst «keine Verlaufsevidenz», nicht
 *                   «kurzfristig» und nicht «aufbauend».
 */
export type TimeClass = 'sofort' | 'aufbauend' | 'verzoegert' | 'annahme';

export interface Edge {
  from: NodeId;
  to: NodeId;
  sign: 1 | -1;
  weight: number;
  time: TimeClass;
}

/**
 * Ab diesem Anteil des Höchststandes in P1 gilt eine Kante als «sofort».
 * Gleiche Schwelle wie der Verlaufstest DE-004 (Berlin: ≥ 80 % in P1,
 * `verlauf-fachlich.test.ts`).
 */
export const SOFORT_ANTEIL_P1 = 0.8;

/**
 * Bis zu diesem Anteil des Höchststandes in P1 gilt eine Kante als
 * «verzögert». Gleiche Schwelle wie der Verlaufstest NZ-001 (Auckland:
 * ≤ 10 % in P1, `verlauf-fachlich.test.ts`).
 */
export const VERZOEGERT_ANTEIL_P1 = 0.1;

/**
 * Stand einer Kante über die drei Phasen bei konstantem Δ, so wie der
 * Generator in compute-phases.ts rechnet: Stand[p] = PERSISTENCE · Stand[p−1]
 * + Impuls[p].
 */
export function edgeStand(weights: readonly [number, number, number]): [number, number, number] {
  const s1 = weights[0];
  const s2 = PERSISTENCE * s1 + weights[1];
  const s3 = PERSISTENCE * s2 + weights[2];
  return [s1, s2, s3];
}

/** Verlaufsklasse einer E0/ctx → E1-Kante (siehe `TimeClass`). */
export function edgeTimeClass(edge: Pick<PhaseEdge, 'weights' | 'profilQuelle'>): TimeClass {
  if (edge.profilQuelle === 'Annahme') return 'annahme';
  const stand = edgeStand(edge.weights);
  const max = Math.max(...stand.map(Math.abs));
  if (max === 0) return 'annahme';
  const anteilP1 = Math.abs(stand[0]) / max;
  if (anteilP1 >= SOFORT_ANTEIL_P1) return 'sofort';
  if (anteilP1 <= VERZOEGERT_ANTEIL_P1) return 'verzoegert';
  return 'aufbauend';
}

/**
 * Projects phase-weighted edges to single-weight edges for visualization.
 * weight = grösster Impuls der Kante; time = Verlaufsklasse aus dem Stand
 * über die Phasen (`edgeTimeClass`).
 * E1→E2 edges come from derived.ts (E2_TERMS): weight is the coefficient
 * normalized to the largest coefficient of the same target (Alias-Kanten → 1.0);
 * E2 is computed instantaneously from E1, therefore time = 'sofort'
 * (E2 folgt E1 ohne eigene Verzögerung).
 */
export function getDagTopology(): readonly Edge[] {
  const e0e1: Edge[] = PHASE_WEIGHTED_EDGES.map(edge => ({
    from: edge.from as NodeId,
    to: edge.to as NodeId,
    sign: edge.sign,
    weight: Math.max(...edge.weights),
    time: edgeTimeClass(edge),
  }));

  const e1e2: Edge[] = Object.entries(E2_TERMS).flatMap(([target, terms]) => {
    const maxCoeff = Math.max(...terms.map(t => t.coeff));
    return terms.map(t => ({
      from: t.from as NodeId,
      to: target as NodeId,
      sign: t.sign,
      weight: t.coeff / maxCoeff,
      time: 'sofort' as const,
    }));
  });

  return [...e0e1, ...e1e2];
}

/**
 * Verlaufsklasse eines E0/ctx-Knotens für die Ansicht: die Klasse seiner
 * ausgehenden Kanten, wenn alle dieselbe haben; 'gemischt', wenn belegte
 * Kanten verschiedene Klassen haben oder belegte und Annahme-Kanten
 * zusammenkommen.
 */
export type NodeTimeClass = TimeClass | 'gemischt';

export function getNodeTimeClasses(): Partial<Record<NodeId, NodeTimeClass>> {
  const byNode = new Map<NodeId, Set<TimeClass>>();
  for (const edge of PHASE_WEIGHTED_EDGES) {
    const id = edge.from as NodeId;
    if (!byNode.has(id)) byNode.set(id, new Set());
    byNode.get(id)!.add(edgeTimeClass(edge));
  }
  const result: Partial<Record<NodeId, NodeTimeClass>> = {};
  for (const [id, classes] of byNode) {
    result[id] = classes.size === 1 ? [...classes][0] : 'gemischt';
  }
  return result;
}
