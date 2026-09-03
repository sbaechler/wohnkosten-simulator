---
id: "US-020"
title: "Abundance and the Left (The Ezra Klein Show)"
authors: ["Klein, Ezra", "Teachout, Zephyr", "Chakrabarti, Saikat"]
year: 2025
institution: "The New York Times (Opinion / Podcast-Transcript)"
type: "gray-literature"
language: "en"
url: "https://www.nytimes.com/2025/04/29/opinion/ezra-klein-podcast-saikat-chakrabarti-zephyr-teachout.html"
doi: null
status: "evaluated"
dag_nodes: ["bau_bewilligungsverfahren", "bau_einspracherecht_dritte", "raumplanung_verdichtung", "gemeinnuetzig_kraft", "angebotspotenzial"]
dag_edges_confirmed:
  - { from: "bau_bewilligungsverfahren", to: "angebotspotenzial", sign: -1, note: "Parcel-by-parcel-Bewilligung in San Francisco als Vetokratie; Klein: Prozess schafft Einfallstore für Incumbents (Homeowner, Konzerne, Unions)" }
  - { from: "bau_einspracherecht_dritte", to: "angebotspotenzial", sign: -1, note: "CEQA-Klagen (Beispiel Rick Caruso gegen Entwicklung neben seinem Mall) als Delay-Vehikel" }
  - { from: "gemeinnuetzig_kraft", to: "angebotspotenzial", sign: -1, note: "Klein zitiert RAND: öffentlich subventionierter Affordable Housing in Kalifornien kostet >4× pro sqft so viel wie marktmässiger Wohnungsbau in Texas — Regeln, die der Staat sich selbst auferlegt" }
dag_edges_challenged:
  - { from: "bau_bewilligungsverfahren", to: "angebotspotenzial", sign: -1, note: "Chakrabarti: Austin Streamlining erhöhte Bau, senkte Mieten, reichte aber nicht (weiterhin cost-burdened; später Nettoabwanderung, Bau flaut ab) — Permitting ist kein Silver Bullet" }
relevance: "medium"
duplicate_of: null
regions: ["US"]
period_covered: "2020s"
---

## Zusammenfassung

Editiertes Transcript der Ezra-Klein-Show (29.04.2025) zur Debatte um *Abundance* (Klein/Thompson). Gäste: Zephyr Teachout (Fordham, Anti-Monopoly) und Saikat Chakrabarti (New Consensus, ex-AOC-Stabschef, kandidiert gegen Pelosi). Keine Empirie, aber die klarste der drei Quellen zur Mechanismenfrage, die der Simulator schon modelliert: **Prozess/Angebot vs. konzentrierte Macht vs. staatliche Finanzierung/«Mission Mode»**.

Klein erdet die Debatte am Haushaltsbudget (Miete/Hypothek) und an einem RAND-Report nach Erscheinen des Buchs: öffentlich geförderter Affordable Housing in Kalifornien koste **mehr als das Vierfache** pro Quadratfuss gegenüber marktmässigem Bau in Texas; CA-Markt vs. Texas liege immer noch bei **>2×**. Teachout akzeptiert Zoning-Probleme, will den Fokus aber auf Oligarchie/Homebuilding-Konzentration legen und verteidigt unionisierte Baukosten (Upstate NY vs. Texas: +10–20 %, «that's good»). Chakrabarti: Prozess *und* Finanzierung; Parcel-by-Parcel in SF; Zinsanstieg stoppt Projekte; Austin-Permitting half, war aber kein Silver Bullet.

## Key Findings

- **Kostenkeil öffentlich vs. Markt.** Klein/RAND: CA subsidized affordable >4× $/sqft vs. Texas market-rate; CA market-rate >2× Texas. Klein führt das auf Regeln zurück, die Democratic governments der öffentlichen Bauleistung selbst auferlegen (Delay + Cost; Analogie CA High-Speed Rail).
- **Bewilligung als Vetokratie.** SF entscheidet parcel by parcel. CEQA als Klagevehikel (Beispiel Rick Caruso gegen Entwicklung neben seinem Mall). Klein: komplexe, schattenhafte Verfahren begünstigen Incumbents jeder Couleur, nicht nur «linke NIMBYs».
- **Kein Konsens über die Diagnose.** Teachout: Haupthebel sei konzentrierte Macht, nicht «left-wing resistance». Chakrabarti: Bottlenecks rotieren (Prozess, dann Finanzierung, dann das nächste); braucht «mission mode» plus öffentliche Finanzierungsinstitutionen.
- **Austin als Gegenbeispiel mit Grenzen.** Streamlined Permitting → mehr Bau, tiefere Mieten — aber weiterhin hoher Rent-Burden-Anteil; später Nettoabwanderung, Bau flaut ab. Chakrabarti: Permitting allein reicht nicht.
- **Europa-Kontrast (qualitativ).** Chakrabarti: Europa baut schneller/billiger trotz höherer Union Density, weil Agenturen entscheiden dürfen und Environmental Reviews Fristen haben; USA: open-ended lawsuits.

## Relevanz für DAG

Nützlich als **Mechanismen-Debatte**, nicht als Schätzer:

| These | DAG-Lesart |
|---|---|
| CEQA / parcel-by-parcel / Delay | `bau_bewilligungsverfahren` / `bau_einspracherecht_dritte` → `angebotspotenzial` (−), medium |
| Öffentliche Auflagen treiben Kosten des geförderten Baus | `gemeinnuetzig_*` skaliert nicht linear, wenn Baukosten durch Verfahren explodieren |
| Austin: Streamlining hilft, saturiert nicht | Angebotswirkung von Upzoning/Permitting ist real, aber phasenabhängig und nachfrageabhängig |
| Teachout: Marktkonzentration im Homebuilding | Im Modell nicht abgebildet (kein E0 für Bauwirtschafts-Oligopol) |

Keine Gewichtsanpassung. Falls vertieft: RAND Ward/Schlake *The High Cost of Producing Multifamily Housing in California* als eigene Studie nachziehen.

## Zitate

> "The single biggest item in virtually every household’s budget is the home they live in. It’s the rent. It’s the mortgage. […] It found it costs four times as much more than four times actually per square foot, to produce a publicly subsidized affordable housing. […] as it costs to produce a square foot of market rate housing in Texas."

> "We’d have this process in San Francisco where you approve on a parcel by parcel method […]. And so that process is a big part of the problem. But, I don’t actually think it’s just going to be process that will fix it, because what we see is often financing is a problem." (Chakrabarti)

> "Austin, which is a city that people refer to a lot where they did a lot of streamlined permitting, construction went up, rents went down really good. But it wasn’t actually enough." (Chakrabarti)

## Notizen

- Live-NYT paywalled; Transcript aus Wayback 2025-10-02 (JSON-LD `VideoObject.transcript`)
- Evidenzstufe: ★ (Podcast/Opinion). Gäste sind Advokaten, keine Schätzer
- Buch-Empfehlungen der Folge u. a. Ward/Schlake (RAND) zur CA-Baukostenlücke
