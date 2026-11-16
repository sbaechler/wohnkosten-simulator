---
id: "CH-015"
title: "Wohnschutzverordnung Basel-Stadt: Wohnschutzinitiative lässt Zahl der Baugesuche für Mietwohnungen einbrechen (Auswirkungen der Wohnschutzinitiative im Kanton Basel-Stadt)"
authors: ["Swiss Real Estate Institute (Ilg, Peter, Fachkontakt)", "SVIT Schweiz", "HEV Schweiz"]
year: 2025
institution: "Swiss Real Estate Institute (SRES, HWZ) im Auftrag von SVIT Schweiz und HEV Schweiz"
type: "working-paper"
language: "de"
url: "https://www.svit.ch/sites/default/files/2025-01/svit_basel_de_2501.pdf"
doi: null
status: "evaluated"
dag_nodes: ["nutzung_abbruchverbot", "nutzung_umnutzungsverbot", "mietrecht_kostenmiete", "angebotspotenzial", "investitionsattraktivitaet"]
dag_edges_confirmed:
  - { from: "nutzung_abbruchverbot", to: "angebotspotenzial", sign: -1, note: "Nur Richtung, nur Interessenvertreter: Baugesuche (Wohneinheiten) Basel-Stadt −76 % (2021–2023 gegen 2014–2020). Kausalität nicht belegt; Grösse nicht ableitbar." }
  - { from: "mietrecht_kostenmiete", to: "investitionsattraktivitaet", sign: -1, note: "Nur Richtung, nur Interessenvertreter: Mietzinsobergrenzen bei Ersatzneubau/Sanierung, danach weniger Baugesuche und Sanierungen." }
dag_edges_challenged: []
relevance: "medium"
duplicate_of: null
regions: ["CH"]
period_covered: "2014–2023"
---

## Zusammenfassung

Die Notiz stützt sich auf den Volltext (5 Seiten, Januar 2025, Beitrag in «Schweiz Immobilia»). Der Text war lesbar. `pdftotext` war nicht installiert. Der Text wurde mit PDFKit extrahiert. Die Abbildungen wurden nicht als Bild geprüft, nur ihre Textebene.

Die Studie vergleicht die eingereichten Baugesuche für Wohnungen in Basel-Stadt vor und nach Inkrafttreten der Wohnschutzverordnung (28. Mai 2022). Referenz sind Zürich, Luzern, Bern, Winterthur und Basel-Landschaft. Sie kommt zum Schluss, die Flaute sei «weitgehend hausgemacht» (S. 1). Die Zahlen sind amtliche Statistiken (Infopro Digital). Die Deutung ist die der Auftraggeber. Eine ökonometrische Schätzung gibt es nicht.

## Key Findings

Alle Zahlen: Wohneinheiten der eingereichten Baugesuche, Wohnungsbau ab 3 Wohnungen pro Gebäude, inkl. Anbauten, Aufstockungen, Umbauten, Neubauten, Ersatzneubauten (Abb. 1, S. 2). Gemessen werden Wohneinheiten pro Jahr, nicht die Zahl der Gesuche.

- Basel-Stadt: Jahresmittel 784 Wohneinheiten (2014–2020) gegen 190 (2021–2023), −76 % (Abb. 1, S. 2; Text S. 3).
- Zürich (Stadt): 3035 gegen 3643, +20 % (Abb. 1, S. 2; Text S. 3).
- Luzern 433 gegen 425, −2 %. Bern 628 gegen 405, −35 %. Winterthur 332 gegen 215, −35 % (Abb. 1, S. 2; Werte aus der Textebene der Grafik zugeordnet, Rundung möglich). Text S. 3: übrige Städte «−2 bis −35 %».
- Basel-Landschaft: 1367 gegen 822, −40 % (Abb. 3, S. 4).
- Höchststand Basel-Stadt 2018: 1074 Wohneinheiten. 2023: 67 Wohneinheiten, −95 % (S. 2–3).
- Gleitendes 4-Jahres-Mittel (Index 2014 = 100): in Basel innert dreier Jahre halbiert (Abb. 2, S. 3).
- Vorzieheffekt: 2021 und Anfang 2022 «Schlusspanik», weil altrechtliche Gesuche nicht unter die Verordnung fallen (S. 3).
- Fertiggestellte Wohnungen 2023: 865 (Nettoproduktion), über 60 % aus zwei Grossprojekten (S. 4). Der Rückgang zeigt sich noch nicht in den Fertigstellungen.
- Regeln der Verordnung laut Studie (S. 1): maximale Nettomietzinse bei Abbruch und Ersatzneubau. Maximale Mietzinsaufschläge bei Sanierung, Renovation, Umbau. Begründung von Stockwerkeigentum bewilligungspflichtig. Ausgenommen: Liegenschaften mit höchstens 3 Wohnungen, Genossenschaften, reine Luxus- oder Kurzzeitmiet-Liegenschaften. Kontrolle durch die Wohnschutzkommission, fünf Jahre.
- Eigene Einordnung der Studie (S. 3): Der landesweite Trend (Baupreise, Zinsen, Einsprachen) erkläre «im besten Fall die Hälfte» des Rückgangs in Basel-Stadt. Eine Rechnung dazu steht nicht in der Studie.

## Relevanz für DAG

- `nutzung_abbruchverbot` → `angebotspotenzial` (−): Richtung passt zur Studie. Die Studie schätzt aber keinen Effekt des Abbruchverbots allein. Sie misst den Gesamteffekt der Verordnung (Abbruch, Ersatzneubau, Sanierung, Mietzinsobergrenzen zusammen). Eine Gewichtsgrösse lässt sich daraus nicht ableiten.
- `mietrecht_kostenmiete` → `investitionsattraktivitaet` (−): Die Studie argumentiert mit staatlich festgelegten Mietzinsen unter Marktniveau. Auch hier nur Richtung.
- `nutzung_umnutzungsverbot`: Die Studie behandelt Umnutzung nicht. Die Verordnung erfasst laut Studie nur bestehende Gebäude (Abbruch, Ersatz, Sanierung). Umnutzung von Industriebrachen ist ausdrücklich nicht betroffen (S. 1).
- Gegenbefund zum Vorzeichen für Neubau auf der grünen Wiese: Die Studie sagt, dieser sei von der Verordnung nicht betroffen (S. 1).
- Schätzung der Grösse: nicht möglich. Zeitliche Überlagerung mit Zinsanstieg und Baukosten. Die Studie nennt selbst keinen Effekt, den sie isolieren könnte.
- Vorsicht bei der Quellenqualität: siehe Notizen. Im Modell höchstens als Plausibilitätsbeleg für die Richtung, nicht als Kalibrierung.

## Zitate

> «Die Flaute ist weitgehend hausgemacht.» (S. 1)

> «Basel sticht mit einem solchen um 76% besonders negativ heraus.» (S. 2)

## Notizen

**Interessenbindung des Auftraggebers.** SVIT Schweiz (Verband der Immobilienwirtschaft) und HEV Schweiz (Hauseigentümerverband) haben die Studie in Auftrag gegeben. Beide haben sich gegen die Wohnschutzinitiative und die Verordnung positioniert. Das SRES (HWZ) hat den Datenteil geliefert. Die Publikation ist ein Medien- und Verbandstext (Schweiz Immobilia), keine peer-reviewte Studie. Sie nennt politische Wertungen («Überregulierung», «investorenfeindlich», «vermeintlicher Mieterschutz», «Bumerang», S. 3–5). Eine Methodik zu Modell, Kontrollvariablen oder Signifikanz steht nicht darin.

**Methodische Lücken.**
- Wohneinheiten statt Zahl der Gesuche. Die Studie schreibt selbst, die Erneuerungen seien wohl stärker zurückgegangen als die Gesuche für Wohnungen (S. 2). Nicht jede Massnahme in einem Gesuch ist bewilligungspflichtig (S. 2).
- Zwei Perioden verschiedener Länge (7 und 3 Jahre). Der Zeitraum 2021–2023 enthält Zinswende, Baukostensteigerung und den Vorzieheffekt vor Mai 2022.
- Basel-Stadt hat praktisch keine Baulandreserven (S. 1). Kleine Grundgesamtheit, einzelne Projekte schlagen durch (S. 4).
- Abb. 1 und Abb. 3 geben für Basel-Stadt in der Textebene nicht denselben Endwert an: 190 in Abb. 1, 215 in Abb. 3. 215 ist in Abb. 1 der Wert von Winterthur. −76 % passt rechnerisch zu 190 (190/784 = 24 %). Wahrscheinlich ein Fehler oder eine Zuordnungsfrage in Abb. 3. Am Bild nicht geprüft.
- Die Aussage, der Trend erkläre «im besten Fall die Hälfte», ist nicht hergeleitet (S. 3).
- Zürich: Die Studie sagt, nur die Stadt Zürich habe der Baukonjunktur widerstanden. Die Studie nennt keine Gründe. Ein Hinweis auf Vorzieheffekte vor neuen Regeln stammt aus einer späteren SVIT-Aktualisierung (Mai 2026, nicht gelesen) und steht nicht in dieser Quelle.

**Haltung der Basler Regierung (aus eigener Recherche, nicht aus der SRES-Studie).**
- Das SRES zitiert (S. 2) die Medienmitteilung des Präsidialdepartements vom 15. August 2024. Die Mitteilung selbst habe ich nicht gefunden. Der Wortlaut (nur über die Studie): generelle Abnahme der Sanierungstätigkeit. Energetische Sanierungen erfolgten meist im Rahmen von Totalsanierungen. Zielkonflikt zwischen Wohnraumschutz und Klimaschutz (Netto-Null 2037).
- Medienmitteilung des Regierungsrats vom 23. Juni 2025 (Revision der Wohnraumschutzverordnung, bs.ch): Die Zahl der Gesuche für Sanierungen habe deutlich abgenommen. Rückgang nur bei Gebäuden unter der Verordnung. Vor Inkrafttreten gab es eine starke Zunahme der Baueingaben. Der Text enthält keine Aussage zu Neubauten.
- Medienmitteilung des Präsidialdepartements vom 26. März 2025, «Der Wohnungsbau im Kanton Basel-Stadt 2024» (bs.ch): «Wie gross der Einfluss … auf den Rückgang der Bautätigkeit ist, ist offen.» Die Bestimmungen gälten nur für bestehenden Wohnraum, nicht für den Bau neuer Wohnungen. Pauschale Analysen von Baubewilligungen seien «wenig aussagekräftig». Das Statistische Amt zählt 2024: 151 neuerstellte Wohnungen. Gemeint ist die Bautätigkeit, nicht explizit die Baugesuche.
- Interpellation «Wohnschutz in der Sackgasse», Antwort des Regierungsrats vom 7. März 2023: «Aktuell können noch keine Schlüsse gezogen werden». Das Monitoring wurde aufgegleist. Nur über eine Suchzusammenfassung gesehen, Volltext nicht gelesen.
- Die Regierung hat die Verordnung wegen der Sanierungsflaute revidiert (2025). Zur Bau- und Neubauflaute hält sie die Ursache offen.

## Abgleich mit dem Code

Geprüft gegen die Aussagen in `src/model/phase-weights.ts` (Kante `nutzung_abbruchverbot` → `angebotspotenzial`) und den Tests `wohnschutz-fachlich.test.ts`, `gemeinnuetzig-fachlich.test.ts`.

1. **Baugesuche −76 %, Mittel 784 (2014–2020) gegen 190 (2021–2023): bestätigt, mit Präzisierung.** Abb. 1, S. 2, und Text S. 3. Gemessen sind Wohneinheiten der eingereichten Baugesuche im Jahresmittel, Wohnungsbau ab 3 Wohnungen. Nicht «Zahl der Baugesuche». Abb. 3 (S. 4) zeigt für Basel-Stadt 215 statt 190. Der Wert passt nicht zu −76 %.
2. **Ursache laut Regierungsrat offen: nicht in der SRES-Quelle, abweichend dort.** Die Studie sagt das Gegenteil: Sie führt den Rückgang auf die Verordnung zurück («hausgemacht», S. 1, 4) und zitiert die Regierung nur mit «erhebliche Nebenwirkungen» bei Sanierungen (S. 2). Die Aussage «offen» stammt aus der Medienmitteilung des Präsidialdepartements vom 26. März 2025 (bs.ch) und bezieht sich auf die Bautätigkeit (Neubauwohnungen), nicht auf die SRES-Baugesuche. Sie ist dem Präsidialdepartement bzw. dem Statistischen Amt zuzuschreiben, nicht dem Regierungsrat als Gremium. Als Beleg für «offen» ist die bs.ch-Mitteilung zu zitieren, nicht die SRES-Studie.
3. **Wohnschutzverordnung: Abriss, Ersatzneubau, Sanierungen bewilligungspflichtig mit Mietzinsobergrenzen: teilweise bestätigt.** S. 1: Maximale Nettomietzinse bei Abbruch und Ersatzneubau, maximale Mietzinsaufschläge bei Sanierung, Renovation, Umbau. Kontrolle durch die Wohnschutzkommission. Abweichung: Bewilligungspflichtig ist die Mietzinsfestlegung bzw. -anpassung, nicht jeder Abriss oder jede Sanierung als solche. Ausnahmen: höchstens 3 Wohnungen, Genossenschaften, Luxus- und Kurzzeitmiete. Zudem Stockwerkeigentum. Neubau auf der grünen Wiese und Umnutzung von Industriebrachen sind nicht betroffen.
4. **Sanierungsrückstand Basel 48 % (Genf 83 %, Zürich 41 %): steht nicht in der Quelle.** Keine dieser drei Zahlen kommt in der Studie vor. Der Begriff «Sanierungsrückstand» ebenfalls nicht. Der zweite Teil stimmt im Kern, aber nicht mit dem Datum 2023: Die Aussage «Energetische Sanierungen erfolgen meist im Rahmen von Totalsanierungen» steht auf S. 2 als Zitat der Medienmitteilung des Präsidialdepartements vom 15. August 2024, nicht der Regierung 2023. «Wohnschutz bremst sie»: Die Mitteilung nennt einen Rückgang bei Totalsanierungen und einen Zielkonflikt Wohnraum-/Klimaschutz (Netto-Null 2037). Das Wort «bremst» steht nicht dort.
5. **Zürich im selben Zeitraum +20 % Baugesuche: bestätigt, mit Präzisierung.** S. 3 und Abb. 1, S. 2: Stadt Zürich, 2021–2023 im Mittel «20 % mehr Wohneinheiten pro Jahr» gegen 2014–2020. Es sind Wohneinheiten der Baugesuche, nicht die Zahl der Gesuche. Die Streichung im Code war nicht nötig, wenn Zürich als Stadt mit Wohneinheiten genannt wird.
