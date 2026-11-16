# Verbesserungsplan nach fachlichem Review (2026-11-13)

> **Status (2026-11-16):** Sprint 0 bis 4 sind umgesetzt. Alle Entscheide sind gefällt (der letzte, Mindestanteil nach Rechtsstand, am 2026-11-16). Offen sind Datenarbeit und Restposten, kein Umbau.
> **Wer hier weiterarbeitet, liest Abschnitt 0.** Die Abschnitte 1 bis 9 sind die Chronik: Sie halten fest, was wann warum geändert wurde, und enthalten Zwischenstände, die später überholt wurden (jeweils mit «überholt» markiert). Bei Widerspruch gilt Abschnitt 0, im Zweifel der Code.
> **Grundlage:** Fachliches Review vom 2026-11-13: Code in `src/model`, gerenderte Widgets, `docs/recherche/summary.md`, CH-012, Nachrechnung aller Parameter für Zürich (je ±1 Stufe, Wirkung in P3).

## 0. Übergabe (Stand 2026-11-16)

### 0.1 Wo das Projekt steht

Branch `feat/mietrecht-regime-2026`, **nicht gepusht**. Commits seit `main`-Stand des Reviews:

| Commit | Inhalt |
|---|---|
| `238b6cd` | Sprint 0 (Vorzeichen, Regime liest Zinsänderung), Fix-8 (fünf Widgets eingebaut) |
| `46036cc` | Sprint 1 (Skalenrichtung, Regime-Restfehler, Bevölkerungstrend) |
| `013abda` | Lint- und Build-Fehler |
| `2caf688` | `zuwanderungsdruck` nach BFS |
| `bb3997d` | Sprint 2 (Regime-Widget, Treiber aus der Rechnung, DAG-Rückkopplungen entfernt, Teuerungs-Nullpunkt) |
| `f8841b3` | Sprint 3, Fix-9 bis Fix-13 (gemeinsamer Nenner, Multiplikator gestrichen, neue Kanten, Doppelzählungen, Neukalibrierung) |
| `74dae4e` | Fix-14 (Gruppenmodell, Mietbelastung), Quellenangaben richtiggestellt |
| `d5303f2` | Preis-Mengen-Diagramm: Referenzlinie zeigt die Baseline derselben Phase |
| `b246c5a` | Sprint 4 (Altliegenschaften-Daten, Regime-Einheiten, Restposten) |
| `c4cefb1` | Mietabstand-Indikator, Regel für unbelegte Angebotshebel, Schieber «Ausgleich beim Pflichtanteil» |
| `e41c600` | `gemeinnuetzig_mindestanteil` und `gemeinnuetzig_ausgleich` je Stadt nach geltendem Recht (Abschnitt 0.3, Punkt 1) |
| `6ee21d6` | Aufräumen (Abschnitt 0.3, Punkte 16–22): Widget-Katalog, Quellen, US-018, Fachtest-Kommentare, CH-012-Fussnoten, `knappheitSignal` entfernt, Namen ohne «40» |
| «feat: Datenarbeit 0.3, Punkte 2, 4 und 5» | Ausgleich je Stadt geklärt (Basel 1 → 2), Mietabstand geprüft, Notizen CH-013 bis CH-015, Zitate korrigiert |

Working Tree sauber (Stand 2026-11-16).

**Teststand 2026-11-16:** `npx vitest run` 552 passed, 1 skipped (28 Dateien; die sechs Tests von `knappheitSignal` sind mit der Funktion entfernt). `npx tsc -b`, `npm run lint`, `npm run build` ohne Fehler. `npx tsx scripts/calibrate.ts --dry-run` 0/567 Verletzungen.

### 0.2 Wie das Modell heute rechnet (Kurzfassung, Details im Code)

- **44 Parameter** (E0), 11 Marktknoten (E1) plus fünf Regime-Zustände, 4 Indikatoren (E2), 7 Kontextfaktoren plus drei Kontextwerte, die nicht über Kanten rechnen (`anteil_altliegenschaft`, `mietluecke`, `mietabstand_neubezug`).
- **Stand eines Knotens:** `clamp(PERSISTENCE · Vorstand + Σ sign·w·Δ · marketModulator / E1_NENNER)`, `PERSISTENCE = 0.8`, `E1_NENNER = 11.2` für alle Knoten. Ein Gewicht ist der **Impuls** der Phase, nicht das Niveau. Es gibt keinen Phasenmultiplikator mehr. Kopfkommentar von `phase-weights.ts` und `docs/architektur/README.md`.
- **`profilQuelle`** an jeder Politik-Kante: Studien-ID oder `'Annahme'`. Annahme-Kanten haben den neutralen Vektor `[w, w, w]` (Test in `dag-integrity.test.ts`).
- **Regel für unbelegte Angebotshebel:** Annahme-Kante auf `angebotspotenzial` in P3 höchstens halb so stark wie der schwächste Hebel aus `REFERENZ_ANGEBOTSHEBEL` (`ANNAHME_ANGEBOT_MAX_ANTEIL`, Test in `dag-integrity.test.ts`).
- **Bedingte Kante:** `gemeinnuetzig_mindestanteil → angebotspotenzial` trägt `ausgleichDurch: 'gemeinnuetzig_ausgleich'`; `getEdgeDelta` rechnet Δ[Mindestanteil · (1 − Ausgleich)]. Dafür trägt `computeDiff` Begleiteinträge mit `from === to` ins Diff ein (`DIFF_BEGLEITER`). **Änderungen zählt man mit `changedParamKeys(diff)`, nie mit `Object.keys(diff)`.**
- **Mietrechts-Regime** (`mietrecht-regime.ts`, provisorisch): eigene Logik mit Schwellen und Produkten. Erhöhungsspielraum in einer Einheit (zulässige Mietzinsänderung in Prozent / 7.5), aus Art. 13 und 16 VMWG. Die Regime-Zustände werden im Widget gezeigt und fliessen **nicht** in Gruppen-Trends und Mietbelastung ein.
- **Gruppen-Trends:** `computeGroupTrends(state, context, drivers?)`; Treiber per Leave-one-out (`group-drivers.ts`).
- **Kalibrierung:** `scripts/calibrate.ts` rechnet über die Engine. Die Gewichte sind von Hand gesetzt und erfüllen alle Constraints; der Optimierer lief bewusst nicht.

### 0.3 Offen, nach Art

**Entschieden und umgesetzt 2026-11-16**
1. **`gemeinnuetzig_mindestanteil` nach Rechtsstand.** Entscheid des Projektinhabers: heutige Situation, nur Pflichten, die rechtlich in Kraft sind. Ziele (Zürcher Drittel bis 2050), Entwürfe und Verträge auf öffentlichem Land zählen nicht. Gemessen wird der wirksame Anteil an allen Neubauten (Quote × erfasster Teil der Produktion), Stufe nach Schwellen 5 % / 21.5 % (Setzung, Kopf von `switzerland.yaml`). Ergebnis: Genf 1 (Art. 4A LGZD), Basel 1 (§ 101a BPG seit 18.8.2026), alle anderen 0. Geändert: Zürich und Biel 2 → 0, Bern 2 → 0, Lausanne und Winterthur 1 → 0. **Grenzfälle:** Bern (Pflicht in Kraft, aber nur bei Einzonungen, wirksam wenige Prozent) und Genf (wirksam grob 20–27 %, gemessen 16–23 % LUP). Folge: In Zürich bewegt `gemeinnuetzig_ausgleich` allein nichts mehr (Ausnahmeliste in `schieber-wirkung.test.ts`). Recherche mit Sonnet-Subagents; die Mengenschätzungen sind unbelegt, keine Stadt hat Sicherheit «hoch».

**Datenarbeit — erledigt 2026-11-16, ausser 3 und der jährlichen Nachführung in 4**
2. ✅ `gemeinnuetzig_ausgleich` für alle zehn Städte geklärt (Recherche mit Sonnet). Basel 1 → 2: § 101a BPG greift nur bei Umzonung neu für Wohnen, dazu § 121a BPG; das erfüllt die Definition von Stufe 2. **Rechenwirkung:** In Basel senkt der Pflichtanteil das Angebot nicht mehr. Lausanne 0 → 1 (Art. 29 LPPPL), Lugano 0 → 1 (Art. 15 NAPR), ohne Rechenwirkung (kein Pflichtanteil). St. Gallen und Biel bleiben 0, jetzt geprüft. Genf 2 im Wortlaut bestätigt (Art. 4A, 2A LGZD; Art. 12 LaLAT). Offen: Basler Wortlaut nur aus dem Ratschlag, nicht aus der Gesetzessammlung; Luzerner Artikelnummern nur sekundär.
3. `mietluecke` bleibt leer (Entscheid). Damit bleiben `FRONTLOAD`, `VERWEIL_GEWICHT`, `CAP_INVEST_WEIGHT` unkalibriert. Eine Datenbasis mit Anlagekosten gibt es nicht; der Mietdauer-Abstand ist kein Ersatz (CH-012).
4. ✅ `mietabstand_neubezug` geprüft: Für Winterthur, Luzern, St. Gallen, Lugano, Biel ist kein Stadtwert mit Bezugsdauer publiziert; eine BFS-Sonderauswertung wäre möglich. SE 2025 nicht publiziert, erwartet um März 2027: dann nachführen. Messvorschrift neu im Kopf von `switzerland.yaml`.
5. ✅ Notizen CH-013 (DIW DP 2143, mit Wüest Partner 2024a), CH-014 (Sotomo 2025), CH-015 (Basel, SRES/SVIT). Der Abgleich fand Fehler, im Code korrigiert: Ersatzneubau-Faktor ist brutto, nicht «netto»; «rund 9 %» ist aus Sotomo gerechnet; private Renovation +150 Mio. gilt für Jahre 1–3; die Sanierungsquoten (83.5/47.6/41.3 %) sind unrenovierte Altbauten nach Avenir Suisse 2012, ohne Kausalaussage; die DIW-Zahlen gelten für einen Rationierungsindex, nicht für das Abbruchverbot allein; Basel misst Wohneinheiten in Baugesuchen, «Ursache offen» sagt das Präsidialdepartement (26.3.2025), nicht die Studie. Zürich +20 % (Stadt, Wohneinheiten) steht doch in CH-015.

**Modell, bewusst offen gelassen**
6. **Regime: `pullBestand`** behandelt jede positive Bestandsmiete als Überhöhung, auch die rechtlich zulässige Überwälzung. Die Durchsetzung zieht deshalb zulässige Erhöhungen zurück.
7. **Regime: Vorladung** wirkt seit der neuen Einheit bei gleichem `FRONTLOAD` nur noch 0.4-mal so stark.
8. **Regime:** Ob ein Rückgang des LIK im Referenzzins-Regime einen Senkungsanteil gibt, ist nicht entschieden (Art. 16 VMWG spricht von «Steigerung»). Kostensteigerungen fehlen als Anteil des Spielraums.
9. **`marketModulator`** (0.3 pro Stufe, Faktor 4 zwischen den Extremen): keine Notiz stützt die Grösse; die Richtung ist nur für die Angebotsseite gestützt (AU-004, GLOBAL-025). Nicht ändern, ohne `E1_NENNER` neu herzuleiten.
10. **`fiskalische_wirkung`:** E2 liest nur den Knoten `gemeinnuetzig_kraft` und kann Instrumente nicht trennen. Mindestanteil, Belegungsvorschriften und Sozialmischung erscheinen deshalb als Kosten, obwohl sie die öffentliche Hand direkt wenig kosten. Gleiches Problem bei `spekulationshemmung` (+1.5): Zweitwohnungen, Kurzzeitvermietung und Bauverpflichtung sind keine Einnahmen.
11. **Drei Kanten ohne belegte Richtung** (als Annahme gekennzeichnet, Vorzeichen unverändert): `nutzung_zweitwohnungen → angebotspotenzial`, `mietrecht_untervermietung → verdraengungsrisiko`, `mietrecht_mietzinstransparenz → marktfriktion`.
12. **Reihenfolge der Annahme-Kanten auf das Angebot** ist eine Setzung (proportional gesenkt, nicht neu begründet).
13. **Schnell abklingende Effekte** (Fix-10, Schritt 4): kein negativer Impuls umgesetzt, weil in der Sammlung eine Abklingrate fehlt.
14. **Zinskanal der Eigentümer** ist im UI nicht bedienbar (Kontext nicht editierbar) und wirkt erst, wenn `referenzzins_aenderung` in den Daten ändert.
15. Ohne Wirkung auf Gruppen-Trends und Mietbelastung (aber auf eine andere angezeigte Grösse): `boden_mehrwertabgabe`, `mietrecht_mietzinsindex`, `mietrecht_untervermietung`, `mietrecht_kriterium`, `mietrecht_durchsetzung`, `kapital_institutionelle_regulierung`; die drei Steuern auf Gewinne und Handänderung bewegen nur `marktfriktion`.

**Aufräumen — erledigt 2026-11-16** (Punkte 16–22)
16. Widget-Katalog nach `WidgetGrid.tsx` neu geschrieben (16 Widgets in Rasterfolge, Regime-Widget, Mietabstand, 44. Schieber).
17. «Agglomeration Zürich 2.8×» mit Quelle in `src/types.ts`; `scripts/calibrate.ts` zitiert DIW DP 2143. Die Migrationsskripte `scripts/add-new-params.*` und `scripts/patch-test-fixtures.*` (einmalig gelaufen, nicht im Build) entfernt.
18. US-018 trägt die ID `US-018`; US-016 bis US-018 im `docs/recherche/index.md` nachgetragen.
19. Fachtests: «FHNW» als Quelle durch DIW DP 2143 ersetzt, «Paradox» und Hinweise auf fehlende Kanten entfernt (die Kanten gibt es), ungeprüfte «Zürich +20 % Baugesuche» gestrichen, EHT-Satz nach CA-001 (3 %) statt 0.5/2.5 %, tote Pfade auf `docs/superpowers/` ersetzt.
20. CH-012: Fussnoten durchgehend 1–28 nummeriert (alle Verweise waren belegt; Lücken auch bei 3, 5, 6, 9, 10).
21. `knappheitSignal()` und `KNAPPHEIT_GEWICHTE` entfernt, samt Tests; AGENTS.md nennt als Beispiel `VERDICHTUNGSDRUCK_GEWICHTE`.
22. `CityParams40` → `CityParams`, `ParamsDiff40` → `ParamsDiff`, `PARAM_KEYS_40` → `PARAM_KEYS`, `paramMeta40`/`ParamMeta40` → `paramMeta`/`ParamMeta`, `computeDiff40` → `computeDiff`, `hasChanges40` → `hasParamChanges`. Die Chronik (Abschnitte 1–9) und ältere Reviews nennen die alten Namen.

### 0.4 Arbeitsweise, die sich bewährt hat

- **Vor jedem Commit:** `npx vitest run`, `npx tsc -b`, `npm run lint`, `npm run build`, `npx tsx scripts/calibrate.ts --dry-run` (muss 0 Verletzungen zeigen).
- **Nach Änderungen an Kanten oder Parameter-Metadaten:** `npm run build:docs`, sonst schlägt `edge-doc.test.ts` fehl. **Nach Änderungen am YAML:** `npm run build:data`; `src/generated/` nie von Hand editieren.
- **Ein neuer Parameter** berührt: `types.ts` (`CityParams`), `params.ts` (`PARAM_KEYS`, `paramMeta`), alle zehn Städte im YAML, `REQUIRED_KEYS` in `scripts/build-city-data.ts`, die Union in `dag-topology.ts`, zwei Karten in `DAGVisualization.tsx` (Gruppe und Label), die `CityParams`-Fixtures der Fachtests, `AGENTS.md` und die Architektur-README.
- **Wächter-Tests, die man nicht abschwächt:** `schieber-wirkung.test.ts` (jeder Schieber bewegt eine angezeigte Grösse; baut Diffs über `computeDiff`), `group-drivers.test.ts`, `rangfolge-fachlich.test.ts`, `verlauf-fachlich.test.ts`, `dag-integrity.test.ts`, `anteil-altliegenschaft.test.ts` und `mietabstand-neubezug.test.ts` (Felder, die nichts rechnen dürfen). Wird ein fachlicher Test rot, ist das ein Modellbefund.
- **Setzungen kennzeichnen.** Jede Grösse ohne Beleg heisst im Kommentar «Setzung»; Quellenangaben nur, wenn die Zahl in der Quelle steht. Die Quellenprüfung vom 2026-11-15 fand vier von fünf Sotomo-Zitaten falsch.
- **Skala ≠ Grösse.** Zweimal war der Nullpunkt einer Stufenskala nicht der Nullpunkt der Grösse (Zinsniveau statt Zinsänderung; Teuerungsstufe −1 als Preisrückgang). Bei jedem Kontextwert prüfen, was Stufe 0 bedeutet.
- **Im Browser prüfen**, was das UI zeigt (`npm run dev`, `/zuerich?...`). Zwei Fehler der DAG-Ansicht fielen erst dort auf.

## 1. Ausgangslage

Die Engine rechnet technisch sauber. Fachlich gab es drei Klassen von Problemen:

| Klasse | Befund | Status |
|---|---|---|
| Vorzeichen | `raumplanung_zonenreserve → nachfragedruck` und `bau_bewilligungsverfahren → angebotspotenzial_regulation` lasen die Parameterskala verkehrt herum | ✅ behoben |
| Regime | Referenzzins-Regime las das Zinsniveau statt der Zinsänderung | ✅ behoben |
| Struktur | Normalisierung pro Knoten verzerrt die Rangfolge der Hebel; der Phasenmultiplikator drückt alle frühen Effekte (Fix-10); mehrere Schieber und Evidenzpfade laufen ins Leere | ✅ Nenner, Multiplikator, Evidenzpfade, Gruppenmodell behoben (Sprint 3, 2026-11-15) |

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

Stand bei Abschluss von Sprint 1: 225 Tests grün, Kalibrierungs-Dry-Run 0/446 (committet in `46036cc`).

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

*(Überholt: seit Sprint 4 enthält der Spielraum die 40 % Teuerung, und die Einheiten sind geeicht; siehe Abschnitt 6.)* Offen: der Erhöhungsspielraum im Referenzzins-Regime enthält die 40 % Teuerung selbst nicht. Der Teuerungs-Nullpunkt ist seit 2026-11-15 korrigiert (siehe Fix-5), das Hindernis ist weg. Offen bleibt die Einheit: eine Teuerungseinheit und ein Schritt des Referenzzinssatzes sind nicht gegeneinander geeicht, die Summe wäre deshalb noch nicht belastbar (Sprint 4).

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

Zurückgestellt, bis Fix-9/10 die Rechnung ändern *(README mit Fix-10 erledigt; der Widget-Katalog ist weiterhin veraltet, Abschnitt 0.3 Punkt 16)*:
- `docs/architektur/README.md`: zwei widersprüchliche Übertragsformeln (richtig ist die erste, siehe Fix-10); `PHASE_BASE_MULTIPLIER`, `marketModulator`, `E1_NORMALIZATION` fehlen; Vorzeichenkonvention «positiv = angebotsreduzierend» widerspricht `types.ts`; Zahlen veraltet.
- `docs/architektur/02-widget-katalog.md`: beschreibt `SupplyDemandChart` als zwei Trendlinien und 8 Gruppen.

---

## 4. Sprint 2 — Was der Nutzer sieht, muss zur Rechnung passen — ✅ erledigt (2026-11-14)

#### Fix-5: Wirkungslose Schieber — ✅ erledigt (2026-11-14)
**Dateien:** `src/widgets/MietrechtRegimeWidget.tsx` (neu), `WidgetGrid.tsx`, `src/model/__tests__/functional/schieber-wirkung.test.ts` (neu), `ParameterSlider.tsx`, `params.ts`, `types.ts`
- **Regime-Widget:** «Mietrecht-Regime (provisorisch)» zeigt Erhöhungsspielraum, Bestandsmiete, Anfangsmiete und Verweildauer je Phase sowie den Zustand des Vergleichsmieten-Tors, bei Änderungen «Heute» neben «Simuliert». Die Zustände bleiben aus Gruppen-Trends und Mietbelastung draussen.
- **Leerstandsabgabe bleibt sichtbar.** Der Entscheid lautete, Schieber ohne Wirkung auszublenden. Seit dem Einbau des Fiskal-Widgets (Fix-8) bewegt `steuer_leerstandsabgabe` über `spekulationshemmung` die fiskalische Wirkung; der Schieber ist nicht mehr wirkungslos. Die fehlende Kante zum Angebot bleibt Fix-11.
- **Sensitivitätstest:** `schieber-wirkung.test.ts` prüft für alle 43 Parameter, dass mindestens eine angezeigte Grösse sich bewegt. Einzige dokumentierte Ausnahme: `mietrecht_durchsetzung` wirkt nur zusammen mit einem Senkungsanspruch (eigener Test).
- **«Wirkung nicht belegt»:** Feld `evidenz` in `ParamMeta40`, gesetzt für Vorkaufsrecht und Bauverpflichtung (summary.md: keine Wirkungsstudien); der Schieber trägt den Hinweis.

Beim Bau des Widgets aufgefallen, **nicht behoben** (braucht eine Definition, gehört zu Sprint 4):
- Mit den heutigen Stadtdaten (Referenzzins unverändert, keine Mietlücke erfasst) stehen fast alle Regime-Zustände auf 0. Bewegung gibt es nur über den Mietzinsindex auf LIK.
- ✅ **Behoben am 2026-11-15** (`TEUERUNG_STUFE_PROZENT`, `teuerungAlsGroesse` in mietrecht-regime.ts, vier neue Tests, CH-012 nachgeführt): Die Stufe wird in eine Jahresteuerung übersetzt (−0.5 / 0.25 / 1.0 / 2.0 / 3.0 %), null Teuerung liegt zwischen −2 und −1. Stufe −1 gibt im LIK-Regime jetzt +0.07 statt −0.42. Die Randwerte und die Referenz 3 % sind Setzungen. Die Durchsetzung wirkt mit LIK weiterhin, aber über den Deckel (gestiegene Miete), nicht mehr über einen Senkungsanspruch. Ursprünglicher Befund: Dort rechnete das Regime `teuerung = −1` als negativen Erhöhungsspielraum (−0.42), also als Senkungsanspruch. Die Stufe −1 heisst aber «tiefe Teuerung» (LIK 2025: +0.2 %), nicht «sinkende Preise». Gleiche Fehlerklasse wie Zinsniveau statt Zinsänderung: Der Nullpunkt der Skala ist nicht der Nullpunkt der Grösse.

#### Fix-6: Treiber-Anzeige aus der Rechnung ableiten — ✅ erledigt (2026-11-14)
**Dateien:** `src/model/group-drivers.ts` (neu), `src/model/groups.ts`, `WidgetGrid.tsx`, `src/model/__tests__/functional/group-drivers.test.ts` (neu)
`groupKeyParams` und die doppelte Label-Liste sind gelöscht. `computeGroupDrivers(context, diff)` bestimmt je Phase und Gruppe den Beitrag jedes geänderten Parameters per Leave-one-out und liefert die drei grössten. `computeGroupTrends(state, drivers?)` braucht `baseline`/`modified` nicht mehr. Labels kommen aus `paramMeta40`. Die zustandsbasierten Pseudo-Treiber «Aufwertungsdruck»/«Verdrängungsrisiko» entfallen: Sie waren keine Parameter.
Test: Für jede Einzeländerung jedes Parameters stimmt die Treiberrichtung in allen Gruppen und Phasen mit dem Vorzeichen der Trendänderung überein.
Nebenbefund: Die zwei Tests in `gruppen-divergenz.test.ts` rechneten mit leerem Diff; ihr Szenario kam nie in der Pipeline an. Sie übergeben den Diff jetzt und bestehen weiterhin.

#### Fix-7: DAG-Ansicht ehrlich machen — ✅ erledigt (2026-11-14)
**Datei:** `src/widgets/DAGVisualization.tsx`
Die acht Rückkopplungs-Bögen und ihre zwei Legendeneinträge sind entfernt; ein Kommentar hält fest, dass die Engine azyklisch rechnet.

#### Fix-8: Nicht eingebaute Widgets — ✅ erledigt (2026-11-13)
**Dateien:** `WidgetGrid.tsx`, `CompareColumns.tsx` (neu), `FiskalischeWirkungWidget`, `MarktfriktionsWidget`, `EigentumsquotenWidget`, `StandortwettbewerbWidget`, `GemeinnuetzigSektorWidget`
Alle fünf sind in `WidgetGrid` eingebunden, zeigen den langfristigen Stand (P3) und bei geänderten Parametern «Heute» neben «Simuliert». `docs/architektur/README.md` führte sie bereits als Teil des Grids. Beim Einbau korrigiert:
- **Eigentumsquote:** der Pfeil war verkehrt (negativer Trend hiess «steigend»). Die Umrechnung «36 % ± 8 Punkte, Eigentumsquote CH» ist ersetzt durch den Index; die Zahl war erfunden und für jede Stadt dieselbe.
- **Gemeinnütziger Sektor:** «x % prognostiziert» mit Referenzmarken Zürich 26 % / Wien 60 % entfernt. Der neutrale Index 0 ergab 40 % Marktanteil. Jetzt Index mit «wie heute / wird gestärkt / wird geschwächt».
- **Fiskalische Wirkung:** «ca. CHF x Mio./Jahr» entfernt (feste Skala ±100 Mio. für jede Stadt). Jetzt Index.

*(Überholt: in Sprint 4 auf −1 gestellt, Widget-Texte angepasst.)* Offen: Vorzeichen `gemeinnuetzig_kraft: +1` in `fiskalische_wirkung` (Förderfonds und Baurecht unter Marktwert kosten die öffentliche Hand Geld). Nicht geändert, weil E2 mitkalibriert ist; gehört zu Fix-13. Die Erklärtexte im Fiskal-Widget nennen feste Steuerarten unabhängig davon, was den Index bewegt.

---

## 5. Sprint 3 — Modellstruktur — ✅ Fix-9 bis Fix-14 umgesetzt (2026-11-15)

Fix-9 bis Fix-12 gehören zusammen und enden in **einer** Neukalibrierung (Fix-13). Nicht einzeln ausliefern.

#### Fix-9: Normalisierung
**Dateien:** `src/model/compute-phases.ts`, `scripts/calibrate.ts`
**Aufwand:** 1 Tag
- **Entschieden:** ein gemeinsamer Nenner für alle Knoten. Ein Gewicht bedeutet dann überall dasselbe: Effektgrösse eines vollen Schritts auf der Skala −1…+1. Die Zahl der Kanten eines Knotens verdünnt nichts mehr.
- Verworfen: Nenner pro Knoten behalten und die Rangfolge nur über Constraints erzwingen.
- Der veraltete Nenner von `mietpreis_schutzlevel` (3.8 statt 2.8) erledigt sich damit.

**Umgesetzt (2026-11-15):** `E1_NENNER = 11.2` in `compute-phases.ts` ersetzt `E1_NORMALIZATION`. Herleitung: der extremste Kontext (alle Kontextfaktoren am Rand und in Richtung des Knotens, `marktenge` +2) bringt den Knoten in P3 gerade an ±1. Grösster Wert `nachfragedruck` mit 11.17, knapp vor `eigentumsquoten_trend` mit 11.12; aufgerundet. `phase-pipeline.test.ts` rechnet die Herleitung nach. `scripts/calibrate.ts` rechnet über die Engine und damit mit demselben Nenner.

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

**Umgesetzt (2026-11-15):**
- `PHASE_BASE_MULTIPLIER` entfernt. Stand = `0.8 · Vorresultat + Σ sign·w·Δ·marketModulator / E1_NENNER`. Semantik im Kopf von `phase-weights.ts` und in `docs/architektur/README.md` (Abschnitt Berechnungspipeline, neu geschrieben).
- Feld `profilQuelle` an allen 83 Politik-Kanten. Mit Studie: Zonenreserve, Verdichtung, Ausnützung → Angebot (AU-002, NZ-001, US-005, verzögert); Kündigungsschutz und Kostenmiete → Angebot (GLOBAL-029, kumulativ); Leerstandsabgabe → Angebot und → Spekulationshemmung (CA-001); Hypothekarregulierung → Nachfrage (KR-003, nur P1); Kostenmiete → Schutz (DE-004, Sprung und Halten); Anfangsmiete → Schutz (FR-003, wachsend); Verdichtung und Ausnützung → Aufwertung (US-010, US-008, Sprung und Halten). Alle übrigen sind `'Annahme'` mit neutralem Impuls `[w, w, w]`; `w` ist so gewählt, dass der P3-Stand gleich bleibt wie mit dem alten Vektor. `dag-integrity.test.ts` prüft Feld, Studien-ID und Neutralität.
- Schritt 4 (negativer Impuls für schnelles Abklingen): keine Kante umgestellt. KR-003 ist mit Impuls nur in P1 abgebildet und klingt über den Übertrag ab; für einen negativen Impuls fehlt in der Sammlung eine Abklingrate.
- Verlaufstests am Stand: `verlauf-fachlich.test.ts` (Paris wächst, Berlin ≥ 80 % in P1, Auckland ≤ 10 % in P1, dazu US-005 und KR-003).
- Phasenlänge: Übertrag bleibt pro Phase gleich, Begründung im JSDoc von `PERSISTENCE` und in der README.

*(Überholt: beides in Sprint 4 erledigt.)* **Offen:** `dag-topology.ts` liest neutrale Vektoren für die Ansicht als «kurzfristig». Der Kopfkommentar von `mietrecht-regime.ts` nennt noch `E1_NORMALIZATION` (Datei bewusst nicht angefasst).

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

**Umgesetzt (2026-11-15):** alle fünf Pfade eingebaut, keiner für Vorkaufsrecht oder Bauverpflichtung.
- `steuer_leerstandsabgabe → angebotspotenzial` `[0.05, 0.15, 0.15]`, Verlauf CA-001; Grösse Setzung (CA-001 misst Leerstand, nicht Neubau).
- `nutzung_kurzzeitvermietung → angebotspotenzial` `[0.1, 0.1, 0.1]`, Annahme; Grösse Setzung.
- `boden_bodeneigentumssteuer → angebotspotenzial` `[0.1, 0.1, 0.1]`, Annahme; Grösse Setzung.
- `mietrecht_kuendigungsschutz → mietpreis_schutzlevel` `[0.6, 0.6, 0.6]`, Annahme; Grösse Setzung.
- `gemeinnuetzig_kraft` → Neumieter-Trend: Term `−0.25 · gemeinnuetzig_kraft` in `groups.ts`, Quelle AT-002; 0.25 ist Setzung (halber Faktor der Genossenschafter).

#### Fix-12: Doppelzählungen
**Dateien:** `src/model/phase-weights.ts`, `src/model/supply-demand.ts`
**Aufwand:** 0.5 Tag
1. `raumplanung_zonenreserve → nachfragedruck` streichen. Der Effekt liegt schon auf `angebotspotenzial`. Seit Fix 0.1 ist die Zonenreserve mit 0.188 pro Stufe der stärkste Einzelhebel; die Richtung stimmt, die Stärke ist ein Artefakt.
2. Förderfonds, Mindestanteil, Baurecht wirken je als Angebot und als Nachfragedämpfung. Auf einen Kanal reduzieren.
3. Mietpreisdeckel im Diagramm: die Menge sinkt entlang der Kurve, und die Mietrechts-Kanten verschieben zusätzlich die Kurve. Einen der beiden Wege wählen.
4. `knappheitSignal` macht bei mehr Nachfrage auch die Angebotskurve steiler. Aus der Steigung herausnehmen.
5. Angebotskurve um das Baseline-Gleichgewicht drehen statt um q=0, damit mehr Regulierung nur die Elastizität ändert.

**Umgesetzt (2026-11-15):**
1. `raumplanung_zonenreserve → nachfragedruck` gestrichen.
2. Kanal gewählt: **Angebot**. Gestrichen sind `gemeinnuetzig_mindestanteil`, `gemeinnuetzig_foerderfonds`, `gemeinnuetzig_baurecht → nachfragedruck`. Begründung: AT-002 beschreibt die Wirkung als preisgünstiges Angebot, das die Marktmiete dämpft; für eine eigene Nachfragedämpfung fand sich in der Sammlung keine Quelle. Die Wirkung auf die Marktmiete läuft neu über `gemeinnuetzig_kraft` im Neumieter-Trend (Fix-11). `foerderfonds → angebotspotenzial` auf 0.35 gesenkt (Setzung).
3. Weg gewählt: **Kurvenverschiebung**. `mietpreisdeckel()` setzt `qAngebot` auf die Gleichgewichtsmenge; die Mengenwirkung der Mietregulierung kommt nur aus den Mietrechts-Kanten auf `angebotspotenzial`. Begründung: diese Kanten sind mit GLOBAL-029 belegt und phasenweise kalibriert, der Weg entlang der Kurve hätte dieselbe Wirkung ein zweites Mal gezählt.
4. `KNAPPHEIT_REGULATION_FAKTOR` entfernt; `regulationEffective()` klemmt nur noch. `knappheitSignal()` bleibt als Kennzahl, wird in der App aber nicht mehr verwendet.
5. Angebotskurve dreht um den neutralen Punkt (`PIVOT_Q = 5`, `PIVOT_P = 5`); mehr Regulierung ändert nur die Steigung, das neutrale Gleichgewicht bleibt.

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

**Umgesetzt (2026-11-15):**
- Der Vorwärtsrechner von `calibrate.ts` ist jetzt die Engine selbst (`computePhasePipeline` mit eigenen Kanten, inkl. Regime). `writeWeights` ersetzt die Gewichte an Ort und Stelle (der alte Pfad warf einen ReferenceError). Annahme-Kanten bleiben im Optimierer neutral.
- Skalenrichtung der Basis-Constraints geprüft (Kommentar über `BASE_CONSTRAINTS`). Zwei Constraints folgen den gestrichenen Kanten aus Fix-12: `boden-ch007-nachfrage-p2` heisst neu `boden-ch007-angebot-p2` (Angebot steigt), `steuer-at002-nachfrage-p0` heisst neu `steuer-at002-neumieter-p0` (Neumieter-Trend sinkt).
- Neue Relationen `abs_gt`, `near`, `delta_lt_phase` und Felder `group.<id>`, `belastung.miete`. Elf Rangfolge-Constraints (sechs Angebot gegen Förderfonds/ÖV, CH-003, drei Mietregulierung, US-007 mit `KEIN_MESSBARER_EFFEKT = 0.02`), über zehn Städte expandiert. Dieselben Rangfolgen als `rangfolge-fachlich.test.ts`.
- Dry-Run: **0/567 Verletzungen**.

**Offen:** der Optimierer wurde nicht laufen gelassen. Die Gewichte sind von Hand gesetzt (Fix-10 bis Fix-12) und erfüllen alle Constraints; ein Optimierer-Lauf würde sie ohne neuen fachlichen Grund verschieben.

**Sensitivität neu (Zürich, 1 Stufe, P3, nach Sprint 3):**

| Hebel (Stufe) | Δ Neumieter P3 | Δ Bestand P3 | Δ Mietbelastung (pp) | Δ Neumieter P1 |
|---|---|---|---|---|
| Einsprache suspensiv (2→1) | −0.142 | −0.047 | −0.71 | −0.058 |
| Zonenreserve (2→1) | −0.139 | −0.046 | −0.70 | −0.009 |
| Kostenmiete (1→2) | +0.128 | +0.007 | +0.67 | +0.023 |
| Abbruchverbot (2→1) | −0.128 | −0.043 | −0.64 | −0.052 |
| Verdichtung (2→1) | +0.127 | +0.042 | +0.63 | 0.000 |
| Ausnützungsziffer (2→1) | +0.125 | +0.042 | +0.63 | +0.009 |
| Förderfonds (2→1) | +0.108 | +0.024 | +0.37 | +0.044 |
| ÖV-Ausbau (2→1) | −0.105 | −0.035 | −0.70 | −0.043 |
| Kündigungsschutz (2→1) | −0.086 | +0.024 | −0.23 | −0.012 |
| Hypothekarregulierung (1→2) | −0.049 | −0.016 | −0.33 | −0.077 |
| Leerstandsabgabe (0→1) | −0.026 | −0.009 | −0.13 | −0.004 |
| Bodeneigentumssteuer (0→1) | −0.021 | −0.007 | −0.11 | −0.009 |
| Kurzzeitvermietung (1→2) | −0.021 | −0.007 | −0.11 | −0.009 |
| Anfechtung Anfangsmiete (1→2) | +0.003 | −0.017 | −0.18 | +0.001 |
| Mietzinstransparenz (1→2) | +0.002 | −0.013 | +0.08 | +0.001 |

Vor Sprint 3 (Abschnitt 1): Förderfonds 0.186, ÖV 0.152, Kostenmiete 0.130, Ausnützung 0.115, Verdichtung 0.104, Anfangsmiete 0.028 (1.75 pp). Jetzt liegen die drei Angebotshebel vor Förderfonds und ÖV, und die Anfechtung der Anfangsmiete ist praktisch wirkungslos (CH-003).

Ohne Wirkung auf Gruppen und Mietbelastung bleiben `boden_mehrwertabgabe`, `mietrecht_mietzinsindex`, `mietrecht_untervermietung`, `mietrecht_kriterium`, `mietrecht_durchsetzung` (nur mit Senkungsanspruch) und `kapital_institutionelle_regulierung`. Die drei Steuern auf Gewinne und Handänderung bewegen nur die Mietbelastung (über `marktfriktion`).

**Befunde für Fix-14** *(überholt: Punkte 1 und 2 mit Fix-14 behoben, Punkt 3 in Sprint 4, Punkt 4 mit der Regel für Angebotshebel vom 2026-11-15)*:
- Kostenmiete hebt die Mietbelastung (+0.67 pp). Ursache liegt in den Sensitivitäten von `belastung.ts`; im Detail nicht untersucht.
- Gemeinnützige Instrumente (Baurecht, Belegung, Sozialmischung, Vorkaufsrecht über `gemeinnuetzig_kraft`) bewegen den Neumieter-Trend, aber nicht mehr die Mietbelastung, weil ihre Nachfrage-Kanten gestrichen sind.
- Das Vorzeichen von `gemeinnuetzig_kraft` in `fiskalische_wirkung` ist nicht entschieden.
- Einsprache suspensiv ist jetzt so stark wie die Zonenreserve; das Gewicht ist eine übernommene Setzung ohne eigene Quelle.

#### Fix-14: Gruppenmodell — ✅ umgesetzt (2026-11-15)
**Dateien:** `src/model/groups.ts`, `src/model/belastung.ts`
**Aufwand:** 0.5 Tag
1. Geringverdiener haben keinen Verdrängungsterm, obwohl CH-008 sie als verletzlichste Gruppe nennt.
2. Eigentümer mit Hypothek: höhere Zinsen wirken nur indirekt über Nachfrage und Investition und heben sich fast auf. Direkten Zinskanal ergänzen.
3. Mietbelastung: Basis 44.8 % für alle Städte. `mietbelastungs_grenze` als stadtspezifische Basis verwenden oder das Kontextfeld entfernen.

**Umgesetzt (2026-11-15):**
1. **Geringverdiener:** Term `+0.2 · verdraengungsrisiko` (`VERDRAENGUNG_GERINGVERDIENER` in `groups.ts`). Quelle CH-008; Grösse Setzung, gleich wie bei den Rentnern, weil CH-008 beide Gruppen ohne Rangfolge nennt.
2. **Zinskanal Eigentümer:** Term `+0.3 · referenzzins_aenderung/2` (`ZINSKANAL_EIGENTUEMER`). Antrieb ist die **Änderung** des Referenzzinssatzes, nicht `zinsniveau`: der Referenzzinssatz ist der Durchschnittszins der ausstehenden Hypotheken, seine Änderung also die Änderung der Zinskosten; ein tiefes, unverändertes Niveau ist kein laufender Kostentreiber und wirkt schon über die `ctx:zinsniveau`-Kanten auf Nachfrage und Investition. Grösse Setzung (eine Stufe = Anzeigeschwelle 0.15). `computeGroupTrends(state, context, drivers?)` verlangt den Kontext jetzt als Pflichtargument (`GroupContext = Pick<CityContext, 'referenzzins_aenderung'>`); angepasst sind `WidgetGrid.tsx`, `group-drivers.ts`, `scripts/calibrate.ts` (`getField` mit Constraint-Kontext) und alle Tests. Heute ist der Satz in allen Städten unverändert (0), der Kanal ändert die Baseline also nicht.
3. **Mietbelastung:** Feld entfernt. Die Stufen 1/2 waren nicht gemessen (per Skript nach «hoher Belastung» gesetzt), Sotomo 2025 deckt nur den Kanton Zürich ab, und die Stufen-Labels in `contextMeta` (<15 % … >30 %) widersprechen dem Wohnmonitor-Niveau 44.8 %. Aus `switzerland.yaml`, `cities.ts` (`npm run build:data`), `dag-topology.ts`, `calibrate.ts`, neun Test-Fixtures und der Architektur-README entfernt. In `types.ts` blieb das Feld zunächst optional und `@deprecated`; inzwischen ganz entfernt.
4. **Befund Kostenmiete (+0.67 pp):** Ursache war der Term `+3 pp · marktfriktion` (Beitrag +0.41 pp in P3), dazu +0.61 pp aus dem kleineren Angebot und −0.36 pp aus dem Schutz. Die Kennzahl ist ein Querschnitt aller einkommensschwachen Mieterhaushalte, also überwiegend Bestand. Für den Bestand ist das Vorzeichen der Marktfriktion offen (weniger Wechsel heisst auch weniger Abschlüsse zu Marktmieten), und der Term hatte keine Quelle: entfernt, als Fehler gewertet. Der Rest ist vertretbar: Kostenmiete entlastet in P1 (−0.27 pp), das kleinere Angebot (GLOBAL-029) holt die Entlastung bis P3 ein (+0.25 pp).
5. **Gemeinnützige Kraft in der Mietbelastung:** Term `−2 pp · gemeinnuetzig_kraft`, Richtung AT-002, Grösse Setzung (Überschlag im JSDoc). Baurecht senkt die Mietbelastung wieder (−0.32 pp in P3), Förderfonds stärker als vorher.
6. **Zitate:** `protectionEffect` (0.4, Setzung; Sotomo 2025 S. 27: Bestand rund 9 % unter Miete nach Wechsel, Genf 33.5 % nach DIW DP 2143), `MIETBELASTUNG_SENSITIVITY` (Setzungen, Sotomo liefert nur ein Niveau), `WOHNMONITOR_BASELINE` (Ausgabe 2026/1; 44.8 % nur für Haushalte über 20'000 CHF Äquivalenzeinkommen pro Person).
7. **Tests:** neu `gruppenmodell-fachlich.test.ts` (Verdrängung, Zinskanal, Basis, Kostenmiete-Verlauf, Förderfonds/Baurecht, je über alle Städte). In `belastung.test.ts` ist «increases monotonically with marktfriktion» ersetzt durch «marktfriktion bewegt die Mietbelastung nicht»; neu «decreases monotonically with gemeinnuetzig_kraft». Kalibrierung 0/567.

**Mietbelastung neu (Zürich, 1 Stufe, Δ in pp):**

| Hebel (Stufe) | P1 | P3 | P3 vorher |
|---|---|---|---|
| Kostenmiete (1→2) | −0.27 | +0.25 | +0.67 |
| Förderfonds (2→1) | +0.26 | +0.64 | +0.37 |
| Baurecht (1→2) | −0.13 | −0.32 | 0.00 |
| Mindestanteil (2→1) | −0.08 | −0.20 | −0.53 |
| Kündigungsschutz (2→1) | +0.17 | +0.14 | −0.23 |
| Mietzinstransparenz (1→2) | −0.05 | −0.13 | +0.08 |
| Anfechtung Anfangsmiete (1→2) | −0.06 | −0.18 | −0.18 |
| Zonenreserve (2→1) | −0.04 | −0.70 | −0.70 |

Baseline Zürich: Mietbelastung 46.6 / 47.8 / 48.3 % → 46.8 / 48.2 / 48.8 % (P1–P3; Verschiebung aus dem gestrichenen Friktionsterm, Marktfriktion steht in Zürich bei −0.17). Geringverdiener-Trend 0.10 / 0.18 / 0.21 → 0.15 / 0.27 / 0.34; übrige Gruppen unverändert.

**Offen:**
- ✅ Restbereinigung `mietbelastungs_grenze` erledigt (2026-11-15): Eintrag in `contextMeta`, Test-Fixtures und Typfeld entfernt; AGENTS.md nennt 7 Kontextfaktoren.
- *(Überholt: gelöst über die Regel für Angebotshebel und den Schieber «Ausgleich beim Pflichtanteil».)* Mindestanteil-Senkung entlastet weiterhin (−0.20 pp), weil `gemeinnuetzig_mindestanteil → angebotspotenzial` negativ ist; im Gruppenmodell nicht lösbar.
- Die drei Steuern auf Gewinne und Handänderung bewegen die Mietbelastung nicht mehr (nur noch `marktfriktion`, im Widget sichtbar).
- *(Überholt: Term in Sprint 4 ergänzt.)* Geringverdiener haben keinen Term für `gemeinnuetzig_kraft`, obwohl die Gruppenbeschreibung «stark geförderte Wohnungen» nennt.
- Der Zinskanal ist im UI nicht bedienbar (Kontext nicht editierbar) und wirkt erst, wenn der Referenzzinssatz in den Daten ändert.
- Alle neuen Grössen (0.2, 0.3, 2 pp) sind Setzungen.

---

## 6. Sprint 4 — Daten, Regime-Einheiten, Restposten — ✅ teilweise (2026-11-15)

**Stand 2026-11-16.** Umgesetzt mit drei parallelen Arbeitspaketen und zwei Nachträgen; die Kalibrierung der Regime-Gewichte bleibt offen, weil die Mietlücke leer bleibt.

#### Daten
- ✅ `anteil_altliegenschaft` für alle zehn Städte gesetzt (0.71 Winterthur bis 0.90 Basel und Bern). Quelle: BFS GWS, `DF_GWS_REG5`, Bestand 31.12.2025, Bauperiode bis 1995, Wohnungen in Wohngebäuden ohne Einfamilienhäuser. Messvorschrift im Kopf von `switzerland.yaml`. Abweichung von CH-012: nicht nur Mietwohnungen (die GWS kennt keine Bewohnerart); der Wert liegt deshalb eher zu tief. Solange `WIRKSAMKEIT_OQU = 0`, ändert der Wert kein Rechenergebnis (Test `anteil-altliegenschaft.test.ts`).
- ⏳ `mietluecke` **nicht gesetzt.** Eine Datenbasis mit Anlagekosten gibt es weiterhin nicht. Verfügbar ist nur der Abstand langer Mietverhältnisse zum Neubezug einer älteren Wohnung (BFS-Strukturerhebung 2024, T 09.03.03.64, nach Kanton: ZH 0.23, GE 0.28, VD 0.26, LU 0.17, BE 0.16, BS 0.16, SG 0.15, TI 0.13; Mietpreiserhebung Stadt Zürich 2026, nicht gemeinnützig: 0.38). Der Proxy misst nicht den Abstand zum zulässigen Ertrag, und seine Skala passt nicht zur neuen Regime-Einheit (36 % wären 4.8). Entschieden am 2026-11-15: Feld leer lassen, Abstand als Indikator anzeigen (Nachtrag unten).
- ⏳ `FRONTLOAD`, `VERWEIL_GEWICHT`, `CAP_INVEST_WEIGHT` bleiben unkalibriert, solange die Mietlücke fehlt.

#### Regime: Einheit des Erhöhungsspielraums
- ✅ Eine Einheit für alle Index-Regimes: zulässige Mietzinsänderung in Prozent, geteilt durch `ERHOEHUNG_REFERENZ_PROZENT` (7.5, Setzung). Ein Schritt des Referenzzinssatzes von 0.25 Punkten zählt +3 % bzw. −2.91 % (Art. 13 VMWG), Teuerung im Referenzzins-Regime zu 40 % (Art. 16 VMWG), im LIK-Regime zu 85 %. Die Verhältnisse folgen aus dem Recht.
- ✅ Art. 16 VMWG steht weiter bei 40 % (Fassung 1.10.2025). Der Entwurf von 2024 mit 28 % wurde nicht übernommen (Medienmitteilung des Bundesrats vom 21.3.2025).
- Folge: Die «Heutige Situation» steht im Regime-Widget nicht mehr auf null (Zürich: Erhöhungsspielraum +0.01, Bestandsmiete +0.01 in P3). LIK-Regime: Spielraum 0.03 statt 0.07.
- Offen: `pullBestand` behandelt jede positive Bestandsmiete als Überhöhung, auch die zulässige Überwälzung. Die Vorladung wirkt bei gleichem `FRONTLOAD` nur noch 0.4-mal so stark. Ob ein Rückgang des LIK im Referenzzins-Regime einen Senkungsanteil gibt, ist nicht entschieden (Art. 16 spricht von «Steigerung»).

#### Restposten des Modells
- ✅ DAG-Ansicht: Zeitklasse aus dem Stand abgeleitet (`sofort` / `aufbauend` / `verzögert` / `Annahme` / `gemischt`), Handliste entfernt, Legende nachgeführt. 71 von 100 Kanten sind Annahmen ohne Verlaufsevidenz.
- ✅ `fiskalische_wirkung`: `gemeinnuetzig_kraft` geht mit −1 ein (Förderfonds, Baurecht, Vorkaufsrecht kosten). Widget-Texte zeigen nur noch die Tendenz und die vier Bestandteile.
- ✅ `nutzung_kurzzeitvermietung → verdraengungsrisiko`: 0.79 → 0.2 (US-013, US-014, ES-002: keine messbare Wirkung der Regulierung auf Mieten und Leerstand).
- ✅ Geringverdiener: Term `−0.25 · gemeinnuetzig_kraft` (AT-001, AT-002; Grösse Setzung).
- ✅ Drei umstrittene Kanten (Zweitwohnungen → Angebot, Untervermietung → Verdrängung, Transparenz → Friktion): Vorzeichen unverändert, als Annahme gekennzeichnet; Zweitwohnungen und Untervermietung tragen «Wirkung nicht belegt».
- ✅ *(Entschieden und umgesetzt, siehe Nachtrag unten.)* **Stärke unbelegter Angebotshebel.** Suspensive Einsprache (P3-Stand 1.66), Abbruchverbot (1.49), Umnutzungsverbot (1.42), Sanierungspflicht (1.37) und Bauverpflichtung (1.27) wirken auf das Angebot etwa so stark wie die belegten Hebel Zonenreserve (1.62), Verdichtung (1.48) und Ausnützung (1.46). Ursache: Fix-10 hat den P3-Stand der alten Vektoren übernommen. Es braucht eine Regel für das Verhältnis von Annahme-Kanten zu belegten Hebeln.
- ✅ *(Entschieden und umgesetzt, siehe Nachtrag unten.)* **Mindestanteil.** Eine Senkung entlastet Neumieter (−0.064 in P3) und Mietbelastung (−0.20 pp), weil die Angebotskante (0.51) die Preisdämpfung über die gemeinnützige Kraft überwiegt. US-018 stützt die Richtung nur ohne Ausgleich (Dichtebonus); welches Verhältnis gilt, sagt keine Studie.
- ⏳ `marketModulator`: keine Notiz stützt die Grösse; AU-004 und GLOBAL-025 stützen die Richtung nur für die Angebotsseite. Unverändert.
- ⏳ Optimierer-Lauf weiterhin nicht gemacht (Gewichte erfüllen alle Constraints).
- Kleinere Reste: `US-018` trägt im Kopf die ID `GLOBAL-027`; veraltete Kommentare in `gemeinnuetzig-fachlich.test.ts`; Fussnoten in CH-012 springen von [24] auf [30] und [40].

#### Nachtrag 2026-11-15 und 2026-11-16: Entscheide des Projektinhabers umgesetzt
- ✅ **Mietabstand anzeigen, nicht rechnen.** `mietabstand_neubezug` (Nettomiete Neubezug / Nettomiete bei 21 und mehr Jahren Mietdauer, BFS Strukturerhebung 2024) steht im Stadt-Kontext und erscheint in der Kontextleiste als «Neubezug ggü. Altmiete». Stadtwerte (T 09.03.03.67): Zürich +56 %, Lausanne +54 %, Genf +48 %, Basel +38 %, Bern +38 %. Kantonswerte (T 09.03.03.64, andere Abgrenzung): Winterthur +30 %, Luzern +21 %, Biel +19 %, St. Gallen +18 %, Lugano +16 %. `mietluecke` bleibt leer; Test `mietabstand-neubezug.test.ts` hält fest, dass der Indikator nichts rechnet.
- ✅ **Regel für unbelegte Angebotshebel.** Eine Annahme-Kante auf `angebotspotenzial` darf in P3 höchstens halb so stark sein wie der schwächste Referenzhebel (`REFERENZ_ANGEBOTSHEBEL`, `ANNAHME_ANGEBOT_MAX_ANTEIL = 0.5` in phase-weights.ts; Test in `dag-integrity.test.ts`). 13 Kanten mit demselben Faktor (0.3 / 0.68) gesenkt: suspensive Einsprache 0.68 → 0.30, Abbruchverbot 0.61 → 0.27, Umnutzungsverbot 0.58 → 0.26, Sanierungspflicht 0.56 → 0.25, Zweitwohnungen 0.53 → 0.23, Bauverpflichtung, Ersatzneubau, Einsprache Dritter 0.52 → 0.23, Mindestanteil 0.51 → 0.23, Normenharmonisierung 0.49 → 0.22, Bewilligungsverfahren 0.42 → 0.19, Energievorgaben 0.41 → 0.18, Förderfonds 0.35 → 0.15. Die Reihenfolge unter ihnen bleibt eine Setzung. Kalibrierung weiterhin 0/567.
  - Zürich, Δ Neumieter P3 je Stufe: Zonenreserve −0.139, Kostenmiete +0.128, Verdichtung +0.127, Ausnützung +0.125 (unverändert); suspensive Einsprache −0.063 (vorher −0.142), Abbruchverbot −0.056 (vorher −0.128), Förderfonds 2→1 +0.066 (vorher +0.108).
  - Nebenwirkung: Der Mindestanteil ist auf den Neumieter-Trend fast neutral (2→1: −0.006 statt −0.064), auf die Mietbelastung dreht das Vorzeichen (+0.10 pp statt −0.20 pp).
- ✅ **Mindestanteil: Bedingung als Schieber (2026-11-16).** Neuer Parameter `gemeinnuetzig_ausgleich` («Ausgleich beim Pflichtanteil»: kein / teilweise / voll), der 44. Schieber. Er hat keine eigene Kante, sondern schaltet `gemeinnuetzig_mindestanteil → angebotspotenzial`: gerechnet wird Δ[Mindestanteil · (1 − Ausgleich)] (`ausgleichDurch`, `getEdgeDelta` in compute-phases.ts). Voller Ausgleich hebt den Angebotsverlust auf, teilweiser zur Hälfte (Setzung). Weil das ein Produkt ist, braucht die Rechnung die absoluten Stufen; `computeDiff40` trägt sie als Begleiteinträge ein (`DIFF_BEGLEITER`), `changedParamKeys` zählt nur echte Änderungen. Tests: `ausgleich-pflichtanteil.test.ts`.
  - ✅ Stand je Stadt erhoben (2026-11-16, Recherche im kantonalen und kommunalen Recht): Zürich, Genf, Bern, Winterthur Stufe 2 (Pflichtanteil greift nur bei Mehrausnützung: § 49b PBG ZH, Art. 4A LGZD, Art. 16b Bauordnung Bern); Basel und Luzern Stufe 1 (halbe Mehrwertabgabe bzw. 5 % Bonus); Lausanne, St. Gallen, Lugano, Biel 0 = nicht geklärt. Keine Einstufung hat Sicherheit «hoch». Begründung je Stadt im YAML.
  - Folge: In den vier Städten mit Stufe 2 ändert der Mindestanteil das Angebot nicht mehr; nur seine übrigen Wirkungen bleiben.
  - ⏳ **Befund, nicht behoben: `gemeinnuetzig_mindestanteil` passt in mehreren Städten nicht zum Rechtsstand.** Zürich (2) und Biel (2): kein genereller Anteil in Kraft. Genf (1): gesetzlich ein Drittel, aber nur in Entwicklungszonen. Basel (1): ein Drittel, aber nur auf Transformationsarealen über 15'000 m². Lausanne und Winterthur (1): kein Erlass mit 10 %. Bern (2) passt in der Höhe, gilt aber nur bei Zonenänderung. Der Parameter «Anteil an Neubauten» bildet Pflichten, die nur für Teilflächen gelten, nicht ab. Entscheid offen.
  - Zürich nach der Erhebung (Ausgleich Stufe 2, Mindestanteil Stufe 2), P3: Mindestanteil 2→1 ändert das Angebot nicht und hebt den Neumieter-Trend um 0.042 (weniger Preisdämpfung); Ausgleich 2→1 senkt das Angebot um 0.040 und hebt den Neumieter-Trend um 0.048.

#### Ursprüngliche Liste

- `mietluecke` und `anteil_altliegenschaft` gemäss Messvorschrift in CH-012 füllen. Erst dann `FRONTLOAD`, `VERWEIL_GEWICHT`, `CAP_INVEST_WEIGHT` kalibrieren.
- Zitierte Zahlen in JSDoc-Kommentaren (z. B. «Sotomo: ~40 % weniger Miete») gegen die Originalquellen prüfen. — ✅ erledigt (2026-11-15), nur Kommentare und Hilfetexte; kein Gewicht, keine Konstante geändert. Korrekturen:
  - `marketModulator` (compute-phases.ts): Zuschreibung an Sotomo und «~3× stärker» gestrichen. 0.3 pro Stufe ist eine Setzung, Richtung nach CH-007; die Formel ergibt 0.4× bis 1.6× (Faktor 4).
  - `MIETPREISDECKEL_FAKTOR` (supply-demand.ts): «Sotomo: 18–30 % unter Marktmiete» ersetzt durch Genf 279 gegen 372 CHF/m²·a (DIW DP 2143, CH-005); Grösse Setzung.
  - `mietrecht_kostenmiete → marktfriktion`: 13.7 Jahre Genf gegen rund 8.5 Jahre CH-Schnitt (statt ~6); Agglomeration Zürich rund 9 % (Sotomo S. 27) statt ~18 %.
  - `nutzung_abbruchverbot` (→ angebotspotenzial, → investitionsattraktivitaet, → angebotspotenzial_regulation) und zwei Fachtest-Kommentare: Quelle DIW DP 2143 (nur Genf); Basel −76 % Baugesuche mit Herkunft (SRES/SVIT, Ursache offen); «−95 % (1078 → 67)» gestrichen, keine Quelle gefunden.
  - Kurzzeitvermietung: Barcelona (ES-001) als Effekt der Airbnb-Aktivität, nicht der Regulierung; NYC LL18 ergänzt um «Leerstand und Mieten ohne messbare Änderung» (US-013).
  - Leerstandsabgabe: 20'000 Condos der provinziellen SVT zugeordnet (CA-002), nicht der EHT (rund 2'900 Wohnungen, CA-001/CA-003).
  - Ersatzneubau (phase-weights.ts, helpText): «Agglomeration Zürich 2.8×, Agglomeration Lausanne 6.5×».
  - `gemeinnuetzig_mindestanteil`, Stufe 2: «33% (Stadtratsziel)» → «33% (hoher Pflichtanteil)». Das Zürcher Drittelsziel ist ein Volksentscheid (2011) für einen Drittel aller Mietwohnungen bis 2050, kein Neubau-Anteil.
  - Offen: Verweise auf DIW DP 2143, Wüest Partner 2024 (8.5 Jahre) und Sotomo 2025 (S. 27, Abb. 9) fehlen in den Notizen `docs/recherche/` (CH-005 nennt nur 279/372 und 13.7 Jahre); Basel-Herkunft (SRES/SVIT) ohne Notiz; «Zürich +20 % Baugesuche» (wohnschutz-fachlich.test.ts) und EHT-Steuersätze (gemeinnuetzig-fachlich.test.ts) nicht nachgeprüft; gleiche Altzahlen in `src/types.ts` und `scripts/add-new-params.js` (2.8x), «FHNW» in `scripts/calibrate.ts`.

---

## 7. Reihenfolge und Aufwand

| Sprint | Inhalt | Aufwand | Abhängigkeit |
|---|---|---|---|
| 0 | Vorzeichen, Regime | erledigt | — |
| 1 | Fix-1 bis Fix-4 | erledigt | — |
| 2 | Fix-5 bis Fix-7 (Fix-8 erledigt) | erledigt | — |
| 3 | Fix-9 bis Fix-14 | erledigt | — |
| 4 | Daten, Regime-Einheiten, Restposten, Nachträge | erledigt bis auf die Regime-Kalibrierung | Mietlücke (bleibt leer) |

Sprint 3 und 4 haben alle Zahlen im UI verändert. Der Branch sollte als ein Release mit Hinweis ausgeliefert werden.

## 8. Test-Plan

- Nach jedem Fix: `npx vitest run`, `npx tsc -b`, `npm run lint`, `npm run build`, `npx tsx scripts/calibrate.ts --dry-run`.
- ✅ `schieber-wirkung.test.ts`: jeder Parameter bewegt eine angezeigte Grösse (fängt tote Schieber). Nicht umgesetzt: eine feste Sensitivitätstabelle mit Vorzeichen-Erwartung pro sichtbarem Ausgang; die Richtungen sichern stattdessen `group-drivers.test.ts` und die Fachtests.
- ✅ Rangfolge-Constraints aus Fix-13 als `rangfolge-fachlich.test.ts`, Verläufe als `verlauf-fachlich.test.ts`.

## 9. Entscheide

Chronologisch, Stand 2026-11-16:

1. **Normalisierung (Fix-9):** ✅ gemeinsamer Nenner.
2. **Zeitprofil (Fix-10):** ✅ Generator bleibt (2026-11-14). Stand der Phase = Resultat der Vorphase plus Vektor dieser Phase; das Gewicht ist der Impuls, nicht das Niveau. Die Fassung vom 2026-11-13 («Niveau pro Phase, Übertrag streichen») ist verworfen.
3. **Regime-Schieber (Fix-5):** ✅ eigenes provisorisches Widget.
4. **Ungenutzt:** zwei getrennte Dinge.
   - Schieber ohne Wirkung: ✅ auskommentieren, bis sie angebunden sind (Fix-5). Am Ende musste keiner ausgeblendet werden: Jeder bewegt eine angezeigte Grösse.
   - Fünf nicht eingebundene Widget-Komponenten (Fix-8): ✅ eingebaut.
5. **Parameter ohne Evidenz**: ✅ im UI kennzeichnen (Fix-11). Heute vier: Vorkaufsrecht, Bauverpflichtung, Zweitwohnungen, Untervermietung.

6. **Phasenmultiplikator (Fix-10):** ✅ streichen (2026-11-14), zusammen mit Fix-9.

7. **Mietlücke (2026-11-15):** ✅ leer lassen; der Mietdauer-Abstand wird als Indikator im UI angezeigt.
8. **Unbelegte Angebotshebel (2026-11-15):** ✅ höchstens halb so stark wie der schwächste belegte Hebel.

9. **Mindestanteil (2026-11-16):** ✅ neuer Schieber «Ausgleich beim Pflichtanteil», der die Angebotskante schaltet.

10. **Mindestanteil und Rechtsstand (2026-11-16):** vorerst so lassen. Die Frage bleibt offen (Abschnitt 0.3 Punkt 1).
