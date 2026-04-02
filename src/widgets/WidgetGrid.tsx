import type { CityParams40, CityContext, ParamsDiff40 } from '../types';
import { computePhasesCached } from '../model/compute-phases';
import { computeGroupTrends } from '../model/groups';
import type { PhaseResult } from '../model/phases';
import { SupplyDemandChart } from './SupplyDemandChart';
import { TrendArrow } from './TrendArrow';
import { GroupTrendWidget } from './GroupTrendWidget';
import { OwnershipDonut } from './OwnershipDonut';
import { GentrifizierungsWidget } from './GentrifizierungsWidget';

interface Props {
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  diff: ParamsDiff40;
}

export function WidgetGrid({ context, baseline, modified, diff }: Props) {
  // Multi-phase pipeline: [P1, P2, P3]
  const phases = computePhasesCached(context, modified, diff);

  // Latest phase for single-value widgets
  const latest = phases[phases.length - 1]!;
  const state = latest.marketState;

  // Helper: compute group trends for a specific phase
  function computeGroupTrendsForPhase(phase: PhaseResult) {
    return computeGroupTrends(phase.marketState, baseline, modified, diff);
  }

  return (
    <div className="widget-grid">
      <GroupTrendWidget
        title="Trend Wohnpreise"
        phases={phases}
        computeGroupTrendsForPhase={computeGroupTrendsForPhase}
      />
      <SupplyDemandChart
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
        phases={phases}
      />
      <TrendArrow
        label="Nachfragedruck"
        phases={phases}
        getValue={p => p.marketState.nachfragedruck}
      />
      <TrendArrow
        label="Angebotspotenzial"
        phases={phases}
        invertColors
        getValue={p => -p.marketState.angebotspotenzial}
      />
      <GentrifizierungsWidget phases={phases} />
      <TrendArrow
        label="Neubau-Hemmnis"
        phases={phases}
        invertColors
        getValue={p => p.derived.neubau_hemmnisindex}
      />
      <TrendArrow
        label="Verdichtungsdruck"
        phases={phases}
        invertColors
        getValue={p => p.marketState.angebotspotenzial * -0.5 + p.marketState.nachfragedruck * 0.3}
      />
      <TrendArrow
        label="Stadtbild"
        phases={phases}
        invertColors
        getValue={() => {
          // Recompute stadtbild delta for this phase's modified state
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
      />
    </div>
  );
}
