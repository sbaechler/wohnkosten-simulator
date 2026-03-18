import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { CityParams, CityContext, ParamsDiff } from '../types';
import './SupplyDemandChart.css';

interface Props {
  context: CityContext;
  baseline: CityParams;
  modified: CityParams;
  diff: ParamsDiff;
}

// Simplified model: compute supply/demand curve shift factors
function computeSupplyShift(params: CityParams, context: CityContext): number {
  // Higher regulation = less supply (negative shift)
  const regulation = -(params.raumplanung + params.bauvorschriften +
    params.energetischeVorgaben + params.einspracherechte) / 8;
  const promotion = (params.foerderungGemeinnuetzig + params.subventionen) / 4;
  const investment = params.auslaendischeInvestitionen === 0 ? 0.1 : params.auslaendischeInvestitionen === 2 ? -0.1 : 0;
  const interest = -context.zinsniveau * 0.05;
  return regulation + promotion + investment + interest;
}

function computeDemandShift(params: CityParams, context: CityContext): number {
  const taxes = -params.steuerpolitik * 0.1;
  const attract = (params.infrastruktur - params.steuerpolitik) * 0.05;
  const subsidy = params.subventionen * 0.05;
  const migration = context.zuwanderungsdruck * 0.1;
  const economy = context.wirtschaftskraft * 0.05;
  const population = context.bevoelkerungstrend * 0.05;
  return taxes + attract + subsidy + migration + economy + population;
}

const MARGIN = { top: 20, right: 110, bottom: 40, left: 50 };
const WIDTH = 500;
const HEIGHT = 200;

export function SupplyDemandChart({ context, baseline, modified, diff }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

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

    // Curve generators
    const line = d3.line<[number, number]>()
      .x(d => x(d[0])).y(d => y(d[1]))
      .curve(d3.curveBasis);

    // Baseline shifts
    const baseSupply = computeSupplyShift(baseline, context);
    const baseDemand = computeDemandShift(baseline, context);

    // Modified shifts
    const modSupply = computeSupplyShift(modified, context);
    const modDemand = computeDemandShift(modified, context);

    // Generate curve points: supply goes up-right, demand goes down-right
    function supplyCurve(shift: number): [number, number][] {
      return Array.from({ length: 50 }, (_, i) => {
        const q = (i / 49) * 10;
        const p = 1 + (q + shift * 4) * 0.8;
        return [q, Math.max(0, Math.min(10, p))] as [number, number];
      });
    }

    function demandCurve(shift: number): [number, number][] {
      return Array.from({ length: 50 }, (_, i) => {
        const q = (i / 49) * 10;
        const p = 9 - (q - shift * 4) * 0.8;
        return [q, Math.max(0, Math.min(10, p))] as [number, number];
      });
    }

    // Baseline curves (dashed)
    g.append('path').datum(supplyCurve(baseSupply))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-dasharray', '4');
    g.append('path').datum(demandCurve(baseDemand))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-dasharray', '4');

    // Modified curves (solid, animated)
    const supplyPath = g.append('path').datum(supplyCurve(modSupply))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#4dabf7').attr('stroke-width', 2).attr('opacity', 0);
    const demandPath = g.append('path').datum(demandCurve(modDemand))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#ff6b6b').attr('stroke-width', 2).attr('opacity', 0);

    const hasChanges = Object.keys(diff).length > 0;
    if (hasChanges) {
      supplyPath.transition().duration(600).attr('opacity', 1);
      demandPath.transition().duration(600).attr('opacity', 1);
    }

    // Find equilibrium (approximate intersection)
    function findEquilibrium(supplyShift: number, demandShift: number): [number, number] {
      // supply: p = 1 + (q + shift*4) * 0.8
      // demand: p = 9 - (q - shift*4) * 0.8
      // set equal: 1 + (q + s*4)*0.8 = 9 - (q - d*4)*0.8
      const s = supplyShift, d = demandShift;
const qEq = (8 + 0.8 * 4 * (d - s)) / 1.6;
      const pEq = 1 + (qEq + s * 4) * 0.8;
      return [Math.max(0, Math.min(10, qEq)), Math.max(0, Math.min(10, pEq))];
    }

    const [bq, bp] = findEquilibrium(baseSupply, baseDemand);
    const [mq, mp] = findEquilibrium(modSupply, modDemand);

    // Baseline equilibrium
    g.append('line').attr('x1', x(bq)).attr('y1', y(bp)).attr('x2', x(bq)).attr('y2', y(0))
      .attr('stroke', '#555').attr('stroke-dasharray', '3').attr('stroke-width', 1);
    g.append('line').attr('x1', 0).attr('y1', y(bp)).attr('x2', x(bq)).attr('y2', y(bp))
      .attr('stroke', '#555').attr('stroke-dasharray', '3').attr('stroke-width', 1);
    g.append('circle').attr('cx', x(bq)).attr('cy', y(bp)).attr('r', 4).attr('fill', '#555');

    if (hasChanges) {
      // Modified equilibrium
      g.append('line').attr('x1', x(mq)).attr('y1', y(mp)).attr('x2', x(mq)).attr('y2', y(0))
        .attr('stroke', '#ffd43b').attr('stroke-dasharray', '3').attr('stroke-width', 1)
        .attr('opacity', 0).transition().duration(600).attr('opacity', 1);
      g.append('line').attr('x1', 0).attr('y1', y(mp)).attr('x2', x(mq)).attr('y2', y(mp))
        .attr('stroke', '#ffd43b').attr('stroke-dasharray', '3').attr('stroke-width', 1)
        .attr('opacity', 0).transition().duration(600).attr('opacity', 1);
      g.append('circle').attr('cx', x(mq)).attr('cy', y(mp)).attr('r', 5)
        .attr('fill', '#fff').attr('stroke', '#ffd43b').attr('stroke-width', 2)
        .attr('opacity', 0).transition().duration(600).attr('opacity', 1);
    }

    // Legend
    const legend = g.append('g').attr('transform', `translate(${w + 10}, 0)`);
    legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 20).attr('y2', 0)
      .attr('stroke', '#ff6b6b').attr('stroke-width', 2);
    legend.append('text').attr('x', 25).attr('y', 4).attr('fill', '#ff6b6b').attr('font-size', 10).text('Nachfrage');
    legend.append('line').attr('x1', 0).attr('y1', 16).attr('x2', 20).attr('y2', 16)
      .attr('stroke', '#4dabf7').attr('stroke-width', 2);
    legend.append('text').attr('x', 25).attr('y', 20).attr('fill', '#4dabf7').attr('font-size', 10).text('Angebot');
    legend.append('line').attr('x1', 0).attr('y1', 32).attr('x2', 20).attr('y2', 32)
      .attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-dasharray', '4');
    legend.append('text').attr('x', 25).attr('y', 36).attr('fill', '#555').attr('font-size', 10).text('Ist-Zustand');

  }, [context, baseline, modified, diff]);

  return (
    <div className="supply-demand-chart">
      <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
