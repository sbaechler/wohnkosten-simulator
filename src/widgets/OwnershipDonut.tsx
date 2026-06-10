import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { CityConfig, ParamsDiff40, MarketState, CityParams40 } from '../types';
import './OwnershipDonut.css';

interface Props {
  city: CityConfig;
  modified: CityParams40;
  diff: ParamsDiff40;
  state: MarketState;
  /** When set, show baseline donut alongside modified for comparison */
  baselineState?: MarketState;
}

const COLORS = {
  privat: '#4dabf7',
  institutionell: '#845ef7',
  genossenschaft: '#51cf66',
  oeffentlich: '#ffd43b',
};

const LABELS = {
  privat: 'Privat',
  institutionell: 'Instit.',
  genossenschaft: 'Genoss.',
  oeffentlich: 'Öfftl.',
};

const SIZE = 180;

export function OwnershipDonut({ city, modified, diff, state }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${SIZE / 2},${SIZE / 2})`);

    const baseShares = city.context.ownershipBaseline || {
      privat: 0.39,
      institutionell: 0.30,
      genossenschaft: 0.175,
      oeffentlich: 0.066
    };
    const hasChanges = Object.keys(diff).length > 0;

    const keys = ['privat', 'institutionell', 'genossenschaft', 'oeffentlich'] as const;

    const pie = d3.pie<number>().sort(null);

    // Inner ring: baseline
    const innerArc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(25).outerRadius(42);
    const baseData = keys.map(k => baseShares[k]);
    g.selectAll('.inner')
      .data(pie(baseData))
      .join('path')
      .attr('d', innerArc)
      .attr('fill', (_, i) => COLORS[keys[i]])
      .attr('opacity', hasChanges ? 0.3 : 0.8)
      .append('title')
      .text(d => `${LABELS[keys[d.index]]}: ${(d.data * 100).toFixed(1)}%`);

    // Outer ring: modified (only if changes exist)
    if (hasChanges) {
      const outerArc = d3.arc<d3.PieArcDatum<number>>()
        .innerRadius(48).outerRadius(70);
      const modData = keys.map(k => {
        // E1-Signale anwenden (vereinfacht, ohne computeOwnership)
        const eigentumShift = state.eigentumsquoten_trend * 0.05;
        const genossShift = state.gemeinnuetzig_kraft * 0.03;
        const investShift = state.investitionsattraktivitaet * 0.04;
        
        let value = baseShares[k as keyof typeof baseShares];
        if (k === 'privat') value += eigentumShift;
        if (k === 'genossenschaft') value += genossShift;
        if (k === 'institutionell') value += investShift;
        
        return Math.max(0.01, value);
      });
      
      const total = modData.reduce((a, b) => a + b, 0);
      const normalizedModData = modData.map(v => v / total);
      
      g.selectAll('.outer')
        .data(pie(normalizedModData))
        .join('path')
        .attr('d', outerArc)
        .attr('fill', (_, i) => COLORS[keys[i]])
        .attr('opacity', 0)
        .transition().duration(600).attr('opacity', 0.9)
        .on('end', function() {
          d3.select(this).append('title')
            .text(d => `${LABELS[keys[d.index]]}: ${(d.data * 100).toFixed(1)}%`);
        });
    }

    // Center annotation
    if (hasChanges) {
      g.append('text').attr('text-anchor', 'middle').attr('y', -4)
        .attr('fill', '#888').attr('font-size', 8).text('aussen: neu');
      g.append('text').attr('text-anchor', 'middle').attr('y', 8)
        .attr('fill', '#555').attr('font-size', 8).text('innen: ist');
    }

  }, [city, modified, diff, state]);

  return (
    <div className="ownership-donut">
      <div className="ownership-donut__title">Eigentümerschaft</div>
      <svg ref={svgRef} viewBox={`0 0 ${SIZE} ${SIZE}`} preserveAspectRatio="xMidYMid meet" />
      <div className="ownership-donut__legend">
        {Object.entries(LABELS).map(([key, label]) => (
          <span key={key} style={{ color: COLORS[key as keyof typeof COLORS] }}>
            {'\u25A0'} {label}
          </span>
        ))}
      </div>
    </div>
  );
}