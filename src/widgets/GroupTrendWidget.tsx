import { useState, useMemo } from 'react';
import type { GroupPriceTrend } from '../model/groups';
import type { PhaseResult } from '../model/phases';
import './GroupTrendWidget.css';

interface Props {
  title: string;
  phases: PhaseResult[];
  baselinePhases?: PhaseResult[];
  computeGroupTrendsForPhase: (phase: PhaseResult) => GroupPriceTrend[];
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
const BASELINE_PHASE_COLORS = ['#555', '#777', '#999'];
const PHASE_NAMES = ['P1', 'P2', 'P3'];

export function GroupTrendWidget({ title, phases, baselinePhases, computeGroupTrendsForPhase, computeBaselineGroupTrendsForPhase }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const hasComparison = !!(baselinePhases && computeBaselineGroupTrendsForPhase);

  const allTrends = phases.map(phase => computeGroupTrendsForPhase(phase));
  const allBaselineTrends = hasComparison
    ? baselinePhases!.map(phase => computeBaselineGroupTrendsForPhase!(phase))
    : null;

  // Use Phase 2 (index 1) as primary for driver display — stable sort order
  const primaryTrends = allTrends[1] ?? allTrends[0] ?? [];
  const sorted = useMemo(() => {
    const items = [...primaryTrends];
    // Sort once and keep stable — don't re-sort when values change
    items.sort((a, b) => {
      if (a.group.id === 'glueckspilze') return 1;
      if (b.group.id === 'glueckspilze') return -1;
      return a.group.shortLabel.localeCompare(b.group.shortLabel);
    });
    return items;
    // Only re-sort when group identity changes, not values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryTrends.map(t => t.group.id).join(',')]);

  return (
    <div className="group-trend">
      <div className="group-trend__title">{title}</div>

      <div className={`group-trend__grid ${hasComparison ? 'group-trend__grid--comparison' : ''}`}>
        {/* Section header row (only in comparison mode) */}
        {hasComparison && (
          <div className="group-trend__header-row">
            <div className="group-trend__header-spacer" />
            <div className="group-trend__section-label group-trend__section-label--baseline">Heutige Situation</div>
            <div className="group-trend__section-divider" />
            <div className="group-trend__section-label group-trend__section-label--modified">Simulierte Anpassungen</div>
          </div>
        )}

        {/* Phase labels row */}
        <div className="group-trend__header-row">
          <div className="group-trend__header-spacer" />
          {hasComparison && baselinePhases!.map((_p, i) => (
            <div key={`bl-${i}`} className="group-trend__phase-label" style={{ color: BASELINE_PHASE_COLORS[i] }}>
              {PHASE_NAMES[i]}
              <span className="group-trend__phase-years">{_p.yearsLabel}</span>
            </div>
          ))}
          {hasComparison && <div className="group-trend__section-divider" />}
          {phases.map((p, i) => (
            <div key={i} className="group-trend__phase-label" style={{ color: PHASE_COLORS[i] }}>
              {PHASE_NAMES[i]}
              <span className="group-trend__phase-years">{p.yearsLabel}</span>
            </div>
          ))}
        </div>

        {/* Data rows */}
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

              {/* Baseline phase cells */}
              {hasComparison && allBaselineTrends!.map((trends, phaseIdx) => {
                const phaseItem = trends.find(t => t.group.id === item.group.id);
                if (!phaseItem) return <div key={`bl-${phaseIdx}`} className="group-trend__phase-cell" />;
                return (
                  <div key={`bl-${phaseIdx}`} className="group-trend__phase-cell">
                    <div className="group-trend__arrow" style={{ color: BASELINE_PHASE_COLORS[phaseIdx] }}>
                      {ARROWS[getDirection(phaseItem.value)]}
                    </div>
                  </div>
                );
              })}

              {/* Divider */}
              {hasComparison && <div className="group-trend__section-divider" />}

              {/* Modified phase cells */}
              {allTrends.map((trends, phaseIdx) => {
                const phaseItem = trends.find(t => t.group.id === item.group.id);
                if (!phaseItem) return <div key={phaseIdx} className="group-trend__phase-cell" />;
                return (
                  <div key={phaseIdx} className="group-trend__phase-cell">
                    <div className="group-trend__arrow" style={{ color: PHASE_COLORS[phaseIdx] }}>
                      {ARROWS[getDirection(phaseItem.value)]}
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
