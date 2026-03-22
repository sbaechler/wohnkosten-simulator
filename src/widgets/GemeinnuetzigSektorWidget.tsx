import type { MarketState } from '../types';
import './GemeinnuetzigSektorWidget.css';

interface Props {
  state: MarketState;
}

// Reference points
const REFERENCES = [
  { label: 'CH-Schnitt', value: 5 },
  { label: 'Zürich', value: 26 },
  { label: 'Wien', value: 60 },
];

// Map -1...+1 to 0...80% (nonprofit share)
function valueToPercent(v: number): number {
  return Math.round(((v + 1) / 2) * 80);
}

function getColor(v: number): string {
  const normalized = (v + 1) / 2;
  if (normalized < 0.33) return '#ff6b6b';
  if (normalized < 0.66) return '#ffd43b';
  return '#51cf66';
}

export function GemeinnuetzigSektorWidget({ state }: Props) {
  const value = state.gemeinnuetzig_kraft;
  const predictedPct = valueToPercent(value);
  const color = getColor(value);

  // Scale: 0-80% nonprofit share
  const leftPercent = (predictedPct / 80) * 100;

  return (
    <div className="gemeinnuetzig-widget">
      <div className="gemeinnuetzig-widget__title">Gemeinnütziger Sektor</div>

      <div className="gemeinnuetzig-widget__bar-container">
        <div className="gemeinnuetzig-widget__gradient-bar">
          <span style={{ background: '#ff6b6b', flex: 1 }} />
          <span style={{ background: '#ffd43b', flex: 1 }} />
          <span style={{ background: '#51cf66', flex: 1 }} />
        </div>
        <div
          className="gemeinnuetzig-widget__indicator"
          style={{ left: `${leftPercent}%`, borderTopColor: color }}
        />
        {/* Reference markers */}
        {REFERENCES.map((ref) => (
          <div
            key={ref.label}
            className="gemeinnuetzig-widget__ref"
            style={{ left: `${(ref.value / 80) * 100}%` }}
            title={`${ref.label}: ${ref.value}%`}
          >
            <div className="gemeinnuetzig-widget__ref-line" />
          </div>
        ))}
      </div>

      <div className="gemeinnuetzig-widget__labels">
        <span>schwach</span>
        <span>stark</span>
      </div>

      <div className="gemeinnuetzig-widget__value" style={{ color }}>
        {predictedPct}% prognostiziert
      </div>

      <div className="gemeinnuetzig-widget__refs">
        {REFERENCES.map((ref) => (
          <span key={ref.label} className="gemeinnuetzig-widget__ref-label">
            {ref.label}: {ref.value}%
          </span>
        ))}
      </div>
    </div>
  );
}
