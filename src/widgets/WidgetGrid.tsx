import { useMemo } from 'react';
import type { CityConfig, ParamsDiff40, CityParams40 } from '../types';
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
  city: CityConfig;
  modified: CityParams40;
  diff: ParamsDiff40;
}

/**
 * Gewichte für den Anzeige-Indikator "Verdichtungsdruck" (nur Widget, kein
 * Pipeline-Wert): hohes ungenutztes Angebotspotenzial senkt den Druck auf
 * Innenverdichtung, hoher Nachfragedruck erhöht ihn. Angebot dominiert
 * (0.5 vs. 0.3), da Verdichtung primär eine Angebots-Antwort ist
 * (ARE-Raumbeobachtung: Innenentwicklung folgt Baulandknappheit).
 */
const VERDICHTUNGSDRUCK_GEWICHTE = { angebotspotenzial: -0.5, nachfragedruck: 0.3 } as const;

/**
 * Gewichte für den Anzeige-Indikator "Stadtbild" (nur Widget, kein
 * Pipeline-Wert). Heuristik: Einsprache-Rechte und Normen-Vielfalt schützen
 * das gewachsene Stadtbild (positiv), gemeinnütziger Mindestanteil erhöht
 * den (Ersatz-)Neubau-Anteil leicht (negativ). Skala so gewählt, dass die
 * maximale Parameter-Spanne (±2) im Trend-Pfeil sichtbar, aber nicht
 * dominant ist.
 */
const STADTBILD_GEWICHTE = {
  bau_einspracherecht_dritte: 0.2,
  bau_einspracherecht_suspensiv: 0.15,
  bau_normenharmonisierung: 0.1,
  gemeinnuetzig_mindestanteil: -0.05,
} as const;

export function WidgetGrid({ city, modified, diff }: Props) {
  const hasChanges = Object.keys(diff).length > 0;
  const context = city.context;

  // Phases for modified params (current behavior)
  const modifiedPhases = computePhasesCached(context, diff);

  // Phases for baseline ("Heutige Situation") — empty diff means no changes
  const emptyDiff: ParamsDiff40 = useMemo(() => ({}), []);
  const baselinePhases = computePhasesCached(context, emptyDiff);

  // Latest phase for single-value widgets
  const latestModified = modifiedPhases[modifiedPhases.length - 1]!;
  const latestBaseline = baselinePhases[baselinePhases.length - 1]!;

  const baseline = city.params;

  // Group trends helper
  function computeModifiedGroupTrends(phase: PhaseResult) {
    return computeGroupTrends(phase.marketState, baseline, modified);
  }
  function computeBaselineGroupTrends(phase: PhaseResult) {
    return computeGroupTrends(phase.marketState, baseline, baseline);
  }

  const stadtbildGetter = (m: CityParams40, b: CityParams40) => () =>
    (Object.entries(STADTBILD_GEWICHTE) as [keyof typeof STADTBILD_GEWICHTE, number][])
      .reduce((acc, [key, w]) => acc + ((m[key] as number) - (b[key] as number)) * w, 0);

  return (
    <div className="widget-grid">
      {/* -- Lesehilfe: Was die Simulation zeigt (und was nicht) -- */}
      <p className="widget-grid__note">
        Die Simulation zeigt die Wirkung von <strong>Politik-Änderungen</strong> gegenüber
        der heutigen Politik von {city.name} — nicht einen Vergleich der Städte untereinander.
        Auch die «Heutige Situation» ist eine Projektion: Kontextfaktoren wie Zuwanderung,
        Zinsen und Marktlage wirken über alle drei Zeiträume weiter. Alle Werte sind
        normierte Indizes, keine Franken- oder Prozentbeträge.
      </p>

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
      <TrendArrow label="Verdichtungsdruck" phases={modifiedPhases} baselinePhases={hasChanges ? baselinePhases : undefined} invertColors getValue={p => p.marketState.angebotspotenzial * VERDICHTUNGSDRUCK_GEWICHTE.angebotspotenzial + p.marketState.nachfragedruck * VERDICHTUNGSDRUCK_GEWICHTE.nachfragedruck} />
      <TrendArrow label="Stadtbild" phases={modifiedPhases} baselinePhases={hasChanges ? baselinePhases : undefined} invertColors getValue={stadtbildGetter(modified, baseline)} />
      <MietbelastungWidget
        params={modified}
        baseline={hasChanges ? baseline : undefined}
        marketState={latestModified.marketState}
        baselineMarketState={hasChanges ? latestBaseline.marketState : undefined}
      />
      <OwnershipDonut city={city} modified={modified} diff={diff} state={latestModified.marketState} baselineState={hasChanges ? latestBaseline.marketState : undefined} />
    </div>
  );
}
