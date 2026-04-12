---
id: "US-009"
title: "New York City Rent Stabilization — Fallstudie"
authors: ["NYC Rent Guidelines Board", "Metro NY Chapter of NARP"]
year: 2024
institution: "NYC Rent Guidelines Board"
type: "government-report"
language: "en"
url: null
doi: null
status: "evaluated"
dag_nodes: ["mietrecht_kuendigungsschutz", "mietrecht_anfangsmiete", "verdraengungsrisiko", "angebotspotenzial"]
dag_edges_confirmed:
  - { from: "mietrecht_kuendigungsschutz", to: "angebotspotenzial", sign: -1, note: "Jährlicher Nettoverlust ~15.000-20.000 stabilisierte Einheiten durch Deregulierung" }
  - { from: "mietrecht_anfangsmiete", to: "nachfragedruck", sign: 1, note: "Nicht-stabilisierte Mieten in NYC waren 22-25% höher als ohne Stabilisierung" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["US"]
period_covered: "1968–2024"
---

## Zusammenfassung
Fallstudie zur New Yorker Rent Stabilization (seit 1950er–1970er etabliert, Millionen von Wohnungen reguliert). Mieterhöhungen begrenzt auf Guidelines Boards, de facto Mietendeckel. Dekadenlange Evidenz zu Trade-offs starker Mietregulierung.

## Key Findings
- Nicht-stabilisierte Mieten in NYC waren 22–25 % höher als ohne Stabilisierung (indirekte Preissteigerung im unregulated sector)
- ~1 Mio. stabilisierte Wohnungen in NYC
- ~340.000 stabilisierte Wohnungen seit 2007 durch Deregulierung (Luxus-Modernisierung) verloren gegangen
- Durchschnittliche Jahresfluktuation: ~3 % bei stabilisierten vs. ~25 % bei marktüblichen Wohnungen

## Relevanz für DAG
Zentrale Fallstudie für langfristige Wirkungen von mietrecht_kuendigungsschutz und mietrecht_anfangsmiete. Zeigt: strenger Schutz bei Bestandsmietern, aber Verlust durch Deregulierung und kaum Fluktuation.

## Notizen
- Keine einzelne akademische Studie — Dossier basiert auf NYC RGB Reports und breiter empirischer Literatur
- Langfristigste verfügbare Evidenz zu Rent Control überhaupt
