---
id: "CH-012"
title: "Mietpreis-Initiative und indirekter Gegenvorschlag — Kriterien, Uhren, belegbare Kontextwerte"
authors: ["Badran, Jacqueline", "Bundesrat", "Bundesamt für Wohnungswesen", "Bundesgericht"]
year: 2026
institution: "Synthese aus Primärquellen (BV-Initiative, BR-Mitteilung, BWO-Bericht, BGE 144 III 514, BFS, SSZ)"
type: "synthesis"
language: "de"
url: "https://www.admin.ch/de/newnsb/EbAjw2abDf3e"
doi: null
status: "evaluated"
dag_nodes:
  - "mietrecht_kriterium"
  - "mietrecht_durchsetzung"
  - "mietrecht_mietzinsindex"
  - "vergleichsmiete_aktiv"
  - "bestandsmiete"
  - "anfangsmiete"
  - "erhoehungsspielraum"
  - "verweildauer"
  - "ctx:teuerung"
dag_edges_confirmed: []
dag_edges_challenged:
  - "mietrecht_mietzinsindex → mietpreis_schutzlevel (Vorzeichen +1): entscheidet die strittige Frage vorab und ist im provisorischen Code entfernt"
relevance: "high"
duplicate_of: null
regions: ["CH"]
period_covered: "2018–2026"
---

## Zusammenfassung

Die Mietpreis-Initiative will die geltende Kostenmiete plus Renditedeckel in der Verfassung festschreiben und periodisch durchsetzen. Der Bundesrat lehnt sie ab und kündigt einen indirekten Gegenvorschlag an: statistische Vergleichsmiete für den Anfangsmietzins, Indexierung im laufenden Verhältnis, keine behördliche Routinekontrolle.[1] Der BWO-Bericht, der in diese Arbeit einfliesst, beschreibt denselben Schritt als Systemwechsel weg von historischen Anlagekosten und Rendite, hin zu einem hedonischen Modell auf effektiv bezahlten Mieten, plus Anpassung um 80 oder 90 Prozent des Landesindexes — oder alle vier Jahre an die Vergleichsmiete.[4]

Der lineare Graph kann das nicht. Ein Schutzlevel hat kein Vorzeichen für «Bestand günstig, Einstieg teuer». Die Kante `mietrecht_mietzinsindex → mietpreis_schutzlevel` mit Vorzeichen +1 behandelt den Landesindex als mehr Schutz. Das ist die Annahme, nicht das Ergebnis.

## Zwei Vorlagen, nicht zwei Stufen desselben Schiebers

**Initiative.** Missbräuchlich ist ein Mietzins, der die tatsächlichen Kosten plus eine angemessene Rendite übersteigt oder auf einem übersetzten Kaufpreis beruht. Neu ist die Durchsetzung: automatisch und regelmässig, plus auf Verlangen.[2] Badran: damit entfällt das Kriterium der Orts- und Quartierüblichkeit, das mit der Kostenmiete unvereinbar sei.[3]

**Gegenvorschlag, amtlich.** Vergleichsmiete für den Anfangsmietzins, Indexierung im Bestand, keine automatische Kontrolle.[1] Vernehmlassung erst im ersten Halbjahr 2027. Was der Code abbildet, ist die Richtung aus Mitteilung und BWO-Bericht, kein Gesetz.

**Gegenvorschlag, gelesen von den Initianten.** Abschaffung des Renditedeckels, Marktmiete über Vergleichsmieten, Aufwärtsspirale, weil jede Erhöhung die Referenz hebt.[3][5] Das ist eine Lesart. Der Code darf sie nicht als Vorzeichen einbauen. Die Spirale ist eine Rückkopplung, die nur läuft, wenn das Vergleichsmieten-Tor offen ist.

## Wann Vergleichsmiete rechtlich «dran» ist

BGE 144 III 514, Regeste: eine Liegenschaft ist alt, wenn ihre Erstellung oder ihr letzter Erwerb beim Anfang der Miete mindestens 30 Jahre zurückliegt.[6] Erstellung zählt. Ein Verkauf setzt diese Uhr nicht zurück. Badrans Kolumne sagt das Gegenteil: 30 Jahre Haltedauer desselben Eigentümers, nicht das Alter der Liegenschaft.[3] Der provisorische Code folgt dem Urteil, nicht der Kolumne. Die Haltedauer ist in keiner öffentlichen Statistik.

Selbst dieser Rang ist nicht der Preis. Badran behauptet, die Verordnungskriterien seien so eng, dass noch nie ein Bundesgericht die Orts- und Quartierüblichkeit als nachgewiesen beurteilt habe.[3] Das ist ihre Behauptung, keine Auswertung der Rechtsprechung in diesem Dokument. Der Code trennt deshalb Rang und Wirksamkeit. `WIRKSAMKEIT_OQU` steht auf 0, mit diesem Vorbehalt. Im Status quo ist das Tor zu, auch in Zürich, auch bei hohem Altbauanteil. Bindend wird die Vergleichsmiete erst, wenn `mietrecht_kriterium` auf 2 steht (Gegenvorschlag). Die Initiative (`kriterium` 0) löscht das Kriterium.

Die 30-Jahre-Uhr ist ein Bestandsanteil am Stichtag, kein Zustand, der in den drei Phasen (0–2, 2–5, 5–10 Jahre) von selbst kippt.

## Drei Kontextwerte — was belegt ist

### `ctx:teuerung` — belegt, nationaler LIK

Rechtsgrundlage der Indexierung ist der Landesindex der Konsumentenpreise, nicht ein Regionalindex und nicht der Mietpreisindex. Jahresdurchschnitt gegen Vorjahr, BFS:[7]

| Jahr | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| % | −0.4 | 0.5 | 0.9 | 0.4 | −0.7 | 0.6 | 2.8 | 2.1 | 1.1 | 0.2 |

Bins, an dieser Reihe geeicht, im Code als `TEUERUNG_BINS` dokumentiert: unter 0 → −2, 0 bis 0.5 → −1, 0.5 bis 1.5 → 0, 1.5 bis 2.5 → +1, darüber +2. 2025 liegt auf −1. Alle Städte tragen diesen Wert. Der rechtlich massgebende Index ist national; ein Zürcher Regionalindex wäre für die 80/90-Prozent-Klausel die falsche Grösse.

Falle: 2025 kam der grösste Beitrag zur Jahresteuerung von der Wohnungsmiete selbst (0.364 Punkte).[7] Für den rechtlichen Nachzug bleibt der Gesamtindex richtig. Als unabhängiger Kostenschock ist er es nicht.

Die Stufe ist eine Lage in der Reihe, keine Grösse. Stufe 0 ist der Normalfall (0.5 bis 1.5 Prozent), nicht null Teuerung; null liegt an der Grenze zwischen −2 und −1. Bis November 2026 rechnete der Code mit der Stufe selbst. Stufe −1 ergab im Indexregime einen Erhöhungsspielraum von −0.42, also einen Senkungsanspruch bei einer Teuerung von +0.2 Prozent. Das war ein Fehler der Skala, kein Befund der Reihe.

Jetzt übersetzt `TEUERUNG_STUFE_PROZENT` jede Stufe in eine Jahresteuerung: −0.5, 0.25, 1.0, 2.0 und 3.0 Prozent. Die drei mittleren Werte sind die Bin-Mitten. Die beiden Randwerte sind eine Setzung, je eine halbe Bin-Breite jenseits der Grenze; die Reihe hat dort −0.4 und −0.7 beziehungsweise 2.8 Prozent.

Seit Sprint 4 (November 2026) rechnet der Regime-Code die Teuerung in derselben Einheit wie den Zinsschritt: zulässige Mietzinsänderung in Prozent, geteilt durch `ERHOEHUNG_REFERENZ_PROZENT` (7.5). Siehe den Abschnitt zum Erhöhungsspielraum unten. Vorher war 3 Prozent Teuerung = 1 (`TEUERUNG_REFERENZ_PROZENT`, entfernt) und ein Zinsschritt = 0.5, ohne Eichung dazwischen.

Mit Teuerung −1 (0.25 Prozent) und Überwälzung 0.85 erlaubt das Indexregime 0.2125 Prozent, in der Einheit 0.028 (vorher 0.07). Ein Senkungsanspruch entsteht nur bei Stufe −2. Eine Spirale aus der Teuerung 2025 erzeugt der Code weiterhin nicht: die Bestandsmiete steigt in Zürich über drei Phasen auf 0.017 (vorher 0.04).

### `ctx:referenzzins_aenderung` — belegt, Schritt geeicht, Rand-Bins gesetzt

Im Referenzzins-Regime entsteht der Anspruch auf Erhöhung oder Senkung aus der Änderung des Satzes, nicht aus seinem Niveau. Bis November 2026 las der Code `ctx:zinsniveau`. Ein tiefes, unverändertes Niveau (−1) galt damit in jeder Phase als neuer Senkungsanspruch, und die Initiative senkte die Bestandsmiete auch ohne gesetzte Mietlücke. Das widersprach dem Abschnitt zur Mietlücke weiter unten.

Jetzt: Veränderung des Referenzzinssatzes über die letzten zwölf Monate, national. Bins in `REFERENZZINS_BINS`: Senkung um 0.5 Punkte oder mehr → −2, um 0.25 → −1, unverändert → 0, Erhöhung um 0.25 → +1, um 0.5 oder mehr → +2. Der Satz steht seit dem 2. September 2025 bei 1.25 Prozent und ist per 2. September 2026 unverändert.[9] Alle Städte tragen 0. Eine Stufe ist ein Schritt von 0.25 Punkten und erlaubt nach Art. 13 VMWG 3 Prozent Erhöhung oder 2.91 Prozent Senkung (Abschnitt Erhöhungsspielraum). Setzung: die Rand-Bins («0.5 Punkte oder mehr») zählen als genau zwei Schritte, eine Untergrenze.

Nicht abgebildet: Senkungen aus früheren Jahren, die Mieter nie eingefordert haben. Das ist die verpasste Senkung unter der relativen Methode und gehört zur Mietlücke, nicht in diesen Kontextwert.

Die Vorladung rechnet seit November 2026 in der Einheit des Erhöhungsspielraums: gesperrt ist der Teil der Teuerung, den das Regime im laufenden Vertrag nicht zulässt. Referenzzins-Regime 60 Prozent (40 Prozent sind überwälzbar, Art. 16 VMWG[20], `REFERENZ_TEUERUNG_PASS_THROUGH`), Landesindex 15 Prozent, Kostenbindung 100 Prozent. Überwälzter und gesperrter Teil ergeben zusammen die ganze positive Teuerung. Vorher wurde im Referenzzins-Regime ein Teuerungs-Bin gegen einen Zins-Bin verrechnet.

### Erhöhungsspielraum — Einheit aus dem Recht geeicht (Sprint 4)

**Was sich geändert hat.** Der `erhoehungsspielraum` bedeutet in allen drei Index-Regimes dasselbe: zulässige Änderung des laufenden Mietzinses in Prozent pro Jahr, geteilt durch eine einzige Referenz, `ERHOEHUNG_REFERENZ_PROZENT` = 7.5 Prozent. Bestands- und Anfangsmiete summieren den Spielraum auf und tragen damit dieselbe Einheit.

- Referenzzins-Regime (Index 0): Zinsanteil plus 40 Prozent der Teuerung. Vorher fehlte die Teuerung, obwohl das geltende Recht sie zulässt.
- Landesindex (Index 1): 0.85 × Teuerung in Prozent, wie bisher, jetzt in derselben Einheit.
- Kostenbindung (Index 2): 0.

**Rechtsquelle.** VMWG, SR 221.213.11, Stand 1. Oktober 2025.[20]

- Art. 13 Abs. 1: «Eine Hypothekarzinserhöhung von einem Viertel Prozent berechtigt in der Regel zu einer Mietzinserhöhung von höchstens: a. 2 Prozent bei Hypothekarzinssätzen von mehr als 6 Prozent; b. 2,5 Prozent bei Hypothekarzinssätzen zwischen 5 und 6 Prozent; c. 3 Prozent bei Hypothekarzinssätzen von weniger als 5 Prozent. Bei Hypothekarzinssenkungen sind die Mietzinse entsprechend herabzusetzen oder die Einsparungen mit inzwischen eingetretenen Kostensteigerungen zu verrechnen.» Der Referenzzinssatz liegt seit 2008 unter 5 Prozent; der Code verwendet nur Bst. c (`REFERENZZINS_SCHRITT_PROZENT` = 3). Die Senkung ist der Kehrwert, 1 − 1/1.03 = 2.91 Prozent je Viertelprozent; so beziffert sie das BWO in der Mitteilung vom 1. September 2025.[21] Mehrere Schritte wirken multiplikativ: zwei Schritte +6.09 beziehungsweise −5.74 Prozent.
- Art. 16: «Zum Ausgleich der Teuerung auf dem risikotragenden Kapital im Sinne von Artikel 269a Buchstabe e OR darf der Mietzins um höchstens 40 Prozent der Steigerung des Landesindexes der Konsumentenpreise erhöht werden.» Dieselbe BWO-Mitteilung: die Teuerung könne zu 40 Prozent angerechnet werden.[21]

**Stand der 40 Prozent.** Gültig. Der Vernehmlassungsentwurf vom April 2024 sah 28 Prozent vor. Der Bundesrat hat am 21. März 2025 nur einen Teil übernommen (Formulare, Art. 19 und 19a, in Kraft seit 1. Oktober 2025); die genauere Berechnung des Teuerungsausgleichs fiel weg.[22] Die konsolidierte Fassung vom 1. Oktober 2025 nennt in Art. 16 weiterhin 40 Prozent.[20] Die Vernehmlassung vom 25. Februar 2026 betrifft die zulässige Rendite, nicht Art. 13 oder 16. Das BWO überarbeitet das Mietzinsmodell (BWO-Bericht[4]); eine neue Zahl gilt erst mit einer Verordnungsänderung.

**Referenz, eine Setzung.** 7.5 Prozent = 1. Grösster Fall der Bins: Erhöhung um zwei Zinsschritte (6.09 Prozent) plus 40 Prozent der obersten Teuerungsstufe (1.2 Prozent), zusammen 7.29 Prozent. Die Referenz ist das nächste halbe Prozent darüber; kein Bin-Fall erreicht 1. Die grösste Senkung liegt bei −0.77. Nicht gesetzt sind die Verhältnisse: ein Zinsschritt (3 Prozent) zu x Prozent Teuerung ist 3 : 0.4 x im Referenzzins-Regime und 3 : 0.85 x im Landesindex, unabhängig von der Referenz.

**Folgen für die Baseline.** Alle Städte tragen Teuerung −1 (0.25 Prozent) und Referenzzins unverändert. Das Referenzzins-Regime erlaubt damit 0.1 Prozent im Jahr, in der Einheit 0.013. Die Bestandsmiete steigt in der «Heutigen Situation» von Zürich über drei Phasen auf 0.008 (vorher 0). Das ist fachlich richtig, 40 Prozent von 0.25 Prozent. Im Widget erscheint es mit zwei Nachkommastellen als +0.01 in Phase 3. Ein Zinsschritt ist jetzt 0.40 statt 0.50, eine Senkung −0.39 statt −0.50.

**Was das Umstellen mitzieht.** `FRONTLOAD`, `VERWEIL_GEWICHT` und `CAP_INVEST_WEIGHT` sind unverändert und weiter nicht kalibriert. Weil die gesperrte Teuerung jetzt durch 7.5 statt 3 geteilt wird, wirkt dieselbe Vorladung (`FRONTLOAD` 0.4) nur noch 0.4-mal so stark wie vorher. `pullBestand` zieht jede positive Bestandsmiete an den Deckel zurück, auch die zulässige Teuerungsüberwälzung. Deshalb bewegt die Durchsetzung allein in der Baseline jetzt etwas, höchstens 0.003, unter der Anzeigeschwelle. Die Regime-Zustände fliessen weiterhin nicht in Preistrends und Mietbelastung ein.

**Offen.**
- Ob ein Rückgang des LIK im Referenzzins-Regime einen Senkungsanteil gibt. Art. 16 spricht nur von der Steigerung; der Code rechnet nur positive Teuerung. Ein Herabsetzungsbegehren nach der relativen Methode kann ihn anrechnen; nicht geprüft.
- Kostensteigerungen (Unterhalt, Betrieb) als dritter Anteil des Spielraums fehlen. Art. 13 verrechnet sie mit Senkungen.
- Die Pauschale geht davon aus, dass frühere Senkungen weitergegeben wurden (Art. 13 Abs. 4). Wo nicht, ist es die verpasste Senkung und gehört zur Mietlücke.
- Die Mietlücke muss in derselben Einheit gesetzt werden: Abstand in Prozent, geteilt durch 7.5.
- `pullBestand` unterscheidet die zulässige Überwälzung nicht von einer Überhöhung über dem Deckel.

### `ctx:anteil_altliegenschaft` — gemessen, ohne Wirkung

Messvorschrift: Gebäude- und Wohnungsstatistik, Wohnungen nach Bauperiode, nur Mietwohnungen.[8] Schnitt: Baujahr ≤ Stichtag − 30. Pro Gemeinde. Rohwert, keine Stufe.

Nicht abziehen: jüngere Handänderungen. Nach dem Urteil bleibt ein 1980 erstelltes, 2020 verkauftes Haus alt.[6]

**Gefüllt, November 2026.** GWS, Bestand am 31. Dezember 2025, Swiss Stats Explorer `DF_GWS_REG5` (Nachfolger von STAT-TAB px-x-0902020200_102), Wohnungen nach Gemeinde, Gebäudekategorie und Bauperiode.[23] Die Schweizer Summe der Tabelle (4 883 159) passt zu den 4,88 Millionen Wohnungen «Ende 2025» der BFS-Mitteilung.[24] Schnitt: Bauperiode bis 1995. Stichtag − 30 ist 1995, die Klassengrenze 1991–1995 trifft die Grenze genau. Abgrenzung: Wohnungen in Wohngebäuden ohne Einfamilienhäuser.

| Stadt | bis 1995 | Total ohne EFH | Anteil | alle Wohnungen | bis 1990 | bis 2000 |
|---|---:|---:|---:|---:|---:|---:|
| Zürich | 174 504 | 230 273 | 0.758 | 0.764 | 0.739 | 0.775 |
| Genf | 98 922 | 113 686 | 0.870 | 0.870 | 0.838 | 0.914 |
| Basel | 89 503 | 99 482 | 0.900 | 0.903 | 0.884 | 0.909 |
| Lausanne | 68 115 | 80 353 | 0.848 | 0.846 | 0.836 | 0.859 |
| Bern | 70 841 | 78 695 | 0.900 | 0.902 | 0.891 | 0.918 |
| Winterthur | 35 789 | 50 618 | 0.707 | 0.719 | 0.671 | 0.735 |
| Luzern | 37 427 | 46 503 | 0.805 | 0.805 | 0.777 | 0.833 |
| St. Gallen | 35 388 | 43 073 | 0.822 | 0.823 | 0.795 | 0.844 |
| Lugano | 29 957 | 36 895 | 0.812 | 0.811 | 0.763 | 0.829 |
| Biel | 24 973 | 30 679 | 0.814 | 0.816 | 0.795 | 0.854 |

Abweichung von der Messvorschrift: Die GWS kennt keine Bewohnerart. «Nur Mietwohnungen» pro Gemeinde ist nicht publiziert. Im Wert stecken Stockwerkeigentum, Genossenschaften, leere und zeitweise bewohnte Wohnungen. Richtung: eher zu tief. Schweizweit sind Mietwohnungen älter als der Durchschnitt, gebaut bis 1990 sind es 70.0 gegen 65.4 Prozent aller bewohnten Wohnungen, beim Stockwerkeigentum 39.9 Prozent.[25] In Städten mit wenig Eigentum dürfte der Abstand kleiner sein. Pro Stadt ist er nicht gemessen. Die Annahme oben, Einfamilienhäuser zögen den Anteil nach unten, stimmt in diesen Städten nicht: dort sind sie älter als der Rest. Weglassen senkt den Wert leicht, in Winterthur um 1.2 Punkte. Renovationen bleiben unberücksichtigt; die Bauperiode ist die Erstellung.

Solange `WIRKSAMKEIT_OQU` auf 0 steht, ändert der Anteil kein Ergebnis. Geprüft: alle Städte, alle Phasen, leeres Diff und `mietrecht_kriterium` 1 → 2, mit und ohne Feld identisch. Der Test `anteil-altliegenschaft.test.ts` hält das fest.

### `ctx:mietluecke` — nicht belegt, nicht gesetzt

Der Deckel ist eine Nettorendite auf indexiertem Eigenkapital, höchstens zwei Punkte über dem Referenzzinssatz, solange der bei 2 Prozent oder darunter liegt. Der Satz steht seit dem 2. September 2025 bei 1.25 Prozent und ist ab dem 2. September 2026 unverändert.[9] Zulässig sind damit 3.25 Prozent. Den Abstand dazu publiziert niemand: es bräuchte Nettomiete, Betriebskosten und historische Anlagekosten pro Liegenschaft.

Nicht verwenden: 360 Franken, 32 Prozent, 10 Milliarden. Kampagnengrössen, solange die Studie nicht methodisch geprüft ist.

Die IAZI-Studie von Ende 2024, auf die der BWO-Bericht verweist, prüft, ob das alte Kostenmodell zur Finanzierung passt. Sie misst nicht den Abstand der einzelnen Miete zum Deckel.[4]

Proxy, der den Deckel nicht ersetzt: Mietpreiserhebung Stadt Zürich, Nettomieten im Bestand, nach Mietdauer. Portalpreise sind ausgeschriebene Bruttomieten, ausdrücklich nicht der Bestand.[10] Lange Mietdauer mal Referenzzinspfad seit Vertragsbeginn ist die verpasste Senkung unter der relativen Methode, nicht der absolute Ertragstest. Gemeinnützig gegen privat zeigt zwei Teilmärkte, nicht einen Prozentsatz über dem Deckel. Die Häuser sind nicht dieselben.

**Suche November 2026: kein Ertragstest, nur der Mietdauer-Abstand.** Eine öffentliche Datenbasis mit Anlagekosten pro Liegenschaft gibt es weiterhin nicht. Publiziert ist der Abstand zwischen Neubezug und langer Mietdauer, aus drei Quellen. Proxy: `1 − Miete(lange Mietdauer) / Miete(Neubezug)`.

- BFS Strukturerhebung 2024, T 09.03.03.67, Nettomiete von Mieter- und Genossenschafterwohnungen nach Zimmerzahl und Bezugsdauer, nur Zürich, Genf, Basel, Lausanne und Bern.[26] Neubezug unter 2 Jahren gegen 21 Jahre und mehr, Mittel aus 2 bis 4 Zimmern: Zürich 0.36 (3 Zimmer 2125 gegen 1346 Franken), Lausanne 0.35, Genf 0.32, Basel 0.28, Bern 0.27, Schweiz 0.26. Die Stichprobe ist klein. Die Vertrauensintervalle verschieben die Einzelwerte um bis zu ±0.10.
- BFS Strukturerhebung 2024, T 09.03.03.64, nach Kanton.[27] Sie trennt Neubau vom Neubezug einer älteren Wohnung. Neubezug älter gegen 21 Jahre und mehr: Genf 0.28, Waadt 0.26, Zürich 0.23, Luzern 0.17, Bern 0.16, Basel-Stadt 0.16, St. Gallen 0.15, Tessin 0.13, Schweiz 0.18. Kanton, nicht Stadt. Für Winterthur, Luzern, St. Gallen, Lugano und Biel gibt es nur diese Ebene.
- Mietpreiserhebung Stadt Zürich 2026, Stichtag 1. April 2026, typische 75-Quadratmeter-Wohnung, nicht gemeinnützig: Neubezug in älterem Gebäude 2287, 3 bis 10 Jahre 2086, ab 10 Jahren 1657, über 20 Jahre 1416 Franken. Abstand über 20 Jahre: 0.38. Gemeinnützig: über 20 Jahre 1080 gegen 1145 bis 1174 Franken, 0.06 bis 0.08.[28]

Was der Proxy misst: wie weit lange Verträge unter dem heutigen Neuabschluss liegen. Das ist eher die Lücke zur Anfangsmiete als eine Überhöhung des Bestands über dem Deckel; das Vorzeichen ist entgegengesetzt. Was er nicht misst: den absoluten Ertragstest. Er enthält Lage, Zustand und Gebäudealter (lange Verträge liegen öfter in unrenovierten Altbauten) und in den BFS-Tabellen den Genossenschaftsanteil. Er enthält nicht die verpasste Senkung im Bestand. Die Zürcher MPE zeigt die Mischung: nicht gemeinnützig 0.38, gemeinnützig unter 0.10.

Skala: Die Regime-Einheit ist Prozent geteilt durch 7.5 (oben). Ein Abstand von 36 Prozent ergäbe 4.8 und läge weit über der Klemme bei 1. Der Proxy lässt sich deshalb nicht ohne zusätzliche Setzung in `mietluecke` übertragen. Kein Wert gesetzt; der Entscheid liegt beim Projektinhaber.

**Entscheid 15. November 2026: anzeigen, nicht rechnen.** Der Mietdauer-Abstand steht als `mietabstand_neubezug` im Stadt-Kontext und erscheint in der Kontextleiste («Neubezug ggü. Altmiete»), als Verhältnis Neubezug zu 21 und mehr Jahren Mietdauer. Stadtwerte aus T 09.03.03.67, Mittel der Verhältnisse für 2 bis 4 Zimmer: Zürich 1.56, Lausanne 1.54, Genf 1.48, Basel 1.38, Bern 1.38. Für Winterthur, Luzern, St. Gallen, Lugano und Biel nur der Kantonswert aus T 09.03.03.64 (Neubezug einer älteren Wohnung): 1.30, 1.21, 1.18, 1.16, 1.19. Die beiden Ebenen sind nicht vergleichbar, die Anzeige nennt die Ebene. Es sind Durchschnitte; einzelne Wohnungen liegen weit darüber. Der Wert fliesst in keine Rechnung (Test `mietabstand-neubezug.test.ts`). `mietluecke` bleibt leer.

In `switzerland.yaml` fehlt `mietluecke`; das Build-Skript lehnt einen Wert ohne `mietlueckeEstimated: true` ab. Durchsetzung multipliziert mit 0. Eine Initiative ohne gesetzte Lücke senkt nichts. Das ist Absicht. Ein gesetzter Wert braucht `mietlueckeEstimated: true`, bis eine Stichprobe mit Anlagekosten vorliegt. Die Angebotsmiete ist endogen und darf nicht als Kontext festgenagelt werden.

## Provisorische Graph-Anpassung

Zwei neue Schieber, Baseline für alle Städte in `switzerland.yaml`:

| Schlüssel | 0 | 1 (Baseline) | 2 |
|---|---|---|---|
| `mietrecht_kriterium` | Kosten plus Rendite exklusiv, Orts- und Quartierüblichkeit gestrichen | Heutiges Recht | Vergleichsmiete bindend |
| `mietrecht_durchsetzung` | Nur auf Klage | Erleichterte Anfechtung | Automatische periodische Prüfung |

`mietrecht_kostenmiete` bleibt der Intensitätskanal der bestehenden Kanten (Angebot, Investition, Friktion). Genf und Basel stehen dort auf 2 aus kantonalen Gründen. Diese Stufe nicht zur Initiative umdeuten.

`mietrecht_mietzinsindex` bleibt der Anpassungsmechanismus: 0 Referenzzinssatz, 1 Landesindex, 2 Kostenbindung. Die Kante auf `mietpreis_schutzlevel` ist entfernt. Der Nenner `E1_NORMALIZATION.mietpreis_schutzlevel` ist nicht neu kalibriert. Die übrigen Schutz-Kanten sind damit relativ zur alten Summe etwas schwächer. Provisorisch hinnehmbar, nicht als neue Empirie lesen.

Neue Zustände, ausserhalb der linearen Kantensumme, eine Phase Verzug, kein Fixpunkt:

1. `vergleichsmiete_aktiv` — Tor. Kriterium 0 → 0. Kriterium 2 → 1. Kriterium 1 → Anteil × Wirksamkeit, heute 0.
2. `bestandsmiete` und `anfangsmiete` — plus heisst teuer. Überhöhung ist `max(0, miete)`. Kein eigener Knoten.
3. `erhoehungsspielraum` — zulässige Mietzinsänderung in Prozent, geteilt durch `ERHOEHUNG_REFERENZ_PROZENT` (7.5). Index 0: Änderung des Referenzzinssatzes über zwölf Monate (`ctx:referenzzins_aenderung`, nicht `ctx:zinsniveau`; 3 Prozent je Schritt, Art. 13 VMWG) plus 40 Prozent der Teuerung (Art. 16 VMWG). Index 1: `ctx:teuerung` in Prozent × `LIK_PASS_THROUGH` (0.85, Mitte der 80/90 Prozent[4]). Index 2 ist 0. Herleitung oben, Abschnitt Erhöhungsspielraum. Vermieter ziehen nur positives Spielraum nach. Senkungen laufen über die Durchsetzung.
4. Teuerung ist Kontext plus dieser Schalter, kein eigener E1-Knoten.
5. Durchsetzung ist die Intensität 0 / 0.5 / 1 und multipliziert die Überhöhung. Ohne gesetzte Lücke ist der Abzug 0.
6. `verweildauer` liest die Mietlücke der Vorperiode. Nicht `marktfriktion` umdeuten.

Vorladung, innen in der Anfangsmiete: `gesperrte Teuerung × max(0, Verweildauer der Vorperiode) × (1 − Durchsetzung)`. Eine negative Verweildauer lädt nichts vor. Der Abzug auf Investition und Angebot wird pro Phase neu angesetzt und nicht übertragen. `FRONTLOAD` ist 0.4 und nicht kalibriert. Zielgrösse, nicht eingesetzt: der Genfer Abstand aus dem bestehenden Kommentar in `phase-weights.ts` (lange Verweildauer, deutlicher Neuaufschlag).

Rückkopplung der Vergleichsbasis nur in die nächste Phase, und nur bei offenem Tor. Investition und Angebot bekommen provisorisch einen Abzug nur, wenn der Deckel bindet, die Durchsetzung über 0 liegt und eine Lücke gesetzt ist. Der Gegenvorschlag hat kein festes Vorzeichen auf die Investition.

Annahme, weil die Pipeline nur Diffs sieht und nicht den absoluten Stadtwert: ohne Diff ist der Index der Referenzzinssatz (0). Das stimmt für `switzerland.yaml`. Es stimmt nicht für Testfixturen, die den Index absolut auf 1 oder 2 setzen und ihn nicht diffen. Deren lineares Verhalten ändert sich dadurch nicht.

## Parallelen aus docs/recherche

Stand der Sammlung, nicht des Webs. Argentinien fehlt. Kein Land, keine Reform, kein DNU. Die Liberalisierung, die hier liegt, ist die Aufhebung der Kontrolle in Cambridge 1994 und das Ende des Berliner Deckels 2021. «USA liberal» ist in diesen Notizen kein Befund. Die US-Studien betreffen die kontrollierten Ausnahmen.

Die brauchbare Achse ist das Kriterium, nicht das Land.

**Vergleichsmiete, schwach vollzogen.** Die deutsche Mietpreisbremse deckelt Neuvertragsmieten bei 10 Prozent über der ortsüblichen Vergleichsmiete. DIW: moderate Dämpfung, Verlagerung in möblierte und befristete Angebote (DE-001). IW auf Inseraten: kein Preiseffekt, der Grossteil liegt weiter mehr als 10 Prozent über der Vergleichsmiete (DE-002). Dasselbe Muster wie die Orts- und Quartierüblichkeit: das Kriterium existiert, der Preis richtet sich nicht danach, solange niemand es durchsetzt. Paris ist die gebundenere Variante. Encadrement des loyers, Referenzmiete mit Band: −5,2 Prozent über fünf Jahre, im letzten Jahr −8,2. Angebot nicht gemessen (FR-003).

**Harter Deckel, dann Aufhebung.** Berlin 2020/21: Mieten im regulierten Segment sanken, Inserate gingen zurück, an der Grenze zu Brandenburg stiegen sie, Vermieter schrieben Klauseln gegen das Festliegen auf einer tiefen Miete (DE-004, DE-005, DE-009). Das ist die Vorladung, nur vertraglich statt im Anfangsmietzins. Nach dem Urteil vom April 2021 holten die Mieten auf. Cambridge ist dieselbe Geschichte von der anderen Seite: nach der Abschaffung etwa +45 Prozent bei den vorher kontrollierten Wohnungen, etwa +25 Prozent bei den nicht kontrollierten, danach wieder Investitionen (US-017).

**Bestandsschutz ohne funktionierende Anfangsmiete.** San Francisco: geschützte Mieter bis zu 50 Prozent unter der Marktmiete, 20 Prozent weniger Umzüge, 15 Prozent der kontrollierten Einheiten vom Markt, stadtweite Mieten +7 Prozent (US-001). New York: Fluktuation 3 Prozent im stabilisierten Bestand gegen 25 Prozent im freien, freie Mieten 22 bis 25 Prozent höher als ohne Stabilisierung (US-009). Genf ist die Schweizer Ausgabe: Bestand 279 Franken pro Quadratmeter und Jahr, Neuvertrag 372, Abstand etwa 33 Prozent, Mietdauer 13,7 Jahre (CH-005). Das Anfechtungsrecht der Anfangsmiete hat auf die Neuvertragsmieten keinen messbaren Effekt (CH-003). Die Lücke ist da. Die Klage schliesst sie nicht.

Stockholm warnt vor dem Wort Vergleichsmiete. Das Utility-Value-System ist eine kollektive, nicht marktbasierte Vergleichsmiete. Wartelisten von 10 bis 20 Jahren, Schwarzmarkt bei der Untervermietung (SE-001). «Vergleich» kann der Markt sein oder sein Gegenteil. Der Gegenvorschlag meint das erste. Stockholm ist das zweite.

Kholodilin, 112 Studien, 1967–2023: im regulierten Sektor tiefere Mieten, weniger Angebot, weniger Mobilität, im unregulierten Sektor höhere Mieten, weniger Neubau (GLOBAL-012, GLOBAL-027). Kholodilin und Kohl, 16 Länder, 1910–2016: restriktives Mietrecht drückt den Neubau. Ausnahme, die sie selbst nennen: Neubau, der von der Kontrolle ausgenommen ist, zeigt den Effekt nicht (GLOBAL-029). Bei neueren Schweizer Bauten gilt die Bruttorendite, nicht die Vergleichsmiete. Ein Modell, das jede Verschärfung gleich stark auf das Angebot legt, widerspricht diesem Befund.

Die Niederlande sind die schwächste Parallele. Nach der Vertrags-Liberalisierung stieg der Anteil befristeter Verträge bei privaten Vermietern von 17,7 auf 36,6 Prozent (NL-001). Eine Ausweichform, wie die möblierten Wohnungen in Deutschland. Kein Mietniveau, kein Renditedeckel.

Was die Sammlung nicht hat: keine Studie schaltet von Kosten plus Rendite auf eine statistische Vergleichsmiete um und misst, ob die Referenz mit den bezahlten Mieten nach oben läuft. Die externe Suche dazu ist unten nachgetragen. Der Gegenvorschlag bleibt eine offene Rückkopplung, keine kalibrierte Kante.

## Externe Suche: Regimewechsel und Spirale

Drei Läufe, September 2026. Akademische Archive (Scholar, IDEAS, SSRN, IZA, DIW, SciELO) sind durch. Der erste Presse-Lauf ist nach zehn Minuten abgebrochen. Der zweite hat die offenen Körper gelesen. Was unten steht, ist gegen den Artikel geprüft. Snippets und Paywall-Zeilen stehen nicht.

**Der fehlende Test bleibt offen.** Keine gelesene Studie schaltet von Kostenmiete plus Renditedeckel auf eine statistische Vergleichsmiete und prüft, ob die Referenz mit den bezahlten Mieten steigt. Argentinien ist dafür der falsche Test. Ley 27.551 war nie Kostenmiete und nie Vergleichsmiete.

**Was Argentinien war.** Ab Juli 2020: Mindestlaufzeit drei Jahre, Erhöhung nur einmal im Jahr, Anpassung über den ICL, einen Durchschnitt aus Inflation und Löhnen. Anfangsmietzins frei. Am 21. Dezember 2023 hob das Dekret die Regeln auf: Indexpflicht weg, jährliche Erhöhungsschranke weg, Verträge wieder in Fremdwährung, Mindestlaufzeit zwei Jahre.[11] Das ist Vertragsliberalisierung unter Hyperinflation, nicht der Schweizer Systemwechsel.

**Was gemessen wurde.** Elfert und Thomsen, IZA DP 18107, September 2025, Regression Discontinuity an wöchentlichen Inseraten für Buenos Aires, Schnitt 21. Dezember 2023. Am Cutoff ein sofortiger Angebotsanstieg von rund 46 Prozent, etwa 2 670 Einheiten. Die Punktschätzer: nominale Preise bis zu 2,6 Prozent tiefer, reale Preise 13 bis 29 Prozent tiefer.[11] Im Fenster 2019–2024 liegt der Angebotseffekt je nach Spezifikation bei etwa 42 bis 88 Prozent. Zur Einführung 2020, deskriptiv, nicht kausal: das Angebot fiel bis 2023 auf etwa 60 Prozent des Ausgangsniveaus. Inflation 2023: 211 Prozent.[11] Die Autoren lesen das als freigesetztes, vorher zurückgehaltenes Angebot, das die Überschussnachfrage kurzfristig aufnimmt. Sie messen keine Vergleichsbasis und keine Rückkopplung.

Das ist ein Niveau- und Angebotssprung nach Liberalisierung. Es ist keine Spirale. Wer den Gegenvorschlag damit kalibrieren will, kalibriert das Falsche: einen Schock in einem Markt mit dreistelliger Inflation, nicht das Hochziehen einer statistischen Referenz.

**Presse: Angebot, keine Spirale.** Infobae, 24. Januar 2024, zitiert Monitor Inmobiliario und Zonaprop. Das Angebot in der Stadt Buenos Aires lag im Januar 2024 um 60 Prozent über Januar 2023: damals 5 155 Wohnungen, 256 Häuser und 128 PH, zusammen 5 539 Einheiten. Auf einigen Portalen etwa 9 000 Wohnungen.[12] Journalistischer Bericht, keine Studie, keine Vergleichsbasis.

La Nación, 11. Januar 2024, zitiert Soledad Balayan von Maure, keine Studie. In den ersten zehn Januartagen 2024 gegen denselben Zeitraum 2023: Zonaprop plus 20 Prozent, Argenprop plus 47 Prozent. In einer Woche die Inserate auf Zonaprop von 5 700 auf 6 500.[15] Die Preiszahl im selben Text ist nicht der Pfad nach dem Dekret. Sie beschreibt das letzte Monat 2023, also noch unter der alten Regel: plus 18,6 Prozent im Monat. Über das Jahr 2023 plus 260 Prozent, über der Inflation von 190,9 Prozent und über dem ICL von 135,5 Prozent.[15] Angebotsmieten liefen dem gesetzlichen Index davon. Das ist Vorladung, nicht eine Vergleichsbasis, die sich selbst hochzieht.

Infobae, Meinung, 5. Oktober 2024, Hauserman und Grandes. Keine Studie, keine Tabelle. Der Untertitel sagt, die Aufhebung habe das Angebot verdreifacht und eine reale Senkung von 30 Prozent ermöglicht. Im Text steht daneben, das Angebot sei unter der Ley praktisch auf die Hälfte gefallen und in neun Monaten danach verdoppelt. Dieselbe Seite: der alte Index hätte im August 244 Prozent verlangt, die durchschnittliche Erhöhung sei 144 Prozent gewesen, die Inflation 235 Prozent, daraus eine reale Senkung von 30 Prozent.[16] Drei Angebotssätze in einem Text, die 30 Prozent ohne ausgewiesene Formel. Nicht als Messung verwenden. Der Text beschreibt die Ley als Verlängerung der Mindestfrist von 24 auf 36 Monate.[16] Das berührt die offene Dauerfrage, es ersetzt den Gesetzestext nicht.

Ein Fachkommentar der Kammer der Eigentümer vom 22. Juli 2024 schreibt, die Ley Bases festige die mietrechtlichen Bestimmungen des Dekrets vom Dezember 2023.[14] Das ist kein Amtsblatt. Dieselbe Seite nennt Angebotszahlen, die den 5 539 Einheiten von Infobae widersprechen. Sie werden hier nicht verwendet. Zur Mindestlaufzeit bleibt der IZA-Satz massgebend: von drei auf zwei Jahre.[11] Der Kommentar liest das Dekret als Abschaffung der Mindestfrist. Den Gesetzestext habe ich nicht gelesen. Die Dauer ist damit nicht bereinigt.

Reuters-Körper nicht gelesen. Die Live-Seite antwortet mit 401, das Wayback-Verzeichnis mit 429, die Archivkopie vom 23. März 2026 auf archive.ph hinter einem Captcha. Der Suchindex zeigt einen Satz über einen einzelnen Haushalt, dessen Mietanteil von etwa 30 auf die Hälfte des Einkommens gestiegen sei. Das ist ein Snippet, kein gelesener Artikel, und keine Marktstatistik. BBC ohne Mietzahl. Economist: die indexierten Texte von Ende 2024 sind Bezahlschranken ohne lesbare Mietzahl.

Der Tages-Anzeiger vom 10. Januar 2025, Quentin Schlapbach, ist auch als Archivkopie vom 17. Januar 2025 eine Bezahlschranke. Lesbar ist nur der Vorspann: eine Studie untersuche das Mietzinsmodell des Bundesamts für Wohnungswesen, das Modell aus den 1980er-Jahren sei bis heute massgebend, mehrere Annahmen seien überholt, den jüngsten Erhöhungen fehlten die faktischen Grundlagen.[17] Die Zahl «30 Prozent», die in Suchsnippets kursiert, steht in diesem Vorspann nicht. Der Körper bleibt ungelesen. Die Zahlen zur selben IAZI-Studie stehen in der NZZ-Archivkopie.[13]

**Mietspiegel: Abwärtslücke, keine Aufwärtsspirale.** Zwei Papiere, beide 2015, beide gelesen. Keines schaltet von Kosten plus Rendite auf eine statistische Vergleichsmiete um.

Wölfle, CRES Discussion Paper No. 6, Simulation für Hamburg, Auftrag des Forschungsverbandes für Immobilien-, Hypotheken- und Baurecht. Die Richtung ist eine doppelte Bremse nach unten, nicht ein Hochziehen. «Der Mietspiegel soll üblicherweise aus den Mieten der vier vergangenen Jahre gebildet werden. Werden jedoch gerade die Mietabschlüsse gebremst, so geht diese Bremswirkung auch auf den Mietspiegel über.» Nach 20 Jahren ein Unterschied von 0,76 Euro pro Quadratmeter gegen die übliche Mietentwicklung.[18] Das ist eine Modellrechnung, keine Messung, und das Gegenteil der These, die Vergleichsbasis laufe mit den bezahlten Mieten nach oben.

Lerbs und Sebastian, IREBS Heft 10, zitieren das Bundesinstitut für Bau-, Stadt- und Raumforschung, messen die Lücke nicht selbst. «Die ortsübliche Vergleichsmiete liegt in der Mehrheit der Fälle deutlich (bis zu 42 Prozent) unter der Angebotsmiete … Abweichungen nach oben kommen hingegen nicht vor.»[19] Das BBSR-Papier dahinter (Held u. a.) habe ich nicht gefunden. Die 42 Prozent bleiben eine zitierte Abwärtslücke, keine gemessene Spirale. Lerbs und Sebastian lesen den geltenden Mietspiegel als politisch nach unten verzerrt. Eine Vergleichsbasis, die sich selbst hochzieht, beschreiben sie nicht.

**Die IAZI-Studie ist nicht der fehlende Test.** NZZ, Albert Steck, 18. Januar 2025, gelesen als Archivkopie vom 11. Februar 2025. IAZI im Auftrag des Bundesamts für Wohnungswesen, Tausende Objekte, Marktwert 90 Milliarden Franken. Profi-Investoren: 24 Prozent Fremdkapital, 76 Prozent Eigenkapital. Das geltende Modell rechnet mit 60 und 40. Steigt der Referenzzins um 25 Basispunkte, erlaubt das Modell 3 Prozent; beim gemessenen Fremdkapitalanteil von 24 Prozent wären es 1,2 Prozent. Die Teuerung fliesst heute zu 40 Prozent ein, entsprechend dem angenommenen Eigenkapital. Die IAZI-Simulation über zehn Jahre: mit der revidierten Rechnung, höherer Eigenkapitalanteil, wären die Mieten stärker gestiegen als unter dem geltenden Modell. Scognamiglio: bei sinkenden oder stabilen Zinsen fallen die Mieten tendenziell zu tief.[13] Die UBS-Prognose von 20 Prozent bis 2025 trat nicht ein. Der Satz stieg nur auf 1,75 Prozent, die Mieten um 8 Prozent.[13] Das ist das Referenzzinsmodell, Kosten plus angenommene Kapitalstruktur. Keine statistische Vergleichsmiete, keine Spirale. Es erklärt, warum «stärker an die Teuerung» in der Schweizer Debatte schon vor dem Gegenvorschlag lag. Es misst nicht, ob eine Vergleichsbasis mit den bezahlten Mieten nach oben läuft.

## Was dieser Stand nicht ist

Kein Schiedsrichter zwischen Mieterverband und Bundesrat. Die Spirale kann erst sichtbar werden, wenn das Tor offen ist und die Mieten über der Basis liegen. Mit der Teuerung 2025 und ohne gesetzte Mietlücke tut sie das nicht. Wer ein Szenario «Mieten explodieren» sehen will, muss die Lücke belegen oder die Teuerung als Szenario setzen — und das als Annahme kennzeichnen.

## Sources

[1] https://www.admin.ch/de/newnsb/EbAjw2abDf3e — Bundesrat Medienmitteilung 25.09.2026
[2] https://www.sp-ps.ch/kampagne/mietpreis-initiative — SP Mietpreis-Initiative Initiativtext
[3] https://www.tagesanzeiger.ch/mietpreisinitiative-bundesrats-gegenvorschlag-ist-ein-skandal-109555734937 — Tagesanzeiger Gegenvorschlag Skandal
[4] https://cms.news.admin.ch/fileservice/sdweb-docs-prod-nsbcch-files/files/2026/09/25/43bdc0bb-55ce-43bc-8dcd-e0ac8ee3d690.pdf — BWO-Bericht Mietzinsmodell 25.09.2026
[5] https://www.20min.ch/story/initianten-toben-zoff-um-mietpreise-bundesrat-spielt-brandstifter-103638675 — 20 Minuten Mieterverband zum Gegenvorschlag
[6] https://www.bger.ch/ext/eurospider/live/de/php/aza/http/index.php?highlight_docid=atf%3A%2F%2F144-III-514%3Ade&lang=de&type=show_document&zoom=YES — BGE 144 III 514
[7] https://www.bfs.admin.ch/bfs/de/home/statistiken/preise/landesindex-konsumentenpreise.html — BFS Landesindex der Konsumentenpreise
[8] https://www.bfs.admin.ch/bfs/de/home/statistiken/bau-wohnungswesen/wohnungen.html — BFS Gebäude- und Wohnungsstatistik Wohnungen
[9] https://www.bwo.admin.ch/bwo/de/home/mietrecht/referenzzinssatz.html — BWO hypothekarischer Referenzzinssatz
[10] https://www.stadt-zuerich.ch/artikel/de/statistik-und-daten/mietpreise-2024-in-der-stadt-zuerich.html — Mietpreiserhebung Stadt Zürich 2024
[11] https://docs.iza.org/dp18107.pdf — Elfert/Thomsen, IZA DP 18107, September 2025
[12] https://www.infobae.com/economia/2024/01/24/alquileres-en-caba-luego-del-dnu-de-milei-la-oferta-salto-un-60-y-volvieron-a-publicarse-casas-despues-de-ocho-meses/ — Infobae, 24.1.2024, Angebot CABA
[13] https://web.archive.org/web/20250211004110/https://www.nzz.ch/wirtschaft/mieter-sind-profiteure-des-heutigen-mietzinsmodells-jetzt-will-der-bund-die-berechnungsformel-anpassen-ld.1866568 — NZZ, Albert Steck, 18.1.2025, Archiv 11.2.2025
[14] https://www.reporteinmobiliario.com/article5496-alquileres:-ley-bases-consolido-dnu — Reporte Inmobiliario, 22.7.2024, Fachkommentar Ley Bases
[15] https://www.lanacion.com.ar/propiedades/inversiones/alquileres-aumento-record-de-la-oferta-en-apenas-diez-dias-los-precios-y-claves-para-cerrar-un-buen-nid11012024/ — La Nación, Carla Quiroga, 11.1.2024
[16] https://www.infobae.com/opinion/2024/10/05/el-mercado-de-alquiler-tras-su-liberacion/ — Infobae Meinung, Hauserman/Grandes, 5.10.2024
[17] https://web.archive.org/web/20250117170353/https://www.tagesanzeiger.ch/mieten-schweiz-mietzinserhoehung-wegen-veralteten-modells-862157887436 — Tages-Anzeiger, Schlapbach, 10.1.2025, Archiv 17.1.2025, nur Vorspann
[18] https://www.steinbeis-cres.de/assets/Forschung/Studie_Mietpreisbremse_20151031.pdf — Wölfle, CRES Discussion Paper No. 6, 2015
[19] https://epub.uni-regensburg.de/32398/3/IREBS_Heft_10.pdf — Lerbs/Sebastian, IREBS Heft 10, 2015
[20] https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de — VMWG, SR 221.213.11, Stand 1.10.2025, Art. 13 und 16 (gelesen 15.11.2026)
[21] https://www.admin.ch/de/newnsb/XAQAzjeJ5vT1zHSTJBRak — BWO, Mitteilung 1.9.2025, Referenzzinssatz 1.25 %, Senkungsanspruch 2,91 %, Teuerung 40 %
[22] https://www.srf.ch/news/schweiz/mietzinsdaempfer-per-verordnung-mehr-transparenz-beim-mietzins-neue-regeln-ab-oktober — SRF, 22.3.2025, Bundesratsentscheid zur VMWG-Revision
[23] https://stats.swiss/vis?lc=de&df[ds]=disseminate&df[id]=DF_GWS_REG5&df[ag]=CH1.GWS — BFS GWS, DF_GWS_REG5, Wohnungen nach Gemeinde, Gebäudekategorie und Bauperiode, Jahr 2025 (SDMX-Abfrage 15.11.2026)
[24] https://www.bfs.admin.ch/de/newnsb/xrhcMB8jXvge — BFS, Medienmitteilung 15.9.2026, Gebäude- und Wohnungsstatistik 2025
[25] https://www.bfs.admin.ch/asset/de/36398365 — BFS SE, T 09.03.02.01.05, Bewohnte Wohnungen nach Bauperiode und Bewohnertyp, 2024
[26] https://www.bfs.admin.ch/asset/de/36398555 — BFS SE, T 09.03.03.67, Mietpreis nach Zimmerzahl und Bezugsdauer, grösste Städte, 2024
[27] https://www.bfs.admin.ch/asset/de/36398542 — BFS SE, T 09.03.03.64, Mietpreis nach Bezugsdauer und Kanton, 2024
[28] https://www.stadt-zuerich.ch/artikel/de/statistik-und-daten/mietpreise-2026-in-der-stadt-zuerich.html — Statistik Stadt Zürich, Mietpreiserhebung 2026
