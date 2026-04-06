import { useState } from 'react';
import type { GroupPriceTrend } from '../model/groups';
import type { PhaseResult } from '../model/phases';
import './GroupTrendWidget.css';

interface Props {
  title: string;
  phases: PhaseResult[];
  /** Baseline phases for "Heutige Situation" column (shown when defined) */
  baselinePhases?: PhaseResult[];
  /** Compute group trends per phase — passed as prop to avoid circular deps */
  computeGroupTrendsForPhase: (phase: PhaseResult) => GroupPriceTrend[];
  /** Compute baseline group trends (required when baselinePhases is set) */
  computeBaselineGroupTrendsForPhase?: (phase: PhaseResult) => GroupPriceTrend[];
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

const PHASE_COLORS = ['#ff6b6b', '#ffd43b', '#4dabf7'];
const PHASE_NAMES = ['P1', 'P2', 'P3'];

const BASELINE_PHASE_COLORS = ['#666', '#888', '#aaa'];

export function GroupTrendWidget({ title, phases, baselinePhases, computeGroupTrendsForPhase, computeBaselineGroupTrendsForPhase }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const hasComparison = baselinePhases && computeBaselineGroupTrendsForPhase;

  // Compute trends for each phase
  const allTrends = phases.map(phase => computeGroupTrendsForPhase(phase));
  const allBaselineTrends = hasComparison
    ? baselinePhases.map(phase => computeBaselineGroupTrendsForPhase(phase))
    : null;

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

      <div className="group-trend__grid">
        {/* Phase header row */}
        <div className="group-trend__header-row">
          <div className="group-trend__header-spacer" />
          {hasComparison && (
            <>
              <div className="group-trend__section-label" style={{ gridColumn: `span 3`, color: '#888', fontSize: 10, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Heute</div>
            </>
          )}
          {hasComparison && (
            <div className="group-trend__section-label" style={{ gridColumn: `span 3`, color: '#4dabf7', fontSize: 10, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simuliert</div>
          )}
        </div>
        <div className="group-trend__header-row">
          <div className="group-trend__header-spacer" />
          {hasComparison && baselinePhases.map((phase, i) => (
            <div key={`bl-${phase.phase}`} className="group-trend__phase-label" style={{ color: BASELINE_PHASE_COLORS[i] }}>
              {PHASE_NAMES[i]}
              <span className="group-trend__phase-years">{phase.yearsLabel}</span>
            </div>
          ))}
          {phases.map((phase, i) => (
            <div key={phase.phase} className="group-trend__phase-label" style={{ color: PHASE_COLORS[i] }}>
              {PHASE_NAMES[i]}
              <span className="group-trend__phase-years">{phase.yearsLabel}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {sorted.map((item, i) => {
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

              {/* Baseline phase cells (when comparison active) */}
              {hasComparison && allBaselineTrends!.map((trends, phaseIdx) => {
                const phaseItem = trends.find(t => t.group.id === item.group.id);
                if (!phaseItem) return <div key={`bl-${phaseIdx}`} className="group-trend__phase-cell" />;
                const phaseDir = getDirection(phaseItem.value);
                return (
                  <div key={`bl-${phaseIdx}`} className="group-trend__phase-cell">
                    <div className="group-trend__arrow" style={{ color: BASELINE_PHASE_COLORS[phaseIdx] }}>
                      {ARROWS[phaseDir]}
                    </div>
                  </div>
                );
              })}
              {/* Modified phase cells */}
              {allTrends.map((trends, phaseIdx) => {
                const phaseItem = trends.find(t => t.group.id === item.group.id);
                if (!phaseItem) return <div key={phaseIdx} className="group-trend__phase-cell" />;
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
          );
        })}
      </div>
    </div>
  );
}
