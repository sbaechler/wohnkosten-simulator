---
id: "AT-003"
title: "How Much State and How Much Market? Comparing Social Housing in Berlin and Vienna"
authors: ["Kadi, Justin", "Schmid, Christoph"]
year: 2021
institution: "Housing Studies / WIFO"
type: "peer-reviewed"
language: "en"
url: "https://www.tandfonline.com/doi/full/10.1080/09644008.2020.1771696"
status: "evaluated"
dag_nodes:
  - "gemeinnuetzig_mindestanteil"
  - "gemeinnuetzig_foerderfonds"
  - "gemeinnuetzig_baurecht"
  - "gemeinnuetzig_kraft"
dag_edges_confirmed:
  - { from: "gemeinnuetzig_foerderfonds", to: "gemeinnuetzig_kraft", sign: +1, note: "Wien-Modell mit starken Institutionen (Wiener Wohnen) und langfristigen Förderungen ist deutlich effektiver als Berlin-Modell" }
  - { from: "gemeinnuetzig_baurecht", to: "mietpreis_schutzlevel", sign: +1, note: "Rechtlich abgesicherte Baurechte und langfristige Förderverträge stabilisieren günstiges Angebot" }
relevance: "high"
duplicate_of: null
regions: ["AT", "DE"]
cities: ["Wien", "Berlin"]
period_covered: "1920–2020"
---

## Zusammenfassung

Vergleichende Studie zwischen dem Wiener Gemeindebau-Modell und dem Berliner Sozialwohnungsmodell. Zeigt, warum Wien deutlich erfolgreicher bei der Bereitstellung von bezahlbarem Wohnraum ist.

## Key Findings

- Wien hat effektive Institutionen geschaffen, die private Akteure langfristig im gemeinnützigen Sektor halten (Wiener Wohnen, langfristige Baurechte, stabile Förderung).
- Berlin hat ein fragmentierteres System mit kürzeren Förderzeiträumen und stärkerer Abhängigkeit von privaten Investoren.
- Wien erreicht höhere Sozialmischung und stabilere Mietpreise durch großen, dauerhaft gemeinnützigen Bestand (~25% des Wohnungsbestands).
- Das Wiener Modell ist robuster gegenüber Marktschwankungen.

## Relevanz für DAG

- Starke Evidenz für `gemeinnuetzig_baurecht` und `gemeinnuetzig_foerderfonds` als entscheidende Hebel
- `gemeinnuetzig_kraft` als systemischer Faktor: Wien zeigt, dass Größe + institutionelle Stabilität den Unterschied machen
- Vergleich DE-AT sehr wertvoll für Schweizer Debatte um gemeinnützigen Wohnungsbau

## Notizen

- Ergänzt AT-001 und AT-002
- Zeigt, dass nicht nur der Anteil, sondern die institutionelle Ausgestaltung entscheidend ist
- Wien-Modell wird international (Guardian, OECD) häufig als Best Practice zitiert
---