import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { CityParams40, CityContext, ParamsDiff40, MarketState, DerivedIndicators } from '../types';
import type { PhaseResult } from '../model/phases';
import { computeMarketState, clampE1 } from '../model/market-state';
import './SupplyDemandChart.css';

interface Props {
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  diff: ParamsDiff40;
  phases: PhaseResult[];
}

const MARGIN = { top: 20, right: 110, bottom: 40, left: 50 };
const WIDTH = 500;
const HEIGHT = 200;

// Phase styling: P1=bold solid, P2=medium, P3=faded dashed
const PHASE_STYLES = [
  { strokeWidth: 2.5, opacity: 1.0, dashArray: null },   // P1: bold solid
  { strokeWidth: 2.0, opacity: 0.8, dashArray: null },   // P2: medium solid
  { strokeWidth: 1.5, opacity: 0.5, dashArray: '5,4' },  // P3: faded dashed
];

const PHASE_COLORS = {
  supply: ['#4dabf7', '#74c0fc', '#a5d8ff'],
  demand: ['#ff6b6b', '#ff8787', '#ffa8a8'],
  equilibrium: ['#ffd43b', '#ffe066', '#fff3bf'],
};

export function SupplyDemandChart({ context, baseline, modified, diff, phases }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !phases || phases.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = WIDTH - MARGIN.left - MARGIN.right;
    const h = HEIGHT - MARGIN.top - MARGIN.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const x = d3.scaleLinear().domain([0, 10]).range([0, w]);
    const y = d3.scaleLinear().domain([0, 10]).range([h, 0]);

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(0))
      .selectAll('text').remove();
    g.append('g')
      .call(d3.axisLeft(y).ticks(0))
      .selectAll('text').remove();

    // Axis labels
    g.append('text').attr('x', w / 2).attr('y', h + 30)
      .attr('text-anchor', 'middle').attr('fill', '#555').attr('font-size', 11)
      .text('Menge');
    g.append('text').attr('transform', 'rotate(-90)')
      .attr('x', -h / 2).attr('y', -35)
      .attr('text-anchor', 'middle').attr('fill', '#555').attr('font-size', 11)
      .text('Preis');

    const line = d3.line<[number, number]>()
      .x(d => x(d[0])).y(d => y(d[1]))
      .curve(d3.curveBasis);

    // Compute baseline E1 state (no changes = 0 shift)
    const baselineState = clampE1(computeMarketState(context, baseline, baseline, {}));

    const SHIFT_SCALE = 7;

    function supplyCurve(shift: number): [number, number][] {
      return Array.from({ length: 50 }, (_, i) => {
        const q = (i / 49) * 10;
        const p = 1 + (q - shift * SHIFT_SCALE) * 0.8;
        return [q, Math.max(0, Math.min(10, p))] as [number, number];
      });
    }

    function demandCurve(shift: number): [number, number][] {
      return Array.from({ length: 50 }, (_, i) => {
        const q = (i / 49) * 10;
        const p = 9 - (q - shift * SHIFT_SCALE) * 0.8;
        return [q, Math.max(0, Math.min(10, p))] as [number, number];
      });
    }

    function findEquilibrium(supplyShift: number, demandShift: number): [number, number] {
      const s = supplyShift, d = demandShift;
      const qEq = (8 + 0.8 * SHIFT_SCALE * (s + d)) / 1.6;
      const pEq = 1 + (qEq - s * SHIFT_SCALE) * 0.8;
      return [Math.max(0, Math.min(10, qEq)), Math.max(0, Math.min(10, pEq))];
    }

    const hasChanges = Object.keys(diff).length > 0;

    // Draw baseline curves (dashed, grey)
    const baseSupply = baselineState.angebotspotenzial;
    const baseDemand = baselineState.nachfragedruck;
    g.append('path').datum(supplyCurve(baseSupply))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-dasharray', '4');
    g.append('path').datum(demandCurve(baseDemand))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-dasharray', '4');

    // Baseline equilibrium
    const [bq, bp] = findEquilibrium(baseSupply, baseDemand);
    g.append('line').attr('x1', x(bq)).attr('y1', y(bp)).attr('x2', x(bq)).attr('y2', y(0))
      .attr('stroke', '#555').attr('stroke-dasharray', '3').attr('stroke-width', 1);
    g.append('line').attr('x1', 0).attr('y1', y(bp)).attr('x2', x(bq)).attr('y2', y(bp))
      .attr('stroke', '#555').attr('stroke-dasharray', '3').attr('stroke-width', 1);
    g.append('circle').attr('cx', x(bq)).attr('cy', y(bp)).attr('r', 3).attr('fill', '#555');

    // Draw each phase
    phases.forEach((phase, idx) => {
      const style = PHASE_STYLES[idx];
      const state = phase.marketState;

      const supplyPath = g.append('path').datum(supplyCurve(state.angebotspotenzial))
        .attr('d', line).attr('fill', 'none')
        .attr('stroke', PHASE_COLORS.supply[idx])
        .attr('stroke-width', style.strokeWidth)
        .attr('opacity', 0)
        .attr('stroke-dasharray', style.dashArray ?? null);

      const demandPath = g.append('path').datum(demandCurve(state.nachfragedruck))
        .attr('d', line).attr('fill', 'none')
        .attr('stroke', PHASE_COLORS.demand[idx])
        .attr('stroke-width', style.strokeWidth)
        .attr('opacity', 0)
        .attr('stroke-dasharray', style.dashArray ?? null);

      if (hasChanges) {
        supplyPath.transition().duration(600 + idx * 150).attr('opacity', style.opacity);
        demandPath.transition().duration(600 + idx * 150).attr('opacity', style.opacity);
      }

      // Equilibrium dot for this phase
      const [pq, pp] = findEquilibrium(state.angebotspotenzial, state.nachfragedruck);
      const eqRadius = 4 + (2 - idx); // P1 largest, P3 smallest

      g.append('circle')
        .attr('cx', x(pq)).attr('cy', y(pp)).attr('r', 0)
        .attr('fill', PHASE_COLORS.equilibrium[idx])
        .attr('opacity', 0)
        .transition().duration(600 + idx * 150).attr('opacity', style.opacity)
        .transition().duration(200).attr('r', eqRadius);
    });

    // Legend — all phases
    const legend = g.append('g').attr('transform', `translate(${w + 10}, 0)`);

    phases.forEach((phase, idx) => {
      const style = PHASE_STYLES[idx];
      const yOff = idx * 20;
      legend.append('line')
        .attr('x1', 0).attr('y1', yOff).attr('x2', 20).attr('y2', yOff)
        .attr('stroke', PHASE_COLORS.demand[idx])
        .attr('stroke-width', style.strokeWidth)
        .attr('opacity', style.opacity)
        .attr('stroke-dasharray', style.dashArray ?? null);
      legend.append('text')
        .attr('x', 25).attr('y', yOff + 4)
        .attr('fill', '#ccc').attr('font-size', 10)
        .attr('opacity', style.opacity)
        .text(`Nachfrage ${phase.yearsLabel}`);
    });

    legend.append('line').attr('x1', 0).attr('y1', 68).attr('x2', 20).attr('y2', 68)
      .attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-dasharray', '4');
    legend.append('text').attr('x', 25).attr('y', 72)
      .attr('fill', '#555').attr('font-size', 10).text('Ist-Zustand');

  }, [context, baseline, modified, diff, phases]);

  return (
    <div className="supply-demand-chart">
      <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
