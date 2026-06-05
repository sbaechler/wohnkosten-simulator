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
import type { NodeId } from '../../dag-topology';

const E1_NODE_IDS: NodeId[] = [
  'angebotspotenzial',
  'nachfragedruck',
  'mietpreis_schutzlevel',
  'verdraengungsrisiko',
  'spekulationshemmung',
  'markfriktion',
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
  it('returns exactly one edge per PHASE_WEIGHTED_EDGES entry', () => {
    const topology = getDagTopology();
    expect(topology).toHaveLength(PHASE_WEIGHTED_EDGES.length);
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

  it('time class corresponds to the phase with maximum absolute weight', () => {
    const topology = getDagTopology();
    const sourceEdges = new Map(PHASE_WEIGHTED_EDGES.map((e) => [`${e.from}->${e.to}`, e]));
    for (const edge of topology) {
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
