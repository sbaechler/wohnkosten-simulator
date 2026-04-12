---
id: "AU-004"
title: "The Effect of Zoning on Housing Prices"
authors: ["Kendall, Ross", "Tulip, Peter"]
year: 2018
institution: "Reserve Bank of Australia (RBA)"
type: "working-paper"
language: "en"
url: "https://www.rba.gov.au/publications/rdp/2018/2018-03.html"
doi: null
status: "evaluated"
dag_nodes: ["raumplanung_zonenreserve", "raumplanung_ausnuetzungsziffer", "angebotspotenzial", "bau_bewilligungsverfahren"]
dag_edges_confirmed: ["raumplanung_zonenreserve -> angebotspotenzial"]
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
---

## Zusammenfassung

RBA Research Discussion Paper (2018-03). Erste robuste Quantifizierung des Zonierungseffekts auf Hauspreise in Australien. Methode: Vergleich von Marktpreisen mit marginalen Angebotskosten (Konstruktionskosten + Land, das andere Eigentümer aufgeben müssten) zu verschiedenen Zeitpunkten.

## Key Findings

- Zonenregulierung erhöhte (Stand 2016) Einfamilienhauspreise um:
  - **+73 %** über Grenzkosten in Sydney
  - **+69 %** in Melbourne
  - **+42 %** in Brisbane
  - **+54 %** in Perth
- Auch Appartementpreise liegen deutlich über Grenzkosten, besonders in Sydney
- Der Zonierungseffekt hat sich über die letzten zwei Jahrzehnte **dramatisch erhöht** — wegen höherer Nachfrage bei bindenden Beschränkungen
- Betonung: Dies ist **nicht** der Preisnachlass bei vollständiger Deregulierung — Zonierung hat auch Nutzenwirkungen (öffentliche Güter, Externalitäten)

## Relevanz für DAG

- **Bestätigt sehr stark**: `raumplanung_zonenreserve → angebotspotenzial` (negativ, langfristig)
- Gewicht: sehr hoch (Elastizität implizit: Zonenlockerung könnte Preise 30–50 % reduzieren in angespannten Märkten)
- Australien als Fallstudie: zeigt, wie Raumplanung als größter Preistreiber wirken kann

## Zitate

> "We find that, as of 2016, zoning raised detached house prices 73 per cent above marginal costs in Sydney, 69 per cent in Melbourne, 42 per cent in Brisbane and 54 per cent in Perth."

> "The effect of zoning has increased dramatically over the past two decades, likely due to existing restrictions binding more tightly as demand has risen."

## Notizen

- RBA Research Discussion Paper 2018-03
- Eines der robustesten Papiere zu Zoning-Effekten weltweit
- Ergänzend: AHURI Final Report 2023 "Changed patterns of dwelling demand and supply" (AU context)
- Peter Tulip ist bekannter Wohnungsmarktforscher (später beim Centre for Independent Studies CIS)
