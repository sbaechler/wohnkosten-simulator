---
id: "GLOBAL-004"
title: "The Impact of Zoning on Housing Affordability"
authors: ["Glaeser, Edward L.", "Gyourko, Joseph"]
year: 2002
institution: "NBER / Harvard University"
type: "working-paper"
language: "en"
url: "https://www.nber.org/system/files/working_papers/w8835/w8835.pdf"
doi: null
nber_wp: "w8835"
status: "evaluated"
dag_nodes:
  - "raumplanung_zonenreserve"
  - "raumplanung_verdichtung"
  - "raumplanung_ausnuetzungsziffer"
  - "bau_bewilligungsverfahren"
  - "angebotspotenzial"
  - "neubau_hemmnisindex"
dag_edges_confirmed:
  - { from: "raumplanung_zonenreserve", to: "angebotspotenzial", sign: -1, note: "Zoning reduziert Angebot, hebt Preise über Konstruktionskosten" }
  - { from: "raumplanung_verdichtung", to: "angebotspotenzial", sign: +1, note: "Höhere erlaubte Dichte = mehr Angebot" }
  - { from: "bau_bewilligungsverfahren", to: "angebotspotenzial", sign: +1, note: "Vereinfachte Bewilligungen erhöhen Neubauvolumen" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["US"]
period_covered: "1990–2000"
---

## Zusammenfassung

Seminalarbeit von Glaeser & Gyourko, die zeigt, dass Zonierungsrestriktionen in US-amerikanischen Städten
die Wohnpreise erheblich über die reinen Konstruktionskosten hinaustreiben. Begründet das Konzept des
"Zoning Tax" — der impliziten Steuer durch regulatorische Restriktionen.

## Key Findings

- In regulierten Städten liegen Wohnpreise um 20–50% über den reinen Konstruktionskosten — die Differenz ist der "Zoning Tax"
- Manhattan: Wohnungspreise ca. 50% über Konstruktionskosten durch Zonierungsrestriktionen
- Enge Korrelation zwischen regulatorischer Restriktivität und Preisniveau
- In unregulierten Märkten (z.B. Houston) nähern sich Preise den Konstruktionskosten an
- Effekt ist am stärksten in Gebieten mit hohem Nachfragedruck (dichte Städte)

## Relevanz für DAG

- Grundlagenreferenz für alle `raumplanung_*`-Kanten im DAG
- Bestätigt `raumplanung_zonenreserve → angebotspotenzial` (sign: -1) mit starker Evidenz
- Begründet `neubau_hemmnisindex` als abgeleiteten Indikator (E2)
- Für Schweiz: Restriktive Raumplanung = direkter Preistreiber, besonders in Metropolitanregionen

## Zitate

> "Zoning and other land use controls are a significant determinant of the gap between housing prices and construction costs." (S. 1)

> "The 'regulatory tax' on new construction explains much of the premium that high-cost areas charge relative to construction costs." (S. 22)

## Notizen

- Folgestudie: Gyourko et al. (2013) — "Superstar Cities"
- Hsieh & Moretti (2019): Quantifiziert gesamtwirtschaftliche Kosten von Zonierungsrestriktionen (GDP-Verlust)
- Saiz (2010): Ergänzt mit geografischen Restriktionen als natürlicher Supply-Begrenzung
- Für CH: Verdichtungsgebot in RPG/RPV ist direkte Policy-Antwort auf diesen Mechanismus
