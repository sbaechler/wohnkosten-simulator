---
id: "GLOBAL-018"
title: "House Prices and Immovable Property Taxes: Evidence from OECD Countries"
authors: ["Caldera Sánchez, A.", "Johansson, Å."]
year: 2016
institution: "OECD / CSEF Working Paper No. 444"
type: "working-paper"
language: "en"
url: "https://www.csef.it/WP/wp444.pdf"
doi: null
status: "found"
dag_nodes: ["steuer_eigenmietwert", "nachfragedruck"]
dag_edges_confirmed:
  - { from: "steuer_eigenmietwert", to: "nachfragedruck", sign: -1, note: "Negative Beziehung zwischen Immobiliensteuern und Hauspreisen, robust gegenüber Kontrolle für andere zyklische Determinanten" }
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "1970–2014"
---

## Zusammenfassung
OECD-Studie (34 Länder, 1970–2014) zur Beziehung zwischen wiederkehrenden Immobiliensteuern und Hauspreisen. Panel-Daten-Analyse.

## Key Findings
- Negative Beziehung zwischen Immobiliensteuern und Hauspreisen
- Robust gegenüber Kontrolle für andere zyklische Determinanten, Länder- und Jahres-Fixed Effects
- Kein stabilisierender Effekt auf die Variabilität der Hauspreise gefunden (Preisaufschwünge werden nicht gedämpft)

## Relevanz für DAG
Internationale Querschnittsevizenz für den Preiseffekt von steuer_eigenmietwert.

## Notizen
- CSEF Working Paper No. 444 (2016)
- 34 OECD-Länder, 1970–2014
