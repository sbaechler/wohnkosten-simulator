---
id: "DE-001"
title: "Evaluation der Mietpreisbremse — Endbericht"
authors: ["DIW Berlin"]
year: 2019
institution: "Deutsches Institut für Wirtschaftsforschung (DIW Berlin)"
type: "government-report"
language: "de"
url: "https://www.bmjv.de/SharedDocs/Downloads/DE/Fachpublikationen/MPB_Gutachten_DIW.pdf"
doi: null
status: "evaluated"
dag_nodes: ["mietrecht_mietzinstransparenz", "mietrecht_anfangsmiete", "marktfriktion"]
dag_edges_confirmed:
  - { from: "mietrecht_anfangsmiete", to: "angebotspotenzial", sign: -1, note: "Mietpreisbremse zeigt positive Effekte auf Neubau in Kommunen mit Regulierung" }
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
regions: ["DE"]
period_covered: "2015–2019"
---

## Zusammenfassung
DIW-Evaluation der 2015 eingeführten Mietpreisbremse in Deutschland. Untersucht die Wirksamkeit der Regulierung, die auf Neuvertragsmieten max. 10 % über der ortsüblichen Vergleichsmiete liegt. Die Evaluation identifiziert moderate Dämpfungseffekte, Verlagerungseffekte in möblierte/befristete Mieten und strategische Umgehungen.

## Key Findings
- Moderate Dämpfung der Mietpreisanstiege bei Neuvertragsmieten in vielen, aber nicht allen Städten nachweisbar
- Verlagerungseffekt: signifikanter Anstieg von möblierten und befristeten Mietangeboten nach Einführung (IWU-Analyse)
- Positive Effekte auf die Zahl genehmigter Neubauwohnungen in Kommunen mit Mietpreisbremse erkennbar
- Fazit: Mietpreisbremse zeigt einige positive Effekte, ist aber in der Wirkung begrenzt

## Relevanz für DAG
Zeigt die Trade-offs von Mietzinsregulierung: Preisdämpfung im regulierten Sektor, Verlagerung in nicht-regulierte Segmente. Relevant für Knoten mietrecht_anfangsmiete, marktfriktion.

## Zitate
> "Die Mietpreisbremse zeigt einzelne positive Effekte, ist aber in der Wirkung begrenzt." (DIW Endbericht 2019)

## Notizen
- Auftraggeber: Bundesministerium der Justiz und für Verbraucherschutz (BMJV)
- Datenerhebung durch IWU (Institut Wohnen und Umwelt)
- Verlagerungseffekt auf möblierte Wohnungen ist ein zentraler Befund
