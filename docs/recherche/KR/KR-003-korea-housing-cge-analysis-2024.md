---
id: "KR-003"
title: "Impacts of demand and supply-side interventions on South Korea's housing markets: a dynamic housing-CGE analysis"
authors: ["Ryu, Taehyeon", "Kim, et al."]
year: 2024
institution: "Annals of Regional Science / Springer"
type: "peer-reviewed"
language: "en"
url: "https://link.springer.com/article/10.1007/s00168-024-01274-1"
doi: "10.1007/s00168-024-01274-1"
status: "evaluated"
dag_nodes: ["kapital_hypothekarregulierung", "angebotspotenzial", "nachfragedruck", "raumplanung_verdichtung"]
dag_edges_confirmed: []
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
---

## Zusammenfassung

Dynamische CGE (Computable General Equilibrium)-Analyse von Angebots- und Nachfragemaßnahmen auf dem südkoreanischen Wohnungsmarkt. Integriert das Jeonse-System in ein allgemeines Gleichgewichtsmodell. Untersucht Policy-Interventionen wie LTV-Beschränkungen (LTV ratios), Angebotsausweitung und steuerliche Maßnahmen.

## Key Findings

- **Angebotsmaßnahmen** (Upzoning, Neubau) haben langfristig stärkere preisdämpfende Effekte als nachfrageseitige Maßnahmen
- LTV-Beschränkungen reduzieren kurzfristig Preisvolatilität, aber nicht das langfristige Preisniveau
- Jeonse-System ampliziert Preischwankungen (leveraged demand)
- Interaktionseffekte: Supply + Demand-Maßnahmen zusammen sind mehr als additiv

## Relevanz für DAG

- Bestätigt Priorisierung von Angebotsmaßnahmen (`raumplanung_verdichtung`, `angebotspotenzial`)
- `kapital_hypothekarregulierung` → `nachfragedruck` (sign: -1): kurzfristig wirksam, nicht nachhaltig allein

## Notizen

- CGE-Modellierung ist für den DAG-Kontext methodisch interessant
- Interaktionseffekte multiple Policies: relevanter Beitrag zur methodischen Lücke
