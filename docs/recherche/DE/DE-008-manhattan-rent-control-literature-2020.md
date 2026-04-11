---
id: "DE-008"
title: "Rent Control Does Not Make Housing More Affordable"
authors: ["Manhattan Institute"]
year: 2020
institution: "Manhattan Institute"
type: "meta-study"
language: "en"
url: "https://manhattan.institute/article/issues-2020-rent-control-does-not-make-housing-more-affordable"
doi: null
status: "found"
dag_nodes: ["mietrecht_kuendigungsschutz", "mietrecht_anfangsmiete", "angebotspotenzial"]
dag_edges_confirmed:
  - { from: "mietrecht_anfangsmiete", to: "angebotspotenzial", sign: -1, note: "San Francisco: -6% gesamtes Mietwohnungsangebot durch Rent Control → +5,1% Mieten gesamtstädtisch" }
  - { from: "mietrecht_anfangsmiete", to: "nachfragedruck", sign: 1, note: "NYC (1968): Mieten in nicht-kontrollierten Einheiten 22-25% höher als ohne Regulierung" }
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
regions: ["DE"]
period_covered: "2020"
---

## Zusammenfassung
Literature Review des Manhattan Institute zur Studienevidenz von Rent Control in US-Städten (New York, San Francisco, diverse). Kumulative Evidenz zeigt: Nettowirkung auf Gesamtwohnkosten ist negativ oder neutral. Konsistenter Befund: Mieten im nicht-regulierten Sektor steigen als indirekte Folge.

## Key Findings
- San Francisco: –6 % gesamtes Mietwohnungsangebot durch Rent Control → +5,1 % Mieten gesamtstädtisch
- New York (1968): Mieten in nicht-kontrollierten Einheiten 22–25 % höher als ohne Regulierung
- Konsistenter Befund: Nettowirkung auf Gesamtwohnkosten ist negativ oder neutral

## Relevanz für DAG
Meta-Studie, die den Trade-off zwischen mietrecht_anfangsmiete und nachfragedruck bestätigt. Konsistente Befunde über Städte hinweg.

## Notizen
- Manhattan Institute, kritische Perspektive, aber mit quantitativen Belegen
- Berücksichtigt Studien bis 2020
