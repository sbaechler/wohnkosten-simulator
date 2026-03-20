# Parameter-Hierarchie: Steuerbare Parameter

Erstellt: 2026-03-19  
Überarbeitet: 2026-03-19 (Stufenwerte geprüft, aussagekräftige Texte, gemeinnuetzig_mindestanteil auf 0/10%/33%)  
Zweck: Vollständige, atomare Hierarchie der politisch steuerbaren Parameter für den Wohnkosten-Simulator.  
Prinzip: Jeder Parameter steuert genau **eine** Stellschraube. Überkategorien dienen nur der UI-Gruppierung.

---

## Designprinzipien

- **Atomar:** Jeder Parameter = eine einzige politische Massnahme oder ein einziges Instrument
- **Steuerbar:** Muss durch Gesetz, Verordnung, Volksinitiative oder kommunalen Entscheid beeinflussbar sein
- **3 Stufen:** Wert 0 / 1 / 2 mit aussagekräftigen Texten (keine Zahlenwerte ausser wo sinnvoll)
- **Richtung konsistent:** Stufe 0 = liberaler / weniger reguliert; Stufe 2 = stärker reguliert / interventionistischer
- **Unabhängig:** Parameter sollen möglichst orthogonal sein (keine starken Abhängigkeiten untereinander)

---

## Hierarchie

### 1. Bodenrecht & Landnutzung

> Wie wird der Boden als knappe Ressource verwaltet und verteilt?

| Key | Name (DE) | Stufe 0 | Stufe 1 | Stufe 2 |
|-----|-----------|---------|---------|---------|
| `raumplanung_zonenreserve` | Verfügbares Bauland | Grosszügige Reserven vorhanden | Knapp bemessen | Sehr knapp, kaum Neueinzonungen |
| `raumplanung_verdichtung` | Pflicht zur Innenverdichtung | Freiwillig | RPG-konform empfohlen | Gesetzlich verpflichtend |
| `raumplanung_ausnuetzungsziffer` | Zulässige Bebauungsdichte | Tief (lockere Bebauung) | Mittel (städtisch) | Hoch (dichte Überbauung erlaubt) |
| `boden_vorkaufsrecht` | Vorkaufsrecht der Gemeinde | Kein Vorkaufsrecht | Vorkaufsrecht für gemeinnützige Zwecke | Umfassendes kommunales Vorkaufsrecht |
| `boden_bauverpflichtung` | Massnahmen gegen Baulandhortung | Keine (Hortung erlaubt) | Mehrwertabgabe bei Nicht-Bebauung | Bauverpflichtung mit Frist und Abgabe |
| `boden_mehrwertabgabe` | Mehrwertabgabe bei Umzonung | Keine Abgabe | 20% (RPG-Minimum) | 50% oder mehr |
| `boden_bodeneigentumssteuer` | Steuer auf Bodenwert (unabhängig vom Gebäude) | Keine | Leichte Bodensteuer | Hohe Bodensteuer (Hortung unrentabel) |

---

### 2. Bau & Bewilligung

> Wie schnell und zu welchen Kosten kann gebaut werden?

| Key | Name (DE) | Stufe 0 | Stufe 1 | Stufe 2 |
|-----|-----------|---------|---------|---------|
| `bau_energievorgaben` | Energetische Anforderungen (Neubau) | Keine Pflicht | Minergie-Standard empfohlen | Netto-Null-Pflicht für alle Neubauten |
| `bau_sanierungspflicht` | Sanierungspflicht für Bestandsbauten | Keine | Zielwert empfohlen, kein Zwang | Gesetzliche Pflicht mit Frist |
| `bau_einspracherecht_dritte` | Einspracherecht Dritter | Nur direkt Betroffene | Anwohner im Umkreis | Offenes Einspracherecht (alle) |
| `bau_einspracherecht_suspensiv` | Suspensiveffekt von Einsprachen | Kein Baustopp (Bau läuft) | Baustopp in begründeten Fällen | Automatischer Baustopp bei jeder Einsprache |
| `bau_bewilligungsverfahren` | Effizienz des Baubewilligungsverfahrens | Analog, lange Wartezeiten | Teildigitalisiert, moderate Dauer | Volldigital, standardisiert, schnell |
| `bau_normenharmonisierung` | Harmonisierung kantonaler Bauvorschriften | 26 verschiedene kantonale Systeme | Teilweise harmonisiert | Einheitlicher Schweizer Standard (SIA) |

---

### 3. Gemeinnütziger Wohnungsbau & Förderung

> Wie stark wird nicht-renditeorientierter Wohnungsbau unterstützt?

| Key | Name (DE) | Stufe 0 | Stufe 1 | Stufe 2 |
|-----|-----------|---------|---------|---------|
| `gemeinnuetzig_mindestanteil` | Mindestanteil gemeinnütziger Neubauten | 0% (kein Mindestanteil) | 10% (Volksinitiative 2020) | 33% (Zürcher Stadtratsziel) |
| `gemeinnuetzig_foerderfonds` | Staatlicher Wohnbauförderungsfonds | Kein Fonds | Kantonaler Fonds mit begrenzten Mitteln | Nationaler Fonds de Roulement, gut ausgestattet |
| `gemeinnuetzig_baurecht` | Abgabe von Land im Baurecht an Genossenschaften | Selten, kein Vorrang | Aktive Vergabe bei freiem Land | Systematisches Prioritätsprinzip |
| `gemeinnuetzig_belegungsvorschriften` | Belegungsvorschriften (Zimmer pro Person) | Keine | Empfehlung (max. 1 Zimmer mehr als Personen) | Verbindliche Pflicht mit Kontrollrecht |
| `gemeinnuetzig_sozialmischung` | Preisgünstiger Wohnanteil bei Aufzonierung | Keine Auflage | Empfehlung (freiwillig) | Gesetzliche Pflicht (definierter %-Anteil) |

---

### 4. Mietrecht

> Wie werden Mieter vor Marktmacht geschützt?

| Key | Name (DE) | Stufe 0 | Stufe 1 | Stufe 2 |
|-----|-----------|---------|---------|---------|
| `mietrecht_kostenmiete` | Grundprinzip des Mietzinses | Freie Marktmiete | Rendite gedeckelt (max. 2% + Referenzzinssatz) | Kostenmiete in der Bundesverfassung verankert |
| `mietrecht_anfangsmiete` | Anfechtbarkeit des Anfangsmietzinses | Nur bei persönlicher Notlage | Bei angespanntem Wohnungsmarkt | Generell anfechtbar (ohne Einschränkung) |
| `mietrecht_mietzinstransparenz` | Bekanntgabe des Vormietzinses | Keine Pflicht | Formular mit Vormietzins, Referenzzinssatz und LIK | Vollständige Mietzinsgeschichte der Wohnung |
| `mietrecht_kuendigungsschutz` | Schutz vor Kündigung wegen Sanierung oder Eigennutzung | Schwacher Schutz | Erstreckungsrecht und Entschädigungspflicht | Vorabprüfung und Genehmigung bei Massenkündigungen |
| `mietrecht_mietzinsindex` | Mechanismus für Mietzinsanpassungen | Referenzzinssatz (heutiges System) | Landesindex der Konsumentenpreise (LIK) | Gesetzliche Kostenbindung (nur effektive Kosten) |
| `mietrecht_untervermietung` | Regeln für Untervermietung und Airbnb | Frei (keine Einschränkung) | Schriftliche Zustimmung des Vermieters nötig | Tageslimit (z.B. 90 Tage/Jahr) + Kündigung möglich |

---

### 5. Steuern & Abgaben

> Welche steuerlichen Anreize und Belastungen gelten für Wohneigentum und Investitionen?

| Key | Name (DE) | Stufe 0 | Stufe 1 | Stufe 2 |
|-----|-----------|---------|---------|---------|
| `steuer_grundstückgewinn` | Grundstückgewinnsteuer | Tief, unabhängig von Haltedauer | Progressiv (länger gehalten = tiefer) | Hoch, auch bei langer Haltedauer (spekulationshemmend) |
| `steuer_eigenmietwert` | Besteuerung des Eigenmietwerts | Abgeschafft (kein Eigenmietwert) | Heutiges System (fiktives Einkommen steuerbar) | Erhöhter Ansatz (stärkere Belastung von Wohneigentum) |
| `steuer_leerstandsabgabe` | Abgabe auf leer stehende Wohnungen | Keine | Kommunal möglich, nicht flächendeckend | Gesetzlich verpflichtend ab definiertem Leerstand |
| `steuer_handaenderung` | Handänderungssteuer beim Verkauf | Keine | Moderat (1–2%) | Hoch (3%+, dämpft Spekulation) |
| `steuer_kapitalgewinnprivatpersonen` | Kapitalgewinnbesteuerung für Privatpersonen | Keine (heutiger CH-Standard) | Ab einem Schwellenwert | Vollständige Besteuerung wie Unternehmensgewinne |

---

### 6. Kapital & Investitionen

> Wer darf in Schweizer Immobilien investieren, und zu welchen Bedingungen?

| Key | Name (DE) | Stufe 0 | Stufe 1 | Stufe 2 |
|-----|-----------|---------|---------|---------|
| `kapital_auslaendische_investoren` | Beschränkung ausländischer Grundstückskäufe (Lex Koller) | Aufgehoben / vollständig offen | Heutiger Stand (bewilligungspflichtig für Nicht-EU) | Verschärft / deutlich restriktiver |
| `kapital_institutionelle_regulierung` | Regulierung institutioneller Anleger (Fonds, REITs, Pensionskassen) | Keine Regulierung | Transparenzpflicht (Offenlegung Renditen) | Gesetzliche Renditebegrenzung |
| `kapital_hypothekarregulierung` | Kreditvergabe für Immobilienkäufe (LTV und Tragbarkeit) | Locker (hohe Belehnungsquoten) | Heutiger FINMA-Standard (80% LTV, 33% Tragbarkeit) | Streng (tieferer LTV, höhere Eigenkapitalpflicht) |

---

### 7. Nutzungsregulierung

> Welche Nutzungsformen von Wohnraum sind erlaubt oder eingeschränkt?

| Key | Name (DE) | Stufe 0 | Stufe 1 | Stufe 2 |
|-----|-----------|---------|---------|---------|
| `nutzung_kurzzeitvermietung` | Regulierung von Kurzzeitvermietungen (Airbnb u.ä.) | Vollständig frei | Meldepflicht und Tageslimit (z.B. 90 Tage/Jahr) | Bewilligungspflicht, strikte Beschränkung |
| `nutzung_umnutzungsverbot` | Umnutzung von Wohnraum zu Büro oder Hotel | Ohne Einschränkung erlaubt | Bewilligungspflichtig | In Wohnzonen grundsätzlich verboten |
| `nutzung_abbruchverbot` | Abbruch von Wohngebäuden bei Wohnungsknappheit | Kein Schutz | Prüfpflicht (Abbruch muss begründet sein) | Nur mit gleichwertigem Ersatzneubau zulässig |
| `nutzung_zweitwohnungen` | Anteil zulässiger Zweitwohnungen | Unbegrenzt | 20%-Deckel (heutiger CH-Standard, Weber-Initiative) | Strengere kommunale Limits (unter 20%) |

---

### 8. Infrastruktur & Standortqualität

> Wie attraktiv ist der Standort durch öffentliche Investitionen?

| Key | Name (DE) | Stufe 0 | Stufe 1 | Stufe 2 |
|-----|-----------|---------|---------|---------|
| `infra_oepnv` | Ausbau des öffentlichen Verkehrs | Kein Ausbau, bestehende Linien | Moderater Ausbau, besserer Takt | Starker Ausbau, neue Linien und Taktdichte |
| `infra_schule_kita` | Angebot an Schulen und Kinderbetreuung | Unterdurchschnittlich | Bedarfsgerecht | Überdurchschnittlich, Angebot übersteigt Nachfrage |
| `infra_oeffentlicher_raum` | Qualität von öffentlichem Raum und Grünflächen | Minimal, wenig Aufenthaltsqualität | Bedarfsgerecht | Hochwertig (Parks, Plätze, begrünte Quartiere) |
| `infra_wirtschaftsansiedlung` | Aktive Wirtschaftsförderung und Gewerbeansiedlung | Keine aktive Förderung | Moderate Anreize (Steuererleichterungen) | Starke Förderung (Gewerbezonen, tiefe Steuern) |

---

## Übersicht: Anzahl Parameter

| Kategorie | Anzahl atomare Parameter |
|-----------|--------------------------|
| 1. Bodenrecht & Landnutzung | 7 |
| 2. Bau & Bewilligung | 6 |
| 3. Gemeinnütziger Wohnungsbau | 5 |
| 4. Mietrecht | 6 |
| 5. Steuern & Abgaben | 5 |
| 6. Kapital & Investitionen | 3 |
| 7. Nutzungsregulierung | 4 |
| 8. Infrastruktur & Standortqualität | 4 |
| **Total** | **40** |

---

## Mapping: Alte → Neue Parameter

| Alter Parameter (Prototyp) | Neue atomare Parameter |
|----------------------------|------------------------|
| `raumplanung` | `raumplanung_zonenreserve`, `raumplanung_verdichtung`, `raumplanung_ausnuetzungsziffer` |
| `bauvorschriften` | `bau_normenharmonisierung`, `bau_bewilligungsverfahren` |
| `energetischeVorgaben` | `bau_energievorgaben`, `bau_sanierungspflicht` |
| `mietrecht` | `mietrecht_kostenmiete`, `mietrecht_anfangsmiete`, `mietrecht_mietzinstransparenz`, `mietrecht_kuendigungsschutz`, `mietrecht_mietzinsindex`, `mietrecht_untervermietung` |
| `steuerpolitik` | `steuer_grundstückgewinn`, `steuer_eigenmietwert`, `steuer_leerstandsabgabe`, `steuer_handaenderung` |
| `foerderungGemeinnuetzig` | `gemeinnuetzig_mindestanteil`, `gemeinnuetzig_foerderfonds`, `gemeinnuetzig_baurecht` |
| `subventionen` | `gemeinnuetzig_belegungsvorschriften`, `gemeinnuetzig_sozialmischung` |
| `einspracherechte` | `bau_einspracherecht_dritte`, `bau_einspracherecht_suspensiv` |
| `infrastruktur` | `infra_oepnv`, `infra_schule_kita`, `infra_oeffentlicher_raum`, `infra_wirtschaftsansiedlung` |
| `auslaendischeInvestitionen` | `kapital_auslaendische_investoren`, `kapital_institutionelle_regulierung` |
| *(neu)* | `boden_vorkaufsrecht`, `boden_bauverpflichtung`, `boden_mehrwertabgabe`, `boden_bodeneigentumssteuer`, `kapital_hypothekarregulierung`, `nutzung_kurzzeitvermietung`, `nutzung_umnutzungsverbot`, `nutzung_abbruchverbot`, `nutzung_zweitwohnungen`, `steuer_kapitalgewinnprivatpersonen` |
