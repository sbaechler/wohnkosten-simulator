import type { CityParams, CityContext, ParamsDiff } from '../types';
import { SupplyDemandChart } from './SupplyDemandChart';
import { TrendArrow } from './TrendArrow';
import { DivergingTrend } from './DivergingTrend';
import { OwnershipDonut } from './OwnershipDonut';

interface Props {
  context: CityContext;
  baseline: CityParams;
  modified: CityParams;
  diff: ParamsDiff;
}

// Simplified trend computation from params + context
function computeTrends(baseline: CityParams, modified: CityParams, context: CityContext) {
  const supplyDelta =
    -(modified.raumplanung - baseline.raumplanung) * 0.15 +
    -(modified.bauvorschriften - baseline.bauvorschriften) * 0.1 +
    -(modified.energetischeVorgaben - baseline.energetischeVorgaben) * 0.1 +
    -(modified.einspracherechte - baseline.einspracherechte) * 0.1 +
    (modified.foerderungGemeinnuetzig - baseline.foerderungGemeinnuetzig) * 0.1 +
    (modified.subventionen - baseline.subventionen) * 0.05;

  const demandDelta =
    -(modified.steuerpolitik - baseline.steuerpolitik) * 0.1 +
    (modified.infrastruktur - baseline.infrastruktur) * 0.1 +
    (modified.subventionen - baseline.subventionen) * 0.05 +
    context.zuwanderungsdruck * 0.02;

  // Price trend diverges by income group
  const priceBase = -supplyDelta + demandDelta;
  const priceLow = priceBase + (modified.mietrecht - baseline.mietrecht) * -0.1;
  const priceHigh = priceBase + (modified.mietrecht - baseline.mietrecht) * 0.05;

  return {
    supply: supplyDelta,
    demand: demandDelta,
    priceLow,
    priceHigh,
  };
}

export function WidgetGrid({ context, baseline, modified, diff }: Props) {
  const trends = computeTrends(baseline, modified, context);

  return (
    <div className="widget-grid">
      <SupplyDemandChart
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
      />
      <DivergingTrend
        title="Trend Wohnpreise"
        groups={[
          { label: 'Geringverd.', value: trends.priceLow },
          { label: 'Gutverd.', value: trends.priceHigh },
        ]}
      />
      <TrendArrow label="Trend Nachfrage" value={trends.demand} />
      <TrendArrow label="Trend Angebot" value={trends.supply} />
      <OwnershipDonut
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
      />
    </div>
  );
}
