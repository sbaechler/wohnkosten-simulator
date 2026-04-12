---
id: "GLOBAL-027"
title: "The Effects of Inclusionary Zoning on Local Housing Markets"
authors: ["Schuetz, Jenny", "Been, Vicki", "Ellen, Ingrid Gould"]
year: 2012
institution: "Furman Center NYU / Journal of Urban Economics"
type: "peer-reviewed"
language: "en"
url: "https://furmancenter.org/files/publications/Long_working_paper_08.pdf"
status: "evaluated"
dag_nodes:
  - "gemeinnuetzig_mindestanteil"
  - "gemeinnuetzig_baurecht"
  - "gemeinnuetzig_sozialmischung"
  - "angebotspotenzial"
dag_edges_confirmed:
  - { from: "gemeinnuetzig_mindestanteil", to: "gemeinnuetzig_kraft", sign: +1, note: "Mandatory IZ mit Density Bonus produziert signifikant mehr bezahlbare Einheiten als freiwillige Programme" }
  - { from: "gemeinnuetzig_mindestanteil", to: "angebotspotenzial", sign: -1, note: "Strenge IZ kann Gesamtangebot reduzieren, wenn keine ausreichenden Ausgleichsmechanismen" }
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
regions: ["GLOBAL", "US"]
period_covered: "1990–2010"
---

## Zusammenfassung

Frühe systematische Analyse von Inclusionary Zoning (IZ) Programmen in den USA. Vergleicht mandatory vs. voluntary Programme und den Einfluss von Density Bonuses und in-lieu fees.

## Key Findings

- Mandatory IZ-Programme mit Density Bonus (z. B. Montgomery County) produzieren deutlich mehr affordable units als freiwillige Programme.
- Niedrige in-lieu fees machen Programme schwach.
- IZ kann das Gesamtangebot reduzieren, wenn die regulatorische Belastung zu hoch ist und keine ausreichenden Ausgleichsmechanismen vorhanden sind.
- Policy-Design ist entscheidend: Kostenausgleich (Density Bonus, fee-in-lieu, fast-track permits) bestimmt den Nettoeffekt auf das Gesamtangebot.

## Relevanz für DAG

- Wichtig für `gemeinnuetzig_mindestanteil` und `gemeinnuetzig_baurecht`
- Zeigt Trade-off: höherer Mindestanteil kann `angebotspotenzial` senken, wenn nicht gut designed
- Bestätigt, dass `gemeinnuetzig_sozialmischung` nur bei guter Policy-Design funktioniert

## Notizen

- Ergänzt die neueren Studien zu IZ (Li & Guo 2022, HUD 2023)
- Policy-Lektion: Density Bonus ist entscheidend für Akzeptanz bei Entwicklern
- Für CH relevant bei Diskussion um Mindestanteile in neuen Zonen
---