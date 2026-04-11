---
id: "US-016"
title: "Local Effects of Large New Apartment Buildings in Low-Income Areas"
authors: ["Asquith, Brian J.", "Mast, Evan", "Reed, Davin"]
year: 2023
institution: "Review of Economics and Statistics / MIT Press / Upjohn Institute"
type: "peer-reviewed"
language: "en"
url: "https://direct.mit.edu/rest/article-abstract/105/2/359/100977"
doi: "10.1162/rest_a_01055"
status: "evaluated"
dag_nodes:
  - "raumplanung_verdichtung"
  - "bau_bewilligungsverfahren"
  - "angebotspotenzial"
  - "nachfragedruck"
  - "verdraengungsrisiko"
dag_edges_confirmed:
  - { from: "raumplanung_verdichtung", to: "angebotspotenzial", sign: +1, note: "Neue Mehrfamilienhäuser senken Mieten im 500m-Radius um ~6% — direkte lokale Angebotseffekte" }
  - { from: "angebotspotenzial", to: "nachfragedruck", sign: -1, note: "Neue Einheiten absorbieren Nachfrage und entlasten Bestandsmarkt" }
  - { from: "angebotspotenzial", to: "verdraengungsrisiko", sign: -1, note: "Mehr Neubau in Einkommensschwachen Quartieren reduziert Verdrängungsdruck" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["US"]
period_covered: "2000–2020"
---

## Zusammenfassung

Mikroökonometrische Studie zu lokalen Effekten neuer Mehrfamilienhäuser (≥5 Einheiten) in
einkommensschwachen US-Stadtteilen. Nutzt Timing-Variation von Baugenehmigungen als quasi-
experimentelles Design. Trackt Mieten und Migration individuell im 500m-Radius.

## Key Findings

- Neue Mehrfamilienhäuser senken Mieten in einem **Umkreis von 500m um ca. 6%** relativ zu Kontrollgruppe
- Haushalte mit niedrigem Einkommen ziehen vermehrt in Quartiere mit Neubauten — erhöhte Mobilität
- Mechanismus: Einkommensstarke Haushalte ziehen in Neubauten → entlasten ältere, günstigere Bestände
- "Filtering"-Mechanismus empirisch bestätigt: Neubau trickles down zu Haushalten mit geringerem Einkommen
- Keine Verdrängungseffekte durch Neubau in einkommensschwachen Gebieten gemessen

## Relevanz für DAG

- Wichtigste Studie für lokale Neubau-Mieteffekte
- Bestätigt: `raumplanung_verdichtung → angebotspotenzial` (sign: +1) mit messbaren Mietpreiseffekten auch im Bestand
- Widerlegt populäre Annahme, dass Luxuswohnungsbau in armen Quartieren Verdrängung verursacht
- Für DAG: Verdichtung senkt auch `verdraengungsrisiko` (sign: -1) — wichtige Kante

## Zitate

> "New buildings decrease rents in nearby units by about 6% relative to units slightly farther away or near sites developed later." (Abstract)

> "The results suggest that new market-rate housing in low-income areas does not displace low-income households, and may attract them by reducing rents in the broader area." (S. 370)

## Notizen

- Ergänzt Auckland-Studie (NZ-001): dort Stadtebene, hier Quartiersebene (500m-Radius)
- Asquith et al. ist die stärkste US-Evidenz für lokale Neubau-Mieteffekte
- Widerspruch zu älteren Studien (Freemark 2020 Chicago): dort kurzfristige Preiserhöhung durch Optionswert
- Büchler & Lutz (2024, Zürich) findet ähnliches Ergebnis: kein qualitätsbereinigter Mietanstieg nach Upzoning
