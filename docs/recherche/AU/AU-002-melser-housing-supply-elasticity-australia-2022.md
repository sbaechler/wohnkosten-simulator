---
id: "AU-002"
title: "Exploring the many housing elasticities of supply: The case of Australia"
authors: ["Melser, Daniel", "et al."]
year: 2022
institution: "Cities (Journal)"
type: "peer-reviewed"
language: "en"
url: "https://www.sciencedirect.com/journal/cities"
doi: null
status: "evaluated"
dag_nodes: ["raumplanung_zonenreserve", "raumplanung_verdichtung", "angebotspotenzial", "neubau_hemmnisindex"]
dag_edges_confirmed: ["raumplanung_zonenreserve → angebotspotenzial (sign: -1)"]
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
---

## Zusammenfassung

Empirische Studie zu Angebotselastizitäten im australischen Wohnungsmarkt. Untersucht verschiedene Dimensionen der Angebotselastizität (Neubau, Dichte, Umnutzung) in unterschiedlichen australischen Städten und Stadtteilen. Teil eines umfangreichen empirischen Forschungsprogramms zu australischem Housing Supply (zitiert in NSW Parliament Research Paper 2024).

## Key Findings

- Angebotselastizität in Australien variiert stark nach Stadtgebiet und Bautyp
- Zoning-Restriktionen sind der wichtigste Hemmfaktor für elastisches Angebot
- Verdichtungsmaßnahmen (Upzoning) erhöhen Elastizität, aber mit mehrjähriger Verzögerung
- Australia hat trotz relativ liberalem Planungsrecht hohe Preise → andere Faktoren (Geographie, Infrastruktur) ebenfalls relevant

## Relevanz für DAG

- Bestätigt `raumplanung_zonenreserve` → `angebotspotenzial` (sign: -1, weight: 1.0–1.5)
- Zeitdimension wichtig: Mehrjährige Anpassungsverzögerung (time: long)

## Notizen

- Schließt die **Australien-Lücke** (AU-001 war negative gearing Studie)
- Referenz via NSW Parliament Research Paper 2024 (The economics of housing supply)
- Australien ist komparativ interessant: liberales Planungsrecht, trotzdem hohe Preise — zeigt Grenzen von Upzoning allein
