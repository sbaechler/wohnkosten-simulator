// ============================================================
// MietbelastungWidget — Wohnkostenbelastungs-Anzeige
//
// Berechnungslogik in: src/model/belastung.ts
// ============================================================

import type { CityParams40, MarketState } from '../types';
import { computeMieteBelastung, computeEigentumBelastung } from '../model/belastung';
import './MietbelastungWidget.css';

interface Props {
  params: CityParams40;
  baseline?: CityParams40;
  marketState?: MarketState;
  baselineMarketState?: MarketState;
}

const COLORS = {
  tief:   '#51cf66',
  mittel: '#ffd43b',
  hoch:   '#ff6b6b',
  gray:   '#888',
} as const;

function fmt(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function MietbelastungWidget({ params, baseline, marketState, baselineMarketState }: Props) {
  void params; // nur zur Signatur-Kompatibilität (ehemals für statische Stufe genutzt)

  const hasComparison = !!(baseline && baselineMarketState);

  const currentPct  = computeMieteBelastung(marketState);
  const baselinePct = hasComparison ? computeMieteBelastung(baselineMarketState) : null;

  // Stufe + Farbe
  function levelInfo(pct: number) {
    const l = pct < 30 ? 0 : pct < 45 ? 1 : 2;
    const color = [COLORS.tief, COLORS.mittel, COLORS.hoch][l];
    const label = ['Tief', 'Mittel', 'Hoch'][l];
    return { color, label };
  }

  const current  = levelInfo(currentPct);
  const baseline_ = baselinePct !== null ? levelInfo(baselinePct) : null;
  const deltaPct = baselinePct !== null ? currentPct - baselinePct : null;

  // Eigentums-Belastung
  const eigentumPct  = computeEigentumBelastung(marketState);
  const eigentumColor = [COLORS.tief, COLORS.mittel, COLORS.hoch][eigentumPct < 30 ? 0 : eigentumPct < 45 ? 1 : 2];

  // Segmentierte Bar
  function barWidth(start: number, end: number, value: number): string {
    const clamped = Math.max(start, Math.min(end, value));
    return `${((clamped - 20) / 50 * 100).toFixed(1)}%`;
  }

  return (
    <div className="mietbelastung-widget">
      <div className="mietbelastung-widget__title">Mietbelastung</div>

      {hasComparison ? (
        <div className="mietbelastung-widget__comparison">
          {/* Baseline */}
          <div className="mietbelastung-widget__comparison-item">
            <div className="mietbelastung-widget__comparison-label">Heute</div>
            <div className="mietbelastung-widget__comparison-value" style={{ color: baseline_?.color ?? COLORS.gray }}>
              {fmt(baselinePct!)}
            </div>
            <div className="mietbelastung-widget__comparison-sub" style={{ color: baseline_?.color ?? COLORS.gray }}>
              {baseline_?.label}
            </div>
          </div>

          <div className="mietbelastung-widget__divider" />

          {/* Delta */}
          <div className="mietbelastung-widget__delta">
            {deltaPct !== null && (
              <>
                <span className={`mietbelastung-widget__delta-arrow ${deltaPct > 0 ? 'up' : deltaPct < 0 ? 'down' : 'flat'}`}>
                  {deltaPct > 0 ? '↑' : deltaPct < 0 ? '↓' : '→'}
                </span>
                <span className="mietbelastung-widget__delta-value">
                  {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}pp
                </span>
              </>
            )}
          </div>

          <div className="mietbelastung-widget__divider" />

          {/* Current */}
          <div className="mietbelastung-widget__comparison-item">
            <div className="mietbelastung-widget__comparison-label">Simuliert</div>
            <div className="mietbelastung-widget__comparison-value" style={{ color: current.color }}>
              {fmt(currentPct)}
            </div>
            <div className="mietbelastung-widget__comparison-sub" style={{ color: current.color }}>
              {current.label}
            </div>
          </div>
        </div>
      ) : (
        <div className="mietbelastung-widget__single">
          <div className="mietbelastung-widget__bar">
            <div className="mietbelastung-widget__bar-segment" style={{ width: barWidth(20, 30, currentPct), background: COLORS.tief }} />
            <div className="mietbelastung-widget__bar-segment" style={{ width: barWidth(30, 45, currentPct), background: COLORS.mittel }} />
            <div className="mietbelastung-widget__bar-segment" style={{ width: barWidth(45, 70, currentPct), background: COLORS.hoch }} />
            <div className="mietbelastung-widget__bar-marker" style={{ left: `${((currentPct - 20) / 50 * 100).toFixed(1)}%` }} />
          </div>
          <div className="mietbelastung-widget__level-label" style={{ color: current.color }}>
            {current.label}
          </div>
          <div className="mietbelastung-widget__pct" style={{ color: current.color }}>
            {fmt(currentPct)}
          </div>
        </div>
      )}

      {/* Eigentum Referenz */}
      <div className="mietbelastung-widget__reference">
        <span className="mietbelastung-widget__ref-label">Eigentum (inkl. Opp.):</span>
        <span className="mietbelastung-widget__ref-value" style={{ color: eigentumColor }}>
          {fmt(eigentumPct)}
        </span>
      </div>

      <div className="mietbelastung-widget__reference-text">
        ↳ Wohnmonitor BWO 2026
      </div>
    </div>
  );
}