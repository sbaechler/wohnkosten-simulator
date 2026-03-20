# DAG Berechnungsmodell

Erstellt: 2026-03-20  
Basis: Wirkungsmodell & Städtedaten (wirkungsmodell-und-staedtedaten.md)

## Architektur

```
Ebene 0: Rohdaten
  context: CityContext          (zinsniveau, zuwanderungsdruck, wirtschaftskraft, bevoelkerungstrend)
  baseline: CityParams          (40 steuerbare Parameter, Ist-Zustand der Stadt)
  modified: CityParams          (nach Nutzeränderung)
  diff: ParamsDiff              (geänderte Parameter mit from/to)

        ↓ computeMarketState()

Ebene 1: Markt-Zustandsvariablen
  MarketState                   (~10 aggregierte Grössen, –1.0 … +1.0 normiert)

        ↓ computeDerivedIndicators()

Ebene 2: Abgeleitete Indikatoren
  DerivedIndicators             (~6 zusammengesetzte Grössen für Spezial-Widgets)

        ↓ direkte Übergabe

Widgets                         (lesen von Ebene 0, 1 oder 2 je nach Bedarf)
```

**Design-Prinzip:** Alle Ebenen sind pure Funktionen ohne Seiteneffekte. Widgets dürfen direkt auf Ebene 0 (context, diff) oder Ebene 1 zugreifen wenn sie spezifischere Daten brauchen — sie müssen nicht alles über Ebene 2 beziehen.

---

## Graphdefinition

Der DAG besteht aus Knoten auf drei Ebenen (E0 → E1 → E2) und gerichteten, vorzeichenbehafteten Kanten. Gewichte werden separat definiert.

### Notation

```
Quelle → Ziel  [+]   // positiver Beitrag: Quelle ↑ → Ziel ↑
Quelle → Ziel  [–]   // negativer Beitrag: Quelle ↑ → Ziel ↓
```

Alle E0-Knoten sind normiert auf –1…+1 bevor sie in E1 einfliessen:
- Steuerbare Parameter (0/1/2): `delta = (modified - baseline) / 2`  → –1, –0.5, 0, +0.5, +1
- Kontextfaktoren (–2…+2): `value / 2` → –1 … +1

---

### E0 → E1: Parameter zu Markt-Zustandsvariablen

#### → `angebotspotenzial`

```
raumplanung_zonenreserve        → angebotspotenzial  [–]   // knapp = weniger Angebot
raumplanung_verdichtung         → angebotspotenzial  [+]
raumplanung_ausnuetzungsziffer  → angebotspotenzial  [+]
boden_bauverpflichtung          → angebotspotenzial  [+]
bau_energievorgaben             → angebotspotenzial  [–]
bau_sanierungspflicht           → angebotspotenzial  [–]
bau_einspracherecht_dritte      → angebotspotenzial  [–]
bau_einspracherecht_suspensiv   → angebotspotenzial  [–]
bau_bewilligungsverfahren       → angebotspotenzial  [+]
bau_normenharmonisierung        → angebotspotenzial  [+]
gemeinnuetzig_mindestanteil     → angebotspotenzial  [–]   // kurzfristig Rendite sinkt
gemeinnuetzig_foerderfonds      → angebotspotenzial  [+]
nutzung_abbruchverbot           → angebotspotenzial  [+]   // Bestand erhalten
nutzung_umnutzungsverbot        → angebotspotenzial  [+]   // Wohnraum bleibt
zinsniveau (ctx)                → angebotspotenzial  [–]
wirtschaftskraft (ctx)          → angebotspotenzial  [+]
```

#### → `nachfragedruck`

```
zuwanderungsdruck (ctx)         → nachfragedruck     [+]
wirtschaftskraft (ctx)          → nachfragedruck     [+]
bevoelkerungstrend (ctx)        → nachfragedruck     [+]
zinsniveau (ctx)                → nachfragedruck     [–]   // Eigenheim teurer → Kaufnachfrage sinkt
infra_oepnv                     → nachfragedruck     [+]
infra_schule_kita               → nachfragedruck     [+]
infra_oeffentlicher_raum        → nachfragedruck     [+]
infra_wirtschaftsansiedlung     → nachfragedruck     [+]
steuer_eigenmietwert            → nachfragedruck     [–]   // Abschaffung (=0) macht Eigenheim attraktiver
kapital_hypothekarregulierung   → nachfragedruck     [–]
kapital_auslaendische_investoren → nachfragedruck    [–]
```

#### → `mietpreis_schutzlevel`

```
mietrecht_kostenmiete           → mietpreis_schutzlevel  [+]
mietrecht_anfangsmiete          → mietpreis_schutzlevel  [+]
mietrecht_mietzinstransparenz   → mietpreis_schutzlevel  [+]
mietrecht_mietzinsindex         → mietpreis_schutzlevel  [+]
```

#### → `verdrängungsrisiko`

```
mietrecht_kuendigungsschutz     → verdrängungsrisiko  [–]
nutzung_abbruchverbot           → verdrängungsrisiko  [–]
nutzung_umnutzungsverbot        → verdrängungsrisiko  [–]
bau_sanierungspflicht           → verdrängungsrisiko  [+]   // Sanierungskündigungen
mietrecht_untervermietung       → verdrängungsrisiko  [–]   // kein Airbnb-Missbrauch
zuwanderungsdruck (ctx)         → verdrängungsrisiko  [+]
wirtschaftskraft (ctx)          → verdrängungsrisiko  [+]
```

#### → `spekulationshemmung`

```
steuer_grundstückgewinn         → spekulationshemmung  [+]
steuer_handaenderung            → spekulationshemmung  [+]
steuer_kapitalgewinnprivatpersonen → spekulationshemmung [+]
boden_mehrwertabgabe            → spekulationshemmung  [+]
boden_bodeneigentumssteuer      → spekulationshemmung  [+]
boden_bauverpflichtung          → spekulationshemmung  [+]
nutzung_zweitwohnungen          → spekulationshemmung  [+]
nutzung_kurzzeitvermietung      → spekulationshemmung  [+]
```

#### → `markfriktion`

```
steuer_grundstückgewinn         → markfriktion  [+]
steuer_handaenderung            → markfriktion  [+]
steuer_kapitalgewinnprivatpersonen → markfriktion [+]
zinsniveau (ctx)                → markfriktion  [+]   // Rate-lock-Effekt
```

#### → `gemeinnuetzig_kraft`

```
gemeinnuetzig_mindestanteil     → gemeinnuetzig_kraft  [+]
gemeinnuetzig_foerderfonds      → gemeinnuetzig_kraft  [+]
gemeinnuetzig_baurecht          → gemeinnuetzig_kraft  [+]
boden_vorkaufsrecht             → gemeinnuetzig_kraft  [+]
gemeinnuetzig_belegungsvorschriften → gemeinnuetzig_kraft [+]
gemeinnuetzig_sozialmischung    → gemeinnuetzig_kraft  [+]
```

#### → `eigentumsquoten_trend`

```
steuer_eigenmietwert            → eigentumsquoten_trend  [–]   // Abschaffung (=0) = mehr Eigentum
kapital_hypothekarregulierung   → eigentumsquoten_trend  [–]
zinsniveau (ctx)                → eigentumsquoten_trend  [–]
mietrecht_kostenmiete           → eigentumsquoten_trend  [–]   // günstige Miete → Kauf unattraktiver
zuwanderungsdruck (ctx)         → eigentumsquoten_trend  [–]   // Zugezogene mieten zunächst
wirtschaftskraft (ctx)          → eigentumsquoten_trend  [+]
```

#### → `aufwertungsdruck`

```
infra_oepnv                     → aufwertungsdruck  [+]
infra_wirtschaftsansiedlung     → aufwertungsdruck  [+]
wirtschaftskraft (ctx)          → aufwertungsdruck  [+]
raumplanung_verdichtung         → aufwertungsdruck  [+]   // Verdichtung ohne Schutz
raumplanung_ausnuetzungsziffer  → aufwertungsdruck  [+]   // Bodenpreiseffekt
boden_bodeneigentumssteuer      → aufwertungsdruck  [–]   // dämpft Bodenpreisspekulation
gemeinnuetzig_mindestanteil     → aufwertungsdruck  [–]   // günstige Wohnungen bleiben
```

#### → `investitionsattraktivitaet`

```
mietrecht_kostenmiete           → investitionsattraktivitaet  [–]
kapital_institutionelle_regulierung → investitionsattraktivitaet [–]
steuer_grundstückgewinn         → investitionsattraktivitaet  [–]
boden_mehrwertabgabe            → investitionsattraktivitaet  [–]
kapital_auslaendische_investoren → investitionsattraktivitaet [–]
steuer_handaenderung            → investitionsattraktivitaet  [–]
wirtschaftskraft (ctx)          → investitionsattraktivitaet  [+]
zinsniveau (ctx)                → investitionsattraktivitaet  [–]
```

---

### E1 → E2: Markt-Zustandsvariablen zu abgeleiteten Indikatoren

```
// gentrifizierungsindex
aufwertungsdruck                → gentrifizierungsindex  [+]
mietpreis_schutzlevel           → gentrifizierungsindex  [–]
verdrängungsrisiko              → gentrifizierungsindex  [+]
gemeinnuetzig_kraft             → gentrifizierungsindex  [–]

// neubau_hemmnisindex
angebotspotenzial               → neubau_hemmnisindex    [–]   // invertiert: wenig Potenzial = hohes Hemmnis

// verdrängungsrisiko_index
verdrängungsrisiko              → verdrängungsrisiko_index [+]  // direkter Alias

// fiskalische_wirkung
spekulationshemmung             → fiskalische_wirkung    [+]
markfriktion                    → fiskalische_wirkung    [–]   // Friktion reduziert Transaktionsvolumen
gemeinnuetzig_kraft             → fiskalische_wirkung    [+]   // mehr Projekte durch Fonds-Hebel

// zeit_bis_wirkung: Sonderfall — kein E1-Input, direkt aus E0 (diff + Zeitklassen-Tabelle)
diff (E0)                       → zeit_bis_wirkung       [strukturell]
```

---

### Vollständige Kantenliste (maschinenlesbar)

Jede Kante hat:
- `sign`: +1 gleichgerichtet, –1 gegenläufig
- `weight`: 0.5 = schwach, 1.0 = mittel, 1.5 = stark (aus Wirkungsmodell; normiert vor Aggregation)
- `time`: dominante Zeitklasse des Effekts (`short` < 1 Jahr, `medium` 1–7 Jahre, `long` > 7 Jahre)

```typescript
// model/graph.ts

export type TimeClass = 'short' | 'medium' | 'long';
export type NodeId =
  // E0 — steuerbare Parameter
  | 'raumplanung_zonenreserve' | 'raumplanung_verdichtung' | 'raumplanung_ausnuetzungsziffer'
  | 'boden_vorkaufsrecht' | 'boden_bauverpflichtung' | 'boden_mehrwertabgabe' | 'boden_bodeneigentumssteuer'
  | 'bau_energievorgaben' | 'bau_sanierungspflicht'
  | 'bau_einspracherecht_dritte' | 'bau_einspracherecht_suspensiv'
  | 'bau_bewilligungsverfahren' | 'bau_normenharmonisierung'
  | 'gemeinnuetzig_mindestanteil' | 'gemeinnuetzig_foerderfonds' | 'gemeinnuetzig_baurecht'
  | 'gemeinnuetzig_belegungsvorschriften' | 'gemeinnuetzig_sozialmischung'
  | 'mietrecht_kostenmiete' | 'mietrecht_anfangsmiete' | 'mietrecht_mietzinstransparenz'
  | 'mietrecht_kuendigungsschutz' | 'mietrecht_mietzinsindex' | 'mietrecht_untervermietung'
  | 'steuer_grundstückgewinn' | 'steuer_eigenmietwert' | 'steuer_leerstandsabgabe'
  | 'steuer_handaenderung' | 'steuer_kapitalgewinnprivatpersonen'
  | 'kapital_auslaendische_investoren' | 'kapital_institutionelle_regulierung' | 'kapital_hypothekarregulierung'
  | 'nutzung_kurzzeitvermietung' | 'nutzung_umnutzungsverbot' | 'nutzung_abbruchverbot' | 'nutzung_zweitwohnungen'
  | 'infra_oepnv' | 'infra_schule_kita' | 'infra_oeffentlicher_raum' | 'infra_wirtschaftsansiedlung'
  // E0 — Kontextfaktoren
  | 'ctx:zinsniveau' | 'ctx:zuwanderungsdruck' | 'ctx:wirtschaftskraft' | 'ctx:bevoelkerungstrend'
  // E1 — Markt-Zustandsvariablen
  | 'angebotspotenzial' | 'nachfragedruck' | 'mietpreis_schutzlevel' | 'verdrängungsrisiko'
  | 'spekulationshemmung' | 'markfriktion' | 'gemeinnuetzig_kraft'
  | 'eigentumsquoten_trend' | 'aufwertungsdruck' | 'investitionsattraktivitaet'
  // E2 — Abgeleitete Indikatoren
  | 'gentrifizierungsindex' | 'neubau_hemmnisindex' | 'verdrängungsrisiko_index'
  | 'fiskalische_wirkung' | 'zeit_bis_wirkung';

export interface Edge {
  from: NodeId;
  to:   NodeId;
  sign:   +1 | -1;
  weight: 0.5 | 1.0 | 1.5;  // schwach | mittel | stark
  time:   TimeClass;
}

export const DAG_EDGES: Edge[] = [

  // ─── E0 → angebotspotenzial ───────────────────────────────────────────────
  { from: 'raumplanung_zonenreserve',            to: 'angebotspotenzial',          sign: -1, weight: 1.5, time: 'long'   },
  { from: 'raumplanung_verdichtung',             to: 'angebotspotenzial',          sign: +1, weight: 1.0, time: 'medium' },
  { from: 'raumplanung_ausnuetzungsziffer',      to: 'angebotspotenzial',          sign: +1, weight: 1.5, time: 'medium' },
  { from: 'boden_bauverpflichtung',              to: 'angebotspotenzial',          sign: +1, weight: 1.0, time: 'medium' },
  { from: 'bau_energievorgaben',                 to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'short'  },
  { from: 'bau_sanierungspflicht',               to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'short'  },
  { from: 'bau_einspracherecht_dritte',          to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'short'  },
  { from: 'bau_einspracherecht_suspensiv',       to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'short'  },
  { from: 'bau_bewilligungsverfahren',           to: 'angebotspotenzial',          sign: +1, weight: 1.0, time: 'medium' },
  { from: 'bau_normenharmonisierung',            to: 'angebotspotenzial',          sign: +1, weight: 0.5, time: 'long'   },
  { from: 'gemeinnuetzig_mindestanteil',         to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'short'  },
  { from: 'gemeinnuetzig_foerderfonds',          to: 'angebotspotenzial',          sign: +1, weight: 1.0, time: 'medium' },
  { from: 'nutzung_abbruchverbot',               to: 'angebotspotenzial',          sign: +1, weight: 1.0, time: 'short'  },
  { from: 'nutzung_umnutzungsverbot',            to: 'angebotspotenzial',          sign: +1, weight: 0.5, time: 'short'  },
  { from: 'ctx:zinsniveau',                      to: 'angebotspotenzial',          sign: -1, weight: 1.5, time: 'medium' },
  { from: 'ctx:wirtschaftskraft',                to: 'angebotspotenzial',          sign: +1, weight: 1.0, time: 'long'   },

  // ─── E0 → nachfragedruck ──────────────────────────────────────────────────
  { from: 'ctx:zuwanderungsdruck',               to: 'nachfragedruck',             sign: +1, weight: 1.5, time: 'short'  },
  { from: 'ctx:wirtschaftskraft',                to: 'nachfragedruck',             sign: +1, weight: 1.5, time: 'long'   },
  { from: 'ctx:bevoelkerungstrend',              to: 'nachfragedruck',             sign: +1, weight: 0.5, time: 'long'   },
  { from: 'ctx:zinsniveau',                      to: 'nachfragedruck',             sign: -1, weight: 1.5, time: 'short'  },
  { from: 'infra_oepnv',                         to: 'nachfragedruck',             sign: +1, weight: 1.5, time: 'long'   },
  { from: 'infra_schule_kita',                   to: 'nachfragedruck',             sign: +1, weight: 1.0, time: 'medium' },
  { from: 'infra_oeffentlicher_raum',            to: 'nachfragedruck',             sign: +1, weight: 0.5, time: 'medium' },
  { from: 'infra_wirtschaftsansiedlung',         to: 'nachfragedruck',             sign: +1, weight: 1.5, time: 'long'   },
  { from: 'steuer_eigenmietwert',                to: 'nachfragedruck',             sign: -1, weight: 1.0, time: 'medium' },
  { from: 'kapital_hypothekarregulierung',       to: 'nachfragedruck',             sign: -1, weight: 1.0, time: 'short'  },
  { from: 'kapital_auslaendische_investoren',    to: 'nachfragedruck',             sign: -1, weight: 0.5, time: 'medium' },

  // ─── E0 → mietpreis_schutzlevel ──────────────────────────────────────────
  { from: 'mietrecht_kostenmiete',               to: 'mietpreis_schutzlevel',      sign: +1, weight: 1.5, time: 'short'  },
  { from: 'mietrecht_anfangsmiete',              to: 'mietpreis_schutzlevel',      sign: +1, weight: 0.5, time: 'short'  },
  { from: 'mietrecht_mietzinstransparenz',       to: 'mietpreis_schutzlevel',      sign: +1, weight: 0.5, time: 'short'  },
  { from: 'mietrecht_mietzinsindex',             to: 'mietpreis_schutzlevel',      sign: +1, weight: 1.0, time: 'short'  },

  // ─── E0 → verdrängungsrisiko ──────────────────────────────────────────────
  { from: 'mietrecht_kuendigungsschutz',         to: 'verdrängungsrisiko',         sign: -1, weight: 1.5, time: 'short'  },
  { from: 'nutzung_abbruchverbot',               to: 'verdrängungsrisiko',         sign: -1, weight: 1.0, time: 'short'  },
  { from: 'nutzung_umnutzungsverbot',            to: 'verdrängungsrisiko',         sign: -1, weight: 0.5, time: 'short'  },
  { from: 'bau_sanierungspflicht',               to: 'verdrängungsrisiko',         sign: +1, weight: 1.0, time: 'short'  },
  { from: 'mietrecht_untervermietung',           to: 'verdrängungsrisiko',         sign: -1, weight: 0.5, time: 'short'  },
  { from: 'ctx:zuwanderungsdruck',               to: 'verdrängungsrisiko',         sign: +1, weight: 1.0, time: 'short'  },
  { from: 'ctx:wirtschaftskraft',                to: 'verdrängungsrisiko',         sign: +1, weight: 0.5, time: 'long'   },

  // ─── E0 → spekulationshemmung ─────────────────────────────────────────────
  { from: 'steuer_grundstückgewinn',             to: 'spekulationshemmung',        sign: +1, weight: 1.5, time: 'medium' },
  { from: 'steuer_handaenderung',                to: 'spekulationshemmung',        sign: +1, weight: 0.5, time: 'short'  },
  { from: 'steuer_kapitalgewinnprivatpersonen',  to: 'spekulationshemmung',        sign: +1, weight: 1.0, time: 'short'  },
  { from: 'boden_mehrwertabgabe',                to: 'spekulationshemmung',        sign: +1, weight: 1.0, time: 'long'   },
  { from: 'boden_bodeneigentumssteuer',          to: 'spekulationshemmung',        sign: +1, weight: 1.5, time: 'medium' },
  { from: 'boden_bauverpflichtung',              to: 'spekulationshemmung',        sign: +1, weight: 1.0, time: 'medium' },
  { from: 'nutzung_zweitwohnungen',              to: 'spekulationshemmung',        sign: +1, weight: 0.5, time: 'long'   },
  { from: 'nutzung_kurzzeitvermietung',          to: 'spekulationshemmung',        sign: +1, weight: 0.5, time: 'short'  },

  // ─── E0 → markfriktion ────────────────────────────────────────────────────
  { from: 'steuer_grundstückgewinn',             to: 'markfriktion',               sign: +1, weight: 1.5, time: 'medium' },
  { from: 'steuer_handaenderung',                to: 'markfriktion',               sign: +1, weight: 1.0, time: 'short'  },
  { from: 'steuer_kapitalgewinnprivatpersonen',  to: 'markfriktion',               sign: +1, weight: 1.0, time: 'short'  },
  { from: 'ctx:zinsniveau',                      to: 'markfriktion',               sign: +1, weight: 1.0, time: 'short'  },

  // ─── E0 → gemeinnuetzig_kraft ─────────────────────────────────────────────
  { from: 'gemeinnuetzig_mindestanteil',         to: 'gemeinnuetzig_kraft',        sign: +1, weight: 1.5, time: 'long'   },
  { from: 'gemeinnuetzig_foerderfonds',          to: 'gemeinnuetzig_kraft',        sign: +1, weight: 1.5, time: 'long'   },
  { from: 'gemeinnuetzig_baurecht',              to: 'gemeinnuetzig_kraft',        sign: +1, weight: 1.5, time: 'long'   },
  { from: 'boden_vorkaufsrecht',                 to: 'gemeinnuetzig_kraft',        sign: +1, weight: 1.0, time: 'long'   },
  { from: 'gemeinnuetzig_belegungsvorschriften', to: 'gemeinnuetzig_kraft',        sign: +1, weight: 0.5, time: 'medium' },
  { from: 'gemeinnuetzig_sozialmischung',        to: 'gemeinnuetzig_kraft',        sign: +1, weight: 1.0, time: 'long'   },

  // ─── E0 → eigentumsquoten_trend ──────────────────────────────────────────
  { from: 'steuer_eigenmietwert',                to: 'eigentumsquoten_trend',      sign: -1, weight: 1.5, time: 'medium' },
  { from: 'kapital_hypothekarregulierung',       to: 'eigentumsquoten_trend',      sign: -1, weight: 1.0, time: 'short'  },
  { from: 'ctx:zinsniveau',                      to: 'eigentumsquoten_trend',      sign: -1, weight: 1.5, time: 'short'  },
  { from: 'mietrecht_kostenmiete',               to: 'eigentumsquoten_trend',      sign: -1, weight: 0.5, time: 'long'   },
  { from: 'ctx:zuwanderungsdruck',               to: 'eigentumsquoten_trend',      sign: -1, weight: 1.0, time: 'short'  },
  { from: 'ctx:wirtschaftskraft',                to: 'eigentumsquoten_trend',      sign: +1, weight: 1.0, time: 'long'   },

  // ─── E0 → aufwertungsdruck ────────────────────────────────────────────────
  { from: 'infra_oepnv',                         to: 'aufwertungsdruck',           sign: +1, weight: 1.5, time: 'long'   },
  { from: 'infra_wirtschaftsansiedlung',         to: 'aufwertungsdruck',           sign: +1, weight: 1.5, time: 'long'   },
  { from: 'ctx:wirtschaftskraft',                to: 'aufwertungsdruck',           sign: +1, weight: 1.5, time: 'long'   },
  { from: 'raumplanung_verdichtung',             to: 'aufwertungsdruck',           sign: +1, weight: 1.0, time: 'medium' },
  { from: 'raumplanung_ausnuetzungsziffer',      to: 'aufwertungsdruck',           sign: +1, weight: 1.0, time: 'medium' },
  { from: 'boden_bodeneigentumssteuer',          to: 'aufwertungsdruck',           sign: -1, weight: 1.0, time: 'medium' },
  { from: 'gemeinnuetzig_mindestanteil',         to: 'aufwertungsdruck',           sign: -1, weight: 0.5, time: 'long'   },

  // ─── E0 → investitionsattraktivitaet ─────────────────────────────────────
  { from: 'mietrecht_kostenmiete',               to: 'investitionsattraktivitaet', sign: -1, weight: 1.5, time: 'short'  },
  { from: 'kapital_institutionelle_regulierung', to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'medium' },
  { from: 'steuer_grundstückgewinn',             to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'medium' },
  { from: 'boden_mehrwertabgabe',                to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'long'   },
  { from: 'kapital_auslaendische_investoren',    to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'medium' },
  { from: 'steuer_handaenderung',                to: 'investitionsattraktivitaet', sign: -1, weight: 0.5, time: 'short'  },
  { from: 'ctx:wirtschaftskraft',                to: 'investitionsattraktivitaet', sign: +1, weight: 1.5, time: 'long'   },
  { from: 'ctx:zinsniveau',                      to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'short'  },

  // ─── E1 → E2 ─────────────────────────────────────────────────────────────
  { from: 'aufwertungsdruck',                    to: 'gentrifizierungsindex',      sign: +1, weight: 1.5, time: 'long'   },
  { from: 'mietpreis_schutzlevel',               to: 'gentrifizierungsindex',      sign: -1, weight: 1.5, time: 'short'  },
  { from: 'verdrängungsrisiko',                  to: 'gentrifizierungsindex',      sign: +1, weight: 1.5, time: 'short'  },
  { from: 'gemeinnuetzig_kraft',                 to: 'gentrifizierungsindex',      sign: -1, weight: 1.0, time: 'long'   },

  { from: 'angebotspotenzial',                   to: 'neubau_hemmnisindex',        sign: -1, weight: 1.5, time: 'medium' },

  { from: 'verdrängungsrisiko',                  to: 'verdrängungsrisiko_index',   sign: +1, weight: 1.5, time: 'short'  },

  { from: 'spekulationshemmung',                 to: 'fiskalische_wirkung',        sign: +1, weight: 1.5, time: 'medium' },
  { from: 'markfriktion',                        to: 'fiskalische_wirkung',        sign: -1, weight: 1.0, time: 'medium' },
  { from: 'gemeinnuetzig_kraft',                 to: 'fiskalische_wirkung',        sign: +1, weight: 1.0, time: 'long'   },

  // zeit_bis_wirkung: kein gewichteter Edge — berechnet sich strukturell aus diff + TIME_CLASS_MAP
] as const;
```

### Zeitklassen-Tabelle (`TIME_CLASS_MAP`)

Für `zeit_bis_wirkung` direkt aus `diff` (E0), ohne Aggregation über Kanten:

```typescript
// model/params.ts
export const TIME_CLASS_MAP: Record<string, TimeClass> = {
  // short — Wirkung innerhalb von Monaten bis ~1 Jahr
  ctx_zinsniveau:                    'short',
  ctx_zuwanderungsdruck:             'short',
  mietrecht_kostenmiete:             'short',
  mietrecht_anfangsmiete:            'short',
  mietrecht_mietzinstransparenz:     'short',
  mietrecht_mietzinsindex:           'short',
  mietrecht_kuendigungsschutz:       'short',
  mietrecht_untervermietung:         'short',
  bau_einspracherecht_dritte:        'short',
  bau_einspracherecht_suspensiv:     'short',
  bau_energievorgaben:               'short',   // Kostenwirkung sofort; Baueffekt medium
  bau_sanierungspflicht:             'short',
  kapital_hypothekarregulierung:     'short',
  nutzung_abbruchverbot:             'short',
  nutzung_umnutzungsverbot:          'short',
  nutzung_kurzzeitvermietung:        'short',
  steuer_handaenderung:              'short',
  steuer_kapitalgewinnprivatpersonen:'short',

  // medium — 1–7 Jahre
  ctx_wirtschaftskraft:              'medium',  // strukturell aber messbar
  raumplanung_verdichtung:           'medium',
  raumplanung_ausnuetzungsziffer:    'medium',
  boden_bauverpflichtung:            'medium',
  boden_bodeneigentumssteuer:        'medium',
  bau_bewilligungsverfahren:         'medium',
  gemeinnuetzig_belegungsvorschriften: 'medium',
  steuer_grundstückgewinn:           'medium',
  steuer_eigenmietwert:              'medium',
  steuer_leerstandsabgabe:           'medium',
  kapital_auslaendische_investoren:  'medium',
  kapital_institutionelle_regulierung: 'medium',

  // long — > 7 Jahre
  ctx_bevoelkerungstrend:            'long',
  raumplanung_zonenreserve:          'long',
  boden_vorkaufsrecht:               'long',
  boden_mehrwertabgabe:              'long',
  bau_normenharmonisierung:          'long',
  gemeinnuetzig_mindestanteil:       'long',
  gemeinnuetzig_foerderfonds:        'long',
  gemeinnuetzig_baurecht:            'long',
  gemeinnuetzig_sozialmischung:      'long',
  nutzung_zweitwohnungen:            'long',
  infra_oepnv:                       'long',
  infra_schule_kita:                 'long',   // Infrastruktur: Wirkung auf Attraktivität erst langfristig
  infra_oeffentlicher_raum:          'long',
  infra_wirtschaftsansiedlung:       'long',
};
```

---

## Ebene 1: Markt-Zustandsvariablen (`MarketState`)

Jede Variable ist normiert auf **–1.0 … +1.0**:
- **–1.0** = maximaler angebotssteigernder / preissenkender / schützender Effekt
- **0** = kein Effekt gegenüber Baseline
- **+1.0** = maximaler angebotsreduzierender / preistreibender / verdrängender Effekt

(Vorzeichen sind so gewählt, dass positive Werte immer "mehr Marktdruck/höhere Preise" bedeuten.)

---

### `angebotspotenzial`

**Bedeutung:** Wie stark fördert oder hemmt das Szenario die Entstehung neuen Wohnraums?  
**Vorzeichen:** negativ = mehr Angebot; positiv = weniger Angebot (Hemmnis)

**Inputs und Richtungen:**

| Parameter | Wirkung auf Angebot | Gewicht |
|-----------|---------------------|---------|
| `raumplanung_zonenreserve` ↑ (knapp) | ↓ Angebot | stark |
| `raumplanung_verdichtung` ↑ | ↑ Angebot | mittel |
| `raumplanung_ausnuetzungsziffer` ↑ | ↑ Angebot | stark |
| `boden_bauverpflichtung` ↑ | ↑ Angebot (mobilisiert Bauland) | mittel |
| `bau_energievorgaben` ↑ | ↓ Angebot (höhere Baukosten) | mittel |
| `bau_sanierungspflicht` ↑ | ↓ Angebot (Kapital gebunden) | mittel |
| `bau_einspracherecht_dritte` ↑ | ↓ Angebot (Verzögerungen) | mittel |
| `bau_einspracherecht_suspensiv` ↑ | ↓ Angebot (Baustopp) | mittel |
| `bau_bewilligungsverfahren` ↑ | ↑ Angebot (schnellere Verfahren) | mittel |
| `bau_normenharmonisierung` ↑ | ↑ Angebot (niedrigere Planungskosten) | schwach |
| `gemeinnuetzig_mindestanteil` ↑ | ↓ Angebot kurzfristig (Rendite sinkt) | mittel |
| `gemeinnuetzig_foerderfonds` ↑ | ↑ Angebot (Förderung ermöglicht sonst unrentable Projekte) | mittel |
| `kapital_hypothekarregulierung` ↑ | ~ Angebot | schwach |
| `nutzung_abbruchverbot` ↑ | ↑ Angebot (Bestand erhalten) | mittel |
| `nutzung_umnutzungsverbot` ↑ | ↑ Angebot (Wohnraum bleibt) | schwach |
| `zinsniveau` (Kontext) ↑ | ↓ Angebot (Neubau unrentabel) | stark |
| `wirtschaftskraft` (Kontext) ↑ | ↑ Angebot (Investoren bauen mehr) | mittel |

**Zeitliche Dimension:** Mehrheitlich mittelfristig bis langfristig. Für das Widget "Zeit bis Marktwirkung" werden Zeitklassen der einzelnen Inputs herangezogen (Ebene 0).

---

### `nachfragedruck`

**Bedeutung:** Wie stark übertrifft die Nachfrage nach Wohnraum das Angebot?  
**Vorzeichen:** positiv = mehr Nachfragedruck

| Parameter | Wirkung auf Nachfrage | Gewicht |
|-----------|----------------------|---------|
| `zuwanderungsdruck` (Kontext) ↑ | ↑↑ Nachfrage | sehr stark |
| `wirtschaftskraft` (Kontext) ↑ | ↑ Nachfrage (höhere Einkommen) | stark |
| `bevoelkerungstrend` (Kontext) ↑ | ↑ Nachfrage (langsam) | schwach |
| `zinsniveau` (Kontext) ↑ | ↓ Nachfrage (Eigenheim teurer) | stark |
| `infra_oepnv` ↑ | ↑ Nachfrage (Lageattraktivität) | mittel |
| `infra_schule_kita` ↑ | ↑ Nachfrage (Familienattraktivität) | mittel |
| `infra_oeffentlicher_raum` ↑ | ↑ Nachfrage (Wohnqualität) | schwach |
| `infra_wirtschaftsansiedlung` ↑ | ↑↑ Nachfrage (Arbeitsplätze → Zuzug) | stark |
| `steuer_eigenmietwert` ↓ (abgeschafft) | ↑ Nachfrage Eigenheim | mittel |
| `kapital_hypothekarregulierung` ↑ | ↓ Nachfrage (weniger Käufer) | mittel |
| `kapital_auslaendische_investoren` ↑ (restriktiv) | ↓ Nachfrage | schwach |

---

### `mietpreis_schutzlevel`

**Bedeutung:** Wie stark ist der bestehende Mietmarkt vor Preiserhöhungen geschützt?  
**Vorzeichen:** positiv = mehr Schutz (niedrigere Mietpreise für Bestandsmieter)

| Parameter | Wirkung | Gewicht |
|-----------|---------|---------|
| `mietrecht_kostenmiete` ↑ | ↑ Schutz (Renditedeckel) | stark |
| `mietrecht_anfangsmiete` ↑ | ↑ Schutz (weniger Überhöhung beim Wechsel) | mittel |
| `mietrecht_mietzinstransparenz` ↑ | ↑ Schutz (Anfechtung ermöglicht) | schwach |
| `mietrecht_mietzinsindex` ↑ | ↑ Schutz (LIK/Kostenbindung statt Referenzzinssatz) | mittel |

**Achtung:** Hoher Schutzlevel kann langfristig Angebot reduzieren (Stanford-Studie, Diamond 2019) → dieser Effekt fliesst in `angebotspotenzial` ein, nicht hier.

---

### `verdrängungsrisiko`

**Bedeutung:** Wie stark sind bestehende Mieter gefährdet, ihre Wohnung zu verlieren (Kündigung, Sanierung, Umnutzung)?  
**Vorzeichen:** positiv = höheres Verdrängungsrisiko

| Parameter | Wirkung | Gewicht |
|-----------|---------|---------|
| `mietrecht_kuendigungsschutz` ↑ | ↓ Risiko | stark |
| `nutzung_abbruchverbot` ↑ | ↓ Risiko | mittel |
| `nutzung_umnutzungsverbot` ↑ | ↓ Risiko (keine Konversion) | mittel |
| `bau_sanierungspflicht` ↑ | ↑ Risiko (Sanierungskündigungen) | mittel |
| `mietrecht_untervermietung` ↑ (restriktiv) | ↓ Risiko (kein Airbnb-Missbrauch) | schwach |
| `zuwanderungsdruck` (Kontext) ↑ | ↑ Risiko (Marktdruck erhöht Verdrängungsanreiz) | mittel |
| `wirtschaftskraft` (Kontext) ↑ | ↑ Risiko (Aufwertungsdruck) | schwach |

---

### `spekulationshemmung`

**Bedeutung:** Wie stark werden kurzfristige Spekulation und renditeorientiertes Horten von Bauland/Wohnraum erschwert?  
**Vorzeichen:** positiv = stärkere Hemmung

| Parameter | Wirkung | Gewicht |
|-----------|---------|---------|
| `steuer_grundstückgewinn` ↑ | ↑ Hemmung (spekulationshemmend) | stark |
| `steuer_handaenderung` ↑ | ↑ Hemmung (Transaktionskosten) | mittel |
| `steuer_kapitalgewinnprivatpersonen` ↑ | ↑ Hemmung | mittel |
| `boden_mehrwertabgabe` ↑ | ↑ Hemmung (Planungsgewinn abgeschöpft) | mittel |
| `boden_bodeneigentumssteuer` ↑ | ↑ Hemmung stark (Horten unrentabel) | stark |
| `boden_bauverpflichtung` ↑ | ↑ Hemmung (Baulandhortung verteuert) | mittel |
| `nutzung_zweitwohnungen` ↑ (restriktiv) | ↑ Hemmung in Tourismusgemeinden | schwach |
| `nutzung_kurzzeitvermietung` ↑ (restriktiv) | ↑ Hemmung (kein Airbnb-Geschäftsmodell) | schwach |

**Achtung Nebeneffekt:** Hohe Spekulationshemmung erhöht auch `markfriktion` (Lock-in). Dieser Effekt ist real und wird in `markfriktion` separat modelliert.

---

### `markfriktion`

**Bedeutung:** Wie stark ist der Immobilienmarkt "eingefroren"? Hohe Friktion = weniger Transaktionen, mehr Fehlanpassungen (zu grosse Wohnungen von Alleinstehenden gehalten etc.).  
**Vorzeichen:** positiv = mehr Friktion

| Parameter | Wirkung | Gewicht |
|-----------|---------|---------|
| `steuer_grundstückgewinn` ↑ | ↑ Lock-in (SNB WP 2013-02) | stark |
| `steuer_handaenderung` ↑ | ↑ Transaktionskosten | mittel |
| `steuer_kapitalgewinnprivatpersonen` ↑ | ↑ Lock-in | mittel |
| `zinsniveau` (Kontext) ↑ | ↑ Friktion (Rate-lock-Effekt) | mittel |

**Hinweis:** `spekulationshemmung` und `markfriktion` teilen Input-Parameter (das ist korrekt — dieselbe Steuer hemmt sowohl Spekulation als auch legitime Umzüge).

---

### `gemeinnuetzig_kraft`

**Bedeutung:** Wie stark wächst oder schrumpft der nicht-marktorientierte Wohnsektor (Genossenschaften, öffentliche Hand)?  
**Vorzeichen:** positiv = wächst

| Parameter | Wirkung | Gewicht |
|-----------|---------|---------|
| `gemeinnuetzig_mindestanteil` ↑ | ↑ direkt | stark |
| `gemeinnuetzig_foerderfonds` ↑ | ↑ (Kapital für Genossenschaften) | stark |
| `gemeinnuetzig_baurecht` ↑ | ↑ (Landkosten entfallen) | stark |
| `boden_vorkaufsrecht` ↑ | ↑ (Gemeinde kauft, vergibt an Genossenschaften) | mittel |
| `gemeinnuetzig_belegungsvorschriften` ↑ | ↑ leicht (effizientere Nutzung, weniger Unterbelegung) | schwach |
| `gemeinnuetzig_sozialmischung` ↑ | ↑ (bei Aufzonungen entsteht mehr gemeinnütziger Anteil) | mittel |

---

### `eigentumsquoten_trend`

**Bedeutung:** Tendiert das Szenario zu mehr oder weniger Wohneigentum (Basis CH: ~36%)?  
**Vorzeichen:** positiv = mehr Eigentumsbildung

| Parameter | Wirkung | Gewicht |
|-----------|---------|---------|
| `steuer_eigenmietwert` ↓ (abgeschafft=0) | ↑ Eigentumsquote (Wüest Partner: 71% der Gemeinden) | stark |
| `kapital_hypothekarregulierung` ↑ | ↓ Eigentumsquote (weniger Käufer) | mittel |
| `zinsniveau` (Kontext) ↑ | ↓ Eigentumsquote (teurere Hypotheken) | stark |
| `mietrecht_kostenmiete` ↑ | ↓ Eigentumsquote (Mieten günstig relativ → Kauf unattraktiver) | schwach |
| `zuwanderungsdruck` (Kontext) ↑ | ↓ Eigentumsquote (Zugezogene mieten zunächst) | mittel |
| `wirtschaftskraft` (Kontext) ↑ | ↑ Eigentumsquote (höhere Tragbarkeit) | mittel |

---

### `aufwertungsdruck`

**Bedeutung:** Wie stark tendiert das Szenario zur Aufwertung von Quartieren (steigender Bodenpreis in bestehenden Lagen)?  
**Vorzeichen:** positiv = mehr Aufwertung

| Parameter | Wirkung | Gewicht |
|-----------|---------|---------|
| `infra_oepnv` ↑ | ↑ Aufwertung (Billings 2011: +4% Grundstückspreis nahe neuer Stationen) | stark |
| `infra_wirtschaftsansiedlung` ↑ | ↑ Aufwertung (Moretti-Multiplikator) | stark |
| `wirtschaftskraft` (Kontext) ↑ | ↑ Aufwertung | stark |
| `raumplanung_verdichtung` ↑ | ↑ Aufwertung (Verdichtung ohne Schutz = Verdrängung) | mittel |
| `raumplanung_ausnuetzungsziffer` ↑ | ↑ Aufwertung (Bodenpreiseffekt) | mittel |
| `boden_bodeneigentumssteuer` ↑ | ↓ Aufwertung (dämpft Bodenpreisspekulation) | mittel |
| `gemeinnuetzig_mindestanteil` ↑ | ↓ Aufwertung leicht (günstige Wohnungen bleiben) | schwach |

---

### `investitionsattraktivitaet`

**Bedeutung:** Wie attraktiv ist der Markt für private und institutionelle Kapitalanleger?  
**Vorzeichen:** positiv = attraktiver

| Parameter | Wirkung | Gewicht |
|-----------|---------|---------|
| `mietrecht_kostenmiete` ↑ | ↓ Attraktivität (Rendite gedeckelt) | stark |
| `kapital_institutionelle_regulierung` ↑ | ↓ Attraktivität | mittel |
| `steuer_grundstückgewinn` ↑ | ↓ Attraktivität (Exit verteuert) | mittel |
| `boden_mehrwertabgabe` ↑ | ↓ Attraktivität (Umzonungsgewinne abgeschöpft) | mittel |
| `kapital_auslaendische_investoren` ↑ (restriktiv) | ↓ Attraktivität für Ausländer | mittel |
| `steuer_handaenderung` ↑ | ↓ Attraktivität (Exit verteuert) | schwach |
| `wirtschaftskraft` (Kontext) ↑ | ↑ Attraktivität | stark |
| `zinsniveau` (Kontext) ↑ | ↓ Attraktivität (Alternativanlagen konkurrenzfähiger) | mittel |

---

## Ebene 2: Abgeleitete Indikatoren (`DerivedIndicators`)

Zusammengesetzte Grössen für die Spezial-Widgets. Berechnet aus Ebene-1-Variablen (und wo nötig direkt aus Ebene 0).

---

### `gentrifizierungsindex`

**Formel:**
```
gentrifizierungsindex =
  w1 * aufwertungsdruck
+ w2 * (1 - mietpreis_schutzlevel)
+ w3 * verdrängungsrisiko
+ w4 * (1 - gemeinnuetzig_kraft)
```

Alle Terme verstärken sich gegenseitig: hoher Aufwertungsdruck bei schwachem Mietschutz und fehlendem Gemeinnützigkeitsanteil = maximale Gentrifizierung.

---

### `neubau_hemmnisindex`

**Formel:**
```
neubau_hemmnisindex =
  -1 * angebotspotenzial   // invertiert: hohes Hemmnis = tiefes Angebotspotenzial
```

Kann direkt `angebotspotenzial` invertiert verwenden, oder feingranularer nur die angebotsreduzierenden Komponenten isolieren.

---

### `verdrängungsrisiko_index`

Entspricht direkt `verdrängungsrisiko` aus Ebene 1 — kein separater Berechnungsschritt nötig. Ebene-2-Alias für Widget-Konsistenz.

---

### `zeit_bis_wirkung`

**Nicht normiert — gibt Zeitprofil zurück, kein Skalarwert.**

Berechnet aus `diff` (Ebene 0) direkt: für jeden geänderten Parameter die dokumentierte Zeitklasse:

```typescript
type ZeitKlasse = 'kurzfristig' | 'mittelfristig' | 'langfristig';

interface Zeitprofil {
  kurzfristig: string[];   // Parameter die sofort wirken (< 1 Jahr)
  mittelfristig: string[]; // 3–7 Jahre
  langfristig: string[];   // 5–15 Jahre
  dominanteKlasse: ZeitKlasse;
}
```

Zeitklassen-Mapping pro Parameter wird als statische Tabelle in `model/params.ts` hinterlegt.

---

### `fiskalische_wirkung`

**Formel:**
```
fiskalische_wirkung =
  w1 * boden_mehrwertabgabe (delta)
+ w2 * steuer_handaenderung (delta) * (1 - markfriktion)  // Friktion reduziert Transaktionsvolumen
+ w3 * steuer_grundstückgewinn (delta) * (1 - markfriktion)
+ w4 * gemeinnuetzig_foerderfonds (delta)                 // Hebel: mehr Fonds = mehr Projekte
```

Gibt relativen Index zurück, kein CHF-Betrag (Prototyp).

---

## Implementierung

### TypeScript-Interface

```typescript
// Ebene 1
interface MarketState {
  angebotspotenzial:        number;  // –1 … +1
  nachfragedruck:           number;  // –1 … +1
  mietpreis_schutzlevel:    number;  // –1 … +1
  verdrängungsrisiko:       number;  // –1 … +1
  spekulationshemmung:      number;  // –1 … +1
  markfriktion:             number;  // –1 … +1
  gemeinnuetzig_kraft:      number;  // –1 … +1
  eigentumsquoten_trend:    number;  // –1 … +1
  aufwertungsdruck:         number;  // –1 … +1
  investitionsattraktivitaet: number; // –1 … +1
}

// Ebene 2
interface DerivedIndicators {
  gentrifizierungsindex:    number;   // –1 … +1
  neubau_hemmnisindex:      number;   // –1 … +1
  verdrängungsrisiko_index: number;   // –1 … +1
  fiskalische_wirkung:      number;   // –1 … +1
  zeit_bis_wirkung:         Zeitprofil; // nicht normiert
}
```

### Berechnungsfunktionen

```typescript
// model/market-state.ts
function computeMarketState(
  context: CityContext,
  baseline: CityParams,
  modified: CityParams,
  diff: ParamsDiff
): MarketState { ... }

// model/derived-indicators.ts
function computeDerivedIndicators(
  state: MarketState,
  context: CityContext,
  diff: ParamsDiff
): DerivedIndicators { ... }
```

### Widget-Zugriffsmuster

```typescript
// Widget kann von jeder Ebene lesen:
function GentrifizierungsWidget({ context, diff, state, derived }) {
  // Primär: Ebene 2
  const score = derived.gentrifizierungsindex;

  // Ergänzend: Ebene 1 für Details
  const aufwertung = state.aufwertungsdruck;

  // Bei Bedarf: Ebene 0 für spezifische Parameter
  const airbnbDelta = diff.nutzung_kurzzeitvermietung;
}
```

---

## Offene Fragen / Designentscheide

1. **Gewichte:** Zunächst als einfache Konstanten in `model/weights.ts`. Können später empirisch kalibriert werden.
2. **Normierung:** Wie werden rohe Parameterwerte (0/1/2) auf –1…+1 normiert? Vorschlag: `(value - baseline) / 2` ergibt –1, –0.5, 0, +0.5, +1.
3. **Kontextfaktoren:** Kontextfaktoren (–2…+2) auf –1…+1 skalieren: `context.zinsniveau / 2`.
4. **Zeitprofil-Metadaten:** Müssen als statische Tabelle in `model/params.ts` ergänzt werden (pro Parameter: Zeitklasse + Stärke als Gewicht).
