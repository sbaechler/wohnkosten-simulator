---
id: "DE-004"
title: "Forward to the Past: Short-Term Effects of the Rent Freeze in Berlin (Mietendeckel)"
authors: ["Hahn, Anja M.", "Kholodilin, Konstantin A.", "Waltl, Sofie R.", "Fongoni, Marco"]
year: 2024
institution: "Management Science (Journal)"
type: "peer-reviewed"
language: "en"
url: "https://doi.org/10.1287/mnsc.2023.4775"
doi: "10.1287/mnsc.2023.4775"
status: "evaluated"
dag_nodes: ["mietrecht_kuendigungsschutz", "mietrecht_anfangsmiete", "angebotspotenzial", "verdraengungsrisiko"]
dag_edges_confirmed:
  - { from: "mietrecht_anfangsmiete", to: "angebotspotenzial", sign: -1, note: "Anzahl verfügbarer Mietobjekte ging signifikant zurück nach Einführung" }
  - { from: "mietrecht_anfangsmiete", to: "nachfragedruck", sign: 1, note: "Abwanderung in nicht-reguliertes Umland Brandenburg erhöhte Mieten dort" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["DE"]
period_covered: "2019–2021"
---

## Zusammenfassung
Ökonometrische Studie zur Wirkung des Berliner Mietendeckels (Mietenstopp auf Niveau Juni 2019, Inkrafttreten Feb. 2020). Nutzt Inseratedaten von 2019–2021 und identifiziert kausale Effekte mittels Difference-in-Differences und Event-Study-Designs. Zeigt: Mietpreise sanken kurzfristig, aber Angebotsverknappung und Umland-Spillover führten langfristig zu negativen Nettoeffekten für Mieter.

## Key Findings
- Mietpreise regulierter Wohnungen sanken signifikant (mechanischer Effekt nach Inkrafttreten)
- Angebotsrückgang: Anzahl verfügbarer Mietobjekte ging signifikant zurück; dauerhafter Teilverlust für den Mietmarkt
- Abwanderung in Umland: Rasch steigende Mieten in angrenzenden, nicht regulierten Brandenburg-Gemeinden (Rent Gap an der Stadtgrenze)
- Hedging-Strategie: Vermieter sicherten sich vertraglich gegen langfristig niedrige Fixmieten ab; Risiko vollständig zulasten der Mieter
- Nettoeffekt: Negative Folgen für Mieter überwiegen nach dieser Analyse die positiven

## Relevanz für DAG
Zentrale Studie für den DAG-Knoten mietrecht_anfangsmiete und den Trade-off zu angebotspotenzial und verdraengungsrisiko. Zeigt Verdrängungseffekte über Stadtgrenzen hinweg.

## Zitate
> "Nettoeffekt: Negative Folgen für Mieter überwiegen nach dieser Analyse die positiven." (Hahn et al. 2024)

## Notizen
- Management Science 70(3), 2024
- Policy Brief: DIW Wochenbericht 8/2021
- Nutzt Inseratedaten von 2019–2021
- Bezogen auf Mietendeckel Feb. 2020 – Verfassungsgerichtsurteil April 2021
