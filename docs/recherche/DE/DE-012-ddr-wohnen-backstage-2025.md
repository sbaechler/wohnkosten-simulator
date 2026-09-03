---
id: "DE-012"
title: "Wohnen in der DDR. Folge 8 von „Backstage DDR“"
authors: ["Bundesstiftung zur Aufarbeitung der SED-Diktatur"]
year: 2025
institution: "Bundesstiftung Aufarbeitung"
type: "gray-literature"
language: "de"
url: "https://www.bundesstiftung-aufarbeitung.de/de/recherche/mediathek/wohnen-der-ddr-folge-8-von-backstage-ddr"
doi: null
status: "evaluated"
dag_nodes: ["mietrecht_anfangsmiete", "gemeinnuetzig_kraft", "angebotspotenzial", "nachfragedruck"]
dag_edges_confirmed:
  - { from: "mietrecht_anfangsmiete", to: "angebotspotenzial", sign: -1, note: "Politisch gedeckelte Mieten (max. 1,25 Mark/m²) deckten Bau- und Instandhaltung nicht; Bestandzerfall, Reparaturstau" }
dag_edges_challenged:
  - { from: "gemeinnuetzig_kraft", to: "mietpreis_marktniveau", sign: -1, note: "Massenhaft staatlicher Wohnungsbau (2 Mio. Wohnungen bis 1984) löste die Knappheit nicht, weil Zuteilung, Instandhaltungsdefizit und fehlendes Privateigentum parallel liefen — kein Transfer auf CH-Gemeinnützigkeit" }
relevance: "medium"
duplicate_of: null
regions: ["DE"]
period_covered: "1945–1989"
---

## Zusammenfassung

Lehrfilm (~8 Min.) der Bundesstiftung Aufarbeitung zur Wohnungsversorgung in der DDR. Keine empirische Studie, aber eine kompakte historische Fallskizze des Extremfalls: staatliche Zuteilung, sub-Kostendeckungsmieten, industrieller Massenwohnungsbau (Plattenbau) und gleichzeitiger Verfall der Altstädte.

Nachkriegstrümmer, Baracken und Vertriebene erzeugen dauerhafte Wohnungsnot. Prestigebau (Stalinallee ab 1952) scheitert als Mengenlösung. Nach Chruschtschows Losung «schneller, besser, billiger bauen» folgt ab den 1960er/70er Jahren serieller Plattenbau (Halle-Neustadt, Eisenhüttenstadt, Hoyerswerda): Komfortsprung (Fernheizung, fliessendes Wasser), aber standardisierte Grundrisse ohne Wahlfreiheit. 1984 feiert die SED die zwei-millionste Wohnung — Knappheit, Warteschlangen und Beziehungsökonomie bleiben. In den 1980ern entstehen inoffizielle Kaltbesetzungen verfallener Altbauten.

## Key Findings

- **Zuteilung statt Markt.** Wohnraum wird staatlich zugewiesen; Wartezeiten von Jahren. Eine Familie mit zwei Kindern erhält typischerweise eine 3-Zimmer-Wohnung mit 60–65 m². Wahlfreiheit bei Grösse gibt es nicht.
- **Miete weit unter Kosten.** Maximale Miete 1,25 Mark/m². Einnahmen decken Bau und Instandhaltung nicht; Material fehlt, Reparaturen dauern oft Monate.
- **Massenangebot ohne Knappheitsauflösung.** Industrieller Wohnungsbau ab den 1960ern (erster Grossplatten-Experimentalbau Berlin-Johannisthal 1953). 1984: zwei-millionste Wohnung. Trotzdem bleibt Wohnraum Mangelware.
- **Altstadt vs. Randstadt.** Grosse Neubaugebiete am Stadtrand, historische Kerne verfallen bewusst; Umdenken erst späte 1970er/frühe 1980er (kleinteiliger «Ersatzneubau»).
- **Nebenwirkungen der Lenkung.** Hausbuchführer; kaum Privateigentum und knappes Baumaterial; inoffizielle Kaltbesetzungen als Ventil, weil die Verwaltung nicht funktioniert.
- **Kein Transfer auf CH-Mietrecht 1:1.** Extremfall (fast 100 % staatliche Versorgung, Mieten weit unter Kostenmiete). Nützlich als obere Schranke für Kostenmiete/gemeinnützigen Sektor, nicht als Kalibrierpunkt.

## Relevanz für DAG

Bestätigt qualitativ die Kante **Mietdeckel weit unter Kosten → Bestandszerfall**. Das ist *nicht* CH-Kostenmiete (`mietrecht_kostenmiete` soll Kosten decken), sondern ein hartes Preiscap analog zu `mietrecht_anfangsmiete`. Der DDR-Fall zeigt ausserdem, dass reines Mengenprogramm (Plattenbau) Knappheit nicht löst, wenn Zuteilung, Instandhaltungsdefizit und fehlendes Privateigentum parallel laufen. Für `gemeinnuetzig_kraft`: Skalierung allein reicht nicht, wenn Mieten den Bestand nicht tragen.

Evidenzstufe: ★ (Lehrfilm, Zeitzeugen, keine Kausalstudie). Keine Gewichtsanpassung ableiten.

## Zitate

> «Wegen der günstigen Mieten — diese betragen maximal 1 Mark 25 pro Quadratmeter — fehlt es an Mitteln um den Wohnungsbestand zu erhalten. Die Kosten für den Wohnungsbau und die Instandhaltung sind viel höher als die Einnahmen.» (Transcript ~4:38)

> «1984 feiert die DDR-Führung die Übergabe der zwei-millionsten Wohnung. […] Trotz des massiven Wohnungsbauprogramms bleibt die Wohnungsknappheit ein Problem. Wer eine Wohnung will, braucht gute Beziehungen oder viel Geduld.» (Transcript ~4:05 / ~5:41)

## Notizen

- Mediathek-Text vom 28.02.2025; YouTube-Spiegel: https://www.youtube.com/watch?v=s4QStU8o1Ro
- Transcript via YouTube-Untertitel (auto, de); ASR-Fehler (Stalinallee, Hoyerswerda, Chruschtschow) stillschweigend korrigiert
- Live-Mediathek war nicht extrahierbar; Seitenbeschreibung aus Wayback 2025-07-04
- Kein DAG-Gewicht ändern — historische Illustration, keine Schätzung
