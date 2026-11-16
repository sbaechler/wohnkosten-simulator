/**
 * Die Kanten-Referenz wird generiert. Dieser Test hält sie auf dem Stand
 * des Codes und prüft, dass jeder Parameter seine Skalenrichtung nennt.
 */
import { describe, it, expect } from 'vitest';
import onDisk from '../../../../docs/architektur/01-graph-kanten.md?raw';
import { renderEdgeDoc } from '../../edge-doc';
import { paramMeta, PARAM_KEYS } from '../../params';
import { PHASE_WEIGHTED_EDGES } from '../../phase-weights';

describe('Kanten-Referenz', () => {
  it('docs/architektur/01-graph-kanten.md ist aktuell (sonst: npm run build:docs)', () => {
    expect(onDisk).toBe(renderEdgeDoc());
  });

  it('jeder Parameter nennt, was eine höhere Stufe bedeutet', () => {
    expect(paramMeta.map(m => m.key).sort()).toEqual([...PARAM_KEYS].sort());
    for (const meta of paramMeta) {
      expect(meta.hoeherBedeutet.trim().length, meta.key).toBeGreaterThan(5);
    }
  });

  it('jede Kante erscheint in der Referenz', () => {
    const doc = renderEdgeDoc();
    for (const edge of PHASE_WEIGHTED_EDGES) {
      expect(doc, `${edge.from} → ${edge.to}`).toContain(`\`${edge.from}\``);
    }
  });
});
