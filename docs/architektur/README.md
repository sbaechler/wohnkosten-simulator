# Architektur — Wohnkosten-Simulator

> **Zweck:** Diese Dokumentation bildet den Ist-Stand der aktuellen Implementation ab. Die Architektur-Dokumentation wird synchron zum Code gepflegt.

---

## Überblick

```
user input            computation               visualization
────────────         ──────────────             ─────────────
                     ┌──────────────────────────────┐
Stadt wählen  ────▶   │ CityConfig (Ist-Zustand)     │
                     │   context: 6 Kontextfaktoren │
                     │   params: 41 Parameter      │
                     └──────────────────────────────┘
                              │
                              ▼
Parameter ändern  ────▶  ┌──────────────────────────────────────────────────────────┐
  (via Slider)           │ Graph-Compute-Pipeline (compute-phases.ts)                 │
                        │                                                          │
                        │  E0 (41+6 Inputs) ──▶ E1 (11 Markt-Zustandsvariablen)     │
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
- **7 Kontextfaktoren** (`CityContext`), Skala –2…+2: Zinsniveau, Zuwanderungsdruck, Wirtschaftskraft, Bevölkerungstrend, Marktenge, Teuerung und Referenzzins-Änderung (beide national, im Mietrecht-Regime; die Referenzzins-Änderung zusätzlich als Zinskanal der Eigentümer in `groups.ts`). Die frühere Mietbelastungs-Grenze ist entfernt (Fix-14, 2026-11-15). Dazu die `ownershipBaseline`-Anteile.
- **43 steuerbare Parameter** (`CityParams40`, der Name ist historisch): atomare Policies, Skala 0/1/2
- **Baseline** (Ist-Zustand der gewählten Stadt) vs. **Modified** (Nutzer-Szenario)
- **Diff** (`ParamsDiff40`): Geänderte Parameter mit `from`/`to`-Werten

### E1 — Markt-Zustandsvariablen
11 Variablen, jeweils normiert auf **–1 … +1**. Das Vorzeichen folgt dem
Namen der Variable: positiv heisst «mehr davon» (`angebotspotenzial` > 0 =
mehr Angebot, `mietpreis_schutzlevel` > 0 = mehr Schutz,
`nachfragedruck` > 0 = mehr Druck). Ob das für eine Gruppe gut oder schlecht
ist, entscheidet erst `groups.ts`.

| Variable | Bedeutung |
|----------|-----------|
| `angebotspotenzial` | Fördert oder hemmt das Szenario neuen Wohnraum? |
| `nachfragedruck` | Wie stark übertrifft Nachfrage das Angebot? |
| `mietpreis_schutzlevel` | Wie stark sind Bestandsmieter vor Preiserhöhungen geschützt? |
| `verdraengungsrisiko` | Gefahr von Kündigung, Sanierung, Umnutzung |
| `spekulationshemmung` | Wie stark wird kurzfristige Bodenspekulation erschwert? |
| `marktfriktion` | Wie "eingefroren" ist der Immobilienmarkt? |
| `gemeinnuetzig_kraft` | Stärke des nicht-marktorientierten Wohnsektors |
| `eigentumsquoten_trend` | Tendenz zu mehr oder weniger Wohneigentum |
| `aufwertungsdruck` | Tendenz zur Quartier-Aufwertung |
| `investitionsattraktivitaet` | Attraktivität für private/institutionelle Investoren |
| `angebotspotenzial_regulation` | Elastizität des Angebots auf Preissignale (Angebotskurven-Steigung) |

### E2 — Abgeleitete Indikatoren
4 zusammengesetzte Grössen, normiert auf **–1 … +1**:

Alle Terme sind nullpunkt-treu (neutraler Markt → Indikator 0); gewichtete
Summe, normiert durch die Koeffizienten-Summe. Source of Truth: `E2_TERMS`
in `src/model/derived.ts`.

| Indikator | Formel |
|-----------|--------|
| `gentrifizierungsindex` | `w·aufwertungsdruck – w·mietpreis_schutzlevel + w·verdraengungsrisiko – w·gemeinnuetzig_kraft` |
| `neubau_hemmnisindex` | `–1 × angebotspotenzial` (invertiert) |
| `verdraengungsrisiko_index` | Alias von `verdraengungsrisiko` (E1) |
| `fiskalische_wirkung` | `w·spekulationshemmung – w·marktfriktion – w·gemeinnuetzig_kraft + w·aufwertungsdruck` (plus = Mehreinnahmen oder Entlastung der öffentlichen Hand) |

---

## Verzeichnisstruktur

```
src/
├── model/
│   ├── params.ts          Metadaten der 43 Parameter (Labels, Stufen, Gruppen)
│   ├── derived.ts         E1→E2 Berechnung (E2_TERMS = Source of Truth)
│   ├── phases.ts          Typ-Definitionen für Phase-Pipeline
│   ├── phase-weights.ts   Phase-gewichtete Graph-Kanten (P1/P2/P3 weights)
│   ├── compute-phases.ts  Phase-Pipeline (Carry-E1-Akkumulation)
│   ├── groups.ts          Preistrends pro Bevölkerungsgruppe (9 Gruppen)
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

Die Berechnung läuft über die **Phase-Pipeline** in `compute-phases.ts`
(Stand 2026-11-15, Verbesserungsplan Fix-9 und Fix-10):

1. **E0 → E1 pro Phase:** `computeE1WithPhaseAndCarry()` rechnet für jeden
   E1-Knoten den Stand der Phase.
2. **Mietrecht-Regime:** `applyMietrechtRegime()` legt Kostenmiete und
   Bestandsregime auf den linearen Stand (`mietrecht-regime.ts`).
3. **E1 → E2:** `computeDerivedIndicators()` nach jeder Phase.
4. **Generator:** `computePhasePipeline()` liefert Phase 1, 2 und 3.
   `scripts/calibrate.ts` rechnet über dieselbe Funktion, mit eigenen
   Gewichten (Parameter `edges`).

**Formel je Knoten und Phase p:**

```
Stand[p] = clamp( PERSISTENCE · Stand[p−1]
                  + Σ_Kanten sign · w[p] · Δ · marketModulator / E1_NENNER )
```

- `Δ` = Parameter-Diff / 2 (ein Stufenschritt = 0.5) bzw. Kontextwert / 2.
- `w[p]` ist der **Impuls** der Kante in Phase p, nicht ihr Anteil am
  Endwert. Er kommt zum übertragenen Stand dazu.
- `PERSISTENCE = 0.8`: ohne neuen Impuls verliert ein Stand 20 % pro Phase.
  Übertragen wird der lineare Stand vor dem Regime-Abzug.
- `marketModulator = 1 + 0.3 · marktenge` (0.4…1.6).
- `E1_NENNER = 11.2`, gleich für alle Knoten. Ein Gewicht bedeutet damit an
  jeder Kante dasselbe, unabhängig von der Zahl der Kanten am Knoten.
  Hergeleitet so, dass der extremste Kontext einen Knoten in P3 gerade an
  ±1 bringt (Rechenweg im JSDoc, nachgerechnet in `phase-pipeline.test.ts`).

**Impulsvektoren** (`phase-weights.ts`, Kopf der Datei):

| Form | Vektor | Verlauf des Standes |
|---|---|---|
| neutral | `[w, w, w]` | wächst, P1 ≈ 41 % von P3 |
| Sprung und Halten | `[w, 0.2w, 0.2w]` | voller Effekt ab P1, bleibt stehen |
| verzögert | z. B. `[0, 0.6, 1]` | in P1 fast nichts, Hauptteil in P3 |

Jede Politik-Kante nennt in `profilQuelle` die Studie, aus der ihr Verlauf
stammt, oder `'Annahme'`. Annahme-Kanten haben den neutralen Vektor; ein
Test (`dag-integrity.test.ts`) prüft das. Der Verlauf am Stand wird in
`verlauf-fachlich.test.ts` gegen FR-003, DE-004, NZ-001 und KR-003 geprüft.

**Phasenlänge:** P1 = 0–2, P2 = 2–5, P3 = 5–10 Jahre. Der Übertrag ist pro
Phase gleich und nicht an die Länge gekoppelt. Das ist eine Annahme; die
Begründung steht beim JSDoc von `PERSISTENCE`.

---

## 9 Bevölkerungsgruppen

Die Preistrends werden für 9 fest definierte Gruppen berechnet (`GROUPS` in
`groups.ts`):

| Gruppe | Beschreibung |
|--------|---------------|
| Geringverdiener | Sozialhilfe / stark geförderte Wohnung |
| Bestandsmieter | Normalverdiener mit laufendem Mietvertrag |
| Neumieter (Angebot) | Normalverdiener auf Wohnungssuche |
| Glückspilze | Preisgebundene Wohnung |
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
| `DAG_EDGES` mit `weights: [P1,P2,P3]` | ✅ `PHASE_WEIGHTED_EDGES` in `phase-weights.ts` | ✅ Implementiert |
| `carryE1` Akkumulation | ✅ `computeE1WithPhaseAndCarry()` | ✅ Implementiert |
| 4 E2-Indikatoren (zeit_bis_wirkung entfernt) | ✅ 4 Indikatoren | ✅ Implementiert |
| Phase-Aware Kanten-Gewichte | ✅ `PHASE_WEIGHTED_EDGES` in `phase-weights.ts` | ✅ Implementiert |
| Generator-Pipeline | ✅ `computePhasePipeline()` | ✅ Implementiert |
| 8 Bevölkerungsgruppen | 9 Gruppen in `groups.ts` (Bestand und Neumieter getrennt) | Abweichung |
| 40 atomare Parameter | 43 Parameter in `CityParams40` | Abweichung |
| 4 Kontextfaktoren | 7 Kontextfaktoren in `CityContext` | Abweichung |
