---
id: "US-001"
title: "The Effects of Rent Control Expansion on Tenants, Landlords, and Inequality: Evidence from San Francisco"
authors: ["Diamond, Rebecca", "McQuade, Tim", "Qian, Franklin"]
year: 2019
institution: "Stanford GSB / American Economic Review"
type: "peer-reviewed"
language: "en"
url: "https://www.aeaweb.org/articles?id=10.1257/aer.20181289"
doi: "10.1257/aer.20181289"
nber_wp: "https://www.nber.org/papers/w24181"
status: "evaluated"
dag_nodes:
  - "mietrecht_kuendigungsschutz"
  - "mietrecht_kostenmiete"
  - "verdraengungsrisiko"
  - "mietpreis_schutzlevel"
  - "angebotspotenzial"
  - "gentrifizierungsindex"
dag_edges_confirmed:
  - { from: "mietrecht_kuendigungsschutz", to: "mietpreis_schutzlevel", sign: +1, note: "Mieter in geschützten Einheiten zahlen bis zu 50% weniger als Marktmiete" }
  - { from: "mietrecht_kuendigungsschutz", to: "verdraengungsrisiko", sign: -1, note: "Mieterschutz reduziert Verdrängung bestehender Mieter um ~20%" }
  - { from: "mietrecht_kuendigungsschutz", to: "angebotspotenzial", sign: -1, note: "Vermieter ziehen 15% der Einheiten vom Mietmarkt ab (Verkauf, Umnutzung)" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["US"]
city: "San Francisco"
period_covered: "1980–2012"
---

## Zusammenfassung

Kausalidentifikation der Effekte einer Mietpreiskontrolle-Ausweitung in San Francisco 1994.
Nutzt Discontinuity-Design: Gebäude mit ≤4 Einheiten wurden von der Ausweitung ausgenommen,
Gebäude mit 5+ Einheiten einbezogen. Verfolgt individuelle Mieterbewegungen über 25 Jahre.

## Key Findings

- **Für Mieter:** Mieterschutz reduziert Mobilität um 20%, schützt effektiv vor Verdrängung
- **Für Vermieter:** 15% der kontrollierten Einheiten wurden vom Mietmarkt abgezogen (Verkauf an Eigennutzer, Abriss/Umbau)
- **Marktweite Wirkung:** Nettoreduktion des Mietangebots um ~15% → **Steigerung der Marktmieten um 7%**
- Mietpreiskontrolle schützt bestehende Mieter, schadet aber zukünftigen Mietern und Neuankömmlingen
- Mischte Wirkung auf Gentrifizierung: verhindert Verdrängung von Minderheiten, aber zieht einkommensstärkere Bewohner in frei gewordene Einheiten an

## Relevanz für DAG

Einer der wichtigsten Befunde für mehrere DAG-Kanten:

1. `mietrecht_kuendigungsschutz → mietpreis_schutzlevel` (sign: +1) ✓ — direkte Bestätigung
2. `mietrecht_kuendigungsschutz → verdraengungsrisiko` (sign: -1) ✓ — Verdrängungsschutz funktioniert für Bestandsmieter
3. `mietrecht_kuendigungsschutz → angebotspotenzial` (sign: -1) ✓ — wichtige Nebenfolge: Angebotsreduktion

**Key Tension:** Mieterschutz schützt Bestandsmieter, reduziert aber das Gesamtangebot.
Diese Spannungsbeziehung sollte im DAG modelliert werden.

## Zitate

> "We find rent control limits renters' mobility by 20 percent and lowers displacement from San Francisco." (Abstract)

> "Landlords treated by rent control reduce rental housing supplies by 15 percent by selling to owner-occupants and redeveloping buildings." (Abstract)

> "While rent control prevents displacement of incumbent renters in the short run, the policy leads to a citywide rent increase of 7 percent as landlords remove their properties from the rental market." (S. 3366)

## Notizen

- Gold-Standard-Studie für Mietpreiskontrolle-Effekte — sehr häufig zitiert
- Unterscheidet klar zwischen Effekten auf Bestandsmieter vs. Markteffekte
- Replizierbare Methodik, wurde in anderen Städten validiert
- Ergänzung: Autor et al. (2014) — Boston, Gyourko & Linneman (1989) — Philadelphia
