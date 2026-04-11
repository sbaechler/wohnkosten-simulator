---
id: "GLOBAL-002"
title: "Fundamental Drivers of House Prices in Advanced Economies"
authors: ["Cesa-Bianchi, Ambrogio", "Cespedes, Luis Felipe", "Rebucci, Alessandro"]
year: 2018
institution: "International Monetary Fund"
type: "working-paper"
language: "en"
url: "https://www.elibrary.imf.org/view/journals/001/2018/164/article-A001-en.xml"
doi: null
imf_wp: "WP/18/164"
status: "evaluated"
dag_nodes:
  - "ctx:zinsniveau"
  - "ctx:wirtschaftskraft"
  - "ctx:zuwanderungsdruck"
  - "kapital_hypothekarregulierung"
  - "angebotspotenzial"
dag_edges_confirmed:
  - { from: "ctx:zinsniveau", to: "nachfragedruck", sign: -1, note: "Tiefe Zinsen treiben Nachfrage und Preise, robust über viele Länder" }
  - { from: "ctx:wirtschaftskraft", to: "nachfragedruck", sign: +1, note: "Pro-Kopf-Einkommen signifikanter Treiber langfristig" }
  - { from: "kapital_hypothekarregulierung", to: "nachfragedruck", sign: -1, note: "Kreditbedingungen beeinflussen Nachfrage stark" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "1960–2016"
countries: "advanced economies (ca. 20)"
---

## Zusammenfassung

IMF Working Paper analysiert die fundamentalen Treiber von Hauspreisen in fortgeschrittenen Volkswirtschaften
über 50+ Jahre. Untersucht Angebots- und Nachfragefaktoren sowie institutionelle Strukturen.

## Key Findings

- **Demand-Seite:** Zinsniveau, Kreditbedingungen, Pro-Kopf-Einkommen und Bevölkerungswachstum sind Haupttreiber
- **Supply-Seite:** Angebotsrestriktionen (Raumplanung, Regulation) erklären erhebliche Preisdifferenzen zwischen Ländern
- Institutionelle Faktoren (Mieterschutz, Steuerregime für Eigenheime) haben moderate, aber persistente Effekte
- Synchronisierung der Hauspreiszyklen zwischen Ländern hat seit 1990 stark zugenommen (Globalisierung des Kapitals)
- Kreditexpansion ist ein wichtiger kurzfristiger Verstärker, aber kein langfristiger Treiber

## Relevanz für DAG

- Bestätigt `ctx:zinsniveau` als starken Kontextfaktor mit direktem Einfluss auf `nachfragedruck`
- `kapital_hypothekarregulierung → nachfragedruck` (sign: -1): Verschärfung der Kreditbedingungen dämpft Preise
- `ctx:wirtschaftskraft → nachfragedruck` (sign: +1): Einkommenseffekt belegt
- Angebotsrestriktionen sind langfristig preissteigernd → `raumplanung_zonenreserve → angebotspotenzial` ✓

## Zitate

> "Supply constraints, particularly land use regulations, explain a significant share of the cross-country variation in house price levels." (S. 12)

> "Credit conditions and mortgage market development are among the most important short-run demand drivers." (S. 18)

## Notizen

- Guter Überblick über die Literatur bis 2018
- Ergänzt Knoll et al. (2017) mit kurzfristigen Dynamiken
- Für DAG-Kalibrierung: Zinsniveau und Kreditkonditionen sind die wichtigsten Kontextvariablen
