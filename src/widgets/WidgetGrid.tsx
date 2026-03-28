import type { CityParams40, CityContext, ParamsDiff40 } from '../types';
import { computeMarketState, clampE1 } from '../model/market-state';
import { computeDerivedIndicators } from '../model/derived';
import { computeGroupTrends } from '../model/groups';
import { SupplyDemandChart } from './SupplyDemandChart';
import { TrendArrow } from './TrendArrow';
import { GroupTrendWidget } from './GroupTrendWidget';
import { OwnershipDonut } from './OwnershipDonut';
import { GentrifizierungsWidget } from './GentrifizierungsWidget';
import { ZeitBisWirkungWidget } from './ZeitBisWirkungWidget';

interface Props {
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  diff: ParamsDiff40;
}

export function WidgetGrid({ context, baseline, modified, diff }: Props) {
  // E0 → E1
  const state = clampE1(computeMarketState(context, baseline, modified, diff));

  // E1 → E2
  const derived = computeDerivedIndicators(state, context, diff);

  // Preistrends pro Bevölkerungsgruppe (8 Gruppen)
  const groupTrends = computeGroupTrends(state, baseline, modified, diff);

  // Abgeleitete Trends für Kompatibilitäts-Widgets
  // E1(positive Werte) = angebotsreduzierend / preistreibend / verdrängend
  // Supply: negatives angebotspotenzial = mehr Angebot
  const supplyDelta = -state.angebotspotenzial;
  // Nachfragedruck: positives nachfragedruck = mehr Nachfrage
  const demandDelta = state.nachfragedruck;

  // Verdichtung: abgeleitet von angebotspotenzial (Druck, dichter zu bauen)
  const verdichtungDelta = state.angebotspotenzial * -0.5 + state.nachfragedruck * 0.3;

  // Stadtbild: Einspracherechte + Bauvorschriften schützen das Stadtbild
  const stadtbildDelta =
    (modified.bau_einspracherecht_dritte as number - baseline.bau_einspracherecht_dritte as number) * 0.2 +
    (modified.bau_einspracherecht_suspensiv as number - baseline.bau_einspracherecht_suspensiv as number) * 0.15 +
    (modified.bau_normenharmonisierung as number - baseline.bau_normenharmonisierung as number) * 0.1 -
    (modified.gemeinnuetzig_mindestanteil as number - baseline.gemeinnuetzig_mindestanteil as number) * 0.05;

  return (
    <div className="widget-grid">
      <GroupTrendWidget
        title="Trend Wohnpreise"
        groups={groupTrends}
      />
      <SupplyDemandChart
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
        state={state}
        derived={derived}
      />
      <TrendArrow label="Nachfragedruck" value={demandDelta} />
      <TrendArrow label="Angebotspotenzial" value={supplyDelta} invertColors />
      <GentrifizierungsWidget derived={derived} />
      <TrendArrow label="Neubau-Hemmnis" value={derived.neubau_hemmnisindex} />
      <TrendArrow label="Verdichtungsdruck" value={verdichtungDelta} invertColors />
      <TrendArrow label="Stadtbild" value={stadtbildDelta} invertColors />
      <OwnershipDonut
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
        state={state}
      />
      <ZeitBisWirkungWidget
        derived={derived}
        modified={modified}
        baseline={baseline}
      />
    </div>
  );
}
