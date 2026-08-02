# Wohnkosten-Simulator

> Simuliere die Auswirkungen von Wohnbaupolitik auf Mietpreise, Eigentumsquoten und Verdrängungsdynamik in Schweizer Städten.

**Live:** [wohnkosten-simulator.ch](https://wohnkosten-simulator.ch/)

---

## Was ist das?

Ein interaktiver Policy-Simulator für den Schweizer Wohnungsmarkt. Du wählst eine Stadt (Zürich, Genf, Bern, Basel, Lausanne), justierst 40 wohnungspolitische Parameter in drei Stufen (schwach → mittel → stark) und siehst sofort, wie sich die Indikatoren verändern:

- **Markt-Zustand:** Angebpotenzial, Nachfragedruck, Mietpreisschutz, Verdrängungsrisiko, Spekulationshemmung, Marktfriktion, gemeinnützige Kraft, Eigentumsquoten-Trend, Aufwertungsdruck, Investitionsattraktivität
- **Abgeleitete Indikatoren:** Gentrifizierungsindex, Neubau-Hemmnis, Verdrängungsrisiko-Index, Fiskalische Wirkung

Die Berechnung basiert auf Erkenntnissen aus über [100 wissenschaftlichen Studien](./docs/recherche/index.md).

---

## Für wen?

- **Stadtplaner & Politikexperten** — Auswirkungen von Massnahmen快速 abschätzen
- **Medien & Journalist:innen** — Datenbasierte Visualisierungen für Berichte
- **Wähler:innen & Verbände** — Argumentation für wohnungspolitische Vorstösse untermauern
- **Studierende** — Wohnungsmarkt-Dynamik interaktiv lernen

---

## 40 Parameter in 8 Kategorien

| Kategorie | Themen |
|---|---|
| **Bodenrecht & Landnutzung** | Zonenreserve, Verdichtung, Ausnützungsziffer, Vorkaufsrecht, Bauverpflichtung, Mehrwertabgabe, Bodeneigentumssteuer |
| **Bau & Bewilligung** | Energievorgaben, Sanierungspflicht, Einspracherecht Dritte/Suspensiv, Bewilligungsverfahren, Normenharmonisierung |
| **Gemeinnütziger Wohnungsbau** | Mindestanteil, Förderfonds, Baurecht, Belegungsvorschriften, Sozialmischung |
| **Mietrecht** | Kostenmiete, Anfangsmiete, Mietzinstransparenz, Kündigungsschutz, Mietzinsindex, Untervermietung |
| **Steuern & Abgaben** | Grundstückgewinnsteuer, Eigenmietwert, Leerstandsabgabe, Handänderungssteuer, Kapitalgewinnsteuer |
| **Kapital & Investitionen** | Ausländische Investoren, Institutionelle Regulierung, Hypothekarregulierung |
| **Nutzungsregulierung** | Kurzzeitvermietung, Umnutzungsverbot, Abbruchverbot, Zweitwohnungen |
| **Infrastruktur & Standortqualität** | ÖPNV, Schule/Kita, Öffentlicher Raum, Wirtschaftsansiedlung |

---

## Architektur

```
src/
├── model/
│   ├── params.ts        # 40 Parameter + Metadaten
│   ├── phases.ts        # Phasen (roh → E1 → E2)
│   ├── phase-weights.ts # Gewichtungsmatrix
│   ├── graph.ts         # DAG-Struktur
│   └── derived.ts       # E2-Berechnung
├── components/
│   ├── CitySelector.tsx
│   └── ParameterPanel.tsx
├── widgets/
│   ├── WidgetGrid.tsx    # 2×4 Widget-Layout
│   ├── DAGVisualization.tsx
│   └── *.tsx            # Einzelne Widgets
└── hooks/
    └── useUrlState.ts   # URL ↔ State Sync
```

---

## Städte

- Zürich
- Genf
- Basel
- Lausanne
- Bern
- Winterthur
- Luzern
- St. Gallen
- Lugano
- Biel

---

Lizenz: **AGPL-3.0** (siehe LICENSE.txt)
Repository: [github.com/sbaechler/wohnkosten-simulator](https://github.com/sbaechler/wohnkosten-simulator)