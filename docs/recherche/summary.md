# Recherche-Synthese Wohnkosten-Simulator

**Stand:** 2026-04-12 (aktualisiert nach Gap-Filling-Recherche)
**Status:** aktualisiert (Gap-Filling Phase 2, 2026-04-12)

---

## Umfang

- 92 strukturierte Studien (1970–2025)
- Davon 73 aus den alten Dossiers + 19 neu recherchierte/ergänzte (inkl. viele Klassiker aus den 70er–90er Jahren)
- Abgedeckte Länder: CH, DE, AT, US, CA, UK, FR, JP, KR, AU, NZ, SG, NL, DK, NO, ES, PT, SE, GLOBAL

---

## Wichtigste Erkenntnisse (verdichtet)

### Sehr hohe Evidenzstärke

- **Angebot ist der dominante Hebel.** Restriktive Raumplanung und Bauvorschriften sind der wichtigste Preistreiber (Hsieh & Moretti 2019: Zoning hat die USA *36 % BIP-Wachstum* gekostet). Upzoning/Verdichtung wirkt preisdämpfend, aber mit signifikanter Verzögerung (3–10 Jahre).

- **Mietpreisregulierung** schützt Bestandsmieter (Mieten -15 bis -50 %, Mobilität -20 %), reduziert aber langfristig das Angebot und erhöht Marktmieten (starker Konsens in Kholodilin Meta-Review 2024 mit 112 Studien).

- **Bodenbesteuerung (LVT)** ist hoch effizient und reduziert Spekulation (starke Evidenz aus Dänemark, Pennsylvania und IMF-Papieren).

- **Gemeinnütziger Wohnungsbau** (besonders Wien-Modell) hat eine klare preisdämpfende Wirkung auf den gesamten Markt, wenn er groß skaliert ist.

### Mittlere bis schwache Evidenz

- **Vorkaufsrecht und Bauverpflichtung:** Fast keine guten quantitativen Wirkungsstudien. _Gap-Filling (2026-04-12) hat keine neuen Studien gefunden — Lücke bleibt bestehen._
- **Eigenmietwert-Abschaffung:** CH-010 (Wüest Partner 2026, Industrie-Report): Abschaffung erhöht attraktive Eigentumsstandorte von 57% auf 71% der CH-Gemeinden. Peer-Review-Evidenz fehlt.
- **Mietregulierung langfristig (>10 Jahre):** GLOBAL-029 (Kholodilin & Kohl 2023, Housing Policy Debate): Historische Langzeitevidenz bestätigt Angebotsreduktion von 20–40% über 20+ Jahre. Lücke teilweise geschlossen.
- **Frankreich Kausalanalyse:** FR-003 (APUR/CESAER 2025): Erster kausaler Nachweis für Pariser Mietpreisdeckel — -5,2% über 5 Jahre, -8,2% im letzten Messjahr. Sehr hohe Relevanz.
- **Norwegen:** NO-001 bis NO-003 hinzugefügt — von 0 auf 3 Studien. OECD 2020 (Sila): Mietschutz + Steuervorteile erhöhen Hauspreise in Norwegen.
- **Australien:** AU-004 (Kendall & Tulip, RBA 2018): Zonenrecht erhöht Sydney-Hauspreise um +73% über Grenzkosten.
- **Korea:** KR-002 (2025): Jeonse-Rentendeckel 2020 (+17,7% Mietkosten in Seoul — Paradoxeffekt). KR-003 (CGE-Modell 2024): Interaktionseffekte.

---

## Empfohlene DAG-Anpassungen

### raumplanung → angebotspotenzial

| Kante | Sign | Weight | Time | Evidenz |
|-------|------|--------|------|---------|
| `raumplanung_zonenreserve` → `angebotspotenzial` | -1 | 1.5 | long | sehr robust |
| `raumplanung_ausnuetzungsziffer` → `angebotspotenzial` | -1 | 1.2 | long | robust |
| `raumplanung_verdichtung` → `angebotspotenzial` | -1 | 1.0 | medium-long | mittel |
| `raumplanung_bewilligungsverfahren` → `angebotspotenzial` | -1 | 1.0 | medium | mittel |

### mietrecht → angebotspotenzial

| Kante | Sign | Weight | Time | Evidenz |
|-------|------|--------|------|---------|
| `mietrecht_kuendigungsschutz` → `mietpreis_schutzlevel` | +1 | 1.0 | short | robust |
| `mietrecht_kuendigungsschutz` → `angebotspotenzial` | -1 | 1.0 | medium-long | Trade-off |
| `mietrecht_anfangsmiete` → `mietpreis_schutzlevel` | +1 | 0.8 | short | mittel |
| `mietrecht_mietzinstransparenz` → `mietpreis_schutzlevel` | +1 | 0.5 | short | schwach |

### steuer → spekulationshemmung / markfriktion

| Kante | Sign | Weight | Time | Evidenz |
|-------|------|--------|------|---------|
| `boden_bodeneigentumssteuer` → `spekulationshemmung` | +1 | 1.2 | medium | stark |
| `steuer_leerstandsabgabe` → `spekulationshemmung` | +1 | 1.0 | medium | mittel |
| `steuer_handaenderung` → `markfriktion` | -1 | 0.8 | short | robust |
| `steuer_eigenmietwert` → `angebotspotenzial` | ? | 0.5 | long | sehr schwach |

### gemeinnuetzig → marktbreite Wirkung

| Kante | Sign | Weight | Time | Evidenz |
|-------|------|--------|------|---------|
| `gemeinnuetzig_mindestanteil` → `gemeinnuetzig_kraft` | +1 | 1.0 | long | Skaleneffekt wichtig |
| `gemeinnuetzig_kraft` → `mietpreis_marktniveau` | -1 | 1.0 | long | robust (Wien-Modell) |

### kapital → nachfragedruck

| Kante | Sign | Weight | Time | Evidenz |
|-------|------|--------|------|---------|
| `kapital_hypothekarregulierung` → `nachfragedruck` | -1 | 1.0 | medium | robust |
| `ctx:zinsniveau` → `nachfragedruck` | +1 | 1.5 | short | sehr robust |

### nutzung → nachfragedruck / angebotspotenzial

| Kante | Sign | Weight | Time | Evidenz |
|-------|------|--------|------|---------|
| `nutzung_kurzzeitvermietung` → `angebotspotenzial` | -1 | 0.8 | medium | mittel (STR-Literatur) |
| `nutzung_zweitwohnungen` → `angebotspotenzial` | -1 | 0.5 | long | schwach |

---

## Quantitative Datenpunkte (Auswahl)

- **Mietpreisbremse (DE):** Mieten in regulierten Marktgebieten -5 bis -10 % (kurzfristig), aber Angebotsreduktion langfristig (Kholodilin 2024)
- **Berlin Mietendeckel:** Scheitern durch Verfassungswidrigkeit + kein messbarer AngebotsEffekt (Hahn et al. 2024)
- **San Francisco Rent Control:** Geschützte Mieter zahlen -15 bis -20 % weniger, aber Vermieter weichen auf Luxusmodernisierung aus — Nettowirkung auf Verfügbararkeit neutral (Diamond et al. 2019)
- **Empty Homes Tax (Vancouver):** Leerstandsrate von 5 % auf 3 % gesenkt, 25'000 Einheiten dem Markt zugeführt (CD Howe 2024)
- **Upzoning Minneapolis:** Nach 3–5 Jahren noch kein messbarer Preiseffekt (Hartley 2025)
- **LVT (Dänemark, Estland):** Spekulation deutlich reduziert, Bausubstanz-Investitionen gestiegen
- **Wien Gemeinnütziger Wohnbau:** ~25 % des Wohnungsbestands → preisdämpfende Wirkung auf gesamten Markt messbar

---

## Evidenzlücken (Critical Gaps) — Stand nach Gap-Filling 2026-04-12

| Lücke | Qualität | Priorität | Status nach Gap-Filling |
|-------|----------|-----------|-------------------------|
| Vorkaufsrecht | Fast nur qualitativ/rechtlich | Sehr hoch | ❌ Nicht schließbar — strukturelle Forschungslücke |
| Bauverpflichtung | 1 Praxisstudie (Difu 2021, DE-011) | Hoch | ❌ Keine Preiswirkungsstudien gefunden |
| Eigenmietwert-Abschaffung (CH) | Fast keine empirischen Studien | Sehr hoch | ❌ Nicht schließbar — echte Forschungslücke |
| Langfristige Mietregulierung (>10 Jahre) | **Jetzt stärker** | Mittel (verbessert) | ✅ GLOBAL-029 (Kholodilin & Kohl 2023) schließt Lücke weitgehend |
| Interaktionseffekte mehrerer Parameter | Schwach + KR-003 | Mittel | ⚠️ KR-003 adressiert teils, grundlegend bleibt Lücke |
| Einspracherecht Dritte | Nur qualitativ erwähnt (NO-001) | Mittel | ❌ Keine quantitativen Studien gefunden |

---

## Länder-Abdeckung — Stand nach Gap-Filling 2026-04-12

| Region | Vor Gap-Filling | Nach Gap-Filling | Qualität |
|--------|----------------|-----------------|----------|
| NO | 0 Studien | 3 Studien (NO-001, NO-002, NO-003) | ✅ Basis vorhanden |
| FR | 1 Studie | 3 Studien (+ FR-002 Eval., FR-003 Kausal 2025) | ✅✅ Sehr gut |
| JP | 1 Studie | 3 Studien (+ JP-002 IMF, JP-003 Yoshida/Brookings) | ✅ Verbessert |
| KR | 1 Studie | 3 Studien (+ KR-002 Jeonse, KR-003 CGE) | ✅ Deutlich besser |
| AU | 1 Studie | 4 Studien (+ AU-002, AU-003, AU-004 Kendall/Tulip RBA) | ✅✅ Sehr gut |

**Verbleibende Lücken:** Historische Studien für FR/JP 1970–1990 noch dünn. Keine eigentlichen Norwegen-spezifischen Langzeitstudien.

---

## Nächste Schritte (optional)

1. Norwegen-Recherche abschliessen
2. FR/JP/KR/AU vertiefen mit historischen Studien
3. Detaillierte Tabellen pro DAG-Bereich ausarbeiten
4. Explizite Auflistung aller Evidenzlücken mit Quellen
5. Quantitative Datenpunkte vollständig erfassen

---

## Quelle

Diese Synthese basiert auf dem Slack-Chat-Verlauf (#wohnpreis) vom 2026-04-11 und wurde am 2026-04-12 als Datei erstellt.
