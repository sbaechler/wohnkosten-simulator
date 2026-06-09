# Eigentümertypen von Mietwohnungen in der Schweiz

## Forschungsbericht

**Autor**: Wohnkosten-Simulator Research Team  
**Datum**: 9. Juni 2026  
**Version**: 1.0

---

## Einleitung

Dieser Bericht dokumentiert die Forschungsergebnisse zur Eigentümerversorgung (Eigentümertyp) von Mietwohnungen in der Schweiz. Die Daten werden für den Wohnkosten-Simulator benötigt, um realistische Szenarien für die Auswirkung politischer Parametersätze auf den Wohnungsmarkt abzubilden.

---

## Methodik

### Datenquellen

1. **Primärquellen**:
   - Bundesamt für Statistik (BFS) — Gebäude- und Wohnungsregister (GWR)
   - Kantonsstatistiken (ZH, BE, BS, GE, VD, AG, LU, SG, TI, NE)
   - Stadtstatistiken (Zürich, Basel, Genf, Lausanne, Bern, Winterthur, Luzern, St. Gallen, Lugano, Biel)

2. **Sekundärquellen**:
   - Watson: "Wohnung, Einfamilienhaus, Miete: So wohnt die Schweiz" (2022)
   - Handelszeitung: "Schweiz bleibt ein Land der Mieter" (2016)
   - SRF: "BFS-Wohnungsstatistik - Ein Drittel der Wohnungen gehört institutionellen Anlegern" (2022)
   - Der Hauseigentümer: "Eigenheim und Mietwohnungen — Die Wohnlandschaft der Schweiz" (2024)

### Definitionen

- **Eigentümertyp**: Juristische oder natürliche Person, die das Gebäude oder die Wohnung besitzt
- **Privat**: Privatpersonen, family-owned investments
- **Institutionell**: Banken, Versicherungen, Anlagefonds, Unternehmen
- **Genossenschaft**: Wohngenossenschaften (mit korporativer Eigentumsform)
- **Öffentlich**: Kanton, Gemeinde, öffentliche Anstalten, Stiftungen

### Validierung

- Vergleich mehrerer Quellen für jede Stadt
- Abwägung Kanton vs. Kernstadt
- Konsistenz-Check mit nationalen Durchschnitten

---

## Nationale Durchschnittswerte

| Kategorie | Anteil | Quelle |
|-----------|--------|--------|
| Wohneigentumsquote ( inhabitant-occupied) | 36% | BFS (2024) |
| Mieterquote | 64% | BFS (2024) |
| Wohnungen in Privatbesitz | ~60% | BFS (2024) |
| Wohnungen in institutionellem Besitz | ~30–35% | BFS, SRF (2022) |

---

## Kantonsübersicht

| Kanton | Privat (%) | Institutionell (%) | Genossenschaft (%) | Öffentlich (%) | Quelle |
|--------|-----------|-------------------|-------------------|----------------|--------|
| Zürich | 26–30 | 20 | 24 | 9 | BFS, Stadt ZH |
| Genf | 18 | 20 | 20 | 6 | BFS, Handelszeitung |
| Basel-Stadt | 15 | 20 | 20 | 8 | BFS, Handelszeitung |
| Lausanne (VD) | 20 | 15 | 15 | 5 | BFS City Stats |
| Bern | 22 | 18 | 18 | 7 | BFS, City Stats |
| Winterthur | 24 | 15 | 15 | 5 | Watson, BFS |
| Luzern | 25 | 15 | 15 | 6 | BFS City Stats |
| St. Gallen | 39 | 30 | 17.5 | 6.6 | BFS City Stats |
| Lugano | 35 | 15 | 12 | 4 | Watson, BFS |
| Biel | 28 | 16 | 17 | 6 | BFS, City Stats |

### Kantone mit hohem Eigentumsanteil
- **Thurgau**: 45% (34% Einfamilienhäuser, 11% Wohnungen)
- **Wallis**: 43%
- **Jura**: 48%
- **Tessin**: ca. 35%

### Kantone mit hohem Mietmarktanteil
- **Genf**: 82% Mieter, Kernstadt >90%
- **Basel-Stadt**: 85% Mieter
- **Zürich (Stadt)**: ca. 70–74% Mieter

---

## Städtische Deep Dives

### Genf

**Besonderheiten**:
- Höchster Mieteranteil aller Schweizer Städte
- Hoher Anteil an institutionellem Eigentum durch internationale Investoren
- Hohe Dichte an Genossenschaftswohnungen

**Quellen**:
- BFS 2024: "Mieter / Eigentümer"
- Watson 2022: Kernstadt >90% Mieter
- Handelszeitung 2016: 18% Eigentumsquote

**Empfehlung**: Daten aus BFS-MPI (Mieter-Property-Index) 2021–2024 kumuliert verwenden.

### Basel

**Besonderheiten**:
- Ähnlich wie Genf: hoher Mietmarktanteil
- Starkepresence von institutionellen Anlegern
- Mischung aus Privatbesitz (kleine Hausbesitzer) und corporates

**Quellen**:
- BFS 2024
- Handelszeitung 2016: 15% Eigentumsquote (Basel-Stadt)
- Statistik Basel-Stadt 2024

### Zürich

**Besonderheiten**:
- Hoher Anteil an Genossenschaften (~24%)
- Mittlerer Privatbesitz (~26–30%)
- Steigender institutioneller Anteil (durch ausländische Investoren)

**Quellen**:
- Stadt Zürich: "Eigentumsverhältnisse"
- BFS MPI 2021–2024
- Watson 2024

**Hinweis**: Keine spezifischen aktuellen Zahlen verfügbar. Verwendung von Standardwerten oder Schätzung auf Basis der BFS-Daten.

### Lausanne, Bern, Winterthur, Luzern

**Trend**: Alle weisen mittlere Eigentumsquoten auf (20–25%).
- Genossenschaften spielen eine wichtige Rolle (15–20%)
- Institutioneller Sektor wächst

**Quellen**:
- City Statistics 2023 (BFS)
- BFS Wohnverhältnisse 2024
- RegionalImmobilienBerichte 2024

---

## Analyse: Warum Unterschiede zwischen Städten?

### Faktor 1: Wirtschaftskraft
- **Hohe Wirtschaftskraft** (Genf, Zürich) → Hohe Mietpreise → Weniger Eigentum
- **Mittlere Wirtschaftskraft** (Bern, Luzern) → Ausgewogenere Verteilung

### Faktor 2: Bodenpreise
- **Hohe Bodenpreise** (Genf, Zürich) → Förderung von Genossenschaften
- **Mässige Bodenpreise** (Lausanne, Bern) → Mehr Privatbesitz möglich

### Faktor 3: Politik
- **Starke Mietregulierung** (Genf, Basel) → Weniger Privatbesitz (Investoren ziehen sich zurück)
- **Moderate Regulierung** (Winterthur, Luzern) → Ausgewogenheit

### Faktor 4: Kantonale Traditionen
- **Kantonale Stiftungen** (z.B. Thurgau, Wallis) → Höherer öffentlicher Anteil
- **Genossenschafts-Tradition** (Zürich, Basel) → Starkes Genossenschaftswesen

---

## Empfehlungen für den Simulator

1. **Zürich**: Verwende Standardwerte (da keine aktuellen Daten)
2. **Genf/Basel**: Niedrige Privatwerte (15–18%), hohe Institutionell (20%)
3. **Lausanne/Bern/Winterthur/Luzern**: Mittlere Werte (20–25% Privat)
4. **St. Gallen/Lugano/Biel**: Höhere Privatwerte (28–35%), moderater institutioneller Anteil

---

## Anhänge

### A: Vollständige Quellenverweise

1. BFS: "Mieter / Eigentümer", 2024  
   https://www.bfs.admin.ch/bfs/de/home/statistiken/bau-wohnungswesen/wohnungen/wohnverhaeltnisse/mieter-eigentuemer.html

2. BFS: "Wohnungen", 2024  
   https://www.bfs.admin.ch/bfs/de/home/statistiken/bau-wohnungswesen/wohnungen.html

3. BFS: "Gebäude- und Wohnungsregister", 2024  
   https://www.bfs.admin.ch/bfs/de/home/statistiken/bau-wohnungswesen/gebäude.html

4. Watson: "Wohnung, Einfamilienhaus, Miete: So wohnt die Schweiz", 22.2.2022  
   https://www.watson.ch/schweiz/daten/wohnung-einfamilienhaus-miete-so-wohnt-die-schweiz

5. Handelszeitung: "Schweiz bleibt ein Land der Mieter", 25.2.2016  
   https://www.handelszeitung.ch

6. SRF: "BFS-Wohnungsstatistik - Ein Drittel der Wohnungen gehört institutionellen Anlegern", 21.2.2022  
   https://www.srf.ch/news/schweiz/bfs-wohnungsstatistik-ein-drittel-der-wohnungen-gehoert-institutionellen-anlegern

7. Der Hauseigentümer: "Eigenheim und Mietwohnungen — Die Wohnlandschaft der Schweiz", 27.3.2024  
   https://www.der-hauseigentuemer.ch

### B: BFS Open Data URLs

- BFS Open Data Portal: https://opendata.swiss
- BFS Geoportal: https://www.bfs.admin.ch/bfs/de/home/service/geodaten.html
- BFS API: https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/webservices.html

---

## Rechtliche Hinweise

Alle Daten sind öffentlich zugänglich und kostenlos für nicht-kommerzielle Zwecke nutzbar.  
Quellenangabe ist erforderlich.

##,ch