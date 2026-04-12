---
id: "NO-001"
title: "Making Norway's Housing More Affordable and Sustainable"
authors: ["OECD Economics Department"]
year: 2022
institution: "OECD"
type: "working-paper"
language: "en"
url: "https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/04/making-norway-s-housing-more-affordable-and-sustainable_8b6c6214/c740833e-en.pdf"
doi: "10.1787/c740833e-en"
status: "evaluated"
dag_nodes: ["raumplanung_zonenreserve", "kapital_hypothekarregulierung", "ctx:zinsniveau", "angebotspotenzial", "nachfragedruck"]
dag_edges_confirmed: ["kapital_hypothekarregulierung → nachfragedruck (sign: -1)"]
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
---

## Zusammenfassung

OECD Economics Department Working Paper Nr. 1711 zu Wohnbezahlbarkeit in Norwegen. Umfassende Analyse des norwegischen Wohnungsmarkts: Preistreiber, Regulierungsrahmen, Angebots- und Nachfragefaktoren. Besonderer Fokus auf geografische Mortgage-Regulierung (Oslo-spezifische LTV-Limits) und Planungsrecht.

## Key Findings

- Empirische Schätzungen zeigen: **Hauspreise in Norwegen lagen über dem durch Fundamentaldaten (Angebot/Nachfrage) implizierten Niveau** — Überhitzungsrisiko
- Finanzielles Gleichgewicht (Rising imbalances) durch Hypothekarexpansion
- Geografisch spezifische Hypothekarregulierung in Oslo (strengere LTV-Limits) hatte **messbare dämpfende Wirkung** auf Preisdynamik
- Angebotsseitige Restriktionen (v.a. Planungsverfahren, Widerspruchsrecht) verzögern Neubau signifikant
- Empfehlungen: Vereinfachung Planungsrecht, stärkere Verdichtung, Hypothekarregulierung als kurzfristiger Puffer

## Relevanz für DAG

**Bestätigt:**
- `kapital_hypothekarregulierung` → `nachfragedruck` (sign: -1, time: short-medium)
- `raumplanung_zonenreserve` → `angebotspotenzial` (sign: -1, time: long)

**Für Einspracherecht:**
- Explizit erwähnt: Widerspruchs- und Einspracherechte verzögern Bewilligungen — DAG-Parameter `bau_einspracherecht_dritte` bestätigt, aber ohne quantitative Schätzung

## Zitate

> "A build-up in financial imbalances ... scope for a moderation in housing prices is further signalled in empirical estimates that house prices are above levels implied by underlying supply and demand drivers."

## Notizen

- **Schliesst die Norwegen-Lücke** (NO war komplett leer)
- Ergänzend: Scandinavia Housing Markets (Springer 2019) als zweite Norwegen-Quelle gesucht
