---
id: "US-003"
title: "Short-term rentals and the housing market: Quasi-experimental evidence from Airbnb in Los Angeles"
authors: ["Horn, Keren", "Merante, Mark"]
year: 2021
institution: "Journal of Housing Economics"
type: "peer-reviewed"
language: "en"
url: "https://www.sciencedirect.com/science/article/pii/S0094119021000383"
doi: "10.1016/j.jhe.2021.101753"
status: "evaluated"
dag_nodes:
  - "nutzung_kurzzeitvermietung"
  - "angebotspotenzial"
  - "nachfragedruck"
dag_edges_confirmed:
  - { from: "nutzung_kurzzeitvermietung", to: "angebotspotenzial", sign: -1, note: "Airbnb-Regulierung reduziert STR-Angebot; Umkehreffekt +2% Renten, +2% Preise" }
  - { from: "nutzung_kurzzeitvermietung", to: "nachfragedruck", sign: +1, note: "STR-Boom zieht Wohneinheiten aus Mietmarkt → erhöht Nachfragedruck auf verbleibendes Angebot" }
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
regions: ["US"]
city: "Los Angeles"
period_covered: "2014–2019"
---

## Zusammenfassung

Quasi-experimentelle Studie zur Wirkung von Airbnb-Regulierungseinführung in Los Angeles.
Nutzt Difference-in-Differences-Design mit der LA-Regulierung 2019 als natürlichem Experiment.

## Key Findings

- Airbnb-Boom erhöht Mieten um ca. 2% und Kaufpreise um ca. 2% in betroffenen Stadtvierteln
- Regulierung (Einschränkung auf Hauptwohnsitz) reduziert diese Effekte signifikant
- Einheiten verlassen Mietmarkt zur STR-Nutzung → Angebotsreduktion ist Hauptmechanismus
- Effekte konzentriert in touristisch attraktiven Stadtvierteln (nicht flächendeckend)

## Relevanz für DAG

- `nutzung_kurzzeitvermietung → angebotspotenzial` (sign: -1): STR-Nutzung entzieht Wohneinheiten dem Dauermarkt
- Effekte moderat (2%), aber lokal konzentriert
- Regulierung wirkt: Einschränkung auf Hauptwohnsitz reduziert Effekte auf nahezu 0

## Zitate

> "Airbnb reduces rental housing supply by converting long-term rentals to short-term rentals, raising rents by 2% and prices by 2%." (Abstract)

## Notizen

- Ergänzung: Wharton-Studie (Proserpio, 2019) findet keine Gesamtangebots-Änderung, nur Reallokation
- Unterschied zu CH: Schweizer Kurzzeitmietmarkt kleiner als LA, aber Effekt in Tourismusgemeinden relevant
- Schweizer Studie zu Airbnb: noch zu finden
