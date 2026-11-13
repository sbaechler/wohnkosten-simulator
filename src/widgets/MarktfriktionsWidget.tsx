import type { MarketState } from '../types';
import { CompareColumns } from './CompareColumns';
import './MarktfriktionsWidget.css';

interface Props {
  state: MarketState;
  /** Wenn gesetzt: «Heute» neben «Simuliert» */
  baselineState?: MarketState;
}

function getDescription(value: number): string {
  const normalized = (value + 1) / 2;
  if (normalized < 0.25) {
    return 'Der Markt reagiert flexibel auf Angebot und Nachfrage.';
  } else if (normalized < 0.5) {
    return 'Leichte Verzögerungen bei Marktanpassungen.';
  } else if (normalized < 0.75) {
    return 'Erhebliche Marktfriktion bremst Preisanpassungen.';
  } else {
    return 'Starke Regulierung friert den Markt ein.';
  }
}

function MarktfriktionsBody({ state }: { state: MarketState }) {
  const normalized = (state.marktfriktion + 1) / 2;
  const percentage = Math.round(normalized * 100);

  return (
    <>

      <div className="marktfriktions-widget__bar-container">
        <div className="marktfriktions-widget__gradient-bar">
          <span style={{ background: '#51cf66', flex: 1 }} />
          <span style={{ background: '#ffd43b', flex: 1 }} />
          <span style={{ background: '#ff922b', flex: 1 }} />
          <span style={{ background: '#ff6b6b', flex: 1 }} />
        </div>
        <div
          className="marktfriktions-widget__indicator"
          style={{ left: `${percentage}%` }}
        />
      </div>

      <div className="marktfriktions-widget__labels">
        <span>flexibel</span>
        <span>eingefroren</span>
      </div>

      <div className="marktfriktions-widget__value">
        {percentage}%
      </div>

      <div className="marktfriktions-widget__description">
        {getDescription(state.marktfriktion)}
      </div>
    </>
  );
}

export function MarktfriktionsWidget({ state, baselineState }: Props) {
  return (
    <div className="marktfriktions-widget">
      <div className="marktfriktions-widget__title">Marktfriktion</div>
      <CompareColumns
        baseline={baselineState && <MarktfriktionsBody state={baselineState} />}
        current={<MarktfriktionsBody state={state} />}
      />
    </div>
  );
}
