// ============================================================
// edge-doc.ts — erzeugt docs/architektur/01-graph-kanten.md
//
// Die Kanten-Referenz wird aus dem Code generiert, damit sie nicht
// veraltet. Schreiben: `npm run build:docs`. Ein Test prüft, dass die
// Datei auf dem Stand des Codes ist.
//
// Jede Zeile nennt, was eine höhere Stufe des Parameters bedeutet
// (`hoeherBedeutet`), und die Wirkung in Worten. So lässt sich ein
// Vorzeichen gegen die Skala prüfen statt gegen den Parameternamen.
// ============================================================

import type { MarketState } from '../types';
import { PHASE_WEIGHTED_EDGES } from './phase-weights';
import { E1_NODES } from './compute-phases';
import { E2_TERMS } from './derived';
import { paramMeta40, contextMeta } from './params';
import { PHASE_YEAR_LABELS } from './phases';

type E1Node = (typeof E1_NODES)[number];

/** Was ein POSITIVER Wert des E1-Knotens bedeutet. */
export const E1_PLUS_BEDEUTET: Record<E1Node, string> = {
  angebotspotenzial: 'mehr Angebot möglich',
  nachfragedruck: 'mehr Nachfragedruck',
  mietpreis_schutzlevel: 'stärkerer Schutz der Bestandsmieten',
  verdraengungsrisiko: 'höheres Verdrängungsrisiko',
  spekulationshemmung: 'Spekulation stärker gehemmt',
  marktfriktion: 'trägerer Markt, weniger Wechsel',
  gemeinnuetzig_kraft: 'stärkerer gemeinnütziger Sektor',
  eigentumsquoten_trend: 'Trend zu mehr Wohneigentum',
  aufwertungsdruck: 'mehr Aufwertungsdruck',
  investitionsattraktivitaet: 'attraktiver für Investoren',
  angebotspotenzial_regulation: 'unelastischeres Angebot (reagiert weniger auf Preise)',
};

function quelle(from: string): { name: string; hoeher: string } {
  if (from.startsWith('ctx:')) {
    const key = from.slice(4);
    const meta = contextMeta.find(m => m.key === key);
    if (!meta) throw new Error(`Kontextfaktor ohne Metadaten: ${from}`);
    return { name: `\`${from}\``, hoeher: `${meta.label}: ${meta.levels[4]}` };
  }
  const meta = paramMeta40.find(m => m.key === from);
  if (!meta) throw new Error(`Parameter ohne Metadaten: ${from}`);
  return { name: `\`${from}\``, hoeher: meta.hoeherBedeutet };
}

function gewichte(w: readonly [number, number, number]): string {
  return w.map(v => v.toFixed(1)).join(' / ');
}

/** Markdown der Kanten-Referenz. Deterministisch, ohne Datum. */
export function renderEdgeDoc(): string {
  const out: string[] = [];
  out.push('# Graph-Kanten — Referenz');
  out.push('');
  out.push('> **Generiert** aus `src/model/phase-weights.ts`, `params.ts` und `derived.ts`.');
  out.push('> Nicht von Hand editieren. Neu erzeugen: `npm run build:docs`.');
  out.push('');
  out.push('## Lesehilfe');
  out.push('');
  out.push('- **Höhere Stufe bedeutet:** was ein Schritt des Schiebers nach rechts (0 → 2) inhaltlich heisst. Bei Kontextfaktoren der Wert +2.');
  out.push('- **Wirkung:** was mit dem Zielknoten geschieht, wenn die Stufe steigt. Sinkt die Stufe, kehrt sich die Wirkung um.');
  out.push(`- **Impulse:** neuer Anstoss je Phase (${PHASE_YEAR_LABELS.join(', ')}), 0.0 = keiner, 1.0 = voller. Der Stand einer Phase ist das Resultat der Vorphase plus der Impuls dieser Phase (Generator in \`compute-phases.ts\`). Ein Impuls ist also nicht das erreichte Niveau.`);
  out.push('');
  out.push(`Kanten gesamt: ${PHASE_WEIGHTED_EDGES.length}.`);
  out.push('');
  out.push('## E0 und Kontext → E1');

  for (const node of E1_NODES) {
    const edges = PHASE_WEIGHTED_EDGES.filter(e => e.to === node);
    out.push('');
    out.push(`### \`${node}\``);
    out.push('');
    out.push(`Positiver Wert: ${E1_PLUS_BEDEUTET[node]}. Eingehende Kanten: ${edges.length}.`);
    out.push('');
    out.push('| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |');
    out.push('|---|---|---|---|');
    for (const e of edges) {
      const q = quelle(e.from);
      const wirkung = e.sign === 1 ? `erhöht → ${E1_PLUS_BEDEUTET[node]}` : `senkt → weniger: ${E1_PLUS_BEDEUTET[node]}`;
      out.push(`| ${q.name} | ${q.hoeher} | ${wirkung} | ${gewichte(e.weights)} |`);
    }
  }

  const ohneKante = paramMeta40.filter(m => !PHASE_WEIGHTED_EDGES.some(e => e.from === m.key));
  out.push('');
  out.push('## Parameter ohne Kante');
  out.push('');
  if (ohneKante.length === 0) {
    out.push('Keine.');
  } else {
    out.push('Diese Parameter wirken nicht über die lineare Kantensumme (Mietrechts-Regime, siehe `mietrecht-regime.ts`):');
    out.push('');
    for (const m of ohneKante) out.push(`- \`${m.key}\` — ${m.hoeherBedeutet}`);
  }

  out.push('');
  out.push('## E1 → E2');
  out.push('');
  out.push('Gewichtete Summe, geteilt durch die Summe der Koeffizienten. Keine Phasengewichte: E2 wird in jeder Phase aus dem E1-Stand dieser Phase gerechnet.');
  for (const [indikator, terms] of Object.entries(E2_TERMS)) {
    out.push('');
    out.push(`### \`${indikator}\``);
    out.push('');
    out.push('| E1-Knoten | Koeffizient | Richtung |');
    out.push('|---|---|---|');
    for (const t of terms) {
      const from = t.from as keyof MarketState;
      out.push(`| \`${from}\` | ${t.coeff.toFixed(1)} | ${t.sign === 1 ? 'erhöht' : 'senkt'} |`);
    }
  }
  out.push('');
  return out.join('\n');
}
