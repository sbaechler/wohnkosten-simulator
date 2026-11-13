import type { DerivedIndicators } from '../types';
import { CompareColumns } from './CompareColumns';
import './FiskalischeWirkungWidget.css';

interface Props {
  derived: DerivedIndicators;
  /** Wenn gesetzt: «Heute» neben «Simuliert» */
  baselineDerived?: DerivedIndicators;
}

function getColor(value: number): string {
  if (value < 0) return '#ff6b6b';
  if (value < 0.3) return '#ffd43b';
  return '#51cf66';
}

/**
 * Anzeige als normierter Index. Eine Umrechnung in CHF pro Jahr gibt es
 * bewusst nicht: `fiskalische_wirkung` ist ein dimensionsloser Index
 * (AGENTS.md: keine CHF- oder Prozentwerte), und eine feste Skala wäre für
 * Biel und Zürich dieselbe Zahl.
 */
function formatIndex(v: number): string {
  return `Index ${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(2)}`;
}

function getExplanation(value: number): string {
  if (value < 0) {
    return 'Tiefere Einnahmen durch geringere Aktivität am Immobilienmarkt';
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

function FiskalischeWirkungBody({ derived }: { derived: DerivedIndicators }) {
  const value = derived.fiskalische_wirkung;
  const color = getColor(value);
  const angle = valueToAngle(value);
  const indexText = formatIndex(value);
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
    <>

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
        {indexText}
      </div>

      <div className="fiskalische-wirkung-widget__explanation">
        {explanation}
      </div>
    </>
  );
}

export function FiskalischeWirkungWidget({ derived, baselineDerived }: Props) {
  return (
    <div className="fiskalische-wirkung-widget">
      <div className="fiskalische-wirkung-widget__title">Fiskalische Wirkung</div>
      <CompareColumns
        baseline={baselineDerived && <FiskalischeWirkungBody derived={baselineDerived} />}
        current={<FiskalischeWirkungBody derived={derived} />}
      />
    </div>
  );
}
