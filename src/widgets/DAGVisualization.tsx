import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { graphConnect, sugiyama, layeringSimplex, decrossTwoLayer, decrossDfs } from 'd3-dag';
import type { ParamsDiff40, MarketState, DerivedIndicators, CityContext } from '../types';
import { computePhasesCached } from '../model/compute-phases';
import { computeDerivedIndicators } from '../model/derived';
import { getDagTopology, type Edge, type NodeId } from '../model/dag-topology';
import { PARAM_KEYS_40 } from '../model/params';
import './DAGVisualization.css';

// ── Layout Constants ────────────────────────────────────────────────────────

const E0_X = 60;
const E1_X = 320;
const E2_X = 540;
const NODE_HEIGHT = 22;
const NODE_RADIUS = 4;
const E0_WIDTH = 120;
const E1_WIDTH = 140;
const E2_WIDTH = 160;
const GROUP_GAP = 8;
const COL_HEADER_GAP = 28;

// d3-dag coordinate assignment constants
const LAYER_X: Record<number, number> = { 0: E0_X, 1: E1_X, 2: E2_X };
const LAYER_WIDTH: Record<number, number> = { 0: E0_WIDTH, 1: E1_WIDTH, 2: E2_WIDTH };
const NODE_H_GAP = 6; // horizontal gap within a layer (for centering)
const NODE_V_GAP = GROUP_GAP; // vertical gap between nodes

// ── Node group colors ──────────────────────────────────────────────────────

const GROUP_COLORS: Record<string, string> = {
  bodenrecht:     '#4dabf7',
  bau:            '#f59f00',
  gemeinnuetzig:  '#51cf66',
  mietrecht:      '#ff6b6b',
  steuern:        '#fab005',
  kapital:        '#cc5de8',
  nutzung:        '#ff922b',
  infrastruktur:  '#20c997',
  ctx:            '#adb5bd',
  e1:             '#74c0fc',
  e2:             '#f783ac',
};

// ── Group labels ───────────────────────────────────────────────────────────

const GROUP_LABELS: Record<string, string> = {
  bodenrecht:     'Bodenrecht',
  bau:            'Bau',
  gemeinnuetzig:  'Gemeinnützig',
  mietrecht:      'Mietrecht',
  steuern:        'Steuern',
  kapital:        'Kapital',
  nutzung:        'Nutzung',
  infrastruktur:  'Infrastruktur',
  ctx:            'Kontext',
  e1:             'Markt',
  e2:             'Indikatoren',
};

// ── Time classes (local) ────────────────────────────────────────────────────

type TimeClassLocal = 'short' | 'medium' | 'long';

const TIME_CLASS_MAP_LOCAL: Record<string, TimeClassLocal> = {
  'ctx:zinsniveau':          'short',
  'ctx:zuwanderungsdruck':   'short',
  'ctx:wirtschaftskraft':    'medium',
  'ctx:bevoelkerungstrend':  'long',
  raumplanung_zonenreserve:          'long',
  raumplanung_verdichtung:           'medium',
  raumplanung_ausnuetzungsziffer:   'medium',
  boden_vorkaufsrecht:               'long',
  boden_bauverpflichtung:            'medium',
  boden_mehrwertabgabe:              'long',
  boden_bodeneigentumssteuer:        'medium',
  bau_energievorgaben:               'short',
  bau_sanierungspflicht:             'short',
  bau_einspracherecht_dritte:        'short',
  bau_einspracherecht_suspensiv:     'short',
  bau_bewilligungsverfahren:         'medium',
  bau_normenharmonisierung:          'long',
  gemeinnuetzig_mindestanteil:       'long',
  gemeinnuetzig_foerderfonds:        'long',
  gemeinnuetzig_baurecht:            'long',
  gemeinnuetzig_belegungsvorschriften:'medium',
  gemeinnuetzig_sozialmischung:      'long',
  mietrecht_kostenmiete:             'short',
  mietrecht_anfangsmiete:            'short',
  mietrecht_mietzinstransparenz:     'short',
  mietrecht_kuendigungsschutz:       'short',
  mietrecht_mietzinsindex:           'short',
  mietrecht_untervermietung:         'short',
  steuer_grundstueckgewinn:          'medium',
  steuer_eigenmietwert:              'medium',
  steuer_leerstandsabgabe:           'medium',
  steuer_handaenderung:              'short',
  steuer_kapitalgewinnprivatpersonen:'short',
  kapital_auslaendische_investoren:  'medium',
  kapital_institutionelle_regulierung:'medium',
  kapital_hypothekarregulierung:     'short',
  nutzung_kurzzeitvermietung:        'short',
  nutzung_umnutzungsverbot:          'short',
  nutzung_abbruchverbot:            'short',
  nutzung_zweitwohnungen:            'long',
  infra_oepnv:                       'long',
  infra_schule_kita:                'long',
  infra_oeffentlicher_raum:          'long',
  infra_wirtschaftsansiedlung:        'long',
};

// ── Node metadata ─────────────────────────────────────────────────────────

interface NodeMeta {
  id: NodeId;
  label: string;
  group: string;
  level: 0 | 1 | 2;
  time?: string;
  paramKey?: string;
}

function buildNodes(): NodeMeta[] {
  const nodes: NodeMeta[] = [];

  const groupMap: Record<string, string> = {
    raumplanung_zonenreserve: 'bodenrecht',
    raumplanung_verdichtung: 'bodenrecht',
    raumplanung_ausnuetzungsziffer: 'bodenrecht',
    boden_vorkaufsrecht: 'bodenrecht',
    boden_bauverpflichtung: 'bodenrecht',
    boden_mehrwertabgabe: 'bodenrecht',
    boden_bodeneigentumssteuer: 'bodenrecht',
    bau_energievorgaben: 'bau',
    bau_sanierungspflicht: 'bau',
    bau_einspracherecht_dritte: 'bau',
    bau_einspracherecht_suspensiv: 'bau',
    bau_bewilligungsverfahren: 'bau',
    bau_normenharmonisierung: 'bau',
    gemeinnuetzig_mindestanteil: 'gemeinnuetzig',
    gemeinnuetzig_foerderfonds: 'gemeinnuetzig',
    gemeinnuetzig_baurecht: 'gemeinnuetzig',
    gemeinnuetzig_belegungsvorschriften: 'gemeinnuetzig',
    gemeinnuetzig_sozialmischung: 'gemeinnuetzig',
    mietrecht_kostenmiete: 'mietrecht',
    mietrecht_anfangsmiete: 'mietrecht',
    mietrecht_mietzinstransparenz: 'mietrecht',
    mietrecht_kuendigungsschutz: 'mietrecht',
    mietrecht_mietzinsindex: 'mietrecht',
    mietrecht_untervermietung: 'mietrecht',
    steuer_grundstueckgewinn: 'steuern',
    steuer_eigenmietwert: 'steuern',
    steuer_leerstandsabgabe: 'steuern',
    steuer_handaenderung: 'steuern',
    steuer_kapitalgewinnprivatpersonen: 'steuern',
    kapital_auslaendische_investoren: 'kapital',
    kapital_institutionelle_regulierung: 'kapital',
    kapital_hypothekarregulierung: 'kapital',
    nutzung_kurzzeitvermietung: 'nutzung',
    nutzung_umnutzungsverbot: 'nutzung',
    nutzung_abbruchverbot: 'nutzung',
    nutzung_zweitwohnungen: 'nutzung',
    infra_oepnv: 'infrastruktur',
    infra_schule_kita: 'infrastruktur',
    infra_oeffentlicher_raum: 'infrastruktur',
    infra_wirtschaftsansiedlung: 'infrastruktur',
  };

  const labelMap: Record<string, string> = {
    raumplanung_zonenreserve: 'Zonenreserve',
    raumplanung_verdichtung: 'Verdichtung',
    raumplanung_ausnuetzungsziffer: 'Ausnützungsziffer',
    boden_vorkaufsrecht: 'Vorkaufsrecht',
    boden_bauverpflichtung: 'Bauverpflichtung',
    boden_mehrwertabgabe: 'Mehrwertabgabe',
    boden_bodeneigentumssteuer: 'Bodeneigentumssteuer',
    bau_energievorgaben: 'Energievorgaben',
    bau_sanierungspflicht: 'Sanierungspflicht',
    bau_einspracherecht_dritte: 'Einsprache Dr.',
    bau_einspracherecht_suspensiv: 'Einsprache Susp.',
    bau_bewilligungsverfahren: 'Bewilligung',
    bau_normenharmonisierung: 'Normenharmonis.',
    gemeinnuetzig_mindestanteil: 'Mindestanteil',
    gemeinnuetzig_foerderfonds: 'Förderfonds',
    gemeinnuetzig_baurecht: 'Baurecht',
    gemeinnuetzig_belegungsvorschriften: 'Belegungsvorschr.',
    gemeinnuetzig_sozialmischung: 'Sozialmischung',
    mietrecht_kostenmiete: 'Kostenmiete',
    mietrecht_anfangsmiete: 'Anfangsmiete',
    mietrecht_mietzinstransparenz: 'Mietspiegel',
    mietrecht_kuendigungsschutz: 'Kündigungsschutz',
    mietrecht_mietzinsindex: 'Mietzinsindex',
    mietrecht_untervermietung: 'Untervermietung',
    steuer_grundstueckgewinn: 'Grundstückgewinnst.',
    steuer_eigenmietwert: 'Eigenmietwert',
    steuer_leerstandsabgabe: 'Leerstandsabgabe',
    steuer_handaenderung: 'Handänderungsst.',
    steuer_kapitalgewinnprivatpersonen: 'Kapitalgewinnst.',
    kapital_auslaendische_investoren: 'Ausländ. Invest.',
    kapital_institutionelle_regulierung: 'Instit. Regulierung',
    kapital_hypothekarregulierung: 'Hypothekarregul.',
    nutzung_kurzzeitvermietung: 'Kurzzeitvermietung',
    nutzung_umnutzungsverbot: 'Umnutzungsverbot',
    nutzung_abbruchverbot: 'Abbruchverbot',
    nutzung_zweitwohnungen: 'Zweitwohnungen',
    infra_oepnv: 'ÖV',
    infra_schule_kita: 'Schule/Kita',
    infra_oeffentlicher_raum: 'Öfftl. Raum',
    infra_wirtschaftsansiedlung: 'Wirtschaftsansiedl.',
  };

  // E0: 40 parameter nodes
  for (const key of PARAM_KEYS_40) {
    nodes.push({
      id: key as NodeId,
      label: labelMap[key] ?? key,
      group: groupMap[key] ?? 'bodenrecht',
      level: 0,
      time: TIME_CLASS_MAP_LOCAL[key] ?? 'medium',
      paramKey: key,
    });
  }

  // E0 context nodes
  const ctxKeys: Array<{ id: NodeId; label: string }> = [
    { id: 'ctx:zinsniveau',          label: 'Zinsniveau'         },
    { id: 'ctx:zuwanderungsdruck',   label: 'Zuwanderung'        },
    { id: 'ctx:wirtschaftskraft',    label: 'Wirtschaftskraft'   },
    { id: 'ctx:bevoelkerungstrend',  label: 'Bevölkerungstrend'  },
  ];
  for (const ctx of ctxKeys) {
    nodes.push({ ...ctx, group: 'ctx', level: 0, time: TIME_CLASS_MAP_LOCAL[ctx.id] ?? 'short' });
  }

  // E1 nodes
  const e1Keys: Array<{ id: NodeId; label: string }> = [
    { id: 'angebotspotenzial',            label: 'Angebotspotenzial'          },
    { id: 'nachfragedruck',               label: 'Nachfragedruck'             },
    { id: 'mietpreis_schutzlevel',        label: 'Mietschutz'                },
    { id: 'verdraengungsrisiko',          label: 'Verdrängungsrisiko'         },
    { id: 'spekulationshemmung',           label: 'Spekulationshemmung'        },
    { id: 'marktfriktion',                 label: 'Marktfriktion'              },
    { id: 'gemeinnuetzig_kraft',         label: 'Gemeinnützig-Kraft'        },
    { id: 'eigentumsquoten_trend',        label: 'Eigentumsquote'             },
    { id: 'aufwertungsdruck',              label: 'Aufwertungsdruck'           },
    { id: 'investitionsattraktivitaet',   label: 'Investitionsattraktivität' },
  ];
  for (const e1 of e1Keys) {
    nodes.push({ ...e1, group: 'e1', level: 1 });
  }

  // E2 nodes
  const e2Keys: Array<{ id: NodeId; label: string }> = [
    { id: 'gentrifizierungsindex',      label: 'Gentrifizierung'    },
    { id: 'neubau_hemmnisindex',        label: 'Neubau-Hemmnis'     },
    { id: 'verdraengungsrisiko_index',  label: 'Verdrängung (Idx)'  },
    { id: 'fiskalische_wirkung',        label: 'Fiskal. Wirkung'    },
  ];
  for (const e2 of e2Keys) {
    nodes.push({ ...e2, group: 'e2', level: 2 });
  }

  return nodes;
}

// ── Layout computation via d3-dag ──────────────────────────────────────────

interface NodeLayout {
  node: NodeMeta;
  x: number; // SVG x
  y: number; // SVG y
  layerIndex: number; // 0,1,2
  orderInLayer: number; // position within layer after crossing minimization
}

function computeLayout(allNodes: NodeMeta[], dagEdges: readonly Edge[]): { nodeLayouts: NodeLayout[]; totalHeight: number } {
  // Build d3-dag graph
  const dagNodes = new Map<NodeId, NodeMeta>();
  for (const n of allNodes) dagNodes.set(n.id, n);

  const edgesForDag = dagEdges.filter(e => dagNodes.has(e.from) && dagNodes.has(e.to));

  // graphConnect expects [source, target] tuples by default
  // nodeDatum stores just the NodeId as a string so we can look up NodeMeta after
  const nodeMetaMap = new Map<NodeId, NodeMeta>(allNodes.map(n => [n.id, n]));
  const builder = graphConnect()
    .nodeDatum(id => id as string);
  const graph = builder(edgesForDag.map(e => [e.from, e.to] as [string, string]));

  // Layer assignment: force E0/E1/E2 via rank using stored NodeId lookup
  const rankFn = (node: { data: string }): number | undefined => {
    const meta = nodeMetaMap.get(node.data as NodeId);
    return meta?.level;
  };

  // Build sugiyama layout with forced layering + crossing minimization
  const layout = sugiyama()
    .layering(layeringSimplex().rank(rankFn))
    .decross(decrossTwoLayer().inits([decrossDfs()]))
    .nodeSize([1, NODE_HEIGHT + NODE_V_GAP] as [number, number])
    .gap([NODE_H_GAP, 0] as [number, number]);

  // Run layout
  layout(graph);

  // Collect results
  const layerCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
  const layerMaxWidth: Record<number, number> = { 0: 0, 1: 0, 2: 0 };

  for (const node of graph.nodes()) {
    const level = nodeMetaMap.get(node.data as NodeId)?.level;
    if (level === undefined) continue;
    layerCounts[level]++;
    layerMaxWidth[level] = Math.max(layerMaxWidth[level], node.x ?? 0);
  }

  // Assign positions: fixed X per level, Y from layout
  const layouts: NodeLayout[] = [];

  // Find global bounds from d3-dag output
  let maxY = 0;
  for (const node of graph.nodes()) {
    maxY = Math.max(maxY, node.y ?? 0);
  }

  // Collect nodes per layer in d3-dag order (which is already optimized for crossing minimization)
  const layerNodes = new Map<number, { node: NodeMeta; dagY: number }[]>();
  layerNodes.set(0, []);
  layerNodes.set(1, []);
  layerNodes.set(2, []);

  for (const node of graph.nodes()) {
    const nodeId = node.data as NodeId;
    const meta = nodeMetaMap.get(nodeId);
    if (!meta) continue;
    // node.x = position within layer (crossing-minimized order)
    // node.y = layer depth (same for all nodes in the same layer)
    layerNodes.get(meta.level)!.push({ node: meta, dagY: node.x ?? 0 });
  }

  // Sort each layer by d3-dag's x position (within-layer order) to preserve crossing-minimized order
  for (const level of [0, 1, 2]) {
    layerNodes.get(level)!.sort((a, b) => a.dagY - b.dagY);
  }

  // Assign SVG positions
  // Y: use d3-dag's y scaled to our NODE_HEIGHT + GROUP_GAP
  // X: fixed per level
  for (const level of [0, 1, 2]) {
    const nodesInLayer = layerNodes.get(level)!;
    for (let i = 0; i < nodesInLayer.length; i++) {
      const { node } = nodesInLayer[i];
      // Use index i for evenly-spaced Y positions (d3-dag order preserved by sort above)
      // This avoids overlaps when multiple nodes share the same d3-dag x coordinate
      const svgY = COL_HEADER_GAP + i * (NODE_HEIGHT + NODE_V_GAP);
      const svgX = LAYER_X[level] + LAYER_WIDTH[level] / 2; // center in column

      layouts.push({
        node,
        x: svgX,
        y: svgY,
        layerIndex: level,
        orderInLayer: i,
      });
    }
  }

  // Total height = max y + NODE_HEIGHT + padding
  const maxLayoutY = Math.max(...layouts.map(l => l.y));
  const totalHeight = maxLayoutY + NODE_HEIGHT + 40;

  return { nodeLayouts: layouts, totalHeight };
}

// ── Main Component ─────────────────────────────────────────────────────────

interface Props {
  context: CityContext;
  diff: ParamsDiff40;
}

interface TooltipData {
  x: number;
  y: number;
  node: NodeMeta;
  value?: number;
}

export function DAGVisualization({ context, diff }: Props) {
  const phases = computePhasesCached(context, diff);
  const state = phases[phases.length - 1].marketState;
  const derived = computeDerivedIndicators(state);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [zoomed, setZoomed] = useState(1);

  const allNodes = useMemo(() => buildNodes(), []);
  const dagEdges = useMemo(() => getDagTopology(), []);

  const { nodeLayouts, totalHeight } = useMemo(() => {
    return computeLayout(allNodes, dagEdges);
  }, [allNodes, dagEdges]);

  const nodeLayoutMap = useMemo(() => {
    const m = new Map<NodeId, NodeLayout>();
    for (const nl of nodeLayouts) m.set(nl.node.id, nl);
    return m;
  }, [nodeLayouts]);

  // Affected nodes/edges from diff
  const { affectedNodes, affectedEdges } = useMemo(() => {
    const dk = new Set(Object.keys(diff));
    const an = new Set<NodeId>();
    const ae = new Set<Edge>();

    for (const edge of dagEdges) {
      if (dk.has(edge.from)) {
        an.add(edge.from);
        an.add(edge.to);
        ae.add(edge);
      }
    }

    for (const edge of dagEdges) {
      if (an.has(edge.from)) {
        an.add(edge.to);
        ae.add(edge);
      }
    }

    return { affectedNodes: an, affectedEdges: ae };
  }, [diff, dagEdges]);

  function isEdgeHighlighted(e: Edge): boolean {
    return affectedEdges.has(e);
  }

  function getDiffValue(nodeId: NodeId): number | undefined {
    if (nodeId.startsWith('ctx:')) return undefined;
    const d = (diff as Record<string, { from: number; to: number }>)[nodeId];
    if (!d) return undefined;
    return d.to - d.from;
  }

  function getNodeValue(nodeId: NodeId): number | string | undefined {
    if (nodeId in state) return state[nodeId as keyof MarketState];
    if (nodeId in derived) {
      return derived[nodeId as keyof DerivedIndicators] as number;
    }
    return undefined;
  }

  // ── SVG Layout ─────────────────────────────────────────────────────────

  const SVG_W = 720;
  const SVG_H = totalHeight + 20;

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomed(event.transform.k);
      });
    (svg as d3.Selection<SVGSVGElement, unknown, null, undefined>).call(zoomBehavior);

    // Arrow markers
    const defs = svg.append('defs');

    for (const [suffix, color] of [
      ['pos', '#3d5a80'],
      ['neg', '#c92a2a'],
      ['pos-hl', '#74c0fc'],
      ['neg-hl', '#ff8787'],
    ] as [string, string][]) {
      defs.append('marker')
        .attr('id', `arrow-${suffix}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 8)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', color);
    }

    // Column headers
    const colHeaders = [
      { x: E0_X, label: 'Parameter (E0)', level: 0 },
      { x: E1_X, label: 'Markt (E1)', level: 1 },
      { x: E2_X, label: 'Indikatoren (E2)', level: 2 },
    ];
    for (const h of colHeaders) {
      const w = LAYER_WIDTH[h.level];
      g.append('text')
        .attr('x', h.x + w / 2)
        .attr('y', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#555')
        .attr('font-size', 10)
        .attr('font-weight', 600)
        .text(h.label);
    }

    // Draw edges
    for (const edge of dagEdges) {
      const fromLayout = nodeLayoutMap.get(edge.from);
      const toLayout = nodeLayoutMap.get(edge.to);
      if (!fromLayout || !toLayout) continue;

      const y1 = fromLayout.y + NODE_HEIGHT / 2;
      const y2 = toLayout.y + NODE_HEIGHT / 2;
      // Connect from right edge of source to left edge of target
      const x1 = fromLayout.x + LAYER_WIDTH[fromLayout.layerIndex] / 2;
      const x2 = toLayout.x - LAYER_WIDTH[toLayout.layerIndex] / 2;

      const highlighted = isEdgeHighlighted(edge);
      const suffix = `${edge.sign > 0 ? 'pos' : 'neg'}${highlighted ? '-hl' : ''}`;
      const color = highlighted
        ? (edge.sign > 0 ? '#74c0fc' : '#ff8787')
        : (edge.sign > 0 ? '#3d5a80' : '#c92a2a');

      const mx = (x1 + x2) / 2;
      const pathD = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2 - 4} ${y2}`;

      g.append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', highlighted ? 1.5 : 0.8)
        .attr('opacity', highlighted ? 0.9 : 0.25)
        .attr('marker-end', `url(#arrow-${suffix})`);
    }

    // ── Feedback / Rückkopplungs-Bögen ───────────────────────────────────

    const FEEDBACK_EDGES: Array<{ from: NodeId; to: NodeId; sign: 1 | -1 }> = [
      { from: 'gentrifizierungsindex',  to: 'nachfragedruck',           sign: +1 },
      { from: 'gentrifizierungsindex',  to: 'angebotspotenzial',         sign: +1 },
      { from: 'investitionsattraktivitaet', to: 'angebotspotenzial',     sign: +1 },
      { from: 'angebotspotenzial',      to: 'nachfragedruck',             sign: -1 },
      { from: 'nachfragedruck',         to: 'investitionsattraktivitaet', sign: +1 },
      { from: 'gentrifizierungsindex',  to: 'mietrecht_kuendigungsschutz', sign: +1 },
      { from: 'angebotspotenzial',      to: 'eigentumsquoten_trend',      sign: -1 },
      { from: 'aufwertungsdruck',        to: 'spekulationshemmung',        sign: -1 },
    ];

    const FEEDBACK_Y_OFFSET = -40;

    for (const fb of FEEDBACK_EDGES) {
      const fromLayout = nodeLayoutMap.get(fb.from);
      const toLayout = nodeLayoutMap.get(fb.to);
      if (!fromLayout || !toLayout) continue;

      defs.append('marker')
        .attr('id', `fb-${fb.from}-${fb.to}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 8)
        .attr('refY', 5)
        .attr('markerWidth', 4)
        .attr('markerHeight', 4)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', fb.sign > 0 ? '#74c0fc' : '#ffd43b');

      const fromY = fromLayout.y + NODE_HEIGHT / 2;
      const toY = toLayout.y + NODE_HEIGHT / 2;
      const fromX = fromLayout.x + LAYER_WIDTH[fromLayout.layerIndex] / 2;
      const toX = toLayout.x - LAYER_WIDTH[toLayout.layerIndex] / 2;
      const arcY = Math.min(fromY, toY) + FEEDBACK_Y_OFFSET;
      const cpY = arcY - 20;

      const pathD = `M ${fromX} ${fromY} C ${fromX} ${cpY}, ${toX} ${cpY}, ${toX} ${toY}`;

      g.append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', fb.sign > 0 ? '#74c0fc' : '#ffd43b')
        .attr('stroke-width', 1)
        .attr('opacity', 0.45)
        .attr('stroke-dasharray', '4,3')
        .attr('marker-end', `url(#fb-${fb.from}-${fb.to})`);
    }

    // Draw nodes
    for (const nl of nodeLayouts) {
      const node = nl.node;
      const x = nl.x - LAYER_WIDTH[nl.layerIndex] / 2; // top-left x
      const y = nl.y;
      const w = LAYER_WIDTH[nl.layerIndex];
      const h = NODE_HEIGHT;
      const isHighlighted = affectedNodes.has(node.id);
      const groupColor = GROUP_COLORS[node.group] ?? '#888';
      const isE1 = nl.layerIndex === 1;
      const isE2 = nl.layerIndex === 2;

      const nodeG = g.append('g')
        .attr('class', 'dag-node')
        .attr('transform', `translate(${x}, ${y})`)
        .style('cursor', 'pointer');

      // Background
      nodeG.append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr('rx', isE1 ? NODE_RADIUS * 2 : NODE_RADIUS)
        .attr('fill', isHighlighted ? groupColor + '33' : (isE1 ? '#1a1a3a' : isE2 ? '#1a1a3a' : '#111'))
        .attr('stroke', isHighlighted ? groupColor : (isE1 ? groupColor : isE2 ? groupColor + '88' : groupColor + '55'))
        .attr('stroke-width', isHighlighted ? 1.5 : isE2 ? 1.5 : 0.8);

      // Left accent bar for E1/E2
      if (isE1 || isE2) {
        nodeG.append('rect')
          .attr('width', 3)
          .attr('height', h)
          .attr('rx', 1)
          .attr('fill', groupColor);
      }

      // Label
      nodeG.append('text')
        .attr('x', isE1 || isE2 ? 8 : w / 2)
        .attr('y', h / 2 + 1)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', isE1 || isE2 ? 'start' : 'middle')
        .attr('fill', isHighlighted ? '#fff' : (isE1 ? '#ccc' : isE2 ? '#ddd' : '#999'))
        .attr('font-size', isE2 ? 11 : 9.5)
        .attr('font-weight', isE2 ? 600 : 400)
        .text(node.label.length > 17 && node.level === 0 ? node.label.slice(0, 15) + '…' : node.label);

      // Time badge for E0
      if (node.level === 0 && node.time) {
        const timeColors: Record<string, string> = { short: '#51cf66', medium: '#fab005', long: '#ff6b6b' };
        nodeG.append('circle')
          .attr('cx', w - 8)
          .attr('cy', h / 2)
          .attr('r', 3)
          .attr('fill', timeColors[node.time] ?? '#555');
      }

      // Diff badge
      const dv = getDiffValue(node.id);
      if (node.level === 0 && dv !== undefined && dv !== 0) {
        nodeG.append('rect')
          .attr('x', w - 20)
          .attr('y', 3)
          .attr('width', 14)
          .attr('height', 10)
          .attr('rx', 3)
          .attr('fill', dv > 0 ? '#ff6b6b' : '#4dabf7');
        nodeG.append('text')
          .attr('x', w - 13)
          .attr('y', h / 2 + 1)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle')
          .attr('fill', '#fff')
          .attr('font-size', 7)
          .attr('font-weight', 700)
          .text(dv > 0 ? '+' : '' + dv);
      }

      // Value badge for E1/E2
      const nv = getNodeValue(node.id);
      if ((isE1 || isE2) && typeof nv === 'number' && nv !== 0) {
        const pct = Math.round(nv * 100);
        nodeG.append('text')
          .attr('x', w - 8)
          .attr('y', h / 2 + 1)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'end')
          .attr('fill', nv > 0 ? '#ff6b6b' : '#4dabf7')
          .attr('font-size', 10)
          .attr('font-weight', 700)
          .text((nv > 0 ? '+' : '') + pct + '%');
      } else if ((isE1 || isE2) && typeof nv === 'string') {
        const timeColors: Record<string, string> = { kurzfristig: '#51cf66', mittelfristig: '#fab005', langfristig: '#ff6b6b' };
        nodeG.append('circle')
          .attr('cx', w - 12)
          .attr('cy', h / 2)
          .attr('r', 3)
          .attr('fill', timeColors[nv] ?? '#555');
      }

      // Tooltip
      nodeG.on('mouseenter', (event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          node,
          value: node.level === 0 ? dv : (typeof nv === 'number' ? nv : undefined),
        });
      });
      nodeG.on('mouseleave', () => setTooltip(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diff, state, derived, nodeLayoutMap, nodeLayouts]);

  // ── Legend ─────────────────────────────────────────────────────────────

  const legendGroups = [
    { key: 'bodenrecht', color: GROUP_COLORS.bodenrecht },
    { key: 'bau', color: GROUP_COLORS.bau },
    { key: 'gemeinnuetzig', color: GROUP_COLORS.gemeinnuetzig },
    { key: 'mietrecht', color: GROUP_COLORS.mietrecht },
    { key: 'steuern', color: GROUP_COLORS.steuern },
    { key: 'kapital', color: GROUP_COLORS.kapital },
    { key: 'nutzung', color: GROUP_COLORS.nutzung },
    { key: 'infrastruktur', color: GROUP_COLORS.infrastruktur },
    { key: 'ctx', color: GROUP_COLORS.ctx },
  ];

  const hasDiff = Object.keys(diff).length > 0;

  return (
    <div className="dag-viz" ref={containerRef}>
      <div className="dag-viz__toolbar">
        <span className="dag-viz__zoom-level">{Math.round(zoomed * 100)}%</span>
        {hasDiff && (
          <span className="dag-viz__hint">
            {Object.keys(diff).length} geänderte Parameter → hervorgehobene Pfade
          </span>
        )}
      </div>

      <div className="dag-viz__svg-container">
        <svg
          ref={svgRef}
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="dag-viz__svg"
        />

        {tooltip && (
          <div
            className="dag-viz__tooltip"
            style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
          >
            <div className="dag-viz__tooltip-title">{tooltip.node.label}</div>
            {tooltip.node.level === 0 && (
              <>
                <div className="dag-viz__tooltip-row">
                  <span style={{ color: GROUP_COLORS[tooltip.node.group] }}>
                    {GROUP_LABELS[tooltip.node.group] ?? tooltip.node.group}
                  </span>
                </div>
                {tooltip.node.time && (
                  <div className="dag-viz__tooltip-row">
                    Zeitklasse: <strong style={{ color: tooltip.node.time === 'short' ? '#51cf66' : tooltip.node.time === 'medium' ? '#fab005' : '#ff6b6b' }}>{tooltip.node.time}</strong>
                  </div>
                )}
                {tooltip.value !== undefined && (
                  <div className="dag-viz__tooltip-row">
                    Änderung: <strong style={{ color: tooltip.value > 0 ? '#ff6b6b' : '#4dabf7' }}>
                      {tooltip.value > 0 ? '+' : ''}{tooltip.value}
                    </strong>
                  </div>
                )}
              </>
            )}
            {(tooltip.node.level === 1 || tooltip.node.level === 2) && (
              <>
                <div className="dag-viz__tooltip-row">
                  {tooltip.node.level === 1 ? 'Markt-Variable' : 'Abgeleiteter Indikator'}
                </div>
                {tooltip.value !== undefined && (
                  <div className="dag-viz__tooltip-row">
                    Aktueller Wert: <strong style={{ color: tooltip.value > 0 ? '#ff6b6b' : '#4dabf7' }}>
                      {tooltip.value > 0 ? '+' : ''}{Math.round(tooltip.value * 100)}%
                    </strong>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="dag-viz__legend">
        {legendGroups.map(g => (
          <span key={g.key} className="dag-viz__legend-item">
            <span className="dag-viz__legend-dot" style={{ background: g.color }} />
            <span className="dag-viz__legend-label">{GROUP_LABELS[g.key]}</span>
          </span>
        ))}
        <span className="dag-viz__legend-sep" />
        <span className="dag-viz__legend-item">
          <span className="dag-viz__legend-dot" style={{ background: '#51cf66' }} />
          <span className="dag-viz__legend-label">kurz</span>
        </span>
        <span className="dag-viz__legend-item">
          <span className="dag-viz__legend-dot" style={{ background: '#fab005' }} />
          <span className="dag-viz__legend-label">mittel</span>
        </span>
        <span className="dag-viz__legend-item">
          <span className="dag-viz__legend-dot" style={{ background: '#ff6b6b' }} />
          <span className="dag-viz__legend-label">lang</span>
        </span>
        <span className="dag-viz__legend-sep" />
        <span className="dag-viz__legend-item">
          <span className="dag-viz__legend-line" style={{ background: '#3d5a80' }} />
          <span className="dag-viz__legend-label">+/−</span>
        </span>
        <span className="dag-viz__legend-item">
          <span className="dag-viz__legend-line dag-viz__legend-line--dashed" style={{ borderColor: '#74c0fc' }} />
          <span className="dag-viz__legend-label">Rückkopplung+</span>
        </span>
        <span className="dag-viz__legend-item">
          <span className="dag-viz__legend-line dag-viz__legend-line--dashed" style={{ borderColor: '#ffd43b' }} />
          <span className="dag-viz__legend-label">Rückkopplung−</span>
        </span>
      </div>
    </div>
  );
}
