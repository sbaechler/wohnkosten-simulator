import { useMemo } from 'react';
import type { CityParams40, CityContext, ParamsDiff40 } from '../types';
import { computePhasesCached } from '../model/compute-phases';
import { computeGroupTrends } from '../model/groups';
import type { PhaseResult } from '../model/phases';
import { SupplyDemandChart } from './SupplyDemandChart';
import { TrendArrow } from './TrendArrow';
import { GroupTrendWidget } from './GroupTrendWidget';
import { OwnershipDonut } from './OwnershipDonut';
import { GentrifizierungsWidget } from './GentrifizierungsWidget';
import { MietbelastungWidget } from './MietbelastungWidget';
import './WidgetGrid.css';

interface Props {
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  diff: ParamsDiff40;
}

export function WidgetGrid({ context, baseline, modified, diff }: Props) {
  const hasChanges = Object.keys(diff).length > 0;

  // Phases for modified params (current behavior)
  const modifiedPhases = computePhasesCached(context, modified, diff);

  // Phases for baseline ("Heutige Situation") — empty diff means no changes
  const emptyDiff: ParamsDiff40 = useMemo(() => ({}), []);
  const baselinePhases = computePhasesCached(context, baseline, emptyDiff);

  // Latest phase for single-value widgets
  const latestModified = modifiedPhases[modifiedPhases.length - 1]!;
  const latestBaseline = baselinePhases[baselinePhases.length - 1]!;

  // Group trends helper
  function computeModifiedGroupTrends(phase: PhaseResult) {
    return computeGroupTrends(phase.marketState, baseline, modified, diff);
  }
  function computeBaselineGroupTrends(phase: PhaseResult) {
    return computeGroupTrends(phase.marketState, baseline, baseline, emptyDiff);
  }

  // Stadtbild getValue helper
  const stadtbildGetter = (m: CityParams40, b: CityParams40) => () =>
    ((m.bau_einspracherecht_dritte as number) - (b.bau_einspracherecht_dritte as number)) * 0.2 +
    ((m.bau_einspracherecht_suspensiv as number) - (b.bau_einspracherecht_suspensiv as number)) * 0.15 +
    ((m.bau_normenharmonisierung as number) - (b.bau_normenharmonisierung as number)) * 0.1 -
    ((m.gemeinnuetzig_mindestanteil as number) - (b.gemeinnuetzig_mindestanteil as number)) * 0.05;

  return (
    <div className="widget-grid">
      {/* -- GroupTrendWidget: full-width, shows both columns internally -- */}
      <GroupTrendWidget
        title="Trend Wohnpreise"
        phases={modifiedPhases}
        baselinePhases={hasChanges ? baselinePhases : undefined}
        computeGroupTrendsForPhase={computeModifiedGroupTrends}
        computeBaselineGroupTrendsForPhase={hasChanges ? computeBaselineGroupTrends : undefined}
      />

      {/* -- SupplyDemandChart: full-width, 2 rows of phase buttons when hasChanges -- */}
      <SupplyDemandChart
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
        phases={modifiedPhases}
        baselinePhases={hasChanges ? baselinePhases : undefined}
      />

      {/* -- TrendArrows with inline comparison -- */}
      <TrendArrow label="Nachfragedruck" phases={modifiedPhases} baselinePhases={hasChanges ? baselinePhases : undefined} getValue={p => p.marketState.nachfragedruck} />
      <TrendArrow label="Angebotspotenzial" phases={modifiedPhases} baselinePhases={hasChanges ? baselinePhases : undefined} invertColors getValue={p => -p.marketState.angebotspotenzial} />
      <GentrifizierungsWidget phases={modifiedPhases} baselinePhases={hasChanges ? baselinePhases : undefined} />
      <TrendArrow label="Neubau-Hemmnis" phases={modifiedPhases} baselinePhases={hasChanges ? baselinePhases : undefined} invertColors getValue={p => p.derived.neubau_hemmnisindex} />
      <TrendArrow label="Verdichtungsdruck" phases={modifiedPhases} baselinePhases={hasChanges ? baselinePhases : undefined} invertColors getValue={p => p.marketState.angebotspotenzial * -0.5 + p.marketState.nachfragedruck * 0.3} />
      <TrendArrow label="Stadtbild" phases={modifiedPhases} baselinePhases={hasChanges ? baselinePhases : undefined} invertColors getValue={stadtbildGetter(modified, baseline)} />
      <MietbelastungWidget params={modified} baseline={hasChanges ? baseline : undefined} />
      <OwnershipDonut context={context} baseline={baseline} modified={modified} diff={diff} state={latestModified.marketState} baselineState={hasChanges ? latestBaseline.marketState : undefined} />
    </div>
  );
}
