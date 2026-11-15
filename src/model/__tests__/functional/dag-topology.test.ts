/**
 * dag-topology.test.ts — Functional
 *
 * Tests the topology projection in src/model/dag-topology.ts:
 * - All 11 E1 nodes have at least one incoming edge
 * - All 4 E2 nodes have at least one incoming edge
 * - All `to` keys are valid NodeIds
 * - All `from` keys are valid NodeIds
 * - sign is +1 or -1
 * - weight is a number in [0, 1] (since it comes from PHASE_WEIGHTED_EDGES which is in [0,1])
 * - time is 'sofort' | 'aufbauend' | 'verzoegert' | 'annahme', read from the
 *   Stand over the phases, not from the largest impulse (Fix-10)
 * - The edge count matches PHASE_WEIGHTED_EDGES (1:1 projection)
 *
 * Run: npx vitest run src/model/__tests__/functional/dag-topology.test.ts
 */

import { describe, it, expect } from 'vitest';
import { getDagTopology, getNodeTimeClasses, edgeStand, edgeTimeClass } from '../../dag-topology';
import { PHASE_WEIGHTED_EDGES } from '../../phase-weights';
import { E2_TERMS } from '../../derived';
import type { NodeId } from '../../dag-topology';

const NUM_E1E2_EDGES = Object.values(E2_TERMS).reduce((acc, terms) => acc + terms.length, 0);

/** E0/ctx→E1-Teilmenge der Topologie (aus PHASE_WEIGHTED_EDGES projiziert) */
function e0e1Edges() {
  const e2Targets = new Set(Object.keys(E2_TERMS));
  return getDagTopology().filter((e) => !e2Targets.has(e.to));
}

const E1_NODE_IDS: NodeId[] = [
  'angebotspotenzial',
  'nachfragedruck',
  'mietpreis_schutzlevel',
  'verdraengungsrisiko',
  'spekulationshemmung',
  'marktfriktion',
  'gemeinnuetzig_kraft',
  'eigentumsquoten_trend',
  'aufwertungsdruck',
  'investitionsattraktivitaet',
  'angebotspotenzial_regulation',
];

const E2_NODE_IDS: NodeId[] = [
  'gentrifizierungsindex',
  'neubau_hemmnisindex',
  'verdraengungsrisiko_index',
  'fiskalische_wirkung',
];

describe('getDagTopology', () => {
  it('returns one edge per PHASE_WEIGHTED_EDGES entry plus one per E2 term', () => {
    const topology = getDagTopology();
    expect(topology).toHaveLength(PHASE_WEIGHTED_EDGES.length + NUM_E1E2_EDGES);
  });

  it('every edge has a valid from key', () => {
    const topology = getDagTopology();
    const allValid = new Set<NodeId>([
      ...E1_NODE_IDS,
      ...E2_NODE_IDS,
      ...PHASE_WEIGHTED_EDGES.flatMap((e) => [e.from as NodeId]),
    ]);
    const invalid = topology.filter((e) => !allValid.has(e.from));
    expect(invalid).toHaveLength(0);
  });

  it('every edge has a valid to key (E1 or E2 node)', () => {
    const topology = getDagTopology();
    const allValid = new Set<NodeId>([...E1_NODE_IDS, ...E2_NODE_IDS]);
    const invalid = topology.filter((e) => !allValid.has(e.to));
    expect(invalid).toHaveLength(0);
  });

  it('every edge has sign of +1 or -1', () => {
    const topology = getDagTopology();
    const invalid = topology.filter((e) => e.sign !== 1 && e.sign !== -1);
    expect(invalid).toHaveLength(0);
  });

  it('every edge has a weight in [0, 1]', () => {
    const topology = getDagTopology();
    const invalid = topology.filter((e) => e.weight < 0 || e.weight > 1);
    expect(invalid).toHaveLength(0);
  });

  it('every edge has a valid time class', () => {
    const topology = getDagTopology();
    const validTimes = new Set(['sofort', 'aufbauend', 'verzoegert', 'annahme']);
    const invalid = topology.filter((e) => !validTimes.has(e.time));
    expect(invalid).toHaveLength(0);
  });

  // Bis 2026-11-15 las dieser Test die Phase mit dem grössten Impuls als
  // Zeitklasse. Seit Fix-10 ist das Gewicht der Impuls, nicht der Stand, und ein
  // neutraler Vektor [w, w, w] heisst «keine Verlaufsevidenz». Die Regel von
  // damals gab jede Annahme-Kante als «kurzfristig» aus.
  it('Annahme-Kanten (neutraler Impuls) erscheinen nie als «sofort», sondern als «annahme»', () => {
    const sourceEdges = new Map(PHASE_WEIGHTED_EDGES.map((e) => [`${e.from}->${e.to}`, e]));
    for (const edge of e0e1Edges()) {
      const source = sourceEdges.get(`${edge.from}->${edge.to}`)!;
      if (source.profilQuelle === 'Annahme') expect(edge.time).toBe('annahme');
      else expect(edge.time).not.toBe('annahme');
    }
  });

  it('Verlaufsklasse folgt dem Stand über die Phasen (Belegkanten aus verlauf-fachlich)', () => {
    const find = (from: string, to: string) =>
      e0e1Edges().find((e) => e.from === from && e.to === to)!.time;
    // DE-004 Berlin: Sprung und Halten
    expect(find('mietrecht_kostenmiete', 'mietpreis_schutzlevel')).toBe('sofort');
    // FR-003 Paris: der Stand wächst
    expect(find('mietrecht_anfangsmiete', 'mietpreis_schutzlevel')).toBe('aufbauend');
    // NZ-001 Auckland / AU-002 / US-005: in P1 praktisch nichts
    expect(find('raumplanung_verdichtung', 'angebotspotenzial')).toBe('verzoegert');
    expect(find('raumplanung_zonenreserve', 'angebotspotenzial')).toBe('verzoegert');
    expect(find('raumplanung_ausnuetzungsziffer', 'angebotspotenzial')).toBe('verzoegert');
    // KR-003: nur ein P1-Impuls, klingt danach ab → Höchststand in P1
    expect(find('kapital_hypothekarregulierung', 'nachfragedruck')).toBe('sofort');
    // GLOBAL-029: kumulativ
    expect(find('mietrecht_kostenmiete', 'angebotspotenzial')).toBe('aufbauend');
  });

  it('edgeStand rechnet wie der Generator (PERSISTENCE 0.8)', () => {
    const [s1, s2, s3] = edgeStand([1, 1, 1]);
    expect(s1).toBeCloseTo(1);
    expect(s2).toBeCloseTo(1.8);
    expect(s3).toBeCloseTo(2.44);
    // Neutraler Vektor ohne Annahme-Kennzeichnung (Kontextkante) wächst: aufbauend
    expect(edgeTimeClass({ weights: [0.5, 0.5, 0.5] })).toBe('aufbauend');
  });

  it('Knoten-Verlaufsklasse: nur Annahme-Kanten → annahme; gemischte Kanten → gemischt', () => {
    const classes = getNodeTimeClasses();
    expect(classes.infra_oepnv).toBe('annahme');
    expect(classes.raumplanung_zonenreserve).toBe('verzoegert');
    expect(classes.mietrecht_kostenmiete).toBe('gemischt');
  });

  it('at least one edge exists for each E1 node (consistent with phase-weights)', () => {
    const topology = getDagTopology();
    const nodesWithIncoming = new Set(topology.map((e) => e.to));
    const missing = E1_NODE_IDS.filter((n) => !nodesWithIncoming.has(n));
    expect(missing).toHaveLength(0);
  });

  it('at least one edge exists for each E2 node', () => {
    const topology = getDagTopology();
    const nodesWithIncoming = new Set(topology.map((e) => e.to));
    const missing = E2_NODE_IDS.filter((n) => !nodesWithIncoming.has(n));
    expect(missing).toHaveLength(0);
  });
});

describe('getDagTopology — invariants over the full edge set', () => {
  it('every edge has time in {"sofort", "aufbauend", "verzoegert", "annahme"}', () => {
    const topology = getDagTopology();
    for (const e of topology) {
      expect(['sofort', 'aufbauend', 'verzoegert', 'annahme']).toContain(e.time);
    }
  });

  it('every edge has sign in {+1, -1}', () => {
    const topology = getDagTopology();
    for (const e of topology) {
      expect([1, -1]).toContain(e.sign);
    }
  });

  it('every edge has finite numeric weight', () => {
    const topology = getDagTopology();
    for (const e of topology) {
      expect(typeof e.weight).toBe('number');
      expect(Number.isFinite(e.weight)).toBe(true);
    }
  });

  it('preserves the sign of each edge regardless of weight magnitude (E0→E1)', () => {
    const sourceEdges = new Map(PHASE_WEIGHTED_EDGES.map(e => [`${e.from}->${e.to}`, e]));
    for (const e of e0e1Edges()) {
      const source = sourceEdges.get(`${e.from}->${e.to}`)!;
      expect(e.sign).toBe(source.sign);
    }
  });

  it('time follows the Stand over the phases, not the largest impulse (E0→E1)', () => {
    // Ersetzt «time matches the phase with maximum |weight|» (bis 2026-11-15):
    // ein neutraler Impuls [w, w, w] ergab dort «short».
    const sourceEdges = new Map(PHASE_WEIGHTED_EDGES.map(e => [`${e.from}->${e.to}`, e]));
    for (const e of e0e1Edges()) {
      const source = sourceEdges.get(`${e.from}->${e.to}`)!;
      if (source.profilQuelle === 'Annahme') {
        expect(e.time).toBe('annahme');
        continue;
      }
      const stand = edgeStand(source.weights).map(Math.abs);
      const anteilP1 = stand[0] / Math.max(...stand);
      const expectedTime = anteilP1 >= 0.8 ? 'sofort' : anteilP1 <= 0.1 ? 'verzoegert' : 'aufbauend';
      expect(e.time).toBe(expectedTime);
    }
  });

  it('weight is the maximum of the 3 phase weights, not the sum (E0→E1)', () => {
    const sourceEdges = new Map(PHASE_WEIGHTED_EDGES.map(e => [`${e.from}->${e.to}`, e]));
    for (const e of e0e1Edges()) {
      const source = sourceEdges.get(`${e.from}->${e.to}`)!;
      const [p1, p2, p3] = source.weights;
      expect(e.weight).toBe(Math.max(p1, p2, p3));
    }
  });

  it('is deterministic (multiple calls return structurally equal results)', () => {
    const a = getDagTopology();
    const b = getDagTopology();
    expect(a).toEqual(b);
  });
});

describe('getDagTopology — single-source projection', () => {
  it('backs every E0→E1 edge by exactly one PHASE_WEIGHTED_EDGES entry', () => {
    const sourceEdges = new Map(PHASE_WEIGHTED_EDGES.map(e => [`${e.from}->${e.to}`, e]));
    for (const e of e0e1Edges()) {
      const source = sourceEdges.get(`${e.from}->${e.to}`);
      expect(source).toBeDefined();
    }
  });

  it('backs every E1→E2 edge by exactly one E2_TERMS entry with matching sign', () => {
    const topology = getDagTopology();
    for (const [target, terms] of Object.entries(E2_TERMS)) {
      const incoming = topology.filter((e) => e.to === target);
      expect(incoming).toHaveLength(terms.length);
      const maxCoeff = Math.max(...terms.map((t) => t.coeff));
      for (const t of terms) {
        const edge = incoming.find((e) => e.from === t.from);
        expect(edge).toBeDefined();
        expect(edge!.sign).toBe(t.sign);
        expect(edge!.weight).toBeCloseTo(t.coeff / maxCoeff, 10);
      }
    }
  });
});
