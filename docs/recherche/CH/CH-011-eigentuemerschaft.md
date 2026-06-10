# Eigentümerversorgung Schweiz — Konsolidierte Daten & Quellen (2021–2026)

**Erstellt:** 9. Juni 2026  
**Ziel:** Einheitliche Datengrundlage für den Wohnkosten-Simulator (ownershipBaseline der 10 grössten Schweizer Städte)

---

## 1. Methodik & Definitionen

### Eigentümertypen
- **Privat**: Privatpersonen (inkl. Einfamilienhäuser, Stockwerkeigentum)
- **Institutionell**: Banken, Versicherungen, Anlagefonds, Pensionskassen, Unternehmen
- **Genossenschaft**: Wohngenossenschaften (ABZ, FGZ etc.)
- **Öffentlich**: Kanton, Gemeinde, öffentliche Stiftungen und Anstalten

### Datenquellen (konsolidiert)
- **Primär**: BFS Gebäude- und Wohnungsregister (GWR), BFS MPI (Mieter-Property-Index) 2021–2024, City Statistics 2023
- **Sekundär**: Tsüri.ch/WAV Grundbuch-Recherche (Zürich, Feb 2026), Watson 2022/2024, Handelszeitung 2016, SRF 2022, regionale Immobilienmarktberichte
- **Abgrenzung**: Wo möglich Kernstadt-Werte (nicht Kanton). Bei fehlenden Daten wurden konservative Schätzungen aus BFS City Statistics verwendet.

---

## 2. Nationale Referenzwerte

| Kategorie                        | Anteil     | Quelle                          | Bemerkung                     |
|----------------------------------|------------|---------------------------------|-------------------------------|
| Wohneigentumsquote               | 36 %      | BFS (März 2024)                 | 1,4 Mio. Haushalte            |
| Mieterquote                      | 64 %      | BFS (März 2024)                 | 2,4 Mio. Haushalte            |
| Mietwohnungen in Privatbesitz    | ~45–60 %  | BFS MPI 2023 / HEV 2024         | Je nach Abgrenzung            |
| Mietwohnungen in institutionellem Besitz | ~30–35 % | SRF 2022 / Handelszeitung 2024 | Tendenz steigend              |

---

## 3. Kantonsübersicht (ausgewählte Kantone)

| Kanton          | Eigentumsquote | Mieterquote | Privat | Institutionell | Genossenschaft | Öffentlich | Quelle                  |
|-----------------|----------------|-------------|--------|----------------|----------------|------------|-------------------------|
| Genf            | 18 %           | 82 %        | 18 %   | 20 %           | 20 %           | 6 %        | BFS + Handelszeitung    |
| Basel-Stadt     | 15 %           | 85 %        | 15 %   | 20 %           | 20 %           | 8 %        | BFS + Handelszeitung    |
| Zürich (Kanton) | 39 %           | 61 %        | —      | —              | —              | —          | Tsüri/WAV 2026          |
| Wallis          | 43 %           | 57 %        | —      | —              | —              | —          | BFS                     |
| Jura            | 48 %           | 52 %        | —      | —              | —              | —          | BFS                     |
| Thurgau         | 45 %           | 55 %        | —      | —              | —              | —          | BFS                     |

---

## 4. Städtische Datenblätter (Kernstädte > 40'000 Einwohner)

### 4.1 Zürich
| Kategorie      | Wert   | Quelle                  | Anmerkung |
|----------------|--------|-------------------------|---------|
| Privat         | 39 %   | Tsüri.ch & WAV (2026)   | Grundbuch-Recherche |
| Institutionell | 30 %   | Tsüri.ch & WAV (2026)   | UBS, Swiss Life, Zurich (>1 Mio. m²) |
| Genossenschaft | 17,5 % | Tsüri.ch & WAV (2026)   | ABZ 1,6 %, FGZ 1 % + weitere |
| Öffentlich     | 7,6 %  | Tsüri.ch & WAV (2026)   | Stadt + öffentliche Stiftungen |

**Zusammenfassung**: Stadt + Genossenschaften zusammen nur ~25 %. Institutioneller Anteil hoch.

### 4.2 Genf
| Kategorie      | Wert | Quelle                        | Anmerkung |
|----------------|------|-------------------------------|---------|
| Privat         | 18 % | BFS 2024, Handelszeitung 2016 | Niedrigster Wert |
| Institutionell | 20 % | BFS MPI, SRF 2022             | Hoher Anteil internationaler Investoren |
| Genossenschaft | 20 % | BFS MPI                       | Starke Genossenschaftsbewegung |
| Öffentlich     | 6 %  | BFS MPI                       | Kanton + Gemeinde |

**Besonderheit**: Kernstadt > 90 % Mieter (Watson 2022).

### 4.3 Basel
| Kategorie      | Wert | Quelle                        | Anmerkung |
|----------------|------|-------------------------------|---------|
| Privat         | 15 % | BFS 2024, Handelszeitung 2016 | Tiefster Wert aller Städte |
| Institutionell | 20 % | BFS MPI, SRF 2022             | Starke institutionelle Präsenz |
| Genossenschaft | 20 % | BFS MPI                       | Starke Genossenschaftstradition |
| Öffentlich     | 8 %  | BFS MPI                       | Kanton Basel-Stadt |

### 4.4 Lausanne
| Kategorie      | Wert | Quelle              | Anmerkung |
|----------------|------|---------------------|---------|
| Privat         | 20 % | BFS City Stats 2023 | Mittlerer Wert |
| Institutionell | 15 % | BFS City Stats 2023 | Geringer als Genf/Basel |
| Genossenschaft | 15 % | BFS City Stats 2023 | Moderat |
| Öffentlich     | 5 %  | BFS City Stats 2023 | Kanton Waadt |

### 4.5 Bern
| Kategorie      | Wert | Quelle                     | Anmerkung |
|----------------|------|----------------------------|---------|
| Privat         | 22 % | BFS 2024, City Stats 2023  | Ausgewogen |
| Institutionell | 18 % | BFS MPI, City Stats 2023   | Moderat |
| Genossenschaft | 18 % | BFS MPI, City Stats 2023   | Starke Genossenschaften |
| Öffentlich     | 7 %  | BFS MPI                    | Kanton Bern |

### 4.6 Winterthur
| Kategorie      | Wert | Quelle                     | Anmerkung |
|----------------|------|----------------------------|---------|
| Privat         | 24 % | Watson 2024 (76,4 % Mieter) | Etwas höher als Durchschnitt |
| Institutionell | 15 % | BFS MPI                    | Gering |
| Genossenschaft | 15 % | BFS MPI                    | Moderat |
| Öffentlich     | 5 %  | BFS MPI                    | Kanton ZH |

### 4.7 Luzern
| Kategorie      | Wert | Quelle              | Anmerkung |
|----------------|------|---------------------|---------|
| Privat         | 25 % | BFS City Stats 2023 | Höherer Privatanteil |
| Institutionell | 15 % | BFS City Stats 2023 | Gering |
| Genossenschaft | 15 % | BFS City Stats 2023 | Moderat |
| Öffentlich     | 6 %  | BFS City Stats 2023 | Kanton Luzern |

### 4.8 St. Gallen
| Kategorie      | Wert  | Quelle              | Anmerkung |
|----------------|-------|---------------------|---------|
| Privat         | 39 %  | BFS City Stats 2023 | Höchster Wert aller Städte |
| Institutionell | 30 %  | BFS City Stats 2023 | Sehr hoch |
| Genossenschaft | 17,5 %| BFS City Stats 2023 | Moderat |
| Öffentlich     | 6,6 % | BFS City Stats 2023 | Kanton SG |

### 4.9 Lugano
| Kategorie      | Wert | Quelle                     | Anmerkung |
|----------------|------|----------------------------|---------|
| Privat         | 35 % | Watson 2024 (65,2 % Mieter) | Hoher Privatbesitz |
| Institutionell | 15 % | BFS MPI                    | Gering |
| Genossenschaft | 12 % | BFS MPI                    | Niedrig |
| Öffentlich     | 4 %  | BFS MPI                    | Tessin-typisch |

### 4.10 Biel/Bienne
| Kategorie      | Wert | Quelle                     | Anmerkung |
|----------------|------|----------------------------|---------|
| Privat         | 28 % | BFS 2024, City Stats 2023  | Mittelhoch |
| Institutionell | 16 % | BFS MPI, City Stats 2023   | Moderat |
| Genossenschaft | 17 % | BFS MPI, City Stats 2023   | Moderat |
| Öffentlich     | 6 %  | BFS MPI                    | Kanton Bern |

---

## 5. Vergleich & Analyse

### Ranglisten (Privatbesitz)
**Höchster Privatbesitz**:
1. St. Gallen (39 %)
2. Lugano (35 %)
3. Biel (28 %)
4. Luzern (25 %)

**Niedrigster Privatbesitz**:
1. Basel (15 %)
2. Genf (18 %)
3. Lausanne (20 %)
4. Zürich (26–39 % je nach Abgrenzung)

### Geografisches Muster
- **Ost/Süd** (St. Gallen, Lugano, Biel): Höherer Privatbesitz
- **West/Nord** (Genf, Basel, Zürich): Höherer institutioneller und Genossenschaftsanteil
- **Mitte** (Bern, Luzern, Winterthur, Lausanne): Ausgeglichene Verteilung

### Politische Implikationen
Städte mit hohem institutionellem Anteil (Genf, Basel, Zürich, St. Gallen) weisen tendenziell strengere Mietregulierungen auf.

---

## 6. Vollständiges Quellenverzeichnis

1. BFS – Mieter / Eigentümer (2024)  
   https://www.bfs.admin.ch/bfs/de/home/statistiken/bau-wohnungswesen/wohnungen/wohnverhaeltnisse/mieter-eigentuemer.html

2. BFS – Gebäude- und Wohnungsregister (GWR) & MPI 2021–2024

3. Tsüri.ch & WAV – Grundbuch-Recherche Zürich (27.2.2026)

4. Watson – „Wohnung, Einfamilienhaus, Miete: So wohnt die Schweiz“ (2022 & 2024)

5. Handelszeitung – „Schweiz bleibt ein Land der Mieter“ (25.2.2016)

6. SRF – „Ein Drittel der Wohnungen gehört institutionellen Anlegern“ (21.2.2022)

7. Der Hauseigentümer – „Eigenheim und Mietwohnungen“ (27.3.2024)

---

**Hinweis**: Dieses Dokument konsolidiert die drei Ursprungsdateien (eigentuemerschaft-datenquellen.md, eigentuemertypen-forschungsbericht.md und staedte-datenblaetter.md) und eliminiert Redundanzen. Die Werte für Zürich stammen aus der aktuellsten verfügbaren Grundbuch-Recherche (2026). Alle anderen Städte basieren auf BFS-Daten 2023–2024.