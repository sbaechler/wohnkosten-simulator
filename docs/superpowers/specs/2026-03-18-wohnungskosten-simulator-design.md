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

- **Header:** App-Titel links, Stadt-Dropdown rechts, **Graph-Toggle** links des Dropdowns
- **Linke Spalte (280px):** Kontextfaktoren (read-only Indikatoren), dann Parameter-Slider, Reset-Button unten
- **Rechte Spalte:** Widget-Grid (2-Spalten CSS Grid) **oder** DAG-Visualisierung (per Toggle umschaltbar)

### Bevölkerungsgruppen (fest)

Ab sofort werden Effekte nach folgenden **8 festen Bevölkerungsgruppen** aufgeschlüsselt:

- **Geringverdiener** — Tiefe Einkommen, oft auf Sozialhilfe oder stark geförderte Wohnungen angewiesen
- **Normalverdiener Mieter** — Mittleres Einkommen, auf dem freien Mietmarkt
- **Glückspilze** — Mieter mit stark subventionierter/preisgebundener Wohnung (z.B. über Mindestanteil oder Genossenschaftslos)
- **Normalverdiener Eigentümer** — Mittleres Einkommen mit Hypothek
- **Junge Familien** — Haushalte mit Kindern in der Familiengründungsphase
- **Genossenschafter** — Mitglieder von Wohnbaugenossenschaften
- **Rentner** — Pensionierte mit meist fixem Einkommen
- **High Earner / Professionals** — Gut bis sehr gut verdienende Haushalte

**Granularitätsregel:** Effekte sollen granular pro Gruppe dargestellt werden, **dort wo eine Aufsplittung Sinn macht** (z. B. Preistrend, Verdrängungsrisiko). Bei Indikatoren wie allgemeiner Nachfrage kann eine aggregierte Darstellung ausreichen.

### Parameter-Slider

- 3-Stufen-Slider (Werte 0, 1, 2) mit Snap-Verhalten
- Label oben, Hilfetext darunter (erklaert was der Parameter bedeutet)
- Beschriftete Stufen unter dem Slider (z.B. "keine / moderat / streng")
- Aktuell gewaehlter Wert wird durch fetten Text hervorgehoben

### Visualisierungs-Widgets (rechte Spalte)

1. **Angebot/Nachfrage-Diagramm** (volle Breite)
   - Klassisches VWL Preis/Mengen-Kreuz
   - Ist-Zustand: gestrichelte Kurven
   - Nach Aenderung: durchgezogene farbige Kurven (rot=Nachfrage, blau=Angebot)
   - Gleichgewichtspunkte alt (grau) und neu (gelb) mit Hilfslinien zu Achsen
   - Delta-Pfeile auf den Achsen zeigen Verschiebung von Preis und Menge
   - Animierter Uebergang bei Parameteraenderung

2. **Trend Wohnpreise** (halbe Breite) — **überarbeitet**
   - Zeigt Preistrends **pro Bevölkerungsgruppe** (8 Gruppen)
   - Erweiterte DivergingTrend-Komponente mit mehreren Gruppen
   - Je Gruppe: Pfeil + Label + Gruppenname + Preiseffekt
   - Granularität: stark unterschiedliche Effekte pro Gruppe sind explizit darstellbar

3. **Trend Nachfrage** (halbe Breite)
   - Einzelner Trend-Pfeil mit Richtung und Label (kann aggregiert bleiben)

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
- Divergierende Trends: **pro Bevölkerungsgruppe** (nicht nur 2 Gruppen)
- Animierte Uebergaenge wo sinnvoll (Kurvenverschiebung, Donut-Transition)

## Datenmodell

*(unverändert — siehe unten)*

## DAG-Visualisierung

Die DAG-Visualisierung soll zukünftig auch die Auswirkungen auf die definierten Bevölkerungsgruppen darstellen können (z. B. durch zusätzliche Knoten oder eine "Impact on Groups"-Schicht). Dies wird in einem späteren Schritt detailliert spezifiziert.

*(Rest der Datei bleibt unverändert)*
