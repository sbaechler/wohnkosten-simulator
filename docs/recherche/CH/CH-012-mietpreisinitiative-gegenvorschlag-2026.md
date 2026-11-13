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

Die Mietpreis-Initiative will die geltende Kostenmiete plus Renditedeckel in der Verfassung festschreiben und periodisch durchsetzen. Der Bundesrat lehnt sie ab und kündigt einen indirekten Gegenvorschlag an: statistische Vergleichsmiete für den Anfangsmietzins, Indexierung im laufenden Verhältnis, keine behördliche Routinekontrolle.[1] Der BWO-Bericht, der in diese Arbeit einfliesst, beschreibt denselben Schritt als Systemwechsel weg von historischen Anlagekosten und Rendite, hin zu einem hedonischen Modell auf effektiv bezahlten Mieten, plus Anpassung um 80 oder 90 Prozent des Landesindexes — oder alle vier Jahre an die Vergleichsmiete.[7]

Der lineare Graph kann das nicht. Ein Schutzlevel hat kein Vorzeichen für «Bestand günstig, Einstieg teuer». Die Kante `mietrecht_mietzinsindex → mietpreis_schutzlevel` mit Vorzeichen +1 behandelt den Landesindex als mehr Schutz. Das ist die Annahme, nicht das Ergebnis.

## Zwei Vorlagen, nicht zwei Stufen desselben Schiebers

**Initiative.** Missbräuchlich ist ein Mietzins, der die tatsächlichen Kosten plus eine angemessene Rendite übersteigt oder auf einem übersetzten Kaufpreis beruht. Neu ist die Durchsetzung: automatisch und regelmässig, plus auf Verlangen.[2] Badran: damit entfällt das Kriterium der Orts- und Quartierüblichkeit, das mit der Kostenmiete unvereinbar sei.[4]

**Gegenvorschlag, amtlich.** Vergleichsmiete für den Anfangsmietzins, Indexierung im Bestand, keine automatische Kontrolle.[1] Vernehmlassung erst im ersten Halbjahr 2027. Was der Code abbildet, ist die Richtung aus Mitteilung und BWO-Bericht, kein Gesetz.

**Gegenvorschlag, gelesen von den Initianten.** Abschaffung des Renditedeckels, Marktmiete über Vergleichsmieten, Aufwärtsspirale, weil jede Erhöhung die Referenz hebt.[4][8] Das ist eine Lesart. Der Code darf sie nicht als Vorzeichen einbauen. Die Spirale ist eine Rückkopplung, die nur läuft, wenn das Vergleichsmieten-Tor offen ist.

## Wann Vergleichsmiete rechtlich «dran» ist

BGE 144 III 514, Regeste: eine Liegenschaft ist alt, wenn ihre Erstellung oder ihr letzter Erwerb beim Anfang der Miete mindestens 30 Jahre zurückliegt.[11] Erstellung zählt. Ein Verkauf setzt diese Uhr nicht zurück. Badrans Kolumne sagt das Gegenteil: 30 Jahre Haltedauer desselben Eigentümers, nicht das Alter der Liegenschaft.[4] Der provisorische Code folgt dem Urteil, nicht der Kolumne. Die Haltedauer ist in keiner öffentlichen Statistik.

Selbst dieser Rang ist nicht der Preis. Badran behauptet, die Verordnungskriterien seien so eng, dass noch nie ein Bundesgericht die Orts- und Quartierüblichkeit als nachgewiesen beurteilt habe.[4] Das ist ihre Behauptung, keine Auswertung der Rechtsprechung in diesem Dokument. Der Code trennt deshalb Rang und Wirksamkeit. `WIRKSAMKEIT_OQU` steht auf 0, mit diesem Vorbehalt. Im Status quo ist das Tor zu, auch in Zürich, auch bei hohem Altbauanteil. Bindend wird die Vergleichsmiete erst, wenn `mietrecht_kriterium` auf 2 steht (Gegenvorschlag). Die Initiative (`kriterium` 0) löscht das Kriterium.

Die 30-Jahre-Uhr ist ein Bestandsanteil am Stichtag, kein Zustand, der in den drei Phasen (0–2, 2–5, 5–10 Jahre) von selbst kippt.

## Drei Kontextwerte — was belegt ist

### `ctx:teuerung` — belegt, nationaler LIK

Rechtsgrundlage der Indexierung ist der Landesindex der Konsumentenpreise, nicht ein Regionalindex und nicht der Mietpreisindex. Jahresdurchschnitt gegen Vorjahr, BFS:[12]

| Jahr | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| % | −0.4 | 0.5 | 0.9 | 0.4 | −0.7 | 0.6 | 2.8 | 2.1 | 1.1 | 0.2 |

Bins, an dieser Reihe geeicht, im Code als `TEUERUNG_BINS` dokumentiert: unter 0 → −2, 0 bis 0.5 → −1, 0.5 bis 1.5 → 0, 1.5 bis 2.5 → +1, darüber +2. 2025 liegt auf −1. Alle Städte tragen diesen Wert. Der rechtlich massgebende Index ist national; ein Zürcher Regionalindex wäre für die 80/90-Prozent-Klausel die falsche Grösse.

Falle: 2025 kam der grösste Beitrag zur Jahresteuerung von der Wohnungsmiete selbst (0.364 Punkte).[12] Für den rechtlichen Nachzug bleibt der Gesamtindex richtig. Als unabhängiger Kostenschock ist er es nicht.

Mit Teuerung −1 und Überwälzung 0.85 ist der Erhöhungsspielraum im Indexregime leicht negativ. Eine Spirale aus der Teuerung 2025 erzeugt der Code nicht. Das ist der Befund der Reihe, kein fehlendes Gewicht.

### `ctx:referenzzins_aenderung` — belegt, Bins provisorisch

Im Referenzzins-Regime entsteht der Anspruch auf Erhöhung oder Senkung aus der Änderung des Satzes, nicht aus seinem Niveau. Bis November 2026 las der Code `ctx:zinsniveau`. Ein tiefes, unverändertes Niveau (−1) galt damit in jeder Phase als neuer Senkungsanspruch, und die Initiative senkte die Bestandsmiete auch ohne gesetzte Mietlücke. Das widersprach dem Abschnitt zur Mietlücke weiter unten.

Jetzt: Veränderung des Referenzzinssatzes über die letzten zwölf Monate, national. Bins in `REFERENZZINS_BINS`: Senkung um 0.5 Punkte oder mehr → −2, um 0.25 → −1, unverändert → 0, Erhöhung um 0.25 → +1, um 0.5 oder mehr → +2. Der Satz steht seit dem 2. September 2025 bei 1.25 Prozent und ist per 2. September 2026 unverändert.[14] Alle Städte tragen 0. Die Zuordnung Schritt zu Bin ist nicht kalibriert.

Nicht abgebildet: Senkungen aus früheren Jahren, die Mieter nie eingefordert haben. Das ist die verpasste Senkung unter der relativen Methode und gehört zur Mietlücke, nicht in diesen Kontextwert.

Offen: die Vorladung vergleicht weiterhin `Teuerung − Spielraum`, im Referenzzins-Regime also einen Teuerungs-Bin mit einem Zinsänderungs-Bin. Die Einheiten passen nicht zusammen. Das war schon mit dem Zinsniveau so.

### `ctx:anteil_altliegenschaft` — Messvorschrift, nicht gefüllt

Gebäude- und Wohnungsstatistik, Wohnungen nach Bauperiode, nur Mietwohnungen.[13] Schnitt: Baujahr ≤ Stichtag − 30. Nicht alle Wohnungen: Eigentum im Einfamilienhaus zieht den Anteil nach unten und interessiert den Knoten nicht. STAT-TAB, pro Gemeinde. Rohwert in den YAML-Kommentar, nicht eine erfundene Stufe.

Nicht abziehen: jüngere Handänderungen. Nach dem Urteil bleibt ein 1980 erstelltes, 2020 verkauftes Haus alt.[11]

Solange `WIRKSAMKEIT_OQU` auf 0 steht, ändert der fehlende Anteil das Status-quo-Ergebnis nicht. Gemessen werden muss er trotzdem, sonst kann niemand die Beweisregeln später lockern, ohne die Städte zu raten. Im provisorischen Code fehlt das Feld. Fehlend heisst nicht 0 Prozent Altbau, sondern «nicht verwendet».

### `ctx:mietluecke` — nicht belegt, nicht gesetzt

Der Deckel ist eine Nettorendite auf indexiertem Eigenkapital, höchstens zwei Punkte über dem Referenzzinssatz, solange der bei 2 Prozent oder darunter liegt. Der Satz steht seit dem 2. September 2025 bei 1.25 Prozent und ist ab dem 2. September 2026 unverändert.[14] Zulässig sind damit 3.25 Prozent. Den Abstand dazu publiziert niemand: es bräuchte Nettomiete, Betriebskosten und historische Anlagekosten pro Liegenschaft.

Nicht verwenden: 360 Franken, 32 Prozent, 10 Milliarden. Kampagnengrössen, solange die Studie nicht methodisch geprüft ist.

Die IAZI-Studie von Ende 2024, auf die der BWO-Bericht verweist, prüft, ob das alte Kostenmodell zur Finanzierung passt. Sie misst nicht den Abstand der einzelnen Miete zum Deckel.[7]

Proxy, der den Deckel nicht ersetzt: Mietpreiserhebung Stadt Zürich, Nettomieten im Bestand, nach Mietdauer. Portalpreise sind ausgeschriebene Bruttomieten, ausdrücklich nicht der Bestand.[15] Lange Mietdauer mal Referenzzinspfad seit Vertragsbeginn ist die verpasste Senkung unter der relativen Methode, nicht der absolute Ertragstest. Gemeinnützig gegen privat zeigt zwei Teilmärkte, nicht einen Prozentsatz über dem Deckel. Die Häuser sind nicht dieselben.

Im Code fehlt `mietluecke`. Durchsetzung multipliziert mit 0. Eine Initiative ohne gesetzte Lücke senkt nichts. Das ist Absicht. Ein gesetzter Wert braucht `mietlueckeEstimated: true`, bis eine Stichprobe mit Anlagekosten vorliegt. Die Angebotsmiete ist endogen und darf nicht als Kontext festgenagelt werden.

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
3. `erhoehungsspielraum` — Index 0 liest `ctx:referenzzins_aenderung` (Änderung des Referenzzinssatzes über zwölf Monate, nicht `ctx:zinsniveau`; siehe unten), Index 1 liest `ctx:teuerung × LIK_PASS_THROUGH` (0.85, Mitte der 80/90 Prozent[7]), Index 2 ist 0. Vermieter ziehen nur positives Spielraum nach. Senkungen laufen über die Durchsetzung.
4. Teuerung ist Kontext plus dieser Schalter, kein eigener E1-Knoten.
5. Durchsetzung ist die Intensität 0 / 0.5 / 1 und multipliziert die Überhöhung. Ohne gesetzte Lücke ist der Abzug 0.
6. `verweildauer` liest die Mietlücke der Vorperiode. Nicht `marktfriktion` umdeuten.

Vorladung, innen in der Anfangsmiete: `max(0, Teuerung − Spielraum) × Verweildauer der Vorperiode × (1 − Durchsetzung)`. `FRONTLOAD` ist 0.4 und nicht kalibriert. Zielgrösse, nicht eingesetzt: der Genfer Abstand aus dem bestehenden Kommentar in `phase-weights.ts` (lange Verweildauer, deutlicher Neuaufschlag).

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

**Was Argentinien war.** Ab Juli 2020: Mindestlaufzeit drei Jahre, Erhöhung nur einmal im Jahr, Anpassung über den ICL, einen Durchschnitt aus Inflation und Löhnen. Anfangsmietzins frei. Am 21. Dezember 2023 hob das Dekret die Regeln auf: Indexpflicht weg, jährliche Erhöhungsschranke weg, Verträge wieder in Fremdwährung, Mindestlaufzeit zwei Jahre.[16] Das ist Vertragsliberalisierung unter Hyperinflation, nicht der Schweizer Systemwechsel.

**Was gemessen wurde.** Elfert und Thomsen, IZA DP 18107, September 2025, Regression Discontinuity an wöchentlichen Inseraten für Buenos Aires, Schnitt 21. Dezember 2023. Am Cutoff ein sofortiger Angebotsanstieg von rund 46 Prozent, etwa 2 670 Einheiten. Die Punktschätzer: nominale Preise bis zu 2,6 Prozent tiefer, reale Preise 13 bis 29 Prozent tiefer.[16] Im Fenster 2019–2024 liegt der Angebotseffekt je nach Spezifikation bei etwa 42 bis 88 Prozent. Zur Einführung 2020, deskriptiv, nicht kausal: das Angebot fiel bis 2023 auf etwa 60 Prozent des Ausgangsniveaus. Inflation 2023: 211 Prozent.[16] Die Autoren lesen das als freigesetztes, vorher zurückgehaltenes Angebot, das die Überschussnachfrage kurzfristig aufnimmt. Sie messen keine Vergleichsbasis und keine Rückkopplung.

Das ist ein Niveau- und Angebotssprung nach Liberalisierung. Es ist keine Spirale. Wer den Gegenvorschlag damit kalibrieren will, kalibriert das Falsche: einen Schock in einem Markt mit dreistelliger Inflation, nicht das Hochziehen einer statistischen Referenz.

**Presse: Angebot, keine Spirale.** Infobae, 24. Januar 2024, zitiert Monitor Inmobiliario und Zonaprop. Das Angebot in der Stadt Buenos Aires lag im Januar 2024 um 60 Prozent über Januar 2023: damals 5 155 Wohnungen, 256 Häuser und 128 PH, zusammen 5 539 Einheiten. Auf einigen Portalen etwa 9 000 Wohnungen.[17] Journalistischer Bericht, keine Studie, keine Vergleichsbasis.

La Nación, 11. Januar 2024, zitiert Soledad Balayan von Maure, keine Studie. In den ersten zehn Januartagen 2024 gegen denselben Zeitraum 2023: Zonaprop plus 20 Prozent, Argenprop plus 47 Prozent. In einer Woche die Inserate auf Zonaprop von 5 700 auf 6 500.[20] Die Preiszahl im selben Text ist nicht der Pfad nach dem Dekret. Sie beschreibt das letzte Monat 2023, also noch unter der alten Regel: plus 18,6 Prozent im Monat. Über das Jahr 2023 plus 260 Prozent, über der Inflation von 190,9 Prozent und über dem ICL von 135,5 Prozent.[20] Angebotsmieten liefen dem gesetzlichen Index davon. Das ist Vorladung, nicht eine Vergleichsbasis, die sich selbst hochzieht.

Infobae, Meinung, 5. Oktober 2024, Hauserman und Grandes. Keine Studie, keine Tabelle. Der Untertitel sagt, die Aufhebung habe das Angebot verdreifacht und eine reale Senkung von 30 Prozent ermöglicht. Im Text steht daneben, das Angebot sei unter der Ley praktisch auf die Hälfte gefallen und in neun Monaten danach verdoppelt. Dieselbe Seite: der alte Index hätte im August 244 Prozent verlangt, die durchschnittliche Erhöhung sei 144 Prozent gewesen, die Inflation 235 Prozent, daraus eine reale Senkung von 30 Prozent.[21] Drei Angebotssätze in einem Text, die 30 Prozent ohne ausgewiesene Formel. Nicht als Messung verwenden. Der Text beschreibt die Ley als Verlängerung der Mindestfrist von 24 auf 36 Monate.[21] Das berührt die offene Dauerfrage, es ersetzt den Gesetzestext nicht.

Ein Fachkommentar der Kammer der Eigentümer vom 22. Juli 2024 schreibt, die Ley Bases festige die mietrechtlichen Bestimmungen des Dekrets vom Dezember 2023.[19] Das ist kein Amtsblatt. Dieselbe Seite nennt Angebotszahlen, die den 5 539 Einheiten von Infobae widersprechen. Sie werden hier nicht verwendet. Zur Mindestlaufzeit bleibt der IZA-Satz massgebend: von drei auf zwei Jahre.[16] Der Kommentar liest das Dekret als Abschaffung der Mindestfrist. Den Gesetzestext habe ich nicht gelesen. Die Dauer ist damit nicht bereinigt.

Reuters-Körper nicht gelesen. Die Live-Seite antwortet mit 401, das Wayback-Verzeichnis mit 429, die Archivkopie vom 23. März 2026 auf archive.ph hinter einem Captcha. Der Suchindex zeigt einen Satz über einen einzelnen Haushalt, dessen Mietanteil von etwa 30 auf die Hälfte des Einkommens gestiegen sei. Das ist ein Snippet, kein gelesener Artikel, und keine Marktstatistik. BBC ohne Mietzahl. Economist: die indexierten Texte von Ende 2024 sind Bezahlschranken ohne lesbare Mietzahl.

Der Tages-Anzeiger vom 10. Januar 2025, Quentin Schlapbach, ist auch als Archivkopie vom 17. Januar 2025 eine Bezahlschranke. Lesbar ist nur der Vorspann: eine Studie untersuche das Mietzinsmodell des Bundesamts für Wohnungswesen, das Modell aus den 1980er-Jahren sei bis heute massgebend, mehrere Annahmen seien überholt, den jüngsten Erhöhungen fehlten die faktischen Grundlagen.[22] Die Zahl «30 Prozent», die in Suchsnippets kursiert, steht in diesem Vorspann nicht. Der Körper bleibt ungelesen. Die Zahlen zur selben IAZI-Studie stehen in der NZZ-Archivkopie.[18]

**Mietspiegel: Abwärtslücke, keine Aufwärtsspirale.** Zwei Papiere, beide 2015, beide gelesen. Keines schaltet von Kosten plus Rendite auf eine statistische Vergleichsmiete um.

Wölfle, CRES Discussion Paper No. 6, Simulation für Hamburg, Auftrag des Forschungsverbandes für Immobilien-, Hypotheken- und Baurecht. Die Richtung ist eine doppelte Bremse nach unten, nicht ein Hochziehen. «Der Mietspiegel soll üblicherweise aus den Mieten der vier vergangenen Jahre gebildet werden. Werden jedoch gerade die Mietabschlüsse gebremst, so geht diese Bremswirkung auch auf den Mietspiegel über.» Nach 20 Jahren ein Unterschied von 0,76 Euro pro Quadratmeter gegen die übliche Mietentwicklung.[23] Das ist eine Modellrechnung, keine Messung, und das Gegenteil der These, die Vergleichsbasis laufe mit den bezahlten Mieten nach oben.

Lerbs und Sebastian, IREBS Heft 10, zitieren das Bundesinstitut für Bau-, Stadt- und Raumforschung, messen die Lücke nicht selbst. «Die ortsübliche Vergleichsmiete liegt in der Mehrheit der Fälle deutlich (bis zu 42 Prozent) unter der Angebotsmiete … Abweichungen nach oben kommen hingegen nicht vor.»[24] Das BBSR-Papier dahinter (Held u. a.) habe ich nicht gefunden. Die 42 Prozent bleiben eine zitierte Abwärtslücke, keine gemessene Spirale. Lerbs und Sebastian lesen den geltenden Mietspiegel als politisch nach unten verzerrt. Eine Vergleichsbasis, die sich selbst hochzieht, beschreiben sie nicht.

**Die IAZI-Studie ist nicht der fehlende Test.** NZZ, Albert Steck, 18. Januar 2025, gelesen als Archivkopie vom 11. Februar 2025. IAZI im Auftrag des Bundesamts für Wohnungswesen, Tausende Objekte, Marktwert 90 Milliarden Franken. Profi-Investoren: 24 Prozent Fremdkapital, 76 Prozent Eigenkapital. Das geltende Modell rechnet mit 60 und 40. Steigt der Referenzzins um 25 Basispunkte, erlaubt das Modell 3 Prozent; beim gemessenen Fremdkapitalanteil von 24 Prozent wären es 1,2 Prozent. Die Teuerung fliesst heute zu 40 Prozent ein, entsprechend dem angenommenen Eigenkapital. Die IAZI-Simulation über zehn Jahre: mit der revidierten Rechnung, höherer Eigenkapitalanteil, wären die Mieten stärker gestiegen als unter dem geltenden Modell. Scognamiglio: bei sinkenden oder stabilen Zinsen fallen die Mieten tendenziell zu tief.[18] Die UBS-Prognose von 20 Prozent bis 2025 trat nicht ein. Der Satz stieg nur auf 1,75 Prozent, die Mieten um 8 Prozent.[18] Das ist das Referenzzinsmodell, Kosten plus angenommene Kapitalstruktur. Keine statistische Vergleichsmiete, keine Spirale. Es erklärt, warum «stärker an die Teuerung» in der Schweizer Debatte schon vor dem Gegenvorschlag lag. Es misst nicht, ob eine Vergleichsbasis mit den bezahlten Mieten nach oben läuft.

## Was dieser Stand nicht ist

Kein Schiedsrichter zwischen Mieterverband und Bundesrat. Die Spirale kann erst sichtbar werden, wenn das Tor offen ist und die Mieten über der Basis liegen. Mit der Teuerung 2025 und ohne gesetzte Mietlücke tut sie das nicht. Wer ein Szenario «Mieten explodieren» sehen will, muss die Lücke belegen oder die Teuerung als Szenario setzen — und das als Annahme kennzeichnen.

## Sources

[1] https://www.admin.ch/de/newnsb/EbAjw2abDf3e — Bundesrat Medienmitteilung 25.09.2026
[2] https://www.sp-ps.ch/kampagne/mietpreis-initiative — SP Mietpreis-Initiative Initiativtext
[4] https://www.tagesanzeiger.ch/mietpreisinitiative-bundesrats-gegenvorschlag-ist-ein-skandal-109555734937 — Tagesanzeiger Gegenvorschlag Skandal
[7] https://cms.news.admin.ch/fileservice/sdweb-docs-prod-nsbcch-files/files/2026/09/25/43bdc0bb-55ce-43bc-8dcd-e0ac8ee3d690.pdf — BWO-Bericht Mietzinsmodell 25.09.2026
[8] https://www.20min.ch/story/initianten-toben-zoff-um-mietpreise-bundesrat-spielt-brandstifter-103638675 — 20 Minuten Mieterverband zum Gegenvorschlag
[11] https://www.bger.ch/ext/eurospider/live/de/php/aza/http/index.php?highlight_docid=atf%3A%2F%2F144-III-514%3Ade&lang=de&type=show_document&zoom=YES — BGE 144 III 514
[12] https://www.bfs.admin.ch/bfs/de/home/statistiken/preise/landesindex-konsumentenpreise.html — BFS Landesindex der Konsumentenpreise
[13] https://www.bfs.admin.ch/bfs/de/home/statistiken/bau-wohnungswesen/wohnungen.html — BFS Gebäude- und Wohnungsstatistik Wohnungen
[14] https://www.bwo.admin.ch/bwo/de/home/mietrecht/referenzzinssatz.html — BWO hypothekarischer Referenzzinssatz
[15] https://www.stadt-zuerich.ch/artikel/de/statistik-und-daten/mietpreise-2024-in-der-stadt-zuerich.html — Mietpreiserhebung Stadt Zürich 2024
[16] https://docs.iza.org/dp18107.pdf — Elfert/Thomsen, IZA DP 18107, September 2025
[17] https://www.infobae.com/economia/2024/01/24/alquileres-en-caba-luego-del-dnu-de-milei-la-oferta-salto-un-60-y-volvieron-a-publicarse-casas-despues-de-ocho-meses/ — Infobae, 24.1.2024, Angebot CABA
[18] https://web.archive.org/web/20250211004110/https://www.nzz.ch/wirtschaft/mieter-sind-profiteure-des-heutigen-mietzinsmodells-jetzt-will-der-bund-die-berechnungsformel-anpassen-ld.1866568 — NZZ, Albert Steck, 18.1.2025, Archiv 11.2.2025
[19] https://www.reporteinmobiliario.com/article5496-alquileres:-ley-bases-consolido-dnu — Reporte Inmobiliario, 22.7.2024, Fachkommentar Ley Bases
[20] https://www.lanacion.com.ar/propiedades/inversiones/alquileres-aumento-record-de-la-oferta-en-apenas-diez-dias-los-precios-y-claves-para-cerrar-un-buen-nid11012024/ — La Nación, Carla Quiroga, 11.1.2024
[21] https://www.infobae.com/opinion/2024/10/05/el-mercado-de-alquiler-tras-su-liberacion/ — Infobae Meinung, Hauserman/Grandes, 5.10.2024
[22] https://web.archive.org/web/20250117170353/https://www.tagesanzeiger.ch/mieten-schweiz-mietzinserhoehung-wegen-veralteten-modells-862157887436 — Tages-Anzeiger, Schlapbach, 10.1.2025, Archiv 17.1.2025, nur Vorspann
[23] https://www.steinbeis-cres.de/assets/Forschung/Studie_Mietpreisbremse_20151031.pdf — Wölfle, CRES Discussion Paper No. 6, 2015
[24] https://epub.uni-regensburg.de/32398/3/IREBS_Heft_10.pdf — Lerbs/Sebastian, IREBS Heft 10, 2015
