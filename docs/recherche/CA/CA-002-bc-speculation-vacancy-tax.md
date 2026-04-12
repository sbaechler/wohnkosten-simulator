---
id: "CA-002"
title: "British Columbia Speculation and Vacancy Tax — Fallstudie"
authors: ["BC Government", "BCREA"]
year: 2020
institution: "BC Ministry of Finance / BC Real Estate Association"
type: "government-report"
language: "en"
url: "https://news.gov.bc.ca/releases/2025FIN0047-001277"
doi: null
status: "evaluated"
dag_nodes: ["steuer_leerstandsabgabe", "kapital_auslaendische_investoren", "angebotspotenzial", "spekulationshemmung"]
dag_edges_confirmed:
  - { from: "steuer_leerstandsabgabe", to: "angebotspotenzial", sign: 1, note: "20.000 condos in Metro Vancouver zwischen 2018 und 2020 dem Mietmarkt zugeführt" }
  - { from: "steuer_leerstandsabgabe", to: "spekulationshemmung", sign: 1, note: "Geschätzte Reduktion der Hausverkäufe um zusätzliche 12.5% in steuerpflichtigen Regionen" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["CA"]
period_covered: "2018–2020"
---

## Zusammenfassung
Fallstudie zur BC Speculation and Vacancy Tax (provinzielle Steuer, eingeführt 2018): jährliche Steuer auf spekulativen Leerstand und ausländische Grundbesitzer (regionenspezifische Steuersätze 0,5%–2%). Untersucht die Wirkung auf das Mietangebot in Metro Vancouver.

## Key Findings
- Leerstandswohnungen zurück zum Markt: 20.000 condos in Metro Vancouver zwischen 2018 und 2020
- Zusätzlich zu Vancouver EHT hat die SVT das Angebot an Mietwohnungen messbar vergrössert
- Geschätzte Reduktion der Hausverkäufe in steuerpflichtigen Regionen um zusätzliche 12,5% gegenüber nicht steuerpflichtigen Regionen

## Relevanz für DAG
Ergänzt CA-001 mit Fokus auf spekulationshemmung und kapital_auslaendische_investoren. Zeigt kombinierte Wirkung von Leerstandsbesteuerung und Fremdkäufer-Steuer.

## Notizen
- BC Government News; BC Real Estate Association
- Steuer eingeführt 2018
- provincesielle Steuer zusätzlich zur kommunalen Vancouver EHT
