import type { MarketState } from '../types';
import { CompareColumns } from './CompareColumns';
import './GemeinnuetzigSektorWidget.css';

interface Props {
  state: MarketState;
  /** Wenn gesetzt: «Heute» neben «Simuliert» */
  baselineState?: MarketState;
}

/**
 * Schwelle für die Beschriftung, gleiche Konvention wie
 * TREND_CLASSIFY_THRESHOLD in groups.ts (±0.15 der normierten Skala).
 */
const TREND_THRESHOLD = 0.15;

function getColor(v: number): string {
  if (v < -TREND_THRESHOLD) return '#ff6b6b';
  if (v > TREND_THRESHOLD) return '#51cf66';
  return '#ffd43b';
}

function formatIndex(v: number): string {
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(2)}`;
}

function GemeinnuetzigBody({ state }: { state: MarketState }) {
  // gemeinnuetzig_kraft ist ein normierter Index der Politik-ÄNDERUNG
  // gegenüber heute, kein Marktanteil. Deshalb keine Prozent-Prognose und
  // keine Referenzmarken (Zürich, Wien): der Nullpunkt ist «wie heute».
  const value = state.gemeinnuetzig_kraft;
  const color = getColor(value);
  const label = value > TREND_THRESHOLD ? 'wird gestärkt' : value < -TREND_THRESHOLD ? 'wird geschwächt' : 'wie heute';

  return (
    <>
      <div className="gemeinnuetzig-widget__bar-container">
        <div className="gemeinnuetzig-widget__gradient-bar">
          <span style={{ background: '#ff6b6b', flex: 1 }} />
          <span style={{ background: '#ffd43b', flex: 1 }} />
          <span style={{ background: '#51cf66', flex: 1 }} />
        </div>
        <div
          className="gemeinnuetzig-widget__indicator"
          style={{ left: `${((value + 1) / 2) * 100}%`, borderTopColor: color }}
        />
      </div>
      <div className="gemeinnuetzig-widget__labels">
        <span>schwächer</span>
        <span>stärker</span>
      </div>
      <div className="gemeinnuetzig-widget__value" style={{ color }}>
        {label} ({formatIndex(value)})
      </div>
    </>
  );
}

export function GemeinnuetzigSektorWidget({ state, baselineState }: Props) {
  return (
    <div className="gemeinnuetzig-widget">
      <div className="gemeinnuetzig-widget__title">Gemeinnütziger Sektor</div>
      <CompareColumns
        baseline={baselineState && <GemeinnuetzigBody state={baselineState} />}
        current={<GemeinnuetzigBody state={state} />}
      />
    </div>
  );
}
