# AGENTS.md — Wohnkosten-Simulator

## Was ist das?

Ein React/Ts/D3-Widget-Simulator für Schweizer Wohnungsmarktpolitik. Der Benutzer stellt politische Parameter ein (Mietrecht, Bodenrecht, Förderung etc.) und sieht die Auswirkungen auf den Wohnungsmarkt in 3 Zeiträumen (kurz-/mittel-/langfristig).

**Ziel-URL:** https://wohnkosten-simulator.ch

---

## Projektstruktur

```
src/
├── generated/cities.ts     # AUTO-GENERATED aus YAML — nicht manuell editieren
├── model/
│   ├── compute-phases.ts   # DAG-Execution: E0→E1→E2 (Engine, auch von scripts/calibrate.ts importiert)
│   ├── derived.ts          # E2: abgeleitete Indikatoren (E2_TERMS = Source of Truth für E1→E2)
│   ├── params.ts          # Param-Metadaten, Diff-Funktionen
│   ├── phases.ts          # Phase types
│   ├── dag-topology.ts    # DAG topology projection (single-weight for viz)
│   └── phase-weights.ts   # Phase-gewichtete Kanten (P1/P2/P3 weights)
├── widgets/                # React+D3 Widgets
│   ├── WidgetGrid.tsx     # Layout-Orchestration
│   ├── GroupTrendWidget   # Preistrend-Tabelle
│   ├── SupplyDemandChart  # Angebots-/Nachfragediagramm
│   ├── OwnershipDonut     # Eigentumsverteilung (D3 donut)
│   ├── TrendArrow         # Einzelner Trend-Pfeil
│   └── GentrifizierungsWidget
├── components/
│   ├── ParameterPanel.tsx  # Slider-Panel links
│   └── CitySelector.tsx   # Städte-Dropdown
├── hooks/
│   └── useUrlState.ts     # URL-Query-String als State (source of truth)
└── types.ts               # Domain Types (E0/E1/E2)
data/cities/
└── switzerland.yaml       # SOURCE OF TRUTH für Städtedaten
docs/
├── architektur/           # Graph-Kanten, Widget-Katalog
├── recherche/             # Konsolidierte Studien (CH/DE/GLOBAL/… + summary.md)
└── review/                # Modell-Reviews mit Fix-Plänen
```

---

## Datenmodell (3 Ebenen)

### E0 — Rohparameter (40 Stück)
Politisch steuerbare Parameter, Werte 0/1/2. Beispiel: `mietrecht_kostenmiete`, `boden_vorkaufsrecht`.

### E1 — Marktvariablen (11 Stück)
Aus E0 berechnet, normalisiert –1…+1. Beispiel: `angebotspotenzial`, `nachfragedruck`, `mietpreis_schutzlevel`, `angebotspotenzial_regulation`.

### E2 — Abgeleitete Indikatoren (4 Stück)
Aus E1 berechnet (`E2_TERMS` in derived.ts): `gentrifizierungsindex`, `neubau_hemmnisindex`, `verdraengungsrisiko_index`, `fiskalische_wirkung`.

**Wichtige Modell-Annahmen:**
- Die 40 E0-Parameter wirken als **Diffs** (Änderung vs. Stadt-Baseline). Die absoluten Parameter-Werte einer Stadt beeinflussen die Baseline-E1-Werte NICHT — die Baseline wird nur von den Kontextfaktoren (`ctx:*`) getrieben.
- Kontextfaktoren wirken als konstanter Antrieb in jeder Phase → auch die Baseline ("Heutige Situation") entwickelt sich über die 3 Phasen weiter.
- Alle E1/E2-Werte sind normierte Indizes (–1…+1), keine CHF- oder Prozentwerte.

### Pipeline
```
E0 (Param) → E1 (Markt) → E2 (Indikatoren)
              ↓
         3 Phasen (kurz/mittel/langfristig)
```

---

## State-Flow

1. **URL** ist State: `/zuerich?mietrecht_kostenmiete=2&raumplanung_zonenreserve=2` (Pfad = Stadt-Slug, Query = Parameter-Overrides)
2. **useUrlState** parsed URL → liefert `baseline` (Stadt-Default) und `modified` (mit Overrides)
3. **computePhasesCached** berechnet die 3 Phasen
4. **WidgetGrid** rendert alle Widgets

**Wichtig:** Parameter-Änderungen werden NIE in React State gespeichert — nur in der URL. Das macht den Simulator deep-linkbar.

---

## Stadt-Daten bearbeiten

**Die YAML ist die Source of Truth**, nicht `src/generated/cities.ts`.

```
data/cities/switzerland.yaml  →  npm run build:data  →  src/generated/cities.ts
```

Nach dem Editieren der YAML:
```bash
npm run build:data        # regeneriert cities.ts
npm run dev               # startet mit neuen Daten
```

Aktuell: 10 Schweizer Städte (>40k Einwohner) mit allen 40 Parameter-Werten + 4 Kontextfaktoren.

---

## Parameter nachschlagen

Die Parameter-Metadaten (Labels, Stufen-Definitionen 0/1/2, Gruppen) stehen in `src/model/params.ts` (`paramMeta40`). Kanten-Gewichte und deren Forschungsbasis: `src/model/phase-weights.ts` und `docs/recherche/summary.md`.

---

## Widgets erweitern

1. Neues Widget in `src/widgets/` als React-Komponente
2. In `WidgetGrid.tsx` einbauen — `phases`, `baseline`, `modified`, `diff` als Props
3. Für Side-by-Side Vergleich (heutige vs. simulierte Werte): Widget muss `baselinePhases` und `viewMode`-Logik unterstützen — bestehende Widgets als Referenz
4. Tests: `npx vitest run`

**Widget-Regeln:**
- Wenn ein Parameter geändert ist → Widget zeigt "Heutige Situation" und "Simulierte Anpassungen" nebeneinander
- Widget responsed direkt auf URL-Änderungen (kein lokaler State für Parameter)

---

## Wichtige Konventionen

- **Keine anonymen Magic Numbers in der DAG-Pipeline** — Werte kommen aus `phase-weights.ts` (per-Edge `weights: [w1, w2, w3]`)
- **Andere Dateien dürfen benannte `const`s verwenden** — sie MÜSSEN aber JSDoc mit Quelle (Forschung, Sotomo, ETH SPUR etc.) und Zweck haben. Beispiele: `MIETBELASTUNG_SENSITIVITY` (belastung.ts), `KNAPPHEIT_GEWICHTE` (supply-demand.ts), `PERSISTENCE` (compute-phases.ts).
- **Per-Group-Faktoren in `groups.ts` sind Modell-Design** (definieren WAS eine Gruppe ist) — NICHT in `calibration.ts` extrahieren, sondern inline mit JSDoc-Rationale dokumentieren.
- **URL ist Source of Truth** — nie lokalen React-State für Parameter nutzen
- **Tests müssen grün sein** bevor gepullt wird: `npx vitest run`
- **Coverage** (optional, lokal): `npm run test:coverage`. Misst nur `src/model/**` (Pipeline-Code) — keine Widgets, keine generated/, keine Scripts.
- **Generated Files**: `src/generated/` wird aus YAML generiert — nicht manuell editieren
- **Branch-Strategie**: Feature-Branches → main (keine protected Branches aktiv)

---

## Scripts

```bash
npm run dev          # Dev-Server mit HMR
npm run build        # Production-Build (prebuild: build:data)
npm run build:data   # YAML → cities.ts regenerieren
npx vitest run       # Alle Tests
```

---

## Offene TODOs / Bekannte Issues

- `bun.lock` hat uncommittete lokale Änderungen (vorheriger Entwicklungsstand)
- Pre-existing build issue: shared package tsconfig referenziert @types/bun (in server/node_modules) — kein Blocker für Runtime
