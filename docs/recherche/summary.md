# Recherche-Synthese Wohnkosten-Simulator

**Stand:** 2026-04-11
**Status:** finalisiert

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

- **Vorkaufsrecht und Bauverpflichtung:** Fast keine guten quantitativen Wirkungsstudien.
- **Eigenmietwert-Abschaffung:** Kaum empirische Evidenz.
- **Langfristige Interaktionseffekte** mehrerer Parameter gleichzeitig sind untererforscht.

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

## Evidenzlücken (Critical Gaps)

| Lücke | Qualität | Priorität | Bemerkung |
|-------|----------|-----------|-----------|
| Vorkaufsrecht | Fast nur qualitativ/rechtlich | Sehr hoch | Größte Evidenzlücke im Datensatz |
| Bauverpflichtung | 1 gute Praxisstudie (Difu 2021) | Hoch | Quantifizierung fehlt |
| Eigenmietwert-Abschaffung (CH) | Fast keine empirischen Studien | Sehr hoch | Echte Evidenzlücke |
| Langfristige Mietregulierung (>10 Jahre) | Mittel | Mittel-Hoch | Einige Studien, Lücken bleiben |
| Interaktionseffekte mehrerer Parameter | Schwach | Mittel | Untererforscht |

---

## Offene Länder-Lücken

- **NO** (Norwegen): Keine Studien vorhanden
- **FR, JP, KR, AU:** Nur 1–2 Studien — hier fehlt Tiefe (besonders historische Studien 1970–1995)
- Historische Rent-Control-Studien aus den 70er/80er Jahren (Olsen 1972, Arnott 1995, Fischel 1985) sind bereits integriert

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
