import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { CityParams40, CityContext, ParamsDiff40 } from '../types';
import type { PhaseResult } from '../model/phases';
import { computeMarketState, clampE1 } from '../model/market-state';
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
};

export function SupplyDemandChart({ context, baseline, modified, diff, phases, baselinePhases }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(2); // Default to P3
  // Toggle: 'simuliert' (default) | 'heutig'
  const [viewMode, setViewMode] = useState<'simuliert' | 'heutig'>('simuliert');

  // Active phases depend on toggle
  const activePhasesForChart = (baselinePhases && viewMode === 'heutig') ? baselinePhases : phases;

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

    const CURVE_POINTS = 200;
    const SHIFT_SCALE = 5;

    function supplyCurve(shift: number, regulation: number): [number, number][] {
      // Steigung abhängig von Regulationsgrad:
      // regulation = -1 (elastisch/dereguliert): slope = 0.8 × 0.5 = 0.4 → flache Kurve, Menge reagiert stark
      // regulation =  0 (neutral):             slope = 0.8 × 1.0 = 0.8 → Normalkurve
      // regulation = +1 (unelastisch/reguliert): slope = 0.8 × 1.5 = 1.2 → steile Kurve, Preis reagiert stark
      const slope = 0.8 * (1 + regulation * 0.5);
      return Array.from({ length: CURVE_POINTS }, (_, i) => {
        const q = (i / (CURVE_POINTS - 1)) * 10;
        const p = 1 + (q - shift * SHIFT_SCALE) * slope;
        return [q, Math.max(0, Math.min(10, p))] as [number, number];
      });
    }

    function demandCurve(shift: number): [number, number][] {
      return Array.from({ length: CURVE_POINTS }, (_, i) => {
        const q = (i / (CURVE_POINTS - 1)) * 10;
        const p = 9 - (q - shift * SHIFT_SCALE) * 0.8;
        return [q, Math.max(0, Math.min(10, p))] as [number, number];
      });
    }

    function findEquilibrium(supplyShift: number, demandShift: number, supplyRegulation: number): [number, number] {
      // Gleichgewicht aus:
      //   Angebot:  P = 1 + slope·(q - 7·s)   mit slope = 0.8·(1 + regulation·0.5)
      //   Nachfrage: P = 9 - 0.8·(q - 7·d)
      // Gleichsetzen → (slope + 0.8)·q = 8 + 7·slope·s + 5.6·d
      // → qEq = (8 + 7·slope·s + 5.6·d) / (slope + 0.8)
      // Mit slope=0.8 (unreguliert): qEq = (8 + 5.6·s + 5.6·d) / 1.6 = 5 + 3.5·(s+d) ✓
      const slope = 0.8 * (1 + supplyRegulation * 0.5);
      const s = supplyShift, d = demandShift;
      const qEq = Math.max(0, Math.min(10, (8 + 7 * slope * s + 5.6 * d) / (slope + 0.8)));
      const pEq = Math.max(0, Math.min(10, 1 + slope * (qEq - 7 * s)));
      return [qEq, pEq];
    }

    // Baseline curves: always use baseline params for the dashed reference line
    const baselineState = clampE1(computeMarketState(context, baseline, baseline, {}));
    const [bq, bp] = findEquilibrium(baselineState.angebotspotenzial, baselineState.nachfragedruck, baselineState.angebotspotenzial_regulation);

    // Draw baseline curves (dashed)
    g.append('path').datum(supplyCurve(baselineState.angebotspotenzial, baselineState.angebotspotenzial_regulation))
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
      const [pq, pp] = findEquilibrium(state.angebotspotenzial, state.nachfragedruck, state.angebotspotenzial_regulation);

      // Supply curve — Steigung abhängig von Regulationsgrad
      g.append('path').datum(supplyCurve(state.angebotspotenzial, state.angebotspotenzial_regulation))
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

  }, [context, baseline, modified, diff, phases, activePhaseIndex, baselinePhases, viewMode, activePhasesForChart]);

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
