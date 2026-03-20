# Widget-Ideen: Neue Analyse-Widgets

Erstellt: 2026-03-20  
Basis: Wirkungsmodell & Städtedaten (wirkungsmodell-und-staedtedaten.md) — Analyse durch Miro.

Diese Widgets gehen über die vier bestehenden Basis-Widgets (Angebot/Nachfrage, Trend Preise, Trend Angebot, Eigentümerschaft) hinaus und zeigen spezifische politische Konsequenzen eines Szenarios.

---

## Priorisierung

| Widget | Daten-Basis | Komplexität | Empfehlung |
|--------|-------------|-------------|------------|
| Gentrifizierungsindex | Direkt aus Wirkungsmodell ableitbar | Mittel | ✅ Priorität 1 |
| Zeit bis Marktwirkung | Zeitklassen aus Wirkungsmodell | Niedrig | ✅ Priorität 1 |
| Neubau-Hemmnisindex | Direkt aus Wirkungsmodell ableitbar | Niedrig | ✅ Priorität 1 |
| Verdrängungsrisiko | Direkt aus Wirkungsmodell ableitbar | Niedrig | ✅ Priorität 1 |
| Lock-in-Effekt / Marktfriktion | SNB-Daten vorhanden | Mittel | Priorität 2 |
| Eigentumsquoten-Prognose | Wüest Partner / UBS Daten | Mittel | Priorität 2 |
| Gemeinnütziger Sektor-Anteil | Ableitbar, Wien-Referenz | Mittel | Priorität 2 |
| Fiskalische Wirkung | Ableitbar, grob | Mittel | Priorität 2 |
| Standortwettbewerb / Brain Drain | Moretti-Multiplikator | Hoch | Priorität 3 |
| Politische Umsetzbarkeit | Abstimmungsdaten manuell | Hoch | Priorität 3 |

---

## Priorität 1 — Sofort umsetzbar

### Widget 1: Gentrifizierungsindex

**Beschreibung:** Zeigt wie stark ein Szenario Verdrängung in bestehenden Quartieren begünstigt. Klassische Gentrifizierungs-Treiber kombiniert.

**Parameter-Inputs:**
- `wirtschaftskraft` (Kontext) ↑ → erhöht Druck
- `infra_oepnv` ↑ → erhöht Druck (Aufwertung)
- `infra_wirtschaftsansiedlung` ↑ → erhöht Druck
- `nutzung_abbruchverbot` ↓ → erhöht Druck (kein Schutz)
- `gemeinnuetzig_mindestanteil` ↓ → erhöht Druck (kein Schutz)
- `mietrecht_kuendigungsschutz` ↓ → erhöht Druck
- `bau_sanierungspflicht` ↑ → erhöht Druck (Sanierungskündigungen)

**Darstellung:** Thermometer oder Balken mit Skala "gering → mittel → hoch → sehr hoch". Farbverlauf grün → orange → rot.

**Wissenschaftliche Basis:** Nebeneffekte bei `raumplanung_verdichtung` (Forschung: Greenaway-McGrevy, Auckland); `bau_sanierungspflicht` (BWO CH: Sanierungen als Kündigungsvorwand); Moretti (2010) Wirtschaftsansiedlung.

---

### Widget 2: Zeit bis Marktwirkung

**Beschreibung:** Aggregiert die Zeitprofile aller veränderten Parameter und zeigt wann das Szenario spürbar wirkt.

**Parameter-Inputs:** Alle geänderten Parameter (diff), jeweils mit Zeitklasse:
- Kurzfristig (< 1 Jahr): z.B. `mietrecht_kostenmiete`, `kapital_hypothekarregulierung`
- Mittelfristig (3–7 Jahre): z.B. `raumplanung_verdichtung`, `bau_bewilligungsverfahren`
- Langfristig (5–15 Jahre): z.B. `boden_vorkaufsrecht`, `boden_bodeneigentumssteuer`, `infra_oepnv`

**Darstellung:** Horizontale Zeitleiste (0 → 15 Jahre) mit farbigen Balken pro geändertem Parameter, gruppiert nach Zeitklasse. Oder: Tortendiagramm "Anteil Sofortwirkung / mittelfristig / langfristig".

**Wissenschaftliche Basis:** Zeitliche Wirkung aus Wirkungsmodell für alle 40 Parameter dokumentiert.

---

### Widget 3: Neubau-Hemmnisindex

**Beschreibung:** Zeigt wie stark das Szenario die Entstehung neuen Wohnraums bremst. Direkte Operationalisierung von Glaeser & Gyourko "Regulatory Tax".

**Parameter-Inputs (alle mit Angebot ↓ Wirkung):**
- `bau_energievorgaben` ↑ → Baukosten +5–15% (NAHB/MIT)
- `bau_sanierungspflicht` ↑ → Kapital gebunden
- `bau_einspracherecht_suspensiv` ↑ → Baustopp, Verzögerungskosten
- `bau_einspracherecht_dritte` ↑ → mehr Einsprachen wahrscheinlich
- `gemeinnuetzig_mindestanteil` ↑ → Rendite sinkt, weniger Projekte (San Francisco-Effekt)
- `kapital_hypothekarregulierung` ↑ → weniger Investitionskapital
- `raumplanung_zonenreserve` ↑ (knapp) → weniger Bauland

**Darstellung:** Indexwert 0–100 mit Referenzwert "aktueller Stand [Stadt]". Balken oder Gauge.

**Wissenschaftliche Basis:** Glaeser & Gyourko (2003, NBER); UCLA-Studie 25% kürzere Genehmigung → 33% mehr Bau; Avenir Suisse CHF 2.4–6 Mrd. Mehrkosten durch Normenvielfalt.

---

### Widget 4: Verdrängungsrisiko

**Beschreibung:** Zeigt wie gefährdet bestehende Mieter sind, ihre Wohnung zu verlieren — durch Kündigung, Sanierung, Eigennutzung oder Umnutzung.

**Parameter-Inputs:**
- `mietrecht_kuendigungsschutz` ↓ → erhöht Risiko
- `nutzung_abbruchverbot` ↓ → erhöht Risiko
- `nutzung_umnutzungsverbot` ↓ → erhöht Risiko (Wohnraum → Büro/Hotel)
- `bau_sanierungspflicht` ↑ → erhöht Risiko (Renovationskündigungen)
- `mietrecht_untervermietung` ↓ → erhöht Risiko durch Airbnb-Druck
- `zuwanderungsdruck` (Kontext) ↑ → erhöht Druck

**Darstellung:** Icon-basiert (Haus mit Person) mit Risikoampel grün/gelb/orange/rot. Oder numerisch mit Erläuterungstext.

**Wissenschaftliche Basis:** BWO CH / Raiffeisen 2025: Sanierungen als Verdrängungsinstrument; Motion Sommaruga 24.4337 / Dandrès 24.4371 zu Massenkündigungen.

---

## Priorität 2 — Nächste Phase

### Widget 5: Lock-in-Effekt / Marktfriktion

**Beschreibung:** Kombination von Transaktionshemmnissen zeigt wie stark der Markt "eingefroren" ist — Eigentümer verkaufen seltener, Fehlbelegungen nehmen zu.

**Parameter-Inputs:**
- `steuer_grundstückgewinn` ↑ → Lock-in (SNB WP 2013-02: nachgewiesen)
- `steuer_handaenderung` ↑ → Transaktionskosten
- `steuer_kapitalgewinnprivatpersonen` ↑ → Lock-in

**Darstellung:** Balken "Transaktionsvolumen" im Vergleich zum Baseline. Referenz: Stein (2010) — Wegfall von Lock-in → +19–24% Verkäufe.

---

### Widget 6: Eigentumsquoten-Prognose

**Beschreibung:** Zeigt wohin die Eigentumsquote (CH-Basis: 36%) tendiert.

**Parameter-Inputs:**
- `steuer_eigenmietwert` 0 (abgeschafft) → Eigenheim attraktiver (+Wüest Partner: 71% der Gemeinden)
- `kapital_hypothekarregulierung` ↑ → weniger Käufer
- `zinsniveau` (Kontext) ↑ → weniger Eigentumsbildung
- `mietrecht_kostenmiete` ↑ → Miete günstiger relativ → Eigentumsquote sinkt

**Darstellung:** Pfeil von 36%-Baseline nach oben/unten mit %-Schätzung.

---

### Widget 7: Gemeinnütziger Sektor-Anteil (langfristig)

**Beschreibung:** Prognose wohin sich der nicht-marktkonformen Wohnanteil in 10–20 Jahren entwickelt.

**Parameter-Inputs:**
- `gemeinnuetzig_mindestanteil` — direkte Wirkung
- `gemeinnuetzig_baurecht` — Landkosten-Vorteil für Genossenschaften
- `gemeinnuetzig_foerderfonds` — Kapitalhebel
- `boden_vorkaufsrecht` — Wachstum gemeinnütziger Bestände

**Referenzpunkte:** Lugano ~0%, CH-Schnitt ~5%, Zürich ~26%, Wien ~60%.

**Darstellung:** Skala mit Referenzstädten, Pfeil zeigt Richtung des Szenarios.

---

### Widget 8: Fiskalische Wirkung

**Beschreibung:** Wie viel öffentliche Einnahmen generiert das Szenario für Wohnbauförderung?

**Parameter-Inputs:**
- `boden_mehrwertabgabe` — direkte Einnahmen bei Umzonungen
- `steuer_handaenderung` — Transaktionsvolumen × Steuersatz
- `steuer_grundstückgewinn` — Einnahmen bei Verkäufen (minus Lock-in-Effekt)
- `gemeinnuetzig_foerderfonds` — Reinvestitionsquote

**Darstellung:** CHF-Schätzung (Grössenordnung) oder Index.

---

## Priorität 3 — Später

### Widget 9: Standortwettbewerb / Brain Drain Risiko

**Beschreibung:** Zieht oder vertreibt das Szenario qualifizierte Haushalte und Unternehmen?

**Parameter-Inputs:**
- `infra_oepnv`, `infra_schule_kita`, `infra_wirtschaftsansiedlung` ↑ → zieht an
- `steuer_handaenderung`, `boden_bodeneigentumssteuer` ↑ → vertreibt
- `kapital_hypothekarregulierung` ↑ → erschert Eigentumsbildung für Zugezogene

**Basis:** Moretti (2010): 1 Hightech-Job → 5 lokale Jobs (Multiplikatoreffekt).

---

### Widget 10: Politische Umsetzbarkeit

**Beschreibung:** Wie viele der gewählten Massnahmen sind in der Schweiz heute politisch mehrheitsfähig?

**Basis (Schweizer Volksabstimmungen):**
- `boden_vorkaufsrecht` Stufe 2: abgelehnt 59.3% Nein (Zürich, Nov. 2025)
- `steuer_eigenmietwert` Stufe 0: angenommen (Sept. 2025)
- `mietrecht_kostenmiete` Stufe 2: bisher keine Mehrheit (Gegenentwurf scheiterte 2023)
- weitere Einschätzungen basierend auf Parlamentsvoten und Umfragen

**Darstellung:** Score 0–100% mit Kommentar "X von Y Massnahmen haben historische Präzedenz".

---

## Technische Notizen

- Alle Priorität-1-Widgets berechnen ihren Score rein aus den vorhandenen `context`, `baseline`, `modified`, `diff` Daten — keine neuen externen Daten nötig.
- Zeitklassen für Widget 2 sollten als Metadaten in `params.ts` hinterlegt werden (pro Parameter: `{ timeClass: 'short' | 'medium' | 'long' }`).
- Widgets können in `src/widgets/` analog zu den bestehenden implementiert werden.
- Gewichtungen der Parameter-Inputs sollten in einem separaten `model/`-File konfigurierbar sein (nicht hardcoded in der Widget-Komponente).
