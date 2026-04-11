---
id: "DE-009"
title: "Berlin Mietendeckel 2020–2021 — Fallstudie"
authors: ["DIW Berlin", "Hahn et al. 2024"]
year: 2021
institution: "DIW Berlin / Management Science"
type: "peer-reviewed"
language: "de"
url: "https://doi.org/10.1287/mnsc.2023.4775"
doi: "10.1287/mnsc.2023.4775"
status: "evaluated"
dag_nodes: ["mietrecht_anfangsmiete", "mietrecht_kuendigungsschutz", "angebotspotenzial", "verdraengungsrisiko", "aufwertungsdruck"]
dag_edges_confirmed:
  - { from: "mietrecht_anfangsmiete", to: "angebotspotenzial", sign: -1, note: "~90% der Berliner Mietwohnungen betroffen; Inserate-Rückgang innerhalb weniger Monate" }
  - { from: "mietrecht_anfangsmiete", to: "nachfragedruck", sign: 1, note: "Brandenburg municipalities saw rapidly growing rents at Berlin's border (Rent Gap)" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["DE"]
period_covered: "2020–2021"
---

## Zusammenfassung
Fallstudie zum Berliner Mietendeckel (Mietenstopp auf Niveau Juni 2019, Inkrafttreten Feb. 2020, Verfassungsgerichtsurteil April 2021). Quantifiziert Angebotsverknappung, Verdrängungseffekte und Umland-Spillover. Eines der prominentesten natürlichen Experimente der Mietregulierungsforschung.

## Key Findings
- ~90 % der Berliner Mietwohnungen waren von der Regulierung betroffen
- Anzahl der inserierten Mietobjekte: signifikanter Rückgang innerhalb weniger Monate
- Spillover: Brandenburg municipalities saw rapidly growing rents at Berlin's border (Rent Gap)
- Vermieter-Hedging: Verträge mit mieterfremden Klauseln als Versicherung gegen rechtliche Unsicherheit
- Reversal: Verfassungsgericht kassierte den Mietendeckel April 2021 (Landeskompetenz); anschliessend Wiederaufholung der Mieten

## Relevanz für DAG
Zentrale Fallstudie für den DAG: Zeigt Verdrängungsdynamik über Stadtgrenzen hinweg und die Grenzen rein lokaler Mietregulierung. Wichtig für ctx:zuwanderungsdruck.

## Zitate
> "Rent Gap an der Stadtgrenze" — Brandenburg municipalities saw rapidly growing rents at Berlin's border. (DIW Wochenbericht 8/2021)

## Notizen
- Primärquellen: DIW Wochenbericht 8/2021; Hahn et al. (2024) Management Science; PwC "Rent Cap & Co."
- Politisch sehr folgenreich — hat die Debatte um Mietregulierung in Deutschland massgeblich beeinflusst
