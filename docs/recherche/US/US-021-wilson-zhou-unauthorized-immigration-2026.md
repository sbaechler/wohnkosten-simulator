---
id: "US-021"
title: "The Impacts of Unauthorized Immigration on U.S. Labor and Housing Markets: New Evidence from Administrative Microdata"
authors: ["Wilson, Daniel J.", "Zhou, Xiaoqing"]
year: 2026
institution: "Federal Reserve Bank of Dallas (WP 2607, 6.3.2026); Neuauflage FRB San Francisco (WP 2026-23)"
type: "working-paper"
language: "en"
url: "https://www.dallasfed.org/research/papers/2026/wp2607"
pdf: "https://www.dallasfed.org/~/media/documents/research/papers/2026/wp2607.pdf"
doi: "10.24149/wp2607"
status: "evaluated"
dag_nodes:
  - "ctx:zuwanderungsdruck"
  - "nachfragedruck"
  - "angebotspotenzial"
  - "eigentumsquoten_trend"
dag_edges_confirmed:
  - { from: "ctx:zuwanderungsdruck", to: "nachfragedruck", sign: +1, note: "IV, 2021–2024: Zuwanderung erwerbstätiger Personen von 1 % der Beschäftigung → Hauspreise +2.2 %, Marktmieten +1.4 % (Tab. 6, S. 43)" }
  - { from: "ctx:zuwanderungsdruck", to: "eigentumsquoten_trend", sign: -1, note: "Kaufpreise reagieren stärker als Mieten (2.2 gegen 1.4). Indirekt" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["US"]
period_covered: "2021–2024 (Boom), 2024–2025 (Abschwung, nur Arbeitsmarkt)"
---

## Zusammenfassung

Untersucht den Boom der unautorisierten Zuwanderung in die USA (März 2021 bis
März 2024, rund 7 Mio. Personen netto) und die Abschwächung ab Mitte 2024.
Zu- und Abflüsse werden aus individuellen Gerichts- und Parole-Daten (TRAC/FOIA)
auf Kreisebene gebaut und zu Arbeitsmarktregionen (CZ) und Metropolregionen (MSA)
aggregiert. Identifikation über ein zweifach bereinigtes Shift-Share-Instrument
(Leave-out-Shift × Leave-out-Share, nach Card 2001 und Terry et al. 2026).
Erstes Stadium beim Wohnungsmarkt: F ≈ 14 (Tab. 6).

Gelesen im Volltext (WP 2607, März 2026). Seitenzahlen beziehen sich auf die
Paginierung des Papers.

## Key Findings

**Wohnungsmarkt (Boom 2021–2024, MSA, Zillow, Tab. 6, S. 42–43):**

- Zuwanderung erwerbstätiger Personen von **1 % der Ausgangsbeschäftigung** →
  Hauspreise **+2.2 %**, Marktmieten **+1.4 %** (IV)
- Mieten Einfamilienhaus **+1.2 %**, Mehrfamilienhaus **+1.5 %**
- **Neubau** (Baubewilligungen / Bestand): IV klein und **nicht signifikant**
  (gesamt −0.21, MFH +0.01). Auch die Beschäftigung im Bau steigt kaum
  → Nachfrageschock auf kurzfristig fixes Angebot
- Robustheit: CoreLogic- und Freddie-Mac-Preisindizes nur rund +1 %, nicht
  signifikant (Tab. B4). Selbstangaben aus der ACS: kein signifikanter Effekt (Tab. B5)

**Anteil am Anstieg 2021–2024 (Tab. 5, S. 39):**

| | Median-MSA | Durchschnitt (gewichtet) |
|---|---|---|
| Zuwanderung in % der Beschäftigung | 1.3 % | 3.1 % |
| Beitrag Hauspreise | 2.9 % von 22.3 % → **13 %** | 6.6 % von 22.4 % → **30 %** |
| Beitrag Mieten | 1.9 % von 22.3 % → **9 %** | 4.3 % von 21.6 % → **20 %** |

Die oft zitierten 30 % / 20 % gelten für den beschäftigungsgewichteten Durchschnitt,
also für die grossen Zuzugsregionen. In der typischen Region ist der Beitrag
etwa halb so gross.

**Mechanismus (S. 45):** Das Gesamteinkommen der Region steigt nicht signifikant,
die Preise steigen trotzdem. Erklärung der Autoren: Verschiebung hin zu Haushalten
mit tiefem Einkommen und hohem Wohnkostenanteil, bei kurzfristig fixem Angebot.

**Arbeitsmarkt:** Beschäftigung steigt etwa 1:1 (IV 0.96), Löhne nicht signifikant
(IV −0.93). Staatliche Transfers pro Kopf sinken (−5 %).

## Literatur im Paper (für P2/P3 relevant, S. 8 und 44)

Wiedergabe der Autoren; am Original geprüft in US-022 und US-023.

- **Saiz (2007)**, legale Zuwanderung USA 1985–1998: 1 % der Bevölkerung →
  Mieten ≈ +1 %, Preise +2 % (OLS) bzw. gut +3 % (IV). US-022: Mieten bestätigt,
  die IV-Preise von gut 3 % im Arbeitspapier nicht gefunden (höchstens 2.57)
- **Cabral & Steingress (2026)**, 1980–2019: Mieten-Elastizität ≈ 2, Preise 2–3
- **Monras (2020)**, Peso-Krise 1995: kurzfristig Preise hoch, nach 5+ Jahren
  sinkende Mieten durch billigere Bauarbeit und Wegzug Einheimischer. US-023
  präzisiert: Der Mietvorsprung der Zuzugsregionen ist nach etwa 3 Jahren weg,
  über 1990–2000 sinken Mieten und Preise dort relativ zu anderen Regionen.
  Erklärung im Paper ist der Bausektor, nicht der Wegzug Einheimischer
- **Howard et al. (2024)**, Ausschaffungen: kurzfristige Preisrückgänge, die sich
  rasch umkehren, weil das Angebot schrumpft

## Relevanz für DAG

- Stützt `ctx:zuwanderungsdruck → nachfragedruck` (+1) mit kausaler, kurzfristiger
  Elastizität. Grössenordnung deckungsgleich mit DE-013 und Saiz (2007)
- **Kurzfristig keine Angebotsreaktion** (Tab. 6d) → hohes P1-Gewicht berechtigt
- Zum Abbau `[1.0, 0.8, 0.6]` über die Phasen: Monras (US-023) zeigt ein Nachlassen
  nach etwa 3 Jahren, aber nur als Unterschied zwischen US-Regionen, nicht für einen
  nationalen Schock. Saiz (US-022) findet über 14 Jahre kein Nachlassen. Die Richtung
  ist plausibel, die Grösse bleibt Setzung
- Kaufpreise reagieren stärker als Mieten → passt zu `eigentumsquoten_trend` (−1)
- Mechanismus über tiefe Einkommen stützt die Kante auf `verdraengungsrisiko`
  (indirekt, nicht gemessen)

## Notizen

- **Normierung beachten:** pro 1 % der *Beschäftigung* und nur Erwerbstätige.
  Nur rund 56 % der Zugewanderten sind erwerbstätig (S. 27). Pro Person gerechnet
  ist der Effekt kleiner; die Zahl lässt sich nicht direkt mit der Elastizität pro
  1 % der *Bevölkerung* (DE-013, Saiz) vergleichen
- Zillow misst das mittlere Segment (35.–65. Perzentil). Aussagen zum unteren
  Segment macht das Paper nicht
- Unautorisierte Zuwanderung, oft mit hoher Belegung pro Wohnung (S. 2). Auf die
  Schweizer Zuwanderung (überwiegend Erwerbstätige mit Bewilligung) nur begrenzt
  übertragbar
- Starke politische Rezeption in beide Richtungen (The Federalist vs. Homium-Blog);
  keine davon ist die Lesart der Autoren
