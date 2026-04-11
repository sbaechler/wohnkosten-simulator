---
id: "AT-002"
title: "Die preisdämpfende Wirkung des gemeinnützigen Wohnbaus"
authors: ["WIFO (Österreichisches Institut für Wirtschaftsforschung)"]
year: 2023
institution: "WIFO Wien"
type: "government-report"
language: "de"
url: "https://non-profit-housing.wifo.ac.at/doc/Studie.pdf"
doi: null
status: "evaluated"
dag_nodes:
  - "gemeinnuetzig_mindestanteil"
  - "gemeinnuetzig_foerderfonds"
  - "gemeinnuetzig_baurecht"
  - "gemeinnuetzig_kraft"
  - "mietpreis_schutzlevel"
  - "nachfragedruck"
dag_edges_confirmed:
  - { from: "gemeinnuetzig_mindestanteil", to: "mietpreis_schutzlevel", sign: +1, note: "Gemeinnütziger Wohnbau dämpft Mietpreise auch im privaten Sektor durch Konkurrenz-Effekt" }
  - { from: "gemeinnuetzig_kraft", to: "mietpreis_schutzlevel", sign: +1, note: "Grosse Gemeinnützig-Sektoren (Wien, Österreich) halten Privatmarktmieten strukturell tiefer" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["AT"]
cities: ["Wien", "Österreich allgemein"]
period_covered: "2010–2023"
---

## Zusammenfassung

WIFO-Studie zu den preisdämpfenden Effekten des österreichischen gemeinnützigen Wohnbaus.
Untersucht, wie der Gemeindebau-Sektor (Wien) und gemeinnützige Bauträger (österreichweit)
die Privatmarktmieten beeinflussen.

## Key Findings

- Gemeinnütziger Wohnbau hat nachweisbare preisdämpfende Wirkung auf den privaten Mietmarkt
- Wien: Gemeindewohnung 2023 ø **€5.10/m²** vs. Privatmarkt deutlich höher (Differenz ca. 1.72 €/m²)
- Der "Public Option"-Effekt: Private Vermieter müssen gegenüber günstigem Angebot konkurrieren
- Österreich hat höchsten Anteil gemeinnütziger Wohnungen in der EU — messbarer Stabilisierungseffekt
- Wien: 60% aller Wohnungen sind sozial gefördert oder gemeinnützig → strukturelle Marktdämpfung

## Relevanz für DAG

- Wichtigste AT/EU-Studie für `gemeinnuetzig_*`-Kanten
- `gemeinnuetzig_mindestanteil → mietpreis_schutzlevel` (sign: +1): bestätigt
- `gemeinnuetzig_kraft` als E1-Knoten: Wien zeigt, dass grosse Sektorgrösse systematische Wirkung hat
- Ergänzt AT-001 (Wien Gemeindebau Fallstudie) mit ökonomischer Analyse

## Zitate

> "Der gemeinnützige Wohnbau übt in Österreich und besonders in Wien, wo der Gemeindebaubestand eine zusätzliche Wirkung entfaltet, einen preisdämpfenden Effekt auf den Mietmarkt aus." (Studie)

## Notizen

- WIFO ist Österreichs wichtigstes Wirtschaftsforschungsinstitut (analog zu IW Köln / DIW)
- Kombination aus Gemeindebau (direkte Vermietung) und gemeinnützigen Trägern (Wohnbaugesellschaften) einzigartig in EU
- Für CH: Gemeinütziger Sektor viel kleiner — direkte Übertragbarkeit begrenzt, Mechanismus aber gleich
