import type { PhaseResult } from '../model/phases';
import './TrendArrow.css';

interface Props {
  label: string;
  phases: PhaseResult[];
  invertColors?: boolean;
  /** Selector function to extract the value from a PhaseResult's derived indicators */
  getValue: (phase: PhaseResult) => number;
}

const ARROWS: Record<string, string> = {
  up: '\u2197',     // ↗
  flat: '\u2192',   // →
  down: '\u2198',   // ↘
};

function getDirection(value: number) {
  if (value > 0.15) return 'up';
  if (value < -0.15) return 'down';
  return 'flat';
}

function getColor(direction: string, invertColors: boolean) {
  if (direction === 'flat') return '#ffd43b';
  if (invertColors) {
    return direction === 'up' ? '#51cf66' : '#ff6b6b';
  }
  return direction === 'up' ? '#ff6b6b' : '#51cf66';
}

function getLabel(direction: string) {
  if (direction === 'up') return 'steigend';
  if (direction === 'down') return 'sinkend';
  return 'stabil';
}

export function TrendArrow({ label, phases, invertColors = false, getValue }: Props) {
  if (!phases || phases.length === 0) return null;

  // Main direction (from last phase)
  const mainPhase = phases[phases.length - 1];
  const mainValue = getValue(mainPhase);
  const mainDirection = getDirection(mainValue);
  const mainColor = getColor(mainDirection, invertColors);

  // Phase arrow colors
  const phaseDirections = phases.map(p => ({
    dir: getDirection(getValue(p)),
    color: getColor(getDirection(getValue(p)), invertColors),
  }));

  return (
    <div className="trend-arrow">
      <div className="trend-arrow__label">{label}</div>
      <div className="trend-arrow__mini-arrows">
        {phaseDirections.map((pd, i) => {
          // Arrow size decreases per phase: P1 biggest, P3 smallest
          const size = 32 - i * 6;
          return (
            <span
              key={i}
              className="trend-arrow__mini-arrow"
              style={{ color: pd.color, fontSize: `${size}px`, opacity: 1 - i * 0.2 }}
            >
              {ARROWS[pd.dir]}
            </span>
          );
        })}
      </div>
      <div className="trend-arrow__text" style={{ color: mainColor }}>
        {getLabel(mainDirection)}
      </div>
    </div>
  );
}
