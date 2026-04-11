---
id: "DE-005"
title: "Supply side effects of the Berlin rent freeze"
authors: ["Hahn, Anja M.", "Kholodilin, Konstantin A.", "Waltl, Sofie R."]
year: 2022
institution: "Citoyen Policy Paper"
type: "working-paper"
language: "en"
url: "https://www.tandfonline.com/doi/full/10.1080/19491247.2022.2059844"
doi: "10.1080/19491247.2022.2059844"
status: "evaluated"
dag_nodes: ["mietrecht_anfangsmiete", "angebotspotenzial", "verdraengungsrisiko"]
dag_edges_confirmed:
  - { from: "mietrecht_anfangsmiete", to: "angebotspotenzial", sign: -1, note: "Menge des regulierten Mietangebots ging signifikant zurück" }
  - { from: "mietrecht_anfangsmiete", to: "eigentumsquoten_trend", sign: 1, note: "Erhöhte Umwandlungen von Miet- zu Eigentumswohnungen" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["DE"]
period_covered: "2020–2021"
---

## Zusammenfassung
Analyse der Angebotsseite des Berliner Mietendeckels. Untersucht die Auswirkungen auf Mietangebot, Umwandlungen und Neubauaktivität. Zeigt konsistente negative Angebots-effekte der Regulierung.

## Key Findings
- Mieten im regulierten Segment sanken; aber: Menge des regulierten Mietangebots ging signifikant zurück
- Erhöhte Umwandlungen von Miet- zu Eigentumswohnungen
- Rückgang der neu gebauten Mietwohnungen
- Reduktion der am Markt beworbenen Mietobjekte

## Relevanz für DAG
Ergänzt DE-004 mit Fokus auf Angebotsseite. Relevant für angebotspotenzial und eigentumsquoten_trend.

## Notizen
- Zitiert in Hahn et al. (2024) Management Science
- Citoyen Policy Paper
- Erscheinungsjahr 2022
