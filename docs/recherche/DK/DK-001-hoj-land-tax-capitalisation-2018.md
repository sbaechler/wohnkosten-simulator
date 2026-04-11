---
id: "DK-001"
title: "Land Tax Changes and Full Capitalisation"
authors: ["Høj, A.K."]
year: 2018
institution: "Fiscal Studies / Wiley"
type: "peer-reviewed"
language: "en"
url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/1475-5890.12163"
doi: "10.1111/1475-5890.12163"
status: "evaluated"
dag_nodes: ["steuer_eigenmietwert", "boden_bodeneigentumssteuer", "spekulationshemmung"]
dag_edges_confirmed:
  - { from: "steuer_eigenmietwert", to: "spekulationshemmung", sign: 1, note: "Vollständige Kapitalisierung zukünftiger Steuerzahlungen in Grundstückspreise" }
  - { from: "steuer_eigenmietwert", to: "nachfragedruck", sign: -1, note: "Bodensteuererhöhungen werden vollständig in niedrigeren Bodenpreisen reflektiert, nicht an Mieter weitergegeben" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["DK"]
period_covered: "2007–2017"
---

## Zusammenfassung
Studie zur dänischen Bodenwertsteuer auf Basis der Kommunalreform 2007: Änderung der Steuersätze für 237 von 270 Gemeinden (75% aller dänischen Eigenheime). Zeigt vollständige Kapitalisierung des Barwerts zukünftiger Steuern in Bodenpreise.

## Key Findings
- Vollständige Kapitalisierung: Steuersenkungen → höhere Bodenpreise, Steuererhöhungen → niedrigere Bodenpreise
- Mieter werden nicht belastet – Effekt vollständig beim Bodeneigentümer
- Magnitude entspricht PV zukünftiger Steueränderungen bei Diskontsatz ~2,3%
- Keine messbaren Verzerrungseffekte auf Allokation oder Entwicklung

## Relevanz für DAG
Zentrale Studie für steuer_eigenmietwert und boden_bodeneigentumssteuer. Zeigt: LVT wird vollständig kapitalisiert, Mieter werden nicht belastet.

## Notizen
- Fiscal Studies, Wiley (2018)
- DORS Working Paper (2017) als Vorversion
- Kommunalreform 2007 als natürliches Experiment
