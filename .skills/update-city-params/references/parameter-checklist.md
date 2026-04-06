# Parameter-Checkliste: Was suchen, wo suchen

## Volatilität: Hoch (jährlich prüfen)

### `zuwanderungsdruck` (Context, –2 bis +2)

Basis: Leerwohnungsziffer
- BFS publiziert jährlich Anfang September
- Grenzwerte für Stufen:
  - +2: < 0.5%
  - +1: 0.5–1.5%
  - 0: 1.5–2.5%
  - –1: > 2.5%

Suchbegriffe:
```
[Stadt] Leerwohnungsziffer [Jahr]
BFS Leerwohnungszählung [Jahr] Schweiz
[Kanton] Wohnungsmarkt Leerstand [Jahr]
```

Quellen: bfs.admin.ch, bwo.admin.ch, housing-stat.ch, Kantonale Statistikämter

| Stadt | Kanton | Letzte bekannte Ziffer |
|-------|--------|----------------------|
| Zürich | ZH | 0.07% (2025) |
| Genf | GE | 0.34% (2025) |
| Basel | BS | 0.9% (2025) |
| Lausanne | VD | 0.58% (2025) |
| Bern | BE | ~0.4% (2025) |
| Winterthur | ZH | 0.18% (2025) |
| Luzern | LU | 1.01% (2025) |
| St. Gallen | SG | 2.1% (2024) |
| Lugano | TI | ~1.0% (2025) |
| Biel | BE | 1.08% (2024) |

---

### `boden_vorkaufsrecht` (0/1/2)

Ändert via: Volksinitiative, Kantonsrat, Gemeindeordnung
- 0 = kein Vorkaufsrecht
- 1 = kantonal/kommunal vorhanden, selten aktiviert
- 2 = umfassendes Vorkaufsrecht, aktiv genutzt

Suchbegriffe:
```
[Stadt/Kanton] Vorkaufsrecht Gemeinde [Jahr]
Volksinitiative kommunales Vorkaufsrecht [Kanton] [Jahr]
```

Aktueller Stand:
- ZH: 0 (Initiative Nov. 2025 abgelehnt)
- GE: 1 (kantonal, selten aktiviert)
- VD/Lausanne: 2 (LPPPL aktiv)
- Alle anderen: 0

---

### `gemeinnuetzig_foerderfonds` (0/1/2)

Ändert via: Kantonale Budgetbeschlüsse, neue Fonds
- 0 = kein Fonds
- 1 = kantonaler Fonds mit begrenzten Mitteln
- 2 = gut ausgestatteter kantonaler + nationaler Fonds

Suchbegriffe:
```
Kanton [Kanton] Wohnbaufonds [Jahr] Millionen
[Kanton] Wohnbauförderung Budget [Jahr]
```

Aktueller Stand:
- ZH: 2 (auf 360 Mio. CHF verdoppelt, Nov. 2025)
- BE: 1 (gespiesen durch Mehrwertabgabe)
- BS: 2 (aktiver kantonaler Fonds)
- Alle anderen: 1 (nationaler Fonds de Roulement)

---

### `bau_sanierungspflicht` (0/1/2)

Ändert via: Kantonales Energiegesetz, Bundesvorgaben
- 0 = keine Pflicht
- 1 = Zielwert empfohlen
- 2 = gesetzliche Pflicht mit Frist

Suchbegriffe:
```
Kanton [Kanton] Sanierungspflicht Heizung [Jahr]
Elektroheizungen Ersatzpflicht [Kanton] [Jahr]
MuKEn [Kanton] Umsetzung [Jahr]
```

Aktueller Stand:
- ZH, WIN: 2 (Elektroheizungen bis 2030)
- BE, BIEL: 2 (MuKEn 2025 früh umgesetzt)
- Alle anderen: 1

---

### `mietrecht_kuendigungsschutz` (0/1/2)

Ändert via: Kantonale Wohnschutzgesetze, Volksabstimmungen
- 0 = schwacher Schutz (nur Bundesrecht)
- 1 = Erstreckungsrecht (Bundesrecht OR)
- 2 = Vorabprüfung/kantonales Gesetz bei Massenkündigungen

Suchbegriffe:
```
Kanton [Kanton] Wohnraumschutzgesetz [Jahr]
[Kanton] Massenkündigung Wohnungen Schutz [Jahr]
Wohnschutzgesetz [Stadt/Kanton] neu [Jahr]
```

Aktueller Stand:
- ZH, WIN: 2 (WRG ZH 860.1)
- BS, GE: 2 (Wohnschutzgesetz BS / LDTR GE)
- Alle anderen: 1

---

## Volatilität: Mittel (alle 1–2 Jahre prüfen)

### `boden_mehrwertabgabe` (0/1/2)

Ändert via: Kantonale Gesetze
- 0 = keine Abgabe
- 1 = 20–39% (RPG-Minimum)
- 2 = 40%+ (über RPG-Minimum)

| Kanton | Satz | Wert |
|--------|------|------|
| ZH | 40% (Aufzonungen) | 1 |
| BE | 50% (Einzon.) / 40% (Aufzon.) | 2 |
| BS | 20% | 1 |
| GE | 20% | 1 |
| VD | 20% | 1 |
| LU | 20% | 1 |
| SG | 20% | 1 |
| TI | 30% | 1 |

---

### `bau_energievorgaben` (0/1/2)

Ändert via: MuKEn-Revision, kantonale Umsetzung
- 0 = keine Pflicht
- 1 = MuKEn 2014 Standard
- 2 = MuKEn 2025 / Netto-Null-Pflicht

Suchbegriffe:
```
Kanton [Kanton] Energiegesetz Neubau [Jahr]
MuKEn 2025 [Kanton] Umsetzung
```

---

### `mietrecht_kostenmiete` (0/1/2)

Ändert via: Kantonale Gesetze, Volksabstimmungen
- 0 = freie Marktmiete
- 1 = Bundesrecht (Rendite gedeckelt, OR Art. 269)
- 2 = Kantonaler Mietzinsdeckel (BS Wohnschutzgesetz, GE LDTR)

Suchbegriffe:
```
Kanton [Kanton] Mietzinsdeckel Wohnschutz [Jahr]
Volksabstimmung Mietrecht [Kanton] [Jahr]
```

---

### `steuer_handaenderung` (0/1/2)

Stabil, aber gelegentliche Anpassungen:
```
Handänderungssteuer Kanton [Kanton] [Jahr] Prozent
```

| Kanton | Satz | Wert |
|--------|------|------|
| ZH | 0% | 0 |
| BE | ~1.8% | 1 |
| BS | ~1.5% | 1 |
| GE | ~3% | 1 |
| VD | ~2.2% | 1 |
| LU | ~1.5% | 1 |
| SG | ~1% | 1 |
| TI | ~1.1% | 1 |

---

## Volatilität: Gering (alle 2–3 Jahre prüfen)

### Bundesrechtliche Parameter (für alle Städte gleich)

Diese Parameter ändern nur via Bundesgesetz / Bundesgerichtsurteil:

| Parameter | Aktuell | Quelle |
|-----------|---------|--------|
| `zinsniveau` | –1 | SNB Leitzins / Referenzzinssatz |
| `bevoelkerungstrend` | –1 | BFS Geburtenrate |
| `bau_einspracherecht_suspensiv` | 2 | VRPG (Bundesrecht) |
| `bau_normenharmonisierung` | 1 | IVHB (17/26 Kantone) |
| `mietrecht_mietzinstransparenz` | 1 | VMWG Art. 19 (seit Okt. 2025) |
| `mietrecht_mietzinsindex` | 0 | OR Art. 269a (Referenzzinssatz) |
| `steuer_kapitalgewinnprivatpersonen` | 0 | DBG Art. 16 Abs. 3 |
| `kapital_auslaendische_investoren` | 1 | BewG (Lex Koller) |
| `kapital_hypothekarregulierung` | 1 | FINMA RS 2012/3 |
| `nutzung_zweitwohnungen` | 1 | ZWG (20%-Deckel) |

Suchbegriff für grobe Prüfung:
```
Mietrecht Schweiz Änderung [Jahr] OR Lex Koller Änderung [Jahr] OR FINMA Hypothek [Jahr]
```

---

## SNB Zinsniveau — Spezialfall

`zinsniveau` gilt für alle Städte gleich.

Grenzwerte:
- –2: SNB-Leitzins < –1% (Negativzins-Phase 2015–2022)
- –1: Leitzins –0.5% bis +0.5% (aktuell: –0.25%)
- 0: Leitzins 0.5%–1.5%
- +1: Leitzins 1.5%–2.5%
- +2: Leitzins > 2.5%

Suchbegriff: `SNB Leitzins aktuell` oder `SNB Referenzzinssatz [Monat Jahr]`

Aktuell (April 2026): Leitzins –0.25%, Referenzzinssatz 1.25% → `zinsniveau = –1`
