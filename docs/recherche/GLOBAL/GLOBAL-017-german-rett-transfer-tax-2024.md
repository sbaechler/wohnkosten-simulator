---
id: "GLOBAL-017"
title: "Who Bears the Burden of Real Estate Transfer Taxes? Evidence from the German Housing Market"
authors: ["Journal of Urban Economics"]
year: 2024
institution: "CESifo / Journal of Urban Economics"
type: "peer-reviewed"
language: "en"
url: "https://www.sciencedirect.com/science/article/abs/pii/S0094119024000871"
doi: "10.1016/j.jue.2024.104864"
status: "evaluated"
dag_nodes: ["steuer_handaenderung", "markfriktion", "nachfragedruck"]
dag_edges_confirmed:
  - { from: "steuer_handaenderung", to: "nachfragedruck", sign: -1, note: "Steuersatzerhöhung um 1 Prozentpunkt reduziert Immobilienpreise um ~3% im Durchschnitt" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "2005–2019"
---

## Zusammenfassung
Grossflächige Studie zur German Grunderwerbsteuer (Real Estate Transfer Tax): Steuersatz-Anhebungen variieren nach deutschem Bundesland. Nutzt ~17 Mio. Grundstücke und Difference-in-Differences über 16 Bundesländer.

## Key Findings
- Eine Erhöhung des Steuersatzes um 1 Prozentpunkt reduziert Immobilienpreise um ~3% im Durchschnitt ein Jahr nach der Reform
- Last trägt überwiegend den Verkäufer
- Transaktionsvolumen sinkt
- Lock-in Effekt: Eigentümer bleiben länger in Immobilien
- Büroimmobilien: Transaktionen -0,41%, Preise -0,22% pro 1%-Punkt Erhöhung

## Relevanz für DAG
Zentrale Evidenz für die Wirkung von steuer_handaenderung auf nachfragedruck und markfriktion. Deutschland-spezifisch, aber auf CH/AT übertragbar.

## Notizen
- Journal of Urban Economics, 2024 (CESifo Working Paper)
- 17 Mio. Grundstücke, 16 Bundesländer, 2005–2019
