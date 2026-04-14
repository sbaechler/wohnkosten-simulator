# Graph-Kanten — Referenz

> **Quelle der Wahrheit:** `src/model/phase-weights.ts` (aktive Berechnung) und `src/model/graph.ts` (single-weight Graph, nicht für Berechnung verwendet).

---

## Kantenübersicht

**Phase-Gewichte:** `[P1_Gewicht, P2_Gewicht, P3_Gewicht]`
- `0.0` = keine Wirkung in dieser Phase
- `1.0` = volle Wirkung in dieser Phase

---

## E0 → E1 Kanten

### Kontext → E1

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `ctx:zinsniveau` | `investitionsattraktivitaet` | [1.0, 0.5, 0.0] |
| `ctx:zinsniveau` | `angebotspotenzial` | [0.5, 1.0, 0.5] |
| `ctx:zuwanderungsdruck` | `nachfragedruck` | [1.0, 1.0, 1.0] |
| `ctx:wirtschaftskraft` | `investitionsattraktivitaet` | [0.5, 1.0, 1.0] |
| `ctx:wirtschaftskraft` | `aufwertungsdruck` | [0.5, 1.0, 0.5] |
| `ctx:bevoelkerungstrend` | `nachfragedruck` | [0.5, 1.0, 1.0] |

### Bodenrecht → E1

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `boden_vorkaufsrecht` | `angebotspotenzial` | [0.0, 0.5, 1.0] |
| `boden_vorkaufsrecht` | `spekulationshemmung` | [0.0, 0.5, 1.0] |
| `boden_bauverpflichtung` | `angebotspotenzial` | [0.0, 0.5, 1.0] |
| `boden_mehrwertabgabe` | `spekulationshemmung` | [0.5, 1.0, 0.5] |
| `boden_mehrwertabgabe` | `investitionsattraktivitaet` | [–0.5, –0.5, –0.5] |
| `boden_bodeneigentumssteuer` | `markfriktion` | [0.0, 0.5, 1.0] |
| `raumplanung_zonenreserve` | `angebotspotenzial` | [0.0, 0.5, 1.0] |
| `raumplanung_verdichtung` | `angebotspotenzial` | [0.0, 0.5, 1.0] |
| `raumplanung_ausnuetzungsziffer` | `angebotspotenzial` | [0.0, 0.5, 1.0] |

### Bau & Bewilligung → E1

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `bau_bewilligungsverfahren` | `angebotspotenzial` | [0.5, 1.0, 0.5] |
| `bau_bewilligungsverfahren` | `markfriktion` | [0.5, 1.0, 0.5] |
| `bau_energievorgaben` | `angebotspotenzial` | [0.0, 0.5, 1.0] |
| `bau_sanierungspflicht` | `verdraengungsrisiko` | [0.5, 1.0, 0.5] |
| `bau_sanierungspflicht` | `markfriktion` | [0.5, 0.5, 0.0] |
| `bau_einspracherecht_suspensiv` | `angebotspotenzial` | [0.5, 1.0, 0.5] |
| `bau_einspracherecht_suspensiv` | `markfriktion` | [0.5, 1.0, 0.5] |
| `bau_normenharmonisierung` | `angebotspotenzial` | [0.0, 0.5, 1.0] |

### Gemeinnützig → E1

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `gemeinnuetzig_mindestanteil` | `gemeinnuetzig_kraft` | [0.0, 0.5, 1.0] |
| `gemeinnuetzig_mindestanteil` | `mietpreis_schutzlevel` | [0.0, 0.5, 1.0] |
| `gemeinnuetzig_foerderfonds` | `gemeinnuetzig_kraft` | [0.0, 0.5, 1.0] |
| `gemeinnuetzig_baurecht` | `gemeinnuetzig_kraft` | [0.0, 0.5, 1.0] |
| `gemeinnuetzig_belegungsvorschriften` | `gemeinnuetzig_kraft` | [0.0, 0.5, 1.0] |
| `gemeinnuetzig_sozialmischung` | `aufwertungsdruck` | [–0.5, –0.5, 0.0] |

### Mietrecht → E1

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `mietrecht_kostenmiete` | `mietpreis_schutzlevel` | [1.0, 1.0, 0.5] |
| `mietrecht_kostenmiete` | `verdraengungsrisiko` | [0.5, 1.0, 0.5] |
| `mietrecht_kostenmiete` | `marktfriktion` | [1.0, 0.5, 0.0] |
| `mietrecht_anfangsmiete` | `mietpreis_schutzlevel` | [1.0, 0.5, 0.0] |
| `mietrecht_kuendigungsschutz` | `mietpreis_schutzlevel` | [1.0, 1.0, 1.0] |
| `mietrecht_kuendigungsschutz` | `verdraengungsrisiko` | [0.5, 1.0, 0.5] |
| `mietrecht_kuendigungsschutz` | `marktfriktion` | [0.5, 1.0, 0.5] |
| `mietrecht_mietzinstransparenz` | `marktfriktion` | [0.0, 0.5, 1.0] |
| `mietrecht_mietzinsindex` | `mietpreis_schutzlevel` | [0.5, 1.0, 0.5] |
| `mietrecht_untervermietung` | `marktfriktion` | [0.5, 1.0, 0.5] |

### Steuern → E1

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `steuer_grundstueckgewinn` | `spekulationshemmung` | [0.5, 1.0, 0.5] |
| `steuer_grundstueckgewinn` | `investitionsattraktivitaet` | [–0.5, –1.0, –0.5] |
| `steuer_eigenmietwert` | `eigentumsquoten_trend` | [0.5, 1.0, 0.5] |
| `steuer_eigenmietwert` | `nachfragedruck` | [0.0, –0.5, –1.0] |
| `steuer_leerstandsabgabe` | `angebotspotenzial` | [0.0, 0.5, 1.0] |
| `steuer_handaenderung` | `marktfriktion` | [0.5, 1.0, 0.5] |
| `steuer_kapitalgewinnprivatpersonen` | `investitionsattraktivitaet` | [–0.5, –0.5, 0.0] |

### Kapital & Investitionen → E1

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `kapital_auslaendische_investoren` | `investitionsattraktivitaet` | [1.0, 0.5, 0.0] |
| `kapital_auslaendische_investoren` | `aufwertungsdruck` | [0.5, 0.5, 0.0] |
| `kapital_institutionelle_regulierung` | `spekulationshemmung` | [0.5, 1.0, 0.5] |
| `kapital_institutionelle_regulierung` | `investitionsattraktivitaet` | [–0.5, –1.0, –0.5] |
| `kapital_hypothekarregulierung` | `angebotspotenzial` | [0.0, 0.5, 1.0] |
| `kapital_hypothekarregulierung` | `nachfragedruck` | [0.0, 0.5, 1.0] |

### Nutzungsregulierung → E1

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `nutzung_kurzzeitvermietung` | `angebotspotenzial` | [0.5, 1.0, 0.5] |
| `nutzung_umnutzungsverbot` | `angebotspotenzial` | [0.5, 1.0, 0.5] |
| `nutzung_abbruchverbot` | `verdraengungsrisiko` | [–0.5, –1.0, –0.5] |
| `nutzung_zweitwohnungen` | `angebotspotenzial` | [0.0, 0.5, 1.0] |

### Infrastruktur → E1

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `infra_oepnv` | `nachfragedruck` | [0.0, 0.5, 1.0] |
| `infra_oepnv` | `aufwertungsdruck` | [0.0, 0.5, 1.0] |
| `infra_schule_kita` | `nachfragedruck` | [0.0, 0.5, 1.0] |
| `infra_oeffentlicher_raum` | `aufwertungsdruck` | [0.0, 0.5, 1.0] |
| `infra_wirtschaftsansiedlung` | `nachfragedruck` | [0.0, 0.5, 1.0] |
| `infra_wirtschaftsansiedlung` | `investitionsattraktivitaet` | [0.0, 0.5, 1.0] |

---

## E1 → E2 Kanten

| Quelle | Ziel | Gewichte [P1, P2, P3] |
|--------|------|----------------------|
| `aufwertungsdruck` | `gentrifizierungsindex` | [0.5, 1.0, 1.0] |
| `mietpreis_schutzlevel` | `gentrifizierungsindex` | [0.5, 0.5, 0.0] (invertiert) |
| `verdraengungsrisiko` | `gentrifizierungsindex` | [0.5, 1.0, 1.0] |
| `gemeinnuetzig_kraft` | `gentrifizierungsindex` | [0.5, 0.5, 0.0] (invertiert) |
| `angebotspotenzial` | `neubau_hemmnisindex` | [0.5, 1.0, 0.5] (invertiert) |
| `verdraengungsrisiko` | `verdraengungsrisiko_index` | [0.5, 1.0, 1.0] |
| `spekulationshemmung` | `fiskalische_wirkung` | [0.0, 0.5, 1.0] |
| `marktfriktion` | `fiskalische_wirkung` | [0.0, 0.5, 1.0] (invertiert) |
| `gemeinnuetzig_kraft` | `fiskalische_wirkung` | [0.0, 0.5, 1.0] |
| `aufwertungsdruck` | `fiskalische_wirkung` | [0.0, 0.5, 1.0] |

---

## Phasenmodell

| Phase | Zeithorizont | Charakter |
|-------|-------------|-----------|
| P1 | 0–2 Jahre | Kurzfristig: Zins- und Nachfrageeffekte, sofort spürbare Policies |
| P2 | 2–5 Jahre | Mittelfristig: Baubewilligungen, Marktveränderungen, Gentrifizierung |
| P3 | 5–10 Jahre | Langfristig: Strukturelle Veränderungen, Bodenrecht, Raumplanung |
