---
id: "FR-002"
title: "Impact de l'encadrement des loyers à Paris en 2024 — Actualisation de l'évaluation et extension à 5 autres villes régulées"
authors: ["Breuillé, Marie-Laure", "Heurteau, Romain", "Rougier, Mathieu"]
year: 2025
institution: "APUR (Atelier Parisien d'Urbanisme) / CESAER (AgroSup Dijon) / LEP (Laboratoire d'Économie de Poitiers)"
type: "government-report"
language: "fr"
url: "https://www.apur.org/sites/default/files/2025-06/16p276_impact_encadrement_loyers_paris_2024.pdf"
doi: null
status: "evaluated"
dag_nodes: ["mietrecht_anfangsmiete", "mietrecht_kostenmiete", "mietrecht_kuendigungsschutz", "angebotspotenzial"]
dag_edges_confirmed: ["mietrecht_anfangsmiete -> mietpreis_schutzlevel"]
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
---

## Zusammenfassung

Erste kausalinferenzbasierte Evaluation des Pariser Mietpreisdeckels (encadrement des loyers), der am 1. Juli 2019 in Paris wieder eingeführt wurde. Studie wurde von der Ville de Paris bei APUR in Auftrag gegeben und im Juni 2025 publiziert. Datenbasis: Wohnungsinserate von SeLoger (seit 2018), lokale Mietbeobachtungsdaten (OLAP), Referenzmietdaten.

Methode: Difference-in-Differences (DiD) mit synthetischen Kontrollgruppen — erste Anwendung kausaler Inferenzmethoden zur Mietdeckel-Evaluation in Frankreich.

## Key Findings

- **-5,2 %** Wirkung auf Mieten über 5 Jahre (Juli 2019 – Juni 2024) gegenüber einem kontrafaktischen Szenario ohne Regulierung
- **-8,2 %** Wirkung im letzten Messjahr (Juli 2023 – Juni 2024) — Effekt verstärkt sich über Zeit
- Im Mittel €1'694 Ersparnis pro Jahr für Pariser Mieter im Zeitraum 2023–2024
- Effekt ist stärker für kleine Wohnungen als für große
- Studie wurde 2025 auf 5 weitere regulierte Städte (z.B. Lyon, Bordeaux) ausgeweitet — Effekte vergleichbar
- Frühere Studie (2023): -2,5 % zwischen 2019 und 2020, -5,9 % zwischen 2022 und 2023 — Evidenz für zunehmende Bindungswirkung im Zeitverlauf

## Relevanz für DAG

- **Bestätigt**: `mietrecht_anfangsmiete → mietpreis_schutzlevel` (stark positiv, kurzfristig)
- **Kaum untersucht**: Supply-Effekte (Angebotspotenzial) — die Studie misst nur Mietpreisniveau, nicht ob Vermieter Wohnungen zurückhalten
- Für den DAG: Evidenzstärke für Schutzwirkung hoch; Gewicht kann erhöht werden (auf ca. 0,8–1,0)

## Zitate

> "Entre juillet 2019 et juin 2024, l'effet de modération de la hausse des loyers imputable au dispositif d'encadrement à Paris est de -5,2 % par rapport à la hausse qui serait intervenue à Paris en l'absence d'encadrement."

> "L'effet s'accentue dans le temps (-2,5 % entre mi-2019 et mi-2020, -5,9 % entre mi-2022 et mi-2023 et -8,2 % entre mi-2023 et mi-2024)"

## Notizen

- Dies ist die aktuellste und methodisch stärkste Studie zum Pariser Mietpreisdeckel
- Die OFCE hat im Juni 2025 in einem Blogpost (Breuillé et al. 2023 zitierend) bestätigt: "encadrement rempli son objectif" — aber als "notwendig, nicht hinreichend" bewertet
- Frühere Version: "Evaluation d'impact de l'encadrement des loyers à PARIS" (APUR 2023), URL: https://www.apur.org/sites/default/files/rapport_encadrement_loyers_paris.pdf
