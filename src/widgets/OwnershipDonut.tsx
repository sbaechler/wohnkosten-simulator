import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { CityParams40, CityContext, ParamsDiff40, MarketState } from '../types';
import './OwnershipDonut.css';

interface Props {
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  diff: ParamsDiff40;
  state: MarketState;
  /** When set, show baseline donut alongside modified for comparison */
  baselineState?: MarketState;
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

/**
 * Berechnet Eigentumsverteilung aus V2-Parametern.
 * Die Verteilung reagiert auf:
 * - Gemeinnützigkeitsförderung (→ Genossenschaften, öffentlich)
 * - Mietrecht-Strenge (→ weniger institutionelle Anleger)
 * - Ausländische Investoren-Regulierung (→ weniger institutionell)
 * - Wirtschaftskraft (→ mehr institutionell)
 */
function computeOwnership(params: CityParams40, context: CityContext): OwnershipShares {
  // Basisverteilung (gemäss BFS / Wüest Partner ca. 36% Eigentum, Rest Miete)
  let privat = 0.42;
  let institutionell = 0.28;
  let genossenschaft = 0.18;
  let oeffentlich = 0.12;

  // Gemeinnützig fördert Genossenschafts- und öffentlichen Wohnungsbau
  const foerderung =
    (params.gemeinnuetzig_mindestanteil +
      params.gemeinnuetzig_foerderfonds +
      params.gemeinnuetzig_baurecht) / 6;
  genossenschaft += foerderung;
  oeffentlich += foerderung * 0.3;
  privat -= foerderung * 0.7;
  institutionell -= foerderung * 0.3;

  // Mietrecht: strenges Mietrecht reduziert institutionelle Anleger
  const mietEffect =
    (params.mietrecht_kostenmiete +
      params.mietrecht_anfangsmiete +
      params.mietrecht_kuendigungsschutz) / 9;
  institutionell -= mietEffect;
  genossenschaft += mietEffect * 0.6;
  privat += mietEffect * 0.4;

  // Kapitalregulierung: restriktive параметры reduzieren institutionelle
  const kapitalEffect =
    (params.kapital_auslaendische_investoren +
      params.kapital_institutionelle_regulierung +
      params.kapital_hypothekarregulierung) / 6;
  institutionell -= kapitalEffect;
  privat += kapitalEffect;

  // Nutzungsregulierung: Kurzzeitvermietung → mehr institutionell (Airbnb-Ersatz)
  const nutzEffect = params.nutzung_kurzzeitvermietung / 4;
  institutionell += nutzEffect * 0.5;
  privat -= nutzEffect * 0.5;

  // Wirtschaftskraft: starke Wirtschaft → mehr institutionelle
  institutionell += context.wirtschaftskraft * 0.02;
  privat -= context.wirtschaftskraft * 0.02;

  // Zinsniveau: tief → mehr Kauf, weniger Miete
  privat += -context.zinsniveau * 0.01;
  institutionell -= -context.zinsniveau * 0.01;

  // Normalisieren
  const total = privat + institutionell + genossenschaft + oeffentlich;
  const round = (v: number) => Math.max(0.03, v / total);
  return {
    privat: round(privat),
    institutionell: round(institutionell),
    genossenschaft: round(genossenschaft),
    oeffentlich: round(oeffentlich),
  };
}

/**
 * Berechnet modifizierte Eigentumsverteilung basierend auf E1-Signalen.
 * - eigentumsquoten_trend: positive = mehr Privatbesitz
 * - gemeinnuetzig_kraft: positive = mehr Genossenschaften
 * - investitionsattraktivitaet: positive = mehr Institutionelle
 */
function computeModifiedOwnership(baseShares: OwnershipShares, state: MarketState): OwnershipShares {
  let { privat, institutionell, genossenschaft } = baseShares;
  const { oeffentlich } = baseShares;

  // E1-Signale anwenden (skaliert für sichtbare Effekte)
  const eigentumShift = state.eigentumsquoten_trend * 0.15;
  const genossShift = state.gemeinnuetzig_kraft * 0.12;
  const investShift = state.investitionsattraktivitaet * 0.10;

  // Apply shifts
  privat += eigentumShift;
  genossenschaft += genossShift;
  institutionell += investShift;

  // oeffentlich absorbs remaining or compensates
  const total = privat + institutionell + genossenschaft + oeffentlich;
  const scale = 1 / total;

  return {
    privat: Math.max(0.03, privat * scale),
    institutionell: Math.max(0.03, institutionell * scale),
    genossenschaft: Math.max(0.03, genossenschaft * scale),
    oeffentlich: Math.max(0.03, oeffentlich * scale),
  };
}

const SIZE = 180;

export function OwnershipDonut({ context, baseline, modified, diff, state }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${SIZE / 2},${SIZE / 2})`);

    const baseShares = computeOwnership(baseline, context);
    const modShares = computeModifiedOwnership(baseShares, state);
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
      .attr('opacity', hasChanges ? 0.3 : 0.8);

    // Outer ring: modified
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

    // Center annotation
    if (hasChanges) {
      g.append('text').attr('text-anchor', 'middle').attr('y', -4)
        .attr('fill', '#888').attr('font-size', 8).text('aussen: neu');
      g.append('text').attr('text-anchor', 'middle').attr('y', 8)
        .attr('fill', '#555').attr('font-size', 8).text('innen: ist');
    }

  }, [context, baseline, modified, diff, state]);

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
