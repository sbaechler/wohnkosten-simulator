import './DivergingTrend.css';

interface GroupTrend {
  label: string;
  value: number; // -1 to +1
}

interface Props {
  title: string;
  groups: GroupTrend[];
}

const ARROWS: Record<string, string> = {
  up: '\u2197',
  flat: '\u2192',
  down: '\u2198',
};

function getDirection(value: number) {
  if (value > 0.15) return 'up';
  if (value < -0.15) return 'down';
  return 'flat';
}

function getColor(direction: string) {
  if (direction === 'up') return '#ff6b6b';
  if (direction === 'down') return '#51cf66';
  return '#ffd43b';
}

function getPriceLabel(direction: string) {
  if (direction === 'up') return '+teurer';
  if (direction === 'down') return '-günstiger';
  return 'stabil';
}

export function DivergingTrend({ title, groups }: Props) {
  return (
    <div className="diverging-trend">
      <div className="diverging-trend__title">{title}</div>
      <div className="diverging-trend__groups">
        {groups.map((group, i) => {
          const direction = getDirection(group.value);
          const color = getColor(direction);
          return (
            <div key={i} className="diverging-trend__group">
              {i > 0 && <div className="diverging-trend__separator" />}
              <div className="diverging-trend__arrow" style={{ color }}>{ARROWS[direction]}</div>
              <div className="diverging-trend__trend-label" style={{ color }}>
                {getPriceLabel(direction)}
              </div>
              <div className="diverging-trend__group-name">{group.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
