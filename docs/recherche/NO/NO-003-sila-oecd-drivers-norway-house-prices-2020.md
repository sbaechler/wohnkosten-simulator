---
id: "NO-003"
title: "The Drivers of Norway's House Prices"
authors: ["Sila, Urban"]
year: 2020
institution: "OECD Economics Department"
type: "working-paper"
language: "en"
url: "https://www.oecd.org/en/publications/the-drivers-of-norway-s-house-prices_cb065dca-en.html"
doi: null
status: "evaluated"
dag_nodes: ["mietrecht_kuendigungsschutz", "steuer_eigenmietwert", "ctx:zinsniveau", "angebotspotenzial"]
dag_edges_confirmed: ["mietrecht_kuendigungsschutz -> mietpreis_schutzlevel", "steuer_eigenmietwert -> nachfragedruck"]
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
---

## Zusammenfassung

OECD Economics Department Working Paper No. 1599 (ECO/WKP(2020)7). Panelbasierte ökonometrische Analyse der Bestimmungsfaktoren von Hauspreisen in Norwegen im internationalen Vergleich. Identifiziert sowohl makroökonomische Fundamentaldaten als auch institutionelle Merkmale des norwegischen Wohnungsmarkts.

## Key Findings

- Norwegen-Hauspreise werden hauptsächlich getrieben von: hohem Haushaltseinkommen, Wohlstand, tiefen Zinsen, wachsender Bevölkerung
- Seit der Finanzkrise 2009 sind Preise moderat überbewertet (über fundamentalen Werten)
- **Institutionelle Faktoren** erhöhen Preise zusätzlich:
  - **Günstige steuerliche Behandlung von Wohneigentum** (kein Eigenmietwert besteuert)
  - **Strikte Mietpreiskontrolle** (für ältere Bestände)
  - Schwache Vermieter-Mieter-Regulierung
- Angebotsreaktivität auf Nachfrage sollte verbessert werden

## Relevanz für DAG

- **Bestätigt**: `steuer_eigenmietwert → nachfragedruck` (positiv — Nichtbesteuerung fördert Nachfrage)
- **Bestätigt**: `mietrecht_kuendigungsschutz → mietpreis_schutzlevel` + upward pressure on overall market
- Für den DAG: Imputed Rent Taxation fehlt in Norwegen → erhöht Eigenheimkäufer-Nachfrage → Preisniveaueffekt

## Zitate

> "Some structural and regulatory features of the Norwegian housing market also put upward pressure on prices: the favourable tax treatment of home ownership, strict rent controls and lax tenant-landlord regulations."

> "Improving further the responsiveness of housing supply to demand could also ease price pressures."

## Notizen

- OECD Working Paper No. 1599, Februar 2020
- PDF: https://one.oecd.org/document/ECO/WKP(2020)7/en/pdf
- Gute Ergänzung zu OECD 2022 (NO-002) das spezifische Reformempfehlungen enthält
- Relevant auch als erster Evidenzpunkt für Norwegen (bisher 0 Studien)
