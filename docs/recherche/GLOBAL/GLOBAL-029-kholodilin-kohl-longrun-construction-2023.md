---
id: "GLOBAL-029"
title: "Do rent controls and other tenancy regulations affect new construction? Some answers from long-run historical evidence"
authors: ["Kholodilin, Konstantin A.", "Kohl, Sebastian"]
year: 2023
institution: "DIW Berlin / Max Planck Institute"
type: "peer-reviewed"
language: "en"
url: "https://www.tandfonline.com/doi/full/10.1080/19491247.2022.2164398"
doi: "10.1080/19491247.2022.2164398"
status: "evaluated"
dag_nodes: ["mietrecht_kuendigungsschutz", "mietrecht_kostenmiete", "angebotspotenzial", "neubau_hemmnisindex"]
dag_edges_confirmed: ["mietrecht_kuendigungsschutz → angebotspotenzial (sign: -1)"]
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
---

## Zusammenfassung

Bahnbrechende Langzeitstudie: Mietrecht und Wohnungsbau in 16 entwickelten Ländern von 1910 bis 2016. Erstellt ein umfassendes Dataset über Mietregulierungsintensität und Neubaukennzahlen über mehr als 100 Jahre. Direkte Antwort auf die kritische Lücke der Langzeiteffekte.

## Key Findings

- Restriktivere Mietmarktgesetze haben **generell einen negativen Effekt auf den Neubau** und auf Wohnbauinvestitionen — über alle 16 Länder hinweg
- **Ausnahme:** Neubau, der explizit von Mietpreiskontrollen ausgenommen wird, zeigt diesen negativen Effekt nicht → "Vacancy decontrol" oder "New construction exemption" ist ein entscheidender Moderator
- Die negativen Effekte sind **nicht universell** — in einigen Ländern schwächer ausgeprägt, was auf institutionelle Unterschiede hindeutet
- **Langzeitperspektive** (>50 Jahre): Kumulative Effekte auf den Wohnungsbestand sind erheblich
- Tenancy regulations reduce residential investment even when direct rent ceilings are absent

## Relevanz für DAG

**Bestätigt stark:**
- `mietrecht_kuendigungsschutz` → `angebotspotenzial` (sign: -1, weight: 1.0, time: medium-long)
- `mietrecht_kostenmiete` → `angebotspotenzial` (sign: -1, weight: 1.0, time: long)

**Nuance für DAG:** Wenn Neubau von Mietregulierung ausgenommen ist (wie in CH mit neuem Baurecht), schwächt dies den Negativeffekt deutlich ab. Dieser Interaktionsterm ist modellrelevant.

## Zitate

> "More restrictive rental market legislation generally has a negative impact on both new housing construction and residential investment." (Abstract)

> "The rather surprising non-universality of a strong negative tenancy-regulation effect could be explained by the fact that new construction has often been exempted from rent control." (Conclusion)

## Notizen

- Schliesst die kritische Lücke der **Langzeiteffekte von Mietpreisregulierung** (>15 Jahre)
- Companion-Paper zu Kholodilin 2024 (GLOBAL-012/-027, Meta-Review)
- Besonders relevant für den CH-Kontext: Kostenmiete + Kündigungsschutz sind langfristig angebotsrelevant
