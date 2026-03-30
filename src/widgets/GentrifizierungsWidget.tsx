import type { PhaseResult } from '../model/phases';
import './GentrifizierungsWidget.css';

interface Props {
  phases: PhaseResult[];
}

function getLevelAndColor(value: number): { level: string; color: string } {
  const normalized = (value + 1) / 2;

  if (normalized < 0.25) {
    return { level: 'gering', color: '#51cf66' };
  } else if (normalized < 0.5) {
    return { level: 'mittel', color: '#ffd43b' };
  } else if (normalized < 0.75) {
    return { level: 'hoch', color: '#ff922b' };
  } else {
    return { level: 'sehr hoch', color: '#ff6b6b' };
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

// Ghost marker sizes and opacity per phase
const GHOST_STYLES = [
  { size: 8, opacity: 0.3, borderWidth: 1 },  // P1: smallest, faded
  { size: 10, opacity: 0.5, borderWidth: 1.5 }, // P2: medium
  { size: 12, opacity: 1.0, borderWidth: 2 },   // P3 (main): full size
];

export function GentrifizierungsWidget({ phases }: Props) {
  if (!phases || phases.length === 0) return null;

  // Main indicator = Phase 3 (last / longest term)
  const mainPhase = phases[phases.length - 1];
  const { level, color } = getLevelAndColor(mainPhase.derived.gentrifizierungsindex);
  const normalized = (mainPhase.derived.gentrifizierungsindex + 1) / 2;
  const percentage = Math.round(normalized * 100);

  return (
    <div className="gentrifizierungs-widget">
      <div className="gentrifizierungs-widget__title">
        Gentrifizierungsindex
        <span className="gentrifizierungs-widget__phase-note">
          {phases.map((p, i) => (
            <span key={p.phase} className="gentrifizierungs-widget__phase-dot"
              style={{ opacity: i === phases.length - 1 ? 1 : 0.4, color: GHOST_STYLES[i]?.borderWidth ? '#fff' : undefined }}
            >●</span>
          ))}
        </span>
      </div>

      <div className="gentrifizierungs-widget__bar-container">
        <div className="gentrifizierungs-widget__gradient-bar">
          {getGradientStops().map((stop, i) => (
            <span key={i} style={{ background: stop.color, flex: 1 }} />
          ))}
        </div>

        {/* Ghost markers: P1, P2 (if phases.length >= 2) */}
        {phases.slice(0, -1).map((phase, i) => {
          const pct = Math.round(((phase.derived.gentrifizierungsindex + 1) / 2) * 100);
          const ghost = GHOST_STYLES[i];
          return (
            <div
              key={phase.phase}
              className="gentrifizierungs-widget__ghost-marker"
              style={{
                left: `${pct}%`,
                width: ghost.size,
                height: ghost.size,
                opacity: ghost.opacity,
                borderWidth: ghost.borderWidth,
              }}
            />
          );
        })}

        {/* Main indicator: P3 */}
        <div
          className="gentrifizierungs-widget__indicator"
          style={{
            left: `${percentage}%`,
            borderColor: color,
            background: '#fff',
            boxShadow: `0 0 8px ${color}`,
          }}
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

      {/* Phase path */}
      {phases.length >= 2 && (
        <div className="gentrifizierungs-widget__phase-path">
          {phases.map((phase, i) => {
            const pct = Math.round(((phase.derived.gentrifizierungsindex + 1) / 2) * 100);
            const ghost = GHOST_STYLES[i];
            return (
              <span key={phase.phase} className="gentrifizierungs-widget__phase-info">
                <span style={{ color: GHOST_STYLES[i] ? `rgba(255,255,255,${ghost.opacity})` : '#fff' }}>
                  P{phase.phase}: {pct}%
                </span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
