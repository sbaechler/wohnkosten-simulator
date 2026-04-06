import { useState } from 'react';
import type { CityParams40, CityContext, ParamsDiff40 } from '../types';
import { computePhasesCached } from '../model/compute-phases';
import { computeGroupTrends } from '../model/groups';
import type { PhaseResult } from '../model/phases';
import { SupplyDemandChart } from './SupplyDemandChart';
import { TrendArrow } from './TrendArrow';
import { GroupTrendWidget } from './GroupTrendWidget';
import { OwnershipDonut } from './OwnershipDonut';
import { GentrifizierungsWidget } from './GentrifizierungsWidget';
import './WidgetGrid.css';

type ViewMode = 'simuliert' | 'heutig' | 'vergleich';

interface Props {
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  diff: ParamsDiff40;
}

export function WidgetGrid({ context, baseline, modified, diff }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('simuliert');

  // Compute phases for both baseline and modified
  const modifiedPhases = computePhasesCached(context, modified, diff);
  const baselinePhases = computePhasesCached(context, baseline, {});

  // Latest phase for single-value widgets
  const latest = modifiedPhases[modifiedPhases.length - 1]!;
  const state = latest.marketState;

  // Helper: compute group trends for a specific phase
  function computeGroupTrendsForPhase(phase: PhaseResult) {
    return computeGroupTrends(phase.marketState, baseline, modified, diff);
  }

  // Baseline latest state
  const baselineLatest = baselinePhases[baselinePhases.length - 1]!;

  // Helper to get baseline value for TrendArrow
  function getBaselineValue(getValue: (p: PhaseResult) => number): number {
    return getValue(baselineLatest);
  }

  return (
    <div className={`widget-grid ${viewMode === 'vergleich' ? 'widget-grid--vergleich' : ''}`}>
      {/* View Mode Selector */}
      <div className="widget-grid__view-selector">
        <button
          className={`widget-grid__view-btn ${viewMode === 'heutig' ? 'widget-grid__view-btn--active' : ''}`}
          onClick={() => setViewMode('heutig')}
        >
          Heutige Situation
        </button>
        <button
          className={`widget-grid__view-btn ${viewMode === 'simuliert' ? 'widget-grid__view-btn--active' : ''}`}
          onClick={() => setViewMode('simuliert')}
        >
          Simulierte Anpassungen
        </button>
        <button
          className={`widget-grid__view-btn ${viewMode === 'vergleich' ? 'widget-grid__view-btn--active' : ''}`}
          onClick={() => setViewMode('vergleich')}
        >
          Vergleich
        </button>
      </div>

      {/* Vergleiche mode: side-by-side columns */}
      {viewMode === 'vergleich' && (
        <>
          <div className="widget-grid__col">
            <div className="widget-grid__col-header widget-grid__col-header--baseline">
              Heutige Situation
            </div>
          </div>
          <div className="widget-grid__col">
            <div className="widget-grid__col-header widget-grid__col-header--modified">
              Simulierte Anpassungen
            </div>
          </div>
        </>
      )}

      <GroupTrendWidget
        title="Trend Wohnpreise"
        phases={viewMode === 'heutig' ? baselinePhases : modifiedPhases}
        baselinePhases={baselinePhases}
        viewMode={viewMode}
        computeGroupTrendsForPhase={computeGroupTrendsForPhase}
      />
      <SupplyDemandChart
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
        phases={modifiedPhases}
        baselinePhases={baselinePhases}
        viewMode={viewMode}
      />
      <TrendArrow
        label="Nachfragedruck"
        phases={viewMode === 'heutig' ? baselinePhases : modifiedPhases}
        baselineValue={getBaselineValue(p => p.marketState.nachfragedruck)}
        viewMode={viewMode}
        getValue={p => p.marketState.nachfragedruck}
      />
      <TrendArrow
        label="Angebotspotenzial"
        phases={viewMode === 'heutig' ? baselinePhases : modifiedPhases}
        baselineValue={getBaselineValue(p => -p.marketState.angebotspotenzial)}
        viewMode={viewMode}
        invertColors
        getValue={p => -p.marketState.angebotspotenzial}
      />
      <GentrifizierungsWidget phases={viewMode === 'heutig' ? baselinePhases : modifiedPhases} />
      <TrendArrow
        label="Neubau-Hemmnis"
        phases={viewMode === 'heutig' ? baselinePhases : modifiedPhases}
        baselineValue={getBaselineValue(p => p.derived.neubau_hemmnisindex)}
        viewMode={viewMode}
        invertColors
        getValue={p => p.derived.neubau_hemmnisindex}
      />
      <TrendArrow
        label="Verdichtungsdruck"
        phases={viewMode === 'heutig' ? baselinePhases : modifiedPhases}
        baselineValue={getBaselineValue(p => p.marketState.angebotspotenzial * -0.5 + p.marketState.nachfragedruck * 0.3)}
        viewMode={viewMode}
        invertColors
        getValue={p => p.marketState.angebotspotenzial * -0.5 + p.marketState.nachfragedruck * 0.3}
      />
      <TrendArrow
        label="Stadtbild"
        phases={viewMode === 'heutig' ? baselinePhases : modifiedPhases}
        baselineValue={getBaselineValue(() => {
          const m = modified;
          const b = baseline;
          return (
            ((m.bau_einspracherecht_dritte as number) - (b.bau_einspracherecht_dritte as number)) * 0.2 +
            ((m.bau_einspracherecht_suspensiv as number) - (b.bau_einspracherecht_suspensiv as number)) * 0.15 +
            ((m.bau_normenharmonisierung as number) - (b.bau_normenharmonisierung as number)) * 0.1 -
            ((m.gemeinnuetzig_mindestanteil as number) - (b.gemeinnuetzig_mindestanteil as number)) * 0.05
          );
        })}
        viewMode={viewMode}
        invertColors
        getValue={() => {
          const m = modified;
          const b = baseline;
          return (
            ((m.bau_einspracherecht_dritte as number) - (b.bau_einspracherecht_dritte as number)) * 0.2 +
            ((m.bau_einspracherecht_suspensiv as number) - (b.bau_einspracherecht_suspensiv as number)) * 0.15 +
            ((m.bau_normenharmonisierung as number) - (b.bau_normenharmonisierung as number)) * 0.1 -
            ((m.gemeinnuetzig_mindestanteil as number) - (b.gemeinnuetzig_mindestanteil as number)) * 0.05
          );
        }}
      />
      <OwnershipDonut
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
        state={state}
        viewMode={viewMode}
      />
    </div>
  );
}
