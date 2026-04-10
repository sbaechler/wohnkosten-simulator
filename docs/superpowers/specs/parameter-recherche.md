# Parameter-Recherche: Wohnungsmarkt Schweiz

Erstellt: 2026-03-19  
Zweck: Erweiterung der 10 steuerbaren Parameter und 4 Kontextfaktoren des Prototyps.  
Grundlage: Web-Recherche zu politischen Initiativen, Volksabstimmungen und parlamentarischen Vorstössen der letzten 50 Jahre in der Schweiz.

---

## Bestehende Parameter (Prototyp)

### Steuerbare Parameter (10)
1. `raumplanung` — locker / mittel / streng
2. `bauvorschriften` — minimal / moderat / streng
3. `energetischeVorgaben` — minimal / moderat / streng
4. `mietrecht` — schwach / moderat / streng
5. `steuerpolitik` — niedrig / mittel / hoch
6. `foerderungGemeinnuetzig` — keine / moderat / stark
7. `subventionen` — keine / moderat / stark
8. `einspracherechte` — eingeschränkt / normal / weitreichend
9. `infrastruktur` — kein Ausbau / moderat / stark
10. `auslaendischeInvestitionen` — offen / reguliert / restriktiv (Lex Koller)

### Kontextfaktoren (4, read-only)
1. `zinsniveau` — sehr niedrig bis sehr hoch
2. `zuwanderungsdruck` — stark schrumpfend bis stark wachsend
3. `wirtschaftskraft` — sehr schwach bis sehr stark
4. `bevoelkerungstrend` — stark schrumpfend bis stark wachsend

---

## Neue Kandidaten: Steuerbare Parameter

Diese sind politisch steuerbar (durch Gesetz, Initiative, Verordnung, Zonenplan) und beeinflussen Wohnpreise indirekt.

### Bodenpolitik & Eigentumsverhältnisse

#### `vorkaufsrecht` — kein / kommunal / kantonal
**Was:** Gemeinden oder Kantone erhalten ein Vorkaufsrecht beim Verkauf von Liegenschaften. Erlaubt öffentliche Hand, Grundstücke zu erwerben und gemeinnützig zu vergeben (Baurecht).  
**Politische Verankerung:**
- Volksinitiative «Mehr bezahlbare Wohnungen» (2020, abgelehnt) forderte u.a. Vorkaufsrecht für Gemeinden
- Lausanne hat kommunales Vorkaufsrecht (erfolgreich umgesetzt, Vorbild für andere Städte)
- Zürich übernimmt das Modell (Tagesanzeiger, Nov. 2025)
- Luzern parlamentarische Diskussion 2026
- Städteverband empfiehlt Vorkaufsrecht in Positionspapier zur Wohnpolitik  
**Wirkung:** Angebot ↑ (gemeinnütziger Anteil steigt), Preise ↓ (langfristig), Eigentümerschaft → mehr Genossenschaften/öffentliche Hand

#### `baulandhortung` — erlaubt / Abgabe / Bauverpflichtung
**Was:** Massnahmen gegen das Horten von Bauland ohne Bebauungsabsicht. Varianten: Mehrwertabgabe, kommunale Bauverpflichtung, Nutzungsgebot gemäss RPG.  
**Politische Verankerung:**
- RPG Art. 15a: Nutzungsgebot (Bauverpflichtung) für Gemeinden seit RPG-Revision 2013
- Mehrwertabgabe bei Auf- und Umzonungen (RPG-Pflicht ab 2019)
- Parlamentarische Vorstösse für schärfere Bauverpflichtungen (i-rem.ch, 2026)  
**Wirkung:** Angebot ↑ (Bauland wird mobilisiert), Preise ↓

#### `mindestanteilGemeinnuetzig` — 0% / 10% / 20%+
**Was:** Gesetzliche Pflicht, dass ein Mindestanteil neu gebauter Wohnungen gemeinnützig sein muss (Genossenschaften, Stiftungen, öffentliche Hand).  
**Politische Verankerung:**
- Volksinitiative «Mehr bezahlbare Wohnungen» (2016 eingereicht, 2020 abgelehnt): forderte **10% gemeinnützigen Wohnungsbau** aller Neubauten
- Kanton Zürich: Gemeinden können bei Mehrausnutzung Mindestanteil preisgünstigen Wohnraum verlangen
- Stadt Zürich: 33%-Ziel für gemeinnützige Wohnungen (langfristiges Planungsziel)  
**Wirkung:** Angebot ↑ (gefördertes Segment), Preise ↓ (Durchschnitt), Eigentümerschaft → mehr Genossenschaften

#### `bodeneigentumssteuer` — keine / leicht / hoch
**Was:** Steuer auf Boden (nicht Gebäude), die Hortung unbebauter oder untergenutzter Liegenschaften unattraktiv macht.  
**Politische Verankerung:**
- Mehrfach diskutiert in der Schweiz, aber nie flächendeckend eingeführt
- Mehrwertabgabe bei Umzonungen (RPG) ist eine verwandte Massnahme  
**Wirkung:** Angebot ↑ (Druck auf Eigentümer), Preise ↓ (langfristig)

---

### Mietrecht (Konkretisierungen)

#### `mietzinstransparenz` — keine / Formular / Vormiete + Index
**Was:** Pflicht zur Bekanntgabe des Vormietzinses bei Neuvermietung, inklusive Referenzzinssatz und Konsumentenpreisindex des Vormieters.  
**Politische Verankerung:**
- Parlamentarische Initiative Mieterverband 2023: «Transparenz bei Mieterwechsel»
- Ab **1. Oktober 2025** neu: Formular muss Referenzzinssatz + LIK-Stand des Vormieters ausweisen (Art. 19 Abs. 2 VMWG)
- Nationalrat hat Initiative zur Erschwerung der Anfangsmietenanfechtung ohne Gegenstimme abgeschrieben (März 2025)  
**Wirkung:** Nachfrage (Transparenz macht Überhöhungen anfechtbar), Preise ↓ (indirekter Dämpfer bei Mieterwechseln)

#### `anfangsmieteAnfechtung` — schwach / moderat / einfach
**Was:** Erleichterung der Anfechtung von Anfangsmietzinsen als missbräuchlich, ohne Einschränkung auf «persönliche Notlage» oder «angespannte Marktlage».  
**Politische Verankerung:**
- Parlamentarische Initiative Berberat: Anfangsmiete anfechtbar ohne persönliche Notlage
- Realit Dossier Mietrechtsrevision: Dauerdiskussion seit 1990ern
- Aktuelle Mietpreis-Initiative (2025): Verfassungsverankerung der «Kostenmiete»  
**Wirkung:** Nachfrage (Mieter besser geschützt), Preise ↓

#### `kostenmiete` — Marktmiete / reguliert / Kostenmiete
**Was:** Gesetzliche Bindung des Mietzinses an Kostenmiete (Gestehungskosten + gedeckelte Rendite von max. 2% + Referenzzinssatz), statt freier Marktmiete.  
**Politische Verankerung:**
- Volksinitiative «Ja zum Schutz vor missbräuchlichen Mieten (Mietpreis-Initiative)» (2025, lanciert vom MV/SP): fordert Verankerung der Kostenmiete in der Bundesverfassung
- Bundesgericht 2020: Bruttorendite maximal 2% + Referenzzinssatz (= heute 3,5%)
- Historisch: Mietrechtsrevision 2006 gescheitert, Diskussion über Indexmiete vs. Kostenmiete  
**Wirkung:** Nachfrage (keine Spekulation), Preise ↓ kurzfristig, Angebot ↓ langfristig (weniger Investitionsanreiz)

**Quantitative Evidenz (FHNW-Studie Ters/Kholodilin 2025, Genf 1994–2022):**
- Mietpreisregulierung (Preisrestriktion): Rückgang institutioneller Neubauinvestitionen **−100 Mio. CHF** (statistisch schwach); kein klarer Effekt bei privaten Investoren
- Kurzfristig (+1–5 Jahre): private Renovationen steigen um ca. **+150 Mio. CHF** (Kapital fliesst in Bestandserneuerung statt Neubau)
- Sobald keine weiteren Aufwertungen möglich sind, die eine höhere Miete rechtfertigen: **Renovationsanreize erlöschen** (kein langfristiger Effekt)
- Leerstände reagieren **nicht** auf Mietpreisregulierung (Leerstände unverändert)
- **Preisspreizung Bestandsmieter vs. Neumieter:** In Genf zahlen Neumieter im Schnitt **~30% mehr** pro m² als Bestandsmieter; Zürich (kein Mietpreisdeckel): nur ~18% Differenz
- Genf hat mit **372 CHF/m²/Jahr** die höchsten Angebotsmieten aller 5 grössten Schweizer Städte — ein Hinweis auf systemischen Marktdruck trotz (und wegen) strenger Regulierung
- Fazit: Mietpreisregulierung schützt Bestandsmieter, schadet aber Neumietern (Junge, Zuzügler, Migrant:innen) durch höhere Einstiegsmieten und reduziertes Angebot
- *Quelle: Prof. Dr. Kristyna Ters (FHNW) & Konstantin Kholodilin (DIW Berlin), «Restrictive rental policies and a tough trade off: Lower rents vs. less construction in Geneva», Nov. 2025*

#### `kuendigungsschutz` — schwach / moderat / stark
**Was:** Stärke des Schutzes gegen Kündigung für Modernisierung/Sanierung/Eigennutzung. Massnahmen gegen «Renovierungen als Vorwand» für Mieterhöhungen.  
**Politische Verankerung:**
- Motion Dandrès 24.4371: «Renovierungen sollen nicht als Vorwand für missbräuchliche Mieten dienen»
- Motion Sommaruga 24.4337: Vorabprüfung bei Massenkündigungen  
**Wirkung:** Nachfrage (weniger Verdrängung), Preise ↓ kurzfristig, Angebot ↓ langfristig (Eigentümer investieren weniger)

**Quantitative Evidenz (Basel-Stadt Wohnschutz-Initiative, SVIT/HEV/Swiss Real Estate Institute 2025):**
- Basel Wohnschutzverordnung (in Kraft Mai 2022): Abriss, Ersatzneubau und Sanierungen bewilligungspflichtig + Mietzinsobergrenzen
- Geplante Wohneinheiten eingebrochen: **1078 (2018) → 67 (2023) = −95%**; Baugesuche −76% (784 → 190) im Vergleich zu Referenzstädten
- Zürich im selben Zeitraum: **+20%** mehr Baugesuche; Basel-Landschaft, Bern, Winterthur, Luzern: −2% bis −35% (Zinseffekt), aber Basel-Stadt −76% ist deutlich stärker
- **Zielkonflikt Klimaschutz:** Regierung Basel-Stadt (2023): «Abnahme der Sanierungstätigkeit erfasst alle Wohnungen, nicht nur Rendite-Sanierungen» — energetische Sanierungen erfolgen meist als Totalsanierungen, deshalb Konflikt mit Netto-Null-Ziel 2037
- *Quelle: SVIT, HEV, Swiss Real Estate Institute, «Auswirkungen der Wohnschutzinitiative im Kanton Basel-Stadt», Jan. 2025*

---

### Nutzungsregulierung

#### `zweckentfremdungsverbot` — keine / Meldepflicht / Bewilligung
**Was:** Regulierung der Kurzzeitvermietung (Airbnb, Business Apartments) und Umnutzung von Wohnraum zu Büros. Verhindert Abfluss von Wohnraum aus dem Mietmarkt.  
**Politische Verankerung:**
- Zürich: max. 90 Vermietungstage/Jahr in Wohnzonen (seit Januar 2024)
- Volksinitiative Zürich «Wohnraum schützen – Airbnb und Business Apartments regulieren» (2026, vom Stadtrat für gültig erklärt)
- Nationalrat hat Regeln für Untervermietung verschärft (2023): Kündigung ohne schriftliche Zustimmung möglich
- SAB-Studie Airbnb-Regulierung Schweiz (Nov. 2024): verschiedene Kantonsansätze dokumentiert  
**Wirkung:** Angebot ↑ (Wohnraum bleibt im Mietmarkt), Preise ↓ (langfristig in touristischen Lagen)

#### `umnutzungsverbot` — keine / kantonales / striktes
**Was:** Verbot der Umnutzung von Wohnraum zu Büros, Hotels oder anderen kommerziellen Zwecken in angespannten Märkten. Umfasst auch Abbruchverbot und Rationierungsregeln (Bewilligungspflicht für Abriss/Ersatzneubau).  
**Politische Verankerung:**
- Einzelne Kantone und Städte haben Umnutzungsvorschriften
- Grundlage: kantonale Baugesetze (insbesondere in Wohnzonen)
- Genf LDTR (seit 1983, totalrevidiert 1996): Abrisse, Umbauten und Renovationen bewilligungspflichtig; Ersatzvorgaben, Mietobergrenzen, Umsiedlungspflichten
- Basel Wohnschutzverordnung (2022): direktes Pendant zum Genfer Modell für die Schweiz  
**Wirkung:** Bestandsschutz ↑ (Wohnraum bleibt Mietmarkt), aber **Neubau ↓↓** (stärkste Bremswirkung aller Regulierungstypen)

**Quantitative Evidenz — Wohnungsrationierung (FHNW-Studie Ters/Kholodilin 2025, Genf 1994–2022):**
- **Wichtigste Erkenntnis:** Wohnungsrationierung (Mengenrestriktion) bremst Investitionen **deutlich stärker** als Mietpreisregulierung (Preisrestriktion)
- Aggregierter Rückgang der Bauinvestitionen nach Rationierungsschocks: **−600 Mio. CHF** (≈ 11% der Genfer Bauausgaben, ≈ 1% des Genfer BIP)
- Institutionelle Investoren überdurchschnittlich betroffen: Neubaurückgang **−400 Mio. CHF** (höhere Bewilligungsrisiken, längere Projektlaufzeiten, gedrückte Bodenwerte)
- Private Investoren: kurzfristig Renovation ↑ (**+200 Mio. CHF**, Jahre 1–3), dann Rückgang
- **Leerstände sinken** nach Rationierungsschocks (Granger-Kausalität belegt) → politisch induzierte Verknappung
- Aktivität verlagert sich von Neubau zu bestandserhaltenden Renovationen → mittelfristig sinkende Marktrotation, weniger freie Wohnungen
- **Renovationsrückstand:** Genf 83% der Gebäude >40 Jahre nie umfassend modernisiert; Basel 48%; Zürich 41%
- *Quelle: Prof. Dr. Kristyna Ters (FHNW) & Konstantin Kholodilin (DIW Berlin), Nov. 2025*

#### `verdichtungsforderung` — optional / empfohlen / verpflichtend
**Was:** Pflicht zur Innenverdichtung (Aufstockung, Aufzonierung) statt Neuüberbauung auf der grünen Wiese. Erhöht Ausnützungsziffer, fördert Hochhäuser und dichte Bauformen.  
**Politische Verankerung:**
- RPG-Revision 2013: Siedlungsentwicklung nach innen ist Pflicht (Art. 1 RPG)
- ARE-Studie «Regelungen zur Förderung der Verdichtung» (2026)
- Kanton Zürich: Mehrausnutzung als Instrument für mehr preisgünstigen Wohnraum  
**Wirkung:** Angebot ↑ (mehr Wohnungen pro Fläche), Preise ↓ (mehr Angebot)

---

### Soziale Durchmischung & Belegung

#### `belegungsvorschriften` — keine / Empfehlung / Pflicht
**Was:** Vorschriften über die Mindest- und Maximalbelegung von Wohnungen, insbesondere bei gemeinnützigen Wohnungen. Ziel: effiziente Nutzung und soziale Durchmischung.  
**Politische Verankerung:**
- Genossenschaften wie ABZ, Wogeno etc. wenden Belegungsvorschriften an (i.d.R. max. 1 Zimmer mehr als Personen)
- Subventionierte Sozialwohnungen: strikte Einkommens- und Belegungsvorschriften durch Kanton (al-zh.ch 2024)
- Die Volkswirtschaft 2015: Belegungsvorschriften als «probates Mittel» im gemeinnützigen Wohnungsbau  
**Wirkung:** Angebot ↑ (weniger Unterbelegung, mehr verfügbare Wohnungen), Preise neutral

#### `sozialmischungspflicht` — keine / empfohlen / verpflichtend
**Was:** Auflage bei Neu- oder Umbauten, verschiedene Einkommensgruppen zu durchmischen. Z.B. Pflicht zu einem Anteil preisgünstiger Wohnungen bei Aufzonierungen.  
**Politische Verankerung:**
- Stadt Zürich: Pflicht zu preisgünstigem Wohnanteil bei Mehrausnutzungen (SP Zürich, Sept. 2025)
- Mehrwertausgleich bei Auf- und Umzonungen als Instrument  
**Wirkung:** Nachfrage (breitere Schichten können in begehrten Lagen wohnen), Preise ↓ (subventioniertes Segment)

---

### Finanzierung & Förderinstrumente

#### `wohnbaufoerderungsfonds` — kein / kantonaler / nationaler
**Was:** Staatlicher Fonds (z.B. «Fonds de Roulement»), der zinsgünstige Darlehen an gemeinnützige Bauträger vergibt.  
**Politische Verankerung:**
- Fonds de Roulement des Bundes: bestehendes Instrument, mehrfach aufgestockt
- Wohnbaugenossenschaften Schweiz fordert Aufstockung (wbg-schweiz.ch, aktuell)
- Nationalrat 2025: 104 gegen 78 Stimmen für Eintreten auf Volksinitiative + Fonds-Aufstockung  
**Wirkung:** Angebot ↑ (mehr gemeinnütziger Bau finanzierbar), Preise ↓ (Durchschnitt)

#### `eigentumsfoerderung` — keine / Prämien / Bürgschaften
**Was:** Staatliche Förderung von selbst genutztem Wohneigentum (Prämien, Bürgschaften, günstige Hypotheken). Gegenstück zur Mieterförderung.  
**Politische Verankerung:**
- Wohnbauförderungsgesetz (WFG) 1974: historische Basis der Schweizer Wohnraumförderung
- Eigenheimgenossenschaften als Instrument (seit 1970er)
- Debatte um Abzugsfähigkeit Eigenmietwert (mehrfach traktandiert)  
**Wirkung:** Nachfrage ↑ (mehr Eigentümer), Preise ↑ (erhöhte Nachfrage im Eigentumsmarkt), Mietangebot ↓ (weniger Mietwohnungen)

---

### Planungs- und Bauprozesse

#### `digitalisierungBaugesuche` — analog / teildigital / volldigital
**Was:** Digitalisierung und Standardisierung von Baubewilligungsverfahren. Verkürzt die Zeit von Idee bis Baubewilligung.  
**Politische Verankerung:**
- Mehrere Kantone digitalisieren Baugesuchsprozesse
- Bundesrätliches Programm zur Vereinfachung von Baugenehmigungen  
**Wirkung:** Angebot ↑ (schnellerer Bau), Preise ↓ (langfristig)

#### `einspracherechteKonkretisiert` (bestehender Parameter, Konkretisierung)
Der Prototyp-Parameter `einspracherechte` kann präziser unterteilt werden in:
- **Einspracherecht Dritter:** Kann auch Nicht-Direkt-Betroffene Einsprache erheben?
- **Suspensiveffekt:** Stoppt eine Einsprache automatisch die Baubewilligung?
- **Einsprachefrist:** Wie lang haben Parteien Zeit?

---

## Neue Kandidaten: Kontextfaktoren (nicht steuerbar)

Diese Faktoren beeinflussen den Wohnungsmarkt, sind aber von der Politik nicht direkt steuerbar.

#### `leerwohnungsziffer` — sehr niedrig / normal / hoch
**Was:** Anteil leerstehender Wohnungen am Gesamtbestand. Unter 1% gilt als angespannt, über 2% als entspannt.  
**Quelle:** Bundesamt für Statistik, jährliche Erhebung; HEV Schweiz  
**Wirkung:** Direkt auf Preise und Mieterhöhungspotenzial

#### `hypothekarvolumen` — tief / mittel / hoch
**Was:** Gesamtvolumen der ausstehenden Hypotheken im Verhältnis zur Wirtschaftsleistung. Indikator für Kreditverfügbarkeit und Immobilienblasenrisiko.  
**Wirkung:** Angebot (Baufinanzierung), Nachfrage (Eigentumsmarkt)

#### `pendlereinzugsgebiet` — klein / mittel / gross
**Was:** Grösse des funktionalen Wirtschaftsraums, aus dem Pendler zur Arbeit in die Stadt fahren. Beeinflusst die Reichweite des Nachfragedrucks.  
**Wirkung:** Nachfrage ↑ in der Kernstadt, verteilt Druck auf Umland

#### `wohnflaecheProPerson` — kompakt / mittel / grosszügig
**Was:** Durchschnittliche Wohnfläche pro Person in der Stadt. Sinkt bei Knappheit, steigt bei Überangebot. Indikator für Wohnraumdruck.  
**Wirkung:** Kontextindikator für Marktsättigung

#### `tourismusintensitaet` — gering / moderat / hoch
**Was:** Anteil des Tourismus an der lokalen Wirtschaft und Nachfrage nach Kurzzeitunterkünften. Relevant für Airbnb-Regulierung und Zweitwohnungsmarkt.  
**Wirkung:** Angebot ↓ (Wohnraum in Airbnb), Preise ↑ in touristischen Lagen

---

## Historische Meilensteine (Schweiz, letzte 50 Jahre)

| Jahr | Ereignis | Typ |
|------|----------|-----|
| 1974 | Wohnbauförderungsgesetz (WFG): Bundeshilfe für preisgünstigen Wohnbau | Gesetz |
| 1983 | Lex Koller (BewG): Beschränkung ausländischer Grundstückskäufe | Gesetz |
| 1990 | OR-Revision Mietrecht: Einführung des Schutzes vor missbräuchlichen Mieten | Gesetz |
| 2007 | Einführung nationaler Referenzzinssatz (VMWG) statt Kantonalbank-Hypothekarsätzen | Verordnung |
| 2013 | RPG-Revision: Innenverdichtung als Pflicht, Mehrwertabgabe | Gesetz |
| 2016 | Volksinitiative «Mehr bezahlbare Wohnungen» eingereicht (MV/SP) | Initiative |
| 2017 | Volksinitiative «Zersiedelung stoppen» angenommen | Initiative |
| 2019 | Mehrwertabgabe bei Umzonungen bundesweit verpflichtend (RPG) | Gesetz |
| 2020 | Volksinitiative «Mehr bezahlbare Wohnungen» abgelehnt (57% Nein) | Initiative |
| 2020 | Bundesgericht: Rendite max. 2% + Referenzzinssatz (Kostenmiete-Urteil) | Gerichtsentscheid |
| 2023 | Parlament verschärft Untervermietungsregeln (Kündigung ohne Zustimmung) | Gesetz |
| 2023 | Parlamentarische Initiative Mieterverband: Transparenz Vormietzins | Initiative |
| 2024 | Zürich: max. 90 Tage Airbnb-Vermietung in Wohnzonen | Kommunale Verordnung |
| 2025 | Volksinitiative «Mietpreis-Initiative» lanciert (Kostenmiete in Verfassung) | Initiative |
| 2025 | Ab Oktober: Formular muss Referenzzinssatz + LIK des Vormieters ausweisen | Verordnung |
| 2026 | Volksinitiative Zürich «Wohnraum schützen – Airbnb regulieren» für gültig erklärt | Initiative |

---

## Empfehlung: Strukturierung in Überkategorien

Die 10 bisherigen Parameter könnten als Überkategorien dienen, darunter jeweils 2–4 konkretere Sub-Parameter:

| Überkategorie (bestehend) | Mögliche Sub-Parameter (neu) |
|---------------------------|-------------------------------|
| `raumplanung` | Verdichtungsforderung, Baulandhortung, Ausnützungsziffer |
| `bauvorschriften` | Digitalisierung Baugesuche, Einspracherechte (Suspensiveffekt) |
| `mietrecht` | Mietzinstransparenz, Anfangsmiete-Anfechtung, Kostenmiete, Kündigungsschutz |
| `foerderungGemeinnuetzig` | Mindestanteil gemeinnützig, Wohnbauförderungsfonds, Belegungsvorschriften |
| `subventionen` | Eigentumsförderung, Sozialmischungspflicht |
| `auslaendischeInvestitionen` | Lex Koller (bestehend), Bodeneigentumssteuer |
| `steuerpolitik` | Eigenmietwert-Abzug, Grundstückgewinnsteuer |
| — (neu) | Vorkaufsrecht, Zweckentfremdungsverbot, Umnutzungsverbot |

---

*Quellen: BWO (Bundesamt für Wohnungswesen), MV (Mieterinnen- und Mieterverband), HEV Schweiz, WBG Schweiz, SP Zürich, Realit, SRF, NZZ, Tagesanzeiger, watson.ch, i-rem.ch, SAB (Nov. 2024), ARE (2026), FHNW/Ters/Kholodilin (Nov. 2025), SVIT/HEV/Swiss Real Estate Institute (Jan. 2025), wohn-initiativen-nein.ch*
