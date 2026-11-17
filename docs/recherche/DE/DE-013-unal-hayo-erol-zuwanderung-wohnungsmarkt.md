---
id: "DE-013"
title: "The Effect of Immigration on the German Housing Market"
authors: ["Unal, Umut", "Hayo, Bernd", "Erol, Isil"]
year: 2022
institution: "Philipps-Universität Marburg (MAGKS Papers on Economics 202238)"
type: "working-paper"
language: "en"
url: "https://econpapers.repec.org/RePEc:mar:magkse:202238"
pdf: null
doi: "10.17192/es2024.0745"
status: "evaluated"
dag_nodes:
  - "ctx:zuwanderungsdruck"
  - "nachfragedruck"
  - "verdraengungsrisiko"
  - "eigentumsquoten_trend"
dag_edges_confirmed:
  - { from: "ctx:zuwanderungsdruck", to: "nachfragedruck", sign: +1, note: "Zuwanderung von 1 % der Ausgangsbevölkerung → Mieten kurzfristig rund +1 %, Wohnungspreise bis +3 % (Bartik-Instrument, kausal)" }
  - { from: "ctx:zuwanderungsdruck", to: "verdraengungsrisiko", sign: +1, note: "Preisanstieg im unteren Segment mehr als doppelt so hoch" }
  - { from: "ctx:zuwanderungsdruck", to: "eigentumsquoten_trend", sign: -1, note: "Kaufpreise für Wohnungen steigen stärker als Mieten → Eigentum schwerer erreichbar. Indirekt, nicht direkt gemessen" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["DE"]
period_covered: "2004–2020"
---

## Zusammenfassung

Paneldaten aus 382 deutschen Landkreisen und kreisfreien Städten, 2004–2020. Die
Autoren schätzen den kausalen Effekt internationaler Zuwanderung auf Mieten,
Wohnungspreise und Hauspreise. Als Instrument dient ein Bartik-Instrument aus
historischen Siedlungsmustern der Herkunftsgruppen.

Gefunden über einen Meinungsbeitrag von Rainer Zitelmann (Focus online,
17.11.2026), der die Studie als Artikel im *Journal of Real Estate Finance and
Economics* (2026) nennt. Die Zeitschriftenfassung ist nicht verifiziert; erfasst
ist das Arbeitspapier nach Abstract (EconPapers).

## Key Findings

- Zuwanderung von **1 % der Ausgangsbevölkerung** → Mieten kurzfristig **rund +1 %**,
  Wohnungspreise (Eigentumswohnungen) **bis +3 %**
- Hauspreise (Einfamilienhäuser) **nicht signifikant** betroffen
- Im **unteren Preissegment** ist der Preisanstieg **mehr als doppelt so hoch**
- **Kein signifikanter Unterschied** zwischen Stadt und Land
- Der Effekt ist als **kurzfristig** ausgewiesen

## Relevanz für DAG

- Belegt `ctx:zuwanderungsdruck → nachfragedruck` (+1) mit einer kausalen Elastizität
  in der Grössenordnung 1 (Mieten) bis 3 (Wohnungspreise)
- Stützt das hohe Gewicht in P1. Über P2/P3 sagt die Studie nichts aus
- Der stärkere Effekt im unteren Segment stützt `ctx:zuwanderungsdruck → verdraengungsrisiko`
  und die Gruppen-Divergenz (tiefe Einkommen stärker betroffen)
- Dass Kaufpreise stärker reagieren als Mieten, passt zum negativen Vorzeichen auf
  `eigentumsquoten_trend`

## Notizen

- Übertragbarkeit auf CH: Die Elastizität ist pro Prozent der Bevölkerung angegeben.
  Die Schweizer Städte liegen im Wanderungssaldo bei bis über 1.5 % pro Jahr
  (siehe `data/cities/switzerland.yaml`), deutlich über dem deutschen Kreisschnitt
- Bei sehr tiefem Leerstand (CH) dürfte der Mieteffekt eher grösser sein. Das ist eine
  Vermutung, die Studie testet es nicht
- Zur Einordnung: Sanchis-Guarner (2023, Spanien, *Regional Science and Urban
  Economics*) findet mit 1 Prozentpunkt mehr Zuwanderung +3.3 % Kaufpreise und +1 %
  Mieten, also fast dieselben Grössen
