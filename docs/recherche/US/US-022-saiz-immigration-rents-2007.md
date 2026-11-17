---
id: "US-022"
title: "Immigration and Housing Rents in American Cities"
authors: ["Saiz, Albert"]
year: 2007
institution: "Federal Reserve Bank of Philadelphia (WP 03-12, Juni 2003); erschienen im Journal of Urban Economics 61(2), 345–371"
type: "peer-reviewed"
language: "en"
url: "https://repository.upenn.edu/real-estate_papers/69"
pdf: "https://www.philadelphiafed.org/-/media/frbp/assets/working-papers/2003/wp03-12.pdf"
doi: null
status: "evaluated"
dag_nodes:
  - "ctx:zuwanderungsdruck"
  - "nachfragedruck"
  - "angebotspotenzial"
  - "verdraengungsrisiko"
  - "eigentumsquoten_trend"
dag_edges_confirmed:
  - { from: "ctx:zuwanderungsdruck", to: "nachfragedruck", sign: +1, note: "Legale Zuwanderung 1983–1997, US-Metropolen: Zuzug von 1 % der Bevölkerung → Mieten ≈ +1 % (IV 1.15–1.21, Tab. 3; Langdifferenzen 0.87–0.94, Tab. 4). Fundstelle: Arbeitspapier 03-12; Seitenzahlen nicht mit der Zeitschriftenfassung identisch" }
  - { from: "ctx:zuwanderungsdruck", to: "eigentumsquoten_trend", sign: -1, note: "Preise reagieren in den Punktschätzungen stärker als Mieten (jährlich IV 2.2–2.6 gegen 1.2; Langdifferenzen 1.6 gegen 0.9, Tab. 3–4). Saiz kann aber nicht verwerfen, dass beide gleich sind (S. 22). Schwach, indirekt" }
dag_edges_challenged:
  - { from: "ctx:zuwanderungsdruck", to: "nachfragedruck", sign: +1, note: "Zeitverlauf [1.0, 0.8, 0.6] nur theoretisch gestützt, empirisch nicht. Das Modell (S. 9–11, Gl. 13/17) sagt: Kurzfristwirkung > Langfristwirkung, Mieten springen und fallen dann auf ein höheres neues Gleichgewicht. Gemessen wird kein Abklingen: jährliche Schätzung (Mieten ≈ 1.1–1.2) und Schätzung über 14 Jahre (≈ 0.9) liegen nahe beieinander. Zudem weist Saiz selbst auf eine mögliche kointegrierende Langfristbeziehung hin, die die jährlichen Schätzungen nach unten verzerren würde (S. 16)" }
relevance: "high"
duplicate_of: null
regions: ["US"]
period_covered: "1983–1997 (INS-Daten, Mieten bis 1998); Zensus 1970–2000"
---

## Zusammenfassung

Saiz untersucht, wie der Zuzug von Zuwanderern die Mieten und Hauspreise in
US-Metropolregionen verändert. Daten: jährliche Zahl der legal aufgenommenen
Zuwanderer (INS, rund 292 MSA, 1983–1997), Mieten aus den HUD Fair Market Rents
(2-Zimmer-Wohnung, 45. Perzentil), Preise aus dem Freddie-Mac-Repeat-Sales-Index,
dazu American Housing Survey (Einzelwohnungen, 1985 und 1995) und Zensus
(1970–2000). Identifikation über zwei Shift-Share-Instrumente: nationale
Zuwanderungszahl mal Zielort-Anteile von 1983, und Herkunftsland-Merkmale mal
Zielort-Anteile von 1983. Erste Stufe: F ≈ 274–344 (Tab. A.5).

Gelesen im Volltext: Arbeitspapier 03-12 der Philadelphia Fed (Juni 2003), das ist
eine frühere Fassung. Die Zeitschriftenfassung (JUE 2007) wurde nicht gelesen. Die
Kernaussage im Abstract ist in beiden Fassungen gleich (Zuzug von 1 % der
Bevölkerung → Mieten und Wohnwerte um etwa 1 %). Seitenzahlen unten gelten für das
Arbeitspapier.

## Key Findings

**Elastizität pro 1 % der Bevölkerung (Zuzug im Verhältnis zur Stadtbevölkerung):**

| Spezifikation | Mieten | Preise | Fundstelle |
|---|---|---|---|
| Jährliche Differenzen, OLS | 1.15 / 1.10 / 0.84 | 1.91 / 2.33 / 1.92 | Tab. 2, Sp. 1–6 (S. 16–17) |
| Jährlich, IV (nationales Shift-Share) | 1.21 | 2.19 | Tab. 3, Sp. 1–2 (S. 20–21) |
| Jährlich, IV (Herkunftsländer) | 1.15 | 2.57 | Tab. 3, Sp. 3–4 |
| Zweite Differenzen («Überraschungen») | 3.76 (SE 1.68) | −1.60 (n. s.) | Tab. 2, Sp. 7–8 (S. 18) |
| Langdifferenzen 1984–1998, OLS / IV | 0.87 / 0.91–0.94 | 1.67 / 1.58–1.61 | Tab. 4 (S. 21–22) |
| AHS-Einzeldaten 1985–1995 | 0.80–0.87 | – | Tab. 5 (S. 22–23) |
| Zensus-Dekaden, OLS / IV | 0.94 / 0.56–0.77 | 1.96 / 0.35–0.80 | Tab. 6 (S. 24–25) |

Saiz fasst zusammen: Der Modus aller 32 Schätzungen liegt bei etwa 1 (Abb. 1,
S. 26). Zuzug von 1 % der Bevölkerung hebt Mieten und Preise um rund 1 %.

**Abgleich mit dem Sekundärzitat (+1 % Mieten, +2 % Preise OLS, gut +3 % Preise IV):**

- Mieten ≈ +1 %: bestätigt.
- Preise ≈ +2 % (OLS): im Rahmen (1.9–2.3 jährlich), in den Langdifferenzen 1.7.
- Preise **«gut +3 % (IV)»: im Arbeitspapier nicht bestätigt.** Die höchste IV-Schätzung
  ist 2.57 (Tab. 3, Sp. 4), die Langdifferenzen-IV liegen bei 1.6, die Zensus-IV
  unter 1. Die Zahl könnte in der Zeitschriftenfassung stehen. Preisschätzungen
  sind laut Saiz breit gestreut und unpräziser (S. 17, 26).
- Der Abstract sagt für Preise ebenfalls nur «um etwa 1 %». Die höhere Preiselastizität
  ist eine Lesart der Tabellen, nicht die Hauptaussage.

**Zeitverlauf (das Wichtigste für die Phasengewichte):**

- **Theorie (Abschn. 3, S. 9–11):** Kurzfristig sind Angebot und einheimische
  Bevölkerung fixiert, die Miete steigt um θ·(Zuwanderer/Bevölkerung). Bei erwartetem
  Zuzug oder langfristig dämpfen Neubau, Flächenverbrauch pro Kopf und Wegzug
  Einheimischer die Wirkung (Gl. 13). Die Langfristwirkung ist kleiner als die
  Kurzfristwirkung, aber positiv, solange Einheimische einen Konsumentenüberschuss
  in der Stadt haben. Nach dem Schock fallen die Mieten Richtung eines höheren neuen
  Gleichgewichts (Gl. 17). Saiz folgert: Schätzungen aus unerwarteten Schocks
  überschätzen die Langfristwirkung (S. 12). Das stützt die **Richtung** des Abklingens.
- **Empirie:** Kein gemessenes Abklingen. Die jährlichen Schätzungen (Mieten ≈ 1.1–1.2,
  Tab. 3) und die 14-Jahres-Langdifferenzen (≈ 0.9, Tab. 4) sind in der Grössenordnung
  gleich. Die Einheiten sind aber nicht identisch (jährliche Wachstumsrate gegen
  kumulierte Niveauänderung). Lesart: Die Zuwanderung verschiebt das Mietniveau
  dauerhaft um etwa 1 % je 1 % Zuzug, ohne erkennbare Rückbildung binnen 14 Jahren.
  Das ist eine Lesart, kein Test.
- «Mieten steigen kurzfristig, Preise ziehen nach» (Schluss, S. 26): Mieten reagieren
  früher, Preise holen allmählich auf (Fehlerkorrekturmodell, Gl. 7, S. 9).
- Es gibt kein Ergebnis zu Jahren 5, 10 oder 15 nach einem einzelnen Schock. Die
  Langdifferenz mittelt über 14 Jahre laufenden Zuzug.

**Angebot (Neubau):** Baubewilligungsdaten (Census C40) werden als Quelle genannt
(S. 14), Ergebnisse dazu stehen im Arbeitspapier nicht. Die Angebotselastizität
kommt nur im Modell vor: Je elastischer das Angebot, desto kleiner die
Mietwirkung (S. 10).

**Wegzug Einheimischer:** Natives sind nach Saiz preissensibler als Zuwanderer, die
von Netzwerken angezogen werden (S. 6). In den Langdifferenzen ist die Veränderung
der übrigen Bevölkerung nicht signifikant (Tab. 4: 0.05 / 0.02). Einheimische
ziehen eher in Gegenden mit langsamerem Mietanstieg (S. 22). In Zensus-Daten ist
der Zusammenhang positiv (Tab. 6), aber 2–3 Mal schwächer als bei Zuwanderung
(S. 25). Ein direkter Wegzugseffekt wird nicht geschätzt. Fussnote 29 (S. 22):
Ein Zuwanderer mehr bedeutet etwa einen Einwohner mehr (0.70, SE 0.28; 1:1 nicht
verwerfbar).

**Segment/Einkommen:** Nicht untersucht. Fussnote 37 (S. 26) kündigt Folgearbeit zu
Marktsegmenten an. Die FMR bilden das mittlere Segment ab (45. Perzentil). Saiz
rechnet einen Kaufkraftverlust für Mieter vor: Eine Erhöhung des Zuwanderungsanteils
um 1 Punkt braucht 1.15 % Zuzug, hebt Mieten um etwa 1.15 %, bei einem Mietanteil
von etwa einem Viertel des Einkommens sind das rund 0.28 % Kaufkraft (S. 27), das
Zehnfache des Lohneffekts.

**Daten und Grenzen:**

- Nur **legale** Zuwanderer (INS-Aufnahmen), Zeitpunkt der Aufnahme ≠ Zuzug. Zensus-Variante
  (alle Ausländer) liefert ähnliche Werte, aber tiefere IV-Schätzungen (S. 25).
- Identifikation hängt an der Annahme, dass die Zielorte von 1983 nicht künftige
  Mietentwicklung vorhersagen (S. 19). Saiz argumentiert, Preise hätten das sonst
  vorab eingepreist.
- Messfehler dämpft die hochfrequenten Schätzungen (S. 13). Qualitätsänderungen werden
  mit AHS-Einzeldaten kontrolliert (Tab. 5).
- Mittelwert der jährlichen Zuwanderung 0.3 % der Bevölkerung, Maximum 1.4 % (Miami,
  1990, Tab. 1). Kumuliert 1983–1997 bis 25 % (Miami, Tab. A.1).

## Relevanz für DAG

- Belegt `ctx:zuwanderungsdruck → nachfragedruck` (+1) mit einer kausal gedeuteten
  Elastizität von etwa 1 für Mieten. Grössenordnung deckungsgleich mit DE-013 (Mieten
  ≈ +1 %) und US-021 (+1.4 % pro 1 % der Beschäftigung).
- **Abklingen [1.0, 0.8, 0.6]:** Theoretisch begründet (Richtung), empirisch nicht
  quantifiziert. Die Daten zeigen innerhalb von 14 Jahren keine Rückbildung.
  Sie widersprechen dem Abklingen nicht direkt, stützen die Grösse aber ebenfalls
  nicht. Ein Profil ohne oder mit nur schwachem Abklingen ist mit Saiz ebenso
  vereinbar.
- Preise reagieren in den Punktschätzungen stärker als Mieten, das passt zum
  Vorzeichen auf `eigentumsquoten_trend` (−1). Der Unterschied ist statistisch nicht
  gesichert.
- `angebotspotenzial` wirkt als Dämpfer (Modell, S. 10), eine Kante `ctx:zuwanderungsdruck
  → angebotspotenzial` wird hier nicht geschätzt.
- `verdraengungsrisiko`: Der Mechanismus (Einheimische ziehen wegen höherer Mieten weg)
  steht im Modell (S. 6), wird aber nicht gemessen.

## Notizen

- **Normierung:** Pro 1 % der *Bevölkerung* (Zuzug / Stadtbevölkerung). Vergleichbar
  mit DE-013, nicht direkt mit US-021 (pro 1 % der Beschäftigung, nur Erwerbstätige).
- Zuwanderer in den USA sind überwiegend Familiennachzug (S. 8, Fussnote 10), in der
  Schweiz überwiegend Erwerbstätige. Der Netzwerkmechanismus der Ansiedlung ist ähnlich,
  die Zusammensetzung nicht.
- Die Arbeit nutzt für Städte mit hohen Zuzugsraten (New York, Miami) lange Zeiträume.
  Schweizer Städte mit bis über 1.5 % Wanderungssaldo pro Jahr liegen oberhalb des
  Jahresmaximums der Stichprobe (1.4 %).
- DOI nicht verifiziert. Zeitschriftenfassung (JUE 61(2), 345–371) nicht gelesen,
  deshalb ist die Aussage «gut +3 % (IV)» offen.
- Saiz (2003, Mariel-Boatlift, in der Arbeit S. 4–5 referiert): +8 % Mieten gegenüber
  Vergleichsstädten bei einem Anstieg der Mieterbevölkerung um 9 % (rund 4 % der
  Gesamtbevölkerung). Ein einmaliger, grosser Schock in einem Markt.
- Monras (2020, US-023) bestreitet nicht Saiz' Kurzfristbefund, zeigt aber für
  mexikanische, oft unautorisierte Zuwanderer über ein Jahrzehnt sinkende Mieten und
  Preise relativ zu anderen Regionen und erklärt den Unterschied zu Saiz durch den
  Bausektor (US-023, S. 7).
