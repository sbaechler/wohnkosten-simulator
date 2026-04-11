---
id: "US-017"
title: "Housing Market Spillovers: Evidence from the End of Rent Control in Cambridge, Massachusetts"
authors: ["Autor, David H.", "Palmer, Christopher J.", "Pathak, Parag A."]
year: 2014
institution: "MIT / Journal of Political Economy"
type: "peer-reviewed"
language: "en"
url: "https://economics.mit.edu/sites/default/files/publications/housing%20market%202014.pdf"
doi: "10.1086/675536"
status: "evaluated"
dag_nodes:
  - "mietrecht_kuendigungsschutz"
  - "mietrecht_kostenmiete"
  - "angebotspotenzial"
  - "investitionsattraktivitaet"
  - "aufwertungsdruck"
dag_edges_confirmed:
  - { from: "mietrecht_kuendigungsschutz", to: "investitionsattraktivitaet", sign: -1, note: "Abschaffung Mietpreiskontrolle führt zu massivem Preisanstieg bei ehemals kontrollierten UND nicht kontrollierten Wohnungen" }
  - { from: "mietrecht_kuendigungsschutz", to: "aufwertungsdruck", sign: -1, note: "Mietpreiskontrolle dämpft Aufwertungsdynamik; Abschaffung löst sie aus" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["US"]
city: "Cambridge, Massachusetts"
period_covered: "1988–1998"
---

## Zusammenfassung

Natürliches Experiment: 1994 schaffte Massachusetts durch Referendum die Mietpreiskontrolle in Cambridge
ab. Die Studie misst Spillover-Effekte auf kontrollierte UND nicht kontrollierte Wohnungen.

## Key Findings

- **Kontrollierte Wohnungen:** Preise stiegen um ca. 45% nach Abschaffung (Nachholeffekt)
- **Nicht kontrollierte Wohnungen (Spillover):** Preise stiegen ebenfalls signifikant (~25%) — positiver Spillover durch Aufwertung der Nachbarschaft
- **Investitionen:** Eigentümer investierten nach Deregulierung deutlich mehr in Sanierung und Modernisierung
- Mietpreiskontrolle hatte Neighbourhood Quality unterdrückt — Abschaffung löste Investitionsstau
- Haushalte in ehemals kontrollierten Einheiten hatten niedrigere Amenity-Werte erhalten

## Relevanz für DAG

- Komplementäre Evidenz zu Diamond et al. (2019, SF):
  Mietpreiskontrolle dämpft nicht nur Mieten, sondern auch Investitionen und Qualität
- `mietrecht_kuendigungsschutz → investitionsattraktivitaet` (sign: -1): bestätigt
- Wichtig: Spillover auf nicht kontrollierte Nachbarschaft sind positiv nach Abschaffung
  → Mietpreiskontrolle hat negative Externalitäten auf gesamte Nachbarschaft
- Für DAG: `mietrecht_kuendigungsschutz → aufwertungsdruck` (sign: -1) — Mietrecht dämpft Gentrifizierung

## Zitate

> "Owners of non-controlled housing bore a significant portion of the cost as rent-controlled properties lower the amenity value of their neighbourhood." (ResearchGate-Zusammenfassung)

> "We find that decontrol generated substantial positive spillovers onto the value of never-controlled properties." (Abstract-äquivalent)

## Notizen

- Klassische Studie, oft zitiert als Pendant zu Diamond et al. (2019)
- Cambridge ist dichtes städtisches Umfeld — vergleichbar mit europäischen Städten
- Sims (2007) ist weitere Boston-Area-Studie: Städte ohne Mietpreiskontrolle zeigten mehr Angebotswachstum
