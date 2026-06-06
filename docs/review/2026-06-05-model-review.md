# Code-Review: Wohnkosten-Simulator (`src/model`)

**Datum:** 2026-06-05
**Scope:** `src/model/**` + angrenzende Konsumenten (`hooks/`, `widgets/`, `components/`)
**Test-Status:** 94/95 grün, 1 skipped
**Modell-LOC:** 2'620
**Reviewer:** Minimax M3

---

## Executive Summary

Architektur, Datenmodell (3 Ebenen E0→E1→E2) und State-Flow (URL als Source of Truth, Generator-Pipeline, deterministisch + gecacht) sind sauber. Forschung-getriebene Gewichte sind konsequent dokumentiert, `clamp` ist an allen Output-Stellen vorhanden, die DAG-Integrity-Tests greifen den Graph strukturell ab.

Die grössten Risiken liegen in **(a) versteckter Duplikation der DAG-Definition** (`graph.ts` vs. `phase-weights.ts`, die auseinanderdriften), **(b) einem Cache-Bug, der Stadtwchsel falsch cached**, und **(c) mehreren toten bzw. ungenutzten Feldern** im Datenmodell. Die AGENTS-Konvention "keine magic numbers in `phase-weights.ts`" wird an mehreren Stellen verletzt.

Es wurden **5 echte Bugs** (P0/P1) und **7 strukturelle Probleme** (P1/P2) identifiziert, dazu mehrere kleinere Issues. (Ursprünglich 6 Bugs — B6 erwies sich nach Recherche als Fehlalarm.)

---

## Findings

### 🔴 Echte Bugs

#### B1 — Cache-Key ignoriert die Stadt (P0)
**Datei:** `src/model/compute-phases.ts:158-160`
**Problem:** `_cacheKey(params, diff)` hasht nur `params` und `diff`, nicht aber `context`. Wechselt der User zwischen zwei Städten mit identischem Param-Set + Diff (z. B. Zürich und Winterthur mit Default-Werten), liefert der Cache das **falsche** Ergebnis zurück.
**Impact:** Falsche Visualisierungen ohne dass der User etwas merkt. Schwer zu debuggen, weil deterministisch falsch statt zufällig falsch.

#### B2 — Tote/halbtote Felder in `PhaseResult` (P2)
**Datei:** `src/model/phases.ts:16`, `src/model/compute-phases.ts:145`
**Problem:** `dominantParams: string[]` ist Teil des Typs, wird im Generator aber hart mit `[]` belegt. Es gibt **keinen** Producer und **keinen** Konsumenten.
**Impact:** Toter Code, verwirrt neue Entwickler, bläht Tests auf.

#### B3 — Unbenutzte Parameter überall (P2)
**Dateien:**
- `src/model/compute-phases.ts:86-87` — `_params`
- `src/model/market-state.ts:68, 71` — `_diff`
- `src/model/derived.ts:36, 39-40` — `_context`, `_diff`
- `src/model/groups.ts:348, 350` — `_diff`
- `src/model/SupplyDemandChart.tsx` & `DAGVisualization.tsx` (Aufrufer)
**Problem:** Parameter werden mit `void _x;` stummgeschaltet. Einige sind Legacy ("vielleicht brauchen wir's später"), andere sind API-Inkonsistenzen.
**Impact:** Rauschen, falsche API-Signaturen, lädt zu Verwirrung ein.

#### B4 — `computeMarketState` ignoriert den übergebenen Diff (P1)
**Datei:** `src/model/market-state.ts:75-76`
**Problem:** `paramDiff` Callback rechnet `modified[key] - baseline[key]` selbst, der `_diff`-Parameter wird ignoriert. Die Pipeline-Variante in `compute-phases.ts:109` benutzt den übergebenen Diff. **Inkonsistent.**
**Impact:** Wenn `computeMarketState` jemals mit anderem Diff als `modified - baseline` aufgerufen wird, gibt's stille Falschberechnungen. Konsumenten verlassen sich auf unterschiedliche Semantik.

#### B5 — `_AssertAllKeys` in `graph.ts` ist tautologisch (P2)
**Datei:** `src/model/graph.ts:188-191`
**Problem:**
```ts
type _AssertAllKeys = typeof DAG_EDGES[number] extends Edge ? true : never;
```
Da `DAG_EDGES: Edge[]` bereits getypt ist, ist die Bedingung **trivialerweise true**. Der Check prüft nicht, ob `from`/`to`/`sign`/`time`/`weight` valides Format haben.
**Impact:** False sense of security — der Test suggeriert Validierung, deckt aber nichts ab.
**Referenz:** In `params.ts:72-78` ist der entsprechende Check korrekt (prüft beide Richtungen der Schlüssel-Gleichheit).

#### B6 — `rentner`-Formel: Korrekt, **kein Bug** (Status: verifiziert)
**Datei:** `src/model/groups.ts:160-163`
**Erste Einschätzung:** Kommentar "profitieren von Schutz" passt nicht zu `+ verdraengungsrisiko * 0.2`.
**Verifikation (durchgeführt 2026-06-05):**

1. **Git-History** (`git log -p -S "rentner" -- src/model/groups.ts`):
   - **Commit `2dfe7d7` (28.03.2026, Erst-Version):** `groupBase = base * 0.7 + state.verdraengungsrisiko * 0.2 + protectionEffect * 0.4` — die `+protectionEffect`-Formel war ein systematischer Vorzeichen-Bug, der **alle** Mieter-Gruppen betraf (gleiches Muster in `geringverdiener`, `normalverdiener_mieter`, `junge_familien`).
   - **Commit `0bfdd46` (25.05.2026, Split-Refactor):** Vorzeichen-Korrekturen für die Schutz-empfangenden Gruppen:
     - `geringverdiener`: `+ protectionEffect * 0.8` → `− protectionEffect * 1.0`
     - `normalverdiener_bestand` (neu aus `normalverdiener_mieter`): `+ protectionEffect * 0.5` → `− protectionEffect * 1.2`
     - `genossenschafter`: `+ state.gemeinnuetzig_kraft * 0.3` → `− state.gemeinnuetzig_kraft * 0.5`
     - **`rentner`: `+ protectionEffect * 0.4` → `− protectionEffect * 0.8`** ← der fragliche Term
   - Der `+ state.verdraengungsrisiko * 0.2`-Term blieb in beiden Commits unverändert.

2. **Recherche-Belege** (`docs/recherche/CH/CH-008-eth-spur-verdichtung-verdraengung-2025.md`):
   > *"Verdrängung betrifft besonders Haushalte mit niedrigem Einkommen und **ältere Personen** in sanierungsbedürftigen Beständen"*
   > *"Verdrängte Bevölkerung: Vor allem vulnerable Personen — Menschen, die wahrscheinlich Schwierigkeiten haben, wieder bezahlbaren Wohnraum zu finden"*

   ETH SPUR 2025 benennt Rentner (ältere Personen) **explizit** als verletzliche Gruppe. Hohes `verdraengungsrisiko` ist also genau das, was auf Rentner preistreibend wirkt.

3. **Logik-Check:**
   - `mietpreis_schutzlevel > 0` = Regulierung schützt → Preistrend für Rentner soll **sinken** (sie profitieren) → `− protectionEffect * 0.8` ist **korrekt** ✓
   - `verdraengungsrisiko > 0` = Verdrängungsdruck hoch → Preistrend für Rentner soll **steigen** (sie werden durch Sanierung/Ersatzneubau verdrängt) → `+ verdraengungsrisiko * 0.2` ist **korrekt** ✓

**Schluss:** Code und Kommentar sind beide korrekt. Mein initialer B6-Flag war ein Fehlalarm. Die einzige kleine Inkonsistenz ist, dass der Kommentar nur den `protectionEffect`-Aspekt adressiert, nicht den `verdraengungsrisiko`-Aspekt.

**Empfehlung (P3, Polish):** Kommentar präzisieren, damit die Logik klarer wird:
```ts
} else if (group === 'rentner') {
  // Rentner: preissensitiv, fixiertes Einkommen
  // - Meist Bestandsmieter → profitieren von Mietschutz (protection dämpft Trend)
  // - Als verletzliche Gruppe (CH-008) aber auch verdrängungsgefährdet
  //   bei Sanierung/Ersatzneubau (verdraengungsrisiko erhöht Trend)
  groupBase = base * 0.7 + state.verdraengungsrisiko * 0.2 - protectionEffect * 0.8;
}
```

#### B7 — Veraltete / inkonsistente Kommentare in `phase-weights.ts` (P3)
**Datei:** `src/model/phase-weights.ts`
**Probleme:**
- Z. 34: `"E0 → angebotspotenzial (16 edges)"` — tatsächlich **20** edges
- Z. 195: `"E0 → nachfragedruck (11 edges)"` — tatsächlich **15** edges
- Z. 311: `"E0 → verdrängungsrisiko (7 edges)"` — tatsächlich **9** edges
- Z. 387: `"E0 → spekulationshemmung (8 edges)"` — tatsächlich **9** edges
- Z. 846 enthält das Chinesische Wort `额外` ("extra") in deutschem Kommentar
- Z. 950 suggeriert "Phase 3" Spezial-Logik, die Kanten sind aber ganz normale Triple-`[P1,P2,P3]`
**Impact:** Lesbarkeit, zukünftige Edits könnten sich auf falsche Counts verlassen.

---

### 🟠 Strukturelle Probleme

#### S1 — Zwei parallele DAG-Definitionen (P1) ⚠️ grösste strukturelle Schuld

| Datei | Struktur | Konsumenten |
|---|---|---|
| `graph.ts` (198 LOC) | `DAG_EDGES: Edge[]` mit `weight` + `time` | `market-state.ts`, `DAGVisualization.tsx` |
| `phase-weights.ts` (1009 LOC) | `PHASE_WEIGHTED_EDGES` mit `weights: [P1,P2,P3]` | `compute-phases.ts` |

**Konsequenzen:**
- Die Pipeline nutzt **nur** `phase-weights.ts`. `graph.ts` ist für die Hauptberechnung irrelevant, wird aber weiterhin von `market-state.ts` und `DAGVisualization.tsx` importiert.
- Die zwei Graphen driften bereits:
  - `angebotspotenzial_regulation` (7 Kanten) existiert **nur** in `phase-weights.ts` — `DAGVisualization` zeigt sie also nicht
  - `nutzung_kurzzeitvermietung → verdrängungsrisiko` (Z. 375) fehlt in `graph.ts`
  - mehrere weitere Kanten fehlen
- `clampE1` / `computeMarketState` aus `market-state.ts` ist für die Hauptpipeline **tot** — wird nur noch von zwei Widgets als Bypass benutzt, die dann den **nicht-phasierten** Markt-Zustand zeigen.

**Empfehlung:** `graph.ts` löschen, beide Widgets auf die Pipeline umstellen. Wenn der `Edge`-Typ für die Visualisierung gebraucht wird, einen schmalen Adapter schreiben, der die Topologie aus `PHASE_WEIGHTED_EDGES` projiziert (z. B. `getDagTopology()`).

#### S2 — `computeMarketState` ist eine verkleidete Phase-1-Berechnung (P2)
**Datei:** `src/model/market-state.ts:27-52`
**Problem:** Macht `Σ(sign·weight·normalized) / Σ|weight|` — dieselbe Formel wie `compute-phases.ts:105-115` für P1. Zwei leicht unterschiedliche Codepfade für dieselbe Mathematik.
**Lösung:** Löst sich mit S1 automatisch auf.

#### S3 — `sign` + `weight` als zwei Felder (P3)
**Datei:** `src/model/phase-weights.ts:29-30`
**Problem:** `sign: 1 | -1` und `weights: [number, number, number]`. Im Code: `numerator += edge.sign * weight * delta` — `sign` und `weight` werden immer zusammen multipliziert.
**Vorteil Vereinigung:** Lookup einfacher, `sign`-Checks im DAG-Integrity-Test entfallen, Topologie-Projektionen einfacher.
**Aufwand:** Mittel (~100 Stellen berührt), ggf. automatische Migration via Codemod.

#### S4 — `clamp`-Helper 5× dupliziert (P3)
**Dateien:** `compute-phases.ts:23`, `market-state.ts:103` (inline), `derived.ts:10`, `groups.ts:111`, `belastung.ts` (inline)
**Lösung:** Ein Helper in `src/model/utils.ts` (oder `src/model/math.ts`).

#### S5 — Magic Numbers widersprechen der AGENTS-Konvention (P3)
**`AGENTS.md` Z. 122:** *"Keine magic numbers — alle Werte für die DAG kommen aus `phase-weights.ts`."*

Aber:
- `compute-phases.ts:62` `PERSISTENCE = 0.8`
- `compute-phases.ts:74` `PHASE_BASE_MULTIPLIER = [0.4, 0.7, 1.0]`
- `compute-phases.ts:80-82` `marketModulator` benutzt Faktor `0.3`
- `belastung.ts:56-59` benutzt Faktoren `8, 6, 5, 3` (Wohnmonitor-Kalibrierung)
- `belastung.ts:73-74` benutzt Faktoren `4, 3`
- `supply-demand.ts:24-28` benutzt Gewichte `0.4, 0.3, 0.15, 0.15`
- `supply-demand.ts:34, 39, 47, 57, 72, 74` benutzt diverse Konstanten
- `groups.ts:130, 137, 140, 144, 148, 152, 156, 159, 163, 166` benutzt diverse Multiplikatoren

DAG-Gewichte sind tatsächlich zentralisiert — gut. Aber die **Effekt-Skalierung** ist verstreut.
**Optionen:**
1. Auslagern in `src/model/calibration.ts` (konsistent mit AGENTS.md)
2. AGENTS.md präzisieren: "DAG-Gewichte zentral, Effekt-Skalierung darf modul-lokal sein" (lockerer)

#### S6 — Type-Safety-Lücken (P3)
- `market-state.ts:11` `normalizeContext(v: ParamValue | -2 | -1 | 0 | 1 | 2)` — Vereinigung effektiv `number`, kein Typschutz
- `market-state.ts:75` `as number` Casts — `ParamValue` ist `0|1|2`, Differenz ist `-2|-1|0|1|2`, strenger geht ohne Casts
- `phase-pipeline.test.ts:50` `const EMPTY_DIFF = {} as never;` — `as never` ist gefährlicher als nötig
- `compute-phases.ts:134` `[1, 2, 3] as Phase[]` — `[1, 2, 3] as const` wäre ehrlicher

#### S7 — `void _x;` Stummheits-Hack (P3)
Siehe B3. Sauberer: Param mit `_`-Prefix benennen (TS-Konvention für ungenutzte Parameter), kein `void`-Hack nötig.

---

### 🟡 Kleinere Issues

#### K1 — `extra: protectionEffect` ist tot
**Datei:** `src/model/groups.ts:171`
**Problem:** Zweites Rückgabefeld, das niemand liest (Aufrufer destrukturiert nur `trend`).

#### K2 — Test-Coverage-Lücken
Keine Unit-Tests für:
- `belastung.ts` (Wohnmonitor-Kalibrierung) — kritisch für MietbelastungWidget
- `supply-demand.ts` (Gleichgewichts-Mathematik) — kritisch für SupplyDemandChart
- `url-helpers.ts` (URL-Parsing/Building) — sicherheitskritisch (User-Input)
- `groups.ts` jenseits der 2 Divergenz-Tests (insbesondere `computeDrivers`)

#### K3 — Group-Trend Driver-Richtungslogik unleserlich
**Datei:** `src/model/groups.ts:293`
**Problem:** Verschachtelte Ternaries. Hilfsvariable `effectiveDirection` würde die Lesbarkeit deutlich verbessern.

#### K4 — `markt_mietbelastungs_grenze` ist als `ParamValue` getypt, aber semantisch ein Kontextfaktor
**Datei:** `src/types.ts:72`
**Problem:** JSDoc sagt explizit *"Sotomo 2025: Strukturelles Niveau …"* (Kontext), aber es ist als steuerbarer Parameter getypt. Andere Kontext-Faktoren sind in `CityContext` (Z. 75-82). Verwirrend für die UI: ist das wirklich steuerbar oder nicht?
**Klärung nötig:** Wenn Kontext → nach `CityContext` verschieben. Wenn steuerbar → JSDoc korrigieren.

#### K5 — Phase-Labels dupliziert
**Dateien:** `phases.ts:8` (`PhaseName` type), `compute-phases.ts:124-125` (`PHASE_NAMES`, `PHASE_YEAR_LABELS` Arrays)
**Lösung:** Labels und Type zusammen in `phases.ts` definieren.

---

## Positiv-Liste

Diese Aspekte funktionieren gut und sollten so bleiben:

- ✅ 3-Ebenen-Pipeline (`E0 → E1 → E2`) konsequent durchgezogen
- ✅ URL als Source of Truth — keine Parameter im React-State
- ✅ Generator-Pattern für Phasen + Cache-Trennung
- ✅ Deterministische Berechnung (Tests bestätigen Reproduzierbarkeit)
- ✅ Compile-Time-Checks für Schlüssel-Vollständigkeit (`params.ts:72-78`)
- ✅ Forschung-getriebene Gewichte mit Quellen-Kommentaren pro Kante
- ✅ `clamp` an allen Output-Stellen (E1/E2 immer in [-1, 1])
- ✅ `dag-integrity.test.ts` deckt Graph-Struktur ab
- ✅ 94/95 Tests grün, 1 skipped

---

## Fix-Plan

Sortiert nach Priorität, jedes Item mit Aufwandsschätzung und Abhängigkeiten.

### Sprint 1: Kritische Korrektheit (P0/P1)

#### Fix-1: B1 — Cache-Key um Context erweitern
**Datei:** `src/model/compute-phases.ts:158-160`
**Aufwand:** 5 min
**Schritte:**
1. `_cacheKey` Signatur ändern zu `(context, params, diff)`
2. `context` in den `JSON.stringify` aufnehmen
3. Test in `phase-pipeline.test.ts` ergänzen, der explizit zwei verschiedene Städte mit gleichen Params/Diff aufruft und unterschiedliche Cache-Einträge prüft.
4. `invalidatePhasesCache` muss nichts ändern — `clear()` bleibt.

#### Fix-2: ~~B6 — `rentner`-Vorzeichen klären~~ → **erledigt (kein Bug)**
**Status:** Recherche durchgeführt, Code ist korrekt. Siehe B6-Block oben. Nur Polish nötig (Kommentar präzisieren, kein Code-Fix). Wird in Sprint 2 als Fix-7b nachgeholt.

#### Fix-3: B4 — `computeMarketState` Diff konsistent nutzen
**Datei:** `src/model/market-state.ts:73-76`
**Aufwand:** 30 min
**Schritte:**
1. `paramDiff`-Callback auf den übergebenen `diff` umstellen (statt selbst zu rechnen)
2. Caller updaten, sodass sie den realen Diff weitergeben (auch in `SupplyDemandChart.tsx:78` und `DAGVisualization.tsx:393`)
3. Test ergänzen, der prüft, dass `computeMarketState(ctx, base, mod, base→mod_diff) === computeMarketState(ctx, base, mod, {})` mit konsistenten Erwartungen
4. **Vorsicht:** Bug wird evtl. von niemandem aktiv genutzt (Caller rechnen den Diff meist korrekt), also semantisch verifizieren vor Refactor.

#### Fix-4: S1 — Doppelte DAG-Definitionen konsolidieren (kritischste Architekturaufgabe)
**Dateien:** `src/model/graph.ts`, `src/model/market-state.ts`, `src/widgets/SupplyDemandChart.tsx`, `src/widgets/DAGVisualization.tsx`
**Aufwand:** 3-4 h
**Schritte:**
1. `phase-weights.ts` als einzige Quelle der Wahrheit bestätigen.
2. `src/model/dag-topology.ts` neu: schmale Projektion `getDagTopology()` liefert `Array<{from, to, sign, weight: avg, time: dominant}>` für Visualisierung.
3. `src/model/graph.ts` löschen, `DAG_EDGES` Export entfernen.
4. `market-state.ts` löschen (Funktionen werden in der Pipeline gebraucht, nicht hier). Falls `computeMarketState` von Widgets gebraucht wird, durch `computePhasesCached` ersetzen.
5. `DAGVisualization.tsx`: `DAG_EDGES`-Import durch `getDagTopology()` ersetzen.
6. `SupplyDemandChart.tsx:78`: `clampE1(computeMarketState(...))` durch `latestModified.marketState` aus der Pipeline ersetzen.
7. `computeDiff40` und `hasChanges40` bleiben in `params.ts`.
8. `clampE1` mit nach `utils.ts` verschieben (siehe S4).
9. Alle bestehenden Tests müssen grün bleiben — `dag-integrity.test.ts` ist weiterhin valide.
10. Neuen Test: `dag-topology.test.ts` der prüft, dass `getDagTopology` alle 11 E1 + 4 E2 Nodes abdeckt (Konsistenz mit `phase-pipeline.test.ts`).

---

### Sprint 1 — Completion Status (2026-06-06)

**Erledigt:**

| Fix | Status | Notizen |
|-----|--------|---------|
| Fix-1 (B1 Cache-Key) | ✅ Done | `_cacheKey` enthält `context`. Neuer Test in `phase-pipeline.test.ts` (zwei Städte, gleiche Params → zwei Cache-Einträge). |
| Fix-2 (B6 rentner) | ✅ Done (kein Bug) | Recherche bestätigt: ETH SPUR 2025 (`CH-008`) listet ältere Personen explizit als verletzliche Gruppe. Mechanik korrekt. Polish in Fix-7b. |
| Fix-3 (B4 Diff) | ✅ Done | `market-state.ts` gelöscht → `computePhasesCached` ist jetzt die einzige Compute-Entry. `diff` fliesst korrekt durch die Pipeline. |
| Fix-4 (S1 DAG-Konsolidierung) | ✅ Done | `dag-topology.ts` neu (60 LOC, single-weight Projektion). `graph.ts` + `market-state.ts` gelöscht. `DAGVisualization.tsx` + `SupplyDemandChart.tsx` migriert. `dag-topology.test.ts` neu (9 Tests). |

**Begleitende Aufräumarbeiten:**

- `App.tsx:56-61`: `baseline`-Prop aus `DAGVisualization`-Call entfernt (jetzt unused).
- `DAGVisualization.tsx:382`: `baseline`-Prop aus Interface entfernt.
- `DAGVisualization.tsx:392`: `phases[phases.length - 1]` statt hardcoded `phases[2]` (defensiv, falls Phasenanzahl ändert).
- `SupplyDemandChart.tsx:6,42-46`: Baseline-Compute mit `useMemo` + Deps `[context, baseline]` (React-konform, kein render-path anti-pattern).
- `groups.ts:339`: JSDoc von `computeMarketState()` auf `computePhasesCached()` aktualisiert.
- `AGENTS.md:23-25`: `dag-topology.ts` + `phase-weights.ts` ergänzt.

**Verifikation:**

- `npx vitest run`: **104 passed, 1 skipped** (baseline 94/95 + 9 neu in `dag-topology.test.ts` + 1 cache-key-Test in `phase-pipeline.test.ts`).
- `npx tsc --noEmit`: clean.

**Hinweise für Sprint 2:**

- `clampE1`-Migration (Fix-4 Schritt 8 / Fix-12) entfällt — Datei ist mit `market-state.ts` gelöscht.
- Sollten für `SupplyDemandChart` weitere Re-Memoisationen geprüft werden (`activePhasesForChart` etc.)?
- B2/B3 (tote Felder) und S4 (clamp) sind jetzt deutlich kleiner geworden.

### Sprint 2: Aufräumen (P2)

#### Fix-5: B2 + B3 — Tote Felder und unbenutzte Parameter entfernen
**Dateien:** diverse
**Aufwand:** 1-2 h
**Schritte:**
1. `dominantParams: string[]` aus `PhaseResult` (`phases.ts:16`) entfernen, in `compute-phases.ts:145` ebenfalls.
2. Verbleibende `_x`-Parameter:
   - `_params` in `compute-phases.ts` (Signature breaking) → entweder nutzbar machen oder entfernen
   - `_diff` in `market-state.ts` — wird durch Fix-3 obsolet
   - `_context`, `_diff` in `derived.ts` — wenn nicht gebraucht, Parameter aus der Signatur entfernen
   - `_diff` in `groups.ts` — gleich
3. `void _x;`-Hacks überall raus, stattdessen TS-`_`-Prefix-Konvention.
4. Test-Coverage prüfen — keine Tests verlassen sich auf diese Felder? (Suche mit grep).

#### Fix-6: B5 — `_AssertAllKeys` schärfen oder löschen
**Datei:** `src/model/graph.ts:188-191`
**Aufwand:** 15 min
**Schritte:**
1. Wenn `graph.ts` durch Fix-4 gelöscht wird, erledigt sich das automatisch.
2. Andernfalls: Check so umschreiben, dass er `from`/`to`/`sign`/`time`/`weight` validiert:
   ```ts
   type _IsValidEdge = Edge extends { from: NodeId; to: NodeId; sign: 1 | -1; weight: number; time: 'short'|'medium'|'long' } ? true : never;
   ```
   Oder noch besser: echte `DagIntegrityChecker`-Funktion in `dag-integrity.test.ts`.

#### Fix-7: B7 — Veraltete Kommentare in `phase-weights.ts` korrigieren
**Datei:** `src/model/phase-weights.ts`
**Aufwand:** 30 min
**Schritte:**
1. Section-Header-Counts updaten (20, 15, 9, 9 statt 16, 11, 7, 8).
2. Chinesisches `额外` in Z. 846 entfernen.
3. Z. 950 Kommentar "Phase 3" entweder präzisieren oder in normalen Kanten-Kommentar umwandeln.
4. **Fix-7b (war B6):** `rentner`-Kommentar in `groups.ts:160-163` präzisieren, damit beide Mechaniken (Schutz und Verdrängung) erklärt sind.

#### Fix-8: K1 — `extra`-Feld aus `basePriceTrend` entfernen
**Datei:** `src/model/groups.ts:121, 169-172`
**Aufwand:** 5 min

#### Fix-9: K4 — `markt_mietbelastungs_grenze` semantisch klären
**Dateien:** `src/types.ts:72`, evtl. `data/cities/switzerland.yaml`, evtl. `params.ts:386-391`
**Aufwand:** 1-2 h
**Schritte:**
1. Entscheidung treffen: ist es ein Kontextfaktor (Sotomo-Daten sind strukturell-statistisch) oder ein politisch steuerbarer Parameter (kommunale Mietbelastungs-Politik)?
2. Falls Kontext: in `CityContext` verschieben, aus `CityParams40` und `PARAM_KEYS_40` entfernen, aus `paramMeta40` raus, in YAML ggf. in `context:` Sektion.
3. Falls Parameter: JSDoc klarer formulieren, dass es um die kommunale Zielsetzung geht.
4. `build:data` und alle Tests neu laufen lassen.

#### Fix-10: K5 — Phase-Labels zentralisieren
**Dateien:** `src/model/phases.ts`, `src/model/compute-phases.ts:124-125`
**Aufwand:** 15 min

---

### Sprint 2 — Completion Status (2026-06-06)

**Erledigt:**

| Fix | Status | Notizen |
|-----|--------|---------|
| Fix-5 (B2/B3 Dead Fields) | ✅ Done | `dominantParams: string[]` aus `PhaseResult` entfernt (war immer `[]`). `void _x;` Hacks + `_params`/`_diff`/`_context` aus Signaturen von `computeE1WithPhaseAndCarry`, `computeDerivedIndicators`, `computeGroupTrends` entfernt. Aufrufer in `compute-phases.ts`, `DAGVisualization.tsx`, `WidgetGrid.tsx`, `gruppen-divergenz.test.ts` aktualisiert. |
| Fix-6 (B5 _AssertAllKeys) | ✅ Done (auto) | Mit `graph.ts`-Löschung in Sprint 1 automatisch erledigt. `_AssertAllKeys40` in `params.ts:72` ist unrelated (Params-40-Keys check, nicht Graph-Keys). |
| Fix-7 (B7 phase-weights comments) | ✅ Done | Section-Header-Counts korrigiert: 20, 15, 9, 9, 7, 5, 6, 6, 7, 11, 10, 1. Chinesisches `额外` → `Verzögerung`. "Phase 3" Section-Header präzisiert zu "Wirkt primär in P3". |
| Fix-7b (B6 rentner comment) | ✅ Done | `groups.ts:160-163`: beide Mechaniken (Schutz via Mietrecht + Verdrängung via ETH SPUR 2025) erklärt. |
| Fix-8 (K1 extra-Feld) | ✅ Done | `basePriceTrend` returnt nur `{ trend }`, `extra: protectionEffect` entfernt (ungenutzt in `WidgetGrid.tsx:357`). |
| Fix-9 (K4 markt_mietbelastungs_grenze) | ✅ Done (Variante A) | **Refactor:** Feld von `CityParams40` (ParamValue 0/1/2) nach `CityContext` (ContextValue -2..+2) verschoben, umbenannt zu `mietbelastungs_grenze` (Präfix-Drop konsistent mit `marktenge`, `zuwanderungsdruck`). DAG-Edge (`markt_mietbelastungs_grenze → mietpreis_schutzlevel`, weights [0.3, 0.5, 0.7]) entfernt — Context-Werte wirken nicht via DAG (analog `marktenge`). 10/10 YAML-Städte: Eintrag von `params:` nach `context:` migriert. `build:data` regeneriert `cities.ts` (10 Städte × `mietbelastungs_grenze: 1\|2`). `paramMeta40`-Eintrag entfernt, `contextMeta`-Eintrag hinzugefügt (5-stufige Skala). `build-city-data.ts`: `REQUIRED_KEYS 42 → 41`. 9 Test-Fixtures (CityContext-Typen) aktualisiert. **Hintergrund:** Original-Commit `0a53608` (Sotomo ZH-Wohnraumstudie 2025) platzierte das Feld fälschlich in `CityParams40` (Copy-Paste aus bestehendem Parameter-Pattern), obwohl die Intention ein read-only Kontextfaktor war (vergleichbar mit `marktenge`, `zuwanderungsdruck`). Der JSDoc-Hinweis "keine Steuerung" war die Wahrheit, der Code widersprach ihr. |
| Fix-10 (K5 Phase-Labels) | ✅ Done | `PHASE_NAMES`, `PHASE_YEAR_LABELS`, `PHASES` nach `phases.ts` verschoben (zusammen mit den Typen). `compute-phases.ts` importiert sie. `[1, 2, 3] as Phase[]` → `for (const phase of PHASES)`. |

**Verifikation:**

- `npx vitest run`: **104 passed, 1 skipped** (unverändert).
- `npx tsc --noEmit`: clean.

**Verbleibende Sprint-2-Risiken:**

- `groups.ts:38` und `computeGroupTrends` haben weiterhin den `modified: CityParams40` Parameter (genutzt in `computeDrivers`). Das ist nicht tot, nur nicht refactored.
- Die Sotomo-Migrations-Scripts in `scripts/{add-new-params,patch-test-fixtures}.{ts,js,py}` referenzieren noch den alten Feldnamen — historische Artefakte, nicht in der Build-Pipeline. Können in einem Audit aufgeräumt werden.

### Sprint 3: Polish (P3)

#### Fix-11: S3 — `sign`+`weight` zusammenführen
**Aufwand:** 2-3 h
**Schritte:**
1. In `phase-weights.ts` Schema umstellen auf `weights: readonly [number, number, number]` (signed).
2. Codemod oder Skript schreiben, das alle `sign:` Zeilen in den Edge-Objekten entfernt und die `weights` mit Vorzeichen versieht.
3. Formel `numerator += edge.sign * weight * delta` → `numerator += weight * delta`.
4. Tests in `dag-integrity.test.ts` (sign-Check) anpassen oder entfernen.
5. Kompatibilität mit `dag-topology` (aus Fix-4) prüfen.

#### Fix-12: S4 — `clamp` deduplizieren
**Aufwand:** 15 min
**Schritte:**
1. `src/model/utils.ts` (oder `math.ts`) neu.
2. `export function clamp(v: number, lo = -1, hi = 1): number { ... }`.
3. Alle 5 Stellen umstellen.
4. Build + Tests.

#### Fix-13: S5 — Magic-Number-Konsolidierung
**Aufwand:** 2-3 h
**Schritte:**
1. Entscheidung: Option 1 (Konstanten in `calibration.ts`) oder Option 2 (AGENTS.md lockern).
2. Falls Option 1: `src/model/calibration.ts` mit:
   - `PERSISTENCE`, `PHASE_BASE_MULTIPLIER`, `MARKT_MODULATOR_FACTOR` (aus `compute-phases.ts`)
   - `MIETBELASTUNG_SENSITIVITY` (aus `belastung.ts`)
   - `KNAPPHEIT_GEWICHTE` (aus `supply-demand.ts`)
   - `GRUPPEN_FAKTOREN` (aus `groups.ts`) — Diskussion: sind das wirklich Kalibrierung oder Modell-Design?
3. `AGENTS.md` Z. 122 präzisieren auf die getroffene Variante.

#### Fix-14: S6 — Type-Safety-Lücken schliessen
**Aufwand:** 1 h
**Schritte:**
1. `market-state.ts:11` Typ-Vereinigung aufräumen (entfällt mit Fix-3).
2. `as number` Casts in `market-state.ts:75-76` durch strenge Typen ersetzen.
3. `phase-pipeline.test.ts:50` `as never` → `as ParamsDiff40`.
4. `compute-phases.ts:134` `as Phase[]` → typisierte Konstante oder direkt `[1, 2, 3] as const`.

#### Fix-15: K2 — Test-Coverage ausbauen
**Aufwand:** 4-5 h
**Schritte:**
1. `belastung.test.ts`: Min/Mid/Max-Szenarien für `computeMieteBelastung` und `computeEigentumBelastung`. Clamp-Verhalten bei extremen E1-Werten.
2. `supply-demand.test.ts`: Gleichgewichts-Berechnung mit konkreten Inputs/Outputs verifizieren. `regulationEffective` Edge-Cases.
3. `url-helpers.test.ts`: Round-Trip `buildUrl ↔ parseUrl`. Injection-Versuche (z. B. `mietrecht_kostenmiete=99`).
4. `groups-drivers.test.ts`: `computeDrivers` mit geänderten und unveränderten Params. Top-3-Sortierung. Edge cases (keine Änderung, alle geändert).

#### Fix-16: K3 — `groups.ts:293` Ternaries auflösen
**Aufwand:** 15 min
**Schritte:**
```ts
// Vorher:
direction: delta > 0 ? (kp.direction === 'up' ? 'up' : 'down') : (kp.direction === 'up' ? 'down' : 'up'),

// Nachher:
const isPositive = delta > 0;
const effectiveDirection: 'up' | 'down' =
  isPositive === (kp.direction === 'up') ? 'up' : 'down';
direction: effectiveDirection,
```

---

## Zeit-Schätzung Total

| Sprint | Items | Aufwand |
|---|---|---|
| Sprint 1 (Korrektheit) | Fix-1, -2, -3, -4 | 4-5 h |
| Sprint 2 (Aufräumen) | Fix-5 bis -10 | 3-4 h |
| Sprint 3 (Polish) | Fix-11 bis -16 | 10-13 h |
| **Total** | 16 Items | **~17-22 h** |

Empfohlene Reihenfolge: Sprint 1 am Stück (insb. Fix-4 S1) — alles andere baut darauf auf, dass die DAG-Architektur stabil ist.

---

## Test-Plan nach jedem Fix

Nach **jedem** Fix:
```bash
npx vitest run
npx tsc --noEmit   # falls konfiguriert
```

Vor **jedem** Commit (laut AGENTS.md):
```bash
npx vitest run
```

---

## Offene Fragen an Stakeholder

1. ~~**B6 `rentner`-Vorzeichen**~~ → **erledigt.** Code ist korrekt (CH-008 ETH SPUR bestätigt). Nur Kommentar präzisieren (Fix-7b).
2. **K4 `markt_mietbelastungs_grenze`:** Kontext oder Parameter? Wirkt sich auf UI, Tests, YAML-Schema aus.
3. **S5 Magic-Number-Policy:** Soll `calibration.ts` extrahiert werden, oder AGENTS.md gelockert werden? Team-Entscheidung.
