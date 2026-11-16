# Widget-Katalog

> Stand 2026-11-16. Massgebend ist `src/widgets/WidgetGrid.tsx`; bei Widerspruch gilt der Code.
> Alle Werte sind normierte Indizes (–1…+1), keine Franken- oder Prozentbeträge, ausser wo vermerkt.

## Datenfluss

```
URL → useUrlState → { city, modified, diff }
                         │
WidgetGrid ── computePhasesCached(context, diff)  → modifiedPhases (P1–P3)
           └─ computePhasesCached(context, {})    → baselinePhases («Heutige Situation»)
```

- Ist ein Parameter geändert (`changedParamKeys(diff).length > 0`), bekommt jedes Widget zusätzlich die Baseline und zeigt «Heute» neben «Simuliert». Die gemeinsame Hülle dafür ist `CompareColumns`.
- Auch die Baseline ist eine Projektion: Die Kontextfaktoren wirken in jeder Phase weiter.
- Einzelwert-Widgets zeigen den langfristigen Stand (P3, `latestModified`).

## Reihenfolge im Raster

| # | Widget | Datenquelle | Darstellung |
|---|---|---|---|
| 1 | `GroupTrendWidget` («Trend Wohnpreise») | `computeGroupTrends()` (groups.ts) je Phase; Treiber per Leave-one-out aus `computeGroupDrivers()` (group-drivers.ts) | Tabelle: 9 Gruppen × 3 Phasen, Treiber je Gruppe |
| 2 | `SupplyDemandChart` («Preis-Mengen-Diagramm») | supply-demand.ts: Nachfragekurve verschoben durch `nachfragedruck`, Angebotskurve durch `angebotspotenzial` und `investitionsattraktivitaet`, Steigung aus `angebotspotenzial_regulation` | Kurven je Phase; Referenzlinie = Baseline derselben Phase |
| 3 | `TrendArrow` «Nachfragedruck» | E1 `nachfragedruck` | Trendpfeil über 3 Phasen |
| 4 | `TrendArrow` «Angebotspotenzial» | E1 `angebotspotenzial` (invertiert gezeigt) | Trendpfeil |
| 5 | `GentrifizierungsWidget` | E2 `gentrifizierungsindex` | Stufe, Balken je Phase |
| 6 | `TrendArrow` «Neubau-Hemmnis» | E2 `neubau_hemmnisindex` | Trendpfeil |
| 7 | `TrendArrow` «Verdichtungsdruck» | Anzeigewert, kein Pipeline-Knoten: `VERDICHTUNGSDRUCK_GEWICHTE` (WidgetGrid.tsx) aus `angebotspotenzial` und `nachfragedruck` | Trendpfeil |
| 8 | `TrendArrow` «Stadtbild» | Anzeigewert aus Parameter-Diffs: `STADTBILD_GEWICHTE` (WidgetGrid.tsx) | Trendpfeil |
| 9 | `MietbelastungWidget` | belastung.ts: `computeMieteBelastung` / `computeEigentumBelastung` aus dem Marktzustand P3 | Belastung in % des Einkommens (Ausnahme von der Index-Regel), Stufe |
| 10 | `MietrechtRegimeWidget` | Regime-Zustände aus mietrecht-regime.ts (provisorisch, CH-012): `vergleichsmiete_aktiv`, `erhoehungsspielraum`, `bestandsmiete`, `anfangsmiete`, `verweildauer` | Tabelle Zustand × Phase. Fliesst nicht in Gruppen-Trends und Mietbelastung ein |
| 11 | `OwnershipDonut` | `context.ownershipBaseline` der Stadt, verschoben durch E1-Trends | Donut der Eigentumsverteilung; Hinweis, wenn die Baseline geschätzt ist (`ownershipBaselineEstimated`) |
| 12 | `EigentumsquotenWidget` | E1 `eigentumsquoten_trend` (P3) | Einzelwert mit Trendbeschriftung |
| 13 | `GemeinnuetzigSektorWidget` | E1 `gemeinnuetzig_kraft` (P3) | Einzelwert |
| 14 | `MarktfriktionsWidget` | E1 `marktfriktion` (P3) | Einzelwert |
| 15 | `StandortwettbewerbWidget` | `aufwertungsdruck`, `investitionsattraktivitaet` (P3) und `context.wirtschaftskraft` | Einzelwert 0…100 |
| 16 | `FiskalischeWirkungWidget` | E2 `fiskalische_wirkung` (P3), Terme aus `E2_TERMS` (derived.ts) | Normierter Index, bewusst keine CHF-Umrechnung |

Nicht im Raster gezeigt: E2 `verdraengungsrisiko_index` (wird berechnet, hat kein eigenes Widget).

## Ausserhalb des Rasters

- **`ParameterPanel`** (links): 44 Schieber in Gruppen (`paramMeta` in params.ts). Der 44. ist «Ausgleich beim Pflichtanteil» (`gemeinnuetzig_ausgleich`). Er wirkt nur zusammen mit einem Pflichtanteil (bedingte Kante, `ausgleichDurch`).
- **`ContextIndicators`** (im ParameterPanel): die Kontextfaktoren der Stadt, nicht editierbar, dazu der Mietabstand «Neubezug ggü. Altmiete» (`context.mietabstand_neubezug`, rechnet nicht, nur Anzeige).
- **`DAGVisualization`** (App.tsx): Graph E0 → E1 → E2 aus `dag-topology.ts`, ohne Rückkopplungen.
- **`CitySelector`**: Stadt-Slug im URL-Pfad.

## Ein Widget hinzufügen

Siehe AGENTS.md, Abschnitt «Widgets erweitern». Wächter: `schieber-wirkung.test.ts` prüft, dass jeder Schieber eine der hier angezeigten Grössen bewegt. Wer ein Widget entfernt, nimmt dessen Grössen dort aus `GEZEIGTE_E1` / `GEZEIGTE_E2`.
