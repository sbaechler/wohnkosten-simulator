import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { CityParams, CityContext, ParamsDiff } from '../types';
import './OwnershipDonut.css';

interface Props {
  context: CityContext;
  baseline: CityParams;
  modified: CityParams;
  diff: ParamsDiff;
}

interface OwnershipShares {
  privat: number;
  institutionell: number;
  genossenschaft: number;
  oeffentlich: number;
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

function computeOwnership(params: CityParams, context: CityContext): OwnershipShares {
  // Base distribution, adjusted by params
  let privat = 0.40;
  let institutionell = 0.30;
  let genossenschaft = 0.18;
  let oeffentlich = 0.12;

  // Förderung gemeinnützig shifts to coops/public
  const foerderung = params.foerderungGemeinnuetzig * 0.04;
  genossenschaft += foerderung;
  privat -= foerderung * 0.5;
  institutionell -= foerderung * 0.5;

  // Strong Mietrecht reduces institutional
  const mietEffect = params.mietrecht * 0.03;
  institutionell -= mietEffect;
  privat += mietEffect * 0.5;
  genossenschaft += mietEffect * 0.5;

  // Restriktive ausländische Investitionen reduce institutional
  const foreignEffect = params.auslaendischeInvestitionen * 0.02;
  institutionell -= foreignEffect;
  privat += foreignEffect;

  // High Wirtschaftskraft increases institutional
  institutionell += context.wirtschaftskraft * 0.02;
  privat -= context.wirtschaftskraft * 0.02;

  // Normalize to sum = 1
  const total = privat + institutionell + genossenschaft + oeffentlich;
  return {
    privat: Math.max(0.05, privat / total),
    institutionell: Math.max(0.05, institutionell / total),
    genossenschaft: Math.max(0.05, genossenschaft / total),
    oeffentlich: Math.max(0.05, oeffentlich / total),
  };
}

const SIZE = 180;

export function OwnershipDonut({ context, baseline, modified, diff }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${SIZE / 2},${SIZE / 2})`);

    const baseShares = computeOwnership(baseline, context);
    const modShares = computeOwnership(modified, context);
    const hasChanges = Object.keys(diff).length > 0;

    const keys = ['privat', 'institutionell', 'genossenschaft', 'oeffentlich'] as const;

    const pie = d3.pie<number>().sort(null);

    // Inner ring: baseline (always shown)
    const innerArc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(25).outerRadius(42);
    const baseData = keys.map(k => baseShares[k]);
    g.selectAll('.inner')
      .data(pie(baseData))
      .join('path')
      .attr('d', innerArc)
      .attr('fill', (_, i) => COLORS[keys[i]])
      .attr('opacity', hasChanges ? 0.3 : 0.8);

    // Outer ring: modified (only if changes)
    if (hasChanges) {
      const outerArc = d3.arc<d3.PieArcDatum<number>>()
        .innerRadius(48).outerRadius(70);
      const modData = keys.map(k => modShares[k]);
      g.selectAll('.outer')
        .data(pie(modData))
        .join('path')
        .attr('d', outerArc)
        .attr('fill', (_, i) => COLORS[keys[i]])
        .attr('opacity', 0)
        .transition().duration(600).attr('opacity', 0.9);
    }

    // Center text
    if (hasChanges) {
      g.append('text').attr('text-anchor', 'middle').attr('y', -4)
        .attr('fill', '#888').attr('font-size', 8).text('aussen: neu');
      g.append('text').attr('text-anchor', 'middle').attr('y', 8)
        .attr('fill', '#555').attr('font-size', 8).text('innen: ist');
    }

  }, [context, baseline, modified, diff]);

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
