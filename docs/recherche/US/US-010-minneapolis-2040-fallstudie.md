---
id: "US-010"
title: "Minneapolis 2040 Plan — Fallstudie"
authors: ["Federal Reserve Bank of Minneapolis", "Pew Charitable Trusts"]
year: 2024
institution: "Federal Reserve Bank of Minneapolis / Pew Charitable Trusts"
type: "government-report"
language: "en"
url: "https://www.minneapolisfed.org/article/2024/minneapolis-2040-plan-data-tool-prepared-to-measure-impacts"
doi: null
status: "found"
dag_nodes: ["raumplanung_ausnuetzungsziffer", "raumplanung_verdichtung", "angebotspotenzial", "aufwertungsdruck"]
dag_edges_confirmed:
  - { from: "raumplanung_ausnuetzungsziffer", to: "angebotspotenzial", sign: 1, note: "2019: Rekordzahl 4.800 genehmigte Wohneinheiten vs. Ø 3.000 in den 3 Jahren davor" }
  - { from: "raumplanung_ausnuetzungsziffer", to: "aufwertungsdruck", sign: 1, note: "Property Values stiegen um 3-5% in einem 3-km-Radius um upgezonte Gebiete" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["US"]
period_covered: "2018–2025"
---

## Zusammenfassung
Fallstudie zur Abschaffung von Single-Family-Only Zonierung cityweit in Minneapolis (erste US-Stadt). Quantitative Daten zu Baugenehmigungen, Property Values und 5-Jahres-Mietpreiseffekten.

## Key Findings
- 2019: Rekordzahl von 4.800 genehmigten Wohneinheiten (vs. Ø 3.000 in den 3 Jahren davor)
- Property Values stiegen um 3–5% in einem 3-km-Radius um upgezonte Gebiete (Kuhlmann-Studie)
- 5 Jahre post-reform: Home prices 16–34% lower, rents 17.5–34% lower vs. Kontrafakt
- Anmerkung: Nur ~20 neue Duplexes/Triplexes in ehemaligen SFZ-Gebieten gebaut in den ersten Jahren — langfristige Effekte noch nicht vollständig sichtbar

## Relevanz für DAG
Zentrale Fallstudie für raumplanung_verdichtung. Zeigt sowohl den Optionswert-Effekt (kurzfristig höhere Property Values) als auch den langfristigen Angebotseffekt.

## Notizen
- Erste major US-Stadt mit cityweiter Abschaffung von Single-Family Zoning
- Umstritten — American Experiment kritisiert die Studie (andere Kausalattribution)
