---
id: "ES-003"
title: "Immigration and Housing Costs: Evidence from Spain's Post-2018 Wave"
authors: ["Fernández, Daniel", "Calvo, Santiago"]
year: 2026
institution: "Universidad de las Hespérides"
type: "working-paper"
language: "en"
url: null
pdf: null
doi: null
status: "found"
dag_nodes:
  - "ctx:zuwanderungsdruck"
  - "nachfragedruck"
  - "eigentumsquoten_trend"
dag_edges_confirmed:
  - { from: "ctx:zuwanderungsdruck", to: "nachfragedruck", sign: +1, note: "Laut Sekundärquelle 41 % (33–60 %) des realen Mietanstiegs 2018–2025 durch Zuwanderung erklärt — ungeprüft" }
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
regions: ["ES"]
period_covered: "2014–2025"
---

## Zusammenfassung

Nur aus der Sekundärquelle bekannt: Meinungsbeitrag von Rainer Zitelmann (Focus
online, 17.11.2026). Die Studie soll im Juni 2026 erschienen sein und die
Entwicklung von Mieten und Immobilienpreisen in den spanischen Provinzen 2014–2025
analysieren. Eine Websuche (2026-11-17) hat weder das Paper noch eine Seite der
Universität dazu gefunden. Status deshalb `found`, nicht `evaluated`.

## Key Findings (laut Sekundärquelle, ungeprüft)

- 2018–2025: rund **41 %** des inflationsbereinigten Mietanstiegs durch Zuwanderung
  (je nach Methode **33–60 %**)
- Kaufpreise: rund **60 %** des inflationsbereinigten Preisanstiegs

## Relevanz für DAG

- Würde `ctx:zuwanderungsdruck → nachfragedruck` (+1) stützen
- Kaufpreise stärker betroffen als Mieten → passt zu `ctx:zuwanderungsdruck → eigentumsquoten_trend` (−1)
- Ein Anteil am Anstieg ist keine Elastizität und lässt sich nicht direkt in ein
  Kantengewicht übersetzen

## Notizen

- Vor einer Nutzung Original beschaffen und Methode prüfen
- Geprüfte Alternative für Spanien: Sanchis-Guarner (2023, *Regional Science and
  Urban Economics*; IEB WP 2022/10, 2001–2012): 1 Prozentpunkt mehr Zuwanderung →
  Kaufpreise +3.3 %, Mieten +1 % (IV-Schätzung). González & Ortega (2013, *Journal of
  Regional Science*): Zuwanderung erklärt rund ein Drittel des Booms 1998–2008
- Universidad de las Hespérides ist eine private Hochschule (Kanaren); die Suche zeigt
  Bezüge zum marktliberalen Centro Ruth Richardson. Herkunft bei der Gewichtung
  berücksichtigen
