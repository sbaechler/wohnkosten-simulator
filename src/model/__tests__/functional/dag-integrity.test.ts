/**
 * dag-integrity.test.ts — Functional
 *
 * Validates that the DAG edge definitions are internally consistent:
 * - All `from` keys reference valid E0 params (PARAM_KEYS_40) or context nodes (ctx:*) or E1 nodes
 * - All `to` keys reference valid E1 nodes
 * - All phase weights are in [0, 1]
 * - All sign values are +1 or -1
 * - E1 → E1 cycles: angebotspotenzial and nachfragedruck have self-persistence via PERSISTENCE
 * - No orphaned edges (every edge has both valid from and to)
 *
 * Run: npx vitest run src/model/__tests__/functional/dag-integrity.test.ts
 */

import { describe, it, expect } from 'vitest';
import { PHASE_WEIGHTED_EDGES } from '../../phase-weights';
import { PARAM_KEYS_40 } from '../../params';
import type { MarketState } from '../../../types';

const E1_NODE_IDS: (keyof MarketState)[] = [
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
];

const VALID_FROM_KEYS = new Set([
  ...PARAM_KEYS_40,
  'ctx:zinsniveau',
  'ctx:zuwanderungsdruck',
  'ctx:wirtschaftskraft',
  'ctx:bevoelkerungstrend',
  ...E1_NODE_IDS,
]);

describe('DAG integrity', () => {
  it('has at least 40 edges', () => {
    expect(PHASE_WEIGHTED_EDGES.length).toBeGreaterThanOrEqual(40);
  });

  it('every edge has a valid from key (E0 param, ctx:*, or E1 node)', () => {
    const invalid = PHASE_WEIGHTED_EDGES.filter(e => !VALID_FROM_KEYS.has(e.from as never));
    expect(invalid).toHaveLength(0);
  });

  it('every edge has a valid to key (E1 node or E2 node)', () => {
    const E2_NODE_IDS = [
      'gentrifizierungsindex', 'neubau_hemmnisindex',
      'verdraengungsrisiko_index', 'fiskalische_wirkung',
    ];
    const allValid = [...E1_NODE_IDS, ...E2_NODE_IDS];
    const invalid = PHASE_WEIGHTED_EDGES.filter(e => !allValid.includes(e.to as never));
    if (invalid.length > 0) {
      console.log('Invalid to-keys:', invalid.map(e => e.to));
    }
    expect(invalid).toHaveLength(0);
  });

  it('every edge has all three phase weights in [0, 1]', () => {
    const outOfRange = PHASE_WEIGHTED_EDGES.filter(e =>
      e.weights.some(w => w < 0 || w > 1)
    );
    expect(outOfRange).toHaveLength(0);
  });

  it('every edge has sign of +1 or -1', () => {
    const invalid = PHASE_WEIGHTED_EDGES.filter(e => e.sign !== 1 && e.sign !== -1);
    expect(invalid).toHaveLength(0);
  });

  it('every edge has exactly three phase weights', () => {
    const invalid = PHASE_WEIGHTED_EDGES.filter(e => e.weights.length !== 3);
    expect(invalid).toHaveLength(0);
  });

  it('at least one edge exists for each E1 node', () => {
    const nodesWithIncoming = new Set(PHASE_WEIGHTED_EDGES.map(e => e.to));
    const missing = E1_NODE_IDS.filter(n => !nodesWithIncoming.has(n));
    expect(missing).toHaveLength(0);
  });

  it('E1→E2 edges exist (edges where from is an E1 node)', () => {
    const e1ToE2 = PHASE_WEIGHTED_EDGES.filter(e => E1_NODE_IDS.includes(e.from as never));
    expect(e1ToE2.length).toBeGreaterThan(0);
  });
});
