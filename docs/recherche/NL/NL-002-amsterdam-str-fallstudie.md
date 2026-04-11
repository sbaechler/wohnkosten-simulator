---
id: "NL-002"
title: "Amsterdam STR-Regulierung — Fallstudie"
authors: ["ScienceDirect", "Airbnb Newsroom"]
year: 2023
institution: "ScienceDirect"
type: "peer-reviewed"
language: "en"
url: "https://www.sciencedirect.com/science/article/pii/S0264275123000641"
doi: "10.1016/j.cities.2023.XXXXX"
status: "found"
dag_nodes: ["nutzung_kurzzeitvermietung", "nachfragedruck", "aufwertungsdruck"]
dag_edges_confirmed:
  - { from: "nutzung_kurzzeitvermietung", to: "nachfragedruck", sign: 1, note: "In Amsterdam manifests sich Airbnb primär als Mietpreisanstieg" }
dag_edges_challenged:
  - { from: "nutzung_kurzzeitvermietung", to: "nachfragedruck", note: "Empirische Evaluierung zeigt: strenge Regulierung hat die durchschnittlichen Langzeitmieten in Amsterdam nicht gesenkt" }
relevance: "medium"
duplicate_of: null
regions: ["NL"]
period_covered: "2023"
---

## Zusammenfassung
Fallstudie zu Amsterdams strenger STR-Regulierung (permitted host requirement, Nachtenbeperking). Zeigt: Negative Externalitäten manifestsieren sich in Amsterdam primär als Mietpreisanstieg.

## Key Findings
- Agenten-basierte Simulation: Mehr einkommensschwächere Bürger bleiben im Stadtzentrum bei stärkerer Regulierung
- Ein Verbot des touristischen Marktes begrenzt den Gesamtanstieg der Hauspreise im Vergleich zum Status quo
- Empirische Evaluierung: strenge Regulierung hat die durchschnittlichen Langzeitmieten in Amsterdam nicht gesenkt

## Relevanz für DAG
Fallstudie für den DAG-Knoten nutzung_kurzzeitvermietung. Zeigt: kontextabhängige Wirkung (hier: Mietpreiseffekt dominant).

## Notizen
- ScienceDirect (2023); Airbnb Newsroom (Mai 2025)
- Amsterdam reagiert anders als Barcelona (dort primär Kaufpreiseffekt)
