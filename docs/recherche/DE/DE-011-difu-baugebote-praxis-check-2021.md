---
id: "DE-011"
title: "Praxis-Check Baugebote"
authors: ["Deutsches Institut für Urbanistik (Difu)"]
year: 2021
institution: "Difu / Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen"
type: "government-report"
language: "de"
url: "https://difu.de/projekte/praxis-check-baugebote"
status: "evaluated"
dag_nodes:
  - "boden_bauverpflichtung"
  - "bau_bewilligungsverfahren"
  - "angebotspotenzial"
dag_edges_confirmed:
  - { from: "boden_bauverpflichtung", to: "angebotspotenzial", sign: +1, note: "Vertragliche Bauverpflichtungen sind in der Praxis das bevorzugte Mittel gegenüber hoheitlichem Baugebot" }
  - { from: "boden_bauverpflichtung", to: "bau_bewilligungsverfahren", sign: -1, note: "Baugebote führen häufig zu langen Gerichtsverfahren und Verzögerungen" }
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
regions: ["DE"]
period_covered: "2010–2021"
---

## Zusammenfassung

Praxisorientierte Studie des Difu zur Anwendung von Baugeboten und Bauverpflichtungen in deutschen Kommunen. Untersucht, warum hoheitliche Baugebote selten angewendet werden und welche alternativen Instrumente (vertragliche Bauverpflichtungen) in der Praxis dominieren.

## Key Findings

- Kommunen bevorzugen **vertragliche Bauverpflichtungen** statt des hoheitlichen Baugebots (§ 176 BauGB), da letzteres mit hohen rechtlichen Risiken und langen Gerichtsverfahren verbunden ist.
- Baugebote führen häufig zu jahrzehntelangen Rechtsstreitigkeiten.
- Vertragliche Lösungen mit Eigentümern (Bauverpflichtung + Wiederkaufsrecht) sind deutlich praxistauglicher.
- Es fehlen gute empirische Langzeitstudien zu den tatsächlichen Preiseffekten von Bauverpflichtungen.

## Relevanz für DAG

- Wichtigste bisher gefundene praktische Evaluation zu `boden_bauverpflichtung`.
- Zeigt, dass das Instrument in der Praxis schwächer wirkt als theoretisch erwartet, weil es selten hoheitlich durchgesetzt wird.
- Unterstreicht die Lücke: Es gibt kaum quantitative Studien zu den Preiseffekten oder dem tatsächlichen Beitrag zur Angebotsausweitung.

## Notizen

- Bestätigt die kritische Lücke: Gute empirische Wirkungsanalysen zu Bauverpflichtungen fehlen weitgehend.
- Die Studie ist eher praxisorientiert (Handlungsempfehlungen für Kommunen) als ökonometrisch.
- Ergänzt die rechtlichen Analysen aus dem Bundestag und BGH-Urteilen.
---