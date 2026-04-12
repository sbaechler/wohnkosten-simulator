---
id: "KR-001"
title: "Housing Policy in the Republic of Korea"
authors: ["Kim, Kyung-Hwan", "Park, Miseon"]
year: 2016
institution: "Asian Development Bank Institute (ADBI)"
type: "working-paper"
language: "en"
url: "https://www.adb.org/sites/default/files/publication/183281/adbi-wp570.pdf"
status: "evaluated"
dag_nodes:
  - "ctx:zinsniveau"
  - "kapital_hypothekarregulierung"
  - "gemeinnuetzig_foerderfonds"
  - "boden_bodeneigentumssteuer"
  - "nachfragedruck"
dag_edges_confirmed:
  - { from: "ctx:zinsniveau", to: "nachfragedruck", sign: -1, note: "Niedrige Zinsen und staatliche Kreditprogramme haben Nachfrage stark angeheizt (ähnlich wie in Japan)" }
  - { from: "gemeinnuetzig_foerderfonds", to: "gemeinnuetzig_kraft", sign: +1, note: "Öffentlicher Wohnungsbau und Chonsei-System spielen große Rolle" }
relevance: "high"
duplicate_of: null
regions: ["KR"]
period_covered: "1960–2015"
---

## Zusammenfassung

Umfassender Überblick über die südkoreanische Wohnungspolitik seit den 1960er Jahren, inklusive der starken staatlichen Interventionen, des Chonsei-Systems, des öffentlichen Wohnungsbaus und der Auswirkungen der wirtschaftlichen Entwicklung.

## Key Findings

- Starke staatliche Steuerung des Wohnungsmarkts über Kreditprogramme, Preisregulierungen und öffentlichen Wohnungsbau.
- Das Chonsei-System (Kaution statt monatlicher Miete) ist ein einzigartiges koreanisches Feature mit hoher Bedeutung für die Finanzierung von Wohneigentum.
- Regierung hat in den 1970er–1990er Jahren massiv in öffentlichen Wohnungsbau investiert, um den schnellen Urbanisierungsdruck zu bewältigen.
- Nach dem Bubble-ähnlichen Anstieg in den 1980er Jahren kamen Preisregulierungen und weitere Interventionen.

## Relevanz für DAG

- Gute Evidenz für `kapital_hypothekarregulierung` und `ctx:zinsniveau` als starke Treiber.
- Zeigt Wirkung von `gemeinnuetzig_foerderfonds` in einem asiatischen Kontext.
- Ergänzt die Japan-Studien (ähnliche Entwicklungs- und Bubble-Dynamik in Ostasien).

## Notizen

- Wichtiger Baustein, um die bisher leere KR-Region zu füllen.
- Das koreanische Modell (starke staatliche Rolle + Chonsei) ist international relativ einzigartig und liefert interessante Vergleichsdatenpunkte.
---