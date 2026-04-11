---
id: "GLOBAL-025"
title: "The Geographic Determinants of Housing Supply"
authors: ["Saiz, Albert"]
year: 2010
institution: "MIT / Wharton School — Quarterly Journal of Economics"
type: "peer-reviewed"
language: "en"
url: "https://academic.oup.com/qje/article-abstract/125/3/1253/1903664"
doi: "10.1162/qjec.2010.125.3.1253"
pdf: "https://fpeckert.me/teaching/readings/SaizQJE10.pdf"
status: "evaluated"
dag_nodes:
  - "raumplanung_zonenreserve"
  - "raumplanung_verdichtung"
  - "raumplanung_ausnuetzungsziffer"
  - "angebotspotenzial"
  - "neubau_hemmnisindex"
dag_edges_confirmed:
  - { from: "raumplanung_zonenreserve", to: "angebotspotenzial", sign: -1, note: "Angebotsrestriktionen (Regulierung + Geographie) sind Haupttreiber für inelastische Angebotsmärkte" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL", "US"]
period_covered: "1970–2000"
countries: "US Metropolitan Areas (nationale Stichprobe)"
---

## Zusammenfassung

Seminalarbeit, die Housing Supply Elastizitäten in US-Städten als Funktion von physischen Geographie-
Constraints (Wasser, Berge, Steigungen) und regulatorischen Restriktionen schätzt. Zeigt, dass beide
Typen von Constraints die Angebotselastizität reduzieren und damit Hauspreise erhöhen.

## Key Findings

- Elastizitäten variieren stark zwischen Städten: von >3 (Houston, Phoenix) bis <0.5 (San Francisco, NYC)
- Starke Korrelation (r=0.65) zwischen geographischer Landverfügbarkeit und Hauspreisen 2000
- Regulatorische Restriktionen (Wharton Land Use Regulatory Index) erklären einen signifikanten Teil der Variation
- Physische und regulatorische Constraints wirken zusammen und sind statistisch endogen zu Preisen und Wachstum
- In Städten mit wenig verfügbarem Land (SF, NYC) reagiert das Angebot kaum auf Preiserhöhungen

## Relevanz für DAG

- Grundlagenreferenz für `angebotspotenzial` als Funktion von Regulierung (raumplanung_*) und Geographie
- `raumplanung_zonenreserve → angebotspotenzial` (sign: -1): regulatorische Constraints sind empirisch belegt
- Schweiz: Geographie (Alpen, Topographie) ist natürliche Supply-Schranke — wichtiger Kontextfaktor

## Zitate

> "Supply elasticities can be well characterized as functions of both physical and regulatory constraints, which in turn are endogenous to prices and demographic growth." (Abstract)

> "Most areas in which housing supply is regarded as inelastic are severely land-constrained by their geography." (Abstract)

## Notizen

- Standard-Referenz für Housing Supply Elastizitäten
- Wharton Residential Land Use Regulatory Index (Gyourko et al.) ist das zugehörige Regulierungsmass
- Ergänzung: Hsieh & Moretti (2019) nutzen Saiz-Elastizitäten als Instrument
