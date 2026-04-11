---
id: "CH-008"
title: "Verdichtung und Verdrängung in den fünf grössten Schweizer Agglomerationen"
authors: ["ETH Zürich SPUR Group"]
year: 2025
institution: "ETH Zürich / Bundesamt für Wohnungswesen BWO"
type: "government-report"
language: "de"
url: "https://www.bwo.admin.ch/de/newnsb/kCsplatEUOgb4PiiO94YG"
doi: null
status: "evaluated"
dag_nodes:
  - "raumplanung_verdichtung"
  - "raumplanung_ausnuetzungsziffer"
  - "angebotspotenzial"
  - "verdraengungsrisiko"
  - "gentrifizierungsindex"
dag_edges_confirmed:
  - { from: "raumplanung_verdichtung", to: "verdraengungsrisiko", sign: +1, note: "Verdichtung via Ersatzbauten verdrängt vulnerable Bewohnende — insbesondere Einkommensschwache" }
  - { from: "raumplanung_verdichtung", to: "angebotspotenzial", sign: +1, note: "Innerhalb Siedlungsfläche stark gestiegen 2020–2023; Basel 24% neue Wohnungen auf Industrie-/Gewerbezonen" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["CH"]
cities: ["Basel", "Bern", "Genf", "Lausanne", "Zürich"]
period_covered: "2000–2023"
---

## Zusammenfassung

ETH SPUR-Studie im Auftrag des BWO (Publikation Juni 2025). Untersucht Siedlungsentwicklung und
Veränderung der Bevölkerungszusammensetzung durch Ersatzbauten und Totalsanierungen in den fünf
grössten Schweizer Agglomerationen: Basel, Bern, Genf, Lausanne, Zürich.

## Key Findings

- In den fünf grössten Agglomerationen **stieg der Anteil neuer Wohngebäude innerhalb bestehender Siedlungsfläche** merklich seit 2000
- In Basel: **~15%** der neuen Wohngebäude 2020–2023 auf früheren Industrie-/Gewerbezonen; **24%** aller neuen Wohnungen
- **Verdrängte Bevölkerung:** Vor allem vulnerable Personen — Menschen, die wahrscheinlich Schwierigkeiten haben, wieder bezahlbaren Wohnraum zu finden
- Verdrängung betrifft besonders Haushalte mit niedrigem Einkommen und ältere Personen in sanierungsbedürftigen Beständen
- ETH SPUR: Neubauaktivitäten haben negativen Effekt auf vulnerable Personen im urbanen Kanton Zürich (SPUR 2023)

## Relevanz für DAG

- **Zentrale CH-Evidenz für Zielkonflikt:** Verdichtung erhöht Angebot, aber verursacht auch Verdrängung
  → `raumplanung_verdichtung → angebotspotenzial` (sign: +1) ✓
  → `raumplanung_verdichtung → verdraengungsrisiko` (sign: +1): wichtige Nebenfolge für DAG
- `gentrifizierungsindex` als E2-Indikator: Verdichtung ohne sozialpolitische Flankierung erhöht Gentrifizierungsrisiko
- Für Schweiz: Kombination aus Verdichtungsgebot und Verdrängungsschutz (z.B. Abbruchverbot, Wohnschutz) ist nötig

## Notizen

- Aktuellste CH-Quelle zu Verdichtung und Verdrängung (Juni 2025)
- Ergänzt Büchler & Lutz (2024): Dort Preiseffekte, hier Sozialeffekte/Verdrängung
- SRF-Berichterstattung: "Einkommensschwache durch verdichtetes Bauen verdrängt"
- Direkte Policy-Relevanz: `nutzung_abbruchverbot` und `gemeinnuetzig_belegungsvorschriften` als Gegenmassnahmen
