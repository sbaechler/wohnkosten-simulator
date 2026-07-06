---
id: "GLOBAL-016"
title: "Transfer Taxes and Household Mobility: Distortion on the Housing or Labor Market?"
authors: ["Hilber, C."]
year: 2017
institution: "Journal of Urban Economics / ScienceDirect"
type: "peer-reviewed"
language: "en"
url: "https://www.sciencedirect.com/science/article/abs/pii/S0094119017300542"
doi: "10.1016/j.jue.2017.04.002"
status: "evaluated"
dag_nodes: ["steuer_handaenderung", "marktfriktion"]
dag_edges_confirmed:
  - { from: "steuer_handaenderung", to: "marktfriktion", sign: -1, note: "~20% Rückgang der Mobilität an der £250k Schwelle bei Eigenheimbesitzern" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "2005–2015"
---

## Zusammenfassung
Mikroökonometrische Studie zur Wirkung der UK Stamp Duty Land Tax auf Haushaltsmobilität. Regression Discontinuity Design an der £250k Schwelle.

## Key Findings
- Mobilitätsrückgang um ~20% an der £250k Schwelle bei Eigenheimbesitzern
- Lebenszyklus-bedingte Umzüge (suboptimal, schleichend) sind stärker betroffen als arbeitsmarktbedingte Umzüge (Notfall-bedingt)
- Umgehungsstrategien: Bewertungs-manipulationen

## Relevanz für DAG
Quantitative Evidenz für den negativen Effekt von steuer_handaenderung auf marktfriktion. Wichtig für die DE/CH Diskussion um Transaktionssteuern.

## Notizen
- Journal of Urban Economics, ScienceDirect
- Hilber, C. (2017)
- Nutzt SDLT Diskontinuität bei £250k als natürliches Experiment
