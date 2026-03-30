import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { ParamsDiff40, MarketState, DerivedIndicators, CityContext, CityParams40 } from '../types';
import { computeMarketState, clampE1 } from '../model/market-state';
import { computeDerivedIndicators } from '../model/derived';
import { DAG_EDGES, type NodeId, type Edge } from '../model/graph';
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
};

// ── Time classes (local, replaces graph.ts TIME_CLASS_MAP) ───────────────────

type TimeClassLocal = 'short' | 'medium' | 'long';

const TIME_CLASS_MAP_LOCAL: Record<string, TimeClassLocal> = {
  // Context
  'ctx:zinsniveau':          'short',
  'ctx:zuwanderungsdruck':   'short',
  'ctx:wirtschaftskraft':    'medium',
  'ctx:bevoelkerungstrend':  'long',
  // Bodenrecht
  raumplanung_zonenreserve:          'long',
  raumplanung_verdichtung:           'medium',
  raumplanung_ausnuetzungsziffer:   'medium',
  boden_vorkaufsrecht:               'long',
  boden_bauverpflichtung:            'medium',
  boden_mehrwertabgabe:              'long',
  boden_bodeneigentumssteuer:        'medium',
  // Bau
  bau_energievorgaben:               'short',
  bau_sanierungspflicht:             'short',
  bau_einspracherecht_dritte:        'short',
  bau_einspracherecht_suspensiv:     'short',
  bau_bewilligungsverfahren:         'medium',
  bau_normenharmonisierung:          'long',
  // Gemeinnützig
  gemeinnuetzig_mindestanteil:       'long',
  gemeinnuetzig_foerderfonds:        'long',
  gemeinnuetzig_baurecht:            'long',
  gemeinnuetzig_belegungsvorschriften:'medium',
  gemeinnuetzig_sozialmischung:      'long',
  // Mietrecht
  mietrecht_kostenmiete:             'short',
  mietrecht_anfangsmiete:            'short',
  mietrecht_mietzinstransparenz:     'short',
  mietrecht_kuendigungsschutz:       'short',
  mietrecht_mietzinsindex:           'short',
  mietrecht_untervermietung:         'short',
  // Steuern
  steuer_grundstueckgewinn:          'medium',
  steuer_eigenmietwert:              'medium',
  steuer_leerstandsabgabe:           'medium',
  steuer_handaenderung:              'short',
  steuer_kapitalgewinnprivatpersonen:'short',
  // Kapital
  kapital_auslaendische_investoren:  'medium',
  kapital_institutionelle_regulierung:'medium',
  kapital_hypothekarregulierung:     'short',
  // Nutzung
  nutzung_kurzzeitvermietung:        'short',
  nutzung_umnutzungsverbot:          'short',
  nutzung_abbruchverbot:            'short',
  nutzung_zweitwohnungen:            'long',
  // Infrastruktur
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

function buildNodes(paramMeta40: Map<string, { label: string; group: string }>): NodeMeta[] {
  const nodes: NodeMeta[] = [];

  // E0: 40 parameter nodes + 4 ctx nodes
  for (const key of PARAM_KEYS_40) {
    const meta = paramMeta40.get(key);
    nodes.push({
      id: key as NodeId,
      label: meta?.label ?? key,
      group: meta?.group ?? 'bodenrecht',
      level: 0,
      time: TIME_CLASS_MAP_LOCAL[key] ?? 'medium',
      paramKey: key,
    });
  }

  // E0 context nodes
  const ctxKeys: Array<{ id: NodeId; label: string }> = [
    { id: 'ctx:zinsniveau',          label: 'Zinsniveau'         },
    { id: 'ctx:zuwanderungsdruck',   label: 'Zuwanderung'        },
    { id: 'ctx:wirtschaftskraft',     label: 'Wirtschaftskraft'   },
    { id: 'ctx:bevoelkerungstrend',   label: 'Bevölkerungstrend'  },
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
    { id: 'spekulationshemmung',          label: 'Spekulationshemmung'        },
    { id: 'markfriktion',                 label: 'Marktfriktion'              },
    { id: 'gemeinnuetzig_kraft',          label: 'Gemeinnützig-Kraft'        },
    { id: 'eigentumsquoten_trend',        label: 'Eigentumsquote'             },
    { id: 'aufwertungsdruck',             label: 'Aufwertungsdruck'           },
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

// ── Position helper ────────────────────────────────────────────────────────

function getNodeX(level: 0 | 1 | 2): number {
  if (level === 0) return E0_X;
  if (level === 1) return E1_X;
  return E2_X;
}

function getNodeWidth(level: 0 | 1 | 2): number {
  if (level === 0) return E0_WIDTH;
  if (level === 1) return E1_WIDTH;
  return E2_WIDTH;
}

// ── Main Component ─────────────────────────────────────────────────────────

interface Props {
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  diff: ParamsDiff40;
}

interface TooltipData {
  x: number;
  y: number;
  node: NodeMeta;
  value?: number;
}

export function DAGVisualization({ context, baseline, modified, diff }: Props) {
  const state = clampE1(computeMarketState(context, baseline, modified, diff));
  const derived = computeDerivedIndicators(state, context, diff);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [zoomed, setZoomed] = useState(1);

  const { allNodes, nodeYMap, totalHeight } = useMemo(() => {
    // Build param metadata map
    const pm40 = new Map<string, { label: string; group: string }>();

    // We need to import the metadata — we'll pass it through a hook or compute inline
    // For now, build from known structure
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

    for (const key of PARAM_KEYS_40) {
      pm40.set(key, {
        label: labelMap[key] ?? key,
        group: groupMap[key] ?? 'bodenrecht',
      });
    }

    const nodes = buildNodes(pm40);

    // Compute node positions: group by level, sort by group order
    const groupOrder = ['bodenrecht', 'bau', 'gemeinnuetzig', 'mietrecht', 'steuern', 'kapital', 'nutzung', 'infrastruktur', 'ctx'];
    const level0 = nodes.filter(n => n.level === 0).sort((a, b) => {
      const ai = groupOrder.indexOf(a.group);
      const bi = groupOrder.indexOf(b.group);
      return ai - bi;
    });
    const level1 = nodes.filter(n => n.level === 1);
    const level2 = nodes.filter(n => n.level === 2);

    // Assign Y positions
    const ym = new Map<NodeId, number>();

    const th = Math.max(level0.length * (NODE_HEIGHT + GROUP_GAP), level1.length * (NODE_HEIGHT + GROUP_GAP), level2.length * (NODE_HEIGHT + GROUP_GAP)) + 80;

    const headerOffset = COL_HEADER_GAP;
    let y = headerOffset;
    for (const node of level0) {
      ym.set(node.id, y);
      y += NODE_HEIGHT + GROUP_GAP;
    }

    y = headerOffset;
    for (const node of level1) {
      ym.set(node.id, y);
      y += NODE_HEIGHT + GROUP_GAP;
    }

    y = headerOffset;
    for (const node of level2) {
      ym.set(node.id, y);
      y += NODE_HEIGHT + GROUP_GAP;
    }

    return { allNodes: nodes, nodeYMap: ym, totalHeight: th };
  }, []);

  // Which nodes and edges are affected by diff?
  const { affectedNodes, affectedEdges } = useMemo(() => {
    const dk = new Set(Object.keys(diff));
    const an = new Set<NodeId>();
    const ae = new Set<Edge>();

    // Pass 1: E0 -> E1
    for (const edge of DAG_EDGES) {
      if (dk.has(edge.from)) {
        an.add(edge.from);
        an.add(edge.to);
        ae.add(edge);
      }
    }

    // Pass 2: E1 -> E2
    for (const edge of DAG_EDGES) {
      if (an.has(edge.from)) {
        an.add(edge.to);
        ae.add(edge);
      }
    }

    return { affectedNodes: an, affectedEdges: ae };
  }, [diff]);

  // Compute edge highlight
  function isEdgeHighlighted(e: Edge): boolean {
    return affectedEdges.has(e);
  }

  // Compute diff value for a node (for tooltip)
  function getDiffValue(nodeId: NodeId): number | undefined {
    if (nodeId.startsWith('ctx:')) return undefined;
    const d = (diff as Record<string, { from: number; to: number }>)[nodeId];
    if (!d) return undefined;
    return d.to - d.from;
  }

  // Compute node value for E1/E2
  function getNodeValue(nodeId: NodeId): number | string | undefined {
    if (nodeId in state) return state[nodeId as keyof MarketState];
    if (nodeId in derived) {
      return derived[nodeId as keyof DerivedIndicators] as number;
    }
    return undefined;
  }

  // ── SVG Layout ─────────────────────────────────────────────────────────

  // E2 right edge = E2_X(540) + E2_WIDTH(140) = 680, + right margin = 720
  const SVG_W = 720;
  const SVG_H = totalHeight + 20;

  // ── Arrow marker ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomed(event.transform.k);
      });
    (svg as d3.Selection<SVGSVGElement, unknown, null, undefined>).call(zoomBehavior);

    // Arrow markers
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow-pos')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#3d5a80');

    defs.append('marker')
      .attr('id', 'arrow-neg')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#c92a2a');

    defs.append('marker')
      .attr('id', 'arrow-pos-hl')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#74c0fc');

    defs.append('marker')
      .attr('id', 'arrow-neg-hl')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#ff8787');

    // Column headers
    const colHeaders = [
      { x: E0_X, label: 'Parameter (E0)' },
      { x: E1_X, label: 'Markt (E1)' },
      { x: E2_X, label: 'Indikatoren (E2)' },
    ];
    for (const h of colHeaders) {
      g.append('text')
        .attr('x', h.x + getNodeWidth(h.x === E0_X ? 0 : h.x === E1_X ? 1 : 2) / 2)
        .attr('y', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#555')
        .attr('font-size', 10)
        .attr('font-weight', 600)
        .text(h.label);
    }

    // Draw edges
    for (const edge of DAG_EDGES) {
      const fromNode = allNodes.find(n => n.id === edge.from);
      const toNode = allNodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) continue;

      const y1 = nodeYMap.get(edge.from)! + NODE_HEIGHT / 2;
      const y2 = nodeYMap.get(edge.to)! + NODE_HEIGHT / 2;
      const x1 = getNodeX(fromNode.level) + getNodeWidth(fromNode.level);
      const x2 = getNodeX(toNode.level);

      const highlighted = isEdgeHighlighted(edge);
      const markerId = `arrow-${edge.sign > 0 ? 'pos' : 'neg'}${highlighted ? '-hl' : ''}`;
      const color = highlighted
        ? (edge.sign > 0 ? '#74c0fc' : '#ff8787')
        : (edge.sign > 0 ? '#3d5a80' : '#c92a2a');

      // Curved path
      const mx = (x1 + x2) / 2;
      const pathD = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2 - 6} ${y2}`;

      g.append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', highlighted ? 1.5 : 0.8)
        .attr('opacity', highlighted ? 0.9 : 0.25)
        .attr('marker-end', `url(#${markerId})`);
    }

    // ── Feedback / Rückkopplungs-Bögen (gestrichelt) ────────────────────────
    // Zeigen Rückkopplungspfade, die im DAG nicht als Kanten existieren,
    // aber real existieren. Gestrichelt, farbcodiert nach Wirkung.
    // Quelle: abhaengigkeiten-und-iterationen.md, "Fehlende Rückkoppungen"

    const FEEDBACK_EDGES: Array<{
      from: NodeId;
      to: NodeId;
      sign: 1 | -1;
      label: string;
    }> = [
      { from: 'gentrifizierungsindex',  to: 'nachfragedruck',          sign: +1, label: 'Aufwertung zieht Einkommensstärkere an' },
      { from: 'gentrifizierungsindex',  to: 'angebotspotenzial',        sign: +1, label: 'Sanierungswelle → mehr Neubau' },
      { from: 'investitionsattraktivitaet', to: 'angebotspotenzial',  sign: +1, label: 'Investoren → mehr Neubau' },
      { from: 'angebotspotenzial',      to: 'nachfragedruck',          sign: -1, label: 'Angebot → dämpft Nachfrage' },
      { from: 'nachfragedruck',         to: 'investitionsattraktivitaet', sign: +1, label: 'Hohe Nachfrage → attraktiver Markt' },
      { from: 'gentrifizierungsindex',  to: 'mietrecht_kuendigungsschutz', sign: +1, label: 'Politische Gegenreaktion' },
      { from: 'angebotspotenzial',      to: 'eigentumsquoten_trend',    sign: -1, label: 'Mehr Angebot → weniger Kaufdruck' },
      { from: 'aufwertungsdruck',        to: 'spekulationshemmung',      sign: -1, label: 'Aufwertung → mehr Bodenhortung' },
    ];

    const FEEDBACK_Y_OFFSET = -40; // Bögen gehen über die Knoten drüber

    // Pre-create feedback arrow markers once
    const defs2 = svg.select<SVGDefsElement>('defs');
    for (const fb of FEEDBACK_EDGES) {
      defs2.append('marker')
        .attr('id', `fb-arrow-${fb.from}-${fb.to}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 8)
        .attr('refY', 5)
        .attr('markerWidth', 4)
        .attr('markerHeight', 4)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', fb.sign > 0 ? '#74c0fc' : '#ffd43b');
    }

    // Draw feedback arcs
    for (const fb of FEEDBACK_EDGES) {
      const fromNode = allNodes.find(n => n.id === fb.from);
      const toNode = allNodes.find(n => n.id === fb.to);
      if (!fromNode || !toNode) continue;

      const fromY = nodeYMap.get(fb.from)! + NODE_HEIGHT / 2;
      const toY = nodeYMap.get(fb.to)! + NODE_HEIGHT / 2;
      const fromX = getNodeX(fromNode.level) + getNodeWidth(fromNode.level);
      const toX = getNodeX(toNode.level);

      // Arc goes UP and BACKWARDS above the nodes
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
        .attr('marker-end', `url(#fb-arrow-${fb.from}-${fb.to})`);
    }

    // Draw nodes
    for (const node of allNodes) {
      const x = getNodeX(node.level);
      const y = nodeYMap.get(node.id)!;
      const w = getNodeWidth(node.level);
      const h = NODE_HEIGHT;
      const isHighlighted = affectedNodes.has(node.id);
      const groupColor = GROUP_COLORS[node.group] ?? '#888';
      const isE1 = node.level === 1;
      const isE2 = node.level === 2;

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

      // E1/E2 nodes: colored left accent bar
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

      // Time badge for E0 nodes
      if (node.level === 0 && node.time) {
        const timeColors: Record<string, string> = { short: '#51cf66', medium: '#fab005', long: '#ff6b6b' };
        nodeG.append('circle')
          .attr('cx', w - 8)
          .attr('cy', h / 2)
          .attr('r', 3)
          .attr('fill', timeColors[node.time] ?? '#555');
      }

      // Diff badge for E0 nodes with changes
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

      // Value badge for E1/E2 nodes
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

      // Tooltip interaction
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

  }, [diff, state, derived]);

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
