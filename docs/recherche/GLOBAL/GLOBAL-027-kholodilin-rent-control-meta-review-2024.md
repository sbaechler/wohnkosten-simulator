---
id: "GLOBAL-027"
title: "Rent Control Effects through the Lens of Empirical Research: An Almost Complete Review of the Literature"
authors: ["Kholodilin, Konstantin A."]
year: 2024
institution: "DIW Berlin / Journal of Housing Economics"
type: "meta-study"
language: "en"
url: "https://www.sciencedirect.com/science/article/pii/S1051137724000020"
doi: "10.1016/j.jhe.2024.101983"
status: "evaluated"
dag_nodes:
  - "mietrecht_kostenmiete"
  - "mietrecht_kuendigungsschutz"
  - "mietpreis_schutzlevel"
  - "verdraengungsrisiko"
  - "angebotspotenzial"
dag_edges_confirmed:
  - { from: "mietrecht_kuendigungsschutz", to: "mietpreis_schutzlevel", sign: +1, note: "Konsens: Senkt Mieten im regulierten Sektor" }
  - { from: "mietrecht_kuendigungsschutz", to: "angebotspotenzial", sign: -1, note: "Konsens: Reduziert Wohnungsangebot langfristig" }
  - { from: "mietrecht_kuendigungsschutz", to: "verdraengungsrisiko", sign: -1, note: "Reduziert Mobilität und Verdrängung für Bestandsmieter" }
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "1967–2023"
studies_reviewed: 112
---

## Zusammenfassung

Umfassendste Meta-Review zu Rent Control (112 Studien, 1967–2023). Fasst den empirischen Konsens zusammen.

## Key Findings

- **Konsens über 50+ Jahre Forschung:**
  - Mieten im regulierten Sektor sinken
  - Gesamtangebot an Mietwohnungen nimmt ab (besonders bei kleinen Vermietern)
  - Mieten im unregulierten Sektor steigen (Spillover)
  - Mobilität der geschützten Mieter sinkt stark (stay-put-Effekt)
  - Neubau wird gehemmt
  - Qualität der regulierten Wohnungen sinkt langfristig

- Negative Wohlfahrtseffekte überwiegen in den meisten Studien langfristig.

## Relevanz für DAG

- Wichtigste Meta-Studie für alle mietrechtlichen Parameter
- Bestätigt fast alle Kanten im mietrechtlichen Block mit hoher Evidenzstärke
- Besonders wichtig: `mietrecht_kuendigungsschutz` hat sowohl schützende als auch angebotsreduzierende Effekte

## Notizen

- Ergänzt GLOBAL-012 (frühere Version)
- Sehr hohe Relevanz — sollte in `summary.md` zentral zitiert werden
- Bestätigt internationale Evidenz auch für Schweiz (trotz anderer Ausgestaltung des Mietrechts)
---