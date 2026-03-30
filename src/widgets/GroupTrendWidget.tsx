import { useState } from 'react';
import type { GroupPriceTrend } from '../model/groups';
import type { PhaseResult } from '../model/phases';
import './GroupTrendWidget.css';

interface Props {
  title: string;
  phases: PhaseResult[];
  /** Compute group trends per phase — passed as prop to avoid circular deps */
  computeGroupTrendsForPhase: (phase: PhaseResult) => GroupPriceTrend[];
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
  if (direction === 'up') return '+teuer';
  if (direction === 'down') return '-günstig';
  return 'stabil';
}

const PHASE_COLORS = ['#ff6b6b', '#ffd43b', '#4dabf7'];
const PHASE_NAMES = ['P1', 'P2', 'P3'];

export function GroupTrendWidget({ title, phases, computeGroupTrendsForPhase }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Compute trends for each phase
  const allTrends = phases.map(phase => computeGroupTrendsForPhase(phase));

  // Use Phase 2 (index 1) as primary for driver display
  const primaryTrends = allTrends[1] ?? allTrends[0] ?? [];

  // Sort: sinkend → stabil → steigend; Glückspilze immer zuletzt
  const sorted = [...primaryTrends].sort((a, b) => {
    const dirOrder: Record<string, number> = { down: 0, flat: 1, up: 2 };
    const d = dirOrder[getDirection(a.value)] - dirOrder[getDirection(b.value)];
    if (d !== 0) return d;
    if (a.group.id === 'glueckspilze') return 1;
    if (b.group.id === 'glueckspilze') return -1;
    return 0;
  });

  return (
    <div className="group-trend">
      <div className="group-trend__title">{title}</div>

      {/* Phase header */}
      <div className="group-trend__phase-header">
        <div className="group-trend__phase-header-spacer" />
        <div className="group-trend__phase-labels">
          {phases.map((phase, i) => (
            <div key={phase.phase} className="group-trend__phase-label" style={{ color: PHASE_COLORS[i] }}>
              {PHASE_NAMES[i]}
              <span className="group-trend__phase-years">{phase.yearsLabel}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="group-trend__list">
        {sorted.map((item, i) => {
          const dir = getDirection(item.value);
          const isHovered = hovered === i;

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

              {/* Phase columns */}
              <div className="group-trend__phase-cols">
                {allTrends.map((trends, phaseIdx) => {
                  const phaseItem = trends.find(t => t.group.id === item.group.id);
                  if (!phaseItem) return null;
                  const phaseDir = getDirection(phaseItem.value);
                  const phaseColor = PHASE_COLORS[phaseIdx];
                  return (
                    <div key={phaseIdx} className="group-trend__phase-cell">
                      <div className="group-trend__arrow" style={{ color: phaseColor }}>
                        {ARROWS[phaseDir]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
