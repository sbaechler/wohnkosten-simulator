# Verbesserungsplan nach fachlichem Review (2026-11-13)

> **Status:** Entscheide 1, 2, 3 und 5 gefällt (2026-11-13, siehe Abschnitt 9); alle Entscheide gefällt. Sprint 0, Sprint 1 und Fix-8 (Widgets) sind umgesetzt auf `feat/mietrecht-regime-2026` (Sprint 0 und Fix-8 in Commit `238b6cd`, Sprint 1 noch uncommittet), alles andere offen.
> **Grundlage:** Fachliches Review vom 2026-11-13: Code in `src/model`, gerenderte Widgets, `docs/recherche/summary.md`, CH-012, Nachrechnung aller 43 Parameter für Zürich (je ±1 Stufe, Wirkung in P3).
> **Teststand:** 225 passed, 1 skipped. Kalibrierungs-Dry-Run 0/446 Verletzungen. `tsc -b` meldet 10 Typfehler, alle in Testdateien (Fixtures ohne die neuen Regime-Felder von `MarketState`, dazu `international-fachlich.test.ts:236`); damit läuft `npm run build` nicht durch. Die Fehler stammen aus den Regime-Änderungen des Branches, nicht aus den Fixes dieses Plans.

## 1. Ausgangslage

Die Engine rechnet technisch sauber. Fachlich gab es drei Klassen von Problemen:

| Klasse | Befund | Status |
|---|---|---|
| Vorzeichen | `raumplanung_zonenreserve → nachfragedruck` und `bau_bewilligungsverfahren → angebotspotenzial_regulation` lasen die Parameterskala verkehrt herum | ✅ behoben |
| Regime | Referenzzins-Regime las das Zinsniveau statt der Zinsänderung | ✅ behoben |
| Struktur | Normalisierung pro Knoten verzerrt die Rangfolge der Hebel; der Phasenmultiplikator drückt alle frühen Effekte (Fix-10); mehrere Schieber und Evidenzpfade laufen ins Leere | offen |

### Die Verzerrung in Zahlen (Zürich, 1 Stufe, P3, vor Sprint 0)

| Hebel | Δ Neumieter-Trend | Δ Mietbelastung (pp) |
|---|---|---|
| Förderfonds | 0.186 | 1.09 |
| ÖV-Ausbau | 0.152 | 1.02 |
| Kostenmiete | 0.130 | 0.73 |
| Ausnützungsziffer | 0.115 | 0.58 |
| Verdichtung | 0.104 | 0.52 |
| Anfechtung Anfangsmiete | 0.028 | 1.75 |

`summary.md` nennt das Angebot als dominanten Hebel, und CH-003 findet für die Anfechtung der Anfangsmiete keinen messbaren Effekt. Das Modell sagt in beiden Fällen etwas anderes. Ursache: jeder Knoten wird durch Σ|w| seiner Kanten geteilt. `angebotspotenzial` hat 20 Kanten (Nenner 12.4), `mietpreis_schutzlevel` drei (Nenner 3.0). Ein Mietrechts-Schritt bewegt seinen Knoten um rund 0.39, ein Angebots-Schritt um 0.03–0.07.

---

## 2. Sprint 0 — erledigt

| Fix | Inhalt | Dateien |
|---|---|---|
| 0.1 | Vorzeichen Zonenreserve → Nachfragedruck (−1 → +1) | `phase-weights.ts`, `bodenrecht-fachlich.test.ts`, `calibrate.ts` |
| 0.2 | Vorzeichen Bewilligungsverfahren → Angebotselastizität (+1 → −1) | `phase-weights.ts`, `bodenrecht-fachlich.test.ts` |
| 0.3 | Neues Kontextfeld `referenzzins_aenderung`; Regime liest die Änderung, nicht das Niveau | `types.ts`, `params.ts`, `mietrecht-regime.ts`, `switzerland.yaml`, CH-012 |

Lehre aus 0.1: der falsche Test und der falsche Kalibrierungs-Constraint hatten den Fehler festgeschrieben. Die Kalibrierung prüft nur, was die Constraints behaupten.

---

## 3. Sprint 1 — Korrektheit ohne Modellumbau — ✅ erledigt (2026-11-14)

Uncommittet. 225 Tests grün, Kalibrierungs-Dry-Run 0/446.

#### Fix-1: Skalenrichtung aller Kanten absichern — ✅
**Dateien:** `src/types.ts`, `src/model/params.ts`, `src/model/edge-doc.ts` (neu), `scripts/build-edge-docs.ts` (neu), `edge-doc.test.ts` (neu), `docs/architektur/01-graph-kanten.md`, `package.json`
1. `ParamMeta40.hoeherBedeutet`: Pflichtfeld, sagt für jeden der 43 Parameter in einem Halbsatz, was eine höhere Stufe heisst.
2. `docs/architektur/01-graph-kanten.md` wird aus dem Code generiert (`npm run build:docs`) und nennt je Kante die Skalenbedeutung und die Wirkung in Worten. Ein Test schlägt fehl, wenn die Datei nicht auf dem Stand des Codes ist.
3. Alle 100 Kanten gegen diese Tabelle gelesen. **Kein weiteres Vorzeichen steht gegen die Skala.** Drei Kanten sind fachlich strittig und gehören in den Recherche-Abgleich von Sprint 3, nicht in eine Vorzeichenkorrektur:
   - `nutzung_zweitwohnungen → angebotspotenzial` (−): die Quelle CH-006 (Lex Weber) betrifft Tourismusgemeinden. In Städten über 40'000 Einwohnern gibt eine strengere Grenze eher Erstwohnungen frei.
   - `mietrecht_untervermietung → verdraengungsrisiko` (−): Stufe 2 heisst «Tageslimit + Kündigungsrecht». Ein Kündigungsrecht des Vermieters ist für Mieter ein zusätzlicher Kündigungsgrund. Überschneidet sich ausserdem mit `nutzung_kurzzeitvermietung`.
   - `mietrecht_mietzinstransparenz → marktfriktion` (+): mehr Information senkt gewöhnlich Friktion. Der Kommentar stützt sich auf CH-003, das die Anfechtung der Anfangsmiete behandelt, nicht die Offenlegung.

Nicht gemacht: die Sensitivitätstabelle als fester Test (Abschnitt 8). Sie ist erst nach Fix-5 sinnvoll, weil heute vier Schieber erwartbar ohne Wirkung sind.

#### Fix-2: Regime-Restfehler — ✅
**Dateien:** `src/model/mietrecht-regime.ts`, `src/model/compute-phases.ts`, `mietrecht-regime.test.ts`, CH-012
1. Der Regime-Abzug auf Investition und Angebot wird pro Phase neu angesetzt. Übertragen wird der lineare Stand (`carryE1 = linear`). Vorher wuchs der Abzug über die Phasen auf das 2.44-Fache.
2. `CAP_ANGEBOT_ANTEIL = 0.5` als benannte Konstante mit JSDoc.
3. Eine negative Verweildauer lädt keine Teuerung mehr vor.
4. Gesperrte Teuerung wird in Teuerungs-Einheiten gerechnet: Referenzzins-Regime 60 % (40 % überwälzbar, neu `REFERENZ_TEUERUNG_PASS_THROUGH`), Landesindex 15 %, Kostenbindung 100 %. Für Landesindex und Kostenbindung ist das Ergebnis dasselbe wie vorher.

Offen: der Erhöhungsspielraum im Referenzzins-Regime enthält die 40 % Teuerung selbst nicht. Mit dem heutigen Teuerungs-Bin (0–0.5 % → −1) würde das einen Senkungsanspruch erzeugen, obwohl die Teuerung positiv ist. Erst die Bins klären (Sprint 4).

#### Fix-3: Städtedaten — ✅ Bevölkerungstrend korrigiert
**Datei:** `data/cities/switzerland.yaml`
Quelle: BFS STATPOP über STAT-TAB (`px-x-0102020000_201`, Bestand am 31. Dezember), abgerufen 2026-11-14.

| Stadt | 2019 | 2024 | % pro Jahr | alt | neu |
|---|---:|---:|---:|---:|---:|
| Zürich | 420'217 | 436'551 | +0.77 | +1 | +1 |
| Genf | 203'951 | 209'061 | +0.50 | −1 | +1 |
| Basel | 173'232 | 177'571 | +0.50 | −1 | +1 |
| Lausanne | 139'408 | 144'873 | +0.77 | −1 | +1 |
| Bern | 134'591 | 137'995 | +0.50 | −1 | +1 |
| Winterthur | 113'173 | 120'376 | +1.24 | −1 | +2 |
| Luzern | 82'257 | 86'234 | +0.95 | −1 | +1 |
| St. Gallen | 76'090 | 78'863 | +0.72 | −1 | +1 |
| Lugano | 62'615 | 63'629 | +0.32 | −1 | 0 |
| Biel | 55'602 | 56'896 | +0.46 | −1 | +1 |

Neun Städte standen auf «sinkend», keine schrumpft. Die Bins sind eine Setzung und stehen im Kopf der YAML: unter −0.5 % → −2, bis −0.1 % → −1, bis +0.4 % → 0, bis +1.0 % → +1, darüber +2. Biel (+0.46) und Lugano (+0.32) liegen nahe an einer Grenze.

Folge: die Baselines von neun Städten zeigen mehr Nachfragedruck. Zürich, Genf und Lausanne haben jetzt identische Kontextwerte und damit identische Baselines. Das liegt an der groben Skala (fünf Stufen, fünf wirksame Faktoren), nicht an einem Fehler.

Nachtrag `zuwanderungsdruck` (2026-11-14): Messvorschrift festgelegt und im Kopf der YAML dokumentiert (internationaler Wanderungssaldo inkl. Typwechsel, BFS, Durchschnitt 2019–2024, in % des Bestands pro Jahr; Bins als Setzung). Geändert: Basel +1 → +2 (1.60 %), Winterthur +2 → +1 (0.88 %), St. Gallen 0 → +1 (1.26 %), Lugano 0 → +1 (1.32 %). Grenzfälle: Winterthur, Biel, Basel. Ohne Typwechsel (Sondereffekt 2023) lägen fast alle Städte eine Stufe tiefer.

#### Fix-4: Doku und Beschriftung — ✅ teilweise
Erledigt: Parameterzahl 43 in AGENTS.md und `types.ts`; Kommentar `marketModulator` (±60 %, skaliert auch den Kontext); Kommentar `mietbelastungs_grenze` (wird nur angezeigt); Widget heisst «Mietbelastung einkommensschwacher Haushalte» und nennt den CH-Ausgangswert; `01-graph-kanten.md` generiert (Fix-1).

Zurückgestellt, bis Fix-9/10 die Rechnung ändern:
- `docs/architektur/README.md`: zwei widersprüchliche Übertragsformeln (richtig ist die erste, siehe Fix-10); `PHASE_BASE_MULTIPLIER`, `marketModulator`, `E1_NORMALIZATION` fehlen; Vorzeichenkonvention «positiv = angebotsreduzierend» widerspricht `types.ts`; Zahlen veraltet.
- `docs/architektur/02-widget-katalog.md`: beschreibt `SupplyDemandChart` als zwei Trendlinien und 8 Gruppen.

---

## 4. Sprint 2 — Was der Nutzer sieht, muss zur Rechnung passen

#### Fix-5: Wirkungslose Schieber
**Dateien:** `src/widgets/`, `src/model/groups.ts`
**Aufwand:** 3–4 h
`mietrecht_mietzinsindex`, `mietrecht_kriterium`, `mietrecht_durchsetzung` und `steuer_leerstandsabgabe` bewegen kein gerendertes Widget.
- **Entschieden — Regime:** eigenes kleines Widget «Mietrecht-Regime (provisorisch)» mit Bestandsmiete, Anfangsmiete und Verweildauer über die drei Phasen. Macht die drei Schieber sichtbar, ohne unkalibrierte Zustände in Gruppen-Trends und Mietbelastung zu mischen.
- **Entschieden — übrige Schieber ohne Wirkung:** im Panel auskommentieren, bis sie angebunden sind. Betrifft heute `steuer_leerstandsabgabe`; der Schieber kommt mit der Kante aus Fix-11 zurück. Der Parameter bleibt in Typen, YAML und URL-Schema, damit bestehende Links nicht brechen.
- Nach dem Sensitivitätstest aus Abschnitt 8 gilt die Regel dauerhaft: ein Schieber ohne sichtbare Wirkung ist ein Testfehler.

#### Fix-6: Treiber-Anzeige aus der Rechnung ableiten
**Datei:** `src/model/groups.ts`
**Aufwand:** 3–4 h
Die Liste `groupKeyParams` ist von Hand gepflegt und widerspricht der Rechnung (Anfangsmiete bei Neumietern «senkend», gerechnet erhöhend; `mietrecht_mietzinsindex` ohne Kante; `ctx:`-Einträge feuern nie).
1. Beitrag je geändertem Parameter per Leave-one-out bestimmen: Pipeline mit vollem Diff gegen Diff ohne diesen Parameter, Differenz im Gruppen-Trend.
2. Richtung und Gewicht daraus ableiten, Top 3 anzeigen.
3. `groupKeyParams` löschen. Test: Treiberrichtung stimmt für jede Gruppe mit dem Vorzeichen der Trendänderung überein.

#### Fix-7: DAG-Ansicht ehrlich machen
**Datei:** `src/widgets/DAGVisualization.tsx`
**Aufwand:** 1 h
`FEEDBACK_EDGES` zeichnet acht Rückkopplungen, die die Engine nicht rechnet. Entfernen oder sichtbar als «nicht modelliert» kennzeichnen.

#### Fix-8: Nicht eingebaute Widgets — ✅ erledigt (2026-11-13)
**Dateien:** `WidgetGrid.tsx`, `CompareColumns.tsx` (neu), `FiskalischeWirkungWidget`, `MarktfriktionsWidget`, `EigentumsquotenWidget`, `StandortwettbewerbWidget`, `GemeinnuetzigSektorWidget`
Alle fünf sind in `WidgetGrid` eingebunden, zeigen den langfristigen Stand (P3) und bei geänderten Parametern «Heute» neben «Simuliert». `docs/architektur/README.md` führte sie bereits als Teil des Grids. Beim Einbau korrigiert:
- **Eigentumsquote:** der Pfeil war verkehrt (negativer Trend hiess «steigend»). Die Umrechnung «36 % ± 8 Punkte, Eigentumsquote CH» ist ersetzt durch den Index; die Zahl war erfunden und für jede Stadt dieselbe.
- **Gemeinnütziger Sektor:** «x % prognostiziert» mit Referenzmarken Zürich 26 % / Wien 60 % entfernt. Der neutrale Index 0 ergab 40 % Marktanteil. Jetzt Index mit «wie heute / wird gestärkt / wird geschwächt».
- **Fiskalische Wirkung:** «ca. CHF x Mio./Jahr» entfernt (feste Skala ±100 Mio. für jede Stadt). Jetzt Index.

Offen: Vorzeichen `gemeinnuetzig_kraft: +1` in `fiskalische_wirkung` (Förderfonds und Baurecht unter Marktwert kosten die öffentliche Hand Geld). Nicht geändert, weil E2 mitkalibriert ist; gehört zu Fix-13. Die Erklärtexte im Fiskal-Widget nennen feste Steuerarten unabhängig davon, was den Index bewegt.

---

## 5. Sprint 3 — Modellstruktur (braucht Entscheide und Neukalibrierung)

Fix-9 bis Fix-12 gehören zusammen und enden in **einer** Neukalibrierung (Fix-13). Nicht einzeln ausliefern.

#### Fix-9: Normalisierung
**Dateien:** `src/model/compute-phases.ts`, `scripts/calibrate.ts`
**Aufwand:** 1 Tag
- **Entschieden:** ein gemeinsamer Nenner für alle Knoten. Ein Gewicht bedeutet dann überall dasselbe: Effektgrösse eines vollen Schritts auf der Skala −1…+1. Die Zahl der Kanten eines Knotens verdünnt nichts mehr.
- Verworfen: Nenner pro Knoten behalten und die Rangfolge nur über Constraints erzwingen.
- Der veraltete Nenner von `mietpreis_schutzlevel` (3.8 statt 2.8) erledigt sich damit.

#### Fix-10: Zeitprofil
**Dateien:** `src/model/compute-phases.ts`, `src/model/phase-weights.ts`, `docs/architektur/README.md`
**Aufwand:** 1–1.5 Tage

**Entschieden (2026-11-14, ersetzt die Fassung vom Vortag):** die Pipeline bleibt ein Generator. Der Wert einer Phase ist die Kombination aus dem Resultat der Vorphase und dem Vektor dieser Phase. Der Vektor trägt das Zeitprofil **nicht** allein. Der Übertrag (`PERSISTENCE`) bleibt.

Damit ist das Gewicht der **neue Impuls** der Phase, nicht das erreichte Niveau. Das Niveau entsteht erst mit dem Übertrag:

```
x[p] = PERSISTENCE · x[p−1] + Impuls[p]
```

*Korrektur am Review.* Der Befund «sofort, dann abnehmend gibt es nicht» las die Vektoren als Niveau und war so nicht richtig. Als Impuls gelesen heisst `[0.9, 0.6, 0.3]`: der grösste Schub kommt sofort, danach kommt weniger dazu, und der Stand bleibt über den Übertrag erhalten. Das ist ein sättigender Verlauf und passt zu den Kommentaren an den Kanten. Der Vorschlag vom Vortag, den Übertrag für Politik-Effekte zu streichen, ist verworfen.

*Was vom Befund bleibt.* Zwischen Vektor und Übertrag sitzt ein drittes Element, `PHASE_BASE_MULTIPLIER` (0.4 / 0.7 / 1.0). Es skaliert jeden Impuls nach Phase und drückt alle frühen Impulse. Verlauf des Standes, P3 = 1, über die 83 Politik-Kanten:

| Vektor (Impuls) | mit Multiplikator | ohne Multiplikator |
|---|---|---|
| 0.9 / 0.6 / 0.3 («sofort») | 0.42 / 0.82 / 1.00 | 0.66 / 0.97 / 1.00 |
| 1.0 / 0.8 / 0.7 | 0.28 / 0.63 / 1.00 | 0.51 / 0.81 / 1.00 |
| 0.0 / 0.6 / 1.0 («verzögert») | 0.00 / 0.31 / 1.00 | 0.00 / 0.41 / 1.00 |
| Spanne P1 zu P3, alle Kanten | 0.00 bis 0.47 | 0.00 bis 0.72 |

Mit dem Multiplikator erreicht keine Kante in P1 mehr als 47 % ihres P3-Standes, egal wie «sofort» der Vektor ist. Trägheit ist damit doppelt eingebaut: einmal im Übertrag, einmal im Multiplikator. Der Kommentar an `PHASE_BASE_MULTIPLIER` hält selbst fest, dass die Gewichte ursprünglich ohne ihn gefittet wurden.

*Was die Studien als Mass geben.* Geprüft wird der Verlauf des **Standes**, nicht der Vektor:
- Paris, Mietdeckel: −2.5 % im ersten Jahr, −5.9 % im vierten, −8.2 % im fünften (FR-003). Grob 0.35 / 1.0 nach zwei und fünf Jahren. Die Kante `mietrecht_anfangsmiete → mietpreis_schutzlevel` liefert heute 0.28 / 0.63 / 1.00 und liegt damit nahe.
- Berlin: regulierte Mieten sinken mechanisch mit Inkrafttreten, Inserate gehen im ersten Jahr zurück (DE-004). Verlangt einen hohen Stand schon in P1; mit Multiplikator nicht darstellbar.
- Auckland: Neubau reagiert nach 2–4 Jahren (NZ-001). Vancouver: erste Effekte nach 1–2 Jahren, deutlich nach 3–5 (CA-001). Passt zu verzögerten Vektoren.
- Mietregulierung und Angebot: kumulativ über Jahrzehnte (GLOBAL-029, US-001). Passt zum Übertrag.

**Entschieden (2026-11-14):** `PHASE_BASE_MULTIPLIER` wird gestrichen. Stand = Vektor plus Vorresultat, nichts Drittes. Wie früh ein Effekt kommt, steht nur im Vektor; wie lange er hält, im Übertrag.

Nicht einzeln ausliefern: ohne Multiplikator wächst jeder Stand (P1 um den Faktor 2.5, P3 bei flachem Vektor um rund 1.3). Mit den heutigen Nennern laufen angespannte Städte dann in den Clamp; Zürichs Verdrängungsrisiko steht in P3 schon heute bei 0.79. Der gemeinsame Nenner aus Fix-9 wird deshalb im selben Schritt gesetzt.

**Schritte:**
1. Semantik festschreiben: Gewicht = Impuls der Phase; Stand = `PERSISTENCE · Vorresultat + Impuls`. Im Kopf von `phase-weights.ts` und in `docs/architektur/README.md`. Die README beschreibt den Übertrag heute auf zwei widersprüchliche Arten und erwähnt den Multiplikator nicht.
2. `PHASE_BASE_MULTIPLIER` entfernen, zusammen mit dem neuen Nenner (Fix-9). `scripts/calibrate.ts` importiert die Engine und zieht automatisch mit.
3. Verlaufs-Audit: für jede der 83 Politik-Kanten den Stand über die drei Phasen ausrechnen und gegen eine Studie halten. Feld `profilQuelle` an der Kante (Studien-ID) oder ausdrücklich `'Annahme'`. Wo keine Verlaufsevidenz vorliegt, einen neutralen Impuls wählen statt eines erfundenen Verlaufs.
4. Abklingende Effekte: mit `PERSISTENCE = 0.8` verliert ein Stand ohne neuen Impuls 20 % pro Phase. Schnelleres Abklingen (Umgehung, Markt passt sich an) braucht einen negativen Impuls. Das Schema lässt das zu (im Review vom 2026-06-05 als Ausweg offengehalten). Pro Fall entscheiden und mit Quelle belegen.
5. Tests am Stand, nicht am Vektor: je ein Verlaufstest pro Studie oben (Paris wächst, Berlin wirkt in P1, Auckland verzögert).
6. Kontext-Antrieb: läuft über denselben Generator und akkumuliert weiter. Die Frage vom Vortag ist damit erledigt.
7. Hinweis für die Doku: die Phasen sind 2, 3 und 5 Jahre lang, der Übertrag ist pro Phase gleich. Entweder begründen oder an die Phasenlänge koppeln; kein Fehler, aber eine Annahme.

#### Fix-11: Fehlende Evidenzpfade
**Datei:** `src/model/phase-weights.ts`
**Aufwand:** 0.5 Tag plus Recherche-Abgleich
| Neue Kante | Vorzeichen | Quelle |
|---|---|---|
| `steuer_leerstandsabgabe → angebotspotenzial` | + | CA-001 bis CA-003 (Vancouver) |
| `nutzung_kurzzeitvermietung → angebotspotenzial` | + | `summary.md`, ES-001, US-003 |
| `boden_bodeneigentumssteuer → angebotspotenzial` | + | DK-001, DK-002, GLOBAL-028 |
| `gemeinnuetzig_kraft` → Marktmiete (Gruppen-Trend Neumieter) | − | AT-002 (Wien) |
| `mietrecht_kuendigungsschutz → mietpreis_schutzlevel` | + | `summary.md` |

Die veraltete `docs/architektur/01-graph-kanten.md` führt vier dieser Kanten noch auf (`steuer_leerstandsabgabe → angebotspotenzial`, `nutzung_kurzzeitvermietung → angebotspotenzial`, `mietrecht_kuendigungsschutz → mietpreis_schutzlevel`, `boden_vorkaufsrecht → angebotspotenzial`). Sie waren also einmal vorgesehen und sind beim Umbau auf Phasengewichte verloren gegangen.

Heute laufen Bodensteuer, Vorkaufsrecht, Belegungsvorschriften, Sozialmischung und Untervermietung praktisch ins Leere. Für Vorkaufsrecht und Bauverpflichtung fehlt laut `summary.md` die Evidenz; dort keine Kante erfinden. **Entschieden:** diese Parameter bleiben und werden im UI als «Wirkung nicht belegt» gekennzeichnet (Feld in `paramMeta40`, Hinweis am Schieber). Die Kennzeichnung selbst ist klein und kann schon in Sprint 2 kommen.

#### Fix-12: Doppelzählungen
**Dateien:** `src/model/phase-weights.ts`, `src/model/supply-demand.ts`
**Aufwand:** 0.5 Tag
1. `raumplanung_zonenreserve → nachfragedruck` streichen. Der Effekt liegt schon auf `angebotspotenzial`. Seit Fix 0.1 ist die Zonenreserve mit 0.188 pro Stufe der stärkste Einzelhebel; die Richtung stimmt, die Stärke ist ein Artefakt.
2. Förderfonds, Mindestanteil, Baurecht wirken je als Angebot und als Nachfragedämpfung. Auf einen Kanal reduzieren.
3. Mietpreisdeckel im Diagramm: die Menge sinkt entlang der Kurve, und die Mietrechts-Kanten verschieben zusätzlich die Kurve. Einen der beiden Wege wählen.
4. `knappheitSignal` macht bei mehr Nachfrage auch die Angebotskurve steiler. Aus der Steigung herausnehmen.
5. Angebotskurve um das Baseline-Gleichgewicht drehen statt um q=0, damit mehr Regulierung nur die Elastizität ändert.

#### Fix-13: Neukalibrierung mit Rangfolge-Constraints
**Datei:** `scripts/calibrate.ts`
**Aufwand:** 1 Tag
1. Bestehende 56 Basis-Constraints auf Skalenrichtung prüfen (Lehre aus Fix 0.1).
2. Neue Constraints aus der Recherche:
   - Zonierung, Verdichtung, Ausnützung wirken auf Neumieter-Preise in P3 stärker als Förderfonds und ÖV (`summary.md`: Angebot dominant).
   - Anfechtung Anfangsmiete wirkt auf die Mietbelastung schwächer als Kostenmiete (CH-003).
   - Mietregulierung: Bestand sinkt, Neumieter steigt, Angebot sinkt in P3 stärker als in P1 (GLOBAL-027, GLOBAL-029).
   - Upzoning: in P1 kein messbarer Preiseffekt (US-007 Minneapolis).
3. Kalibrieren, Sensitivitätstabelle aus Abschnitt 1 neu rechnen und hier ablegen.

#### Fix-14: Gruppenmodell
**Dateien:** `src/model/groups.ts`, `src/model/belastung.ts`
**Aufwand:** 0.5 Tag
1. Geringverdiener haben keinen Verdrängungsterm, obwohl CH-008 sie als verletzlichste Gruppe nennt.
2. Eigentümer mit Hypothek: höhere Zinsen wirken nur indirekt über Nachfrage und Investition und heben sich fast auf. Direkten Zinskanal ergänzen.
3. Mietbelastung: Basis 44.8 % für alle Städte. `mietbelastungs_grenze` als stadtspezifische Basis verwenden oder das Kontextfeld entfernen.

---

## 6. Sprint 4 — erst mit Daten

- `mietluecke` und `anteil_altliegenschaft` gemäss Messvorschrift in CH-012 füllen. Erst dann `FRONTLOAD`, `VERWEIL_GEWICHT`, `CAP_INVEST_WEIGHT` kalibrieren.
- Zitierte Zahlen in JSDoc-Kommentaren (z. B. «Sotomo: ~40 % weniger Miete») gegen die Originalquellen prüfen. Im Review nicht geschehen.

---

## 7. Reihenfolge und Aufwand

| Sprint | Inhalt | Aufwand | Abhängigkeit |
|---|---|---|---|
| 0 | Vorzeichen, Regime | erledigt | — |
| 1 | Fix-1 bis Fix-4 | erledigt | — |
| 2 | Fix-5 bis Fix-7 (Fix-8 erledigt) | ca. 1 Tag | keine |
| 3 | Fix-9 bis Fix-14 | ca. 5 Tage | keine |
| 4 | Regime-Kalibrierung | offen | Daten |

Sprint 1 und 2 können parallel laufen. Sprint 3 ändert alle Zahlen im UI und sollte als ein Release mit Hinweis ausgeliefert werden.

## 8. Test-Plan

- Nach jedem Fix: `npx vitest run`, `npx tsc --noEmit`, `npx tsx scripts/calibrate.ts --dry-run`.
- Neu als fester Test: Sensitivitätstabelle (jeder Parameter ±1 Stufe, Zürich) mit Vorzeichen-Erwartung pro sichtbarem Ausgang. Fängt verkehrte Skalen und tote Schieber.
- Nach Sprint 3: Rangfolge-Constraints aus Fix-13 zusätzlich als fachliche Tests.

## 9. Entscheide

Stand 2026-11-13:

1. **Normalisierung (Fix-9):** ✅ gemeinsamer Nenner.
2. **Zeitprofil (Fix-10):** ✅ Generator bleibt (2026-11-14). Stand der Phase = Resultat der Vorphase plus Vektor dieser Phase; das Gewicht ist der Impuls, nicht das Niveau. Die Fassung vom 2026-11-13 («Niveau pro Phase, Übertrag streichen») ist verworfen.
3. **Regime-Schieber (Fix-5):** ✅ eigenes provisorisches Widget.
4. **Ungenutzt:** zwei getrennte Dinge.
   - Schieber ohne Wirkung: ✅ auskommentieren, bis sie angebunden sind (Fix-5).
   - Fünf nicht eingebundene Widget-Komponenten (Fix-8): ✅ eingebaut.
5. **Parameter ohne Evidenz** (Vorkaufsrecht, Bauverpflichtung): ✅ im UI kennzeichnen (Fix-11).

6. **Phasenmultiplikator (Fix-10):** ✅ streichen (2026-11-14), zusammen mit Fix-9.

Keine offenen Entscheide.
