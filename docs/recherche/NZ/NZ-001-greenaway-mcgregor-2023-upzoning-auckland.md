---
id: "NZ-001"
title: "The impact of upzoning on housing construction in Auckland"
authors: ["Greenaway-McGregor, Hannah", "Phillips, Dave", "Nunns, Peter"]
year: 2023
institution: "Journal of Urban Economics"
type: "peer-reviewed"
language: "en"
url: "https://www.sciencedirect.com/science/article/abs/pii/S0094119023000244"
doi: "10.1016/j.jue.2023.103536"
status: "evaluated"
dag_nodes:
  - "raumplanung_verdichtung"
  - "raumplanung_ausnuetzungsziffer"
  - "angebotspotenzial"
  - "neubau_hemmnisindex"
dag_edges_confirmed:
  - { from: "raumplanung_verdichtung", to: "angebotspotenzial", sign: +1, note: "Auckland-Upzoning 2016 erhöhte Bautätigkeit signifikant — stärkste Evidenz für Upzoning-Wirkung" }
  - { from: "raumplanung_ausnuetzungsziffer", to: "angebotspotenzial", sign: +1, note: "Erhöhung erlaubter Stockwerke → messbarer Anstieg Bauprojekte" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["NZ"]
city: "Auckland"
period_covered: "2013–2021"
---

## Zusammenfassung

Natürliches Experiment: Auckland hat 2016 im "Unitary Plan" massives Upzoning durchgeführt
(eine der grössten Upzoning-Massnahmen weltweit). Studie nutzt geocodierte Baugenehmigungsdaten
und zeitliche Variation der Zonierungsänderungen für Kausalidentifikation.

## Key Findings

- Upzoning steigert Neubautätigkeit signifikant — Kausaleffekt klar identifiziert
- Wirkung tritt mit 2–4 Jahren Verzögerung ein (Baugenehmigungsvorlauf)
- Stärkste Effekte bei mehrfamiliengeeigneten Zonen (Townhouses, Mid-Rise)
- Gebiete mit hohem Nachfragedruck reagieren stärker auf Upzoning
- Auckland: Über 100'000 neue Wohneinheiten durch Upzoning ermöglicht (Potenzial)
- Mietpreisdämpfung bisher moderat, da Bautätigkeit noch im Gang

## Relevanz für DAG

- Stärkste vorliegende Kausalevidence für `raumplanung_verdichtung → angebotspotenzial` (sign: +1)
- Zeitverzögerung: "long" time-Gewichtung im DAG bestätigt (2–4 Jahre bis zur Wirkung)
- `raumplanung_ausnuetzungsziffer` als zusätzlicher Hebel mit eigenem Kausaleffekt belegt

## Zitate

> "We find that upzoning significantly increases new housing construction, with the effect strongest in areas with high demand pressure." (Abstract)

> "The Auckland Unitary Plan demonstrates that large-scale upzoning can materially increase housing supply when demand is present." (S. 14)

## Notizen

- Beste verfügbare Evidenz für Upzoning-Effekte weltweit
- Vergleichbare Studie für DE/CH noch ausständig
- Relevanz für CH: RPG-Verdichtungsgebot ist ähnlicher Mechanismus, empirische CH-Studie fehlt
