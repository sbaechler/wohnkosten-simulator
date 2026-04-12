---
id: "GLOBAL-028"
title: "Equity and Efficiency Effects of Land Value Taxation"
authors: ["Kopczuk, Wojciech", "Munroe, David"]
year: 2022
institution: "IMF Working Paper"
type: "working-paper"
language: "en"
url: "https://www.imf.org/-/media/files/publications/wp/2022/english/wpiea2022263-print-pdf.ashx"
imf_wp: "WP/22/263"
status: "evaluated"
dag_nodes:
  - "boden_bodeneigentumssteuer"
  - "steuer_grundstueckgewinn"
  - "spekulationshemmung"
  - "investitionsattraktivitaet"
dag_edges_confirmed:
  - { from: "boden_bodeneigentumssteuer", to: "spekulationshemmung", sign: +1, note: "Land Value Tax reduziert Spekulation und verbessert Bodennutzungseffizienz" }
  - { from: "boden_bodeneigentumssteuer", to: "investitionsattraktivitaet", sign: -1, note: "Erhöht Attraktivität von Produktivinvestitionen gegenüber reiner Bodenpreisspekulation" }
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "Theoretical + empirical review up to 2022"
---

## Zusammenfassung

IMF Working Paper, das die Verteilungs- und Effizienzwirkungen einer Bodenwertsteuer (Land Value Tax) analysiert. Fasst theoretische und empirische Evidenz zusammen, inklusive historischer Beispiele (Pennsylvania, Dänemark, etc.).

## Key Findings

- Bodenwertsteuern sind hoch effizient, da sie keine Verzerrung der Investitionsentscheidungen verursachen (im Gegensatz zu Gebäudesteuern).
- Sie kapitalisieren vollständig in niedrigere Bodenpreise.
- Reduzieren Spekulation und verbessern die Allokation von Boden zu produktiveren Nutzungen.
- Können zur Reduktion von Ungleichheit beitragen, da Bodenbesitz stark konzentriert ist.
- Empirische Evidenz aus Dänemark, Pennsylvania und anderen LVT-Experimenten unterstützt die Theorie.

## Relevanz für DAG

- Kernreferenz für `boden_bodeneigentumssteuer` und `steuer_grundstueckgewinn`
- Bestätigt stark positive Wirkung auf `spekulationshemmung`
- Unterstützt die Idee, dass eine Verschiebung der Steuerlast vom Gebäude auf den Boden (`boden_*`-Parameter) sowohl effizient als auch verteilungsgerecht ist.

## Notizen

- Sehr gute Ergänzung zu GLOBAL-005 (IMF 2016 Property Tax) und den dänischen LVT-Studien (Høj, Nielsson)
- Hohe Relevanz für Schweiz (Diskussion um Eigenmietwert und Bodenbesteuerung)
---