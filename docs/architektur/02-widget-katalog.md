# Widget-Katalog

> Alle Widgets lesen aus `PhaseResult[]` (Phase-Pipeline) und visualisieren die Effekte der Parameter-Änderungen.

---

## E2-Widgets

### GentrifizierungsWidget

**Datenquelle:** `result.e2[i].gentrifizierungsindex` pro Phase
**Darstellung:** Gauge oder Trend-Diagramm über die 3 Phasen
**Interpretation:** Positiv = Quartier wandelt sich, negativer Druck auf Bestandsmieter

### NeubauHemmnisWidget

**Datenquelle:** `result.e2[i].neubau_hemmnisindex` pro Phase
**Darstellung:** Gauge oder Balkendiagramm
**Interpretation:** Zeigt wie stark Neubau behindert wird (invertiert von Angebotspotenzial)

### VerdraengungsRisikoWidget

**Datenquelle:** `result.e2[i].verdraengungsrisiko_index` (= `verdraengungsrisiko` E1)
**Darstellung:** Trend-Diagramm
**Interpretation:** Alias für E1-Variable, über Phasen aggregiert

### FiskalischeWirkungWidget

**Datenquelle:** `result.e2[i].fiskalische_wirkung` pro Phase
**Darstellung:** Balken- oder Trend-Diagramm
**Interpretation:** Netto-Fiskalische Wirkung von Spekulationshemmung, Marktfriktion, Gemeinnützigkeit, Aufwertung

---

## E1-Widgets

### SupplyDemandChart

**Datenquelle:** `angebotspotenzial` und `nachfragedruck` pro Phase
**Darstellung:** Zwei gegenläufige Trendlinien (Differenz = Angebots-/Nachfrage-Lücke)

### OwnershipDonut

**Datenquelle:** `eigentumsquoten_trend` (E1) + `CityParams40`-Eigentums-relevanten Parameter
**Darstellung:** Donut-Chart mit Eigentums-/Mietverteilung

### GemeinnuetzigSektorWidget

**Datenquelle:** `gemeinnuetzig_kraft` (E1)
**Darstellung:** Gauge oder Trend über Phasen

### EigentumsquotenWidget

**Datenquelle:** `eigentumsquoten_trend` (E1)
**Darstellung:** Trend-Balken oder Timeline

### MarktfriktionsWidget

**Datenquelle:** `marktfriktion` (E1)
**Darstellung:** Gauge

### StandortwettbewerbWidget

**Datenquelle:** `nachfragedruck` (E1) + `investitionsattraktivitaet` (E1) + Kontextfaktoren
**Darstellung:** kombinierte Visualisierung

---

## E1 + Gruppen-Widgets

### GroupTrendWidget

**Datenquelle:** `computeGroupTrends()` (groups.ts)
**Daten:** 8 Gruppen × 3 Phasen Preistrend (–1…+1)
**Darstellung:** Balken-Diagramm oder divergenter Chart über alle 8 Gruppen
**Besonderheit:** Zeigt auch die Top-3-Treiber pro Gruppe (welche Parameter am meisten beitragen)

### DivergingTrend

**Datenquelle:** E2-Indikatoren pro Phase, verglichen über alle Gruppen
**Darstellung:** Divergierendes Trend-Diagramm
**Interpretation:** Zeigt auseinanderlaufende Entwicklung zwischen E2-Indikatoren

---

## Steuerung

**WidgetGrid** orchestriert alle Widgets:

```
computePhasePipeline(baseline, modified, diff)
    │
    ├── PhaseResult[0] (Phase 1)
    │     ├── e1: MarketState
    │     └── e2: DerivedIndicators
    ├── PhaseResult[1] (Phase 2)
    │     └── ...
    └── PhaseResult[2] (Phase 3)
          └── ...

Jedes Widget empfängt PhaseResult[] und:
  1. Aggregiert über die 3 Phasen (gewichtet nach Phase)
  2. Vergleicht Baseline vs. Modified
  3. Rendert die Visualisierung
```
