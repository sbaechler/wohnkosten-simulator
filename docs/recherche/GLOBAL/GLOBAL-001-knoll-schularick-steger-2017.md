---
id: "GLOBAL-001"
title: "No Price Like Home: Global House Prices, 1870–2012"
authors: ["Knoll, Katharina", "Schularick, Moritz", "Steger, Thomas Michael"]
year: 2017
institution: "American Economic Review / CEPR"
type: "peer-reviewed"
language: "en"
url: "https://www.aeaweb.org/articles?id=10.1257/aer.20150501"
doi: "10.1257/aer.20150501"
ssrn: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2503396"
status: "evaluated"
dag_nodes:
  - "ctx:zinsniveau"
  - "ctx:wirtschaftskraft"
  - "ctx:bevoelkerungstrend"
  - "angebotspotenzial"
  - "spekulationshemmung"
dag_edges_confirmed:
  - { from: "ctx:zinsniveau", to: "investitionsattraktivitaet", sign: -1, note: "Tiefe Zinsen = steigende Preise, historisch robust" }
  - { from: "boden_mehrwertabgabe", to: "spekulationshemmung", sign: +1, note: "Land-Price-Anteil = Haupttreiber; Bodenbesteuerung direkt relevant" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "1870–2012"
countries: 14
---

## Zusammenfassung

Erste umfassende langfristige Studie zu Hauspreisentwicklung in 14 Industrieländern von 1870 bis 2012.
Zeigt, dass Hauspreise real bis Mitte des 20. Jh. stagniert haben, dann aber stark gestiegen sind —
insbesondere ab den 1970ern. Haupttreiber: Anstieg der **Landpreise**, nicht der Baukosten.

## Key Findings

- Hauspreise in 14 Ländern stiegen real im Durchschnitt um das ~2.5-Fache zwischen 1950 und 2012
- Bis ca. 1950: stabile Hauspreise, da Baukosten und Landpreise im Gleichgewicht
- Nach 1950: Landpreise explodieren, während Baukosten relativ konstant bleiben
- Der Anstieg ist primär auf **Bodenknappheit** zurückzuführen, nicht auf höhere Baukosten
- Enge Korrelation mit sinkenden Zinsen (v.a. ab 1980er)
- Länder mit restriktiver Raumplanung/Zonierung zeigen stärkere Landpreisanstiege

## Relevanz für DAG

- **Stärkster Befund:** Landpreise (nicht Baukosten) sind der entscheidende Hebel
  → Direkte Unterstützung für `boden_*`-Kanten (Vorkaufsrecht, Mehrwertabgabe, Bauverpflichtung)
- Zinsniveau ist ein starker Kontextfaktor: `ctx:zinsniveau → investitionsattraktivitaet` (sign: -1) historisch belegt
- Raumplanungsrestriktionen verstärken Landpreisanstiege: `raumplanung_zonenreserve → angebotspotenzial` (sign: -1) ✓

## Zitate

> "The dominant driver of rising house prices in the second half of the twentieth century has been the price of land, not construction costs." (S. 331)

> "Land prices rose by 400% in real terms between 1950 and 2012, whereas construction costs remained roughly constant." (S. 340)

## Notizen

- Fundamentale Referenzstudie — wird in fast allen Housing-Papers zitiert
- Daten für 14 Länder (AU, BE, CH, DE, DK, FR, JP, NL, NO, SE, UK, US, FI, PT)
- Schweiz enthalten → direkt relevant
- Knoll et al. identifizieren Zinsniveau und Raumplanung als Moderatoren
