---
id: "CH-010"
title: "Eigenmietwert-Abschaffung: Auswirkungen auf Wohneigentum und Mietmarkt in der Schweiz"
authors: ["Wüest Partner AG"]
year: 2026
institution: "Wüest Partner AG"
type: "working-paper"
language: "de"
url: "https://www.wuestpartner.com"
doi: null
status: "evaluated"
dag_nodes: ["steuer_eigenmietwert", "angebotspotenzial", "nachfragedruck"]
dag_edges_confirmed: []
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
---

## Zusammenfassung

Studie des Immobilienberatungsunternehmens Wüest Partner, veröffentlicht am 5. Februar 2026, anlässlich der anstehenden Schweizer Eigenmietwert-Abschaffung (Volksabstimmung / parlamentarische Vorlage ab ca. 2028). Analysiert, in welchen Gemeinden Wohneigentum nach der Reform günstiger oder teurer wird als Mieten.

## Key Findings

- Im aktuellen System (mit Eigenmietwert): Wohneigentum bereits in **57 %** aller Schweizer Gemeinden günstiger als Mieten
- Nach Abschaffung: Anteil steigt auf **71 %** aller Gemeinden
- Effekt ist regional differenziert: In Zürich und Zentralschweiz wird Wohneigentum *unattraktiver* (hohe Unterhaltsabzüge fallen weg, die Altbauten bevorteiligen)
- UBS-Studie (Januar 2026): Abschaffung belastet Werte von **Altbauten** — Unterhaltsabzüge fallen weg, was Renovierungsanreize schwächt
- Beide Studien (Wüest Partner + UBS) bestätigen: Reform hat deutliche Markteffekte — v.a. auf Eigentumsquote und relative Attraktivität von Wohnformen

## Relevanz für DAG

- **Zentral für**: `steuer_eigenmietwert → angebotspotenzial / nachfragedruck`
- Bestätigt: Abschaffung erhöht Eigentümeranteil → reduziert Mietangebot (Umwandlung Miet→Eigentum)
- Gewichtsschätzung für DAG-Kante: +0,5–0,8 auf `nachfragedruck` (Eigenheimkäufe steigen)
- Kritisch: Diese Studie ist Industrie-Analyse, nicht peer-reviewed — als Indikator nutzen, nicht als Evidenz

## Notizen

- Berichtet in watson.ch (5.2.2026): https://www.watson.ch/schweiz/wirtschaft/206798483-eigenmietwert-abschaffung-macht-laut-studie-wohneigentum-attraktiver
- UBS-Studie (Jan 2026): https://www.fuw.ch/schweizer-immobilienmarkt-wegfall-des-eigenmietwert-regimes-belastet-laut-ubs-studie-werte-von-altbauten-719318541766
- Ergänzend: OECD 2022 Measuring Effective Taxation of Housing (GLOBAL-022) für Systemvergleich
- Keine Peer-Review — Status "found" belassen bis Volltext verfügbar
