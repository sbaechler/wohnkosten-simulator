import type { MarketState, DerivedIndicators, CityContext } from '../types';
import './StandortwettbewerbWidget.css';

interface Props {
  state: MarketState;
  derived: DerivedIndicators;
  context: CityContext;
}

function getColor(score: number): string {
  if (score < 35) return '#ff6b6b';
  if (score < 65) return '#ffd43b';
  return '#51cf66';
}

export function StandortwettbewerbWidget({ state, context }: Props) {
  // Formula: aufwertungsdruck * 0.4 + investitionsattraktivitaet * 0.3 + (wirtschaftskraft/2) * 0.3
  const rohwert =
    state.aufwertungsdruck * 0.4 +
    state.investitionsattraktivitaet * 0.3 +
    (context.wirtschaftskraft / 2) * 0.3;

  // Clamp to -1...+1 range, then map to 0...100
  const clamped = Math.max(-1, Math.min(1, rohwert));
  const score = Math.round(((clamped + 1) / 2) * 100);
  const color = getColor(score);

  return (
    <div className="standortwettbewerb-widget">
      <div className="standortwettbewerb-widget__title">Standortattraktivität</div>

      <div className="standortwettbewerb-widget__score" style={{ color }}>
        {score}
      </div>

      <div className="standortwettbewerb-widget__bar-container">
        <div className="standortwettbewerb-widget__gradient-bar">
          <span style={{ background: '#ff6b6b', flex: 1 }} />
          <span style={{ background: '#ffd43b', flex: 1 }} />
          <span style={{ background: '#51cf66', flex: 1 }} />
        </div>
        <div
          className="standortwettbewerb-widget__indicator"
          style={{ left: `${score}%`, borderTopColor: color }}
        />
      </div>

      <div className="standortwettbewerb-widget__labels">
        <span>weniger attraktiv</span>
        <span>attraktiv</span>
        <span>sehr attraktiv</span>
      </div>

      <div className="standortwettbewerb-widget__components">
        <span>Aufwertungsdruck: {Math.round(state.aufwertungsdruck * 100)}%</span>
        <span>Investitionsattr.: {Math.round(state.investitionsattraktivitaet * 100)}%</span>
        <span>Wirtschaftskraft: {context.wirtschaftskraft > 0 ? '+' : ''}{context.wirtschaftskraft}</span>
      </div>
    </div>
  );
}
