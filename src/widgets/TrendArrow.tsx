import './TrendArrow.css';

interface Props {
  label: string;
  value: number; // -1 to +1, 0 = neutral
  invertColors?: boolean; // true = up is green (good), down is red (bad)
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

export function TrendArrow({ label, value, invertColors = false }: Props) {
  const direction = getDirection(value);
  const color = getColor(direction, invertColors);

  return (
    <div className="trend-arrow">
      <div className="trend-arrow__label">{label}</div>
      <div className="trend-arrow__icon" style={{ color }}>{ARROWS[direction]}</div>
      <div className="trend-arrow__text" style={{ color }}>{getLabel(direction)}</div>
    </div>
  );
}
