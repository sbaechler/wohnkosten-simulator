---
id: "CH-009"
title: "Bautätigkeit und Verdrängung in den fünf grössten Schweizer Agglomerationen"
authors: ["Büchler, Simon", "Lutz, Elena (ETH SPUR)"]
year: 2025
institution: "ETH Zürich / BWO"
type: "government-report"
language: "de"
url: "https://www.bwo.admin.ch/de/newnsb/kCsplatEUOgb4PiiO94YG"
status: "evaluated"
dag_nodes:
  - "raumplanung_verdichtung"
  - "verdraengungsrisiko"
  - "gentrifizierungsindex"
  - "gemeinnuetzig_sozialmischung"
dag_edges_confirmed:
  - { from: "raumplanung_verdichtung", to: "verdraengungsrisiko", sign: +1, note: "Ersatzneubauten und Totalsanierungen verdrängen vor allem einkommensschwache und vulnerable Haushalte" }
  - { from: "raumplanung_verdichtung", to: "gentrifizierungsindex", sign: +1, note: "Verdichtung führt zu sozialer Aufwertung und Verdrängung in innerstädtischen Quartieren" }
relevance: "high"
duplicate_of: "CH-008"
regions: ["CH"]
cities: ["Zürich", "Genf", "Basel", "Bern", "Lausanne"]
period_covered: "2000–2023"
---

## Zusammenfassung

Detaillierte Studie des BWO in Zusammenarbeit mit ETH SPUR zur sozialen Wirkung von Verdichtung (Ersatzneubau und Sanierung) in den fünf größten Schweizer Agglomerationen. Zeigt, dass Verdichtung nicht nur mehr Wohnungen schafft, sondern auch Verdrängungseffekte auslöst.

## Key Findings

- Der Anteil von Neubauten innerhalb der bestehenden Siedlungsfläche ist in den letzten 20 Jahren stark gestiegen.
- In Basel entstanden 2020–2023 24% aller neuen Wohnungen auf früheren Industrie- und Gewerbeflächen.
- Verdrängte Personen sind überproportional einkommensschwach, älter oder haben niedrige Bildungsabschlüsse.
- Besonders betroffen sind Haushalte, die Schwierigkeiten haben, wieder bezahlbaren Wohnraum zu finden.
- In Zürich zeigt eine begleitende SPUR-Studie (2023), dass vulnerable Gruppen besonders negativ von Neubau und Wohnungsnot betroffen sind.

## Relevanz für DAG

- Wichtigste aktuelle CH-Evidenz zum Trade-off zwischen Verdichtung und sozialer Verdrängung
- Bestätigt `raumplanung_verdichtung → verdraengungsrisiko` (sign: +1)
- Unterstreicht die Notwendigkeit von `gemeinnuetzig_sozialmischung` und `nutzung_abbruchverbot` als Gegenmaßnahmen
- Stärkt den `gentrifizierungsindex` als relevanten E2-Indikator

## Notizen

- Dies ist die detailliertere Version / Begleitstudie zu CH-008
- Sehr hohe Relevanz für aktuelle Schweizer Raumplanungs- und Wohnpolitik
- Zeigt, dass Verdichtung allein ohne sozialpolitische Flankierung soziale Verdrängung verstärkt
---