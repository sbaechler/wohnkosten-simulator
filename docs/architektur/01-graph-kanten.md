# Graph-Kanten — Referenz

> **Generiert** aus `src/model/phase-weights.ts`, `params.ts` und `derived.ts`.
> Nicht von Hand editieren. Neu erzeugen: `npm run build:docs`.

## Lesehilfe

- **Höhere Stufe bedeutet:** was ein Schritt des Schiebers nach rechts (0 → 2) inhaltlich heisst. Bei Kontextfaktoren der Wert +2.
- **Wirkung:** was mit dem Zielknoten geschieht, wenn die Stufe steigt. Sinkt die Stufe, kehrt sich die Wirkung um.
- **Impulse:** neuer Anstoss je Phase (0–2 Jahre, 2–5 Jahre, 5–10 Jahre), 0.0 = keiner, 1.0 = voller. Der Stand einer Phase ist `PERSISTENCE · Stand der Vorphase + Impuls` (Generator in `compute-phases.ts`), der Impuls geteilt durch den für alle Knoten gleichen Nenner `E1_NENNER`. Ein Impuls ist also nicht das erreichte Niveau.
- **Verlauf:** Herkunft des Impulsvektors (`profilQuelle`): Studien-ID aus `docs/recherche/` oder «Annahme» (dann gleicher Impuls in allen Phasen). Kontextkanten: —.

Kanten gesamt: 100.

## E0 und Kontext → E1

### `angebotspotenzial`

Positiver Wert: mehr Angebot möglich. Eingehende Kanten: 23.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `raumplanung_zonenreserve` | weniger Bauland-Reserven | senkt → weniger: mehr Angebot möglich | 0.10 / 0.70 / 1.00 | AU-002 |
| `raumplanung_verdichtung` | stärkere Pflicht zur Innenverdichtung | erhöht → mehr Angebot möglich | 0.00 / 0.60 / 1.00 | NZ-001 |
| `raumplanung_ausnuetzungsziffer` | dichtere Bebauung erlaubt | erhöht → mehr Angebot möglich | 0.10 / 0.50 / 1.00 | US-005 |
| `boden_bauverpflichtung` | strengere Massnahmen gegen Baulandhortung | erhöht → mehr Angebot möglich | 0.52 / 0.52 / 0.52 | Annahme |
| `bau_energievorgaben` | strengere Energievorgaben für Neubauten | senkt → weniger: mehr Angebot möglich | 0.41 / 0.41 / 0.41 | Annahme |
| `bau_sanierungspflicht` | strengere Sanierungspflicht im Bestand | senkt → weniger: mehr Angebot möglich | 0.56 / 0.56 / 0.56 | Annahme |
| `bau_ersatzneubau_effizienz` | mehr Netto-Wohnungen pro Abriss | erhöht → mehr Angebot möglich | 0.52 / 0.52 / 0.52 | Annahme |
| `bau_einspracherecht_dritte` | mehr Einspracheberechtigte | senkt → weniger: mehr Angebot möglich | 0.52 / 0.52 / 0.52 | Annahme |
| `bau_einspracherecht_suspensiv` | stärkere aufschiebende Wirkung von Einsprachen | senkt → weniger: mehr Angebot möglich | 0.68 / 0.68 / 0.68 | Annahme |
| `bau_bewilligungsverfahren` | schnelleres, einfacheres Verfahren | erhöht → mehr Angebot möglich | 0.42 / 0.42 / 0.42 | Annahme |
| `bau_normenharmonisierung` | einheitlichere Bauvorschriften | erhöht → mehr Angebot möglich | 0.49 / 0.49 / 0.49 | Annahme |
| `gemeinnuetzig_mindestanteil` | höherer gemeinnütziger Pflichtanteil | senkt → weniger: mehr Angebot möglich | 0.51 / 0.51 / 0.51 | Annahme |
| `gemeinnuetzig_foerderfonds` | mehr Fördermittel | erhöht → mehr Angebot möglich | 0.35 / 0.35 / 0.35 | Annahme |
| `nutzung_abbruchverbot` | stärkerer Abbruchschutz | senkt → weniger: mehr Angebot möglich | 0.61 / 0.61 / 0.61 | Annahme |
| `nutzung_umnutzungsverbot` | strengeres Umwandlungsverbot | senkt → weniger: mehr Angebot möglich | 0.58 / 0.58 / 0.58 | Annahme |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | senkt → weniger: mehr Angebot möglich | 1.00 / 0.80 / 0.50 | — |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → mehr Angebot möglich | 0.80 / 0.60 / 0.40 | — |
| `mietrecht_kuendigungsschutz` | stärkerer Kündigungsschutz | senkt → weniger: mehr Angebot möglich | 0.10 / 0.30 / 0.60 | GLOBAL-029 |
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | senkt → weniger: mehr Angebot möglich | 0.20 / 0.50 / 0.90 | GLOBAL-029 |
| `nutzung_zweitwohnungen` | strengere Zweitwohnungsgrenze | senkt → weniger: mehr Angebot möglich | 0.53 / 0.53 / 0.53 | Annahme |
| `steuer_leerstandsabgabe` | verbindlichere Leerstandsabgabe | erhöht → mehr Angebot möglich | 0.05 / 0.15 / 0.15 | CA-001 |
| `nutzung_kurzzeitvermietung` | strengere Regeln für Kurzzeitvermietung | erhöht → mehr Angebot möglich | 0.10 / 0.10 / 0.10 | Annahme |
| `boden_bodeneigentumssteuer` | höhere Bodensteuer | erhöht → mehr Angebot möglich | 0.10 / 0.10 / 0.10 | Annahme |

### `nachfragedruck`

Positiver Wert: mehr Nachfragedruck. Eingehende Kanten: 11.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `ctx:zuwanderungsdruck` | Zuwanderung: stark wachsend | erhöht → mehr Nachfragedruck | 1.00 / 0.80 / 0.60 | — |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → mehr Nachfragedruck | 0.90 / 0.70 / 0.50 | — |
| `ctx:bevoelkerungstrend` | Bevölkerung: stark wachsend | erhöht → mehr Nachfragedruck | 0.80 / 0.90 / 0.70 | — |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | senkt → weniger: mehr Nachfragedruck | 0.90 / 0.70 / 0.40 | — |
| `infra_oepnv` | stärkerer ÖV-Ausbau | erhöht → mehr Nachfragedruck | 0.50 / 0.50 / 0.50 | Annahme |
| `infra_schule_kita` | besseres Schul- und Kita-Angebot | erhöht → mehr Nachfragedruck | 0.43 / 0.43 / 0.43 | Annahme |
| `infra_oeffentlicher_raum` | hochwertigerer öffentlicher Raum | erhöht → mehr Nachfragedruck | 0.45 / 0.45 / 0.45 | Annahme |
| `infra_wirtschaftsansiedlung` | stärkere Wirtschaftsförderung | erhöht → mehr Nachfragedruck | 0.51 / 0.51 / 0.51 | Annahme |
| `steuer_eigenmietwert` | höhere Besteuerung des Eigenmietwerts | senkt → weniger: mehr Nachfragedruck | 0.57 / 0.57 / 0.57 | Annahme |
| `kapital_hypothekarregulierung` | strengere Kreditvergabe | senkt → weniger: mehr Nachfragedruck | 0.90 / 0.00 / 0.00 | KR-003 |
| `kapital_auslaendische_investoren` | strengere Beschränkung ausländischer Käufer | senkt → weniger: mehr Nachfragedruck | 0.46 / 0.46 / 0.46 | Annahme |

### `mietpreis_schutzlevel`

Positiver Wert: stärkerer Schutz der Bestandsmieten. Eingehende Kanten: 4.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | erhöht → stärkerer Schutz der Bestandsmieten | 1.00 / 0.20 / 0.20 | DE-004 |
| `mietrecht_anfangsmiete` | leichtere Anfechtung der Anfangsmiete | erhöht → stärkerer Schutz der Bestandsmieten | 0.18 / 0.26 / 0.18 | FR-003 |
| `mietrecht_mietzinstransparenz` | mehr Offenlegungspflicht | erhöht → stärkerer Schutz der Bestandsmieten | 0.15 / 0.15 / 0.15 | Annahme |
| `mietrecht_kuendigungsschutz` | stärkerer Kündigungsschutz | erhöht → stärkerer Schutz der Bestandsmieten | 0.60 / 0.60 / 0.60 | Annahme |

### `verdraengungsrisiko`

Positiver Wert: höheres Verdrängungsrisiko. Eingehende Kanten: 9.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `mietrecht_kuendigungsschutz` | stärkerer Kündigungsschutz | senkt → weniger: höheres Verdrängungsrisiko | 0.84 / 0.84 / 0.84 | Annahme |
| `nutzung_abbruchverbot` | stärkerer Abbruchschutz | senkt → weniger: höheres Verdrängungsrisiko | 0.76 / 0.76 / 0.76 | Annahme |
| `nutzung_umnutzungsverbot` | strengeres Umwandlungsverbot | senkt → weniger: höheres Verdrängungsrisiko | 0.79 / 0.79 / 0.79 | Annahme |
| `bau_sanierungspflicht` | strengere Sanierungspflicht im Bestand | erhöht → höheres Verdrängungsrisiko | 0.81 / 0.81 / 0.81 | Annahme |
| `mietrecht_untervermietung` | strengere Regeln für Untervermietung | senkt → weniger: höheres Verdrängungsrisiko | 0.69 / 0.69 / 0.69 | Annahme |
| `raumplanung_verdichtung` | stärkere Pflicht zur Innenverdichtung | erhöht → höheres Verdrängungsrisiko | 0.57 / 0.57 / 0.57 | Annahme |
| `ctx:zuwanderungsdruck` | Zuwanderung: stark wachsend | erhöht → höheres Verdrängungsrisiko | 1.00 / 1.00 / 1.00 | — |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → höheres Verdrängungsrisiko | 0.70 / 1.00 / 0.90 | — |
| `nutzung_kurzzeitvermietung` | strengere Regeln für Kurzzeitvermietung | senkt → weniger: höheres Verdrängungsrisiko | 0.79 / 0.79 / 0.79 | Annahme |

### `spekulationshemmung`

Positiver Wert: Spekulation stärker gehemmt. Eingehende Kanten: 9.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `steuer_grundstueckgewinn` | höhere Grundstückgewinnsteuer | erhöht → Spekulation stärker gehemmt | 0.79 / 0.79 / 0.79 | Annahme |
| `steuer_handaenderung` | höhere Handänderungssteuer | erhöht → Spekulation stärker gehemmt | 0.79 / 0.79 / 0.79 | Annahme |
| `steuer_kapitalgewinnprivatpersonen` | umfassendere Kapitalgewinnsteuer | erhöht → Spekulation stärker gehemmt | 0.76 / 0.76 / 0.76 | Annahme |
| `boden_mehrwertabgabe` | höhere Mehrwertabgabe | erhöht → Spekulation stärker gehemmt | 0.79 / 0.79 / 0.79 | Annahme |
| `boden_bodeneigentumssteuer` | höhere Bodensteuer | erhöht → Spekulation stärker gehemmt | 0.81 / 0.81 / 0.81 | Annahme |
| `boden_bauverpflichtung` | strengere Massnahmen gegen Baulandhortung | erhöht → Spekulation stärker gehemmt | 0.83 / 0.83 / 0.83 | Annahme |
| `nutzung_zweitwohnungen` | strengere Zweitwohnungsgrenze | erhöht → Spekulation stärker gehemmt | 0.73 / 0.73 / 0.73 | Annahme |
| `nutzung_kurzzeitvermietung` | strengere Regeln für Kurzzeitvermietung | erhöht → Spekulation stärker gehemmt | 0.83 / 0.83 / 0.83 | Annahme |
| `steuer_leerstandsabgabe` | verbindlichere Leerstandsabgabe | erhöht → Spekulation stärker gehemmt | 0.30 / 0.90 / 0.90 | CA-001 |

### `marktfriktion`

Positiver Wert: trägerer Markt, weniger Wechsel. Eingehende Kanten: 7.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `steuer_grundstueckgewinn` | höhere Grundstückgewinnsteuer | erhöht → trägerer Markt, weniger Wechsel | 0.69 / 0.69 / 0.69 | Annahme |
| `steuer_handaenderung` | höhere Handänderungssteuer | erhöht → trägerer Markt, weniger Wechsel | 0.69 / 0.69 / 0.69 | Annahme |
| `steuer_kapitalgewinnprivatpersonen` | umfassendere Kapitalgewinnsteuer | erhöht → trägerer Markt, weniger Wechsel | 0.67 / 0.67 / 0.67 | Annahme |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | erhöht → trägerer Markt, weniger Wechsel | 1.00 / 1.00 / 0.90 | — |
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | erhöht → trägerer Markt, weniger Wechsel | 0.79 / 0.79 / 0.79 | Annahme |
| `mietrecht_kuendigungsschutz` | stärkerer Kündigungsschutz | erhöht → trägerer Markt, weniger Wechsel | 0.69 / 0.69 / 0.69 | Annahme |
| `mietrecht_mietzinstransparenz` | mehr Offenlegungspflicht | erhöht → trägerer Markt, weniger Wechsel | 0.41 / 0.41 / 0.41 | Annahme |

### `gemeinnuetzig_kraft`

Positiver Wert: stärkerer gemeinnütziger Sektor. Eingehende Kanten: 6.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `gemeinnuetzig_mindestanteil` | höherer gemeinnütziger Pflichtanteil | erhöht → stärkerer gemeinnütziger Sektor | 0.97 / 0.97 / 0.97 | Annahme |
| `gemeinnuetzig_foerderfonds` | mehr Fördermittel | erhöht → stärkerer gemeinnütziger Sektor | 0.80 / 0.80 / 0.80 | Annahme |
| `gemeinnuetzig_baurecht` | mehr Land im Baurecht für Gemeinnützige | erhöht → stärkerer gemeinnütziger Sektor | 0.93 / 0.93 / 0.93 | Annahme |
| `boden_vorkaufsrecht` | umfassenderes Vorkaufsrecht der Gemeinde | erhöht → stärkerer gemeinnütziger Sektor | 0.81 / 0.81 / 0.81 | Annahme |
| `gemeinnuetzig_belegungsvorschriften` | verbindlichere Belegungsvorschriften | erhöht → stärkerer gemeinnütziger Sektor | 0.76 / 0.76 / 0.76 | Annahme |
| `gemeinnuetzig_sozialmischung` | verbindlichere Sozialmischung | erhöht → stärkerer gemeinnütziger Sektor | 0.77 / 0.77 / 0.77 | Annahme |

### `eigentumsquoten_trend`

Positiver Wert: Trend zu mehr Wohneigentum. Eingehende Kanten: 6.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `steuer_eigenmietwert` | höhere Besteuerung des Eigenmietwerts | senkt → weniger: Trend zu mehr Wohneigentum | 0.79 / 0.79 / 0.79 | Annahme |
| `kapital_hypothekarregulierung` | strengere Kreditvergabe | senkt → weniger: Trend zu mehr Wohneigentum | 0.89 / 0.89 / 0.89 | Annahme |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | senkt → weniger: Trend zu mehr Wohneigentum | 1.00 / 1.00 / 0.90 | — |
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | senkt → weniger: Trend zu mehr Wohneigentum | 0.77 / 0.77 / 0.77 | Annahme |
| `ctx:zuwanderungsdruck` | Zuwanderung: stark wachsend | senkt → weniger: Trend zu mehr Wohneigentum | 1.00 / 1.00 / 1.00 | — |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → Trend zu mehr Wohneigentum | 0.70 / 0.90 / 1.00 | — |

### `aufwertungsdruck`

Positiver Wert: mehr Aufwertungsdruck. Eingehende Kanten: 7.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `infra_oepnv` | stärkerer ÖV-Ausbau | erhöht → mehr Aufwertungsdruck | 0.86 / 0.86 / 0.86 | Annahme |
| `infra_wirtschaftsansiedlung` | stärkere Wirtschaftsförderung | erhöht → mehr Aufwertungsdruck | 0.89 / 0.89 / 0.89 | Annahme |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → mehr Aufwertungsdruck | 0.80 / 0.90 / 1.00 | — |
| `raumplanung_verdichtung` | stärkere Pflicht zur Innenverdichtung | erhöht → mehr Aufwertungsdruck | 0.90 / 0.18 / 0.18 | US-010 |
| `raumplanung_ausnuetzungsziffer` | dichtere Bebauung erlaubt | erhöht → mehr Aufwertungsdruck | 0.90 / 0.18 / 0.18 | US-008 |
| `boden_bodeneigentumssteuer` | höhere Bodensteuer | senkt → weniger: mehr Aufwertungsdruck | 0.71 / 0.71 / 0.71 | Annahme |
| `gemeinnuetzig_mindestanteil` | höherer gemeinnütziger Pflichtanteil | senkt → weniger: mehr Aufwertungsdruck | 0.69 / 0.69 / 0.69 | Annahme |

### `investitionsattraktivitaet`

Positiver Wert: attraktiver für Investoren. Eingehende Kanten: 11.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | senkt → weniger: attraktiver für Investoren | 0.86 / 0.86 / 0.86 | Annahme |
| `kapital_institutionelle_regulierung` | strengere Regulierung institutioneller Anleger | senkt → weniger: attraktiver für Investoren | 0.87 / 0.87 / 0.87 | Annahme |
| `steuer_grundstueckgewinn` | höhere Grundstückgewinnsteuer | senkt → weniger: attraktiver für Investoren | 0.69 / 0.69 / 0.69 | Annahme |
| `boden_mehrwertabgabe` | höhere Mehrwertabgabe | senkt → weniger: attraktiver für Investoren | 0.76 / 0.76 / 0.76 | Annahme |
| `kapital_auslaendische_investoren` | strengere Beschränkung ausländischer Käufer | senkt → weniger: attraktiver für Investoren | 0.87 / 0.87 / 0.87 | Annahme |
| `steuer_handaenderung` | höhere Handänderungssteuer | senkt → weniger: attraktiver für Investoren | 0.66 / 0.66 / 0.66 | Annahme |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → attraktiver für Investoren | 0.90 / 1.00 / 1.00 | — |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | senkt → weniger: attraktiver für Investoren | 1.00 / 1.00 / 0.90 | — |
| `nutzung_kurzzeitvermietung` | strengere Regeln für Kurzzeitvermietung | senkt → weniger: attraktiver für Investoren | 0.69 / 0.69 / 0.69 | Annahme |
| `nutzung_abbruchverbot` | stärkerer Abbruchschutz | senkt → weniger: attraktiver für Investoren | 0.69 / 0.69 / 0.69 | Annahme |
| `nutzung_umnutzungsverbot` | strengeres Umwandlungsverbot | senkt → weniger: attraktiver für Investoren | 0.59 / 0.59 / 0.59 | Annahme |

### `angebotspotenzial_regulation`

Positiver Wert: unelastischeres Angebot (reagiert weniger auf Preise). Eingehende Kanten: 7.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 | Verlauf |
|---|---|---|---|---|
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.89 / 0.89 / 0.89 | Annahme |
| `mietrecht_kuendigungsschutz` | stärkerer Kündigungsschutz | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.73 / 0.73 / 0.73 | Annahme |
| `bau_bewilligungsverfahren` | schnelleres, einfacheres Verfahren | senkt → weniger: unelastischeres Angebot (reagiert weniger auf Preise) | 0.62 / 0.62 / 0.62 | Annahme |
| `bau_einspracherecht_suspensiv` | stärkere aufschiebende Wirkung von Einsprachen | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.61 / 0.61 / 0.61 | Annahme |
| `nutzung_abbruchverbot` | stärkerer Abbruchschutz | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.71 / 0.71 / 0.71 | Annahme |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.80 / 0.60 / 0.40 | — |
| `ctx:marktenge` | Marktenge: extrem eng | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.70 / 0.60 / 0.50 | — |

## Parameter ohne Kante

Diese Parameter wirken nicht über die lineare Kantensumme (Mietrechts-Regime, siehe `mietrecht-regime.ts`):

- `mietrecht_mietzinsindex` — kein Mehr oder Weniger: anderer Anpassungsmechanismus (Referenzzins, Landesindex, Kostenbindung)
- `mietrecht_kriterium` — kein Mehr oder Weniger: anderes bindendes Kriterium (Kosten, heutiges Recht, Vergleichsmiete)
- `mietrecht_durchsetzung` — stärkerer Vollzug

## E1 → E2

Gewichtete Summe, geteilt durch die Summe der Koeffizienten. Keine Phasengewichte: E2 wird in jeder Phase aus dem E1-Stand dieser Phase gerechnet.

### `gentrifizierungsindex`

| E1-Knoten | Koeffizient | Richtung |
|---|---|---|
| `aufwertungsdruck` | 1.5 | erhöht |
| `mietpreis_schutzlevel` | 1.5 | senkt |
| `verdraengungsrisiko` | 1.5 | erhöht |
| `gemeinnuetzig_kraft` | 1.0 | senkt |

### `neubau_hemmnisindex`

| E1-Knoten | Koeffizient | Richtung |
|---|---|---|
| `angebotspotenzial` | 1.0 | senkt |

### `verdraengungsrisiko_index`

| E1-Knoten | Koeffizient | Richtung |
|---|---|---|
| `verdraengungsrisiko` | 1.0 | erhöht |

### `fiskalische_wirkung`

| E1-Knoten | Koeffizient | Richtung |
|---|---|---|
| `spekulationshemmung` | 1.5 | erhöht |
| `marktfriktion` | 1.0 | senkt |
| `gemeinnuetzig_kraft` | 1.0 | erhöht |
| `aufwertungsdruck` | 0.8 | erhöht |
