---
id: "JP-001"
title: "The Housing Market and Housing Policies in Japan"
authors: ["Hirayama, Yosuke", "Izuhara, Misa"]
year: 2016
institution: "Asian Development Bank Institute (ADBI)"
type: "working-paper"
language: "en"
url: "https://www.adb.org/sites/default/files/publication/181404/adbi-wp558.pdf"
status: "evaluated"
dag_nodes:
  - "ctx:zinsniveau"
  - "kapital_hypothekarregulierung"
  - "boden_bodeneigentumssteuer"
  - "gemeinnuetzig_foerderfonds"
  - "nachfragedruck"
dag_edges_confirmed:
  - { from: "ctx:zinsniveau", to: "nachfragedruck", sign: -1, note: "Sehr niedrige Zinsen in den 1980ern haben die Bubble massiv angeheizt" }
  - { from: "kapital_hypothekarregulierung", to: "nachfragedruck", sign: -1, note: "Staatliche Kreditprogramme (GHLC) haben Nachfrage stark beeinflusst" }
relevance: "high"
duplicate_of: null
regions: ["JP"]
period_covered: "1950–2015"
---

## Zusammenfassung

Umfassender Überblick über die japanische Wohnungspolitik seit dem Zweiten Weltkrieg, den Housing Bubble der späten 1980er, den anschließenden Kollaps und die langfristigen Auswirkungen auf Markt, Politik und Demographie.

## Key Findings

- Die japanische Regierung hat über die Government Housing Loan Corporation (GHLC) massiv günstige Kredite vergeben — besonders in den 1970er–1980er Jahren.
- Der Bubble (späte 1980er) wurde durch extrem niedrige Zinsen, lockere Kreditvergabe und Spekulation angeheizt.
- Nach dem Platzen der Bubble (frühe 1990er) kam es zu langanhaltender Deflation, sinkendem Vertrauen und "Lost Decades".
- Japan hat ein starkes Public Housing System (UR und lokale Körperschaften), das jedoch nicht so dominant ist wie in Wien oder Singapur.
- Demographischer Wandel (Schrumpfung, Alterung) wird zum dominanten Faktor für zukünftige Wohnungsnachfrage.

## Relevanz für DAG

- Sehr gute Evidenz für `ctx:zinsniveau` als starken Treiber von Nachfrage und Blasenbildung.
- Zeigt Wirkung von `kapital_hypothekarregulierung` (staatliche Kreditprogramme).
- Relevant für `boden_bodeneigentumssteuer` und langfristige Spekulationsdynamik.
- Japan ist ein extremes Beispiel für die langfristigen Folgen einer geplatzten Immobilienblase.

## Notizen

- Wichtige Ergänzung für die leere JP-Region.
- Sehr gut geeignet, um langfristige Effekte von Zins- und Kreditpolitik zu illustrieren.
- Ergänzt die Brookings-Analyse von Jiro Yoshida.
---