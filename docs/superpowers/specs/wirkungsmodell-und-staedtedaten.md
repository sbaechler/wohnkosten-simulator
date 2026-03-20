# Wirkungsmodell & Städtedaten

Erstellt: 2026-03-19  
Methode: Recherche durch 6 parallele Subagenten; Quellen: wissenschaftliche Studien (NBER, SNB Working Papers, IZA, ETH/ARE), empirische Fallbeispiele (Auckland, Pittsburgh, Wien, USA), Schweizer Rechtsgrundlagen (RPG, OR, kantonale Gesetze), sowie eigene Einschätzungen wo markiert ([SCHÄTZUNG]).

---

## Teil 1: Wirkungsmodell — Kontextfaktoren

### `zinsniveau` — Hypothekarzinsen (–2 = sehr niedrig, +2 = sehr hoch)

| Dimension | Wirkung bei steigendem Zinsniveau |
|-----------|----------------------------------|
| Angebot | ↓ (Neubau teurer, weniger Projekte profitabel; „Lock-in"-Effekt bei Bestandshaltern) |
| Nachfrage | ↓ (Kaufkraft sinkt, Eigenheimkäufer bleiben weg) |
| Preisniveau (Kauf) | ↓ |
| Preisniveau (Miete) | ↑ (Verdrängung in Mietmarkt) |
| Eigentümerstruktur | Eigentumsquote ↓; Institutionelle mit langen Horizonten halten besser |

**Bei +2 (sehr hoch):** Kaufmarkt kollabiert, Transaktionsvolumen sinkt stark, Mietpreise steigen durch Nachfrageverlagerung. In der Schweiz verstärkt durch Koppelung Mietzins an Referenzzinssatz.  
**Zeitliche Wirkung:** Kurzfristig Nachfrageschock; mittelfristig Angebotsrückgang (Neubau wird eingestellt).  
**Stärke:** stark  
**Quellen:**
- Harvard JCHS (2023): 1 Prozentpunkt Rückgang der Hypothekarzinsen 2021 → +8 Prozentpunkte nominales Hauspreisswachstum 2021–2023
- J.P. Morgan Global Research: Higher policy rates weighed on not just demand but also supply (rate-lock effect)
- OFR Working Paper 25-02 (2025): Demand falls at same rate as effective price increases under debt constraints

**Aktueller CH-Wert (März 2026):** SNB-Leitzins –0.25%, Referenzzinssatz 1.25% → `zinsniveau` = **–1**

---

### `zuwanderungsdruck` — Bevölkerungswachstum durch Zuwanderung

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ~ kurzfristig (Neubau reagiert mit 3–5 Jahren Verzug) |
| Nachfrage | ↑↑ unmittelbar (neue Haushalte) |
| Preisniveau | ↑ proportional zur Wachstumsrate |
| Eigentümerstruktur | Zugewanderte mieten zunächst → Eigentumsquote ↓ |

**Bei +2:** Leerwohnungsziffern kollabieren gegen 0%, akute Wohnungsnot in Zentren, starker politischer Druck für Regulierung.  
**Zeitliche Wirkung:** Kurzfristig direkte Nachfragesteigerung (innerhalb Monaten); langfristig kann Neubau ausgelöst werden.  
**Stärke:** stark  
**Quellen:**
- **Saiz (2007), IZA DP No. 2189:** 1% Zuwanderungsanteil an Stadtbevölkerung → ~1% Anstieg Mieten und Immobilienpreise. Effekt ~10× stärker als auf Arbeitsmärkten.
- Ottaviano & Peri (2012): bestätigen Saiz-Befunde

---

### `wirtschaftskraft` — BIP/Kopf und Beschäftigungslage

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (Investoren bauen mehr, da Zahlungsfähigkeit höher) |
| Nachfrage | ↑ (höhere Einkommen, mehr Haushalte) |
| Preisniveau | ↑ (vor allem Luxussegment) |
| Eigentümerstruktur | Fördert Wohneigentum (höhere Tragbarkeit) |

**Bei +2:** Ausweitung des Wohnflächenkonsums, Investoren bauen vor allem im Hochpreissegment, günstige Altbauwohnungen werden verdrängt.  
**Zeitliche Wirkung:** Langfristig strukturell treibend.  
**Stärke:** mittel bis stark  
**Quellen:**
- NBER / US Congress Reports: Immobilienpreise und Wohnflächenkonsum korrelieren stark positiv mit Wirtschaftswachstum

---

### `bevoelkerungstrend` — Natürliches Bevölkerungswachstum

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (langsam, Familienhäuser in Agglomeration) |
| Nachfrage | ↑ (beständig, aber langsamer als Zuwanderung) |
| Preisniveau | ↑ (moderat, langfristig) |
| Eigentümerstruktur | Fördert Familien-Wohneigentum in Agglomeration |

**Bei +2:** Strukturelle Nachfragesteigerung nach Familienwohnungen, Suburbanisierung.  
**Zeitliche Wirkung:** Langsam, strukturell (Jahrzehnte).  
**Stärke:** schwach bis mittel  
**Quellen:**
- Mankiw & Weil (1989): Demographischer Wandel erklärt erheblichen Anteil der US-Hauspreisdynamik 1940–1990
- Freddie Mac: Household formation drive long-run demand

**Aktueller CH-Wert:** Ohne Zuwanderung würde CH schrumpfen → natürliches Wachstum aller drei Städte ≈ **–1**

---

## Teil 2: Wirkungsmodell — Steuerbare Parameter

### Kategorie 1: Bodenrecht & Landnutzung

---

#### `raumplanung_zonenreserve` — Verfügbares Bauland

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (grosszügig) / ↓ (sehr knapp) |
| Nachfrage | ~ |
| Preisniveau | ↓ (grosszügig) / ↑ (sehr knapp) |
| Eigentümerstruktur | Knappheit bevorzugt kapitalkräftige Investoren |

**Zeitliche Wirkung:** Langfristig (5–15 Jahre).  
**Stärke:** stark  
**Quellen:**
- **Glaeser & Gyourko (2003, NBER):** Restriktive Bodennutzung erklärt einen Großteil der Wohnpreisdifferenzen zwischen US-Städten.
- **Glaeser & Ward (2009, Journal of Urban Economics):** Jede Erhöhung der Mindestgrundstücksgrösse um 1/4 Acre → ~10% weniger Baugenehmigungen langfristig.
- **Raiffeisen Schweiz 2025:** In der Schweiz gibt es 9–16.7% unbebaute Wohnbauzonen; trotzdem entsteht kaum neuer Wohnraum, weil Horten lukrativer ist als Bauen.  
**Nebeneffekte:** Grosszügige Reserven → Zersiedelung; knappe Reserven → Baulandspekulati on.

---

#### `raumplanung_verdichtung` — Pflicht zur Innenverdichtung

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (verpflichtend) |
| Nachfrage | ~ (redistribuiert in Zentren) |
| Preisniveau | ↓ mittel- bis langfristig |
| Eigentümerstruktur | Shift zu Mehrfamilienhauseigentum und institutionellen Investoren |

**Zeitliche Wirkung:** Kurzfristig schwach; mittelfristig 3–7 Jahre.  
**Stärke:** mittel  
**Quellen:**
- **Auckland Unitary Plan (2016):** 75% der Einfamilienzonen auf mind. 3 Einheiten hochgezont. Bauvolumen stieg deutlich, relative Mieten sanken vs. anderen NZ-Städten. (Greenaway-McGrevy & Phillips, 2023, *Journal of Urban Economics*)
- **ARE Schweiz / ETH Zürich:** Innenverdichtung ist heute der Hauptweg für Wohnungszuwachs in der Schweiz, vor allem durch Umzonung von Industrie-/Gewerbeflächen.  
**Nebeneffekte:** Gentrifizierungsdruck; Widerstand durch NIMBY-Einsprachen; ohne Gemeinnützigkeitsanteil entsteht nur Marktpreissegment.

---

#### `raumplanung_ausnuetzungsziffer` — Zulässige Bebauungsdichte (FAR/AZ)

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ stark (hoch) |
| Nachfrage | ~ |
| Preisniveau | ↓ (langfristig) |
| Eigentümerstruktur | Hohe Dichte begünstigt institutionelle Investoren und gemeinnützige Bauträger |

**Zeitliche Wirkung:** Kurzfristig Bodenpreiseffekt; Baueffekt 3–7 Jahre.  
**Stärke:** stark (wenn bindende Restriktion vorhanden)  
**Quellen:**
- **Gyourko & Molloy (2015, NBER WP 20536):** FAR-Restriktionen (Floor-Area-Ratio) gehören zu den Schlüsselvariablen, die Wohnkosten in regulierten Märkten treiben.
- **ScienceDirect / Making Housing Affordable (2024):** FAR-Erhöhung → ~9% mehr Wohneinheiten in 5–10 Jahren. Stärkster Effekt wo bestehende Restriktionen bindend waren.

---

#### `boden_vorkaufsrecht` — Vorkaufsrecht der Gemeinde

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (gemeinnütziger Anteil steigt) |
| Nachfrage | ~ |
| Preisniveau | ↓ langfristig (Anteil nicht-renditegetriebener Wohnungen wächst) |
| Eigentümerstruktur | Mehr Genossenschaften und öffentliche Hand |

**Zeitliche Wirkung:** Langfristig (hängt von Umfang und Aktivierungsrate ab).  
**Stärke:** mittel  
**Quellen:**
- **Lausanne:** Erfolgreiches Modell des kommunalen Vorkaufsrechts, mehrfach aktiviert. Städteverband empfiehlt es als wirksames Instrument (Tagesanzeiger, Nov. 2025).
- **Wien:** Aktive Liegenschaftspolitik (Vorkauf, Baurecht) hat gemeinnützigen Anteil auf >50% gebracht.

---

#### `boden_bauverpflichtung` — Massnahmen gegen Baulandhortung

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (Bauland wird mobilisiert) |
| Nachfrage | ~ |
| Preisniveau | ↓ (mehr Angebot) |
| Eigentümerstruktur | ~ |

**Zeitliche Wirkung:** Mittelfristig (3–7 Jahre nach Einführung).  
**Stärke:** mittel  
**Quellen:**
- **RPG Art. 15a (Schweiz):** Nutzungsgebot für Gemeinden seit 2013; i-rem.ch (2026): Baulandhortung verschärft Wohnungsnot messbar.
- **Raiffeisen Schweiz 2025:** Trotz 9–16.7% unbebauter Wohnbauzonen kaum Neubau, weil Horten lukrativer ist als Bauen.  
**Nebeneffekte:** Eigentumsrechte können als verletzt empfunden werden → rechtliche Anfechtu ngen.

---

#### `boden_mehrwertabgabe` — Mehrwertabgabe bei Umzonung

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ~ (kann Anreiz zu Umzonung senken) |
| Nachfrage | ~ |
| Preisniveau | ~ (Aufkommen fliesst in Förderung → indirekt ↓) |
| Eigentümerstruktur | Abschöpfung von Spekulationsgewinnen bei Grossinvestoren |

**Zeitliche Wirkung:** Langfristig durch Reinvestition.  
**Stärke:** schwach bis mittel (direkt); mittel (via Verwendung der Mittel)  
**Quellen:**
- **RPG Art. 5 (Schweiz):** Bundesweite Pflicht zu mind. 20% Mehrwertabgabe bei Einzonungen seit 2019.
- **Kanton Bern:** 50% Abgabe → finanziert kantonalen Wohnbaufonds; i-rem.ch und ARE-Bericht (2026) dokumentieren Wirksamkeit.  
**Nebeneffekte:** Zu hohe Abgabe kann Umzonungsprojekte unrentabel machen → Angebotsrückgang.

---

#### `boden_bodeneigentumssteuer` — Steuer auf Bodenwert

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (Hortung unrentabel, Druck zu Bebauung) |
| Nachfrage | ~ |
| Preisniveau | ↓ (mehr Angebot, Bodenpreise sinken) |
| Eigentümerstruktur | Benachteiligt spekulativen Bodenerwerb |

**Zeitliche Wirkung:** Mittel- bis langfristig.  
**Stärke:** stark (wenn konsequent umgesetzt)  
**Quellen:**
- **Oates & Schwab (1997), National Tax Journal:** Pittsburgh verdoppelte Bodensteuer relativ zu Gebäudesteuer in 1980er Jahren → Bautätigkeit stieg um 70.4% in den folgenden 10 Jahren, während vergleichbare Städte stagnierten. Klassischer Beleg für Wirksamkeit der Bodenwertsteuer.

---

### Kategorie 2: Bau & Bewilligung

---

#### `bau_energievorgaben` — Energetische Anforderungen (Neubau)

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ (höhere Baukosten reduzieren Neubau) |
| Nachfrage | ↑ leicht (energieeffiziente Wohnungen attraktiver) |
| Preisniveau | ↑ (höhere Erstellungskosten) |
| Eigentümerstruktur | ~ |

**Zeitliche Wirkung:** Kurzfristig Kostensteigerung; langfristig Betriebskostenersparnis für Mieter.  
**Stärke:** mittel  
**Quellen:**
- **NAHB / MIT (USA):** Strenge Energievorgaben erhöhen Neubaukosten um 5–15% und reduzieren Neubau um ~12% (Median über Studien). 
- **CRED Uni Bern / BWO CH:** Energetische Sanierungspflichten erhöhen Investitionskosten, können aber durch Mietzinserhöhungen auf Mieter überwälzt werden.  
**Nebeneffekte:** Energievorgaben können als Vorwand für Renovationskündigungen und Mieterhöhungen genutzt werden.

---

#### `bau_sanierungspflicht` — Sanierungspflicht Bestand

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ kurzfristig (Sanierungen binden Kapital, weniger Neubau) |
| Nachfrage | ~ |
| Preisniveau | ↑ (Kosten werden auf Mieter überwälzt) |
| Eigentümerstruktur | Benachteiligt kleine Eigentümer (Kapitalmangel); institutionelle profitieren |

**Zeitliche Wirkung:** Kurzfristig Kostensteigerung; langfristig Energieeinsparung und Gebäudewertsteigerung.  
**Stärke:** mittel  
**Quellen:**
- **BWO CH / Raiffeisen 2025:** Pflicht-Sanierungen werden oft als Anlass für Wohnungskündigungen genutzt (Verdrängungsrisiko).

---

#### `bau_einspracherecht_dritte` — Einspracherecht Dritter

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ (Verzögerungen → weniger Projekte) |
| Nachfrage | ~ |
| Preisniveau | ↑ (Knappheit durch verzögerte Projekte) |
| Eigentümerstruktur | ~ |

**Zeitliche Wirkung:** Kurzfristig direkte Verzögerungseffekte.  
**Stärke:** mittel  
**Quellen:**
- **Avenir Suisse / SRF:** Durchschnittliche Bewilligungsdauer in der Schweiz 157 Tage; jede Einsprache verteuert Projekte durch Zinsverlust (Handelszeitung: ~1–3% Verteuerung pro Verzögerungsjahr).

---

#### `bau_einspracherecht_suspensiv` — Suspensiveffekt von Einsprachen

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ (Baustopp bei Einsprachen = direkte Verzögerung) |
| Nachfrage | ~ |
| Preisniveau | ↑ |
| Eigentümerstruktur | ~ |

**Zeitliche Wirkung:** Kurzfristig direkt (Baustopp).  
**Stärke:** mittel  
**Quellen:** [SCHÄTZUNG basierend auf allgemeinen Erkenntnissen zu Bürokratiekosten; keine spezifische Studie gefunden]  
**Nebeneffekte:** Suspensiveffekt schützt berechtigte Interessen, aber auch strategische Einsprachen (NIMBY).

---

#### `bau_bewilligungsverfahren` — Effizienz des Baubewilligungsverfahrens

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (schneller Bau) |
| Nachfrage | ~ |
| Preisniveau | ↓ (mehr Angebot) |
| Eigentümerstruktur | ~ |

**Zeitliche Wirkung:** Mittelfristig (Digitalisierung braucht 2–4 Jahre Implementierung).  
**Stärke:** mittel  
**Quellen:**
- **UCLA-Studie (USA):** 25% kürzere Genehmigungsdauer → 33% mehr Wohnungsbau.
- **Avenir Suisse CH:** Harmonisierung und Digitalisierung könnten Baukosten um CHF 2.4–6 Mrd./Jahr senken.

---

#### `bau_normenharmonisierung` — Harmonisierung kantonaler Bauvorschriften

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (niedrigere Planungskosten, mehr überkantonale Projekte) |
| Nachfrage | ~ |
| Preisniveau | ↓ (Effizienzgewinne) |
| Eigentümerstruktur | ~ |

**Zeitliche Wirkung:** Langfristig (strukturelle Reform).  
**Stärke:** schwach bis mittel  
**Quellen:**
- **Avenir Suisse CH:** 26 verschiedene kantonale Systeme verursachen jährlich CHF 2.4–6 Mrd. Mehrkosten; IVHB (17/26 Kantone umgesetzt) bringt bereits Vorteile.

---

### Kategorie 3: Gemeinnütziger Wohnungsbau & Förderung

---

#### `gemeinnuetzig_mindestanteil` — Mindestanteil gemeinnütziger Neubauten (0% / 10% / 33%)

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ kurzfristig; ~ langfristig (wenn Kompensation via Dichtebonus) |
| Nachfrage | ~ |
| Preisniveau (Markt) | ↑ kurzfristig (Rendite sinkt); ↓ Gesamtmietniveau langfristig |
| Eigentümerstruktur | Verschiebung zu gemeinnützigen Trägern |

**Zeitliche Wirkung:** Kurzfristig Reduktion Bauprojekte; langfristig Vergrösserung des geschützten Segments.  
**Stärke:** mittel bis stark  
**Quellen:**
- **Manhattan Institute (2023):** Inclusionary Zoning hemmt privaten Wohnungsbau wenn keine Kompensation.
- **San Francisco (2023):** 33%-Anforderung off-site als wirtschaftlich unrentabel eingestuft → Projekte werden nicht realisiert.
- **Seattle / ScienceDirect (2026):** Upzoning mit 33%-Auflage → Rückgang Baugenehmigungen bei niedrigintensiven Projekten.  
**Nebeneffekte:** Quersubvention auf Marktmietende; Verlagerung in Gemeinden ohne Auflage.

---

#### `gemeinnuetzig_foerderfonds` — Staatlicher Wohnbauförderungsfonds

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (zinsgünstige Darlehen ermöglichen unrentable Projekte) |
| Nachfrage | ~ |
| Preisniveau (gefördert) | ↓ |
| Eigentümerstruktur | Stärkung gemeinnütziger Träger |

**Stärke:** mittel (begrenzt durch Fondsvolumen; Hebeleffekt durch revolvierendes Modell)  
**Quellen:**
- **Schweiz, Fonds de Roulement (WFG 2003):** Revolvierender Fonds; zinsgünstige, rückzahlbare Darlehen bis 90% Belehnung. Ohne diesen Fonds wären viele Projekte kleiner Träger nicht realisierbar.
- **Wien / Österreich:** Langjährige Fondslösung hat gemeinnützigen Anteil auf >50% gebracht.

---

#### `gemeinnuetzig_baurecht` — Abgabe von Land im Baurecht

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ langfristig dauerhaft |
| Nachfrage | ~ |
| Preisniveau | ↓↓ strukturell (Landkosten entfallen für Genossenschaften) |
| Eigentümerstruktur | Dauerhaft mehr Genossenschaften; Land bleibt in öffentlicher Hand |

**Stärke:** stark (langfristig)  
**Quellen:**
- **Wien / Zürich / Hamburg:** Baurechtsvergabe ist zentrales Instrument um Bodenspekulation zu umgehen und dauerhaft günstigen Wohnraum zu sichern. Zürich: ~30% des städtischen Landes im Baurecht an Genossenschaften.

---

#### `gemeinnuetzig_belegungsvorschriften` — Belegungsvorschriften

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (weniger Unterbelegung, mehr verfügbare Wohnungen) |
| Nachfrage | ~ |
| Preisniveau | neutral |
| Eigentümerstruktur | ~ |

**Stärke:** schwach  
**Quellen:**
- **Die Volkswirtschaft (2015):** Belegungsvorschriften als «probates Mittel» im gemeinnützigen Wohnungsbau zur effizienten Nutzung.
- **SGB / wbg-schweiz.ch:** In Genossenschaften max. 1 Zimmer mehr als Personen als Standard.

---

#### `gemeinnuetzig_sozialmischung` — Preisgünstiger Wohnanteil bei Aufzonierung

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ leicht (Rendite sinkt bei Auflagen) |
| Nachfrage | ~ (breitere Schichten können in begehrten Lagen wohnen) |
| Preisniveau | ↓ (subventioniertes Segment wächst) |
| Eigentümerstruktur | Mehr Genossenschaften in Zentren |

**Stärke:** mittel  
**Quellen:**
- **SP Zürich / Kanton ZH (2025):** Gemeinden können bei Mehrausnutzungen preisgünstigen Wohnanteil verlangen; BZO-Revision 2026 macht dies verbindlicher.

---

### Kategorie 4: Mietrecht

---

#### `mietrecht_kostenmiete` — Grundprinzip des Mietzinses

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ langfristig (weniger Investitionsanreiz) |
| Nachfrage | ~ |
| Preisniveau | ↓ kurzfristig; mögliche Angebotsverknappung langfristig |
| Eigentümerstruktur | Weniger institutionelle Investoren; mehr gemeinnützige Träger |

**Stärke:** stark  
**Quellen:**
- **Stanford-Studie (Diamond et al. 2019, QJE):** San Francisco Mietpreisbindung reduzierte Mietangebot um 15% langfristig (Eigentümer konvertieren zu Eigentumsnutzung).
- **Schweiz, OR Art. 269:** Aktuelle Rechtslage: Rendite max. 2% + Referenzzinssatz. BWO-Bericht: Marktmieten liegen oft weit über Kostenmiete (60–70% in Zürich).  
**Nebeneffekte:** Umgehung durch Konversion zu Stockwerkeigentum oder Eigennutzung; reduzierter Unterhalt.

---

#### `mietrecht_anfangsmiete` — Anfechtbarkeit des Anfangsmietzinses

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ leicht (Vermieter verlangen Aufschlag als Puffer) |
| Nachfrage | ~ |
| Preisniveau | ↓ (weniger Überhöhungen beim Mieterwechsel) |
| Eigentümerstruktur | ~ |

**Stärke:** schwach bis mittel  
**Quellen:**
- **MV Schweiz (2023):** Anfangsmiete-Anfechtung in der Praxis selten genutzt (zu hohe Hürden). Erweiterte Anfechtbarkeit würde Marktmieten beim Wechsel dämpfen.
- **SRF (März 2025):** Nationalrat schreibt Initiative zur Erschwerung der Anfechtung ohne Gegenstimme ab.

---

#### `mietrecht_mietzinstransparenz` — Bekanntgabe des Vormietzinses

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ~ |
| Nachfrage | ~ |
| Preisniveau | ↓ (Transparenz ermöglicht Anfechtung von Überhöhungen) |
| Eigentümerstruktur | ~ |

**Stärke:** schwach bis mittel  
**Quellen:**
- **MV Schweiz / BWO (2023–2025):** Ab Oktober 2025: Formular muss Vormietzins, Referenzzinssatz und LIK des Vormieters ausweisen.

---

#### `mietrecht_kuendigungsschutz` — Schutz vor Kündigung

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ langfristig (Eigentümer investieren weniger) |
| Nachfrage | ~ (weniger Verdrängung) |
| Preisniveau | ↓ kurzfristig; ↑ langfristig (Angebotsrückgang) |
| Eigentümerstruktur | ~ |

**Stärke:** mittel  
**Quellen:**
- **Motion Sommaruga 24.4337 / Motion Dandrès 24.4371 (2024):** Aktuelle Vorstösse gegen Renovierungsmissbrauch und Massenkündigungen belegen politische Relevanz.

---

#### `mietrecht_mietzinsindex` — Mietzinsanpassungsmechanismus

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ langfristig (weniger Investitionsanreiz bei Kostenbindung) |
| Nachfrage | ~ |
| Preisniveau | ↓ (LIK oder Kostenbindung dämpft Erhöhungen) |
| Eigentümerstruktur | ~ |

**Stärke:** mittel  
**Quellen:**
- **Realit.ch / BWO:** Referenzzinssatz-System seit 2008; LIK-Indexierung möglich aber selten genutzt. Kostenbindung entspräche einer Verfassungsänderung.

---

#### `mietrecht_untervermietung` — Regeln für Untervermietung und Airbnb

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (Wohnraum bleibt im Mietmarkt) |
| Nachfrage | ~ |
| Preisniveau | ↓ leicht in touristischen Lagen |
| Eigentümerstruktur | ~ |

**Stärke:** schwach bis mittel (lokal in touristischen Lagen stärker)  
**Quellen:**
- **Barron, Kung & Proserpio (2021, Marketing Science):** 1% Anstieg Airbnb-Angebote → 0.018% höhere Mieten in US-Städten. Kleiner aber messbarer Effekt.
- **Stadt Zürich (Jan. 2024):** 90-Tage-Limit eingeführt.

---

### Kategorie 5: Steuern & Abgaben

---

#### `steuer_grundstückgewinn` — Grundstückgewinnsteuer

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ (Lock-in-Effekt: Eigentümer halten länger, weniger Transaktionen) |
| Nachfrage | ~ |
| Preisniveau | ↑ (paradoxerweise: Lock-in → weniger Angebot → höhere Preise) |
| Eigentümerstruktur | Begünstigt Langzeithalter |

**Stärke:** mittel bis stark  
**Quellen:**
- **Aregger, Brown & Rossi (2013, SNB Working Paper 2013-02):** Höhere Kapitalgewinnsteuern erhöhen Preisdynamik durch Angebotsreduktion (Lock-in). Daten CH 1985–2009, 92 Regionen.
- **Stein (2010, Journal of Public Economics):** TRA97 hob Lock-in für Gewinne unter $500k auf → Verkaufsrate stieg um 19–24%.  
**Nebeneffekte:** Marktmobilität sinkt; Fehlanpassungen im Wohnungsmarkt nehmen zu.

---

#### `steuer_eigenmietwert` — Besteuerung des Eigenmietwerts

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ~ |
| Nachfrage | ↑ bei Abschaffung (Wohneigentum attraktiver) |
| Preisniveau | ↑ bei Abschaffung (höhere Eigentumsnachfrage) |
| Eigentümerstruktur | Abschaffung begünstigt Selbstnutzer |

**Stärke:** mittel  
**Quellen:**
- **Wüest Partner (2026):** Nach Abschaffung: Wohneigentum in 71% aller CH-Gemeinden finanziell attraktiver.
- **UBS (2026):** Wegfall belastet Altbauwerte (keine Unterhaltsabzüge mehr).
- **Raiffeisen CH (2026):** Systemwechsel verändert steuerliche Landschaft; Schuldentilgung attraktiver.

---

#### `steuer_leerstandsabgabe` — Abgabe auf leerstehende Wohnungen

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (Druck auf Vermieter, Leerstände zu vermieten) |
| Nachfrage | ~ |
| Preisniveau | ↓ (mehr Angebot) |
| Eigentümerstruktur | ~ |

**Stärke:** schwach bis mittel (abhängig von Abgabehöhe und Vollzug)  
**Quellen:**
- **Frankreich, Taxe sur les logements vacants (seit 1999):** In angespannten Märkten eingeführt; empirisch gemischte Wirkung, aber Leerstandsquoten in betroffenen Gebieten sanken leicht (INSEE-Studie 2019).  
**Nebeneffekte:** Eigentümer können Leerstand durch befristete Vermietungen umgehen.

---

#### `steuer_handaenderung` — Handänderungssteuer beim Verkauf

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ (weniger Transaktionen, Marktfriktion erhöht) |
| Nachfrage | ↓ (Kaufnebenkosten steigen) |
| Preisniveau | ↑ bei hoher Steuer (Reibungsverluste; Angebot sinkt durch weniger Verkäufe) |
| Eigentümerstruktur | Begünstigt Langzeithalter |

**Stärke:** schwach bis mittel  
**Quellen:**
- **Slemrod et al. (2017, National Tax Journal):** Transaction taxes on real estate consistently reduce housing market activity; modest price effects.

---

#### `steuer_kapitalgewinnprivatpersonen` — Kapitalgewinnbesteuerung Private

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ (Lock-in-Effekt) |
| Nachfrage | ↓ leicht (Investitionsanreiz sinkt) |
| Preisniveau | Unklar (Lock-in kann Preise erhöhen) |
| Eigentümerstruktur | ~ |

**Stärke:** mittel  
**Quellen:**
- **Aregger, Brown & Rossi (2013, SNB):** Lock-in-Effekt auch bei privaten Kapitalgewinnen nachgewiesen.
- **Tax Policy Center (USA, 2024):** Ausweitung der Kapitalgewinnsbefreiung "unlikely to address affordability".

---

### Kategorie 6: Kapital & Investitionen

---

#### `kapital_auslaendische_investoren` — Lex Koller / Ausländer-Grundstückskauf

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ bei Verschärfung (weniger Kapital für Wohnbau) |
| Nachfrage | ↓ bei Verschärfung (weniger ausländische Nachfrage) |
| Preisniveau | ↓ bei Verschärfung (weniger Nachfrage) |
| Eigentümerstruktur | Weniger ausländische institutionelle Anleger |

**Stärke:** mittel (in der Schweiz durch bestehende Lex Koller bereits stark gedämpft)  
**Quellen:**
- **Hilber & Schöni (2016):** Ausländische Nachfrage kann lokale Immobilienpreise in kleinen offenen Ökonomien signifikant erhöhen.
- **Schweiz, Lex Koller (BewG 1983):** Erwerb von Wohnliegenschaften durch Nicht-EU-Ausländer bewilligungspflichtig; für EU-Bürger mit Wohnsitz CH seit Bilateralen frei.

---

#### `kapital_institutionelle_regulierung` — Regulierung institutioneller Anleger

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↓ leicht (Renditebegrenzung → weniger Investitionsanreiz) |
| Nachfrage | ~ |
| Preisniveau | ↓ (bei Renditebegrenzung) |
| Eigentümerstruktur | Weniger institutionelles Kapital im Wohnungsmarkt |

**Stärke:** [SCHÄTZUNG] mittel  
**Quellen:** Wenig spezifische Studien gefunden; [SCHÄTZUNG] basierend auf allgemeiner Kapitalmarktlogik.

---

#### `kapital_hypothekarregulierung` — LTV und Tragbarkeit

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ~ |
| Nachfrage | ↓ bei Verschärfung (weniger Kaufkraft) |
| Preisniveau | ↓ bei Verschärfung (Nachfragerückgang) |
| Eigentümerstruktur | Strengere Regeln benachteiligen einkommensschwache Käufer |

**Stärke:** mittel  
**Quellen:**
- **FINMA RS 2012/3 + SNB-Mindesteigenkapitalregeln (seit 2014):** LTV max. 80%, Tragbarkeit max. 33%, Amortisationspflicht. Eingeführt nach Blasengefahr 2012–2014.
- **SNB Finanzstabilitätsbericht (2024):** Regeln haben Überhitzung gebremst; Schweizer Eigentumsquote blieb bei ~36% (tiefste in Westeuropa).

---

### Kategorie 7: Nutzungsregulierung

---

#### `nutzung_kurzzeitvermietung` — Airbnb-Regulierung

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (Wohnraum bleibt im Langzeitmietmarkt) |
| Nachfrage | ~ |
| Preisniveau | ↓ leicht in touristischen Lagen |
| Eigentümerstruktur | ~ |

**Stärke:** schwach bis mittel (lokal in touristischen Lagen stärker)  
**Quellen:**
- **Barron, Kung & Proserpio (2021, Marketing Science):** +1% Airbnb-Angebote → +0.018% Mieten in US-Städten.
- **SAB-Studie Airbnb CH (Nov. 2024):** Regulierungsansätze in verschiedenen Kantonen dokumentiert.

---

#### `nutzung_umnutzungsverbot` — Umnutzung Wohnraum → Büro/Hotel

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (Wohnraum bleibt) |
| Nachfrage | ~ |
| Preisniveau | ↓ |
| Eigentümerstruktur | ~ |

**Stärke:** schwach bis mittel  
**Quellen:**
- **[SCHÄTZUNG]** Umnutzungsverbote in Wohnzonen sind in CH-Städten Standard; spezifische Wirkungsstudien nicht gefunden.

---

#### `nutzung_abbruchverbot` — Abbruchverbot bei Wohnungsknappheit

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (Bestand wird erhalten) |
| Nachfrage | ~ |
| Preisniveau | ↓ (günstige Altbauten bleiben erhalten) |
| Eigentümerstruktur | ~ |

**Stärke:** mittel (vor allem in angespannten Märkten)  
**Quellen:**
- **Kanton Zürich, Wohnraumschutzgesetz WRG (860.1):** Abbruch nur mit Nachweis Ersatzneubau; Zürich hat dies seit 2010er Jahren.

---

#### `nutzung_zweitwohnungen` — Anteil zulässiger Zweitwohnungen (Weber-Initiative)

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ↑ (mehr Wohnraum für Einheimische in Tourismusgemeinden) |
| Nachfrage | ↓ (Spekulationsnachfrage sinkt) |
| Preisniveau | ↓ in Tourismusgemeinden |
| Eigentümerstruktur | Weniger Ferienhaus-Investoren |

**Stärke:** stark (in Tourismusgemeinden); irrelevant in Städten  
**Quellen:**
- **Hilber & Schöni (2020):** Weber-Initiative 2012 (20%-Deckel) → Kaufpreise in betroffenen Gemeinden sanken um ~8% nach Abstimmung; Mietpreise unverändert.

---

### Kategorie 8: Infrastruktur & Standortqualität

---

#### `infra_oepnv` — Ausbau des öffentlichen Verkehrs

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ~ |
| Nachfrage | ↑ (gut erschlossene Lagen werden attraktiver) |
| Preisniveau | ↑ in erschlossenen Lagen; ↓ Gesamtdruck durch Umlanderschliessung |
| Eigentümerstruktur | ~ |

**Stärke:** stark (lokal entlang neuer Linien)  
**Quellen:**
- **Billings (2011, Journal of Urban Economics):** Light-Rail-Erweiterung in Charlotte (USA): Grundstückspreise nahe neuer Stationen stiegen um 4% gegenüber Kontrollfällen.
- **SNB / CRED Bern:** ÖV-Erreichbarkeit ist einer der stärksten Treiber für Bodenpreisunterschiede in der Schweiz.

---

#### `infra_schule_kita` — Schul- und Kita-Angebot

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ~ |
| Nachfrage | ↑ (Familien ziehen in Gebiete mit gutem Angebot) |
| Preisniveau | ↑ (Wohnlagen mit guten Schulen teurer) |
| Eigentümerstruktur | ~ |

**Stärke:** mittel  
**Quellen:**
- **Black (1999, QJE):** Schulqualität erklärt ~2.5% Preisaufschlag pro Standardabweichung in Schulranglisten (USA).

---

#### `infra_oeffentlicher_raum` — Öffentlicher Raum / Grünflächen

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ~ |
| Nachfrage | ↑ (Wohnqualität steigt) |
| Preisniveau | ↑ (Nähe zu Parks erhöht Wohnpreise) |
| Eigentümerstruktur | ~ |

**Stärke:** schwach bis mittel  
**Quellen:**
- **Crompton (2001):** Parknähe erhöht US-Hauspreise um 5–20% (Metaanalyse).

---

#### `infra_wirtschaftsansiedlung` — Aktive Wirtschaftsförderung

| Dimension | Wirkung |
|-----------|---------|
| Angebot | ~ kurzfristig; langfristig steigt Neubau |
| Nachfrage | ↑↑ (Arbeitsplätze → Zuzug) |
| Preisniveau | ↑ (Nachfragedruck) |
| Eigentümerstruktur | ~ |

**Stärke:** stark (langfristig)  
**Quellen:**
- **Moretti (2010, Journal of Urban Economics):** 1 Hightech-Arbeitsplatz schafft 5 weitere lokale Arbeitsplätze → starker Nachfragesog auf Wohnungsmarkt (Multiplied-effect).

---

## Teil 3: Städtedaten

### Aktueller Parameterwert für Zürich, Bern und Lugano

**Legende:** 0 = niedrig/liberal, 1 = mittel, 2 = hoch/interventionistisch | [SCHÄTZUNG] = keine direkte Quelle gefunden

---

### Kontextfaktoren (Skala –2 bis +2)

| Parameter | Zürich | Bern | Lugano | Begründung |
|-----------|--------|------|--------|------------|
| `zinsniveau` | –1 | –1 | –1 | SNB-Leitzins –0.25%, Referenzzinssatz 1.25% (März 2026); historisch niedrig aber nicht mehr Tiefstniveau |
| `zuwanderungsdruck` | +2 | +1 | 0 | ZH: Leerwohnungsziffer 0.07%, stärkstes Wachstum; Bern: moderat; Lugano: ausgeglichener |
| `wirtschaftskraft` | +2 | +1 | +1 | ZH: globales Finanzzentrum, höchstes BIP/Kopf CH; Bern: Bundesstadt, stabil; Lugano: Tessiner Finanzzentrum, moderat |
| `bevoelkerungstrend` | –1 | –1 | –1 | Schweizweit negatives natürliches Wachstum (Geburtenrate < 2); Zuwanderung kompensiert |

---

### Zürich — Steuerbare Parameter

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 2 | Stadt fast vollständig bebaut; BZO-Revision 2026 fokussiert auf Innenentwicklung, keine Neueinzonungen | BZO-Revision 2026, Stadt Zürich |
| `raumplanung_verdichtung` | 2 | BZO-Revision 2026: verbindliche Aufzonungsgebiete mit Verdichtungsauflage | bzo-zuerich.ch; NZZ 18.3.2026 |
| `raumplanung_ausnuetzungsziffer` | 2 | AZ bis 4.0–5.0 in zentralen Wohnzonen [SCHÄTZUNG] | BZO Stadt Zürich; Stadtplanung ZH |
| `boden_vorkaufsrecht` | 0 | Initiative am 30.11.2025 mit 59.3% Nein abgelehnt; kein Vorkaufsrecht | Tagesanzeiger, SRF, 30.11.2025 |
| `boden_bauverpflichtung` | 1 | Kommunale Mehrwertabgabe; keine allgemeine Bauverpflichtung mit Frist | VO MAF Stadt Zürich, Sept. 2024 |
| `boden_mehrwertabgabe` | 1 | VO MAF: 40% bei Auf-/Umzonungen (über RPG-Minimum 20%, unter 50%-Schwelle für Stufe 2) | zh.ch/mehrwertausgleich; VO MAF 2024 |
| `boden_bodeneigentumssteuer` | 0 | Keine Bodeneigentumssteuer; nur normale Vermögenssteuer | Steuerrecht Kanton Zürich |
| `bau_energievorgaben` | 1 | MuKEn 2014 umgesetzt; Neubau: 10% erneuerbare Energie; keine Netto-Null-Baupflicht | zh.ch/bauvorschriften-gebaeude-energie |
| `bau_sanierungspflicht` | 2 | Elektroheizungen und Elektro-Wassererwärmer Pflicht bis 2030 (BG bestätigt 2023) | zh.ch/elektroheizungen; NZZ 27.4.2023 |
| `bau_einspracherecht_dritte` | 1 | PBG ZH §21: Personen mit schutzwürdigen Interessen (Anwohner) | PBG Kanton Zürich §21 |
| `bau_einspracherecht_suspensiv` | 2 | Schweizweit: Einsprache hat aufschiebende Wirkung; Bau darf nicht beginnen | VRPG; PBG ZH |
| `bau_bewilligungsverfahren` | 2 | eBaugesucheZH: seit 1.4.2024 alle Baugesuche digital einzureichen | immo-invest.ch Feb. 2024 |
| `bau_normenharmonisierung` | 1 | IVHB umgesetzt; 17/26 Kantone; vollständige CH-Harmonisierung ausstehend | zh.ch/harmonisierung-baubegriffe |
| `gemeinnuetzig_mindestanteil` | 2 | Gemeindeordnung Art. 2: Ziel 33%; BZO-Revision 2026 mit Preisgünstigkeitspflicht | Gemeindeordnung Stadt Zürich |
| `gemeinnuetzig_foerderfonds` | 2 | Kantonaler Wohnbaufonds auf 360 Mio. CHF verdoppelt (Nov. 2025) + nationaler Fonds de Roulement | SRF 30.11.2025; wbg-schweiz.ch |
| `gemeinnuetzig_baurecht` | 1 | Aktive Baurechtsvergabe an Genossenschaften; kein formelles Prioritätsprinzip | Stadt Zürich Liegenschaften |
| `gemeinnuetzig_belegungsvorschriften` | 0 | Keine verbindliche kommunale Pflicht; Genossenschaften regeln intern | [SCHÄTZUNG] |
| `gemeinnuetzig_sozialmischung` | 2 | BZO-Revision 2026: verbindliche Preisgünstigkeitspflicht bei Aufzonungen | bzo-zuerich.ch; SP Zürich Sept. 2025 |
| `mietrecht_kostenmiete` | 1 | OR Art. 269: Rendite max. 2%+Referenzzinssatz; gilt schweizweit; nicht verfassungsverankert | OR Art. 269; BWO |
| `mietrecht_anfangsmiete` | 1 | ZH: Leerwohnungsziffer <1.5% → Formularpflicht; Anfechtung bei angespanntem Markt möglich | OR Art. 270; kant. VO ZH |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025: Formular mit Vormietzins, Referenzzinssatz und LIK | Art. 19 Abs. 2 VMWG, in Kraft Okt. 2025 |
| `mietrecht_kuendigungsschutz` | 2 | Kant. Wohnraumschutzgesetz ZH (860.1): Prüfpflicht bei Massenkündigungen | Wohnraumschutzgesetz ZH |
| `mietrecht_mietzinsindex` | 0 | Aktuell schweizweit Referenzzinssatz als Hauptindex | OR Art. 269a; BWO |
| `mietrecht_untervermietung` | 1 | OR Art. 262 (Zustimmung nötig); Airbnb-Limit 90 Tage/Jahr ab Jan. 2024 | OR Art. 262; Stadt ZH Gemeindeordnung |
| `steuer_grundstückgewinn` | 1 | Kanton ZH: progressive GGSt nach Haltedauer (kurze Haltedauer bis ~60%) | StG ZH §216ff |
| `steuer_eigenmietwert` | 1 | Abschaffung Sept. 2025 beschlossen, aber noch nicht in Kraft | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine kommunale/kantonale Leerstandsabgabe trotz 0.07% Leerstand | Stadt ZH Statistik |
| `steuer_handaenderung` | 0 | Kanton Zürich: keine Handänderungssteuer | StG ZH; Kantonssteueramt ZH |
| `steuer_kapitalgewinnprivatpersonen` | 0 | Schweizweit: Kapitalgewinne Private steuerfrei (DBG Art. 16 Abs. 3) | DBG Art. 16 Abs. 3; StHG |
| `kapital_auslaendische_investoren` | 1 | Lex Koller gilt schweizweit; keine ZH-spezifischen Verschärfungen | BewG (Lex Koller) |
| `kapital_institutionelle_regulierung` | 0 | Keine Transparenz-/Renditebegrenzungspflicht für institutionelle Investoren [SCHÄTZUNG] | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard: LTV max. 80%, Tragbarkeit max. 33%; seit 2014 schweizweit | FINMA RS 2012/3 |
| `nutzung_kurzzeitvermietung` | 1 | 90-Tage-Limit Airbnb ab Jan. 2024; Volksinitiative für schärfere Regeln eingereicht 2026 | Stadt ZH Gemeindeordnung Art. 28b |
| `nutzung_umnutzungsverbot` | 2 | Strenge Wohnanteilsvorschriften; Umnutzung in reinen Wohnzonen verboten | Bauordnung Stadt ZH; WRG ZH |
| `nutzung_abbruchverbot` | 2 | Abbruch nur mit Nachweis Ersatzneubau (Wohnraumschutzgesetz) | WRG ZH §4 |
| `nutzung_zweitwohnungen` | 1 | ZWG: 20%-Deckel CH-weit; Zürich nicht als Tourismusgemeinde betroffen | ZWG (702) |
| `infra_oepnv` | 2 | Weltweit führendes ÖV-System: S-Bahn, 13 Tramlinien, dichte Taktfolge | ZVV; Monocle Quality of Life |
| `infra_schule_kita` | 2 | Dicht ausgebautes Schulnetz; Zürich baut subventionierte Kita-Plätze stark aus | Stadt Zürich Sozialdepartement |
| `infra_oeffentlicher_raum` | 2 | Hohe Investitionen; Seeufergestaltung; Zürich regelmässig in Top-Livability-Rankings | Mercer Quality of Living 2023 |
| `infra_wirtschaftsansiedlung` | 2 | Globales Finanzzentrum; tiefe Kantonssteuern; aktive Ansiedlungspolitik; Zürich 3. in Global Finance Centres | GFCI 2024 |

---

### Bern — Steuerbare Parameter

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 1 | Innenstadt dicht bebaut; Agglomeration hat noch Reserven; Kanton BE aktiv mit Innenentwicklung | Kanton Bern Richtplan 2030 |
| `raumplanung_verdichtung` | 1 | RPG-Pflicht umgesetzt; keine städtisch verbindliche Verdichtungsauflage wie ZH [SCHÄTZUNG] | RPG; kant. Richtplan Bern |
| `raumplanung_ausnuetzungsziffer` | 1 | Mittlere Dichte; Bern historisch lockerer bebaut als Zürich [SCHÄTZUNG] | Baureglement Stadt Bern |
| `boden_vorkaufsrecht` | 0 | Kein kommunales Vorkaufsrecht in Bern; bundesrechtlich nicht vorgesehen (ausser GE/VD) | [SCHÄTZUNG] |
| `boden_bauverpflichtung` | 1 | RPG-Mehrwertabgabe umgesetzt; keine schärfere kommunale Bauverpflichtung | RPG Art. 5 |
| `boden_mehrwertabgabe` | 2 | Kanton Bern: 50% bei Einzonungen, 40% bei Aufzonungen; finanziert kantonalen Wohnbaufonds | Kanton Bern MWA-Gesetz; i-rem.ch 2024 |
| `boden_bodeneigentumssteuer` | 0 | Keine spezifische Bodeneigentumssteuer [SCHÄTZUNG] | — |
| `bau_energievorgaben` | 2 | Kanton Bern: MuKEn 2025 früh umgesetzt; strengste Schweizer Kantone | kant. Energiegesetz BE 2023 |
| `bau_sanierungspflicht` | 1 | Zielwert empfohlen; Pflicht für Heizungsersatz bis 2030 noch nicht in gleicher Schärfe wie ZH | [SCHÄTZUNG basierend auf BE Energiegesetz] |
| `bau_einspracherecht_dritte` | 1 | Ähnlich wie ZH: Personen mit schutzwürdigen Interessen | BauG Kanton Bern |
| `bau_einspracherecht_suspensiv` | 2 | Schweizweit: automatischer Baustopp bei Einsprache | VRPG |
| `bau_bewilligungsverfahren` | 1 | eBau BE: teildigitalisiert; vollständige Digitalisierung noch in Umsetzung | eBau Kanton Bern |
| `bau_normenharmonisierung` | 1 | IVHB umgesetzt (Kanton BE); wie ZH teilweise harmonisiert | IVHB |
| `gemeinnuetzig_mindestanteil` | 2 | Kanton Bern: «Drittelsregel» — bei Ein-/Aufzonungen min. 1/3 preisgünstiger Wohnraum; Bundesgericht bestätigt 2014 | Bundesgericht 1C_415/2013 (2014) |
| `gemeinnuetzig_foerderfonds` | 1 | Kantonaler Wohnbaufonds Bern; gespiesen durch Mehrwertabgabe; nationaler Fonds de Roulement zugänglich | Kanton Bern Wohnbaufonds |
| `gemeinnuetzig_baurecht` | 1 | Aktive Baurechtsvergabe durch Stadt Bern; kein explizites Prioritätsprinzip [SCHÄTZUNG] | Stadt Bern Liegenschaften |
| `gemeinnuetzig_belegungsvorschriften` | 0 | Keine verbindliche kommunale Pflicht [SCHÄTZUNG] | — |
| `gemeinnuetzig_sozialmischung` | 2 | Drittelsregel kantonalgesetzlich verankert | Kanton Bern; BGer 2014 |
| `mietrecht_kostenmiete` | 1 | Bundesrecht gilt; keine kantonal schärfere Regelung | OR Art. 269 |
| `mietrecht_anfangsmiete` | 1 | Leerwohnungsziffer ~0.4% < 1.5% → Formularpflicht; angespannter Markt | OR Art. 270; Statistik Kanton BE |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025 bundesweit | Art. 19 Abs. 2 VMWG |
| `mietrecht_kuendigungsschutz` | 1 | Bundesrecht (OR Art. 272ff); kein kant. Wohnraumschutzgesetz wie ZH [SCHÄTZUNG] | OR Art. 272ff |
| `mietrecht_mietzinsindex` | 0 | Bundesrecht: Referenzzinssatz | OR Art. 269a |
| `mietrecht_untervermietung` | 1 | OR Art. 262; keine spezifische Airbnb-Regulierung in Bern bekannt | OR Art. 262 |
| `steuer_grundstückgewinn` | 1 | Kanton Bern: progressive GGSt | StG Kanton Bern |
| `steuer_eigenmietwert` | 1 | Abschaffung beschlossen aber noch nicht in Kraft | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine kommunale Leerstandsabgabe bekannt [SCHÄTZUNG] | — |
| `steuer_handaenderung` | 1 | Kanton Bern: Handänderungssteuer ~1.8% | StG Kanton Bern |
| `steuer_kapitalgewinnprivatpersonen` | 0 | Schweizweit: steuerfrei | DBG Art. 16 Abs. 3 |
| `kapital_auslaendische_investoren` | 1 | Lex Koller schweizweit | BewG |
| `kapital_institutionelle_regulierung` | 0 | [SCHÄTZUNG] keine spezifische kantonale Regulierung | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard schweizweit | FINMA RS 2012/3 |
| `nutzung_kurzzeitvermietung` | 0 | Keine spezifische Airbnb-Regulierung in Bern bekannt [SCHÄTZUNG] | — |
| `nutzung_umnutzungsverbot` | 1 | Wohnzonen-Schutz in Baureglement; weniger strikt als ZH [SCHÄTZUNG] | Baureglement Stadt Bern |
| `nutzung_abbruchverbot` | 1 | Prüfpflicht bei Abbrüchen in Wohngebieten [SCHÄTZUNG] | Baugesetz Kanton Bern |
| `nutzung_zweitwohnungen` | 1 | ZWG-Deckel 20%; Bern nicht als Tourismusgemeinde betroffen | ZWG |
| `infra_oepnv` | 2 | Sehr gut ausgebautes Bahn/Tram/Bus-Netz; Bern Tram seit 1890er; laufende Ausbauten | BernMobil; SBB |
| `infra_schule_kita` | 2 | Gutes Schul- und Kita-Angebot; Bundesstadt mit solider Infrastruktur [SCHÄTZUNG] | Stadt Bern Bildungsdepartement |
| `infra_oeffentlicher_raum` | 1 | Gute Qualität; Aare als natürlicher Erholungsraum; weniger Investitionen als ZH [SCHÄTZUNG] | — |
| `infra_wirtschaftsansiedlung` | 1 | Bundesstadt; moderat diversifizierte Wirtschaft; keine aggressive Steuerstrategie | BFS; Kanton Bern Wirtschaftsförderung |

---

### Lugano — Steuerbare Parameter

| Parameter | Wert | Begründung | Quelle |
|-----------|------|------------|--------|
| `raumplanung_zonenreserve` | 1 | Einzonungsstopp Tessin 2019 (RPG-Umsetzung); noch Reserven vorhanden | Kanton Tessin, RPG-Umsetzung 2019 |
| `raumplanung_verdichtung` | 1 | RPG-Pflicht; Tessin hat spät harmonisiert; mittlere Umsetzung [SCHÄTZUNG] | Kanton Tessin Richtplan |
| `raumplanung_ausnuetzungsziffer` | 1 | Mittlere Dichte; weniger dicht als Zürich [SCHÄTZUNG] | Baureglement Lugano |
| `boden_vorkaufsrecht` | 0 | Kein kommunales Vorkaufsrecht im Kanton Tessin | [SCHÄTZUNG] |
| `boden_bauverpflichtung` | 1 | RPG-Mehrwertabgabe; Kanton TI: 30% bei Einzonungen | Kanton Tessin MWA |
| `boden_mehrwertabgabe` | 1 | Kanton Tessin: 30% bei Einzonungen (zwischen RPG-Minimum und 50%-Schwelle) | Kanton Tessin Mehrwertausgleich |
| `boden_bodeneigentumssteuer` | 0 | Keine Bodeneigentumssteuer im Kanton Tessin [SCHÄTZUNG] | — |
| `bau_energievorgaben` | 0 | Tessin: eigene Energievorschriften, weniger fortgeschritten als Deutschschweiz [SCHÄTZUNG] | Kanton Tessin Energiegesetz |
| `bau_sanierungspflicht` | 0 | Keine verbindliche Sanierungspflicht bekannt [SCHÄTZUNG] | — |
| `bau_einspracherecht_dritte` | 1 | Tessin: ähnliches System wie andere Kantone | Legge cantonale sullo sviluppo territoriale (LST) |
| `bau_einspracherecht_suspensiv` | 2 | Schweizweit: automatischer Baustopp | VRPG |
| `bau_bewilligungsverfahren` | 0 | Tessin: noch nicht vollständig digitalisiert [SCHÄTZUNG] | — |
| `bau_normenharmonisierung` | 1 | IVHB: Tessin hat IVHB teilweise umgesetzt | IVHB; kant. Baurecht TI |
| `gemeinnuetzig_mindestanteil` | 0 | Kein Mindestanteil im Kanton Tessin; kaum Genossenschaftswohnungen | [SCHÄTZUNG; wbg-schweiz.ch: Tessin hat kaum gemeinnützige Träger] |
| `gemeinnuetzig_foerderfonds` | 1 | Nationaler Fonds de Roulement zugänglich; kein kantonaler Sonderfonds | wbg-schweiz.ch |
| `gemeinnuetzig_baurecht` | 0 | Keine aktive Baurechtsvergabe bekannt [SCHÄTZUNG] | — |
| `gemeinnuetzig_belegungsvorschriften` | 0 | [SCHÄTZUNG] | — |
| `gemeinnuetzig_sozialmischung` | 0 | Keine Sozialmischungspflicht bekannt [SCHÄTZUNG] | — |
| `mietrecht_kostenmiete` | 1 | Bundesrecht gilt | OR Art. 269 |
| `mietrecht_anfangsmiete` | 1 | Leerwohnungsziffer ~1% nahe 1.5%-Schwelle; Formularpflicht je nach Gemeinde [SCHÄTZUNG] | OR Art. 270 |
| `mietrecht_mietzinstransparenz` | 1 | Ab Oktober 2025 bundesweit | Art. 19 Abs. 2 VMWG |
| `mietrecht_kuendigungsschutz` | 1 | Bundesrecht | OR Art. 272ff |
| `mietrecht_mietzinsindex` | 0 | Bundesrecht: Referenzzinssatz | OR Art. 269a |
| `mietrecht_untervermietung` | 0 | OR Art. 262; keine spezifische Airbnb-Regulierung in Lugano bekannt | OR Art. 262 |
| `steuer_grundstückgewinn` | 1 | Kanton Tessin: progressive Grundstückgewinnsteuer | StG Kanton Tessin |
| `steuer_eigenmietwert` | 1 | Abschaffung beschlossen aber noch nicht in Kraft | Volksabstimmung 28.9.2025 |
| `steuer_leerstandsabgabe` | 0 | Keine bekannt [SCHÄTZUNG] | — |
| `steuer_handaenderung` | 1 | Kanton Tessin: Handänderungssteuer 1.1–1.3% | StG Kanton Tessin |
| `steuer_kapitalgewinnprivatpersonen` | 0 | Schweizweit: steuerfrei | DBG Art. 16 Abs. 3 |
| `kapital_auslaendische_investoren` | 1 | Lex Koller schweizweit | BewG |
| `kapital_institutionelle_regulierung` | 0 | [SCHÄTZUNG] | — |
| `kapital_hypothekarregulierung` | 1 | FINMA-Standard schweizweit | FINMA RS 2012/3 |
| `nutzung_kurzzeitvermietung` | 0 | Keine spezifische Regulierung bekannt [SCHÄTZUNG] | — |
| `nutzung_umnutzungsverbot` | 1 | Standardmässige Wohnzonenschutzregeln [SCHÄTZUNG] | Baureglement Lugano |
| `nutzung_abbruchverbot` | 0 | Kein spezifisches Abbruchverbot bekannt [SCHÄTZUNG] | — |
| `nutzung_zweitwohnungen` | 1 | ZWG-Deckel 20%; Lugano ist touristisch aber nicht klassische Berggemeinde | ZWG |
| `infra_oepnv` | 1 | Lugano: Tram-Funicolare, Bus; neues MetroLugano in Planung; moderat | MetroLugano; SBB Lugano |
| `infra_schule_kita` | 1 | Bedarfsgerechtes Angebot; Università della Svizzera italiana (USI) wertet auf | Stadt Lugano; USI |
| `infra_oeffentlicher_raum` | 1 | Seeufer und Parks vorhanden; weniger systematisch als Zürich [SCHÄTZUNG] | — |
| `infra_wirtschaftsansiedlung` | 1 | Finanzzentrum Tessin; tiefe kantonale Steuern; aktive Ansiedlung Finanzinstitute | Kanton Tessin Wirtschaftsförderung |

---

*Quellen-Übersicht: ARE (Bundesamt für Raumentwicklung), BWO (Bundesamt für Wohnungswesen), FINMA, SNB, BFS, Stadt Zürich, Kanton Zürich, Kanton Bern, Kanton Tessin, NBER, SNB Working Papers, IZA, Journal of Urban Economics, Quarterly Journal of Economics, Marketing Science, National Tax Journal, Raiffeisen Schweiz, Wüest Partner, UBS, Avenir Suisse, MV Schweiz, WBG Schweiz, SRF, NZZ, Tagesanzeiger*
