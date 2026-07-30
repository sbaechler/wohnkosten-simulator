import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { CityParams40, CityContext, ParamsDiff40 } from '../types';
import { supplyCurve, demandCurve, findEquilibrium, supplyShiftFromState, mietpreisdeckel } from '../model/supply-demand';
import type { PhaseResult } from '../model/phases';
import { computePhasesCached } from '../model/compute-phases';
import './SupplyDemandChart.css';

interface Props {
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  diff: ParamsDiff40;
  phases: PhaseResult[];
  /** Baseline phases for "Heutige Situation" row (shown when defined) */
  baselinePhases?: PhaseResult[];
}

const MARGIN = { top: 20, right: 110, bottom: 40, left: 50 };
const WIDTH = 500;
const HEIGHT = 240; // Increased height to accommodate phase selector

const PHASE_NAMES = ['P1', 'P2', 'P3'];

const COLORS = {
  supply: '#4dabf7',
  demand: '#ff6b6b',
  equilibrium: '#ffd43b',
  baseline: '#555',
  deckel: '#69db7c',
  luecke: '#ffa94d',
};

export function SupplyDemandChart({ context, baseline, modified, diff, phases, baselinePhases }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(2); // Default to P3
  // Toggle: 'simuliert' (default) | 'heutig'
  const [viewMode, setViewMode] = useState<'simuliert' | 'heutig'>('simuliert');

  // Active phases depend on toggle
  const activePhasesForChart = (baselinePhases && viewMode === 'heutig') ? baselinePhases : phases;

  // Baseline reference state (dashed line) — uses pipeline phase 1 of the baseline
  // (no diff = neutral state). Memoized to avoid recomputing on every render.
  const baselineState = useMemo(
    () => computePhasesCached(context, {})[0].marketState,
    [context],
  );

  useEffect(() => {
    if (!svgRef.current || !phases || phases.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = WIDTH - MARGIN.left - MARGIN.right;
    const h = HEIGHT - MARGIN.top - MARGIN.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top + 40})`); // Shifted down for selector

    const x = d3.scaleLinear().domain([0, 10]).range([0, w]);
    const y = d3.scaleLinear().domain([0, 10]).range([h - 40, 0]);

    // Axes
    g.append('g').attr('transform', `translate(0,${h - 40})`)
      .call(d3.axisBottom(x).ticks(0))
      .selectAll('text').remove();
    g.append('g')
      .call(d3.axisLeft(y).ticks(0))
      .selectAll('text').remove();

    // Axis labels
    g.append('text').attr('x', w / 2).attr('y', h - 10)
      .attr('text-anchor', 'middle').attr('fill', '#888').attr('font-size', 11)
      .text('Menge');
    g.append('text').attr('transform', 'rotate(-90)')
      .attr('x', -(h - 40) / 2).attr('y', -25)
      .attr('text-anchor', 'middle').attr('fill', '#888').attr('font-size', 11)
      .text('Preis');

    const line = d3.line<[number, number]>()
      .x(d => x(d[0])).y(d => y(d[1]))
      .curve(d3.curveLinear);

    // Baseline curves: always use baseline params for the dashed reference line
    const baselineSupplyShift = supplyShiftFromState(baselineState);
    const [bq, bp] = findEquilibrium(baselineSupplyShift, baselineState.nachfragedruck, baselineState.angebotspotenzial_regulation, baselineState);

    // Draw baseline curves (dashed)
    g.append('path').datum(supplyCurve(baselineSupplyShift, baselineState.angebotspotenzial_regulation, baselineState))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', COLORS.baseline).attr('stroke-width', 1.5).attr('stroke-dasharray', '4');
    g.append('path').datum(demandCurve(baselineState.nachfragedruck))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', COLORS.baseline).attr('stroke-width', 1.5).attr('stroke-dasharray', '4');

    // Baseline equilibrium
    g.append('line').attr('x1', x(bq)).attr('y1', y(bp)).attr('x2', x(bq)).attr('y2', y(0))
      .attr('stroke', COLORS.baseline).attr('stroke-dasharray', '3').attr('stroke-width', 1);
    g.append('line').attr('x1', 0).attr('y1', y(bp)).attr('x2', x(bq)).attr('y2', y(bp))
      .attr('stroke', COLORS.baseline).attr('stroke-dasharray', '3').attr('stroke-width', 1);
    g.append('circle').attr('cx', x(bq)).attr('cy', y(bp)).attr('r', 3).attr('fill', COLORS.baseline);

    // Draw phases (use activePhasesForChart based on toggle)
    activePhasesForChart.forEach((phase, idx) => {
      const isActive = idx === activePhaseIndex;
      const state = phase.marketState;
      const phaseSupplyShift = supplyShiftFromState(state);
      const [pq, pp] = findEquilibrium(phaseSupplyShift, state.nachfragedruck, state.angebotspotenzial_regulation, state);

      // Supply curve — Steigung abhängig von Regulationsgrad
      g.append('path').datum(supplyCurve(phaseSupplyShift, state.angebotspotenzial_regulation, state))
        .attr('d', line).attr('fill', 'none')
        .attr('stroke', COLORS.supply)
        .attr('stroke-width', isActive ? 2.5 : 1)
        .attr('opacity', isActive ? 1 : 0.15);

      // Demand curve
      g.append('path').datum(demandCurve(state.nachfragedruck))
        .attr('d', line).attr('fill', 'none')
        .attr('stroke', COLORS.demand)
        .attr('stroke-width', isActive ? 2.5 : 1)
        .attr('opacity', isActive ? 1 : 0.15);

      // Equilibrium dot
      g.append('circle')
        .attr('cx', x(pq)).attr('cy', y(pp))
        .attr('r', isActive ? 6 : 3)
        .attr('fill', isActive ? COLORS.equilibrium : '#666')
        .attr('stroke', isActive ? '#fff' : 'none')
        .attr('stroke-width', 2)
        .attr('opacity', isActive ? 1 : 0.4);

      if (isActive) {
        // Guideline for active equilibrium
        g.append('line').attr('x1', x(pq)).attr('y1', y(pp)).attr('x2', x(pq)).attr('y2', y(0))
          .attr('stroke', COLORS.equilibrium).attr('stroke-dasharray', '2').attr('stroke-width', 1);
        g.append('line').attr('x1', 0).attr('y1', y(pp)).attr('x2', x(pq)).attr('y2', y(pp))
          .attr('stroke', COLORS.equilibrium).attr('stroke-dasharray', '2').attr('stroke-width', 1);

        // Mietpreisdeckel: Preisobergrenze durch Mietpreisschutz.
        // Zum gedeckelten Preis: angebotene Menge < nachgefragte Menge
        // → oranges Segment = Angebotslücke.
        const deckel = mietpreisdeckel(phaseSupplyShift, state.nachfragedruck, state.angebotspotenzial_regulation, state);
        if (deckel) {
          g.append('line')
            .attr('x1', 0).attr('y1', y(deckel.p))
            .attr('x2', x(deckel.qNachfrage)).attr('y2', y(deckel.p))
            .attr('stroke', COLORS.deckel).attr('stroke-width', 2).attr('stroke-dasharray', '6 3');
          g.append('line')
            .attr('x1', x(deckel.qAngebot)).attr('y1', y(deckel.p))
            .attr('x2', x(deckel.qNachfrage)).attr('y2', y(deckel.p))
            .attr('stroke', COLORS.luecke).attr('stroke-width', 4).attr('stroke-linecap', 'round');
          g.append('circle').attr('cx', x(deckel.qAngebot)).attr('cy', y(deckel.p))
            .attr('r', 3.5).attr('fill', COLORS.deckel);
          g.append('circle').attr('cx', x(deckel.qNachfrage)).attr('cy', y(deckel.p))
            .attr('r', 3.5).attr('fill', COLORS.luecke);
        }
      }
    });

    // Legend
    const legend = g.append('g').attr('transform', `translate(${w + 10}, 0)`);
    
    legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 20).attr('y2', 0)
      .attr('stroke', COLORS.demand).attr('stroke-width', 2.5);
    legend.append('text').attr('x', 25).attr('y', 4).attr('fill', '#ccc').attr('font-size', 11).text('Nachfrage');

    legend.append('line').attr('x1', 0).attr('y1', 20).attr('x2', 20).attr('y2', 20)
      .attr('stroke', COLORS.supply).attr('stroke-width', 2.5);
    legend.append('text').attr('x', 25).attr('y', 24).attr('fill', '#ccc').attr('font-size', 11).text('Angebot');

    legend.append('line').attr('x1', 0).attr('y1', 40).attr('x2', 20).attr('y2', 40)
      .attr('stroke', COLORS.baseline).attr('stroke-width', 1.5).attr('stroke-dasharray', '4');
    legend.append('text').attr('x', 25).attr('y', 44).attr('fill', '#888').attr('font-size', 11).text('Heutige Situation');

    legend.append('circle').attr('cx', 10).attr('cy', 64).attr('r', 5).attr('fill', COLORS.equilibrium).attr('stroke', '#fff').attr('stroke-width', 1);
    legend.append('text').attr('x', 25).attr('y', 68).attr('fill', '#ccc').attr('font-size', 11).text('Gleichgewicht');

    // Deckel-Legende nur wenn in der aktiven Phase ein Deckel besteht
    const activeState = activePhasesForChart[activePhaseIndex]?.marketState;
    const activeDeckel = activeState
      ? mietpreisdeckel(supplyShiftFromState(activeState), activeState.nachfragedruck, activeState.angebotspotenzial_regulation, activeState)
      : null;
    if (activeDeckel) {
      legend.append('line').attr('x1', 0).attr('y1', 84).attr('x2', 20).attr('y2', 84)
        .attr('stroke', COLORS.deckel).attr('stroke-width', 2).attr('stroke-dasharray', '6 3');
      legend.append('text').attr('x', 25).attr('y', 88).attr('fill', '#ccc').attr('font-size', 11).text('Mietpreisdeckel');

      legend.append('line').attr('x1', 0).attr('y1', 104).attr('x2', 20).attr('y2', 104)
        .attr('stroke', COLORS.luecke).attr('stroke-width', 4).attr('stroke-linecap', 'round');
      legend.append('text').attr('x', 25).attr('y', 108).attr('fill', '#ccc').attr('font-size', 11).text('Angebotslücke');
    }

  }, [context, baseline, modified, diff, phases, activePhaseIndex, baselinePhases, viewMode, activePhasesForChart, baselineState]);

  return (
    <div className="supply-demand-chart">
      <div className="supply-demand-chart__title">Preis-Mengen-Diagramm</div>
      
      {/* Toggle: nur sichtbar wenn Parameter geändert */}
      {baselinePhases && (
        <div className="supply-demand-chart__toggle-row">
          <button
            className={`supply-demand-chart__toggle-btn ${viewMode === 'heutig' ? 'supply-demand-chart__toggle-btn--active' : ''}`}
            onClick={() => setViewMode('heutig')}
          >
            Heutige Situation
          </button>
          <button
            className={`supply-demand-chart__toggle-btn ${viewMode === 'simuliert' ? 'supply-demand-chart__toggle-btn--active' : ''}`}
            onClick={() => setViewMode('simuliert')}
          >
            Simulierte Anpassungen
          </button>
        </div>
      )}

      {/* Eine Reihe Phase-Buttons */}
      <div className="supply-demand-chart__phase-selector">
        {activePhasesForChart.map((p, i) => (
          <button
            key={i}
            className={`supply-demand-chart__phase-btn ${i === activePhaseIndex ? 'supply-demand-chart__phase-btn--active' : ''}`}
            onClick={() => setActivePhaseIndex(i)}
          >
            {PHASE_NAMES[i]}
            <span className="supply-demand-chart__phase-years">{p.yearsLabel}</span>
          </button>
        ))}
      </div>

      <div className="supply-demand-chart__svg-container">
        <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" />
      </div>
    </div>
  );
}
