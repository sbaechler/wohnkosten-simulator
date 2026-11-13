import type { MarketState } from '../types';
import { CompareColumns } from './CompareColumns';
import './EigentumsquotenWidget.css';

interface Props {
  state: MarketState;
  /** Wenn gesetzt: «Heute» neben «Simuliert» */
  baselineState?: MarketState;
}

/**
 * Schwelle, ab der der Trend als steigend/fallend beschriftet wird.
 * Gleiche Konvention wie TREND_CLASSIFY_THRESHOLD in groups.ts (±0.15 der
 * normierten Skala), damit kleine Ausschläge nicht als Trend erscheinen.
 */
const TREND_THRESHOLD = 0.15;

function formatIndex(v: number): string {
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(2)}`;
}

function EigentumsquotenBody({ state }: { state: MarketState }) {
  // eigentumsquoten_trend: +1 = Trend zu mehr Wohneigentum, −1 = zu mehr Miete.
  // Normierter Index, keine Prozentpunkte der Eigentumsquote.
  const trend = state.eigentumsquoten_trend;
  const isRising = trend > TREND_THRESHOLD;
  const isFalling = trend < -TREND_THRESHOLD;

  const arrow = isRising ? '↗' : isFalling ? '↘' : '→';
  const label = isRising ? 'steigend' : isFalling ? 'fallend' : 'stabil';
  const color = isRising ? '#51cf66' : isFalling ? '#ff6b6b' : '#ffd43b';

  return (
    <>
      <div className="eigentumsquoten-widget__main">
        <div className="eigentumsquoten-widget__pct">{formatIndex(trend)}</div>
        <div className="eigentumsquoten-widget__arrow" style={{ color }}>
          {arrow}
        </div>
        <div className="eigentumsquoten-widget__label" style={{ color }}>
          {label}
        </div>
      </div>
      <div className="eigentumsquoten-widget__bar-container">
        <div className="eigentumsquoten-widget__bar-bg">
          <div className="eigentumsquoten-widget__bar-marker" style={{ left: `${((trend + 1) / 2) * 100}%` }} />
        </div>
        <div className="eigentumsquoten-widget__bar-scale">
          <span>mehr Miete</span>
          <span>mehr Eigentum</span>
        </div>
      </div>
    </>
  );
}

export function EigentumsquotenWidget({ state, baselineState }: Props) {
  return (
    <div className="eigentumsquoten-widget">
      <div className="eigentumsquoten-widget__title">Eigentumsquote (Trend)</div>
      <CompareColumns
        baseline={baselineState && <EigentumsquotenBody state={baselineState} />}
        current={<EigentumsquotenBody state={state} />}
      />
      <div className="eigentumsquoten-widget__source">
        Normierter Index −1…+1, langfristig (5–10 Jahre). Kein Prozentwert.
      </div>
    </div>
  );
}
