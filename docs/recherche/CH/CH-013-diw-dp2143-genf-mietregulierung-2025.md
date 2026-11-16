---
id: "CH-013"
title: "Restrictive rental policies and a tough trade off: Lower rents vs. less construction in Geneva"
authors: ["Ters, Kristyna", "Kholodilin, Konstantin A."]
year: 2025
institution: "FHNW (School of Business, Institute for Finance) / DIW Berlin"
type: "working-paper"
language: "en"
url: "https://www.diw.de/documents/publikationen/73/diw_01.c.982243.de/dp2143.pdf"
doi: null
status: "evaluated"
dag_nodes: ["nutzung_abbruchverbot", "nutzung_umnutzungsverbot", "mietrecht_kostenmiete", "mietrecht_anfangsmiete", "angebotspotenzial", "investitionsattraktivitaet", "marktfriktion", "nachfragedruck"]
dag_edges_confirmed:
  - { from: "nutzung_abbruchverbot", to: "investitionsattraktivitaet", sign: -1, note: "Genf: Rationierungsschock → institutionelle Neubauinvestitionen −400 Mio. CHF (90 %-Niveau), Granger 99 % (S. 19). Nur Genf, nur Index-Schock, nicht der Abbruchverbot-Einzeleffekt." }
  - { from: "nutzung_umnutzungsverbot", to: "investitionsattraktivitaet", sign: -1, note: "Gleicher Rationierungsindex wie oben (Abbruch, Umnutzung, PPE-Umwandlung bündeln sich im Index); Einzeleffekt nicht getrennt geschätzt (S. 11, 19)." }
  - { from: "nutzung_abbruchverbot", to: "angebotspotenzial", sign: -1, note: "Richtung über Neubauinvestitionen (−400 institutionell, −200 privat n. s.); Studie misst Investitionen, nicht Wohnungszahlen (S. 15, 19, 29)." }
  - { from: "mietrecht_kostenmiete", to: "investitionsattraktivitaet", sign: -1, note: "Schwach: institutionelle Neubauinvestitionen −100 Mio. CHF, nur auf 67 %-Niveau (S. 21)." }
  - { from: "mietrecht_kostenmiete", to: "marktfriktion", sign: 1, note: "Deskriptiv, nicht geschätzt: Genf Mietdauer 13.7 Jahre (Ganz 2024) gegen 8.5 Jahre CH (Wüest Partner 2024a); Miet-Abstand 33.5 % (S. 7)." }
dag_edges_challenged:
  - { from: "mietrecht_kostenmiete", to: "angebotspotenzial", sign: 0, note: "Private Neubauinvestitionen reagieren nicht auf Mietrecht-Schock (kein Effekt, kein Granger-Link, S. 15). Institutionell nur schwach (−100, 67 %)." }
  - { from: "mietrecht_kostenmiete", to: "nachfragedruck", sign: 0, note: "Leerstände bleiben nach Mietrecht-Schock im Wesentlichen unverändert (S. 30). Nur Rationierung Granger-verursacht tiefere Leerstände." }
relevance: "high"
duplicate_of: null
regions: ["CH"]
period_covered: "1994–2022"
---

## Zusammenfassung

Die Studie untersucht für den Kanton Genf, wie Mietpreisregulierung (rent control) und Wohnungsrationierung (housing rationing) auf Wohnbauinvestitionen und Leerstände wirken. Grundlage sind Jahresdaten 1994–2022 und ein VAR(1) mit verallgemeinerten Impulsantworten (GIRF) und Granger-Tests.

Rationierung wirkt als Mengenbeschränkung. Sie geht einer Abnahme der institutionellen Neubauinvestitionen voraus und sagt tiefere Leerstände voraus. Mietpreisregulierung wirkt über den Preiskanal. Sie bringt kurzfristig mehr private Renovation, aber keinen nachhaltigen Neubau. Die Autoren sehen als Hauptanpassung kurzfristige Renovation, nicht zusätzliche Wohnungen (S. 1).

Die Studie gilt nur für Genf. Sie schätzt Investitionen und Leerstände, keine Mieten.

## Key Findings

Seitenzahlen sind die gedruckten Seitenzahlen der Studie. PDF-Seite = gedruckte Seite + 2.

- **Mietabstand Genf (S. 7):** Marktmiete CHF 372/m²·a, Bestandsmiete CHF 279/m²·a, Abstand 33.5 %, höchster unter den fünf grössten Städten. Quelle in der Studie: Fleury et al. (2024), Raiffeisen «Immobilien Schweiz 2Q 2024».
- **Mietdauer (S. 7):** Genf im Schnitt 13.7 Jahre (Ganz 2024, EY). CH-Schnitt rund 8.5 Jahre (Wüest Partner AG 2024a).
- **Sanierungsstand (S. 6–7):** Anteil der über 40 Jahre alten Wohnungen ohne Renovation: Genf 83.5 %, Basel 47.6 %, Zürich 41.3 %. Quelle: Avenir Suisse (2012). Die Autoren schreiben, die Unterschiede belegten keine Kausalität.
- **Rationierung, Gesamteffekt (S. 29):** Rückgang der Bauinvestitionen privat und institutionell zusammen rund −600 Mio. CHF. Das entspricht rund 1 % des Genfer BIP und rund 11 % der gesamten Bauausgaben.
- **Rationierung, institutionell neu (S. 19):** −400 Mio. CHF, signifikant auf 90 %-Niveau. Granger-Kausalität von Rationierung auf Neubau auf 99 %-Niveau.
- **Rationierung, privat neu (S. 15):** rund −200 Mio. CHF, Abweichung ab etwa Jahr 6. Nicht signifikant auf 90 %-Niveau.
- **Rationierung, private Renovation (S. 17):** Spitze rund +200 Mio. CHF in Jahren 1–3, signifikant. Danach Rückgang, ab etwa Jahr 6 rund −50 Mio. CHF.
- **Rationierung, institutionelle Renovation (S. 23):** rund +100 Mio. CHF bis etwa Jahr 2, signifikant auf 90 %-Niveau.
- **Rationierung und Leerstand (S. 15, 19, 23, 29):** Granger-Kausalität auf tiefere Leerstände (privat p < 0.001, institutionell 99 %). Die Impulsantwort der Leerstände ist nicht signifikant (S. 17).
- **Mietpreisregulierung, institutionell neu (S. 21):** −100 Mio. CHF, nur auf 67 %-Niveau signifikant.
- **Mietpreisregulierung, private Neubauinvestitionen (S. 15):** kein erkennbarer Effekt, kein Granger-Link.
- **Mietpreisregulierung, private Renovation (S. 17):** Spitze rund +150 Mio. CHF in Jahren 1–3, signifikant. Der Effekt klingt ab und ist ab etwa Jahr 5 nicht mehr von null unterscheidbar. Kein Granger-Link.
- **Mietpreisregulierung, institutionelle Renovation (S. 25):** −100 Mio. CHF, nicht signifikant.
- **Mietpreisregulierung und Leerstand (S. 30–31):** Leerstände bleiben im Wesentlichen unverändert.
- **Renditen (S. 25–27, 30):** Cashflow-Rendite rund −0.2 % bei beiden Schocks (Rationierung 67 %-Niveau, Mietpreisregulierung 90 %-Niveau). Kapitalrendite +3 % (Rationierung) und +2 % (Mietpreisregulierung), beide nicht signifikant.

## Relevanz für DAG

Bestätigt wird die Richtung von `nutzung_abbruchverbot` und `nutzung_umnutzungsverbot` auf `investitionsattraktivitaet` (negativ) und, über Neubau, auf `angebotspotenzial` (negativ). Stärker als `mietrecht_kostenmiete`: Rationierung −400 gegen −100 Mio. CHF bei institutionellem Neubau (S. 19, 21).

Vorsicht bei der Übertragung:

- Die Studie schätzt Investitionsvolumen, nicht Wohnungszahlen. Der Schritt zu `angebotspotenzial` ist eine Annahme.
- Der Rationierungsindex bündelt mehrere Instrumente (Register, Abbruch- und Umnutzungsverbot, Umverteilung, Verbrauchsnormen, Mobilitätsbeschränkung, Verstaatlichung; S. 11). Ein Einzeleffekt des Abbruchverbots ist nicht geschätzt.
- Leerstand: Die Studie liefert für `nachfragedruck` nur Granger-Vorlauf, keine signifikante Impulsantwort. Mietrecht verändert Leerstände nicht.
- Phasen: Die Studie hat Jahreshorizonte (1–10 Jahre). Eine Zuordnung zu P1/P2/P3 gibt sie nicht her. Die Renovationsspitze fällt in Jahre 1–3, die negativen Neubaueffekte ab etwa Jahr 6 (privat) bzw. ohne klaren Zeitpunkt (institutionell).
- Nur Genf. Basel ist nur im Vergleich der Sanierungsstände erwähnt, nicht geschätzt.

## Zitate

> "housing rationing functions as a binding quantity restriction" (S. 1)

> "vacancy rates remain broadly unaffected in the wake of rent control tightening" (S. 30)

## Notizen

- **Methode (S. 9–14):** VAR(1) auf Jahresdaten, GIRF und Granger-Tests. Lag p = 1 wegen kleiner Stichprobe. Konfidenzbänder 90 % und 67 %.
- **Daten (S. 9–11, Tabelle A.1 S. 36–37):** BFS-Investitionen für Genf, getrennt nach privat/institutionell und Neubau/Renovation. Als Anteil am Landes-BIP gerechnet und mit Faktor 13.33 (Genfer Anteil 7.5 %) skaliert. Dazu Nettomigration, Hypothekarzins (SNB), Leerstand (BFS), Cashflow- und Kapitalrendite (Fahrländer Partner). Die Regulierungsindizes (0–1) stammen aus Kholodilin (2020, 2025b).
- **Zeitraum uneinheitlich:** Text 1994–2022. Tabelle A.1 nennt 1999–2022 (N = 24). Leerstand 1997–2023. Der Zinssatz-Absatz erwähnt 2024. Der effektive Schätzzeitraum ist unklar.
- **Grösse des Schocks unklar:** Der Methodenteil spricht von einer Standardabweichung (S. 13), die Abbildungsunterschriften von einem Einheitsschock («one-unit»). Nach Tabelle A.1 ist die Streuung des Rationierungsindex sehr klein (Standardabweichung rund 0.006; Spaltenzuordnung aus der Textextraktion abgeleitet). Die CHF-Werte sind deshalb kaum als Wirkung einer realen Verschärfung lesbar. Sie sind Modellgrössen.
- **−600 Mio. CHF:** Die Studie nennt die Summe nur im Schluss (S. 29). Sie passt zu −400 (institutionell, signifikant) plus −200 (privat, nicht signifikant). Diese Zerlegung ist ein Rückschluss der Notiz, die Studie rechnet sie nicht vor. Ein Teil der Summe ist statistisch nicht abgesichert.
- **Leerstand:** Der Schluss spricht von «statistically significant reductions in vacancy rates» (S. 29). Im Ergebniskapitel ist die Leerstands-Impulsantwort nicht signifikant (S. 17), nur der Granger-Test ist es. Granger heisst zeitlicher Vorlauf, nicht Kausalität im strengen Sinn.
- **Tabellenverweis kaputt:** «Table ??» auf S. 9. Abbildungsnummer im Text («Figure 7» für die Rationierungs-Neubauantwort, S. 19) stimmt nicht mit der Abbildung (Figure 6) überein.
- **Sekundärzahlen:** Die Zahlen zu Mietabstand, Mietdauer und Sanierungsstand stammen nicht von den Autoren, sondern aus Raiffeisen 2024, EY (Ganz 2024), Wüest Partner 2024a und Avenir Suisse 2012. Beim Zitieren die Primärquelle nennen. Wüest-Quelle: «Verändertes Nachfrageverhalten im Wohnungsmarkt», wuestpartner.com, 27.12.2024, von den Autoren am 3.9.2025 abgerufen. Die Studie sagt «length of stay in the same dwelling», nicht ausdrücklich Mietdauer.
- **Verhältnis zu CH-005:** CH-005 führt 279/372 und 13.7 Jahre auf EY/Wüest zurück. In DP 2143 stammen 279/372 aus Fleury et al. (Raiffeisen) und 13.7 Jahre aus Ganz (EY). Der Abstand beträgt dort 33.5 %.
- Volltext war lesbar (PDF lokal mit PDFKit extrahiert, 39 Seiten, Text vollständig). Die Abbildungen (GIRF-Kurven) wurden nur über Text und Achsenbeschriftung geprüft, nicht als Grafik betrachtet. Die Zahlen stammen aus dem Fliesstext.

## Abgleich mit dem Code

Geprüft am 2026-11-16 gegen den Volltext. Der Code schreibt diese Aussagen der Studie zu (u. a. `src/model/phase-weights.ts`, `src/model/groups.ts`, `src/model/supply-demand.ts`, `src/model/__tests__/fachlich/wohnschutz-fachlich.test.ts`, `src/model/__tests__/fachlich/gemeinnuetzig-fachlich.test.ts`).

1. **Genf 279 gegen 372 CHF/m²·a, Abstand rund 33 %: bestätigt** (S. 7). Genau 33.5 %. Die Studie zitiert Fleury et al. 2024 (Raiffeisen), nicht EY.
2. **Mietdauer 13.7 gegen rund 8.5 Jahre: bestätigt** (S. 7). 13.7 aus Ganz (2024, EY). 8.5 aus Wüest Partner AG (2024a), «Verändertes Nachfrageverhalten im Wohnungsmarkt», 27.12.2024. Die Zuschreibung «Wüest Partner 2024, zitiert in DIW DP 2143» stimmt. Die Messgrössen sind nicht ganz identisch («length of stay» gegen Mietdauer der Genfer Mieter).
3. **Rationierung: −600 Mio. CHF (≈ 11 %), −400 Mio. CHF institutionell, Private Renovation +200 Mio. CHF Jahre 1–3 dann Rückgang: bestätigt** (S. 29, 19, 17). Einschränkungen: −600 ist Summe aus −400 und −200, wobei −200 (privat neu) nicht signifikant ist (S. 15). Der Index bündelt mehrere Instrumente. Das gilt für Genf, nicht für Basel.
4. **Mietpreisregulierung: −100 Mio. CHF institutionell (schwach), private Renovation +150 Mio. CHF Jahre 1–5: teils abweichend.** −100 Mio. CHF nur auf 67 %-Niveau: bestätigt (S. 21). Private Renovation +150 Mio. CHF: Spitze in Jahren 1–3, ab etwa Jahr 5 nicht mehr von null unterscheidbar (S. 17). «Jahre 1–5» im Code ist falsch, richtig ist Jahre 1–3 (Ausklingen bis etwa Jahr 5).
5. **Rationierung senkt Leerstände (Granger), Mietpreisregulierung lässt sie unverändert: bestätigt** (S. 15, 19, 23, 30–31). Zusatz: Die Leerstands-Impulsantwort ist nicht signifikant (S. 17), der Schluss auf S. 29 formuliert stärker als das Ergebniskapitel. Die Aussage «Effekt verstärkt sich in Phase 2/3» (Test) steht nicht in der Studie.
6. **Sanierungsrückstand Genf 83 % gegen Zürich 41 % (Basel 48 %): abweichend.** Die Zahlen stehen in der Studie (S. 6–7), aber als 83.5 % / 41.3 % / 47.6 % und als Anteil der über 40 Jahre alten Wohnungen ohne Renovation. Herkunft: Avenir Suisse (2012), nicht eigene Analyse. Die Autoren sagen ausdrücklich, dies belege keine Kausalität. «Wohnschutz bremst Totalsanierungen → Sanierungsrückstand», die «Basler Regierung (2023)» und «Netto-Null» als Zielkonflikt Klimaschutz stehen nicht in der Studie.
7. **Methode: bestätigt, mit Korrektur.** Jahresdaten 1994–2022 (Tabelle A.1: 1999–2022), VAR(1), GIRF, Granger-Tests (S. 9–14). Keine Local Projections.

Zusätzlich im Code überhöht: «stärkste Angebotsbremse» (`phase-weights.ts`, Kante `nutzung_abbruchverbot → angebotspotenzial`) und «schädlichste aller Regulierungsformen» (`gemeinnuetzig-fachlich.test.ts`). Die Studie vergleicht nur zwei Instrumente: Rationierung und Mietpreisregulierung (S. 29–30).
