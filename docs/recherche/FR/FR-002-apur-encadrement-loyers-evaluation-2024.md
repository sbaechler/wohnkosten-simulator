---
id: "FR-002"
title: "Évaluation d'impact de l'encadrement des loyers à Paris (2019–2022)"
authors: ["APUR", "Ville de Paris"]
year: 2024
institution: "Atelier Parisien d'Urbanisme (APUR)"
type: "government-report"
language: "fr"
url: "https://www.apur.org/sites/default/files/rapport_encadrement_loyers_paris.pdf"
doi: null
status: "evaluated"
dag_nodes: ["mietrecht_anfangsmiete", "mietrecht_mietzinstransparenz", "mietpreis_schutzlevel", "marktfriktion"]
dag_edges_confirmed: ["mietrecht_anfangsmiete → mietpreis_schutzlevel (sign: +1)"]
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
---

## Zusammenfassung

Offizielle Wirkungsevaluation des Pariser Mietpreisdeckels (encadrement des loyers), der seit Juli 2019 gilt. Verwendet eine **Difference-in-Differences**-Methode (kausale Inferenz) und vergleicht Paris mit ähnlichen nicht-regulierten Städten als Kontrollgruppe. Die bislang robusteste quantitative Studie zur französischen Mietregulierung.

## Key Findings

- **-4,2 % Mietpreiseffekt** zwischen Juli 2019 und Juni 2022, gegenüber dem Szenario ohne Regulierung
- Das entspricht durchschnittlich **768 € Ersparnis pro Jahr** für regulierte Mieter
- Effekt steigt über die Zeit: Anfangs moderat, dann zunehmend stärker bei steigendem Marktdruck
- Kausale Methodik: Difference-in-Differences, Kontrolle für IRL (Mietindex), Inflation, Konjunktur
- Keine Angaben zu Angebotseffekten (Studie misst nur Mietpreisniveau, nicht Leerstand oder Neubau)

## Relevanz für DAG

**Bestätigt:**
- `mietrecht_anfangsmiete` → `mietpreis_schutzlevel` (sign: +1, weight: 0.8, time: short-medium)

**Offen (nicht gemessen):**
- Angebotseffekte (Leerstand, Rückzug aus Mietmarkt) sind nicht Teil der Studie — bleibt Lücke
- Langfristeffekte (>3 Jahre) noch nicht bekannt

## Zitate

> "Cet effet est de –4,2 % entre juillet 2019 et juin 2022, par rapport à la hausse qui serait intervenue en l'absence d'encadrement, soit 768 € d'économie par an en moyenne."

## Notizen

- Schließt die **Frankreich-Lücke** (FR-001 war historische 1990er-Studie)
- Gute methodische Qualität dank kausaler Inferenz
- Paris hat encadrement des loyers 2019 wieder eingeführt nach Zwangspause (2017 Rechtslage)
- Gibt es auch für Lyon: Bonneval et al. (2022) — könnte als FR-003 ergänzt werden
