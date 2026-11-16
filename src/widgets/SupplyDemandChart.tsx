import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { CityParams, CityContext, ParamsDiff } from '../types';
import { supplyCurve, demandCurve, findEquilibrium, supplyShiftFromState, mietpreisdeckel } from '../model/supply-demand';
import type { PhaseResult } from '../model/phases';
import { computePhasesCached } from '../model/compute-phases';
import './SupplyDemandChart.css';

interface Props {
  context: CityContext;
  baseline: CityParams;
  modified: CityParams;
  diff: ParamsDiff;
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

  // Gestrichelte Referenz «Heutige Situation»: Baseline DERSELBEN Phase wie die
  // gewählte simulierte Phase. So zeigt der Abstand zwischen gestrichelter und
  // ausgezogener Kurve nur die Wirkung der Politik-Änderung, nicht zusätzlich
  // die Entwicklung der Baseline über die Zeit (Kontextfaktoren treiben auch
  // sie von P1 bis P3). Früher stand hier immer Phase 1.
  // Nur im Vergleich sinnvoll: ohne Änderungen oder in der Ansicht «Heutige
  // Situation» wäre die Referenz deckungsgleich mit der gezeigten Kurve.
  const baselineState = useMemo(() => {
    if (!baselinePhases || viewMode !== 'simuliert') return null;
    const source = baselinePhases.length > 0 ? baselinePhases : computePhasesCached(context, {});
    return source[activePhaseIndex]?.marketState ?? null;
  }, [context, baselinePhases, viewMode, activePhaseIndex]);

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
    g.append('text').attr('x', w / 2).attr('y', h - 8)
      .attr('text-anchor', 'middle').attr('fill', '#888').attr('font-size', 11)
      .text('Menge');
    g.append('text').attr('transform', 'rotate(-90)')
      .attr('x', -(h - 40) / 2).attr('y', -32)
      .attr('text-anchor', 'middle').attr('fill', '#888').attr('font-size', 11)
      .text('Preis');

    const line = d3.line<[number, number]>()
      .x(d => x(d[0])).y(d => y(d[1]))
      .curve(d3.curveLinear);

    // Referenzkurven (gestrichelt): Baseline derselben Phase, nur im Vergleich
    if (baselineState) {
      const baselineSupplyShift = supplyShiftFromState(baselineState);
      const [bq, bp] = findEquilibrium(baselineSupplyShift, baselineState.nachfragedruck, baselineState.angebotspotenzial_regulation);

      // Draw baseline curves (dashed)
      g.append('path').datum(supplyCurve(baselineSupplyShift, baselineState.angebotspotenzial_regulation))
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
    }

    // Phasen: Kurven nur für die aktive Phase. Für die übrigen Phasen bleiben
    // Gleichgewichtspunkt und Achsen-Marken (P1–P3 / M1–M3) – für die Nutzer
    // zählen Preis und Menge, nicht der Verlauf der inaktiven Kurven.
    const equilibria = activePhasesForChart.map(phase => {
      const state = phase.marketState;
      const shift = supplyShiftFromState(state);
      return findEquilibrium(shift, state.nachfragedruck, state.angebotspotenzial_regulation);
    });

    activePhasesForChart.forEach((phase, idx) => {
      const isActive = idx === activePhaseIndex;
      const state = phase.marketState;
      const phaseSupplyShift = supplyShiftFromState(state);
      const [pq, pp] = equilibria[idx];

      if (isActive) {
        // Supply curve — Steigung abhängig von Regulationsgrad
        g.append('path').datum(supplyCurve(phaseSupplyShift, state.angebotspotenzial_regulation))
          .attr('d', line).attr('fill', 'none')
          .attr('stroke', COLORS.supply).attr('stroke-width', 2.5);

        // Demand curve
        g.append('path').datum(demandCurve(state.nachfragedruck))
          .attr('d', line).attr('fill', 'none')
          .attr('stroke', COLORS.demand).attr('stroke-width', 2.5);
      }

      // Equilibrium dot
      g.append('circle')
        .attr('cx', x(pq)).attr('cy', y(pp))
        .attr('r', isActive ? 6 : 3)
        .attr('fill', isActive ? COLORS.equilibrium : '#888')
        .attr('stroke', isActive ? '#fff' : 'none')
        .attr('stroke-width', 2)
        .attr('opacity', isActive ? 1 : 0.6);

      if (isActive) {
        // Guideline for active equilibrium
        g.append('line').attr('x1', x(pq)).attr('y1', y(pp)).attr('x2', x(pq)).attr('y2', y(0))
          .attr('stroke', COLORS.equilibrium).attr('stroke-dasharray', '2').attr('stroke-width', 1);
        g.append('line').attr('x1', 0).attr('y1', y(pp)).attr('x2', x(pq)).attr('y2', y(pp))
          .attr('stroke', COLORS.equilibrium).attr('stroke-dasharray', '2').attr('stroke-width', 1);

        // Mietpreisdeckel: Preisobergrenze durch Mietpreisschutz.
        // Zum gedeckelten Preis: nachgefragte Menge > angebotene Menge
        // → oranges Segment = Angebotslücke. Die angebotene Menge ist die
        // Gleichgewichtsmenge; der Angebotsrückgang steckt schon in der
        // verschobenen Angebotskurve (supply-demand.ts, mietpreisdeckel).
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

    // Achsen-Marken: Preis (P1–P3) links, Menge (M1–M3) unten, je Phase.
    // Liegen Werte nah beieinander, werden die Beschriftungen auseinander-
    // geschoben; der Strich auf der Achse bleibt am echten Wert.
    const spread = (values: number[], minGap: number): number[] => {
      const order = values.map((v, i) => i).sort((a, b) => values[a] - values[b]);
      const out = [...values];
      for (let k = 1; k < order.length; k++) {
        const prev = out[order[k - 1]];
        if (out[order[k]] - prev < minGap) out[order[k]] = prev + minGap;
      }
      // Gesamtverschiebung zentrieren, damit die Gruppe um die echten Werte liegt
      const shift = order.reduce((acc, i) => acc + (out[i] - values[i]), 0) / order.length;
      return out.map(v => v - shift);
    };

    const markerColor = (idx: number) => idx === activePhaseIndex ? COLORS.equilibrium : '#888';
    const markerWeight = (idx: number) => idx === activePhaseIndex ? 700 : 400;

    const yPos = equilibria.map(([, p]) => y(p));
    const yLabel = spread(yPos, 11);
    equilibria.forEach((_, idx) => {
      g.append('line')
        .attr('x1', -4).attr('x2', 0).attr('y1', yPos[idx]).attr('y2', yPos[idx])
        .attr('stroke', markerColor(idx)).attr('stroke-width', 1.5);
      g.append('text')
        .attr('x', -7).attr('y', yLabel[idx]).attr('dy', '0.35em')
        .attr('text-anchor', 'end').attr('font-size', 10)
        .attr('fill', markerColor(idx)).attr('font-weight', markerWeight(idx))
        .text(`P${idx + 1}`);
    });

    const xPos = equilibria.map(([q]) => x(q));
    const xLabel = spread(xPos, 20);
    equilibria.forEach((_, idx) => {
      g.append('line')
        .attr('x1', xPos[idx]).attr('x2', xPos[idx]).attr('y1', h - 40).attr('y2', h - 36)
        .attr('stroke', markerColor(idx)).attr('stroke-width', 1.5);
      g.append('text')
        .attr('x', xLabel[idx]).attr('y', h - 25)
        .attr('text-anchor', 'middle').attr('font-size', 10)
        .attr('fill', markerColor(idx)).attr('font-weight', markerWeight(idx))
        .text(`M${idx + 1}`);
    });

    // Legend
    const legend = g.append('g').attr('transform', `translate(${w + 10}, 0)`);
    
    legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 20).attr('y2', 0)
      .attr('stroke', COLORS.demand).attr('stroke-width', 2.5);
    legend.append('text').attr('x', 25).attr('y', 4).attr('fill', '#ccc').attr('font-size', 11).text('Nachfrage');

    legend.append('line').attr('x1', 0).attr('y1', 20).attr('x2', 20).attr('y2', 20)
      .attr('stroke', COLORS.supply).attr('stroke-width', 2.5);
    legend.append('text').attr('x', 25).attr('y', 24).attr('fill', '#ccc').attr('font-size', 11).text('Angebot');

    if (baselineState) {
      legend.append('line').attr('x1', 0).attr('y1', 40).attr('x2', 20).attr('y2', 40)
        .attr('stroke', COLORS.baseline).attr('stroke-width', 1.5).attr('stroke-dasharray', '4');
      legend.append('text').attr('x', 25).attr('y', 44).attr('fill', '#888').attr('font-size', 11)
        .text(`Heute (${PHASE_NAMES[activePhaseIndex]})`);
    }

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
