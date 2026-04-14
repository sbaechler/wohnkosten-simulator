# Architektur — Wohnkosten-Simulator

> **Zweck:** Diese Dokumentation bildet den Ist-Stand der aktuellen Implementation ab. Die Architektur-Dokumentation wird synchron zum Code gepflegt.

---

## Überblick

```
user input            computation               visualization
────────────         ──────────────             ─────────────
                     ┌──────────────────────────────┐
Stadt wählen  ────▶   │ CityConfig (Ist-Zustand)     │
                     │   context: 4 Kontextfaktoren │
                     │   params: 40 Parameter      │
                     └──────────────────────────────┘
                              │
                              ▼
Parameter ändern  ────▶  ┌──────────────────────────────────────────────────────────┐
  (via Slider)           │ Graph-Compute-Pipeline (compute-phases.ts)                 │
                        │                                                          │
                        │  E0 (40+4 Inputs) ──▶ E1 (10 Markt-Zustandsvariablen)     │
                        │       │                        │                         │
                        │       │              ┌──────────┴──────────┐              │
                        │       │              │ Phase-Aware Weights │              │
                        │       │              │ P1= kurzfristig     │              │
                        │       │              │ P2= mittelfristig   │              │
                        │       │              │ P3= langfristig     │              │
                        │       │              └──────────┬──────────┘              │
                        │       │                         │                         │
                        │       │               E2 (4 abgeleitete Indikatoren)      │
                        │       │                         │                         │
                        │       │               ┌────────┴────────┐               │
                        │       │               │ carryE1 Akku-    │               │
                        │       │               │ mulation über    │               │
                        │       │               │ die Phasen       │               │
                        │       │               └────────┬────────┘               │
                        │       │                        │                         │
                        │       ▼                        ▼                         │
                        │   [Phase1] ──▶ [Phase2] ──▶ [Phase3]                  │
                        │                                                          │
                        └──────────────────────────────────────────────────────────┘
                                        │
                                        ▼
                        ┌──────────────────────────────────────────┐
                        │ WidgetGrid (10 Widgets)                  │
                        │ ─────────────────────────────────────── │
                        │ GentrifizierungsWidget  (E2)             │
                        │ Neubau-Hemmnis-Widget   (E2)              │
                        │ Verdrängungsrisiko-Widget (E2 alias)     │
                        │ Fiskalische Wirkung-Widget (E2)          │
                        │ OwnershipDonut         (E1+E0)          │
                        │ SupplyDemandChart      (E1)               │
                        │ GemeinnützigSektor-Widget (E1)           │
                        │ Eigentumsquoten-Widget (E1)              │
                        │ Marktfriktions-Widget  (E1)              │
                        │ GroupTrendWidget       (E1+E0+Gruppen)   │
                        │ Standortwettbewerb     (E1+Kontext)      │
                        │ DivergingTrend         (E2+Gruppen)       │
                        └──────────────────────────────────────────┘
```

---

## Schichten (Layers)

### E0 — Rohdaten
- **4 Kontextfaktoren** (`CityContext`): Zinsniveau, Zuwanderungsdruck, Wirtschaftskraft, Bevölkerungstrend — Skala –2…+2
- **40 steuerbare Parameter** (`CityParams40`): Atomare Policies in 8 Kategorien — Skala 0/1/2
- **Baseline** (Ist-Zustand der gewählten Stadt) vs. **Modified** (Nutzer-Szenario)
- **Diff** (`ParamsDiff40`): Geänderte Parameter mit `from`/`to`-Werten

### E1 — Markt-Zustandsvariablen
10 Variablen, jeweils normiert auf **–1 … +1**:
- Positiv = angebotsreduzierend / preistreibend / verdrängend
- Negativ = angebotsfördernd / preissenkend / schützend

| Variable | Bedeutung |
|----------|-----------|
| `angebotspotenzial` | Fördert oder hemmt das Szenario neuen Wohnraum? |
| `nachfragedruck` | Wie stark übertrifft Nachfrage das Angebot? |
| `mietpreis_schutzlevel` | Wie stark sind Bestandsmieter vor Preiserhöhungen geschützt? |
| `verdraengungsrisiko` | Gefahr von Kündigung, Sanierung, Umnutzung |
| `spekulationshemmung` | Wie stark wird kurzfristige Bodenspekulation erschwert? |
| `markfriktion` | Wie "eingefroren" ist der Immobilienmarkt? |
| `gemeinnuetzig_kraft` | Stärke des nicht-marktorientierten Wohnsektors |
| `eigentumsquoten_trend` | Tendenz zu mehr oder weniger Wohneigentum |
| `aufwertungsdruck` | Tendenz zur Quartier-Aufwertung |
| `investitionsattraktivitaet` | Attraktivität für private/institutionelle Investoren |

### E2 — Abgeleitete Indikatoren
4 zusammengesetzte Grössen, normiert auf **–1 … +1**:

| Indikator | Formel |
|-----------|--------|
| `gentrifizierungsindex` | `w·aufwertungsdruck + w·(1–mietpreis_schutzlevel) + w·verdraengungsrisiko + w·(1–gemeinnuetzig_kraft)` |
| `neubau_hemmnisindex` | `–1 × angebotspotenzial` (invertiert) |
| `verdraengungsrisiko_index` | Alias von `verdraengungsrisiko` (E1) |
| `fiskalische_wirkung` | `w·spekulationshemmung + w·(1–markfriktion) + w·gemeinnuetzig_kraft + w·aufwertungsdruck` |

---

## Verzeichnisstruktur

```
src/
├── model/
│   ├── params.ts          Metadaten der 40 Parameter (Labels, Stufen, Gruppen)
│   ├── graph.ts           Alter Graph (single-weight + time) — NICHT für Berechnung verwendet
│   ├── market-state.ts    E0→E1 Berechnung (alter Graph) — NICHT für Berechnung verwendet
│   ├── derived.ts         E1→E2 Berechnung
│   ├── phases.ts          Typ-Definitionen für Phase-Pipeline
│   ├── phase-weights.ts   Phase-gewichtete Graph-Kanten (P1/P2/P3 weights)
│   ├── compute-phases.ts  Phase-Pipeline (Carry-E1-Akkumulation)
│   ├── groups.ts          Preistrends pro Bevölkerungsgruppe (8 Gruppen)
│   └── url-helpers.ts     URL-Serialisierung
├── widgets/
│   ├── WidgetGrid.tsx     Widget-Orchestration
│   ├── GentrifizierungsWidget.tsx
│   ├── GroupTrendWidget.tsx
│   ├── SupplyDemandChart.tsx
│   ├── OwnershipDonut.tsx
│   └── ... (weitere Widgets)
├── components/
│   ├── ParameterPanel.tsx
│   ├── CitySelector.tsx
│   └── ContextIndicators.tsx
└── types.ts               Zentrale TypeScript-Interfaces
```

---

## Berechnungspipeline

Die Berechnung läuft über die **Phase-Pipeline** in `compute-phases.ts`:

1. **E0 → E1 pro Phase:** Für jede Phase wird `computeE1WithPhaseAndCarry()` aufgerufen
2. **Carry-Akkumulation:** Der E1-State der vorherigen Phase (`carryE1`) fliesst als "Gedächtnis" in die nächste Phase ein: `newValue = prevValue × 0.8 + newEffects`
3. **E1 → E2:** Nach jeder Phase wird `computeDerivedIndicators()` aufgerufen
4. **Generator:** `computePhasePipeline()` liefert die Resultate für Phase 1, 2 und 3

**Phase-Gewichte** (`phase-weights.ts`): Jede Kante hat drei Gewichte `[P1, P2, P3]`:
- `0.0` = keine Wirkung in dieser Phase
- `1.0` = volle Wirkung
- Werte dazwischen = anteilige Wirkung

**Persistenz-Faktor:** `0.8` — Der E1-Wert der Vorphase wird zu 80% beibehalten und nur zu 20% durch neue Effekte überschrieben.

---

## 8 Bevölkerungsgruppen

Die Preistrends werden für 8 fest definierte Gruppen berechnet:

| Gruppe | Beschreibung |
|--------|---------------|
| Geringverdiener | Soziahilfe / stark geförderte Wohnung |
| Normalverdiener Mieter | Mittleres Einkommen, freier Mietmarkt |
| Glückspilze | Preisgebundene/Genossenschaftswohnung |
| Normalverdiener Eigentümer | Mit Hypothek |
| Junge Familien | Familiengründungsphase |
| Genossenschafter | Genossenschaftsmitglieder |
| Rentner | Fixes Einkommen |
| High Earner | Hohe Kaufkraft |

---

## Unterschiede zur Spezifikation

Die Spezifikation in `docs/superpowers/specs/` beschreibt das Ziel-System.
Folgende Abweichungen vom Ist-Stand:

| Spezifikation | Ist-Stand | Status |
|--------------|-----------|--------|
| `zeit_bis_wirkung` als E2-Indikator | Entfernt (nicht aussagekräftig im Phasen-Modell) | ✅ Implementiert wie geplant |
| `TIME_CLASS_MAP` | Entfernt (redundant mit Phase-Gewichten) | ✅ Implementiert wie geplant |
| `DAG_EDGES` mit `weights: [P1,P2,P3]` | Noch nicht umgesetzt; `graph.ts` nutzt noch single-weight + time | ⚠️ In Bearbeitung |
| `carryE1` Akkumulation | ✅ `computeE1WithPhaseAndCarry()` | ✅ Implementiert |
| 4 E2-Indikatoren (zeit_bis_wirkung entfernt) | ✅ 4 Indikatoren | ✅ Implementiert |
| Phase-Aware Kanten-Gewichte | ✅ `PHASE_WEIGHTED_EDGES` in `phase-weights.ts` | ✅ Implementiert |
| Generator-Pipeline | ✅ `computePhasePipeline()` | ✅ Implementiert |
| 8 Bevölkerungsgruppen | ✅ `groups.ts` | ✅ Implementiert |
| 40 atomare Parameter | ✅ `CityParams40` | ✅ Implementiert |
| 4 Kontextfaktoren | ✅ `CityContext` | ✅ Implementiert |
