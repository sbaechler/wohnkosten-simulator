---
id: "GLOBAL-012"
title: "Rent control effects through the lens of empirical research: An almost complete review of the literature"
authors: ["Kholodilin, Konstantin A."]
year: 2024
institution: "Journal of Housing Economics"
type: "meta-study"
language: "en"
url: "https://www.sciencedirect.com/science/article/pii/S1051137724000020"
doi: "10.1016/j.jhe.2024.101896"
status: "evaluated"
dag_nodes: ["mietrecht_kuendigungsschutz", "mietrecht_anfangsmiete", "angebotspotenzial", "verdraengungsrisiko"]
dag_edges_confirmed:
  - { from: "mietrecht_anfangsmiete", to: "angebotspotenzial", sign: -1, note: "Konsistent rückläufiges Mietangebot (besonders bei kleinen Vermietern)" }
  - { from: "mietrecht_anfangsmiete", to: "nachfragedruck", sign: 1, note: "Mieten im nicht-regulierten Sektor steigen als indirekte Folge (Spillover-Effekte)" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "1967–2023"
---

## Zusammenfassung
Meta-Review über 112 empirische Rent-Control-Studien von 1967–2023. Konsolidiert die Evidenz zu Mietpreiseffekten, Angebotswirkungen, Mobilitätseffekten und Gentrifizierungseffekten. Vermutlich umfangreichste Literaturübersicht zu diesem Thema.

## Key Findings
- Mietpreise im regulierten Sektor: Konsistent niedriger als ohne Regulierung
- Mietangebot: Konsistent rückläufig (besonders bei kleinen Vermietern, die auf Investition verzichten)
- Mieten im nicht-regulierten Sektor: Steigen als indirekte Folge (Spillover-Effekte)
- Mobilität (Fluktuation): Deutlich reduziert für geschützte Mieter
- Gentrifizierung: Indirekte Effekte durch Angebotsverknappung in angrenzenden Gebieten
- Neubauaktivität: Negativer Zusammenhang mit strenger Mietregulierung

## Relevanz für DAG
Fundamentale Meta-Studie für den gesamten DAG-Bereich Mietrecht. Bestätigt die meisten angenommenen Wirkungsrichtungen.

## Notizen
- Journal of Housing Economics (2024)
- Review of Economics and Statistics-konkurrierender Artikel
- 112 Studien, 1967–2023
