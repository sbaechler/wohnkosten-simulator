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
  uebrige: '#adb5bd',
};

const LABELS = {
  privat: 'Privat',
  institutionell: 'Instit.',
  genossenschaft: 'Genoss.',
  oeffentlich: 'Öfftl.',
  uebrige: 'Übrige',
};

const SIZE = 180;

/**
 * Verschiebung der Eigentumsanteile pro +1.0 E1-Wert (in Anteilspunkten).
 * Vereinfachtes Wirkmodell: E1-Trends verschieben die Baseline-Anteile
 * linear; danach wird auf Summe 1 renormalisiert.
 * Grössenordnung: ±3–5 Anteilspunkte bei maximalem E1-Ausschlag über
 * den Simulationshorizont (10 Jahre) — konservativ, da Eigentumsstrukturen
 * sehr träge sind (BFS Gebäude- und Wohnungsstatistik: Verschiebungen
 * von wenigen Prozentpunkten pro Jahrzehnt).
 */
const OWNERSHIP_SHIFT = {
  /** eigentumsquoten_trend → privat */
  privat: 0.05,
  /** gemeinnuetzig_kraft → genossenschaft */
  genossenschaft: 0.03,
  /** investitionsattraktivitaet → institutionell */
  institutionell: 0.04,
} as const;

const KEYS = ['privat', 'institutionell', 'genossenschaft', 'oeffentlich', 'uebrige'] as const;

/**
 * Baseline-Anteile inkl. Residual "Übrige" (Rest zu 1 — z. B. selbstgenutztes
 * Stockwerkeigentum), damit die Arc-Grössen mit den Tooltip-Prozenten
 * übereinstimmen.
 */
function sharesWithResidual(ob: CityConfig['context']['ownershipBaseline']): Record<(typeof KEYS)[number], number> {
  const sum = ob.privat + ob.institutionell + ob.genossenschaft + ob.oeffentlich;
  return { ...ob, uebrige: Math.max(0, 1 - sum) };
}

export function OwnershipDonut({ city, modified, diff, state }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${SIZE / 2},${SIZE / 2})`);

    const baseShares = sharesWithResidual(city.context.ownershipBaseline);
    const hasChanges = Object.keys(diff).length > 0;

    const pie = d3.pie<number>().sort(null);

    // Inner ring: baseline
    const innerArc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(25).outerRadius(42);
    const baseData = KEYS.map(k => baseShares[k]);
    g.selectAll('.inner')
      .data(pie(baseData))
      .join('path')
      .attr('d', innerArc)
      .attr('fill', (_, i) => COLORS[KEYS[i]])
      .attr('opacity', hasChanges ? 0.3 : 0.8)
      .append('title')
      .text(d => `${LABELS[KEYS[d.index]]}: ${(d.data * 100).toFixed(1)}%`);

    // Outer ring: modified (only if changes exist)
    if (hasChanges) {
      const outerArc = d3.arc<d3.PieArcDatum<number>>()
        .innerRadius(48).outerRadius(70);
      const modData = KEYS.map(k => {
        let value = baseShares[k];
        if (k === 'privat') value += state.eigentumsquoten_trend * OWNERSHIP_SHIFT.privat;
        if (k === 'genossenschaft') value += state.gemeinnuetzig_kraft * OWNERSHIP_SHIFT.genossenschaft;
        if (k === 'institutionell') value += state.investitionsattraktivitaet * OWNERSHIP_SHIFT.institutionell;
        return Math.max(0.01, value);
      });

      const total = modData.reduce((a, b) => a + b, 0);
      const normalizedModData = modData.map(v => v / total);

      const outer = g.selectAll('.outer')
        .data(pie(normalizedModData))
        .join('path')
        .attr('d', outerArc)
        .attr('fill', (_, i) => COLORS[KEYS[i]])
        .attr('opacity', 0);
      outer.append('title')
        .text(d => `${LABELS[KEYS[d.index]]}: ${(d.data * 100).toFixed(1)}%`);
      outer.transition().duration(600).attr('opacity', 0.9);
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
            {'■'} {label}
          </span>
        ))}
      </div>
    </div>
  );
}
