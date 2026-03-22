import type { MarketState } from '../types';
import './EigentumsquotenWidget.css';

interface Props {
  state: MarketState;
}

const CH_BASE = 36; // Swiss home ownership rate ~36%

export function EigentumsquotenWidget({ state }: Props) {
  const trend = state.eigentumsquoten_trend;
  const estimatedPct = CH_BASE + trend * 8; // -1→28%, 0→36%, +1→44%

  const isRising = trend < -0.15;
  const isFalling = trend > 0.15;

  const arrow = isRising ? '↗' : isFalling ? '↘' : '→';
  const label = isRising ? 'steigend' : isFalling ? 'fallend' : 'stabil';

  const color = isRising ? '#51cf66' : isFalling ? '#ff6b6b' : '#ffd43b';

  return (
    <div className="eigentumsquoten-widget">
      <div className="eigentumsquoten-widget__title">Eigentumsquote CH</div>

      <div className="eigentumsquoten-widget__main">
        <div className="eigentumsquoten-widget__pct">{estimatedPct}%</div>
        <div className="eigentumsquoten-widget__arrow" style={{ color }}>
          {arrow}
        </div>
        <div className="eigentumsquoten-widget__label" style={{ color }}>
          {label}
        </div>
      </div>

      <div className="eigentumsquoten-widget__bar-container">
        <div className="eigentumsquoten-widget__bar-bg">
          <div className="eigentumsquoten-widget__bar-marker" style={{ left: `${((estimatedPct - 20) / 30) * 100}%` }} />
        </div>
        <div className="eigentumsquoten-widget__bar-scale">
          <span>20%</span>
          <span>50%</span>
        </div>
      </div>

      <div className="eigentumsquoten-widget__source">
        Basis: CH-Eigentumsquote {CH_BASE}%
      </div>
    </div>
  );
}
