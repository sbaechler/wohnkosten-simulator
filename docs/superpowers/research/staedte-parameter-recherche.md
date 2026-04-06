# Städte-Parameter-Recherche

Erstellt: 2026-04-06
Methode: Internet-Recherche + Schätzungen wo keine Daten verfügbar
Rate-Limit: 1 Request/s (sequenzielle Suche)

---

## OpenData-Quellen & APIs

### Gefundene Datensätze (opendata.swiss)

| Dataset | URL | Inhalt |
|---------|-----|--------|
| Leerstehende Wohnungen (BFS) | https://opendata.swiss/en/dataset/leerstehende-wohnungen | Leerwohnungsziffern nach Kantonen, jährlich |
| Entwicklung der Mietpreise für Wohnungen | https://opendata.swiss/de/dataset/entwicklung-der-mietpreise-fur-wohnungen-jahresdurchschnitte3 | Jahresdurchschnitte Mietpreise |
| Bau- und Wohnungswesen (Städtestatistik) | https://opendata.swiss/de/dataset/bau-und-wohnungswesen | Leerwohnungen nach Zimmerzahl, städtisch |
| Mietpreise Stadt Zürich (MPE Tool) | https://opendata.swiss/en/dataset/mietpreise-in-der-stadt-zuerich-2022 | Mietpreisbandbreiten Zürich |
| STAT@Atlas / housing-stat.ch | https://www.housing-stat.ch | Räumliche Wohnungsmarktdaten |

### Weitere offene Datenquellen

| Quelle | URL | Bemerkung |
|--------|-----|-----------|
| BFS Leerwohnungen | https://www.bfs.admin.ch/bfs/de/home/statistiken/bau-wohnungswesen/wohnungen/leerwohnungen.html | Nationale Leerwohnungszählung (1. Juni) |
| LUSTAT Kanton Luzern | https://www.lustat.ch/monitoring/sozialindikatoren/wohnen/leerwohnungsziffer | Kantonale Daten inkl. Stadt Luzern |
| Stadt Zürich Leerwohnungen | https://www.stadt-zuerich.ch/de/aktuell/medienmitteilungen.html | Stadtdaten direkt |
| BWO Marktkennzahlen | https://www.bwo.admin.ch | Offizielle Bundesdaten (teilweise 404/umgezogen) |

### Hinweis zu APIs
- opendata.swiss bietet CKAN-API: `https://ckan.opendata.swiss/api/3/action/package_list`
- Stadt Zürich: Open Data Portal mit Mietpreisdaten und Geodaten
- Keine frei zugängliche nationale Mietpreise-API gefunden (SECO/DEMO-ELCOME-N数据 nicht öffentlich)

---

## Genf (Stadt) — Parameter

**Kanton:** Genf (GE)
**Bevölkerung Stadt:** ~205'000
**Kantonale Zuständigkeit:** Für die meisten Parameter ist der Kanton Genf zuständig (kein Stadt-Land-Gefälle wie in ZH/BE)

### Kontextfaktoren

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `zinsniveau` | –1 | SNB-Leitzins –0.25%, Referenzzinssatz 1.25% (März 2026) | SNB |
| `zuwanderungsdruck` | +2 | Tiefste Leerwohnungsziffer der Schweiz (0.34% 2025); starke internationale Zuwanderung durch IKRK, UNO, WHO | BWO/SRF Sept. 2025; JLL Okt. 2025 |
| `wirtschaftskraft` | +2 | Globales Zentrum für Diplomatie, Finanzen, internationalen Organisationen; höchstes BIP/Kopf im Kanton Genf | BFS |
| `bevoelkerungstrend` | –1 | Schweizweit negatives natürliches Wachstum | BFS |

### Steuerbare Parameter

#### 1. Bodenrecht & Landnutzung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 2 | Starke geographische Begrenzung (See, Frankreich-Grenze); kaum Neueinzonungen möglich | Kanton Genf Richtplan |
| `raumplanung_verdichtung` | 2 | Aktive Innenverdichtungspolitik; Agglomeration Genf dicht überbaut | Kanton GE Raumplanung |
| `raumplanung_ausnuetzungsziffer` | 2 | Dichte Überbauung im städtischen Kern; hohe AZ in Zentrumsgebieten [SCHÄTZUNG] | Baureglemente Genf |
| `boden_vorkaufsrecht` | 1 | Kantonales Vorkaufsrecht (Loi sur les constructions et installations publiques, LCIAP); bisher selten aktiviert | Immoday April 2025; FDP-ZH Juni 2025 |
| `boden_bauverpflichtung` | 1 | Mehrwertabgabe umgesetzt; keine spezifische Bauverpflichtung mit Frist | Mehrwertabgabe.com 2018 |
| `boden_mehrwertabgabe` | 1 | Kantonales Gesetz Art.30C–30O LaLAT; RPG-Minimum 20% | mehrwertabgabe.com |
| `boden_bodeneigentumssteuer` | 0 | Keine spezifische Bodeneigentumssteuer im Kanton Genf | Kantonales Steuerrecht GE |

#### 2. Bau & Bewilligung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `bau_energievorgaben` | 1 | MuKEn 2014 umgesetzt; strengere kantonale Vorgaben in Prüfung [SCHÄTZUNG] | Kantonales Energiegesetz GE |
| `bau_sanierungspflicht` | 1 | Empfohlene Ziele; keine Zwangspflicht wie in ZH [SCHÄTZUNG] | — |
| `bau_einspracherecht_dritte` | 1 | Anwohner mit schutzwürdigen Interessen; vergleichbar mit anderen CH-Städten [SCHÄTZUNG] | — |
| `bau_einspracherecht_suspensiv` | 2 | Schweizer Recht: Einsprache hat aufschiebende Wirkung | VRPG |
| `bau_bewilligungsverfahren` | 1 | Teilweise digitalisiert; keine volldigitale Umsetzung wie Zürich [SCHÄTZUNG] | — |
| `bau_normenharmonisierung` | 1 | IVHB umgesetzt (Kanton Genf beteiligt) | IVHB |

#### 3. Gemeinnütziger Wohnungsbau & Förderung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `gemeinnuetzig_mindestanteil` | 1 | Kein kantonaler Mindestanteil wie ZH/BE; Genf hat aber历史上的 hohe Genossenschaftsquote durch aktive Bodenpolitik [SCHÄTZUNG] | wbg-schweiz.ch |
| `gemeinnuetzig_foerderfonds` | 1 | Kantonaler Wohnbauförderungsfonds; nationaler Fonds de Roulement zugänglich | wbg-schweiz.ch 2024 |
| `gemeinnuetzig_baurecht` | 1 | Aktive Baurechtsvergabe durch Kanton; Grundstücke in öffentlichem Eigentum | Kantonale Bodenpolitik GE |
| `gemeinnuetzig_belegungsvorschriften` | 0 | Keine verbindliche kommunale Pflicht [SCHÄTZUNG] | — |
| `gemeinnuetzig_sozialmischung` | 1 | Bei städtischen Projekten üblich; keine gesetzliche Pflicht [SCHÄTZUNG] | — |

#### 4. Mietrecht

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `mietrecht_kostenmiete` | 2 | LDTR (Loi sur le démembrement du droit de propriété des locaux) + strenge kantonale Mietregulierung; Genf ist neben Basel die strengste Regulierung in der CH | EY Feb. 2025; Nume Feb. 2026 |
| `mietrecht_anfangsmiete` | 2 | Strenge kantonale Regulierung; Anfechtbarkeit bei angespanntem Markt | LDTR; MV Schweiz |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025: Formular mit Vormietzins, Referenzzinssatz und LIK (Bundesrecht) | Art. 19 Abs. 2 VMWG |
| `mietrecht_kuendigungsschutz` | 2 | Kantonal strenge Regeln gegen Luxussanierungen und Massenkündigungen; LDTR schützt Mieter bei Renovierung | Nume Feb. 2026 |
| `mietrecht_mietzinsindex` | 0 | Bundesrecht: Referenzzinssatz (kein kantonaler LIK) | OR Art. 269a |
| `mietrecht_untervermietung` | 1 | OR Art. 262; keine spezifische Airbnb-Regulierung bekannt [SCHÄTZUNG] | OR Art. 262 |

#### 5. Steuern & Abgaben

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `steuer_grundstückgewinn` | 1 | Kantonale Grundstückgewinnsteuer; progressiv nach Haltedauer | StG Kanton Genf |
| `steuer_eigenmietwert` | 1 | Abschaffung beschlossen, aber noch nicht in Kraft (Abstimmung Sept. 2025) | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine Leerstandsabgabe im Kanton Genf bekannt [SCHÄTZUNG] | — |
| `steuer_handaenderung` | 1 | Kanton Genf: moderate Handänderungssteuer | StG Kanton Genf |
| `steuer_kapitalgewinnprivatpersonen` | 0 | DBG Art. 16 Abs. 3: Kapitalgewinne Private steuerfrei | DBG |

#### 6. Kapital & Investitionen

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `kapital_auslaendische_investoren` | 1 | Lex Koller schweizweit; Genf吸引 internationale Investoren | BewG |
| `kapital_institutionelle_regulierung` | 0 | Keine Transparenz-/Renditebegrenzungspflicht [SCHÄTZUNG] | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard schweizweit | FINMA RS 2012/3 |

#### 7. Nutzungsregulierung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `nutzung_kurzzeitvermietung` | 1 | OR Art. 262; keine eigene kantonale Regulierung bekannt [SCHÄTZUNG] | OR Art. 262 |
| `nutzung_umnutzungsverbot` | 2 | Strenge Wohnzonenschutzregeln; LDTR schützt auch vor Umnutzung [SCHÄTZUNG] | LDTR |
| `nutzung_abbruchverbot` | 2 | Strenger Schutz durch kantonale Gesetzgebung [SCHÄTZUNG] | Kantonales Baurecht GE |
| `nutzung_zweitwohnungen` | 1 | ZWG-Deckel 20%; Genf ist keine klassische Tourismusgemeinde | ZWG |

#### 8. Infrastruktur & Standortqualität

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `infra_oepnv` | 2 | Taktverkehr: Léman Express, Tram, Bus; sehr gute Anbindung an internationalen Flughafen | Léman Express; Genf Mobilität |
| `infra_schule_kita` | 2 | Starkes Schulangebot; internationale Schulen; Université de Genève (UNIGE) | Stadt Genf |
| `infra_oeffentlicher_raum` | 2 | Seeufer, Parks, hohe Lebensqualität; Genf als "Stadt des Friedens" | Mercer Quality of Living |
| `infra_wirtschaftsansiedlung` | 2 | Internationales Zentrum; tiefe kantonalale Steuern; IKRK, UNO, WHO, multinationale Unternehmen | GFCI; Kantonale Wirtschaftsförderung |

---

## Basel (Stadt) — Parameter

**Kanton:** Basel-Stadt (BS) — Stadt und Kanton sind identisch
**Bevölkerung Stadt:** ~178'000

### Kontextfaktoren

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `zinsniveau` | –1 | SNB-Leitzins –0.25%, Referenzzinssatz 1.25% (März 2026) | SNB |
| `zuwanderungsdruck` | +1 | Leerwohnungsziffer 0.9% (2025), 0.8% (2024); angespannt aber nicht so extrem wie ZH/GE | Statistik Basel-Stadt 2025 |
| `wirtschaftskraft` | +2 | Wichtige Wirtschaftsmetropole; Pharma-Hub (Novartis, Roche); Rheinhäfen; starke Finanzbranche | BFS |
| `bevoelkerungstrend` | –1 | Schweizweit negatives natürliches Wachstum | BFS |

### Steuerbare Parameter

#### 1. Bodenrecht & Landnutzung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 2 | Stadt Basel-Stadt ist fast vollständig bebaut; kaum Neueinzonungen möglich | Kantonale Richtplanung BS |
| `raumplanung_verdichtung` | 2 | Aktive Innenentwicklungspolitik; Aufzonungen inkl. Dreispitz, Lysssüdpark | Kantonale Entwicklungskonzept |
| `raumplanung_ausnuetzungsziffer` | 2 | Hohe Ausnützungsziffern in Zentrumsgebieten [SCHÄTZUNG] | Baureglemente Basel-Stadt |
| `boden_vorkaufsrecht` | 0 | Kein Vorkaufsrecht in Basel-Stadt; Kanton lehnt dies ab [SCHÄTZUNG] | — |
| `boden_bauverpflichtung` | 1 | Mehrwertabgabe umgesetzt; keine spezifische Bauverpflichtung mit Frist | RPG Art. 5 |
| `boden_mehrwertabgabe` | 1 | RPG-Minimum 20%; Basel-Stadt hat keine erhöhte kantonale Abgabe [SCHÄTZUNG] | RPG Art. 5 |
| `boden_bodeneigentumssteuer` | 0 | Keine Bodeneigentumssteuer | Steuerrecht Kanton BS |

#### 2. Bau & Bewilligung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `bau_energievorgaben` | 1 | MuKEn 2014 umgesetzt; Basel-Stadt hat moderate kantonale Vorgaben [SCHÄTZUNG] | Kantonales Energiegesetz BS |
| `bau_sanierungspflicht` | 1 | Keine Zwangspflicht; Sanierungsförderung über Wohnbauförderung [SCHÄTZUNG] | — |
| `bau_einspracherecht_dritte` | 1 | Anwohner mit schutzwürdigen Interessen | PBG BS |
| `bau_einspracherecht_suspensiv` | 2 | Schweizer Recht: Einsprache hat aufschiebende Wirkung | VRPG; PBG BS |
| `bau_bewilligungsverfahren` | 1 | Teilweise digital; Basel-Stadt hat eigene eBau-Lösung [SCHÄTZUNG] | Kantonale Baupraxis BS |
| `bau_normenharmonisierung` | 1 | IVHB umgesetzt | IVHB |

#### 3. Gemeinnütziger Wohnungsbau & Förderung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `gemeinnuetzig_mindestanteil` | 1 | Kein Mindestanteil gesetzlich; aber aktive Förderung über Wohnbauförderung [SCHÄTZUNG] | Kantonale Wohnbauförderung BS |
| `gemeinnuetzig_foerderfonds` | 2 | Kantonaler Wohnbauförderungsfonds; aktive Förderung von Genossenschaften | wbg-schweiz.ch 2024 |
| `gemeinnuetzig_baurecht` | 2 | Aktive Baurechtsabgabe: Logis Suisse AG, Homebase Genossenschaft, Wohngenossenschaft Hegenheimerstrasse begünstigt | WBG Nordwestschweiz |
| `gemeinnuetzig_belegungsvorschriften` | 1 | Bei Genossenschaftswohnungen üblich intern zu regeln [SCHÄTZUNG] | — |
| `gemeinnuetzig_sozialmischung` | 1 | Bei städtischen Aufzonungen üblich [SCHÄTZUNG] | — |

#### 4. Mietrecht

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `mietrecht_kostenmiete` | 2 | Wohnschutzgesetz mit Mietzinsdeckel bei Sanierungen/Um-/Neubauten; strengste Regulierung neben Genf | EY Feb. 2025; Vorsorgeforum Jan. 2024 |
| `mietrecht_anfangsmiete` | 2 | Kantonal strenge Regeln; Formularpflicht; betrifft ~1/3 des Wohnraums | BZ Basel Juli 2021 |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025: Formular mit Vormietzins, Referenzzinssatz und LIK | Art. 19 Abs. 2 VMWG |
| `mietrecht_kuendigungsschutz` | 2 | Wohnschutzgesetz: Bewilligungspflicht und Mietzinskontrolle bei Massenkündigungen | BZ Basel Juli 2021 |
| `mietrecht_mietzinsindex` | 0 | Bundesrecht: Referenzzinssatz | OR Art. 269a |
| `mietrecht_untervermietung` | 1 | OR Art. 262; Airbnb-Limit 90 TageDiskussion im Kanton [SCHÄTZUNG] | OR Art. 262 |

#### 5. Steuern & Abgaben

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `steuer_grundstückgewinn` | 1 | Kantonale Grundstückgewinnsteuer; progressiv nach Haltedauer | StG Kanton BS |
| `steuer_eigenmietwert` | 1 | Abschaffung beschlossen, aber noch nicht in Kraft | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine Leerstandsabgabe | Kantonale Steuerpraxis BS |
| `steuer_handaenderung` | 1 | Moderate Handänderungssteuer [SCHÄTZUNG] | StG Kanton BS |
| `steuer_kapitalgewinnprivatpersonen` | 0 | DBG Art. 16 Abs. 3: Kapitalgewinne Private steuerfrei | DBG |

#### 6. Kapital & Investitionen

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `kapital_auslaendische_investoren` | 1 | Lex Koller schweizweit | BewG |
| `kapital_institutionelle_regulierung` | 0 | Keine Transparenz-/Renditebegrenzungspflicht [SCHÄTZUNG] | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard schweizweit | FINMA RS 2012/3 |

#### 7. Nutzungsregulierung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `nutzung_kurzzeitvermietung` | 1 | OR Art. 262; keine eigene kantonale Regulierung [SCHÄTZUNG] | OR Art. 262 |
| `nutzung_umnutzungsverbot` | 2 | Strenge Wohnschutzregeln; Wohnschutzgesetz schützt vor Umnutzung | Wohnschutzgesetz BS |
| `nutzung_abbruchverbot` | 2 | Bewilligungspflicht für Abbrüche durch Wohnschutzgesetz [SCHÄTZUNG] | Wohnschutzgesetz BS |
| `nutzung_zweitwohnungen` | 1 | ZWG-Deckel 20%; Basel keine Tourismusgemeinde | ZWG |

#### 8. Infrastruktur & Standortqualität

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `infra_oepnv` | 2 | Tram, Bus, SBB; Regio-S-Bahn; Rheinhäfen; gute ÖV-Erschliessung | Basel Verkehr; BVB |
| `infra_schule_kita` | 2 | Universität Basel, FH, starkes Schulnetz; viele Kitas | Stadt Basel Bildungsdepartement |
| `infra_oeffentlicher_raum` | 2 | Rheinufer, Münsterplatz, Parks; hohe Aufenthaltsqualität | Mercer Quality of Living |
| `infra_wirtschaftsansiedlung` | 2 | Pharma-Hub; messbare Standortförderung; Basel-World, BASEL, Life Sciences | Standortförderung Basel |

---

## Lausanne — Parameter

**Kanton:** Waadt (VD)
**Bevölkerung Stadt:** ~145'000
**Bemerkung:** Lausanne ist Hauptort des Kantons Waadt; kantonale Gesetze sind massgebend

### Kontextfaktoren

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `zinsniveau` | –1 | SNB-Leitzins –0.25%, Referenzzinssatz 1.25% (März 2026) | SNB |
| `zuwanderungsdruck` | +2 | Leerwohnungsziffer 0.58% (2025); starke Zuwanderung in den Kanton Waadt;EPFL lockt internationale Fachkräfte | Tagesanzeiger Nov. 2025 |
| `wirtschaftskraft` | +2 | EPFL (École Polytechnique Fédérale de Lausanne); bedeutende Wirtschaftsmetropole der Romandie; Pharma, Finanzen | BFS |
| `bevoelkerungstrend` | –1 | Schweizweit negatives natürliches Wachstum | BFS |

### Steuerbare Parameter

#### 1. Bodenrecht & Landnutzung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 1 | Gemischt; Kanton VD hat mehr Reserven als ZH/GE; aber angespannter Markt in Lausanne | Kanton VD Richtplan |
| `raumplanung_verdichtung` | 1 | RPG-Pflicht; moderate Innenverdichtung | RPG; kant. Richtplan VD |
| `raumplanung_ausnuetzungsziffer` | 1 | Mittlere Dichte; lockerer als ZH/BS [SCHÄTZUNG] | Baureglemente Lausanne |
| `boden_vorkaufsrecht` | 2 | LPPPL (Loi sur la preservation et la promotion du parc locatif) seit 2020; Stadt Lausanne hat aktiv gekauft (10 Liegenschaften, ~100 Mio. CHF) | SRF Juni 2023; Tagesanzeiger Nov. 2025; TSRI Nov. 2025 |
| `boden_bauverpflichtung` | 1 | Mehrwertabgabe umgesetzt; keine schärfere kommunale Bauverpflichtung | RPG Art. 5 |
| `boden_mehrwertabgabe` | 1 | Kanton VD: RPG-konform; 20% Minimum | Kantonales Recht VD |
| `boden_bodeneigentumssteuer` | 0 | Keine Bodeneigentumssteuer im Kanton VD | Steuerrecht Kanton VD |

#### 2. Bau & Bewilligung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `bau_energievorgaben` | 1 | MuKEn 2014 umgesetzt; moderate kantonale Vorgaben [SCHÄTZUNG] | Kantonales Energiegesetz VD |
| `bau_sanierungspflicht` | 1 | Keine Zwangspflicht; Förderung über Wohnbauförderung [SCHÄTZUNG] | — |
| `bau_einspracherecht_dritte` | 1 |similar zu anderen Schweizer Städten [SCHÄTZUNG] | — |
| `bau_einspracherecht_suspensiv` | 2 | Schweizer Recht: Einsprache hat aufschiebende Wirkung | VRPG |
| `bau_bewilligungsverfahren` | 1 | Teilweise digital; keine volldigitale Umsetzung [SCHÄTZUNG] | — |
| `bau_normenharmonisierung` | 1 | IVHB umgesetzt (Kanton VD beteiligt) | IVHB |

#### 3. Gemeinnütziger Wohnungsbau & Förderung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `gemeinnuetzig_mindestanteil` | 1 | Kein Mindestanteil gesetzlich; aber aktive kommunale Förderung (Stadt verkauft erworbene Liegenschaften an Genossenschaften) | Tagesanzeiger Nov. 2025 |
| `gemeinnuetzig_foerderfonds` | 1 | Kantonaler Wohnbauförderungsfonds; nationaler Fonds de Roulement zugänglich | wbg-schweiz.ch 2024 |
| `gemeinnuetzig_baurecht` | 2 | LPPPL ermöglicht aktive Baurechtsvergabe; Stadt kauft und verkauft an Genossenschaften weiter | SRF Juni 2023 |
| `gemeinnuetzig_belegungsvorschriften` | 0 | Keine verbindliche kommunale Pflicht [SCHÄTZUNG] | — |
| `gemeinnuetzig_sozialmischung` | 1 | Bei städtischen Projekten üblich [SCHÄTZUNG] | — |

#### 4. Mietrecht

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `mietrecht_kostenmiete` | 1 | Bundesrecht; kein kantonaler Mietzinsdeckel wie BS/GE; aber Formularpflicht bei Wohnungsknappheit | MV Schweiz |
| `mietrecht_anfangsmiete` | 1 | Kanton VD: teilweise Formularpflicht bei angespanntem Markt | MV Schweiz |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025: Formular mit Vormietzins, Referenzzinssatz und LIK | Art. 19 Abs. 2 VMWG |
| `mietrecht_kuendigungsschutz` | 1 | Bundesrecht OR Art. 272ff; kein spezielles kantonales Gesetz [SCHÄTZUNG] | OR Art. 272ff |
| `mietrecht_mietzinsindex` | 0 | Bundesrecht: Referenzzinssatz | OR Art. 269a |
| `mietrecht_untervermietung` | 1 | OR Art. 262; keine spezifische Airbnb-Regulierung in Lausanne bekannt | OR Art. 262 |

#### 5. Steuern & Abgaben

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `steuer_grundstückgewinn` | 1 | Kantonale Grundstückgewinnsteuer; progressiv | StG Kanton VD |
| `steuer_eigenmietwert` | 1 | Abschaffung beschlossen, aber noch nicht in Kraft | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine Leerstandsabgabe im Kanton VD [SCHÄTZUNG] | — |
| `steuer_handaenderung` | 1 | Moderate Handänderungssteuer im Kanton VD | StG Kanton VD |
| `steuer_kapitalgewinnprivatpersonen` | 0 | DBG Art. 16 Abs. 3: Kapitalgewinne Private steuerfrei | DBG |

#### 6. Kapital & Investitionen

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `kapital_auslaendische_investoren` | 1 | Lex Koller schweizweit | BewG |
| `kapital_institutionelle_regulierung` | 0 | Keine Transparenz-/Renditebegrenzungspflicht [SCHÄTZUNG] | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard schweizweit | FINMA RS 2012/3 |

#### 7. Nutzungsregulierung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `nutzung_kurzzeitvermietung` | 1 | OR Art. 262; keine spezifische Airbnb-Regulierung in Lausanne [SCHÄTZUNG] | OR Art. 262 |
| `nutzung_umnutzungsverbot` | 1 | Wohnzonenschutz in Baureglements; nicht so streng wie BS/GE [SCHÄTZUNG] | Baureglements Lausanne |
| `nutzung_abbruchverbot` | 1 | Prüfpflicht bei Abbrüchen [SCHÄTZUNG] | Kantonales Baurecht VD |
| `nutzung_zweitwohnungen` | 1 | ZWG-Deckel 20%; Lausanne keine klassische Tourismusgemeinde | ZWG |

#### 8. Infrastruktur & Standortqualität

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `infra_oepnv` | 2 | Metro, Bus, Tram, SBB; gute Anbindung an Genf und Bern; Lausanne ist Seeufer-Stadt mit hohem Freizeitwert | TL (Transports publics de la région lausannoise) |
| `infra_schule_kita` | 2 | EPFL, Université de Lausanne (UNIL), HEC Lausanne; starkes Schulnetz | Stadt Lausanne |
| `infra_oeffentlicher_raum` | 2 | Seeufer, Ouchy, Parks; hohe Lebensqualität | Mercer Quality of Living |
| `infra_wirtschaftsansiedlung` | 2 | EPFL-Technologiepark; Life Sciences; aktive Standortförderung Kanton VD | Standortförderung VD |

---

## Winterthur — Parameter

**Kanton:** Zürich (ZH) — Stadt, kantonale Gesetze sind massgebend
**Bevölkerung Stadt:** ~125'000
**Bemerkung:** Zweitgrösste Stadt des Kantons ZH; weitgehend identische kantonale Rahmenbedingungen wie Zürich Stadt, aber kommunale Unterschiede bei Vollzug

### Kontextfaktoren

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `zinsniveau` | –1 | SNB-Leitzins –0.25%, Referenzzinssatz 1.25% (März 2026) | SNB |
| `zuwanderungsdruck` | +2 | Extrem niedrige Leerwohnungsziffer: 0.14% (2024), 0.18% (2025); noch tiefer als Zürich Stadt (0.10%) | Stadt Winterthur Aug. 2024/2025; ZH.ch |
| `wirtschaftskraft` | +1 | Bedeutende Industriestadt; Maschinenbau (Sulzer, Babcock), Versicherungen; Nähe zu Zürich | BFS |
| `bevoelkerungstrend` | –1 | Schweizweit negatives natürliches Wachstum | BFS |

### Steuerbare Parameter

Da Winterthur im Kanton Zürich liegt, gelten weitgehend die gleichen kantonalen Regelungen wie für Zürich Stadt. Die wichtigsten Abweichungen und kommunalen Besonderheiten:

#### 1. Bodenrecht & Landnutzung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 2 | Wie ZH Stadt: kaum Neueinzonungen; BZO-Revision fokussiert auf Innenentwicklung | BZO Winterthur |
| `raumplanung_verdichtung` | 1 | Wie ZH: RPG-Pflicht; aber weniger aktiv als Stadt ZH bei Aufzonungen [SCHÄTZUNG] | Kanton ZH Richtplan |
| `raumplanung_ausnuetzungsziffer` | 1 | Mittlere Dichte; Winterthur historisch lockerer als Zürich [SCHÄTZUNG] | Baureglemente Winterthur |
| `boden_vorkaufsrecht` | 0 | Wie ZH: Volksinitiative 30.11.2025 mit 59.3% abgelehnt | Tagesanzeiger/SRF 30.11.2025 |
| `boden_bauverpflichtung` | 1 | Kommunale Mehrwertabgabe; keine allgemeine Bauverpflichtung mit Frist | VO MAF Winterthur |
| `boden_mehrwertabgabe` | 1 | VO MAF: 40% (wie Kanton ZH) | zh.ch/mehrwertausgleich |
| `boden_bodeneigentumssteuer` | 0 | Keine Bodeneigentumssteuer | Steuerrecht Kanton ZH |

#### 2. Bau & Bewilligung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `bau_energievorgaben` | 1 | MuKEn 2014 umgesetzt (Kanton ZH) | zh.ch/bauvorschriften |
| `bau_sanierungspflicht` | 2 | Elektroheizungen-Pflicht bis 2030 (Kanton ZH); gilt auch für Winterthur | NZZ 27.4.2023 |
| `bau_einspracherecht_dritte` | 1 | PBG ZH §21: Personen mit schutzwürdigen Interessen | PBG Kanton ZH §21 |
| `bau_einspracherecht_suspensiv` | 2 | Schweizer Recht: Einsprache hat aufschiebende Wirkung | VRPG |
| `bau_bewilligungsverfahren` | 1 | Teilweise digital; nicht so weit wie Stadt ZH mit eBaugesucheZH [SCHÄTZUNG] | Kantonale Baupraxis ZH |
| `bau_normenharmonisierung` | 1 | IVHB umgesetzt | zh.ch/harmonisierung |

#### 3. Gemeinnütziger Wohnungsbau & Förderung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `gemeinnuetzig_mindestanteil` | 1 | Stadt Winterthur: kein eigenes 33%-Ziel wie Zürich; aber Genossenschaften aktiv [SCHÄTZUNG] | Winterthur Sozialdepartement |
| `gemeinnuetzig_foerderfonds` | 2 | Kantonaler Wohnbaufonds auf 360 Mio. CHF (Nov. 2025); gilt für ganz Kanton ZH | SRF 30.11.2025 |
| `gemeinnuetzig_baurecht` | 1 | Aktive Baurechtsvergabe durch Stadt Winterthur [SCHÄTZUNG] | Stadt Winterthur Liegenschaften |
| `gemeinnuetzig_belegungsvorschriften` | 0 | Keine verbindliche kommunale Pflicht [SCHÄTZUNG] | — |
| `gemeinnuetzig_sozialmischung` | 1 | Bei Aufzonungen üblich [SCHÄTZUNG] | — |

#### 4. Mietrecht

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `mietrecht_kostenmiete` | 1 | OR Art. 269: Rendite max. 2%+Referenzzinssatz (Bundesrecht) | OR Art. 269 |
| `mietrecht_anfangsmiete` | 1 | Kanton ZH: Leerwohnungsziffer <1.5% → Formularpflicht | OR Art. 270; VO ZH |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025: Formular mit Vormietzins, Referenzzinssatz und LIK | Art. 19 Abs. 2 VMWG |
| `mietrecht_kuendigungsschutz` | 2 | Wohnraumschutzgesetz ZH (860.1): gilt auch für Winterthur; Prüfpflicht bei Massenkündigungen | WRG ZH |
| `mietrecht_mietzinsindex` | 0 | Bundesrecht: Referenzzinssatz | OR Art. 269a |
| `mietrecht_untervermietung` | 1 | OR Art. 262; keine eigene Airbnb-Regulierung für Winterthur bekannt [SCHÄTZUNG] | OR Art. 262 |

#### 5. Steuern & Abgaben

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `steuer_grundstückgewinn` | 1 | Kanton ZH: progressive GGSt nach Haltedauer | StG ZH §216ff |
| `steuer_eigenmietwert` | 1 | Abschaffung beschlossen, aber noch nicht in Kraft | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine Leerstandsabgabe | Stadt ZH Statistik |
| `steuer_handaenderung` | 0 | Kanton Zürich: keine Handänderungssteuer | StG ZH |
| `steuer_kapitalgewinnprivatpersonen` | 0 | DBG Art. 16 Abs. 3: Kapitalgewinne Private steuerfrei | DBG |

#### 6. Kapital & Investitionen

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `kapital_auslaendische_investoren` | 1 | Lex Koller schweizweit | BewG |
| `kapital_institutionelle_regulierung` | 0 | Keine Transparenz-/Renditebegrenzungspflicht [SCHÄTZUNG] | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard schweizweit | FINMA RS 2012/3 |

#### 7. Nutzungsregulierung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `nutzung_kurzzeitvermietung` | 1 | Kantonales 90-Tage-Limit gilt nicht spezifisch für Winterthur; OR Art. 262 [SCHÄTZUNG] | OR Art. 262 |
| `nutzung_umnutzungsverbot` | 1 | Wohnanteilsvorschriften; weniger strikt als Zürich Stadt [SCHÄTZUNG] | Bauordnung Winterthur |
| `nutzung_abbruchverbot` | 2 | Wohnraumschutzgesetz ZH gilt auch für Winterthur; Ersatzneubau-Pflicht | WRG ZH |
| `nutzung_zweitwohnungen` | 1 | ZWG-Deckel 20%; Winterthur keine Tourismusgemeinde | ZWG |

#### 8. Infrastruktur & Standortqualität

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `infra_oepnv` | 1 | Gut ausgebautes Bus/Tram-Netz; S-Bahn-Anschluss; nicht auf Niveau Zürich, aber solide | Stadt Winterthur; SBB |
| `infra_schule_kita` | 1 | Bedarfsgerechtes Schulnetz; ZHAW (Fachhochschule); weniger Kitas als Zürich [SCHÄTZUNG] | Stadt Winterthur Bildungsdepartement |
| `infra_oeffentlicher_raum` | 1 | Gute Parks; Sulzer-Areal wird aufgewertet; weniger Investitionen als Zürich [SCHÄTZUNG] | — |
| `infra_wirtschaftsansiedlung` | 1 | Moderate Wirtschaftsförderung; Sulzer-areal Entwicklung; nicht so aggressiv wie Zürich | Stadt Winterthur Wirtschaftsförderung |

---

## Luzern (Stadt) — Parameter

**Kanton:** Luzern (LU)
**Bevölkerung Stadt:** ~82'000
**Bemerkung:** Hauptort des Kantons Luzern; kantonale Gesetze sind massgebend

### Kontextfaktoren

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `zinsniveau` | –1 | SNB-Leitzins –0.25%, Referenzzinssatz 1.25% (März 2026) | SNB |
| `zuwanderungsdruck` | +1 | Leerwohnungsziffer Stadt Luzern 1.01% (2025); über kantonalem Durchschnitt; angespannt aber nicht kritisch | Sunshine Sept. 2025 |
| `wirtschaftskraft` | +1 | Zentralschweizer Wirtschaftszentrum; Tourismus, Finanz, Dienstleistungen; gute Arbeitsmarktlage | BFS |
| `bevoelkerungstrend` | –1 | Schweizweit negatives natürliches Wachstum | BFS |

### Steuerbare Parameter

#### 1. Bodenrecht & Landnutzung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 1 | Gemischte Lage; Agglomeration hat Reserven; Stadt Luzern ist dichter | Kanton LU Richtplan |
| `raumplanung_verdichtung` | 1 | RPG-Pflicht; moderate Innenverdichtung | RPG; kant. Richtplan LU |
| `raumplanung_ausnuetzungsziffer` | 1 | Mittlere Dichte [SCHÄTZUNG] | Baureglemente Stadt Luzern |
| `boden_vorkaufsrecht` | 0 | Kein Vorkaufsrecht im Kanton Luzern; Volksinitiative zu Vorkaufsrecht wurde abgelehnt (Gemeinden sollen es selbst regeln) | Luzernerzeitung Feb. 2020 |
| `boden_bauverpflichtung` | 1 | Mehrwertabgabe umgesetzt; RPG-konform | PBG Kanton LU |
| `boden_mehrwertabgabe` | 1 | Kanton LU: RPG-Minimum 20% bei Einzonungen | Geoportal Kanton LU |
| `boden_bodeneigentumssteuer` | 0 | Keine Bodeneigentumssteuer im Kanton LU | Steuerrecht Kanton LU |

#### 2. Bau & Bewilligung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `bau_energievorgaben` | 1 | MuKEn 2014 umgesetzt; moderate kantonale Vorgaben [SCHÄTZUNG] | Kantonales Energiegesetz LU |
| `bau_sanierungspflicht` | 1 | Keine Zwangspflicht; Förderung über Wohnbauförderung [SCHÄTZUNG] | — |
| `bau_einspracherecht_dritte` | 1 | PBG LU: Personen mit schutzwürdigen Interessen [SCHÄTZUNG] | — |
| `bau_einspracherecht_suspensiv` | 2 | Schweizer Recht: Einsprache hat aufschiebende Wirkung | VRPG |
| `bau_bewilligungsverfahren` | 1 | Teilweise digital [SCHÄTZUNG] | Kantonale Baupraxis LU |
| `bau_normenharmonisierung` | 1 | IVHB umgesetzt (Kanton LU beteiligt) | IVHB |

#### 3. Gemeinnütziger Wohnungsbau & Förderung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `gemeinnuetzig_mindestanteil` | 0 | Kein Mindestanteil im Kanton LU; Genossenschaftswohnungen sind in der Minderheit | wbg-schweiz.ch |
| `gemeinnuetzig_foerderfonds` | 1 | Kantonaler Wohnbauförderungsfonds vorhanden; nationaler Fonds de Roulement zugänglich | Kantonale Wohnbauförderung LU |
| `gemeinnuetzig_baurecht` | 1 | Gelegentliche Baurechtsvergabe; kein systematisches Prioritätsprinzip [SCHÄTZUNG] | Stadt Luzern Liegenschaften |
| `gemeinnuetzig_belegungsvorschriften` | 0 | Keine verbindliche kommunale Pflicht [SCHÄTZUNG] | — |
| `gemeinnuetzig_sozialmischung` | 0 | Keine Sozialmischungspflicht bekannt [SCHÄTZUNG] | — |

#### 4. Mietrecht

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `mietrecht_kostenmiete` | 1 | Bundesrecht OR Art. 269 | OR Art. 269 |
| `mietrecht_anfangsmiete` | 1 | Formularpflicht bei angespanntem Markt (Kanton LU hat diese Pflicht) | MV Schweiz |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025: Formular mit Vormietzins, Referenzzinssatz und LIK | Art. 19 Abs. 2 VMWG |
| `mietrecht_kuendigungsschutz` | 1 | Bundesrecht OR Art. 272ff [SCHÄTZUNG] | OR Art. 272ff |
| `mietrecht_mietzinsindex` | 0 | Bundesrecht: Referenzzinssatz | OR Art. 269a |
| `mietrecht_untervermietung` | 1 | OR Art. 262; keine spezifische Airbnb-Regulierung bekannt | OR Art. 262 |

#### 5. Steuern & Abgaben

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `steuer_grundstückgewinn` | 1 | Kantonale Grundstückgewinnsteuer; progressiv | StG Kanton LU |
| `steuer_eigenmietwert` | 1 | Abschaffung beschlossen, aber noch nicht in Kraft | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine Leerstandsabgabe im Kanton LU [SCHÄTZUNG] | — |
| `steuer_handaenderung` | 1 | Moderate Handänderungssteuer im Kanton LU | StG Kanton LU |
| `steuer_kapitalgewinnprivatpersonen` | 0 | DBG Art. 16 Abs. 3: Kapitalgewinne Private steuerfrei | DBG |

#### 6. Kapital & Investitionen

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `kapital_auslaendische_investoren` | 1 | Lex Koller schweizweit | BewG |
| `kapital_institutionelle_regulierung` | 0 | Keine Transparenz-/Renditebegrenzungspflicht [SCHÄTZUNG] | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard schweizweit | FINMA RS 2012/3 |

#### 7. Nutzungsregulierung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `nutzung_kurzzeitvermietung` | 1 | OR Art. 262; keine eigene Regulierung in Luzern [SCHÄTZUNG] | OR Art. 262 |
| `nutzung_umnutzungsverbot` | 1 | Wohnzonenschutz in Baureglements; Standard [SCHÄTZUNG] | Baureglements Luzern |
| `nutzung_abbruchverbot` | 1 | Prüfpflicht bei Abbrüchen [SCHÄTZUNG] | Kantonales Baurecht LU |
| `nutzung_zweitwohnungen` | 1 | ZWG-Deckel 20%; Luzern ist Tourismusgemeinde (Seen), aber weniger betroffen als Berggemeinden | ZWG |

#### 8. Infrastruktur & Standortqualität

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `infra_oepnv` | 2 | Seeufer, Berge, gute Erreichbarkeit; S-Bahn, Bus, Schifffahrt; Tourismus-Infrastruktur | Stadt Luzern; VBL |
| `infra_schule_kita` | 1 | Universität Luzern (UniLu), Hochschule Luzern (HSLU); gutes Schulnetz [SCHÄTZUNG] | Stadt Luzern |
| `infra_oeffentlicher_raum` | 2 | Schöner öffentlicher Raum; Seeufer, Kapellbrücke, hohe Lebensqualität | Mercer Quality of Living |
| `infra_wirtschaftsansiedlung` | 1 | Moderate Wirtschaftsförderung; Tourismus, Zentralschweizer Wirtschaft | Standortförderung LU |

---

## St. Gallen (Stadt) — Parameter

**Kanton:** St. Gallen (SG)
**Bevölkerung Stadt:** ~80'000
**Bemerkung:** Hauptort des Kantons St. Gallen; kantonale Gesetze sind massgebend

### Kontextfaktoren

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `zinsniveau` | –1 | SNB-Leitzins –0.25%, Referenzzinssatz 1.25% (März 2026) | SNB |
| `zuwanderungsdruck` | 0 | Leerwohnungsziffer 2.1% (2024); im schweizer Vergleich HOCH; Nachfrageüberschuss in bestimmten Segmenten, aber Gesamtmarkt entspannt | Tagblatt Sept. 2024; Squarevest Dez. 2025 |
| `wirtschaftskraft` | +1 | Ostschweizer Wirtschaftszentrum; Textilindustrie historisch, jetzt Dienstleistungen, Handel; Universität St. Gallen (HSG) | BFS |
| `bevoelkerungstrend` | –1 | Schweizweit negatives natürliches Wachstum | BFS |

### Steuerbare Parameter

#### 1. Bodenrecht & Landnutzung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 1 | St. Gallen hat höhere Leerstände; gemischte Lage mit Agglomeration | Tagblatt Sept. 2024 |
| `raumplanung_verdichtung` | 1 | RPG-Pflicht; moderate Innenverdichtung; Wohnbaugenossenschaften schaffen neuen Wohnraum [SCHÄTZUNG] | Kanton SG Richtplan |
| `raumplanung_ausnuetzungsziffer` | 1 | Mittlere Dichte [SCHÄTZUNG] | Baureglemente St. Gallen |
| `boden_vorkaufsrecht` | 0 | Kein Vorkaufsrecht im Kanton St. Gallen [SCHÄTZUNG] | Tagblatt April 2018 |
| `boden_bauverpflichtung` | 1 | Mehrwertabgabe umgesetzt; keine spezifische Bauverpflichtung | RPG Art. 5 |
| `boden_mehrwertabgabe` | 1 | Kanton SG: RPG-Minimum 20% bei Einzonungen; kein erhöhter Satz | sgs.ch |
| `boden_bodeneigentumssteuer` | 0 | Keine Bodeneigentumssteuer im Kanton SG [SCHÄTZUNG] | — |

#### 2. Bau & Bewilligung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `bau_energievorgaben` | 1 | MuKEn 2014 umgesetzt [SCHÄTZUNG] | Kantonales Energiegesetz SG |
| `bau_sanierungspflicht` | 1 | Keine Zwangspflicht; Förderung über Wohnbauförderung [SCHÄTZUNG] | — |
| `bau_einspracherecht_dritte` | 1 | PBG SG: Personen mit schutzwürdigen Interessen [SCHÄTZUNG] | — |
| `bau_einspracherecht_suspensiv` | 2 | Schweizer Recht: Einsprache hat aufschiebende Wirkung | VRPG |
| `bau_bewilligungsverfahren` | 1 | Teilweise digital [SCHÄTZUNG] | Kantonale Baupraxis SG |
| `bau_normenharmonisierung` | 1 | IVHB umgesetzt | IVHB |

#### 3. Gemeinnütziger Wohnungsbau & Förderung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `gemeinnuetzig_mindestanteil` | 0 | Kein Mindestanteil im Kanton SG; Kanton SG fördert, aber ohne Mindestquote | wbg-schweiz.ch |
| `gemeinnuetzig_foerderfonds` | 1 | Kantonale Wohnbauförderung SG; nationaler Fonds de Roulement zugänglich; Kanton SG verwaltet auch AI/TG | sg.ch Juni 2023 |
| `gemeinnuetzig_baurecht` | 1 | Gelegentliche Baurechtsvergabe; kein systematisches Prioritätsprinzip [SCHÄTZUNG] | Stadt St. Gallen Liegenschaften |
| `gemeinnuetzig_belegungsvorschriften` | 0 | Keine verbindliche kommunale Pflicht [SCHÄTZUNG] | — |
| `gemeinnuetzig_sozialmischung` | 0 | Keine Sozialmischungspflicht bekannt [SCHÄTZUNG] | — |

#### 4. Mietrecht

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `mietrecht_kostenmiete` | 1 | Bundesrecht OR Art. 269; kein kantonaler Mietzinsdeckel | OR Art. 269 |
| `mietrecht_anfangsmiete` | 1 | Formularpflicht bei angespanntem Markt; Kanton SG hat Formularpflicht | sg.ch Nov. 2024 |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025: Formular mit Vormietzins, Referenzzinssatz und LIK | Art. 19 Abs. 2 VMWG |
| `mietrecht_kuendigungsschutz` | 1 | Bundesrecht OR Art. 272ff; kein spezielles kantonales Gesetz [SCHÄTZUNG] | OR Art. 272ff |
| `mietrecht_mietzinsindex` | 0 | Bundesrecht: Referenzzinssatz | OR Art. 269a |
| `mietrecht_untervermietung` | 1 | OR Art. 262; keine spezifische Airbnb-Regulierung bekannt | OR Art. 262 |

#### 5. Steuern & Abgaben

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `steuer_grundstückgewinn` | 1 | Kantonale Grundstückgewinnsteuer; progressiv | StG Kanton SG |
| `steuer_eigenmietwert` | 1 | Abschaffung beschlossen, aber noch nicht in Kraft | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine Leerstandsabgabe im Kanton SG [SCHÄTZUNG] | — |
| `steuer_handaenderung` | 1 | Moderate Handänderungssteuer im Kanton SG | StG Kanton SG |
| `steuer_kapitalgewinnprivatpersonen` | 0 | DBG Art. 16 Abs. 3: Kapitalgewinne Private steuerfrei | DBG |

#### 6. Kapital & Investitionen

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `kapital_auslaendische_investoren` | 1 | Lex Koller schweizweit | BewG |
| `kapital_institutionelle_regulierung` | 0 | Keine Transparenz-/Renditebegrenzungspflicht [SCHÄTZUNG] | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard schweizweit | FINMA RS 2012/3 |

#### 7. Nutzungsregulierung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `nutzung_kurzzeitvermietung` | 1 | OR Art. 262; keine eigene Regulierung in St. Gallen [SCHÄTZUNG] | OR Art. 262 |
| `nutzung_umnutzungsverbot` | 1 | Wohnzonenschutz in Baureglements; SRS 733.5 (Volksinitiative zur Erhaltung von Wohnraum) [SCHÄTZUNG] | st.gallen.tlex.ch |
| `nutzung_abbruchverbot` | 1 | Prüfpflicht bei Abbrüchen [SCHÄTZUNG] | Kantonales Baurecht SG |
| `nutzung_zweitwohnungen` | 1 | ZWG-Deckel 20%; St. Gallen keine Tourismusgemeinde | ZWG |

#### 8. Infrastruktur & Standortqualität

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `infra_oepnv` | 1 | Gut ausgebautes Bus/Tram-Netz; S-Bahn; Erschliessung für Ostschweiz; nicht auf Niveau von ZH/BS [SCHÄTZUNG] | Stadt St. Gallen; SBB |
| `infra_schule_kita` | 2 | Universität St. Gallen (HSG), FHSG (Fachhochschule); gutes Schulnetz | Stadt St. Gallen Bildungsdepartement |
| `infra_oeffentlicher_raum` | 1 | Altstadt, Parks; solide Qualität [SCHÄTZUNG] | — |
| `infra_wirtschaftsansiedlung` | 1 | Moderate Wirtschaftsförderung; Universität St. Gallen (HSG) als Standortvorteil | Standortförderung SG |

---

## Biel/Bienne — Parameter

**Kanton:** Bern (BE)
**Bevölkerung Stadt:** ~55'000
**Bemerkung:** Zweitgrösste Stadt des Kantons Bern; bilingualmente (deutsch/französisch); kantonale Gesetze sind massgebend

### Kontextfaktoren

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `zinsniveau` | –1 | SNB-Leitzins –0.25%, Referenzzinssatz 1.25% (März 2026) | SNB |
| `zuwanderungsdruck` | +1 | Leerwohnungsziffer 1.08% (2024); Biel hat moderaten Druck; Grenzregion zu Frankenreich ( Frankenpendler) | APF-Bienne Sept. 2024; Tagblatt Jan. 2024 |
| `wirtschaftskraft` | +1 | Bedeutende Watch- und Mikrotechnologie-Industrie (Rolex, Swatch);肚子里 NOKIA/Intel historisch; diversifizierte Wirtschaft; 5.5% Wachstum BIP [SCHÄTZUNG] | Biel Wohnraumanalyse 2020 |
| `bevoelkerungstrend` | –1 | Schweizweit negatives natürliches Wachstum | BFS |

### Steuerbare Parameter

Da Biel im Kanton Bern liegt, gelten die gleichen kantonalen Regelungen wie für Bern Stadt.

#### 1. Bodenrecht & Landnutzung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 1 | Biel hat moderate Reserven; Agglomeration inkl. Twannbach hat Bauland; Innenstadt verdichtet | Kanton BE Richtplan 2030 |
| `raumplanung_verdichtung` | 1 | RPG-Pflicht; keine so aktive Aufzonungspolitik wie Bern Stadt [SCHÄTZUNG] | RPG; kant. Richtplan BE |
| `raumplanung_ausnuetzungsziffer` | 1 | Mittlere Dichte; historisch lockerer als Bern [SCHÄTZUNG] | Baureglemente Biel |
| `boden_vorkaufsrecht` | 0 | Kein kommunales Vorkaufsrecht in Biel; bundesrechtlich nicht vorgesehen | [SCHÄTZUNG] |
| `boden_bauverpflichtung` | 1 | RPG-Mehrwertabgabe umgesetzt; keine schärfere kommunale Bauverpflichtung | RPG Art. 5 |
| `boden_mehrwertabgabe` | 2 | Kanton Bern: 50% bei Einzonungen, 40% bei Aufzonungen; finanziert kantonalen Wohnbaufonds | Kanton BE MWA-Gesetz; i-rem.ch 2024 |
| `boden_bodeneigentumssteuer` | 0 | Keine spezifische Bodeneigentumssteuer [SCHÄTZUNG] | — |

#### 2. Bau & Bewilligung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `bau_energievorgaben` | 2 | Kanton Bern: MuKEn 2025 früh umgesetzt; strengste Schweizer Kantone | kant. Energiegesetz BE 2023 |
| `bau_sanierungspflicht` | 1 | Zielwert empfohlen; Pflicht für Heizungsersatz bis 2030 [SCHÄTZUNG] | BE Energiegesetz |
| `bau_einspracherecht_dritte` | 1 | Ähnlich wie Bern Stadt: Personen mit schutzwürdigen Interessen | BauG Kanton Bern |
| `bau_einspracherecht_suspensiv` | 2 | Schweizer Recht: automatischer Baustopp bei Einsprache | VRPG |
| `bau_bewilligungsverfahren` | 1 | eBau BE: teildigitalisiert; vollständige Digitalisierung noch in Umsetzung | eBau Kanton Bern |
| `bau_normenharmonisierung` | 1 | IVHB umgesetzt (Kanton BE) | IVHB |

#### 3. Gemeinnütziger Wohnungsbau & Förderung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `gemeinnuetzig_mindestanteil` | 2 | Kanton Bern: «Drittelsregel» — bei Ein-/Aufzonungen min. 1/3 preisgünstiger Wohnraum; Bundesgericht bestätigt 2014 | BGer 1C_415/2013 (2014) |
| `gemeinnuetzig_foerderfonds` | 1 | Kantonaler Wohnbaufonds Bern; gespiesen durch Mehrwertabgabe; nationaler Fonds de Roulement zugänglich | Kantonale Wohnbauförderung BE |
| `gemeinnuetzig_baurecht` | 1 | Aktive Baurechtsvergabe durch Stadt Biel; kein explizites Prioritätsprinzip [SCHÄTZUNG] | Stadt Biel Liegenschaften |
| `gemeinnuetzig_belegungsvorschriften` | 0 | Keine verbindliche kommunale Pflicht [SCHÄTZUNG] | — |
| `gemeinnuetzig_sozialmischung` | 2 | Drittelsregel kantonalgesetzlich verankert (gilt auch für Biel) | Kantonales Recht BE |

#### 4. Mietrecht

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `mietrecht_kostenmiete` | 1 | Bundesrecht gilt; keine kantonal schärfere Regelung als Bern Stadt | OR Art. 269 |
| `mietrecht_anfangsmiete` | 1 | Leerwohnungsziffer ~0.4% (Bern) → Formularpflicht; angespannter Markt | OR Art. 270; Statistik Kanton BE |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025: Formular mit Vormietzins, Referenzzinssatz und LIK | Art. 19 Abs. 2 VMWG |
| `mietrecht_kuendigungsschutz` | 1 | Bundesrecht (OR Art. 272ff); kein kant. Wohnraumschutzgesetz wie ZH [SCHÄTZUNG] | OR Art. 272ff |
| `mietrecht_mietzinsindex` | 0 | Bundesrecht: Referenzzinssatz | OR Art. 269a |
| `mietrecht_untervermietung` | 1 | OR Art. 262; keine spezifische Airbnb-Regulierung in Biel bekannt | OR Art. 262 |

#### 5. Steuern & Abgaben

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `steuer_grundstückgewinn` | 1 | Kanton Bern: progressive GGSt | StG Kanton Bern |
| `steuer_eigenmietwert` | 1 | Abschaffung beschlossen, aber noch nicht in Kraft | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine kommunale Leerstandsabgabe bekannt [SCHÄTZUNG] | — |
| `steuer_handaenderung` | 1 | Kanton Bern: Handänderungssteuer ~1.8% | StG Kanton Bern |
| `steuer_kapitalgewinnprivatpersonen` | 0 | DBG Art. 16 Abs. 3: Kapitalgewinne Private steuerfrei | DBG |

#### 6. Kapital & Investitionen

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `kapital_auslaendische_investoren` | 1 | Lex Koller schweizweit | BewG |
| `kapital_institutionelle_regulierung` | 0 | Keine Transparenz-/Renditebegrenzungspflicht [SCHÄTZUNG] | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard schweizweit | FINMA RS 2012/3 |

#### 7. Nutzungsregulierung

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `nutzung_kurzzeitvermietung` | 0 | Keine spezifische Airbnb-Regulierung in Biel bekannt [SCHÄTZUNG] | — |
| `nutzung_umnutzungsverbot` | 1 | Wohnzonen-Schutz in Baureglements; weniger strikt als ZH [SCHÄTZUNG] | Baureglements Biel |
| `nutzung_abbruchverbot` | 1 | Prüfpflicht bei Abbrüchen in Wohngebieten [SCHÄTZUNG] | Baugesetz Kanton Bern |
| `nutzung_zweitwohnungen` | 1 | ZWG-Deckel 20%; Biel nicht als Tourismusgemeinde betroffen | ZWG |

#### 8. Infrastruktur & Standortqualität

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `infra_oepnv` | 1 | Gut an SBB-Netz angebunden; Regio-Bus; Nähe zu Bern; nicht auf Niveau von Grossstädten [SCHÄTZUNG] | SBB; Stadt Biel |
| `infra_schule_kita` | 1 | Bedarfsgerechtes Schulnetz; Berufsschulen; keine Universität vor Ort;nextube/FFe [SCHÄTZUNG] | Stadt Biel |
| `infra_oeffentlicher_raum` | 1 | Aare und Seen als Erholungsraum; solide Qualität [SCHÄTZUNG] | — |
| `infra_wirtschaftsansiedlung` | 1 | Moderate Wirtschaftsförderung; Watch-Technologie-Cluster; watchmaking attraktiv; nicht so aktiv wie ZH/BS | Standortförderung Biel |

---

## Zusammenfassung: Leerwohnungsziffern (ressortübergreifend)

| Stadt | Kanton | Leerwohnungsziffer 2024 | Leerwohnungsziffer 2025 | Quelle |
|-------|--------|------------------------|------------------------|--------|
| Genf | GE | 0.46% | 0.34% | BFS/BWO/SRF Sept. 2025 |
| Basel-Stadt | BS | ~0.8% | 0.9% | Statistik BS 2024/2025 |
| Lausanne | VD | — | 0.58% | Tagesanzeiger Nov. 2025 |
| Winterthur | ZH | 0.14% | 0.18% | Stadt Winterthur Aug. 2024/2025 |
| Luzern (Stadt) | LU | — | 1.01% | Sunshine Sept. 2025 |
| St. Gallen (Stadt) | SG | 2.10% | — | Tagblatt Sept. 2024 |
| Biel/Bienne | BE | 1.08% | — | APF-Bienne Sept. 2024 |

**Interpretation der Kontextfaktoren für `zuwanderungsdruck`:**
- **+2:** Genf (0.34%), Winterthur (0.18%) — extrem angespannt
- **+1:** Basel (0.9%), Lausanne (0.58%), Biel (1.08%) — angespannt
- **0:** Luzern (1.01%), St. Gallen (2.1%) — entspannter Markt

---

## Anhang: Wichtige Kantonale Unterschiede (Zusammenfassung)

| Parameter | ZH | BE | BS | GE | VD | LU | SG |
|-----------|----|----|----|----|----|----|----|
| Bodenmehrwertabgabe | 40% (Aufz.) | 50% (Einz.)/40% (Aufz.) | 20% | 20% | 20% | 20% | 20% |
| Vorkaufsrecht | ✗ (abgelehnt 2025) | ✗ | ✗ | ✓ (kantonal) | ✓ (LPPPL 2020) | ✗ | ✗ |
| Gemeinnützig Mindestanteil | 33% (Ziel) | 1/3 (Gesetz) | — | — | — | — | — |
| Kantonale Mietregulierung | WRG ZH | — | Mietzinsdeckel | LDTR | — | — | — |
| Sanierungspflicht | Elektroheizungen 2030 | MuKEn 2025 | — | — | — | — | — |
| Handänderungssteuer | ✗ | ~1.8% | ✓ | ✓ | ✓ | ✓ | ✓ |

*Quellen-Übersicht: BFS, BWO, SNB, SRF, NZZ, Tagesanzeiger, Tagblatt, Statistik Basel-Stadt, Stadt Winterthur, LUSTAT, APF-Bienne, EY Schweiz, wbg-schweiz.ch, MV Schweiz, OR, RPG, BewG, DBG, StG der jeweiligen Kantone, Bundesgerichtsurteile, Volksabstimmungen Sept./Nov. 2025*
