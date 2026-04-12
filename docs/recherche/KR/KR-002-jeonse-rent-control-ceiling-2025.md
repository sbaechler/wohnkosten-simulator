---
id: "KR-002"
title: "Putting a ceiling on housing costs: The aftermath of nationwide rent control in the case of jeonse system in Korea"
authors: ["Unbekannt (ScienceDirect 2025)"]
year: 2025
institution: "Unbekannt"
type: "peer-reviewed"
language: "en"
url: "https://www.sciencedirect.com/science/article/abs/pii/S105113772500004X"
doi: "10.1016/j.jhe.2025.XXX"
status: "found"
dag_nodes: ["mietrecht_anfangsmiete", "mietrecht_kuendigungsschutz", "angebotspotenzial"]
dag_edges_confirmed: ["mietrecht_anfangsmiete -> mietpreis_schutzlevel"]
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
---

## Zusammenfassung

Analyse der Auswirkungen der koreanischen Mietpreisdeckel-Gesetzgebung von 2020 auf den Jeonse-Markt (Mietmarkt mit Pauschaldeposit-System). 2020 wurde per Gesetzesänderung ein 5 %-Cap auf Mieterhöhungen bei Jeonse-Verlängerungen eingeführt. Das Jeonse-System ist einzigartig für Korea: Mieter zahlen einen hohen Einmaldeposit (oft 50–80 % des Marktwerts) statt monatlicher Miete.

## Key Findings

- **+17,7 %** Anstieg der Mietkosten im Großraum Seoul über einen Zeitraum von 2 Jahren nach Einführung des 5 %-Caps
- Paradoxes Ergebnis: der Cap sollte Mieten deckeln, erhöhte sie aber durch Marktanpassung (Landlords erhöhten Deposits bei neuen Verträgen stark)
- Mechanismus: bestehende Jeonse-Verträge wurden nur moderat erhöht (max 5 %), aber bei Neuvermietung wurden die Deposits massiv erhöht
- Kausalanalyse mit Difference-in-Differences

## Relevanz für DAG

- **Bestätigt** und **qualifiziert**: `mietrecht_anfangsmiete → mietpreis_schutzlevel` — kurzfristig schützend für Bestandsmieter
- **Zeigt Gegeneffekt**: bei Neuvermietung (anfangsmiete) können Preise stark steigen als Reaktion auf caps
- Für den DAG: Korea zeigt Backdoor-Effekte von Mietregulierung (Deposithöhe statt Monatsmiete)

## Zitate

> "The new amendment to Korea's rent control policy in 2020 capped rent increases at 5 % during lease renewals. This policy led to a 17.7 % increase in rental costs for tenants in the Greater Seoul area over a 2-year period."

## Notizen

- Jeonse = einzigartiges koreanisches System: Einmaldeposit statt monatlicher Miete
- PII: S105113772500004X → Journal of Housing Economics (ISSN 1051-1377)
- Publikationsdatum: Februar 2025
- Weitere Detailanalyse der Studie wäre wertvoll (Autoren, DOI klären)
