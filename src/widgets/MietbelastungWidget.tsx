import type { CityParams40 } from '../types';
import './MietbelastungWidget.css';

interface Props {
  /** Modified (current) params — to compute the simulated indicator */
  params: CityParams40;
  /** Baseline params for comparison */
  baseline?: CityParams40;
}

// Label mapping for the 3 levels
const LABELS = ['Tief (<20%)', 'Mittel (20–30%)', 'Hoch (>30%)'];
const LEVEL_COLORS = ['#51cf66', '#ffd43b', '#ff6b6b'];
const Sotomo_REF = 'Sotomo 2025: Tiefes Einkommen ∅30%, Viertel >40%';

// Percentages corresponding to each level (for display)
const PCT_VALUES = ['<20%', '20–30%', '>30%'];

function getBelastungsLevel(params: CityParams40): number {
  // markt_mietbelastungs_grenze: 0=tief, 1=mittel, 2=hoch
  return params.markt_mietbelastungs_grenze as number;
}

export function MietbelastungWidget({ params, baseline }: Props) {
  const currentLevel = getBelastungsLevel(params);
  const currentColor = LEVEL_COLORS[currentLevel];
  const currentLabel = LABELS[currentLevel];
  const currentPct = PCT_VALUES[currentLevel];

  const baselineLevel = baseline ? getBelastungsLevel(baseline) : null;
  const showComparison = baseline && baselineLevel !== currentLevel;

  // Compact inline comparison bar
  const barSegments = [
    { pct: 20, color: LEVEL_COLORS[0], active: currentLevel >= 0 },
    { pct: 10, color: LEVEL_COLORS[1], active: currentLevel >= 1 },
    { pct: 70, color: LEVEL_COLORS[2], active: currentLevel >= 2 },
  ];

  return (
    <div className="mietbelastung-widget">
      <div className="mietbelastung-widget__title">Mietbelastung</div>

      {showComparison ? (
        <div className="mietbelastung-widget__comparison">
          <div className="mietbelastung-widget__comparison-item">
            <span className="mietbelastung-widget__comparison-label">Heute</span>
            <span className="mietbelastung-widget__comparison-value"
              style={{ color: LEVEL_COLORS[baselineLevel!] }}>
              {LABELS[baselineLevel!]}
            </span>
            <span className="mietbelastung-widget__comparison-pct">{PCT_VALUES[baselineLevel!]}</span>
          </div>
          <div className="mietbelastung-widget__divider" />
          <div className="mietbelastung-widget__comparison-item">
            <span className="mietbelastung-widget__comparison-label">Simuliert</span>
            <span className="mietbelastung-widget__comparison-value"
              style={{ color: currentColor }}>
              {currentLabel}
            </span>
            <span className="mietbelastung-widget__comparison-pct">{currentPct}</span>
          </div>
        </div>
      ) : (
        <div className="mietbelastung-widget__single">
          <div className="mietbelastung-widget__bar">
            {barSegments.map((seg, i) => (
              <div
                key={i}
                className="mietbelastung-widget__bar-segment"
                style={{
                  background: seg.active ? seg.color : 'rgba(255,255,255,0.08)',
                  flex: seg.pct,
                }}
              />
            ))}
          </div>
          <div className="mietbelastung-widget__level-label" style={{ color: currentColor }}>
            {currentLabel}
          </div>
          <div className="mietbelastung-widget__pct" style={{ color: currentColor }}>
            {currentPct}
          </div>
        </div>
      )}

      <div className="mietbelastung-widget__reference">
        ↳ {Sotomo_REF}
      </div>
    </div>
  );
}