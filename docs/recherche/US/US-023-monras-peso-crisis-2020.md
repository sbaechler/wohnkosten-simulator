---
id: "US-023"
title: "Immigration and Wage Dynamics: Evidence from the Mexican Peso Crisis"
authors: ["Monras, Joan"]
year: 2020
institution: "Universitat Pompeu Fabra / Barcelona GSE / CEPR (UPF WP 1745, 28.8.2019); erschienen im Journal of Political Economy 128(8), 3017–3089"
type: "peer-reviewed"
language: "en"
url: "https://econpapers.repec.org/RePEc:cpr:ceprdp:13394"
pdf: "https://econ-papers.upf.edu/papers/1745.pdf"
doi: "10.1086/707764"
status: "evaluated"
dag_nodes:
  - "ctx:zuwanderungsdruck"
  - "nachfragedruck"
  - "angebotspotenzial"
  - "eigentumsquoten_trend"
dag_edges_confirmed:
  - { from: "ctx:zuwanderungsdruck", to: "nachfragedruck", sign: +1, note: "Kurzfristig (1995, Schock durch Pesokrise): Mietpreislücke (Mieten gegen Hauspreisindex) +0.56 bis +0.58 je 1 Punkt mehr mexikanische Geringqualifizierte (IV, Tab. 6 Sp. 7, S. 48). Autor: 1 % mehr Bevölkerung → etwa +1 % Mieten (S. 16). Wirkung über etwa 3 Jahre signifikant (Abb. 3, S. 39)" }
dag_edges_challenged:
  - { from: "ctx:zuwanderungsdruck", to: "nachfragedruck", sign: +1, note: "Gegen die Höhe von P2/P3 (0.8 / 0.6) und gegen eine positive Langfristwirkung, aber nur als regionaler Vergleich: Die Mietlücke ist nach 3 Jahren weg (Tab. 7, S. 49: 0.58 → 0.64 → 0.56 → 0.23 → −0.16 mit Horizont 1, 2, 3, 4, 5 Jahre, Staatsebene, dort schon der Hauptschätzer knapp nicht signifikant; Metropolen signifikant bis Horizont 3 Jahre, ab 4 Jahren nicht mehr). Über 1990–2000 sinken Mieten und Preise in Regionen mit hoher Zuwanderung relativ zu anderen (IV −0.55 bis −1.17 Mieten, −0.78 bis −1.43 Preise, Tab. 10, S. 52). Das gilt für den Unterschied zwischen Regionen, nicht für einen nationalen Schock; Binnenwanderung (Tab. 8, S. 50) und der Bausektor tragen die Erklärung" }
relevance: "high"
duplicate_of: null
regions: ["US"]
period_covered: "1990–2000 (Schock 1995, Anpassung bis 1999)"
---

## Zusammenfassung

Monras nutzt die mexikanische Pesokrise vom Dezember 1994 als exogenen
Auslöser für mehr Abwanderung nach den USA (Zuwanderung 1995 und 1996 rund 500 000
niedrig qualifizierte Mexikaner gegen 200 000 bis 300 000 in früheren Jahren, S. 8)
und verfolgt die Anpassung von Löhnen, Mieten, Hauspreisen und Binnenwanderung.
Der Wohnungsteil ist **kein Nebenaspekt**: Er steht im Abstract (kurzfristig steigende
Relativmiete, langfristig tiefere Wohnpreise), in Abschn. 3.4 und 4.4, im Modell
(Abschn. 5.4) und im dritten Kontrafaktum (6.5).

Identifikation: Erste Differenzen 1994 gegen 1995 (Vorperiode 1992–94), instrumentiert
mit dem Anteil der Mexikaner an den Erwerbstätigen 1980 («Netzwerkinstrument»), das
mit dem unerwarteten Schock der Pesokrise kombiniert wird (S. 11). Einheiten: 51
Staaten und 163 Metropolregionen (141 mit Wohndaten, 135 in den Langfristregressionen).
Daten: CPS, Volkszählungen 1980–2000, HUD Fair Market Rents, FHFA-Hauspreisindex.
Erste Stufe: F ≈ 19–27 (Tab. 3, Tab. 6), Metropolregionen 83.7 (Tab. 6 B).

Gelesen im Volltext: Arbeitspapier UPF 1745 (August 2019). Die Zeitschriftenfassung
(JPE 2020) wurde nicht gelesen, Tabellen- und Seitenzahlen unten gelten für das
Arbeitspapier und können in der JPE-Fassung abweichen.

## Key Findings

**Kurzfristig (1995, Abschn. 3.4, S. 15–16, Tab. 6 S. 48):**

- Ein Zuwanderungsschock von 1 % der geringqualifizierten Erwerbspersonen senkt Löhne
  geringqualifizierter Einheimischer um etwa 0.7 % (Staaten) bis 1.4 % (Metropolen;
  Tab. 3, S. 45) und weitet die **Mietpreislücke** (Mieten minus Hauspreisindex,
  log) um 0.55–0.58 % aus (Tab. 6 Sp. 7: Staaten 0.584, SE 0.33; Metropolen 0.555, SE 0.165).
- Mieten allein (Tab. 6 Sp. 6, IV): kein signifikanter Effekt (0.04 bzw. 0.03). Der
  Autor erklärt das mit sinkenden Preisen und Mieten in Kalifornien durch den Bausektor
  (S. 16). Deshalb zählt die Mietlücke.
- Umrechnung des Autors: +10 % geringqualifizierte Arbeitskräfte → +5 bis 6 % Mietlücke;
  bei einem geringqualifizierten Anteil von etwa der Hälfte entspricht das **1 %
  Bevölkerungszuwachs → etwa +1 % Mieten**, ähnlich wie Saiz (2003) (S. 16).
- Mechanismus: Über 80 % der neu Angekommenen mieten, gegen 30 % der Einheimischen
  (Tab. 1, S. 43: 0.82 gegen 0.32).

**Zeitverlauf (der Kernpunkt):**

- Die Mietlücke bleibt rund **3 Jahre** signifikant erhöht und kehrt dann zurück
  (Abb. 3 rechts, S. 39; Text S. 17). Löhne: ebenfalls rund 3 Jahre tiefer, im
  fünften Jahr nur noch leicht darunter (S. 3).
- Tab. 7 (S. 49), Mietlücke, Staatsebene: Horizont 1995 0.584; 1995–96 0.639; 1995–97
  0.561; 1995–98 0.231; 1995–99 −0.157 (95-%-KI 1.79 bis −2.11). Metropolen:
  0.555 / 0.604 / 0.560 / 0.259 / −0.469, Letzteres knapp signifikant negativ
  (KI −0.04 bis −0.90). Placebo-Jahre sind unauffällig.
- Das Modell reproduziert das (Abb. 8, S. 42): Die Lücke springt 1995 und ist nach etwa
  1999 wieder im Gleichgewicht. Treiber: Wechsel von Miete zu Eigentum innerhalb der
  Stadt und Binnenwanderung.
- **Binnenwanderung:** Im Schockjahr steigt der Anteil Geringqualifizierter in
  Hochzuwanderungsstaaten fast eins zu eins (Tab. 8, S. 50: IV 1.08–1.25). Ein Jahr
  später kehrt er fast um (IV −0.74 bis −0.79 auf Staatsebene, Metropolen −0.52 bis
  −0.64, ungenau). Lokale Unterschiede verschwinden in etwa zwei Jahren (S. 3).
- **Langfristig (1990–2000, Abschn. 4.4, Tab. 10, S. 52):** In Regionen mit grossem
  mexikanischem Zuzug **sinken Mieten und Hauspreise relativ zu Regionen mit wenig Zuzug**,
  Elastizität rund −1. Staaten, IV: Mieten −0.55 (SE 0.37, n. s.), Preisindex −0.78
  (SE 0.42, schwach signifikant). Metropolen, IV: Mieten −1.17 (SE 0.52), Preisindex
  −1.43 (SE 0.70). OLS ist nirgends signifikant. Mietlücke: nicht von null verschieden
  (0.23 / 0.26, n. s.).
- Das heisst: Die Aussage «nach 5+ Jahren sinkende Mieten» ist **sinngemäss, nicht
  wörtlich** bestätigt. Das Paper misst keinen Mietverlauf in Jahren 5, 6, 7 nach
  einem Schock, sondern die Differenz 1990 gegen 2000 bei laufendem Zuzug über das
  ganze Jahrzehnt. Zeitlich belegt ist nur: Mietlücke weg nach etwa 3 bis 4 Jahren.

**Angebot/Neubau, Mechanismus der Preissenkung (Abschn. 4.4, S. 22–23, Anhang A.9/A.10):**

- Mexikaner gehen überproportional in den Bau (US: Anteil an allen Bauarbeitern
  5 % → 12 %, Kalifornien 21 % → 33 %, Tab. 1, S. 43). Rund die Hälfte der relativen
  Zuwanderung landet im Bau (Tab. D10: 0.37–0.65 je Einheit relativem Zuzug). Löhne
  Einheimischer im Bau sinken (IV −0.45 Staaten, −0.77 Metropolen, Tab. D10, S. 92).
- Baukosten bestehen zu mindestens 60 % aus Arbeit (Gyourko/Saiz 2006). Daraus rechnet
  der Autor einen Preisrückgang von etwa −0.84 (A.10, S. 68), im Konfidenzintervall
  der Schätzungen.
- Neubau (Einfamilienhäuser, 1994–2000): Elastizität zur relativen Zuwanderung 1.9
  (OLS) bzw. 2.2 (IV) (Tab. D11, S. 93). In Kalifornien mehr Neubau als in New York
  (Abb. D.6). Daraus folgt eine implizite Preiselastizität der Wohnungsnachfrage von
  etwa −0.3 bis −0.4 (S. 23, 70). Der Bausektor insgesamt wächst nicht stärker
  (Tab. D10 Sp. 3–4: 0.00, n. s.). Mexikaner **verdrängen** dort Einheimische.

**Wegzug Einheimischer:** Als Ursache der sinkenden Mieten **nicht** belegt. Die
Standardliteratur (Saiz/Wachter 2011, Sa 2015) führt sinkende Preise in
Zuwanderernachbarschaften auf Vermeidung durch Einheimische zurück. Monras nennt
das als konkurrierende Erklärung (S. 22) und setzt den Bausektor-Kanal dagegen,
trennt die beiden aber nicht sauber. In der Binnenwanderung ist der Zufluss
Einheimischer nicht signifikant betroffen: Die Kontrolle für Einheimische ändert die
Schätzungen nicht (A.7, S. 64).

**Segment:** Mietwohnungen (Lücke zum Eigentum). Nach Einkommen innerhalb der Mieter
nicht unterschieden. Zuwanderer = überwiegend geringqualifizierte, oft unautorisierte
Mexikaner.

**Gegenüber Saiz (2007):** Der Autor sieht Saiz' Preisanstieg als vereinbar, weil
Saiz nur legale Zuwanderer misst, Mexikaner aber häufiger gering qualifiziert,
unautorisiert und im Bau tätig sind (S. 7).

## Relevanz für DAG

- Stützt `ctx:zuwanderungsdruck → nachfragedruck` (+1) **kurzfristig** mit einer
  Grössenordnung (≈ +1 % Mieten je 1 % Bevölkerung), die zu Saiz und DE-013 passt.
- **Abklingen [1.0, 0.8, 0.6]:** Die Richtung (schwächer werdend) ist gestützt, die
  Geschwindigkeit nicht: Monras zeigt Rückbildung der Mietlücke nach etwa 3 Jahren,
  schneller als 0.8 in P2 vermuten lässt, abhängig davon, wie lange P1 bis P3 dauern.
  Die Langfristzahl (negativ) ist ein **Relativeffekt zwischen Regionen**.
- **Kein Beleg für ein Schweizer Landesprofil.** Der Abbau kommt zu grossen Teilen
  aus Binnenwanderung zwischen Regionen und aus Kostensenkung im Bau. Ein nationaler
  Schock (Schweiz) wird nicht über Wanderung in andere Kantone ausgeglichen. In der
  Schweiz sind zugewanderte Bauarbeiter zudem durch Gesamtarbeitsverträge und
  Mindestlöhne weniger lohndrückend. Das sind Einschätzungen, das Paper testet sie nicht.
- `angebotspotenzial`: Der Kanal «Zuwanderung → billigere Bauarbeit → mehr Neubau»
  existiert im Paper (Neubauelastizität 1.9–2.2). Im Modell gibt es dafür keine Kante
  (`ctx:zuwanderungsdruck → angebotspotenzial`), der Befund ist nicht übertragbar,
  wo Bau nicht über Löhne, sondern über Bodenverfügbarkeit und Verfahren begrenzt ist.
- `eigentumsquoten_trend`: Die Mietlücke steigt kurzfristig (Mieten gegen Preise),
  verschwindet aber, weil Haushalte vom Mieten zum Kaufen wechseln. Das stützt das
  Vorzeichen −1 nur schwach.

## Notizen

- **Geringqualifizierte Einheit:** Der Schock ist in Prozent der *geringqualifizierten
  Erwerbspersonen* gemessen, nicht der Bevölkerung. Umrechnung durch den Autor über
  einen Anteil von etwa 50 % (S. 16).
- Alle Wohnungsbefunde sind **Differenzen zwischen Regionen** (Hoch- gegen
  Niedrigzuwanderung) mit Staat- und Metropolen-Einheiten. Sie sind keine absoluten
  nationalen Effekte, und Spillover durch Binnenwanderung dämpfen sie (S. 19).
- Hauspreisindex ist 1990 = 100, daher keine Varianz zwischen Regionen im Basisjahr
  (S. 10, Fussnote 26).
- Kleinere Unstimmigkeiten im Paper: Einleitung nennt «mehr als 100 000 Mexikaner
  gegen etwa 80 000 Einheimische» im Bau in Kalifornien, Tab. 1 hat +110 028 und −76 962.
- Zeitlich ist die Rückkehr der Mietlücke in der Datenreihe (Abb. 3) ab 1998
  negativ: Die Mietlücke fällt dann unter null. Das passt zur Deutung «Anpassung durch
  Bau und Wanderung», lässt aber offen, ob es Zuwanderungseffekt oder
  Kalifornien-Trend ist (Hauspreisboom Ende der 1990er).
- Wörtliche Angabe «sinkende Mieten nach 5+ Jahren» kommt im Text nicht vor. Die
  Aussage geht aus Tab. 7 (Mietlücke fällt ab dem 5. Jahr) und Tab. 10 (Jahrzehnt) hervor.
