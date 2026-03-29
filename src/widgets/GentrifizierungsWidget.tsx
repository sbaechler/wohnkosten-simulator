import type { DerivedIndicators } from '../types';
import './GentrifizierungsWidget.css';

interface Props {
  derived: DerivedIndicators;
}

function getLevelAndColor(value: number): { level: string; color: string } {
  // Map -1...+1 to 0...1
  const normalized = (value + 1) / 2;

  if (normalized < 0.25) {
    return { level: 'gering', color: '#51cf66' }; // green
  } else if (normalized < 0.5) {
    return { level: 'mittel', color: '#ffd43b' }; // yellow
  } else if (normalized < 0.75) {
    return { level: 'hoch', color: '#ff922b' }; // orange
  } else {
    return { level: 'sehr hoch', color: '#ff6b6b' }; // red
  }
}

function getGradientStops(): { offset: string; color: string }[] {
  return [
    { offset: '0%', color: '#51cf66' },
    { offset: '33%', color: '#ffd43b' },
    { offset: '66%', color: '#ff922b' },
    { offset: '100%', color: '#ff6b6b' },
  ];
}

export function GentrifizierungsWidget({ derived }: Props) {
  const { level, color } = getLevelAndColor(derived.gentrifizierungsindex);
  const normalized = (derived.gentrifizierungsindex + 1) / 2;
  const percentage = Math.round(normalized * 100);

  return (
    <div className="gentrifizierungs-widget">
      <div className="gentrifizierungs-widget__title">Gentrifizierungsindex</div>

      <div className="gentrifizierungs-widget__bar-container">
        <div className="gentrifizierungs-widget__gradient-bar">
          {getGradientStops().map((stop, i) => (
            <span key={i} style={{ background: stop.color, flex: 1 }} />
          ))}
        </div>
        <div
          className="gentrifizierungs-widget__indicator"
          style={{ left: `${percentage}%`, borderColor: color, background: '#fff', boxShadow: `0 0 8px ${color}` }}
        />
      </div>

      <div className="gentrifizierungs-widget__labels">
        <span>gering</span>
        <span>mittel</span>
        <span>hoch</span>
        <span>sehr hoch</span>
      </div>

      <div className="gentrifizierungs-widget__value" style={{ color }}>
        {level} ({percentage}%)
      </div>
    </div>
  );
}
