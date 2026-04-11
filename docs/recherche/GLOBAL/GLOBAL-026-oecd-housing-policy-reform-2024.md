---
id: "GLOBAL-026"
title: "An Agenda for Housing Policy Reform"
authors: ["OECD"]
year: 2024
institution: "Organisation for Economic Co-operation and Development"
type: "government-report"
language: "en"
url: "https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/10/an-agenda-for-housing-policy-reform_450b3a9a/ddb57031-en.pdf"
doi: null
status: "evaluated"
dag_nodes:
  - "raumplanung_verdichtung"
  - "gemeinnuetzig_mindestanteil"
  - "mietrecht_kuendigungsschutz"
  - "steuer_grundstueckgewinn"
  - "kapital_hypothekarregulierung"
  - "angebotspotenzial"
  - "mietpreis_schutzlevel"
dag_edges_confirmed:
  - { from: "raumplanung_verdichtung", to: "angebotspotenzial", sign: +1, note: "OECD empfiehlt Upzoning und Verdichtung als prioritäre Massnahme für Affordability" }
  - { from: "gemeinnuetzig_mindestanteil", to: "gemeinnuetzig_kraft", sign: +1, note: "Sozialwohnungsbau als Ergänzung, nicht Ersatz für Marktreformen" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "2015–2024"
countries: "OECD-Mitglieder (38 Länder)"
---

## Zusammenfassung

OECD-Reformagenda für Wohnungspolitik (Oktober 2024). Synthetisiert Evidenz aus allen OECD-Ländern
und destilliert einen umfassenden Policy-Werkzeugkasten. Zeigt, wie inklusive, effiziente und
nachhaltige Wohnungsmärkte gestaltet werden können.

## Key Findings

- Wohnkosten sind in den meisten OECD-Ländern auf historischen Höchstständen — breite, systemische Krise
- **Priorität 1:** Angebotsausweitung durch Verdichtung und Upzoning (Regulierungsreform)
- **Priorität 2:** Überarbeitung von Steuerpolitiken (weniger auf Transaktionen, mehr auf Bodenwert)
- Mieterschutz: Balance zwischen Schutz und Angebotswirkung ist zentral
- Sozialwohnungsbau: Ergänzend, nicht substituierend für Marktreformen
- Makroprudenzielle Instrumente (LTV, DTI): Wirksam für Finanzstabilität, aber moderate Effekte auf Affordability
- Regionale Koordination: Zonierung und Verkehrsplanung müssen zusammen gedacht werden

## Relevanz für DAG

- Breiteste verfügbare Synthese für OECD-Politiken → Validierung des gesamten DAG-Frameworks
- Bestätigt, dass `raumplanung_verdichtung` der wirksamste Hebel für Affordability ist
- Steuerreformen in Richtung Bodenwertsteuer (statt Transaktionssteuern) bestätigt
- Sozialwohnungsbau-Kanten: komplementär, nicht konkurrierend zur Angebotsseite

## Notizen

- Aktuellste und umfassendste OECD-Synthese (Oktober 2024)
- Ergänzt OECD Housing Outlook und Society at a Glance 2024
- Direkt verwendbar als Benchmark für DAG-Gewichte
