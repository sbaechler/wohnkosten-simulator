import { useState } from 'react';
import type { GroupPriceTrend } from '../model/groups';
import './GroupTrendWidget.css';

interface Props {
  title: string;
  groups: GroupPriceTrend[];
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

function getColor(direction: string): string {
  if (direction === 'up') return '#ff6b6b';
  if (direction === 'down') return '#51cf66';
  return '#ffd43b';
}

function getTrendLabel(direction: string): string {
  if (direction === 'up') return '+teurer';
  if (direction === 'down') return '-günstiger';
  return 'stabil';
}

export function GroupTrendWidget({ title, groups }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Sortiere nach Trend-Stärke: sinkend zuerst, dann stabil, dann steigend
  const sorted = [...groups].sort((a, b) => {
    const dirOrder = { down: 0, flat: 1, up: 2 } as const;
    return dirOrder[getDirection(a.value)] - dirOrder[getDirection(b.value)];
  });

  return (
    <div className="group-trend">
      <div className="group-trend__title">{title}</div>
      <div className="group-trend__list">
        {sorted.map((item, i) => {
          const dir = getDirection(item.value);
          const color = getColor(dir);
          const isHovered = hovered === i;
          const pct = Math.round(Math.abs(item.value) * 100);

          return (
            <div
              key={item.group.id}
              className={`group-trend__row ${isHovered ? 'group-trend__row--hovered' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="group-trend__emoji">{item.group.emoji}</div>
              <div className="group-trend__info">
                <div className="group-trend__group-name">{item.group.shortLabel}</div>
                <div className="group-trend__details">
                  <div className="group-trend__description">{item.group.description}</div>
                  <div className="group-trend__drivers">
                    {item.drivers.map((d, j) => (
                      <span key={j} className={`group-trend__driver group-trend__driver--${d.direction}`}>
                        {d.direction === 'up' ? '↑' : '↓'} {d.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="group-trend__value-col">
                <div className="group-trend__arrow" style={{ color }}>
                  {ARROWS[dir]}
                </div>
                <div className="group-trend__trend-label" style={{ color }}>
                  {getTrendLabel(dir)}
                </div>
                <div
                  className="group-trend__pct"
                  style={{ color, visibility: (isHovered && pct > 0) ? 'visible' : 'hidden' }}
                >
                  {pct > 0 ? pct + '%' : '0%'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
