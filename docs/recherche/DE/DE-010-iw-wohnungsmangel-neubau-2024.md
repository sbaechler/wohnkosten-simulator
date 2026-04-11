---
id: "DE-010"
title: "Mehr Wohnungsmangel durch steigende Bedarfe und sinkende Bautätigkeit"
authors: ["Deschermeier, Philipp", "Henger, Ralph", "Voigtländer, Michael"]
year: 2024
institution: "Institut der deutschen Wirtschaft Köln (IW)"
type: "government-report"
language: "de"
url: "https://www.iwkoeln.de/studien/philipp-deschermeier-ralph-henger-michael-voigtlaender-mehr-wohnungsmangel-durch-steigende-bedarfe-und-sinkende-bautaetigkeit.html"
pdf: "https://www.iwkoeln.de/fileadmin/user_upload/Studien/Gutachten/PDF/2024/IW-Gutachten_2024-Wohnungsbaubedarfe.pdf"
doi: null
status: "evaluated"
dag_nodes:
  - "ctx:zuwanderungsdruck"
  - "bau_bewilligungsverfahren"
  - "bau_energievorgaben"
  - "angebotspotenzial"
  - "nachfragedruck"
  - "neubau_hemmnisindex"
dag_edges_confirmed:
  - { from: "ctx:zuwanderungsdruck", to: "nachfragedruck", sign: +1, note: "Hohe Zuwanderung 2022–2024 erhöhte Wohnungsbedarf massiv während Bautätigkeit sank" }
  - { from: "bau_energievorgaben", to: "angebotspotenzial", sign: -1, note: "Steigende Baukosten durch Energievorschriften und Material als Hemmnis identifiziert" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["DE"]
period_covered: "2020–2024"
---

## Zusammenfassung

IW Köln Gutachten 2024 zur Wohnungsbaubedarfssituation in Deutschland. Zeigt, dass
trotz gestiegenem Bedarf durch Zuwanderung die Bautätigkeit stark eingebrochen ist —
mit prognostiziert weiter zunehmendem Wohnungsmangel 2024/2025.

## Key Findings

- In den Metropolen wurden 2020–2023 nur **37–43%** der benötigten Wohnungen gebaut
- Bautätigkeit wird 2024/2025 voraussichtlich noch weiter sinken → Mangel nimmt flächendeckend zu
- Ursachen: gestiegene Baukosten, höhere Zinsen, Materialknappheit, verschärfte Energieanforderungen
- Hohe Zuwanderung 2022–2024 (Ukraine, internationale Migration) erhöhte Bedarf zusätzlich
- Ohne Trendwende: Wohnungsmangel auch in bisher entspannteren Regionen

## Relevanz für DAG

- Bestätigt `bau_energievorgaben → angebotspotenzial` (sign: -1): Energievorgaben sind realer Kostentreiber
- `ctx:zuwanderungsdruck → nachfragedruck` (sign: +1) für DE stark belegt
- `neubau_hemmnisindex` als E2-Indikator: DE zeigt strukturell hohe Hemmnisse
- Für CH übertragbar: Ähnliche Dynamik (Zuwanderung + sinkender Neubau 2023/2024)

## Notizen

- Wichtige Gegenwartsdiagnose für DE-Wohnungsmarkt
- Ergänzt DE-001 (DIW Mietpreisbremse-Studie) um Angebots-Perspektive
- IW Köln veröffentlicht quartalsweise Wohnungsmarktberichte — laufende Monitoringquelle
