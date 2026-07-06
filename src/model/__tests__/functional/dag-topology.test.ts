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
 * - time is 'short' | 'medium' | 'long'
 * - The edge count matches PHASE_WEIGHTED_EDGES (1:1 projection)
 *
 * Run: npx vitest run src/model/__tests__/functional/dag-topology.test.ts
 */

import { describe, it, expect } from 'vitest';
import { getDagTopology } from '../../dag-topology';
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
    const validTimes = new Set(['short', 'medium', 'long']);
    const invalid = topology.filter((e) => !validTimes.has(e.time));
    expect(invalid).toHaveLength(0);
  });

  it('time class corresponds to the phase with maximum absolute weight (E0→E1)', () => {
    const sourceEdges = new Map(PHASE_WEIGHTED_EDGES.map((e) => [`${e.from}->${e.to}`, e]));
    for (const edge of e0e1Edges()) {
      const source = sourceEdges.get(`${edge.from}->${edge.to}`);
      expect(source).toBeDefined();
      const [p1, p2, p3] = source!.weights;
      const expectedTime =
        Math.abs(p1) >= Math.abs(p2) && Math.abs(p1) >= Math.abs(p3)
          ? 'short'
          : Math.abs(p2) >= Math.abs(p3)
            ? 'medium'
            : 'long';
      expect(edge.time).toBe(expectedTime);
    }
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
  it('every edge has time in {"short", "medium", "long"}', () => {
    const topology = getDagTopology();
    for (const e of topology) {
      expect(['short', 'medium', 'long']).toContain(e.time);
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

  it('time matches the phase with maximum |weight| in the source edge (E0→E1)', () => {
    const sourceEdges = new Map(PHASE_WEIGHTED_EDGES.map(e => [`${e.from}->${e.to}`, e]));
    for (const e of e0e1Edges()) {
      const source = sourceEdges.get(`${e.from}->${e.to}`)!;
      const [p1, p2, p3] = source.weights;
      const abs = [Math.abs(p1), Math.abs(p2), Math.abs(p3)];
      const expectedTime = abs[0] >= abs[1] && abs[0] >= abs[2]
        ? 'short'
        : abs[1] >= abs[2]
          ? 'medium'
          : 'long';
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
