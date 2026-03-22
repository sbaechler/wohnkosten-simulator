import type { DerivedIndicators } from '../types';
import './FiskalischeWirkungWidget.css';

interface Props {
  derived: DerivedIndicators;
}

function getColor(value: number): string {
  if (value < 0) return '#ff6b6b';
  if (value < 0.3) return '#ffd43b';
  return '#51cf66';
}

function getCHFEstimate(value: number): string {
  const normalized = (value + 1) / 2; // 0 to 1
  // Positive: Mehrwertabgabe + Handänderungssteuer
  // Rough order of magnitude per year for a mid-size city (e.g. Zürich scale)
  const base = Math.round((normalized - 0.5) * 200); // -100 to +100 Mio CHF/year
  if (base >= 0) {
    return `+ca. CHF ${Math.abs(base)} Mio./Jahr`;
  } else {
    return `–ca. CHF ${Math.abs(base)} Mio./Jahr`;
  }
}

function getExplanation(value: number): string {
  if (value < 0) {
    return 'Steuerliche Verluste durch reduced Immobilienmarktaktivität';
  }
  if (value < 0.3) {
    return 'Leicht positive Effekte via Mehrwertabgabe & Handänderungssteuer';
  }
  return 'Erhebliche Mehreinnahmen via Mehrwertabgabe, Handänderungssteuer & Grundstückgewinnsteuer';
}

// Gauge: SVG half-circle, -1 to +1
function valueToAngle(v: number): number {
  // -1 → 180°, 0 → 90°, +1 → 0°
  return 90 - v * 90;
}

export function FiskalischeWirkungWidget({ derived }: Props) {
  const value = derived.fiskalische_wirkung;
  const color = getColor(value);
  const angle = valueToAngle(value);
  const chfText = getCHFEstimate(value);
  const explanation = getExplanation(value);

  // SVG gauge parameters
  const cx = 100;
  const cy = 100;
  const r = 80;

  // Arc path for the half-circle (180° sweep)
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;

  // Indicator needle: from center to arc
  const needleAngleRad = (angle * Math.PI) / 180;
  const needleX = cx + r * Math.cos(needleAngleRad);
  const needleY = cy - r * Math.sin(needleAngleRad);

  // Gradient arc - show filled portion
  return (
    <div className="fiskalische-wirkung-widget">
      <div className="fiskalische-wirkung-widget__title">Fiskalische Wirkung</div>

      <div className="fiskalische-wirkung-widget__gauge">
        <svg viewBox="0 0 200 110" className="fiskalische-wirkung-widget__svg">
          {/* Background arc */}
          <path
            d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Color segments */}
          <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`} fill="none" stroke="#ff6b6b" strokeWidth="12" strokeDasharray={`${(1 / 3) * Math.PI * r} ${Math.PI * r}`} strokeDashoffset="0" />
          <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`} fill="none" stroke="#ffd43b" strokeWidth="12" strokeDasharray={`${(1 / 3) * Math.PI * r} ${Math.PI * r}`} strokeDashoffset={`-${(1 / 3) * Math.PI * r}`} />
          <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`} fill="none" stroke="#51cf66" strokeWidth="12" strokeDasharray={`${(1 / 3) * Math.PI * r} ${Math.PI * r}`} strokeDashoffset={`-${(2 / 3) * Math.PI * r}`} />
          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="4" fill={color} />
          {/* Center dot */}
          <circle cx={cx} cy={cy} r="3" fill="#fff" />
        </svg>

        <div className="fiskalische-wirkung-widget__gauge-labels">
          <span>negativ</span>
          <span>positiv</span>
        </div>
      </div>

      <div className="fiskalische-wirkung-widget__chf" style={{ color }}>
        {chfText}
      </div>

      <div className="fiskalische-wirkung-widget__explanation">
        {explanation}
      </div>
    </div>
  );
}
