---
id: "GLOBAL-005"
title: "Can Property Taxes Reduce House Price Volatility? Evidence from U.S. Regions"
authors: ["Égert, Balázs", "Mihaljek, Dubravko"]
year: 2016
institution: "International Monetary Fund"
type: "working-paper"
language: "en"
url: "https://www.imf.org/external/pubs/ft/wp/2016/wp16216.pdf"
doi: null
imf_wp: "WP/16/216"
status: "evaluated"
dag_nodes:
  - "steuer_grundstueckgewinn"
  - "steuer_eigenmietwert"
  - "steuer_leerstandsabgabe"
  - "steuer_handaenderung"
  - "spekulationshemmung"
  - "investitionsattraktivitaet"
dag_edges_confirmed:
  - { from: "steuer_grundstueckgewinn", to: "spekulationshemmung", sign: +1, note: "Höhere Grundstückgewinnsteuer dämpft kurzfristige Spekulation" }
  - { from: "steuer_eigenmietwert", to: "investitionsattraktivitaet", sign: -1, note: "Eigenmietwert reduziert steuerliche Begünstigung von Wohneigentum" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL", "US"]
period_covered: "1975–2012"
---

## Zusammenfassung

Empirische Studie über die Wirkung verschiedener Steuern auf Wohnpreisvolatilität und -niveau.
Analysiert theoretisches Framework zu Mortgage Rate Deductibility, Eigenmietwert, Capital Gains Tax,
Grundstückssteuer und deren Wirkung auf Wohnmärkte.

## Key Findings

- Grundstücksgewinnsteuern dämpfen kurzfristige Preisspitzen und reduzieren Spekulation
- Abschaffung des Eigenmietwerts (oder Einführung: rent tax deduction) begünstigt Wohneigentum und treibt Preise
- Recurrent property taxes (jährlich) stabilisieren Preise, während transaktionsbasierte Steuern Mobilität hemmen
- Mortgage interest deductibility verstärkt Preiszyklen (US-Evidenz)
- Trade-off: Transaktionssteuern hemmen Mobilität, sind aber einfacher durchzusetzen

## Relevanz für DAG

- Bestätigt alle `steuer_*`-Kanten als relevant
- `steuer_grundstueckgewinn → spekulationshemmung` (sign: +1) ✓
- `steuer_eigenmietwert → investitionsattraktivitaet` (sign: -1): Abschaffung Eigenmietwert würde Investitionen ankurbeln
- `steuer_leerstandsabgabe → spekulationshemmung` (sign: +1): Theoretisch plausibel, empirisch wenig direkte Evidenz
- `steuer_handaenderung → marktfriktion` (sign: +1): Hohe Handänderungssteuern hemmen Mobilität

## Zitate

> "Recurrent property taxes, by raising the cost of holding property, tend to reduce house price volatility." (S. 5)

> "Capital gains taxes on housing discourage speculative activity, particularly in the short run." (S. 18)

## Notizen

- Wichtige Referenz für alle Steuerhebel im DAG
- Ergänzung: IMF WP/2022/263 "Equity and Efficiency Effects of Land Value Taxation" für Bodensteuer
- Schweiz-Spezifikum: Eigenmietwert-Abschaffung politisch diskutiert — direkte Policy-Relevanz
