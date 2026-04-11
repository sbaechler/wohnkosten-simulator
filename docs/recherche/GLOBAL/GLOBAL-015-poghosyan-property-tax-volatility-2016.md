---
id: "GLOBAL-015"
title: "Can Property Taxes Reduce House Price Volatility?"
authors: ["Poghosyan, T."]
year: 2016
institution: "International Monetary Fund (IMF)"
type: "working-paper"
language: "en"
url: "https://www.imf.org/external/pubs/ft/wp/2016/wp16216.pdf"
doi: "10.5089/9781513594485.001"
status: "evaluated"
dag_nodes: ["steuer_eigenmietwert", "spekulationshemmung", "markfriktion"]
dag_edges_confirmed:
  - { from: "steuer_eigenmietwert", to: "spekulationshemmung", sign: 1, note: "Höhere Steuersätze reduzieren spekulative Übertreibungen" }
  - { from: "steuer_eigenmietwert", to: "markfriktion", sign: -1, note: "0.5-5.5% Reduktion der Hauspreisvolatilität pro 0.5%-Punkt Steuersatzerhöhung" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "2005–2014"
---

## Zusammenfassung
IMF-Studie zur Rolle von Property Taxes (wiederkehrende Grundsteuer) bei der Reduktion von Hauspreisvolatilität. Nutzt US-Daten auf Bundesstaaten- und MSA-Ebene.

## Key Findings
- Eine Erhöhung der Grundsteuer um 0,5 Prozentpunkte (eine Standardabweichung) führt zu einem Rückgang der Hauspreisvolatilität um 0,5–5,5% (je nach Region)
- Kausaler Effekt: höhere Steuersätze reduzieren spekulative Übertreibungen

## Relevanz für DAG
Wichtige quantitative Evidenz für den stabilisierenden Effekt von steuer_eigenmietwert. Relevant für spekulationshemmung.

## Notizen
- IMF Working Paper WP/16/216
- USA MSAs 2005–2014
