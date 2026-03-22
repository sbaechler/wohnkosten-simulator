# Open Questions — Wohnkosten-Simulator V2

## 1. Gewichtung der DAG-Kanten
**Status:** Offen  
Die Kantengewichte (0.5/1.0/1.5) in `DAG_EDGES` basieren auf Expertenurteil. Eine empirische Kalibrierung (z.B. mit realen Mietpreisdaten aus 2010–2025) wäre wünschenswert, ist aber ausserhalb des Prototyp-Scopes.

## 2. Kontextfaktor-Gewichtung in E1-Aggregation
**Status:** Offen  
Die Kontextfaktoren (`ctx:*`) werden aktuell mit dem gleichen Normalisierungsschema wie Parameter-Diffs verarbeitet. Frage: Soll die Gewichtung der Kontextfaktoren separat kalibriert werden (z.B. Zinsniveau hat stärkeren Effekt als in DAG modelliert)?

## 3. E2-Formelgewichte (gentrifizierungsindex, fiskalische_wirkung)
**Status:** Offen  
Die E2-Formeln in `derived.ts` verwenden Gewichte wie 1.5/1.0/1.0, die noch nicht empirisch validiert sind. Diese sollten bei Verfügbarkeit von Indikatordaten kalibriert werden.

## 4. Migration der existierenden URL-Parameter
**Status:** Gelöst (Default = 1)  
Die 33 neuen Parameter ohne V1-Mapping erhalten bei der Migration den Default-Wert 1. Frage: Ist das für alle Städte ein realistischer Baseline? Allenfalls für Zürich (mit starkem Genossenschaftssektor) die Werte für `gemeinnuetzig_*` auf 2 setzen.

## 5. `zeit_bis_wirkung` — Zeitprofil-Gewichtung
**Status:** Offen  
Die dominante Zeitklasse wird aktuell durch einfaches Zählen der geänderten Parameter pro Klasse ermittelt. Alternative: gewichtetes Mittel der Zeitklassen (z.B. short=1, medium=4, long=10 Jahre), gewichtet nach der Summe der Kanten-Gewichte der geänderten Parameter.

## 6. Rückwärtskompatibilität der Widget-Interfaces
**Status:** Erledigt  
Die Widgets `SupplyDemandChart` und `OwnershipDonut` wurden auf `CityParams40` migriert. Die alten V1-Interfaces (`CityParams`) werden nicht mehr verwendet.

## 7. Graph-Typsicherheit
**Status:** Erledigt ( partiell )  
Die TypeScript-Kompilierzeitprüfung in `graph.ts` (`_AssertAllParamKeys`) validiert, dass alle `CityParams40`-Keys im Graph vorkommen. Eine vollständige bidirektionale Prüfung (jeder Edge `from` muss ein bekannter NodeId sein) erfordert ein TypeScript-Plugin oder eine explicit Assertion pro Edge.

## 8. Performance
**Status:** Monitoring  
`computeMarketState` und `computeDerivedIndicators` werden bei jedem Render aufgerufen. Für die Prototyp-Grösse ist das unproblematisch; bei >1000 Parametern oder Echtzeit-Animationen sollte ein `useMemo` mit den richtigen Deps im WidgetGrid eingesetzt werden.
