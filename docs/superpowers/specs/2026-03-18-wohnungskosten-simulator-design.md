# Wohnungskosten-Simulator - Design Spec

## Zweck

React SPA die den Einfluss von politischen und sozialen Faktoren auf Wohnpreise visualisiert. Zielgruppe: erwachsene Waehler und Politiker in der Schweiz. Zeigt Trends, keine exakten Zahlen. Prototyp mit vereinfachtem Berechnungsmodell (spaeter wissenschaftlich fundiert).

## Tech-Stack

- Vite + React + TypeScript
- D3.js fuer Visualisierungen
- UI-Sprache: Deutsch
- Code-Sprache: Englisch (Variablen, Kommentare wo noetig)

## Layout

Zwei-Spalten-Layout:

- **Header:** App-Titel links, Stadt-Dropdown rechts
- **Linke Spalte (280px):** Kontextfaktoren (read-only Indikatoren), dann Parameter-Slider, Reset-Button unten
- **Rechte Spalte:** Widget-Grid (2-Spalten CSS Grid):

```
[   Angebot/Nachfrage (volle Breite)    ]
[ Trend Preise    ][ Trend Nachfrage    ]
[ Trend Angebot   ][ Eigentuemerschaft  ]
```

### Parameter-Slider

- 3-Stufen-Slider (Werte 0, 1, 2) mit Snap-Verhalten
- Label oben, Hilfetext darunter (erklaert was der Parameter bedeutet)
- Beschriftete Stufen unter dem Slider (z.B. "keine / moderat / streng")
- Aktuell gewaehlter Wert wird durch fetten Text hervorgehoben
- Kein separates Tag/Badge fuer den aktuellen Wert

### Visualisierungs-Widgets (rechte Spalte)

1. **Angebot/Nachfrage-Diagramm** (volle Breite)
   - Klassisches VWL Preis/Mengen-Kreuz
   - Ist-Zustand: gestrichelte Kurven
   - Nach Aenderung: durchgezogene farbige Kurven (rot=Nachfrage, blau=Angebot)
   - Gleichgewichtspunkte alt (grau) und neu (gelb) mit Hilfslinien zu Achsen
   - Delta-Pfeile auf den Achsen zeigen Verschiebung von Preis und Menge
   - Animierter Uebergang bei Parameteraenderung

2. **Trend Wohnpreise** (halbe Breite)
   - Divergenz-Pfeile wenn sich Trends fuer verschiedene Einkommensgruppen unterscheiden
   - Geteilte Darstellung mit Trennlinie: je Gruppe ein Pfeil + Label + Gruppenname
   - Kann auch einheitlich sein wenn alle Gruppen gleich betroffen

3. **Trend Nachfrage** (halbe Breite)
   - Einzelner Trend-Pfeil mit Richtung und Label

4. **Trend Angebot** (halbe Breite)
   - Einzelner Trend-Pfeil mit Richtung und Label

5. **Eigentuemerschaft** (halbe Breite)
   - Double-Donut-Diagramm
   - Aeusserer Ring: Zustand nach Aenderung
   - Innerer Ring (transparent): Ist-Zustand
   - Kategorien: Privat, Institutionell, Genossenschaften/Stiftungen, Oeffentliche Hand

### Geplante Erweiterungs-Widgets

Weitere Analyse-Widgets basierend auf dem Wirkungsmodell sind spezifiziert in:  
→ **[widget-ideen.md](widget-ideen.md)**

Priorität 1 (sofort umsetzbar, keine neuen Daten nötig):
- **Gentrifizierungsindex** — Verdrängungsdruck im Szenario
- **Zeit bis Marktwirkung** — Aggregiertes Zeitprofil aller Parameteränderungen
- **Neubau-Hemmnisindex** — Regulatorische Bremse auf neuen Wohnraum
- **Verdrängungsrisiko** — Schutz bestehender Mieter

Priorität 2 (nächste Phase):
- Lock-in-Effekt / Marktfriktion
- Eigentumsquoten-Prognose
- Gemeinnütziger Sektor-Anteil (langfristig)
- Fiskalische Wirkung für die Stadt

### Veraenderungsdarstellung

- Diagramme: Vorher (gestrichelt/transparent) + Nachher (farbig/solid) ueberlagert
- Trends: Richtungspfeile mit Farbe (gruen=positiv, rot=negativ, gelb=stagnierend)
- Divergierende Trends: geteilte Pfeile fuer verschiedene Gruppen
- Animierte Uebergaenge wo sinnvoll (Kurvenverschiebung, Donut-Transition)

## Datenmodell

### Steuerbare Parameter (Slider, vom Nutzer veraenderbar)

```typescript
type ParamValue = 0 | 1 | 2;

interface CityParams {
  raumplanung: ParamValue;          // locker / mittel / streng
  bauvorschriften: ParamValue;      // minimal / moderat / streng
  energetischeVorgaben: ParamValue; // minimal / moderat / streng
  mietrecht: ParamValue;           // schwach / moderat / streng
  steuerpolitik: ParamValue;       // niedrig / mittel / hoch
  foerderungGemeinnuetzig: ParamValue; // keine / moderat / stark
  subventionen: ParamValue;        // keine / moderat / stark
  einspracherechte: ParamValue;    // eingeschraenkt / normal / weitreichend
  infrastruktur: ParamValue;       // kein Ausbau / moderat / stark
  auslaendischeInvestitionen: ParamValue; // offen / reguliert / restriktiv
}
```

### Kontextfaktoren (read-only, pro Stadt, nicht veraenderbar)

```typescript
type ContextValue = -2 | -1 | 0 | 1 | 2;

interface CityContext {
  zinsniveau: ContextValue;         // sehr niedrig (-2) bis sehr hoch (+2)
  zuwanderungsdruck: ContextValue;  // stark schrumpfend (-2) bis stark wachsend (+2)
  wirtschaftskraft: ContextValue;   // sehr schwach (-2) bis sehr stark (+2)
  bevoelkerungstrend: ContextValue; // stark schrumpfend (-2) bis stark wachsend (+2)
}
```

Kontextfaktoren werden im UI oberhalb der Slider als kompakte read-only Indikatoren angezeigt. Sie beeinflussen die Berechnung aller Widgets, sind aber nicht vom Nutzer veraenderbar. Sie erklaeren warum z.B. Zuerich und Lugano bei gleichen Parametern unterschiedliche Ergebnisse zeigen.

### Staedte-Konfiguration

```typescript
interface CityConfig {
  slug: string;           // "zuerich"
  name: string;           // "Zuerich"
  context: CityContext;   // Nicht veraenderbare Rahmenbedingungen
  params: CityParams;     // Ist-Zustand / Default-Werte (steuerbar)
}
```

- Gespeichert als YAML in `data/cities/switzerland.yaml`
- Build-Script (`scripts/build-city-data.ts`) konvertiert zu TypeScript/JSON, laeuft als npm pre-build Script
- Dateistruktur erlaubt spaeter weitere Laender: `data/cities/germany.yaml` etc.

Beispiel YAML:

```yaml
zuerich:
  name: "Zuerich"
  context:
    zinsniveau: -1          # niedrig
    zuwanderungsdruck: 2    # stark wachsend
    wirtschaftskraft: 2     # sehr stark
    bevoelkerungstrend: 2   # stark wachsend
  params:
    raumplanung: 2          # streng
    bauvorschriften: 2      # streng
    energetischeVorgaben: 1 # moderat
    mietrecht: 1            # moderat
    steuerpolitik: 2        # hoch
    foerderungGemeinnuetzig: 2 # stark
    subventionen: 1         # moderat
    einspracherechte: 2     # weitreichend
    infrastruktur: 2        # stark
    auslaendischeInvestitionen: 1 # reguliert (Lex Koller)
```

### State und Diff

```typescript
type ParamsDiff = Partial<Record<keyof CityParams, {
  from: ParamValue;
  to: ParamValue;
}>>;
```

- `context`: CityContext aus der Staedtekonfiguration (unveraenderlich, read-only)
- `baseline`: CityParams aus der Staedtekonfiguration (unveraenderlich)
- `modified`: CityParams nach Nutzeraenderung
- `diff`: ParamsDiff, berechnet aus baseline und modified
- Kein zentraler MarketState - jedes Widget berechnet seine Visualisierungsdaten selbst aus context, baseline, modified und diff

### URL-Routing

- Pfad: `/:citySlug` (z.B. `/zuerich`)
- Query-Parameter: nur abweichende Werte (z.B. `/zuerich?denkmalschutz=0&mietzinskontrolle=2`)
- Kein Query = Ist-Zustand der Stadt
- Kein React Router - native Browser-APIs (`window.location`, `URLSearchParams`, `popstate`)
- URL ist Single Source of Truth

## Berechnungsmodell

- Jedes Widget berechnet intern aus `context`, `baseline`, `modified` und `diff` was es fuer die Visualisierung braucht
- Prototyp: vereinfachte gewichtete Formeln
- Spaeter: wissenschaftlich fundierte Modelle, moeglicherweise mehrdimensional
- Die Berechnungslogik in den Widgets ist austauschbar ohne die State-Schicht zu aendern

### Wirkungen aller Parameter (vereinfacht, Prototyp)

**Steuerbare Parameter (bei hohem Wert):**

| Parameter | Angebot | Nachfrage | Preise | Eigentuemerschaft |
|-----------|---------|-----------|--------|-------------------|
| `raumplanung` streng | sinkt (weniger Bauland) | - | steigen | stabil |
| `bauvorschriften` streng | sinkt (hoehere Baukosten) | - | steigen | stabil |
| `energetischeVorgaben` streng | sinkt (Baukosten, Sanierung) | leicht steigt (Attraktivitaet) | steigen | stabil |
| `mietrecht` streng | sinkt langfristig (weniger Investition) | - | gedeckelt kurz, steigt lang | weniger Institutionell |
| `steuerpolitik` hoch | sinkt (weniger Investitionsanreiz) | sinkt (Wegzug) | gemischt | stabil |
| `foerderungGemeinnuetzig` stark | steigt (gefoerderter Bau) | - | sinkt (Durchschnitt) | mehr Genossenschaften/Oefftl. |
| `subventionen` stark | steigt (Anreize) | steigt (Zahlungsfaehigkeit) | gemischt | stabil |
| `einspracherechte` weitreichend | sinkt (Verzoegerungen) | - | steigen | stabil |
| `infrastruktur` stark | - | steigt (Attraktivitaet) | steigen | stabil |
| `auslaendischeInvestitionen` restriktiv | sinkt (weniger Kapital) | sinkt (weniger auslaendische Nachfrage) | sinkt | weniger Institutionell |

**Kontextfaktoren (bei hohem Wert):**

| Faktor | Angebot | Nachfrage | Preise | Eigentuemerschaft |
|--------|---------|-----------|--------|-------------------|
| `zinsniveau` hoch | sinkt | sinkt (teurere Hypotheken) | sinken | mehr Institutionell |
| `zuwanderungsdruck` hoch | - | steigt stark | steigen | stabil |
| `wirtschaftskraft` hoch | - | steigt (hoehere Einkommen) | steigen | mehr Institutionell |
| `bevoelkerungstrend` hoch | - | steigt | steigen | stabil |

## Dateistruktur

```
src/
  App.tsx                    # Layout, URL-Sync, Stadt-Routing
  types.ts                   # CityParams, CityContext, ParamValue, ContextValue, ParamsDiff

  hooks/
    useUrlState.ts           # URL <-> Params Sync (pathname + query)

  components/
    CitySelector.tsx         # Dropdown
    ContextIndicators.tsx    # Read-only Kontext-Anzeige
    ParameterPanel.tsx       # Linke Seite, rendert ParameterSlider
    ParameterSlider.tsx      # Einzelner 3-Stufen-Slider
    WidgetGrid.tsx           # Rechte Seite, Layout-Grid

  widgets/
    SupplyDemandChart.tsx    # D3 Angebot/Nachfrage mit Overlay + Animation
    TrendArrow.tsx           # Einzelner Trend-Pfeil (wiederverwendbar)
    DivergingTrend.tsx       # Divergierende Pfeile fuer Gruppen
    OwnershipDonut.tsx       # Double-Donut D3

  model/
    params.ts                # computeDiff(), hasChanges()

data/
  cities/
    switzerland.yaml         # Schweizer Staedte mit Default-Params

scripts/
  build-city-data.ts         # YAML -> TypeScript/JSON beim Build
```

## Staedte im Prototyp

2-3 Schweizer Staedte mit realistisch unterschiedlichen Ausgangswerten:
- Zuerich: strenge Raumplanung, hohe Regulierung, starker Zuwanderungsdruck, hohe Wirtschaftskraft
- Bern: moderater Mix, moderate Wirtschaftskraft
- Lugano: niedrige Steuern, weniger Regulierung, moderater Zuwanderungsdruck

## Nicht im Scope (Prototyp)

- Wissenschaftlich fundiertes Berechnungsmodell (spaeter)
- Mobile-Layout / Responsive Design
- Internationalisierung
- Persistierung von Szenarien
- Vergleich mehrerer Staedte nebeneinander
- Zeitachse / historische Daten
