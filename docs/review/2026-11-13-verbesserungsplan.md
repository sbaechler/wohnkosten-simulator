# Verbesserungsplan nach fachlichem Review (2026-11-13)

> **Status:** Entscheide 1, 2, 3 und 5 gefällt (2026-11-13, siehe Abschnitt 9); alle fünf Entscheide gefällt. Sprint 0 und Fix-8 (Widgets) sind umgesetzt (uncommittet auf `feat/mietrecht-regime-2026`), alles andere offen.
> **Grundlage:** Fachliches Review vom 2026-11-13: Code in `src/model`, gerenderte Widgets, `docs/recherche/summary.md`, CH-012, Nachrechnung aller 43 Parameter für Zürich (je ±1 Stufe, Wirkung in P3).
> **Teststand:** 220 passed, 1 skipped. Kalibrierungs-Dry-Run 0/446 Verletzungen. `tsc -b` meldet 10 Typfehler, alle in Testdateien (Fixtures ohne die neuen Regime-Felder von `MarketState`, dazu `international-fachlich.test.ts:236`); damit läuft `npm run build` nicht durch. Die Fehler stammen aus den Regime-Änderungen des Branches, nicht aus den Fixes dieses Plans.

## 1. Ausgangslage

Die Engine rechnet technisch sauber. Fachlich gab es drei Klassen von Problemen:

| Klasse | Befund | Status |
|---|---|---|
| Vorzeichen | `raumplanung_zonenreserve → nachfragedruck` und `bau_bewilligungsverfahren → angebotspotenzial_regulation` lasen die Parameterskala verkehrt herum | ✅ behoben |
| Regime | Referenzzins-Regime las das Zinsniveau statt der Zinsänderung | ✅ behoben |
| Struktur | Normalisierung pro Knoten verzerrt die Rangfolge der Hebel; Zeitprofile der Kanten gehen verloren; mehrere Schieber und Evidenzpfade laufen ins Leere | offen |

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

## 3. Sprint 1 — Korrektheit ohne Modellumbau

Kleine, voneinander unabhängige Fixes. Keine Neukalibrierung nötig.

#### Fix-1: Skalenrichtung aller Kanten absichern
**Dateien:** `src/model/params.ts`, `src/model/__tests__/functional/dag-integrity.test.ts`, `docs/architektur/01-graph-kanten.md`
**Aufwand:** 2–3 h
1. Pro Parameter die Skalenrichtung in `paramMeta40` festhalten (z. B. `richtung: 'restriktiver' | 'permissiver' | 'mehr_foerderung'`), damit «Stufe 2» nicht mehr aus dem Label erraten werden muss.
2. Alle 100 Kanten einmal gegen diese Richtung durchgehen. Im Review fielen nur die zwei behobenen auf; das war eine Lektüre, kein systematischer Abgleich.
3. `01-graph-kanten.md` aus `PHASE_WEIGHTED_EDGES` generieren. Die Datei ist veraltet (nennt z. B. `bau_bewilligungsverfahren → marktfriktion`, die es nicht gibt).

#### Fix-2: Regime-Restfehler
**Datei:** `src/model/mietrecht-regime.ts`
**Aufwand:** 1 h
1. `investDelta` wird in `carryE1` geschrieben und jede Phase neu addiert (Faktor 1 / 1.8 / 2.44). Abzug getrennt vom Übertrag führen. Heute inaktiv, weil keine Mietlücke gesetzt ist.
2. `angebotDelta = investDelta * 0.5`: benannte Konstante mit JSDoc (Konvention AGENTS.md).
3. Vorladung bei negativer Verweildauer auf 0 begrenzen (sonst senkt gesperrte Teuerung die Anfangsmiete).
4. Vorladung vergleicht Teuerungs-Bin mit Zinsänderungs-Bin. Einheit klären oder im Referenzzins-Regime abschalten.

#### Fix-3: Städtedaten prüfen
**Datei:** `data/cities/switzerland.yaml`
**Aufwand:** 1–2 h (Recherche BFS STATPOP)
1. `bevoelkerungstrend: -1` bei 9 von 10 Städten, gleichzeitig Zuwanderung +1/+2. Gegen BFS-Bevölkerungsentwicklung prüfen.
2. Genf und Lausanne haben identische Kontexte und damit identische Baselines. Prüfen, ob das stimmt.
3. Quelle und Stichjahr pro Kontextwert in den YAML-Kommentar.

#### Fix-4: Doku und Beschriftung
**Aufwand:** 30 min
1. Parameterzahl: 43 (AGENTS.md sagt 40, `types.ts` 42).
2. `marketModulator`: Kommentar nennt ±30 %, gerechnet werden ±60 %.
3. `mietbelastungs_grenze`: Kommentar in `types.ts` sagt «steuert die Marktfriktion», es gibt keine Kante.
4. Widget «Mietbelastung» zeigt den Wert einkommensschwacher Haushalte (Basis 44.8 %, CH). So beschriften.
5. `docs/architektur/README.md`: zwei widersprüchliche Übertragsformeln; `PHASE_BASE_MULTIPLIER`, `marketModulator`, `E1_NORMALIZATION` fehlen; Vorzeichenkonvention «positiv = angebotsreduzierend» widerspricht `types.ts`; Zahlen veraltet (41 Parameter, 6 Kontextfaktoren, 8 Gruppen, 4 Kontextfaktoren am Schluss). Nach Fix-9/10 neu schreiben, nicht vorher.
6. `docs/architektur/01-graph-kanten.md`: nennt das gelöschte `graph.ts` als Quelle, rund 60 statt 100 Kanten, Gewichte weichen fast überall ab (z. B. Zonenreserve `[0, 0.5, 1]`, im Code `[0.8, 0.5, 0.3]`), E1→E2 mit Phasengewichten, die es nicht gibt. Generieren (Fix-1).
7. `docs/architektur/02-widget-katalog.md`: beschreibt `SupplyDemandChart` als zwei Trendlinien und 8 Gruppen.

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
**Dateien:** `src/model/compute-phases.ts`, `src/model/phase-weights.ts`
**Aufwand:** 1.5–2 Tage (vorher 0.5–1; die Profile müssen mit)

**Entschieden:** das Gewicht ist das Niveau des Effekts in der Phase. Entscheid am 2026-11-13 nochmals gegen Doku und Studien geprüft; er hält, hat aber eine Folge, die vorher fehlte.

*Was die Doku sagt.* `docs/architektur/README.md` und der Kopf von `phase-weights.ts` beschreiben das Gewicht als Wirkung **in** der Phase («0.0 = keine Wirkung in dieser Phase, 1.0 = volle Wirkung»). Das ist die Niveau-Lesart. Dieselbe README beschreibt den Übertrag auf zwei Arten, die sich widersprechen (`prev × 0.8 + newEffects` und «80 % beibehalten, 20 % überschrieben»), und erwähnt `PHASE_BASE_MULTIPLIER`, `marketModulator` und `E1_NORMALIZATION` gar nicht. Der Code rechnet eine dritte Variante: `prev × 0.8 + Effekt × Multiplikator`.

*Was der Code daraus macht.* Von 83 Politik-Kanten haben 33 ein fallendes Profil (`w1 > w3`) und 45 ein steigendes. Effektiv fällt keine einzige: das Verhältnis P1 zu P3 liegt für alle Kanten zwischen 0.00 und 0.47. Die Engine legt über jedes Profil dieselbe Rampe.

| Kante | Vektor | effektiv (P3 = 1) |
|---|---|---|
| `mietrecht_kuendigungsschutz → verdraengungsrisiko` | 1.0 / 0.9 / 0.7 | 0.27 / 0.65 / 1.00 |
| `mietrecht_anfangsmiete → mietpreis_schutzlevel` | 1.0 / 0.8 / 0.7 | 0.28 / 0.63 / 1.00 |
| `raumplanung_verdichtung → angebotspotenzial` | 0.0 / 0.6 / 1.0 | 0.00 / 0.31 / 1.00 |

*Was die Studien sagen.* Die Verläufe sind nicht einheitlich, eine Rampe für alles ist also falsch:
- Sofort: Berlin, regulierte Mieten sinken mechanisch mit Inkrafttreten, Inserate gehen im ersten Jahr zurück (DE-004). San Francisco, Schutz vor Verdrängung kurzfristig wirksam (US-001).
- Wachsend: Paris −2.5 % im ersten Jahr, −5.9 % im vierten, −8.2 % im fünften (FR-003). Auckland, Neubau reagiert nach 2–4 Jahren (NZ-001). Vancouver, erste Effekte nach 1–2 Jahren, deutlich nach 3–5 (CA-001).
- Kumulativ über Jahrzehnte: Angebotsverlust unter Mietregulierung (GLOBAL-029; US-001: −15 % Angebot, +7 % Marktmieten).

*Die Folge.* Mit der Niveau-Lesart trägt der Vektor das Zeitprofil allein. Dann müssen die Vektoren stimmen, und mehrere tun es nicht. `mietrecht_anfangsmiete → mietpreis_schutzlevel` fällt im Vektor (Begründung im Kommentar: Umgehung), Paris zeigt für genau diesen Mechanismus einen Anstieg auf mehr als das Dreifache. Heute verdeckt die Rampe der Engine den Widerspruch. Wird nur die Engine umgestellt, wird er sichtbar.

**Schritte:**
1. Engine: Politik-Anteil ohne Übertrag und ohne Phasenmultiplikator. Der Effekt in Phase p ist `Σ sign · w[p] · Δ / Nenner · marketModulator`.
2. Profil-Audit: jede der 83 Politik-Kanten bekommt eine Quelle für ihren Verlauf. Feld `profilQuelle` an der Kante (Studien-ID) oder ausdrücklich `'Annahme'`. Bestands- und Flussgrössen unterscheiden: Regeln (Schutzlevel, Steuern) gelten ab Inkrafttreten, Bestände (Angebot, gemeinnütziger Anteil, Eigentumsquote) bauen sich auf und brauchen ein steigendes Profil.
3. Kanten ohne Verlaufsevidenz bekommen ein flaches Profil statt eines erfundenen Verlaufs. Das folgt dem Grundsatz im Kopf von `phase-weights.ts` («Uncertainty → tend toward 0.0»), übertragen auf die Form.
4. Tests: für jede Kante mit `w1 > w3` ist der Effekt auf den Zielknoten in P1 grösser als in P3. Dazu je ein Verlaufstest pro Studie oben (Paris steigend, Berlin sofort, Auckland verzögert).
5. Grösse: ohne Übertrag sinkt P3 um etwa den Faktor 1.8 und P1 steigt um 2.5. Der gemeinsame Nenner aus Fix-9 wird deshalb zusammen mit Fix-10 gesetzt.
6. Kontext-Antrieb (offen, Empfehlung): ebenfalls als Niveau lesen. Sonst läuft die «Heutige Situation» weiter über eine Rampe, die Politik-Effekte aber nicht, und der Vergleich Heute/Simuliert verschiebt sich zwischen den Phasen ohne fachlichen Grund. Die Baseline aller Städte ändert sich dadurch; die Kontext-Vektoren fallen heute fast alle und haben keine Studienquelle.
7. Die Phasen sind 2, 3 und 5 Jahre lang. Mit Niveau-Gewichten ist das unproblematisch; in der Doku festhalten, dass ein Gewicht den Stand am Ende der Phase meint.

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
| 1 | Fix-1 bis Fix-4 | ca. 1 Tag | keine |
| 2 | Fix-5 bis Fix-7 (Fix-8 erledigt) | ca. 1 Tag | keine |
| 3 | Fix-9 bis Fix-14 | ca. 5–6 Tage | Fix-1 vorher |
| 4 | Regime-Kalibrierung | offen | Daten |

Sprint 1 und 2 können parallel laufen. Sprint 3 ändert alle Zahlen im UI und sollte als ein Release mit Hinweis ausgeliefert werden.

## 8. Test-Plan

- Nach jedem Fix: `npx vitest run`, `npx tsc --noEmit`, `npx tsx scripts/calibrate.ts --dry-run`.
- Neu als fester Test: Sensitivitätstabelle (jeder Parameter ±1 Stufe, Zürich) mit Vorzeichen-Erwartung pro sichtbarem Ausgang. Fängt verkehrte Skalen und tote Schieber.
- Nach Sprint 3: Rangfolge-Constraints aus Fix-13 zusätzlich als fachliche Tests.

## 9. Entscheide

Stand 2026-11-13:

1. **Normalisierung (Fix-9):** ✅ gemeinsamer Nenner.
2. **Zeitprofil (Fix-10):** ✅ Niveau pro Phase. Das war die ursprüngliche Absicht des Gewichtsvektors. Nachgeprüft gegen Doku und Studien: hält, verlangt aber ein Audit der 83 Profile gegen die Studien (in Fix-10 aufgenommen).
3. **Regime-Schieber (Fix-5):** ✅ eigenes provisorisches Widget.
4. **Ungenutzt:** zwei getrennte Dinge.
   - Schieber ohne Wirkung: ✅ auskommentieren, bis sie angebunden sind (Fix-5).
   - Fünf nicht eingebundene Widget-Komponenten (Fix-8): ✅ eingebaut.
5. **Parameter ohne Evidenz** (Vorkaufsrecht, Bauverpflichtung): ✅ im UI kennzeichnen (Fix-11).

Offen aus Entscheid 2: akkumuliert der Kontext-Antrieb weiter, oder wird auch er als Niveau gelesen (Fix-10, Schritt 6; Empfehlung: Niveau)?
