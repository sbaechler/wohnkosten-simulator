---
id: "ES-002"
title: "Barcelona STR-Regulierung — Fallstudie"
authors: ["UCL Discovery", "Garcia-López et al. 2020"]
year: 2020
institution: "UCL / Journal of Urban Economics"
type: "peer-reviewed"
language: "en"
url: "https://discovery.ucl.ac.uk/id/eprint/10172148/1/Airbnb_JUE_2020.pdf"
doi: "10.1016/j.jue.2020.104262"
status: "evaluated"
dag_nodes: ["nutzung_kurzzeitvermietung", "nachfragedruck", "aufwertungsdruck"]
dag_edges_confirmed:
  - { from: "nutzung_kurzzeitvermietung", to: "nachfragedruck", sign: 1, note: "Airbnb erhöhte durchschnittliche Nachbarschaftsmieten um 1.9% in Barcelona" }
  - { from: "nutzung_kurzzeitvermietung", to: "aufwertungsdruck", sign: 1, note: "Kaufpreise stiegen um 4.6% durch Airbnb-Aktivität" }
dag_edges_challenged:
  - { from: "nutzung_kurzzeitvermietung", to: "nachfragedruck", note: "Strenge Regulierung hat den Mietwohnungsmarkt nicht verbessert — Hotels übernahmen nachfrageseitige Lücke" }
relevance: "high"
duplicate_of: null
regions: ["ES"]
period_covered: "2013–2019"
---

## Zusammenfassung
Fallstudie zu Barcelonas STR-Regulierung (Ley 18/2007, verschärfte Durchsetzung ab 2017/2018): Genehmigungspflicht für Touristenwohnungen. Quantifiziert Airbnb-Effekte und Evaluierung der Regulierungswirkung.

## Key Findings
- Regulierung in Barcelona war wirksam bei der Eindämmung des Airbnb-Angebots; räumlich am effektivsten im Stadtzentrum
- Airbnb erhöhte die durchschnittlichen Nachbarschaftsmieten um 1,9% und die Kaufpreise um 4,6% (Garcia-López et al., 2020)
- Durchschnittliche Mieten in Barcelona stiegen zwischen 2013 und 2019 um über 47%
- Strenge Regulierung hat den Mietwohnungsmarkt nicht verbessert — Hotels übernahmen eine nachfrageseitige Lücke

## Relevanz für DAG
Zentrale Fallstudie für nutzung_kurzzeitvermietung. Zeigt: Verdrängungseffekte (Mieten + Kaufpreise), aber Regulierung hat Mietmarkt nicht verbessert.

## Notizen
- UCL Discovery; Journal of Urban Economics (2020)
- Tourismus-induzierte Verdrängung besonders relevant für Barcelona
