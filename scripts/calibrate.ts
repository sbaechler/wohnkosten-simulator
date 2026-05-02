#!/usr/bin/env npx tsx
/**
 * calibrate.ts — Gradient-Descent Kalibrierung der DAG-Gewichte
 *
 * Optimiert die 246 Phasen-Gewichte (82 Kanten × 3 Phasen) so, dass alle
 * fachlichen Tests (research-basierte Constraints) erfüllt werden.
 *
 * Usage: npx tsx scripts/calibrate.ts [--dry-run] [--iterations N] [--lr RATE]
 *
 * Flags:
 *   --dry-run       Nur Constraints prüfen, keine Optimierung
 *   --iterations N  Max Iterationen (default: 2000)
 *   --lr RATE       Learning Rate (default: 0.05)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PHASE_WEIGHTED_EDGES } from '../src/model/phase-weights.js';
import { cities } from '../src/generated/cities.js';
import type { CityContext, CityParams40, ParamsDiff40, MarketState, DerivedIndicators } from '../src/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ═══════════════════════════════════════════════════════════════════════════════
// 1. FORWARD PASS — Reproduces compute-phases.ts + derived.ts with mutable weights
// ═══════════════════════════════════════════════════════════════════════════════

interface EdgeTemplate {
  from: string;
  to: string;
  sign: 1 | -1;
}

// Extract the edge structure (immutable) from PHASE_WEIGHTED_EDGES
const EDGE_TEMPLATES: EdgeTemplate[] = PHASE_WEIGHTED_EDGES.map(e => ({
  from: e.from,
  to: e.to,
  sign: e.sign,
}));

const NUM_EDGES = EDGE_TEMPLATES.length;
const NUM_WEIGHTS = NUM_EDGES * 3; // 3 phases per edge

// Extract initial weights as flat array [e0p0, e0p1, e0p2, e1p0, e1p1, e1p2, ...]
function extractWeights(): number[] {
  const w: number[] = [];
  for (const edge of PHASE_WEIGHTED_EDGES) {
    w.push(edge.weights[0], edge.weights[1], edge.weights[2]);
  }
  return w;
}

const E1_NODES = [
  'angebotspotenzial', 'nachfragedruck', 'mietpreis_schutzlevel',
  'verdraengungsrisiko', 'spekulationshemmung', 'markfriktion',
  'gemeinnuetzig_kraft', 'eigentumsquoten_trend', 'aufwertungsdruck',
  'investitionsattraktivitaet',
] as const;

const PERSISTENCE = 0.8;

function clamp(v: number, lo = -1, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

function normalizeContext(v: number): number { return v / 2; }
function normalizeDiff(diff: number): number { return diff / 2; }

function getE0Delta(nodeId: string, diff: ParamsDiff40, context: CityContext): number {
  if (nodeId.startsWith('ctx:')) {
    const ctxKey = nodeId.slice(4) as keyof CityContext;
    return normalizeContext(context[ctxKey]);
  }
  const paramKey = nodeId as keyof CityParams40;
  const d = diff[paramKey];
  if (!d) return 0;
  return normalizeDiff((d.to as number) - (d.from as number));
}

interface PhaseOutput {
  marketState: MarketState;
  derived: DerivedIndicators;
}

/**
 * Run the full 3-phase pipeline with given weights.
 * weights: flat array of length NUM_WEIGHTS
 */
function forwardPass(
  weights: number[],
  context: CityContext,
  _params: CityParams40,
  diff: ParamsDiff40,
): PhaseOutput[] {
  const results: PhaseOutput[] = [];
  let carryE1: MarketState | null = null;

  for (let phase = 0; phase < 3; phase++) {
    const newState = {} as MarketState;

    for (const nodeId of E1_NODES) {
      const prevValue = carryE1 ? carryE1[nodeId] : 0;

      // Find all edges targeting this node
      const incomingIndices: number[] = [];
      for (let i = 0; i < NUM_EDGES; i++) {
        if (EDGE_TEMPLATES[i].to === nodeId) incomingIndices.push(i);
      }

      if (incomingIndices.length === 0) {
        newState[nodeId] = clamp(prevValue * PERSISTENCE);
        continue;
      }

      let numerator = 0;
      let denominator = 0;

      for (const edgeIdx of incomingIndices) {
        const edge = EDGE_TEMPLATES[edgeIdx];
        const delta = getE0Delta(edge.from, diff, context);
        const w = weights[edgeIdx * 3 + phase];
        numerator += edge.sign * w * delta;
        denominator += Math.abs(w);
      }

      const weightedSum = denominator === 0 ? 0 : numerator / denominator;
      newState[nodeId] = clamp(prevValue * PERSISTENCE + weightedSum);
    }

    // E2 derived indicators (fixed formulas from derived.ts)
    const gi_num = 1.5 * newState.aufwertungsdruck
                 + 1.5 * (1 - newState.mietpreis_schutzlevel)
                 + 1.5 * newState.verdraengungsrisiko
                 + 1.0 * (1 - newState.gemeinnuetzig_kraft);
    const gi_den = 1.5 + 1.5 + 1.5 + 1.0;

    const fw_num = 1.5 * newState.spekulationshemmung
                 + 1.0 * (1 - newState.markfriktion)
                 + 1.0 * newState.gemeinnuetzig_kraft
                 + 0.8 * newState.aufwertungsdruck;
    const fw_den = 1.5 + 1.0 + 1.0 + 0.8;

    const derived: DerivedIndicators = {
      gentrifizierungsindex: clamp(gi_num / gi_den),
      neubau_hemmnisindex: clamp(-newState.angebotspotenzial),
      verdraengungsrisiko_index: clamp(newState.verdraengungsrisiko),
      fiskalische_wirkung: clamp(fw_num / fw_den),
    };

    carryE1 = newState;
    results.push({ marketState: newState, derived });
  }

  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CONSTRAINT DEFINITIONS — Extracted from fachlich tests
// ═══════════════════════════════════════════════════════════════════════════════

interface Constraint {
  id: string;
  context: CityContext;
  baseline: CityParams40;
  diffA: ParamsDiff40;     // "with change" scenario
  diffB: ParamsDiff40;     // "without change" / reference scenario
  phase: 0 | 1 | 2;
  field: string;           // e.g. "marketState.angebotspotenzial"
  relation: 'gt' | 'lt' | 'gte' | 'lte'; // A relation B
}

function getField(output: PhaseOutput, field: string): number {
  const [group, key] = field.split('.');
  if (group === 'marketState') return output.marketState[key as keyof MarketState];
  if (group === 'derived') return output.derived[key as keyof DerivedIndicators];
  throw new Error(`Unknown field: ${field}`);
}

// ── City baselines and contexts used in tests ─────────────────────────────────

const BERLIN_BASELINE: CityParams40 = {
  raumplanung_zonenreserve: 2, raumplanung_verdichtung: 2, raumplanung_ausnuetzungsziffer: 2,
  boden_vorkaufsrecht: 1, boden_bauverpflichtung: 1, boden_mehrwertabgabe: 1, boden_bodeneigentumssteuer: 1,
  bau_energievorgaben: 1, bau_sanierungspflicht: 1,
  bau_einspracherecht_dritte: 2, bau_einspracherecht_suspensiv: 2,
  bau_bewilligungsverfahren: 1, bau_normenharmonisierung: 1,
  gemeinnuetzig_mindestanteil: 1, gemeinnuetzig_foerderfonds: 1, gemeinnuetzig_baurecht: 1,
  gemeinnuetzig_belegungsvorschriften: 1, gemeinnuetzig_sozialmischung: 1,
  mietrecht_kostenmiete: 2, mietrecht_anfangsmiete: 2, mietrecht_mietzinstransparenz: 2,
  mietrecht_kuendigungsschutz: 2, mietrecht_mietzinsindex: 2, mietrecht_untervermietung: 2,
  steuer_grundstueckgewinn: 1, steuer_eigenmietwert: 1, steuer_leerstandsabgabe: 1,
  steuer_handaenderung: 1, steuer_kapitalgewinnprivatpersonen: 1,
  kapital_auslaendische_investoren: 1, kapital_institutionelle_regulierung: 1, kapital_hypothekarregulierung: 1,
  nutzung_kurzzeitvermietung: 1, nutzung_umnutzungsverbot: 1, nutzung_abbruchverbot: 1, nutzung_zweitwohnungen: 1,
  infra_oepnv: 2, infra_schule_kita: 2, infra_oeffentlicher_raum: 2, infra_wirtschaftsansiedlung: 2,
};

const BERLIN_CTX: CityContext = { zinsniveau: -1, zuwanderungsdruck: 2, wirtschaftskraft: 2, bevoelkerungstrend: 2 };

const ZUERICH_V2: CityParams40 = {
  raumplanung_zonenreserve: 2, raumplanung_verdichtung: 2, raumplanung_ausnuetzungsziffer: 2,
  boden_vorkaufsrecht: 1, boden_bauverpflichtung: 1, boden_mehrwertabgabe: 1, boden_bodeneigentumssteuer: 1,
  bau_energievorgaben: 1, bau_sanierungspflicht: 1,
  bau_einspracherecht_dritte: 2, bau_einspracherecht_suspensiv: 2,
  bau_bewilligungsverfahren: 2, bau_normenharmonisierung: 2,
  gemeinnuetzig_mindestanteil: 2, gemeinnuetzig_foerderfonds: 2, gemeinnuetzig_baurecht: 2,
  gemeinnuetzig_belegungsvorschriften: 1, gemeinnuetzig_sozialmischung: 1,
  mietrecht_kostenmiete: 1, mietrecht_anfangsmiete: 1, mietrecht_mietzinstransparenz: 1,
  mietrecht_kuendigungsschutz: 1, mietrecht_mietzinsindex: 1, mietrecht_untervermietung: 1,
  steuer_grundstueckgewinn: 2, steuer_eigenmietwert: 2, steuer_leerstandsabgabe: 1,
  steuer_handaenderung: 2, steuer_kapitalgewinnprivatpersonen: 1,
  kapital_auslaendische_investoren: 1, kapital_institutionelle_regulierung: 1, kapital_hypothekarregulierung: 1,
  nutzung_kurzzeitvermietung: 1, nutzung_umnutzungsverbot: 1, nutzung_abbruchverbot: 1, nutzung_zweitwohnungen: 1,
  infra_oepnv: 2, infra_schule_kita: 2, infra_oeffentlicher_raum: 2, infra_wirtschaftsansiedlung: 2,
};

const ZH_CTX: CityContext = { zinsniveau: -1, zuwanderungsdruck: 2, wirtschaftskraft: 2, bevoelkerungstrend: 2 };
const NEUTRAL_CTX: CityContext = { zinsniveau: 0, zuwanderungsdruck: 0, wirtschaftskraft: 0, bevoelkerungstrend: 0 };
const ANGESPANNT: CityContext = { zinsniveau: -1, zuwanderungsdruck: 2, wirtschaftskraft: 2, bevoelkerungstrend: 2 };

const LOCKERE_BASIS: CityParams40 = {
  ...ZUERICH_V2,
  raumplanung_ausnuetzungsziffer: 0 as const,
  raumplanung_verdichtung: 0 as const,
  bau_bewilligungsverfahren: 0 as const,
};

// Helper: create modified baseline
function withOverrides(base: CityParams40, overrides: Partial<CityParams40>): CityParams40 {
  return { ...base, ...overrides } as CityParams40;
}

// ── Constraints from all fachlich tests ───────────────────────────────────────

const BASE_CONSTRAINTS: Constraint[] = [
  // ═══ mietrecht-fachlich.test.ts ═══

  // Berlin Mietendeckel: mietpreis_schutzlevel steigt
  {
    id: 'mietrecht-berlin-schutzlevel-p0',
    context: BERLIN_CTX, baseline: BERLIN_BASELINE,
    diffA: { mietrecht_anfangsmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 }, mietrecht_mietzinsindex: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.mietpreis_schutzlevel', relation: 'gt',
  },
  // Berlin: investitionsattraktivitaet sinkt langfristig
  {
    id: 'mietrecht-berlin-investition-p2',
    context: BERLIN_CTX, baseline: BERLIN_BASELINE,
    diffA: { mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_anfangsmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 } },
    diffB: {},
    phase: 2, field: 'marketState.investitionsattraktivitaet', relation: 'lt',
  },
  // CH-003: Anfechtungsrecht erhöht markfriktion
  {
    id: 'mietrecht-ch003-markfriktion-p0',
    context: BERLIN_CTX, baseline: BERLIN_BASELINE,
    diffA: { mietrecht_mietzinstransparenz: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.markfriktion', relation: 'gt',
  },
  // Kurzzeitvermietung erhöht spekulationshemmung
  {
    id: 'mietrecht-airbnb-spekulation-p0',
    context: BERLIN_CTX, baseline: BERLIN_BASELINE,
    diffA: { nutzung_kurzzeitvermietung: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.spekulationshemmung', relation: 'gt',
  },
  // FR-002 Paris: mietpreis_schutzlevel steigt
  {
    id: 'mietrecht-paris-schutzlevel-p0',
    context: BERLIN_CTX, baseline: BERLIN_BASELINE,
    diffA: { mietrecht_anfangsmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 }, mietrecht_mietzinsindex: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.mietpreis_schutzlevel', relation: 'gt',
  },
  // GLOBAL-029: Mieteingriff senkt angebotspotenzial langfristig
  {
    id: 'mietrecht-global029-angebot-p2',
    context: BERLIN_CTX, baseline: withOverrides(BERLIN_BASELINE, { mietrecht_kostenmiete: 0, mietrecht_anfangsmiete: 0, mietrecht_kuendigungsschutz: 0 }),
    diffA: { mietrecht_kostenmiete: { from: 0, to: 2 }, mietrecht_anfangsmiete: { from: 0, to: 2 }, mietrecht_kuendigungsschutz: { from: 0, to: 2 } },
    diffB: {},
    phase: 2, field: 'marketState.angebotspotenzial', relation: 'lt',
  },
  // GLOBAL-029: Mieteingriff erhöht neubau_hemmnisindex
  {
    id: 'mietrecht-global029-hemmnis-p2',
    context: BERLIN_CTX, baseline: withOverrides(BERLIN_BASELINE, { mietrecht_kostenmiete: 0, mietrecht_kuendigungsschutz: 0 }),
    diffA: { mietrecht_kostenmiete: { from: 0, to: 2 }, mietrecht_kuendigungsschutz: { from: 0, to: 2 } },
    diffB: {},
    phase: 2, field: 'derived.neubau_hemmnisindex', relation: 'gt',
  },
  // CH-004: Kündigungsschutz erhöht Marktfriktion
  {
    id: 'mietrecht-ch004-friktion-p0',
    context: BERLIN_CTX, baseline: withOverrides(BERLIN_BASELINE, { mietrecht_kuendigungsschutz: 0 }),
    diffA: { mietrecht_kuendigungsschutz: { from: 0, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.markfriktion', relation: 'gt',
  },
  // CH-005: Strenges Mietrecht senkt Fluktuation (markfriktion steigt)
  {
    id: 'mietrecht-ch005-fluktuation-p0',
    context: BERLIN_CTX, baseline: withOverrides(BERLIN_BASELINE, { mietrecht_kuendigungsschutz: 0, mietrecht_kostenmiete: 0 }),
    diffA: { mietrecht_kuendigungsschutz: { from: 0, to: 2 }, mietrecht_kostenmiete: { from: 0, to: 2 }, mietrecht_mietzinsindex: { from: 0, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.markfriktion', relation: 'gt',
  },
  // CH-005: Preisspreizung (uses marktfriktion which is a typo in test — markfriktion)
  {
    id: 'mietrecht-ch005-preisspreizung-p0',
    context: BERLIN_CTX, baseline: withOverrides(BERLIN_BASELINE, { mietrecht_kuendigungsschutz: 0, mietrecht_kostenmiete: 0 }),
    diffA: { mietrecht_kuendigungsschutz: { from: 0, to: 2 }, mietrecht_kostenmiete: { from: 0, to: 2 }, mietrecht_mietzinsindex: { from: 0, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.markfriktion', relation: 'gt',
  },

  // ═══ bodenrecht-fachlich.test.ts ═══

  // Minneapolis Upzoning: angebotspotenzial steigt P3
  {
    id: 'boden-minneapolis-angebot-p2',
    context: ZH_CTX, baseline: LOCKERE_BASIS,
    diffA: { raumplanung_ausnuetzungsziffer: { from: 0, to: 2 }, raumplanung_verdichtung: { from: 0, to: 2 } },
    diffB: {},
    phase: 2, field: 'marketState.angebotspotenzial', relation: 'gt',
  },
  // Minneapolis: neubau_hemmnisindex sinkt
  {
    id: 'boden-minneapolis-hemmnis-p2',
    context: ZH_CTX, baseline: LOCKERE_BASIS,
    diffA: { raumplanung_ausnuetzungsziffer: { from: 0, to: 2 }, raumplanung_verdichtung: { from: 0, to: 2 } },
    diffB: {},
    phase: 2, field: 'derived.neubau_hemmnisindex', relation: 'lt',
  },
  // Minneapolis: aufwertungsdruck steigt kurzfristig
  {
    id: 'boden-minneapolis-aufwertung-p0',
    context: ZH_CTX, baseline: LOCKERE_BASIS,
    diffA: { raumplanung_ausnuetzungsziffer: { from: 0, to: 2 }, raumplanung_verdichtung: { from: 0, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.aufwertungsdruck', relation: 'gt',
  },
  // Bodensteuer senkt aufwertungsdruck
  {
    id: 'boden-lvt-aufwertung-p0',
    context: NEUTRAL_CTX, baseline: ZUERICH_V2,
    diffA: { boden_bodeneigentumssteuer: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.aufwertungsdruck', relation: 'lt',
  },
  // Bodensteuer erhöht spekulationshemmung
  {
    id: 'boden-lvt-spekulation-p0',
    context: NEUTRAL_CTX, baseline: ZUERICH_V2,
    diffA: { boden_bodeneigentumssteuer: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.spekulationshemmung', relation: 'gt',
  },
  // Auckland: kombinierte Reform erhöht Angebotspotenzial
  {
    id: 'boden-auckland-angebot-p2',
    context: ZH_CTX, baseline: withOverrides(ZUERICH_V2, { raumplanung_ausnuetzungsziffer: 0, raumplanung_verdichtung: 0, bau_bewilligungsverfahren: 0 }),
    diffA: { raumplanung_ausnuetzungsziffer: { from: 0, to: 2 }, raumplanung_verdichtung: { from: 0, to: 2 }, bau_bewilligungsverfahren: { from: 0, to: 2 } },
    diffB: {},
    phase: 2, field: 'marketState.angebotspotenzial', relation: 'gt',
  },
  // Einspracherecht senkt Angebotspotenzial
  {
    id: 'boden-einsprache-angebot-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { bau_einspracherecht_dritte: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.angebotspotenzial', relation: 'lt',
  },
  // Suspensiveffekt stärker als Dritte-Einsprache
  {
    id: 'boden-suspensiv-vs-dritte-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { bau_einspracherecht_suspensiv: { from: 1, to: 2 } },
    diffB: { bau_einspracherecht_dritte: { from: 1, to: 2 } },
    phase: 0, field: 'marketState.angebotspotenzial', relation: 'lt',
  },
  // CH-007: Zonenreserve senkt nachfragedruck (NOTE: this tests zonenreserve which has sign=-1 for angebotspotenzial!)
  {
    id: 'boden-ch007-nachfrage-p2',
    context: ZH_CTX, baseline: withOverrides(ZUERICH_V2, { raumplanung_zonenreserve: 0 }),
    diffA: { raumplanung_zonenreserve: { from: 0, to: 2 } },
    diffB: {},
    phase: 2, field: 'marketState.nachfragedruck', relation: 'lt',
  },
  // CH-008: Verdichtung erhöht Verdrängungsrisiko
  {
    id: 'boden-ch008-verdraengung-p0',
    context: ZH_CTX, baseline: withOverrides(ZUERICH_V2, { raumplanung_verdichtung: 0 }),
    diffA: { raumplanung_verdichtung: { from: 0, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.verdraengungsrisiko', relation: 'gt',
  },
  // CH-009: Verdichtung erhöht Gentrifizierungsindex
  {
    id: 'boden-ch009-gentri-p0',
    context: ZH_CTX, baseline: withOverrides(ZUERICH_V2, { raumplanung_verdichtung: 0 }),
    diffA: { raumplanung_verdichtung: { from: 0, to: 2 } },
    diffB: {},
    phase: 0, field: 'derived.gentrifizierungsindex', relation: 'gt',
  },
  // CH-008: Verdichtung erhöht Angebotspotenzial
  {
    id: 'boden-ch008-angebot-p2',
    context: ZH_CTX, baseline: withOverrides(ZUERICH_V2, { raumplanung_verdichtung: 0 }),
    diffA: { raumplanung_verdichtung: { from: 0, to: 2 } },
    diffB: {},
    phase: 2, field: 'marketState.angebotspotenzial', relation: 'gt',
  },

  // ═══ steuer-kapital-fachlich.test.ts ═══

  // Handänderungssteuer erhöht markfriktion
  {
    id: 'steuer-handaenderung-friktion-p0',
    context: NEUTRAL_CTX, baseline: ZUERICH_V2,
    diffA: { steuer_handaenderung: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.markfriktion', relation: 'gt',
  },
  // Handänderungssteuer erhöht spekulationshemmung
  {
    id: 'steuer-handaenderung-spekulation-p0',
    context: NEUTRAL_CTX, baseline: ZUERICH_V2,
    diffA: { steuer_handaenderung: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.spekulationshemmung', relation: 'gt',
  },
  // Lex Koller senkt nachfragedruck
  {
    id: 'kapital-lexkoller-nachfrage-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { kapital_auslaendische_investoren: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.nachfragedruck', relation: 'lt',
  },
  // Lex Koller senkt investitionsattraktivitaet
  {
    id: 'kapital-lexkoller-investition-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { kapital_auslaendische_investoren: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.investitionsattraktivitaet', relation: 'lt',
  },
  // Hypothekarregulierung senkt nachfragedruck
  {
    id: 'kapital-hypo-nachfrage-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { kapital_hypothekarregulierung: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.nachfragedruck', relation: 'lt',
  },
  // Hypothekarregulierung senkt eigentumsquoten_trend
  {
    id: 'kapital-hypo-eigentum-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { kapital_hypothekarregulierung: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.eigentumsquoten_trend', relation: 'lt',
  },
  // Kapitalgewinnbesteuerung erhöht spekulationshemmung
  {
    id: 'steuer-kapgew-spekulation-p0',
    context: NEUTRAL_CTX, baseline: ZUERICH_V2,
    diffA: { steuer_kapitalgewinnprivatpersonen: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.spekulationshemmung', relation: 'gt',
  },
  // Grundstückgewinnsteuer erhöht spekulationshemmung
  {
    id: 'steuer-grundstgew-spekulation-p0',
    context: NEUTRAL_CTX, baseline: ZUERICH_V2,
    diffA: { steuer_grundstueckgewinn: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.spekulationshemmung', relation: 'gt',
  },
  // Eigenmietwert senkt eigentumsquoten_trend
  {
    id: 'steuer-emw-eigentum-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { steuer_eigenmietwert: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.eigentumsquoten_trend', relation: 'lt',
  },
  // Eigenmietwert senkt nachfragedruck
  {
    id: 'steuer-emw-nachfrage-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { steuer_eigenmietwert: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.nachfragedruck', relation: 'lt',
  },
  // CH-006: Zweitwohnungsbeschränkung senkt angebotspotenzial (paradox)
  {
    id: 'steuer-ch006-angebot-p2',
    context: ZH_CTX, baseline: withOverrides(ZUERICH_V2, { nutzung_zweitwohnungen: 0 }),
    diffA: { nutzung_zweitwohnungen: { from: 0, to: 2 } },
    diffB: {},
    phase: 2, field: 'marketState.angebotspotenzial', relation: 'lt',
  },
  // AT-002: Gemeinnützig senkt nachfragedruck
  {
    id: 'steuer-at002-nachfrage-p0',
    context: ZH_CTX, baseline: withOverrides(ZUERICH_V2, { gemeinnuetzig_mindestanteil: 0, gemeinnuetzig_foerderfonds: 0, gemeinnuetzig_baurecht: 0 }),
    diffA: { gemeinnuetzig_mindestanteil: { from: 0, to: 2 }, gemeinnuetzig_foerderfonds: { from: 0, to: 2 }, gemeinnuetzig_baurecht: { from: 0, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.nachfragedruck', relation: 'lt',
  },

  // ═══ gemeinnuetzig-fachlich.test.ts ═══

  // Vancouver EHT: spekulationshemmung steigt
  {
    id: 'gemeinnuetzig-eht-spekulation-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { steuer_leerstandsabgabe: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.spekulationshemmung', relation: 'gt',
  },
  // NYC LL18: Kurzzeitvermietung senkt verdraengungsrisiko
  {
    id: 'gemeinnuetzig-ll18-verdraengung-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { nutzung_kurzzeitvermietung: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.verdraengungsrisiko', relation: 'lt',
  },
  // Barcelona: Kurzzeitvermietung senkt investitionsattraktivitaet
  {
    id: 'gemeinnuetzig-barcelona-invest-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { nutzung_kurzzeitvermietung: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.investitionsattraktivitaet', relation: 'lt',
  },
  // Hoher Mindestanteil senkt Gentrifizierungsindex
  {
    id: 'gemeinnuetzig-mindest-gentri-p0',
    context: ZH_CTX,
    baseline: withOverrides(ZUERICH_V2, { gemeinnuetzig_mindestanteil: 0, gemeinnuetzig_foerderfonds: 0, gemeinnuetzig_baurecht: 0 }),
    diffA: { gemeinnuetzig_mindestanteil: { from: 0, to: 2 }, gemeinnuetzig_foerderfonds: { from: 0, to: 2 }, gemeinnuetzig_baurecht: { from: 0, to: 2 } },
    diffB: {},
    phase: 0, field: 'derived.gentrifizierungsindex', relation: 'lt',
  },
  // Foerderfonds erhöht angebotspotenzial
  {
    id: 'gemeinnuetzig-fonds-angebot-p2',
    context: ZH_CTX, baseline: withOverrides(ZUERICH_V2, { gemeinnuetzig_foerderfonds: 0 }),
    diffA: { gemeinnuetzig_foerderfonds: { from: 0, to: 2 } },
    diffB: {},
    phase: 2, field: 'marketState.angebotspotenzial', relation: 'gt',
  },
  // Abbruchverbot senkt verdraengungsrisiko
  {
    id: 'gemeinnuetzig-abbruch-verdraengung-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.verdraengungsrisiko', relation: 'lt',
  },
  // Abbruchverbot senkt angebotspotenzial (FHNW)
  {
    id: 'gemeinnuetzig-abbruch-angebot-p0',
    context: ZH_CTX, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.angebotspotenzial', relation: 'lt',
  },

  // ═══ wohnschutz-fachlich.test.ts ═══

  // Rationierung senkt angebotspotenzial stärker als Mietpreisregulierung
  {
    id: 'wohnschutz-rationierung-vs-mietrecht-angebot-p0',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 } },
    diffB: { mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_anfangsmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 } },
    phase: 0, field: 'marketState.angebotspotenzial', relation: 'lt',
  },
  // Rationierung senkt investitionsattraktivitaet stärker als Mietpreisregulierung (P3)
  {
    id: 'wohnschutz-rationierung-vs-mietrecht-invest-p2',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 } },
    diffB: { mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_anfangsmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 } },
    phase: 2, field: 'marketState.investitionsattraktivitaet', relation: 'lt',
  },
  // Basel Wohnschutz: neubau_hemmnisindex steigt
  {
    id: 'wohnschutz-basel-hemmnis-p0',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 }, mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'derived.neubau_hemmnisindex', relation: 'gt',
  },
  // Basel Wohnschutz: angebotspotenzial sinkt (P2)
  {
    id: 'wohnschutz-basel-angebot-p1',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 }, mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 } },
    diffB: {},
    phase: 1, field: 'marketState.angebotspotenzial', relation: 'lt',
  },
  // Basel Wohnschutz: investitionsattraktivitaet sinkt P1
  {
    id: 'wohnschutz-basel-invest-p0',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 }, mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.investitionsattraktivitaet', relation: 'lt',
  },
  // Basel Wohnschutz: investitionsattraktivitaet sinkt P3
  {
    id: 'wohnschutz-basel-invest-p2',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 }, mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 } },
    diffB: {},
    phase: 2, field: 'marketState.investitionsattraktivitaet', relation: 'lt',
  },
  // Genf-Regulierung erhöht markfriktion
  {
    id: 'wohnschutz-genf-friktion-p0',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_anfangsmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 }, mietrecht_mietzinsindex: { from: 1, to: 2 }, nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.markfriktion', relation: 'gt',
  },
  // Genf-Regulierung erhöht mietpreis_schutzlevel
  {
    id: 'wohnschutz-genf-schutz-p0',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_anfangsmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 }, mietrecht_mietzinsindex: { from: 1, to: 2 }, nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.mietpreis_schutzlevel', relation: 'gt',
  },
  // Genf senkt angebotspotenzial (P2)
  {
    id: 'wohnschutz-genf-angebot-p1',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { mietrecht_kostenmiete: { from: 1, to: 2 }, mietrecht_anfangsmiete: { from: 1, to: 2 }, mietrecht_kuendigungsschutz: { from: 1, to: 2 }, mietrecht_mietzinsindex: { from: 1, to: 2 }, nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 } },
    diffB: {},
    phase: 1, field: 'marketState.angebotspotenzial', relation: 'lt',
  },
  // Abbruchverbot erhöht nachfragedruck P2 (gte)
  {
    id: 'wohnschutz-abbruch-nachfrage-p1',
    context: NEUTRAL_CTX, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 } },
    diffB: {},
    phase: 1, field: 'marketState.nachfragedruck', relation: 'gte',
  },
  // Abbruchverbot + Umnutzungsverbot stärker als einzeln (gte)
  {
    id: 'wohnschutz-abbruch-umnutzung-nachfrage-p1',
    context: NEUTRAL_CTX, baseline: ZUERICH_V2,
    diffA: { nutzung_abbruchverbot: { from: 1, to: 2 }, nutzung_umnutzungsverbot: { from: 1, to: 2 } },
    diffB: { nutzung_abbruchverbot: { from: 1, to: 2 } },
    phase: 1, field: 'marketState.nachfragedruck', relation: 'gte',
  },
  // Abbruchverbot dämpft Sanierungseffekt auf investitionsattraktivitaet (lte)
  {
    id: 'wohnschutz-abbruch-sanierung-invest-p1',
    context: ANGESPANNT, baseline: ZUERICH_V2,
    diffA: { bau_sanierungspflicht: { from: 1, to: 2 }, nutzung_abbruchverbot: { from: 1, to: 2 } },
    diffB: { bau_sanierungspflicht: { from: 1, to: 2 } },
    phase: 1, field: 'marketState.investitionsattraktivitaet', relation: 'lte',
  },

  // ═══ infrastruktur-fachlich.test.ts ═══

  // OEPNV erhöht aufwertungsdruck
  {
    id: 'infra-oepnv-aufwertung-p0',
    context: NEUTRAL_CTX,
    baseline: withOverrides(ZUERICH_V2, { infra_oepnv: 0 }),
    diffA: { infra_oepnv: { from: 0, to: 2 } },
    diffB: {},
    phase: 0, field: 'marketState.aufwertungsdruck', relation: 'gt',
  },
  // Kombinierter OEPNV + Wirtschaft stärker als einzeln
  {
    id: 'infra-oepnv-wirtschaft-aufwertung-p1',
    context: ZH_CTX,
    baseline: withOverrides(ZUERICH_V2, { infra_oepnv: 0, infra_wirtschaftsansiedlung: 0 }),
    diffA: { infra_oepnv: { from: 0, to: 2 }, infra_wirtschaftsansiedlung: { from: 0, to: 2 } },
    diffB: { infra_oepnv: { from: 0, to: 2 } },
    phase: 1, field: 'marketState.aufwertungsdruck', relation: 'gt',
  },

  // ═══ international-fachlich.test.ts ═══

  // Singapur: Kombination Vorkauf + Gemeinnützig senkt gentri stärker als nur Vorkauf
  {
    id: 'intl-sg-kombiniert-gentri-p0',
    context: ANGESPANNT,
    baseline: withOverrides(ZUERICH_V2, { boden_vorkaufsrecht: 0, gemeinnuetzig_mindestanteil: 0, gemeinnuetzig_foerderfonds: 0, gemeinnuetzig_baurecht: 0 }),
    diffA: { boden_vorkaufsrecht: { from: 0, to: 2 }, gemeinnuetzig_mindestanteil: { from: 0, to: 2 }, gemeinnuetzig_foerderfonds: { from: 0, to: 2 }, gemeinnuetzig_baurecht: { from: 0, to: 2 } },
    diffB: { boden_vorkaufsrecht: { from: 0, to: 2 } },
    phase: 0, field: 'derived.gentrifizierungsindex', relation: 'lt',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 3. DYNAMIC CITY EXPANSION — Multiply constraints by all 10 cities
// ═══════════════════════════════════════════════════════════════════════════════

function expandConstraintsForCities(base: Constraint[]): Constraint[] {
  const expanded: Constraint[] = [...base]; // Keep originals

  for (const city of cities) {
    for (const c of base) {
      // Skip constraints that use non-standard baselines (modified params)
      // Only expand constraints that use the standard test baselines
      const isStandardBaseline = (
        c.baseline === BERLIN_BASELINE ||
        c.baseline === ZUERICH_V2 ||
        c.baseline === LOCKERE_BASIS
      );
      if (!isStandardBaseline) continue;

      // Create city variant: use city's params as baseline & context
      expanded.push({
        ...c,
        id: `${c.id}@${city.slug}`,
        context: city.context,
        baseline: city.params,
      });
    }
  }

  return expanded;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. LOSS FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

const EPSILON = 0.001; // Minimum margin

function computeLoss(weights: number[], constraints: Constraint[]): { total: number; violations: number; details: { id: string; margin: number }[] } {
  let total = 0;
  let violations = 0;
  const details: { id: string; margin: number }[] = [];

  for (const c of constraints) {
    const resultA = forwardPass(weights, c.context, c.baseline, c.diffA);
    const resultB = forwardPass(weights, c.context, c.baseline, c.diffB);
    const valA = getField(resultA[c.phase], c.field);
    const valB = getField(resultB[c.phase], c.field);

    let margin: number;
    if (c.relation === 'gt') {
      margin = valA - valB;
    } else if (c.relation === 'lt') {
      margin = valB - valA;
    } else if (c.relation === 'gte') {
      margin = valA - valB + EPSILON; // gte needs no strict margin
    } else { // lte
      margin = valB - valA + EPSILON;
    }

    const loss = Math.max(0, EPSILON - margin);
    if (loss > 0) {
      violations++;
      details.push({ id: c.id, margin });
    }
    total += loss;
  }

  return { total, violations, details };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. OPTIMIZER — Numerical Gradient Descent
// ═══════════════════════════════════════════════════════════════════════════════

function optimize(
  initialWeights: number[],
  constraints: Constraint[],
  maxIter: number,
  lr: number,
): number[] {
  const weights = [...initialWeights];
  const h = 1e-4; // finite difference step
  const lrDecay = 0.999;
  let currentLr = lr;

  console.log(`\n🔧 Starting optimization: ${weights.length} weights, ${constraints.length} constraints`);
  console.log(`   Learning rate: ${lr}, Max iterations: ${maxIter}\n`);

  const initial = computeLoss(weights, constraints);
  console.log(`   Initial loss: ${initial.total.toFixed(6)} (${initial.violations} violations)\n`);

  if (initial.violations === 0) {
    console.log('✅ All constraints already satisfied! No optimization needed.');
    return weights;
  }

  for (let iter = 0; iter < maxIter; iter++) {
    // Compute gradient via central finite differences
    const grad = new Float64Array(weights.length);

    // Only compute gradients for weights that affect violated constraints
    for (let i = 0; i < weights.length; i++) {
      const saved = weights[i];

      weights[i] = Math.min(1, saved + h);
      const lossPlus = computeLoss(weights, constraints).total;

      weights[i] = Math.max(0, saved - h);
      const lossMinus = computeLoss(weights, constraints).total;

      weights[i] = saved;
      grad[i] = (lossPlus - lossMinus) / (2 * h);
    }

    // Update weights
    for (let i = 0; i < weights.length; i++) {
      weights[i] -= currentLr * grad[i];
      weights[i] = Math.max(0, Math.min(1, weights[i])); // Box constraint
    }

    currentLr *= lrDecay;

    // Log progress
    if ((iter + 1) % 50 === 0 || iter === 0) {
      const { total, violations, details } = computeLoss(weights, constraints);
      console.log(`   Iter ${(iter + 1).toString().padStart(4)}: loss=${total.toFixed(6)} violations=${violations} lr=${currentLr.toFixed(6)}`);
      if (violations > 0 && violations <= 5) {
        for (const d of details) {
          console.log(`      ❌ ${d.id}: margin=${d.margin.toFixed(6)}`);
        }
      }
      if (total < 1e-8) {
        console.log('\n✅ Converged! All constraints satisfied.');
        break;
      }
    }
  }

  const final = computeLoss(weights, constraints);
  console.log(`\n📊 Final: loss=${final.total.toFixed(6)} violations=${final.violations}/${constraints.length}`);
  if (final.violations > 0) {
    console.log('\n   Remaining violations:');
    for (const d of final.details) {
      console.log(`      ❌ ${d.id}: margin=${d.margin.toFixed(6)}`);
    }
  }

  return weights;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. OUTPUT — Write optimized weights back to phase-weights.ts
// ═══════════════════════════════════════════════════════════════════════════════

function writeWeights(weights: number[]): void {
  const filePath = resolve(__dirname, '../src/model/phase-weights.ts');
  const original = readFileSync(filePath, 'utf-8');

  // Reconstruct PHASE_WEIGHTED_EDGES with new weights
  const edges = PHASE_WEIGHTED_EDGES.map((edge, i) => ({
    from: edge.from,
    to: edge.to,
    sign: edge.sign,
    weights: [
      +weights[i * 3].toFixed(4),
      +weights[i * 3 + 1].toFixed(4),
      +weights[i * 3 + 2].toFixed(4),
    ] as const,
  }));

  // Find comment blocks for each edge in original file
  void original; // unused — kept for documentation of original approach

  // Simpler approach: rebuild the file preserving comments
  // Find the array start and end, replace edge objects
  const arrayStart = original.indexOf('export const PHASE_WEIGHTED_EDGES');
  const arrayEnd = original.lastIndexOf('] as const;');

  if (arrayStart === -1 || arrayEnd === -1) {
    console.error('❌ Could not find PHASE_WEIGHTED_EDGES in file');
    return;
  }

  const header = original.slice(0, arrayStart);
  const footer = original.slice(arrayEnd);

  // Generate new array content with original comments preserved
  let newContent = 'export const PHASE_WEIGHTED_EDGES: readonly {\n';
  newContent += '  from: string;\n  to: string;\n  sign: 1 | -1;\n  weights: readonly [number, number, number];\n}[] = [\n';

  // Extract comments from original
  void edgeRegex;
  void commentRegex; // unused — kept for documentation of original approach
  
  // Parse original to extract per-edge comments
  const arrayContent = original.slice(arrayStart, arrayEnd);
  const edgeBlocks = arrayContent.split(/(?=\{\s*from:)/g).filter(b => b.includes('from:'));

  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    const block = edgeBlocks[i] || '';
    
    // Extract section comments (lines before the edge object)
    const preComments = block.split('{')[0]?.trim();
    if (preComments) {
      newContent += '\n' + preComments.split('\n').map(l => '  ' + l.trim()).join('\n') + '\n';
    }

    // Extract inline/block comments within the edge
    const inlineComment = block.match(/weights:\s*\[[^\]]+\],?\s*(\/\/[^\n]*)/)?.[1] || '';
    
    newContent += `  {\n`;
    newContent += `    from: '${e.from}',\n`;
    newContent += `    to: '${e.to}',\n`;
    newContent += `    sign: ${e.sign > 0 ? '+1' : '-1'},\n`;
    newContent += `    weights: [${e.weights.join(', ')}],${inlineComment ? ' ' + inlineComment : ''}\n`;
    newContent += `  },\n`;
  }

  newContent += '\n';

  writeFileSync(filePath, header + newContent + footer, 'utf-8');
  console.log(`\n💾 Written optimized weights to ${filePath}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. MAIN
// ═══════════════════════════════════════════════════════════════════════════════

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const maxIter = parseInt(args[args.indexOf('--iterations') + 1] || '2000');
const lr = parseFloat(args[args.indexOf('--lr') + 1] || '0.05');

console.log('═══════════════════════════════════════════════════════════');
console.log('  Wohnkosten-Simulator — DAG Weight Calibration');
console.log('═══════════════════════════════════════════════════════════');
console.log(`\n📊 Edge templates: ${NUM_EDGES}`);
console.log(`📊 Total weights:  ${NUM_WEIGHTS}`);
console.log(`📊 Base constraints: ${BASE_CONSTRAINTS.length}`);

// Expand for all cities
const allConstraints = expandConstraintsForCities(BASE_CONSTRAINTS);
console.log(`📊 Total constraints (with city expansion): ${allConstraints.length}`);

const initialWeights = extractWeights();

// Dry run: just check constraints
const { total, violations, details } = computeLoss(initialWeights, allConstraints);
console.log(`\n📋 Current state: loss=${total.toFixed(6)}, violations=${violations}/${allConstraints.length}`);

if (violations > 0) {
  console.log('\n   Violated constraints:');
  // Group by base constraint id (strip @city suffix)
  const grouped = new Map<string, string[]>();
  for (const d of details) {
    const baseId = d.id.replace(/@.*$/, '');
    if (!grouped.has(baseId)) grouped.set(baseId, []);
    grouped.get(baseId)!.push(d.id);
  }
  for (const [baseId, ids] of grouped) {
    const cityCount = ids.filter(id => id.includes('@')).length;
    const baseViolated = ids.some(id => !id.includes('@'));
    console.log(`   ❌ ${baseId}: base=${baseViolated ? 'FAIL' : 'ok'}, cities=${cityCount}/10 fail`);
  }
}

if (isDryRun) {
  console.log('\n🏁 Dry run complete.');
  process.exit(violations > 0 ? 1 : 0);
}

if (violations === 0) {
  console.log('\n✅ All constraints satisfied! No calibration needed.');
  process.exit(0);
}

// Run optimization
const optimized = optimize(initialWeights, allConstraints, maxIter, lr);

// Verify
const final = computeLoss(optimized, allConstraints);
if (final.violations === 0) {
  console.log('\n✅ All constraints satisfied after optimization!');
  writeWeights(optimized);
} else {
  console.log(`\n⚠️  ${final.violations} constraints still violated. Writing anyway...`);
  writeWeights(optimized);
}

// Show weight changes
console.log('\n📊 Weight changes (top 20 largest):');
const changes: { edge: string; phase: number; from: number; to: number; delta: number }[] = [];
for (let i = 0; i < NUM_EDGES; i++) {
  for (let p = 0; p < 3; p++) {
    const idx = i * 3 + p;
    const delta = Math.abs(optimized[idx] - initialWeights[idx]);
    if (delta > 0.001) {
      changes.push({
        edge: `${EDGE_TEMPLATES[i].from} → ${EDGE_TEMPLATES[i].to}`,
        phase: p + 1,
        from: initialWeights[idx],
        to: optimized[idx],
        delta,
      });
    }
  }
}
changes.sort((a, b) => b.delta - a.delta);
for (const c of changes.slice(0, 20)) {
  console.log(`   ${c.edge} [P${c.phase}]: ${c.from.toFixed(4)} → ${c.to.toFixed(4)} (Δ${c.delta.toFixed(4)})`);
}
