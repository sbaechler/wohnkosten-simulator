import type { PhaseResult } from '../model/phases';
import './TrendArrow.css';

interface Props {
  label: string;
  phases: PhaseResult[];
  /** Baseline phases — when set, show "Heute | Simuliert" side by side */
  baselinePhases?: PhaseResult[];
  invertColors?: boolean;
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

function ArrowGroup({ phases, invertColors, getValue, muted }: {
  phases: PhaseResult[];
  invertColors: boolean;
  getValue: (p: PhaseResult) => number;
  muted?: boolean;
}) {
  const mainPhase = phases[phases.length - 1];
  const mainValue = getValue(mainPhase);
  const mainDirection = getDirection(mainValue);
  const mainColor = muted ? '#888' : getColor(mainDirection, invertColors);

  const phaseDirections = phases.map(p => ({
    dir: getDirection(getValue(p)),
    color: muted ? '#666' : getColor(getDirection(getValue(p)), invertColors),
  }));

  return (
    <div className="trend-arrow__group">
      <div className="trend-arrow__mini-arrows">
        {phaseDirections.map((pd, i) => {
          const size = 32 - i * 6;
          return (
            <span
              key={i}
              className="trend-arrow__mini-arrow"
              style={{ color: pd.color, fontSize: `${size}px`, opacity: muted ? 0.5 : 1 - i * 0.2 }}
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

export function TrendArrow({ label, phases, baselinePhases, invertColors = false, getValue }: Props) {
  if (!phases || phases.length === 0) return null;

  return (
    <div className="trend-arrow">
      <div className="trend-arrow__label">{label}</div>
      {baselinePhases ? (
        <div className="trend-arrow__comparison">
          <div className="trend-arrow__comparison-section">
            <div className="trend-arrow__section-label">Heute</div>
            <ArrowGroup phases={baselinePhases} invertColors={invertColors} getValue={getValue} muted />
          </div>
          <div className="trend-arrow__comparison-divider" />
          <div className="trend-arrow__comparison-section">
            <div className="trend-arrow__section-label trend-arrow__section-label--modified">Simuliert</div>
            <ArrowGroup phases={phases} invertColors={invertColors} getValue={getValue} />
          </div>
        </div>
      ) : (
        <ArrowGroup phases={phases} invertColors={invertColors} getValue={getValue} />
      )}
    </div>
  );
}
