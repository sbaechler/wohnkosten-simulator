---
id: "GLOBAL-024"
title: "Housing Constraints and Spatial Misallocation"
authors: ["Hsieh, Chang-Tai", "Moretti, Enrico"]
year: 2019
institution: "University of Chicago / UC Berkeley / NBER"
type: "peer-reviewed"
language: "en"
url: "https://www.aeaweb.org/articles?id=10.1257/mac.20170388"
doi: "10.1257/mac.20170388"
nber_wp: "https://www.nber.org/papers/w21154"
pdf: "https://eml.berkeley.edu/~moretti/growth.pdf"
status: "evaluated"
dag_nodes:
  - "raumplanung_zonenreserve"
  - "raumplanung_verdichtung"
  - "bau_bewilligungsverfahren"
  - "angebotspotenzial"
  - "neubau_hemmnisindex"
dag_edges_confirmed:
  - { from: "raumplanung_zonenreserve", to: "angebotspotenzial", sign: -1, note: "Angebotsrestriktionen in NYC/SF kosten USA 36% BIP-Wachstum 1964–2009" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL", "US"]
period_covered: "1964–2009"
countries: "220 US Metropolitan Areas"
---

## Zusammenfassung

Bahnbrechende Studie, die die gesamtwirtschaftlichen Kosten von Wohnraumrestriktionen in US-Städten
quantifiziert. Durch Gleichgewichtsmodell mit Daten aus 220 Metropolregionen wird gezeigt, dass
restriktive Raumplanung in high-productivity cities (NYC, SF, San Jose) Arbeitskräfte davon abhält,
dorthin zu ziehen — mit massiven volkswirtschaftlichen Konsequenzen.

## Key Findings

- Wohnungsbaubeschränkungen in New York, San Francisco und San Jose reduzierten **US-BIP-Wachstum um 36%** zwischen 1964 und 2009
- Wenn Bauvorschriften in diesen Städten auf das Medianniveau der US-Städte gesenkt würden, würde das US-BIP um ca. **9% steigen**
- Die Misallokation entsteht, weil Hochlohnstädte hohe Produktivität haben, aber Arbeitskräfte wegen Wohnungsknappheit und -preisen nicht hinziehen können
- Wohlfahrtsverlust: Arbeitskräfte arbeiten in weniger produktiven Standorten, weil die produktiven Standorte de facto gesperrt sind
- Preiseffekte: Median home values in SF/NYC 3–5x höher als in Städten mit elastischem Angebot

## Relevanz für DAG

- **Stärkster Befund zur gesamtwirtschaftlichen Bedeutung des Angebots:**
  `raumplanung_zonenreserve → angebotspotenzial` (sign: -1) mit weit über lokale Markteffekte hinausgehenden Konsequenzen
- Fiskalische Wirkung: Angebotsrestriktionen haben auch `fiskalische_wirkung` (Steuereinnahmen, BIP-Beitrag)
- Bestätigt die zentrale Bedeutung von `neubau_hemmnisindex` als Indikator mit gesamtwirtschaftlicher Relevanz

## Zitate

> "We find that these constraints lowered aggregate US growth by 36 percent from 1964 to 2009." (Abstract)

> "If housing supply restrictions in New York, San Francisco, and San Jose were reduced to the median level of US cities, GDP would be 9 percent higher." (S. 2)

## Notizen

- Methodologisch wegweisend: kombiniert Spatial Equilibrium Model mit Mikrodaten
- Häufig zitiert in der Debatte über Upzoning und Angebotsreformen
- Für CH relevant: Ähnliche Mechanismen in Zürich/Genf — Wohnungsknappheit verhindert Zuzug produktiver Arbeitskräfte
- Ergänzung: Büchler & Lutz (2024) für CH-spezifische Evidenz; Saiz (2010) für geographische Constraints
