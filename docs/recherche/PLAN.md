# Recherche-Plan: Wohnpreisentwicklung — Empirische Studien

## Ziel

Systematische, weltweite Sammlung empirischer Studien zu Wohnpreisentwicklung (1970–2025).
Fokus: Wirkungsnachweise für die ~40 Parameter des DAG-Modells (graph.ts).

## Ordnerstruktur

```
docs/recherche/
  PLAN.md                    ← dieser Plan
  README.md                  ← Methodik, Suchstrategie, Qualitätskriterien
  _index.md                  ← Gesamtindex aller Studien (auto-generiert)
  CH/                        ← Schweiz
  DE/                        ← Deutschland
  AT/                        ← Österreich
  FR/                        ← Frankreich
  UK/                        ← Vereinigtes Königreich
  US/                        ← USA
  CA/                        ← Kanada
  NL/                        ← Niederlande
  SE/                        ← Schweden
  DK/                        ← Dänemark
  NO/                        ← Norwegen
  ES/                        ← Spanien
  PT/                        ← Portugal
  JP/                        ← Japan
  KR/                        ← Südkorea
  SG/                        ← Singapur
  AU/                        ← Australien
  NZ/                        ← Neuseeland
  GLOBAL/                    ← Länderübergreifend (OECD, IMF, BIS, World Bank)
```

### Dateiformat pro Studie

```markdown
---
id: "CH-001"
title: "Titel der Studie"
authors: ["Nachname, Vorname"]
year: 2020
institution: "ETH Zürich"
type: "peer-reviewed" | "working-paper" | "government-report" | "meta-study" | "book-chapter"
language: "de"
url: "https://..."
doi: "10.xxxx/xxxxx"
status: "found" | "reading" | "evaluated" | "integrated"
dag_nodes: ["mietrecht_kostenmiete", "angebotspotenzial"]
dag_edges_confirmed: []
dag_edges_challenged: []
relevance: "high" | "medium" | "low"
duplicate_of: null
---

## Zusammenfassung

...

## Key Findings

- ...
- ...

## Relevanz für DAG

Welche Kanten werden bestätigt/widerlegt? Welche Gewichte/Vorzeichen?

## Zitate

> "Wörtliches Zitat" (S. xx)

## Notizen

...
```

## Phasen

### Phase 0: Setup (jetzt)
- [x] Ordnerstruktur anlegen
- [x] Plan erstellen
- [ ] README.md mit Methodik schreiben
- [ ] Suchstrategie pro Region definieren
- **Dauer:** 1 Session

### Phase 1: Systematische Suche — Kern-Regionen
Priorität nach Relevanz für CH-Simulator:

1. **CH** — Schweizer Studien (BWO, Wüest Partner, ETH, SNF, Meta-Studien)
2. **DE/AT** — Deutschsprachige Forschung (DIW, IW Köln, Bundesbank, WIFO)
3. **GLOBAL** — OECD Housing Outlook, IMF WP, BIS Papers, World Bank
4. **UK** — Starke empirische Tradition (LSE, BoE)
5. **US/CA** — NBER, Fed, HUD

**Suchquellen pro Region:**

| Region | Primärquellen | Suchmaschinen |
|--------|--------------|---------------|
| CH | BWO, SNF P54, Wüest, SECO, ETH/EPFL | Google Scholar (de), RePEc |
| DE | DIW, IW Köln, Bundesbank, ZEW, ifo | Google Scholar (de), SSRN, RePEc |
| AT | WIFO, OeNB, TU Wien | Google Scholar (de), RePEc |
| FR | INSEE, CGEDD, OEFL, Banque de France | Google Scholar (fr), HAL-SHS |
| UK | LSE, BoE, MHCLG, IFS, Resolution Foundation | Google Scholar, SSRN |
| US | NBER, Fed (regional), HUD, Brookings, AEI | Google Scholar, SSRN, NBER WP |
| CA | CMHC, BoC, C.D. Howe | Google Scholar, SSRN |
| NL | PBL, CPB, DNB, Amsterdam UvA | Google Scholar (nl/en), RePEc |
| SE/DK/NO | Riksbank, Norges Bank, DanNB, BOLIG | Google Scholar, SSRN |
| JP/KR/SG | BoJ, KDI, HDB/MAS | Google Scholar |
| AU/NZ | RBA, RBNZ, Grattan Institute | Google Scholar, SSRN |
| GLOBAL | OECD, IMF, BIS, World Bank | Direkte Suche auf Org-Websites |

**Suchbegriffe (Kernthemen, angepasst pro Sprache):**
- Mietpreisbremse / rent control / encadrement des loyers
- Wohnungsangebot / housing supply elasticity
- Zonierung / zoning regulation / densification
- Gentrifizierung / gentrification / displacement
- Gemeinnütziger Wohnbau / social housing / logement social
- Bodenbesteuerung / land value tax
- Hypothekarregulierung / mortgage regulation / LTV ratio
- Leerstandsabgabe / vacancy tax
- Spekulationssteuer / capital gains tax housing
- Mieterschutz / tenant protection
- Angebotsrestriktion / supply constraints
- Wohnkostenbelastung / housing affordability

**Modell:** Grok 4.20 Reasoning (`grok-reasoning`) — mehrsprachig, 2M Kontext, Reasoning
**Modell für CN-Quellen:** MiniMax M2.7 (`minimax`)
**Dauer:** 2–4 Sessions

### Phase 2: Systematische Suche — Erweiterte Regionen
- Restliche Regionen (ES, PT, JP, KR, SG, AU, NZ)
- Historische Studien (1970–2000)
- Nischen-Themen (Kurzzeitvermietung/Airbnb, Zweitwohnungen, Umnutzungsverbote)
- **Dauer:** 1–2 Sessions

### Phase 3: Auswertung & Synthese
- Jede Studie lesen/auswerten → Status auf "evaluated" setzen
- Key Findings extrahieren
- DAG-Relevanz bewerten (welche Kanten bestätigt/widerlegt?)
- Duplikate markieren
- summary.md erstellen mit Synthese
- **Dauer:** 2–3 Sessions

### Phase 4: Code-Integration
- Erkenntnisse in graph.ts übertragen
- Neue Kanten / geänderte Gewichte / geänderte Vorzeichen
- Tests anpassen
- Commit mit Quellenverweisen
- **Dauer:** 1–2 Sessions

## Qualitätskriterien

- **Peer-reviewed** > Working Paper > Government Report > Grau-Literatur
- **Empirisch** > Theoretisch (wir suchen Wirkungsnachweise)
- **Meta-Studien** haben höchste Priorität (bündeln viele Einzelstudien)
- **Quellenangabe** immer mit DOI oder URL
- **Duplikate** werden über `duplicate_of` im Frontmatter markiert

## Tracking

Status-Felder im Frontmatter:
- `found` — Studie identifiziert, noch nicht gelesen
- `reading` — in Bearbeitung
- `evaluated` — ausgewertet, Key Findings extrahiert
- `integrated` — Erkenntnisse in Code übernommen
