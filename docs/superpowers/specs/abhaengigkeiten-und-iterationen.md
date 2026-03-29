# Abhängigkeiten und Iterationen

Erstellt: 2026-03-29  
Basis: `dag-berechnungsmodell.md`

---

## Status Quo: Reiner DAG

Der aktuelle Graph ist ein strikter **Directed Acyclic Graph** mit drei Ebenen:

```
E0 (40 Parameter + 4 Kontext) → E1 (10 Markt-Zustandsvariablen) → E2 (5 abgeleitete Indikatoren)
```

**Regeln:**
- Alle Kanten zeigen vorwärts (E0→E1, E1→E2)
- Keine Kanten innerhalb einer Ebene
- Keine Kanten zurück (E2→E1, E1→E0, E2→E0)

**Berechnung:** Einmaliger Durchlauf, topologisch sortiert. Jeder Knoten wird genau einmal berechnet.

---

## Problem: Fehlende Rückkopplungen

In der Realität existieren ausgeprägte Rückkopplungsschleifen. Hohe Gentrifizierung verändert das Verhalten von Mietern, Investoren und Kommunen — und damit nachfolgende Markt-Zustandsvariablen.

### Reale Rückkopplungspfade (nicht modelliert)

| Pfad | Realer Mechanismus |
|------|-------------------|
| `gentrifizierungsindex` ↑ → `nachfragedruck` ↑ | Aufwertung zieht einkommensstärkere Haushalte an, verdrängte Haushalte suchen Ersatz → Nachfrage bleibt hoch |
| `gentrifizierungsindex` ↑ → `angebotspotenzial` ↑ | Sanierungswelle bringt temporär Neubau/Modernisierung |
| `gentrifizierungsindex` ↑ → `mietrecht_kuendigungsschutz` ↑ | Politische Reaktion: stärkerer Kündigungsschutz als Ventil |
| `investitionsattraktivitaet` ↓ → `angebotspotenzial` ↓ | Weniger Investoren → weniger Neubau → noch weniger Angebot |
| `angebotspotenzial` ↓ → `nachfragedruck` ↑ | Verknappung treibt Nachfragedruck weiter |
| `nachfragedruck` ↑ → `investitionsattraktivitaet` ↑ | Hohe Nachfrage macht Markt attraktiver (Margen steigen) |
| `eigentumsquoten_trend` ↑ → `nachfragedruck` ↑ | Mehr Eigentumsnachfrage (Kauf statt Miete) |
| `markfriktion` ↑ → `spekulationshemmung` ↑ | Lock-in-Effekt verstärkt objektive Spekulationshemmung weiter (Doppelzählung möglich) |
| `gemeinnuetzig_kraft` ↑ → `gentrifizierungsindex` ↓ | Bereits modelliert (E1→E2), aber der Effekt fliesst nicht zurück in E1 |
| `aufwertungsdruck` ↑ → `spekulationshemmung` ↑ | Aufwertung erhöht Anreiz für Bodenhortung — Spekulationshemmung sinkt paradoxerweise |

### Kernproblem

Ein reiner DAG kann keine **temporalen Dynamiken** abbilden: Eine Massnahme wirkt einmal, das Modell gibt ein Ergebnis. In der Realität passiert:

1. Massnahme wird umgesetzt
2. Markt reagiert (E1 ändert sich)
3. Aufgeheizter Markt löst neue Reaktionen aus (E1 reagiert erneut)
4. Politische Gegenreaktion (E0-Parameter werden angepasst)
5. → Konvergenz oder neues Gleichgewicht

---

## Analyse: Abhängigkeitsmatrix

### Bestehende Abhängigkeiten (E0 → E1 → E2)

```
E0 ─────────────────────────────────────────────────────────────────────────────
 │  ZR  VZ  AZ  BVR  BBV  BMA  BBE  BEV  BSP  BED  BES  BBV2  BNH  GMA  GFF
 │  GBR  GBV  GSO  MRK  MRA  MZT  MKU  MMI  MUV  SGG  SEW  SLA  SHA  SKP
 │  KAI  KIR  KHR  NKV  NUV  NAV  NZW  IÖV  ISK  IÖR  IWA  ZIN  ZUW  WIR  BEV
E1 ─────────────────────────────────────────────────────────────────────────────
angebotspotenzial          ← ZR(-)  VZ(+)  AZ(+)  BBV(+)  BEV(-)  BSP(-)  BED(-)
                             BES(-)  BBV2(+)  BNH(-)  GFF(+)  NAV(+)  NUV(+)
                             ZIN(-)  WIR(+)
nachfragedruck              ← ZUW(+)  WIR(+)  BEV(+)  ZIN(-)  IÖV(+)  ISK(+)
                             IÖR(+)  IWA(+)  SEW(-)  KHR(-)  KAI(-)
mietpreis_schutzlevel      ← MRK(+)  MRA(+)  MZT(+)  MMI(+)
verdraengungsrisiko         ← MKU(-)  NAV(-)  NUV(-)  BSP(+)  MUV(-)  ZUW(+)  WIR(+)
spekulationshemmung         ← SGG(+)  SHA(+)  SKP(+)  BMA(+)  BBE(+)  BBV(+)  NZW(+)
                             NKV(+)
markfriktion                ← SGG(+)  SHA(+)  SKP(+)  ZIN(+)
gemeinnuetzig_kraft         ← GMA(+)  GFF(+)  GBR(+)  BVR(+)  GBV(+)  GSO(+)
eigentumsquoten_trend       ← SEW(-)  KHR(-)  ZIN(-)  MRK(-)  ZUW(-)  WIR(+)
aufwertungsdruck            ← IÖV(+)  IWA(+)  WIR(+)  VZ(+)  AZ(+)  BBE(-)  GMA(-)
investitionsattraktivitaet ← MRK(-)  KIR(-)  SGG(-)  BMA(-)  KAI(-)  SHA(-)  WIR(+)
                             ZIN(-)
E2 ─────────────────────────────────────────────────────────────────────────────
gentrifizierungsindex       ← aufwertungsdruck(+)  (1-mietpreis_schutzlevel)(+)
                             verdraengungsrisiko(+)  (1-gemeinnuetzig_kraft)(+)
neubau_hemmnisindex         ← -angebotspotenzial
verdraengungsrisiko_index   ← verdraengungsrisiko
fiskalische_wirkung         ← spekulationshemmung(+)  (1-markfriktion)(+)  gemeinnuetzig_kraft(+)
zeit_bis_wirkung            ← strukturell aus E0-diff (keine E1-Abhängigkeit)
```

### Kann eine Änderung in L2/L3 L1 beeinflussen? (heute: Nein)

**Aktuell:** Kein Rückwärts-Edge. Wenn E2 sich ändert, bleibt E1 unberührt — für denselben Parametersatz.

**Prüfung der Frage "Ändert L3 über Iterationen L1/L2/L3?":**

| Change in | Impact on L1 | Impact on L2 | Impact on L3 |
|-----------|-------------|-------------|-------------|
| L1 (`angebotspotenzial` etc.) | — | E2 ändert sich | — |
| L2 (`gentrifizierungsindex`) | **Keiner** (heute) | — | **Keiner** (heute) |
| L3 (`fiskalische_wirkung`) | **Keiner** | — | — |

### Fehlende Rückkoppungen (potenzielle Zyklen)

Folgende Rückkoppungen wären realistisch, sind aber heute nicht modelliert:

```
gentrifizierungsindex ──┐
        ↑               │
        │               │  ← fehlende Kante: E2 → E1
nachfragedruck ────────┘
        ↑
        │
angebotspotenzial ──────┐
        ↑               │
        │               │  ← fehlende Kante: E1 → E1 (zwischen E1-Knoten)
nachfragedruck ─────────┘

investitionsattraktivitaet ──┐
        ↑                    │
        │                    │  ← fehlende Kante: E2 → E1
angebotspotenzial ───────────┘
```

---

## Entscheidung: Option C

**Option C (Zustandsautomaten/Zeitphasen) ist die gewählte Lösung** — aus folgenden Gründen:

| Kriterium | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Konvergenzprobleme | keine | möglich | keine |
| Politisch intuitiv | nein | mittel | **ja** |
| Rückkopplungen sichtbar | nein | implizit | **explizit** |
| Komplexität | tief | mittel-hoch | mittel |
| Erklärbarkeit | einfach | schwer | **einfach** |

Warum nicht B: Fixed-Point-Iteration kann oszillieren oder divergieren. Das Ergebnis ist schwer kommunizierbar ("Das Modell hat 23 Iterationen gebraucht um zu konvergieren").

Warum C: "In Phase 3 (5–10 Jahre) sind Rückkopplungen voll aktiv und der Markt hat ein neues Gleichgewicht gefunden" — das ist intuitiv und zeigt gleichzeitig die Dynamik.

---

## Schema-Design: Zwei-Zeitachsen-Problem

### Die zwei Dimensionen

Heute existieren zwei Zeit-Konzepte, die noch nicht sauber getrennt sind:

**1. `TIME_CLASS_MAP` (Parameter-Ebene, E0):** Jedem der 40 Parameter ist eine Zeitklasse zugeordnet. Diese beschreibt, wie schnell sich eine Änderung DES PARAMETERS in der Realität auswirkt.

```
raumplanung_verdichtung    → 'medium'  (1–7 Jahre bis真的有 Wirkung)
mietrecht_kuendigungsschutz → 'short'   (< 1 Jahr)
infra_oepnv                 → 'long'    (> 7 Jahre)
```

**2. `time` auf DAG_EDGES (Kanten-Ebene):** Beschreibt, wie schnell sich der Effekt einer Kante auf den Zielknoten auswirkt. Diese ist bisher **redundant** — sie entspricht meistens der Zeitklasse des Quellknotens.

```
{ from: 'bau_sanierungspflicht', to: 'angebotspotenzial', time: 'short' }
  // → redundant: sanierungspflicht hat time='short' in TIME_CLASS_MAP
  // → diese Kante wirkt kurzfristig weil ihr Input kurzfristig wirkt
```

**3. `Phase` (Komputations-Ebene):** Neu: Phasen 1/2/3 bestimmen, welche Kanten in welcher Phase aktiv sind.

### Konflikt: Warum beide?

Aktuell könnte `time` auf einer Kante und `Phase` in Konflikt geraten:

| Situation | Problem |
|-----------|---------|
| `time: 'short'` auf Kante, aber Phase = 3 | Soll die Kante noch wirken? |
| `time: 'long'` auf Kante, Phase = 1 | Soll die Kante noch gar nicht wirken? |

**Heute:** Kein Konflikt, weil alles gleichzeitig wirkt. Mit Phasen wird der Konflikt sichtbar.

### Entscheidung: `time` eliminieren, `weights[Phase]` einführen

**Vorschlag:** Das einzelne `weight`-Feld auf Kanten wird zu einem Array `weights: [number, number, number]` — eines pro Phase.

```typescript
// Statt:
interface Edge {
  from: NodeId;
  to: NodeId;
  sign: 1 | -1;
  weight: 0.5 | 1 | 1.5;  // single value
  time: TimeClass;          // jetzt redundant
}

// Neu:
interface Edge {
  from: NodeId;
  to: NodeId;
  sign: 1 | -1;
  weights: [number, number, number]; // [Phase1, Phase2, Phase3]
  // time: TimeClass;     // entfernt — redundant
}
```

**Warum?** Das Gewicht einer Kante kann in verschiedenen Phasen unterschiedlich sein:

```
Bispiel: raumplanung_verdichtung → angebotspotenzial

Phase 1 (kurzfristig):     Gewicht 0.0  (Verdichtung braucht Jahre bis Angebot wächst)
Phase 2 (mittelfristig):    Gewicht 0.7  (Planung läuft, erste Effekte)
Phase 3 (langfristig):      Gewicht 1.0  (Volle Wirkung erreicht)
```

```
Bispiel: bau_sanierungspflicht → verdraengungsrisiko

Phase 1: Gewicht 1.0  (sofort: Sanierungsankündigungen verdrängen sofort)
Phase 2: Gewicht 0.5  (teilweise umgesetzt: weniger Kündigungen nötig)
Phase 3: Gewicht 0.2  (Bestand angepasst: weniger Druck)
```

### TIME_CLASS_MAP: Entfernung

`TIME_CLASS_MAP` (bisher in `graph.ts`) wird **entfernt**. Begründung:
- Mit `weights: [Phase1, Phase2, Phase3]` ist die Zeitinformation direkt auf den Kanten
- `zeit_bis_wirkung`-Widget wird **entfernt** — nicht mehr aussagekräftig im Phasen-Modell
- Die Zeitinformation ist jetzt in den Kanten-gewichten pro Phase, nicht mehr separat

**Entfernt:**
```typescript
// graph.ts — zu entfernen
export const TIME_CLASS_MAP: Record<string, TimeClass> = { ... }
```

**Alle Widgets sind zeit-aware:** Alle Widgets zeigen den Zustand für die aktuell gewählte Phase. Es gibt kein separates "Zeit-bis-Wirkung" mehr — die Zeit ist in den Berechnungsparametern selbst.
```

### Carry-Over: Wie Phase N in Phase N+1 einfliesst

Da jeder Schritt nur vorwärts geht, wird der gesamte E1-State der vorherigen Phase als **zusätzlicher Input** in die nächste Phase gegeben. Konkret:

```typescript
// Phase 1
e1[1] = computeE1(context, params, diff, weightsPhase1, null);

// Phase 2: carryE1 = e1[1]
e1[2] = computeE1(context, params, diff, weightsPhase2, e1[1]);

// Phase 3: carryE1 = e1[2]
e1[3] = computeE1(context, params, diff, weightsPhase3, e1[2]);
```

`computeE1` verwendet `carryE1` als zusätzlichen Input — bestimmte E1-Knoten werden stärker beeinflusst durch das, was in der vorherigen Phase passiert ist. Das ist der "Feedback"-Effekt, aber ohne explizite Rückwärts-Kanten.

### Edge-Umstellung: Vorher/Nacher

**Vorher (graph.ts):**
```typescript
export interface Edge {
  from: NodeId;
  to:   NodeId;
  sign:   1 | -1;
  weight: 0.5 | 1 | 1.5;
  time:   TimeClass;
}

export const DAG_EDGES: Edge[] = [
  { from: 'raumplanung_verdichtung', to: 'angebotspotenzial', sign: +1, weight: 1.0, time: 'medium' },
  // ...
];
```

**Nachher:**
```typescript
export interface Edge {
  from: NodeId;
  to:   NodeId;
  sign: 1 | -1;
  weights: [number, number, number]; // [Phase1, Phase2, Phase3]
}

export const DAG_EDGES: Edge[] = [
  { from: 'raumplanung_verdichtung', to: 'angebotspotenzial', sign: +1, weights: [0.0, 0.7, 1.0] },
  // ...
];
```

### Berechnung: Pipeline/Iterator — nicht State Machine

Die Phasen sind **voneinander abhängig** — Phase N+1 baut auf den Ergebnissen von Phase N auf. Das ist ein **Iterator/Pipeline-Pattern**, keine State Machine.

```
Pipeline:
Phase1 ──→ Phase2 ──→ Phase3
  ↑          ↑          ↑
E1[1]      E1[2]      E1[3]
E2[1]      E2[2]      E2[3]
```

**Algorithmus (Generator-Variante):**

Der Generator dient als **orchestriertes Gedächtnis** der Berechnung. Er ermöglicht es, die zeitliche Abfolge der Phasen nicht nur als statisches Array, sondern als einen sequentiellen Prozess abzubilden, bei dem jede Phase die "Umwelt" für die nächste definiert.

```typescript
// Jede Phase liefert ein Ergebnis das in die nächste einfliesst
// Generator: yieldet nach jeder Phase, kann früh gestoppt werden

function* computePhasePipeline(
  context: CityContext,
  params: CityParams40,
  diff: ParamsDiff40,
): Generator<PhaseResult, PhaseResult[], void> {

  const phaseNames: PhaseName[] = ['kurzfristig', 'mittelfristig', 'langfristig'];
  const phaseLabels = ['0–2 Jahre', '2–5 Jahre', '5–10 Jahre'];

  const results: PhaseResult[] = [];
  let carryE1: MarketState | null = null; // Das "Gedächtnis" der Pipeline

  for (const phase of [1, 2, 3] as Phase[]) {
    // 1. INPUT-INJEKTION: 
    // Der Output der vorherigen Iteration (carryE1) wird 
    // als Basis für die aktuelle Berechnung verwendet.
    const e1 = computeE1WithPhaseAndCarry(context, params, diff, phase, carryE1);

    // 2. ABLEITUNG:
    // Basierend auf dem neuen Markt-Zustand (E1) werden die Indikatoren (E2) berechnet.
    const e2 = computeDerivedIndicators(e1, context, diff);

    // 3. STATE-TRANSITION:
    // Der aktuelle Zustand wird für die nächste Iteration "eingefroren".
    carryE1 = e1;

    const result: PhaseResult = {
      phase,
      name: phaseNames[phase - 1],
      yearsLabel: phaseLabels[phase - 1],
      marketState: e1,
      derived: e2,
      dominantParams: getDominantParamsForPhase(diff, phase),
    };

    results.push(result);
    
    // 4. EMISSION:
    // Der Generator pausiert und liefert den aktuellen Zeit-Schnitt an das UI.
    yield result; 
  }

  return results;
}
```

### Funktionsweise des Generators

Im Gegensatz zu einer klassischen Schleife oder einem Reducer bietet der Generator hier folgende Vorteile für die Modell-Logik:

1.  **Explizite Kausalität:** Durch die lokale Variable `carryE1` innerhalb des Generators wird sichergestellt, dass Phase 3 *zwingend* auf den Resultaten von Phase 2 basiert. Der Zustand wird nicht global verwaltet, sondern fliesst kontrolliert durch die Pipeline.
2.  **State-Injektion (Iteration N → N+1):** Die Funktion `computeE1WithPhaseAndCarry` fungiert als Übergabepunkt. Sie nimmt den "Ist-Zustand" vom Ende der letzten Phase und wendet darauf die neuen, phasenspezifischen Gewichte der E0-Parameter an. So wird simuliert, dass der Markt nicht bei Null anfängt, sondern auf dem Niveau der Vorperiode aufsetzt.
3.  **Zeitscheiben-Transparenz:** Jeder `yield`-Punkt repräsentiert eine stabile "Wahrheit" für diesen Zeitraum. Das UI kann so implementiert werden, dass es den Rechenfortschritt visualisiert (z.B. "Berechne Langfrist-Effekte...").
4.  **Effizienz durch Lazy-Loading:** Wenn der Nutzer nur den Schieberegler für "mittelfristig" (Phase 2) bewegt, muss der Generator nur bis zur zweiten Iteration laufen. Phase 3 wird gar nicht erst berechnet, was bei komplexeren Graphen Rechenleistung spart.

**Key-Insight:** `carryE1` fliesst in die Berechnung von `e1` der nächsten Phase ein — nicht als Rückkopplungs-Kante innerhalb eines Zeitschritts, sondern als **zeitverzögerte Abhängigkeit**. Das Modell bleibt mathematisch ein DAG (Directed Acyclic Graph), da die Abhängigkeit nur in Richtung der Zeitachse (Zukunft) verläuft.

**Im Gegensatz zu einer State Machine:**
- Keine Events, keine Transitionen
- Keine Rückwärts-Kanten — nur Vorwärts-Pipeline
- `carryE1` ist quasi ein "Carry-Over" Wert

**Generator-Vorteile:**

```typescript
// Alles auf einmal: Array spread
const all = [...computePhasePipeline(ctx, params, diff)];

// Lazy: nur bis Phase 2
const gen = computePhasePipeline(ctx, params, diff);
const phase1 = gen.next().value;
const phase2 = gen.next().value;
// Phase 3 wird NICHT berechnet

// Observability: beobachten während Berechnung
for (const phase of computePhasePipeline(ctx, params, diff)) {
  updateUI(phase); // Phase 1, dann 2, dann 3
}
```

Kein `time`-Feld mehr. Keine Redundanz. Die Phase IST die Zeitachse.

### Geklärte Fragen

| Frage | Entscheidung |
|-------|-------------|
| Null-Gewichte erlaubt? | **Ja** — `weights = [0, 0, 1]` ist valid und nötig für Kanten die erst in späteren Phasen wirken |
| `zeit_bis_wirkung`-Widget | **Entfernen** — nicht mehr aussagekräftig im Phasen-Modell |
| `TIME_CLASS_MAP` | **Entfernen** — redundant mit `weights[Phase]` |
| Alle Widgets zeit-aware? | **Ja** — alle Widgets zeigen Zustand für aktive Phase |
| Kalibrierung der Gewichte? | **Später** — via umfassende Recherche |

### Offene Fragen zur Implementierung

1. **Wie werden die 40 Kanten mit `weights` initial befüllt?** (是一次性 exhaustive Analyse nötig, oder first-pass mit合理的 Schätzungen)
2. **Welche Kanten haben `weights = [0, 0, 0]`?** (Kanten die nie wirken — sollten das ausgeschlossen werden?)
3. **`zeit_bis_wirkung` im Datenmodell entfernen:** `DerivedIndicators` und alle Referenzen in Widgets aktualisieren

---

## Optionen

### Option A: Status Quo (reiner DAG) ✅

**Pro:**
- Deterministisch, keine Konvergenzprobleme
- Einfach zu implementieren und zu verstehen
- Topologische Sortierung garantiert korrekte Berechnungsreihenfolge
- Performance: O(V + E), einmalige Berechnung

**Contra:**
- Bildet Realität nur unvollständig ab
- Keine zeitliche Dynamik möglich
- Massnahmen ohne Rückkopplungseffekte

**Geeignet für:** Prototyp, Präsentationsmodus, schnelle Exploration

---

### Option B: Zyklischer Graph mit iterativer Berechnung

**Ansatz:** Der DAG wird zum gerichteten Graphen mit möglichen Zyklen. Berechnung mittels **Fixed-Point-Iteration** bis zur Konvergenz (oder max. N Iterationen).

```
E0 ──→ E1 ──→ E2
        ↑      │
        └──────┘  (Rückkopp­lungen E2→E1)
```

**Konvergenzbedingung:**
```
|value[t] - value[t-1]| < ε  für alle Knoten
```

**Algorithmus:**

```typescript
function computeWithFeedback(
  context: CityContext,
  params: CityParams40,
  edges: Edge[],        // inkl. Rückkopplungs-Kanten
  maxIterations = 50,
  epsilon = 0.001
): { e1: MarketState; e2: DerivedIndicators; converged: boolean; iterations: number } {

  // 1. Baseline berechnen (ohne Rückkopplungen)
  const baseline = computeMarketState(context, params, params, {});

  // 2. Iterative Berechnung
  let e1Prev = { ...baseline };
  let e1Curr: MarketState;

  for (let iter = 0; iter < maxIterations; iter++) {
    // E1 aus E0 + Rückkopplung von E2 (gewichtet nach Zeitverzögerung)
    e1Curr = computeE1WithFeedback(context, params, e1Prev);

    // E2 aus aktuellem E1
    const e2Curr = computeDerived(e1Curr, context, diff);

    // Konvergenz prüfen
    const maxDelta = maxDeltaBetween(e1Prev, e1Curr);
    if (maxDelta < epsilon) {
      return { e1: e1Curr, e2: e2Curr, converged: true, iterations: iter };
    }

    e1Prev = e1Curr;
  }

  return { e1: e1Curr, e2: computeDerived(e1Curr, context, diff), converged: false, iterations: maxIterations };
}
```

**Dämpfung (Damping):** Um Oszillationen zu vermeiden:

```typescript
e1Curr = alpha * e1Curr + (1 - alpha) * e1Prev;  // alpha = 0.7 typical
```

**Pro:**
- Realistischere Modellierung von Rückkopplungen
- Zeigt dynamisches Gleichgewichtsverhalten
- Ermöglicht "wie stark reagiert der Markt?"-Analysen

**Contra:**
- Konvergenz nicht garantiert (Periodische Oszillationen möglich)
- Mehr Rechenzeit (N Iterationen statt 1)
- Komplexere Fehlerbehandlung
- Welche Rückkopplungskanten genau? Empirische Kalibrierung nötig

---

### Option C: Zustandsautomaten (Zeitphasen) ✅ (gewählt)

**Ansatz:** Explizite Modellierung von drei Zeitphasen. Pro Phase werden nur die Knoten berechnet, deren Zeitklasse in dieser Phase wirkt. Rückkopplungen werden als verzögerte Kanten modelliert, die erst in späteren Phasen aktiv werden.

```
Phase 1: kurzfristig (0–2 Jahre)
  E0 ──→ E1 ──→ E2
  Sofortige Effekte dominieren
  Rückkopplungen noch nicht aktiv

Phase 2: mittelfristig (2–5 Jahre)
  E0 ──→ E1 ──→ E2
  Erste Rückkopplungen werden spürbar
  Politische Zyklen beeinflussen Parameter

Phase 3: langfristig (5–10 Jahre)
  E0 ──→ E1 ◄── E2   (Rückkopplungen voll aktiv)
  Strukturelle Gleichgewichte erreicht
```

---

#### Datenmodell

```typescript
// phases.ts

export type Phase = 1 | 2 | 3;
export type PhaseName = 'kurzfristig' | 'mittelfristig' | 'langfristig';

interface PhaseResult {
  phase: Phase;
  name: PhaseName;
  yearsLabel: string;       // "0–2 Jahre", "2–5 Jahre", "5–10 Jahre"
  marketState: MarketState; // E1 für diese Phase
  derived: DerivedIndicators; // E2 für diese Phase
  dominantParams: string[];  // Parameter die in dieser Phase am meisten wirken
}

// Hinweis: E2 der vorherigen Phase fliesst NICHT explizit weiter.
// Stattdessen: carryE1 (der komplette E1-State) wird als Input in die nächste Phase gegeben.
// Das ist einfacher als separate FeedbackEdges und bleibt ein reiner DAG.
```

---

### Berechnungsformel: Phase-Akkumulation (Carry-Over)

Damit der Generator den Zustand korrekt von Phase zu Phase weiterträgt, muss die Funktion `computeE1WithPhaseAndCarry` eine Akkumulationslogik anwenden. Der Markt startet in einer neuen Phase nicht bei Null, sondern "erbt" den Zustand der Vorperiode.

**Formel für einen E1-Knoten in Phase $N$:**

$$V_{N} = \text{clamp}\left( V_{N-1} \cdot \text{Persistenz} + \sum (\text{E0-Effekte} \cdot \text{weights}[N]), -1, 1 \right)$$

*   **$V_{N-1}$:** Der Wert des Knotens am Ende der vorherigen Phase (aus `carryE1`). Für Phase 1 ist dieser Wert 0.
*   **Persistenz:** Ein Dämpfungsfaktor (Vorschlag: `0.8`), der definiert, wie stark der alte Zustand erhalten bleibt. Ein Wert < 1.0 erlaubt es neuen Massnahmen, alte Trends allmählich zu "überholen".
*   **Summe E0-Effekte:** Die gewichtete Summe der Änderungen der 40 Parameter, wobei nur die Gewichte der aktuellen Phase (`weights[N]`) herangezogen werden.

---

#### Berechnungslogik (Detailliert)

```typescript
// model/compute-phases.ts

/**
 * Berechnet den Markt-Zustand (E1) für eine spezifische Phase
 * unter Berücksichtigung des Zustands der Vorphase.
 */
export function computeE1WithPhaseAndCarry(
  context: CityContext,
  params: CityParams40,
  diff: ParamsDiff40,
  phase: Phase,
  carryE1: MarketState | null
): MarketState {
  const persistence = 0.8; // Faktor für die Beibehaltung des Vorzustands
  const phaseIndex = phase - 1; // 0, 1, 2
  
  const newState = { ...emptyMarketState };

  for (const nodeId of E1_NODES) {
    // 1. Erbe den Wert aus der Vorphase (Carry-Over)
    const prevValue = carryE1 ? carryE1[nodeId] : 0;
    
    // 2. Berechne die neuen Einflüsse aus E0 für diese Phase
    const currentEffects = DAG_EDGES
      .filter(edge => edge.to === nodeId)
      .reduce((sum, edge) => {
        const delta = getE0Delta(edge.from, params, diff, context);
        const weight = edge.weights[phaseIndex];
        return sum + (delta * edge.sign * weight);
      }, 0);

    // 3. Kombiniere: Alter Zustand + Neue Einflüsse
    newState[nodeId] = clamp(prevValue * persistence + currentEffects, -1, 1);
  }

  return newState;
}
```

// ── Caching ────────────────────────────────────────────────────────────────
// Generator wird bei params/diff-Änderung neu gestartet
// Cache speichert alle 3 Phase-Results

interface PhaseCache {
  paramsKey: string;        // nur params relevant für Cache-Key
  diffKey: string;
  results: PhaseResult[];    // [Phase1, Phase2, Phase3]
}

const cache = new Map<string, PhaseCache>();

function getCacheKey(params: CityParams40, diff: ParamsDiff40): string {
  return JSON.stringify({ params, diff });
}

export function computePhasesCached(
  context: CityContext,
  params: CityParams40,
  diff: ParamsDiff40,
): PhaseResult[] {
  const key = getCacheKey(params, diff);
  const cached = cache.get(key);
  if (cached) return cached.results;

  // Generator vollständig auswerten
  const results = [...computePhasePipeline(context, params, diff)];
  cache.set(key, { paramsKey: key, diffKey: key, results });
  return results;
}

// Cache leeren bei params/diff-Änderung
export function invalidateCache(): void {
  cache.clear();
}

---

#### UI-Integration: Multi-Phasen-Darstellung

Statt die Phasen nur nacheinander umzuschalten, zeigen die Widgets die zeitliche Entwicklung **simultan** oder **überlagert** an. Das macht die Dynamik (z.B. "kurzfristiger Erfolg vs. langfristiges Scheitern") sofort sichtbar.

##### 1. Trend Wohnpreise (Personas)
*   **Darstellung:** Die Liste der Personas erhält drei Status-Spalten (P1, P2, P3).
*   **Visualisierung:** Drei Pfeil-Symbole nebeneinander.
    *   `Mieter: ↗ (P1) | ↗ (P2) | → (P3)` — Zeigt, dass sich der Preisanstieg langfristig stabilisiert.

##### 2. Preis-Mengen-Diagramm (SupplyDemandChart)
*   **Darstellung:** Überlagerung von drei Kurvenpaaren.
*   **Visualisierung:**
    *   Phase 1: Kräftige Farben (Fokus).
    *   Phase 2 & 3: Zunehmend transparentere oder gestrichelte Linien.
    *   Der Schnittpunkt (Gleichgewicht) wandert sichtbar durch das Diagramm.

##### 3. Gentrifizierungsindex (Gauge)
*   **Darstellung:** Pfad-Visualisierung auf der Skala.
*   **Visualisierung:**
    *   Der aktuelle Wert (Phase 3) ist der Haupt-Marker.
    *   Zwei kleinere, halbtransparente "Ghost-Marker" oder ein verbindender Schweif zeigen die Positionen von Phase 1 und 2.

##### 4. Kompakte Indikatoren (Nachfragedruck etc.)
*   **Darstellung:** Mini-Sparkline oder Triple-Arrow.
*   **Visualisierung:** Drei kleine Pfeile unter- oder nebeneinander, um den Trendverlauf über die Zeit anzuzeigen.

##### 5. Entfernte Widgets
*   **Zeit bis Wirkung:** Dieses Widget wird ersatzlos gestrichen, da die Zeit-Dimension nun integraler Bestandteil aller anderen Widgets ist.

---

### Technisches Daten-Handling (Frontend)

Die Widgets erhalten das komplette Ergebnis des Generators (alle 3 Phasen):

```typescript
interface MultiPhaseWidgetProps {
  phases: PhaseResult[]; // [P1, P2, P3]
  activePhaseIndex: number; // Für Highlighting des aktuellen Zeitpunkts
}
```

---

#### Rückkopplungs-Visualisierung in der DAG

In der DAG-Visualisierung werden Rückkopplungskanten als gestrichelte, farbcodierte Bögen dargestellt:

```
Phase 2 aktiv (gestrichelt, dünn):
  gentrifizierungsindex ══╗
                          ║→ nachfragedruck
                          ╝

Phase 3 aktiv (gestrichelt, dick):
  investitionsattraktivitaet ═══╗
                                ║→ angebotspotenzial
  nachfragedruck ═══════════════╝
```

- Farbe: Blau = verstärkend, Orange = dämpfend
- Strichstärke: proportional zu `strength`
- Nur Kanten anzeigen deren `delay ≤ aktivePhase`

---

#### Zusammenfassung: Pro/Contra

**Pro:**
- Zeitablechnung ist explizit und nachvollziehbar
- Keine Konvergenzprobleme (keine Iteration)
- Phasen sind politisch intuitiv ("Was ist in 5 Jahren?")
- Rückkopplungen sind sichtbar und erklärbar (gestrichelte Kanten)
- Jederzeit abschnittsweise berechenbar (DAG bleibt DAG)

**Contra:**
- Phasengrenzen sind willkürlich (1 Jahr / 7 Jahre)
- Rückkopplungsstärken müssen kalibriert werden
- Zusätzliche Komplexität in `computePhases()`
- Widget muss Phase-Auswahl unterstützen

---

## Umsetzungsplan

**Step 1:** Spezifikation finalisieren (diese Datei)  
**Step 2:** `PhaseResult`-Typ + `computeE1WithPhaseAndCarry()` definieren  
**Step 3:** `computePhases()` in `model/compute-phases.ts` implementieren  
**Step 4:** UI-Komponente `ZeitphasenChart` in `widgets/`  
**Step 5:** DAG-Visualisierung erweitern (gestrichelte Rückkopplungsbögen)  
**Step 6:** Kalibrierung der `strength`-Werte (Szenariotests)

---

## Offene Fragen (Rest)

1. **Phasengrenzen:** **Entschieden: 2 Jahre / 5 Jahre / 10 Jahre** — passt zu politischen Zyklen (4 Jahre Legislatur)
2. **Default-Phase:** Welche Phase zeigt das Widget beim Laden? (Vorschlag: Phase 2 als repräsentativ)
3. **Widget-Portfolio:** Alle Widgets müssen Phase 1/2/3 unterstützen — keine Ausnahme
4. **Diff-Tracking:** Ändert sich `diff` über die Phasen? (Nein — E0 bleibt固定)
5. **Umsetzungsreihenfolge:** Mit Step 1 (Schema finalisieren) beginnen, dann Edge-Gewichte initial befüllen
