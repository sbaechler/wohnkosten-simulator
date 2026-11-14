# Graph-Kanten — Referenz

> **Generiert** aus `src/model/phase-weights.ts`, `params.ts` und `derived.ts`.
> Nicht von Hand editieren. Neu erzeugen: `npm run build:docs`.

## Lesehilfe

- **Höhere Stufe bedeutet:** was ein Schritt des Schiebers nach rechts (0 → 2) inhaltlich heisst. Bei Kontextfaktoren der Wert +2.
- **Wirkung:** was mit dem Zielknoten geschieht, wenn die Stufe steigt. Sinkt die Stufe, kehrt sich die Wirkung um.
- **Impulse:** neuer Anstoss je Phase (0–2 Jahre, 2–5 Jahre, 5–10 Jahre), 0.0 = keiner, 1.0 = voller. Der Stand einer Phase ist das Resultat der Vorphase plus der Impuls dieser Phase (Generator in `compute-phases.ts`). Ein Impuls ist also nicht das erreichte Niveau.

Kanten gesamt: 100.

## E0 und Kontext → E1

### `angebotspotenzial`

Positiver Wert: mehr Angebot möglich. Eingehende Kanten: 20.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `raumplanung_zonenreserve` | weniger Bauland-Reserven | senkt → weniger: mehr Angebot möglich | 0.8 / 0.5 / 0.3 |
| `raumplanung_verdichtung` | stärkere Pflicht zur Innenverdichtung | erhöht → mehr Angebot möglich | 0.0 / 0.6 / 1.0 |
| `raumplanung_ausnuetzungsziffer` | dichtere Bebauung erlaubt | erhöht → mehr Angebot möglich | 0.2 / 0.7 / 1.0 |
| `boden_bauverpflichtung` | strengere Massnahmen gegen Baulandhortung | erhöht → mehr Angebot möglich | 0.1 / 0.5 / 0.8 |
| `bau_energievorgaben` | strengere Energievorgaben für Neubauten | senkt → weniger: mehr Angebot möglich | 0.2 / 0.6 / 0.4 |
| `bau_sanierungspflicht` | strengere Sanierungspflicht im Bestand | senkt → weniger: mehr Angebot möglich | 0.9 / 0.6 / 0.3 |
| `bau_ersatzneubau_effizienz` | mehr Netto-Wohnungen pro Abriss | erhöht → mehr Angebot möglich | 0.1 / 0.5 / 0.8 |
| `bau_einspracherecht_dritte` | mehr Einspracheberechtigte | senkt → weniger: mehr Angebot möglich | 0.5 / 0.7 / 0.4 |
| `bau_einspracherecht_suspensiv` | stärkere aufschiebende Wirkung von Einsprachen | senkt → weniger: mehr Angebot möglich | 0.7 / 0.9 / 0.5 |
| `bau_bewilligungsverfahren` | schnelleres, einfacheres Verfahren | erhöht → mehr Angebot möglich | 0.4 / 0.6 / 0.3 |
| `bau_normenharmonisierung` | einheitlichere Bauvorschriften | erhöht → mehr Angebot möglich | 0.0 / 0.5 / 0.8 |
| `gemeinnuetzig_mindestanteil` | höherer gemeinnütziger Pflichtanteil | senkt → weniger: mehr Angebot möglich | 0.4 / 0.6 / 0.5 |
| `gemeinnuetzig_foerderfonds` | mehr Fördermittel | erhöht → mehr Angebot möglich | 0.1 / 0.5 / 0.8 |
| `nutzung_abbruchverbot` | stärkerer Abbruchschutz | senkt → weniger: mehr Angebot möglich | 0.5 / 0.7 / 0.6 |
| `nutzung_umnutzungsverbot` | strengeres Umwandlungsverbot | senkt → weniger: mehr Angebot möglich | 0.4 / 0.7 / 0.6 |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | senkt → weniger: mehr Angebot möglich | 1.0 / 0.8 / 0.5 |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → mehr Angebot möglich | 0.8 / 0.6 / 0.4 |
| `mietrecht_kuendigungsschutz` | stärkerer Kündigungsschutz | senkt → weniger: mehr Angebot möglich | 0.1 / 0.4 / 0.8 |
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | senkt → weniger: mehr Angebot möglich | 0.2 / 0.5 / 0.9 |
| `nutzung_zweitwohnungen` | strengere Zweitwohnungsgrenze | senkt → weniger: mehr Angebot möglich | 0.3 / 0.5 / 0.7 |

### `nachfragedruck`

Positiver Wert: mehr Nachfragedruck. Eingehende Kanten: 15.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `ctx:zuwanderungsdruck` | Zuwanderung: stark wachsend | erhöht → mehr Nachfragedruck | 1.0 / 0.8 / 0.6 |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → mehr Nachfragedruck | 0.9 / 0.7 / 0.5 |
| `ctx:bevoelkerungstrend` | Bevölkerung: stark wachsend | erhöht → mehr Nachfragedruck | 0.8 / 0.9 / 0.7 |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | senkt → weniger: mehr Nachfragedruck | 0.9 / 0.7 / 0.4 |
| `infra_oepnv` | stärkerer ÖV-Ausbau | erhöht → mehr Nachfragedruck | 0.3 / 0.7 / 1.0 |
| `infra_schule_kita` | besseres Schul- und Kita-Angebot | erhöht → mehr Nachfragedruck | 0.2 / 0.6 / 0.9 |
| `infra_oeffentlicher_raum` | hochwertigerer öffentlicher Raum | erhöht → mehr Nachfragedruck | 0.4 / 0.8 / 0.7 |
| `infra_wirtschaftsansiedlung` | stärkere Wirtschaftsförderung | erhöht → mehr Nachfragedruck | 0.6 / 0.9 / 0.7 |
| `steuer_eigenmietwert` | höhere Besteuerung des Eigenmietwerts | senkt → weniger: mehr Nachfragedruck | 0.8 / 0.6 / 0.4 |
| `kapital_hypothekarregulierung` | strengere Kreditvergabe | senkt → weniger: mehr Nachfragedruck | 0.9 / 0.6 / 0.3 |
| `kapital_auslaendische_investoren` | strengere Beschränkung ausländischer Käufer | senkt → weniger: mehr Nachfragedruck | 0.8 / 0.5 / 0.2 |
| `raumplanung_zonenreserve` | weniger Bauland-Reserven | erhöht → mehr Nachfragedruck | 0.2 / 0.5 / 0.8 |
| `gemeinnuetzig_mindestanteil` | höherer gemeinnütziger Pflichtanteil | senkt → weniger: mehr Nachfragedruck | 0.3 / 0.5 / 0.7 |
| `gemeinnuetzig_foerderfonds` | mehr Fördermittel | senkt → weniger: mehr Nachfragedruck | 0.1 / 0.4 / 0.7 |
| `gemeinnuetzig_baurecht` | mehr Land im Baurecht für Gemeinnützige | senkt → weniger: mehr Nachfragedruck | 0.2 / 0.4 / 0.6 |

### `mietpreis_schutzlevel`

Positiver Wert: stärkerer Schutz der Bestandsmieten. Eingehende Kanten: 3.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | erhöht → stärkerer Schutz der Bestandsmieten | 1.0 / 0.9 / 0.8 |
| `mietrecht_anfangsmiete` | leichtere Anfechtung der Anfangsmiete | erhöht → stärkerer Schutz der Bestandsmieten | 1.0 / 0.8 / 0.7 |
| `mietrecht_mietzinstransparenz` | mehr Offenlegungspflicht | erhöht → stärkerer Schutz der Bestandsmieten | 0.8 / 0.7 / 0.6 |

### `verdraengungsrisiko`

Positiver Wert: höheres Verdrängungsrisiko. Eingehende Kanten: 9.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `mietrecht_kuendigungsschutz` | stärkerer Kündigungsschutz | senkt → weniger: höheres Verdrängungsrisiko | 1.0 / 0.9 / 0.7 |
| `nutzung_abbruchverbot` | stärkerer Abbruchschutz | senkt → weniger: höheres Verdrängungsrisiko | 0.8 / 0.8 / 0.7 |
| `nutzung_umnutzungsverbot` | strengeres Umwandlungsverbot | senkt → weniger: höheres Verdrängungsrisiko | 0.9 / 0.8 / 0.7 |
| `bau_sanierungspflicht` | strengere Sanierungspflicht im Bestand | erhöht → höheres Verdrängungsrisiko | 0.7 / 0.9 / 0.8 |
| `mietrecht_untervermietung` | strengere Regeln für Untervermietung | senkt → weniger: höheres Verdrängungsrisiko | 0.8 / 0.7 / 0.6 |
| `raumplanung_verdichtung` | stärkere Pflicht zur Innenverdichtung | erhöht → höheres Verdrängungsrisiko | 0.5 / 0.7 / 0.5 |
| `ctx:zuwanderungsdruck` | Zuwanderung: stark wachsend | erhöht → höheres Verdrängungsrisiko | 1.0 / 1.0 / 1.0 |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → höheres Verdrängungsrisiko | 0.7 / 1.0 / 0.9 |
| `nutzung_kurzzeitvermietung` | strengere Regeln für Kurzzeitvermietung | senkt → weniger: höheres Verdrängungsrisiko | 0.9 / 0.8 / 0.7 |

### `spekulationshemmung`

Positiver Wert: Spekulation stärker gehemmt. Eingehende Kanten: 9.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `steuer_grundstueckgewinn` | höhere Grundstückgewinnsteuer | erhöht → Spekulation stärker gehemmt | 0.9 / 0.8 / 0.7 |
| `steuer_handaenderung` | höhere Handänderungssteuer | erhöht → Spekulation stärker gehemmt | 0.9 / 0.8 / 0.7 |
| `steuer_kapitalgewinnprivatpersonen` | umfassendere Kapitalgewinnsteuer | erhöht → Spekulation stärker gehemmt | 0.8 / 0.8 / 0.7 |
| `boden_mehrwertabgabe` | höhere Mehrwertabgabe | erhöht → Spekulation stärker gehemmt | 0.9 / 0.8 / 0.7 |
| `boden_bodeneigentumssteuer` | höhere Bodensteuer | erhöht → Spekulation stärker gehemmt | 0.7 / 0.8 / 0.9 |
| `boden_bauverpflichtung` | strengere Massnahmen gegen Baulandhortung | erhöht → Spekulation stärker gehemmt | 0.8 / 0.9 / 0.8 |
| `nutzung_zweitwohnungen` | strengere Zweitwohnungsgrenze | erhöht → Spekulation stärker gehemmt | 0.7 / 0.8 / 0.7 |
| `nutzung_kurzzeitvermietung` | strengere Regeln für Kurzzeitvermietung | erhöht → Spekulation stärker gehemmt | 0.8 / 0.9 / 0.8 |
| `steuer_leerstandsabgabe` | verbindlichere Leerstandsabgabe | erhöht → Spekulation stärker gehemmt | 0.7 / 0.8 / 0.9 |

### `marktfriktion`

Positiver Wert: trägerer Markt, weniger Wechsel. Eingehende Kanten: 7.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `steuer_grundstueckgewinn` | höhere Grundstückgewinnsteuer | erhöht → trägerer Markt, weniger Wechsel | 0.8 / 0.7 / 0.6 |
| `steuer_handaenderung` | höhere Handänderungssteuer | erhöht → trägerer Markt, weniger Wechsel | 0.8 / 0.7 / 0.6 |
| `steuer_kapitalgewinnprivatpersonen` | umfassendere Kapitalgewinnsteuer | erhöht → trägerer Markt, weniger Wechsel | 0.6 / 0.7 / 0.7 |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | erhöht → trägerer Markt, weniger Wechsel | 1.0 / 1.0 / 0.9 |
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | erhöht → trägerer Markt, weniger Wechsel | 0.6 / 0.8 / 0.9 |
| `mietrecht_kuendigungsschutz` | stärkerer Kündigungsschutz | erhöht → trägerer Markt, weniger Wechsel | 0.5 / 0.7 / 0.8 |
| `mietrecht_mietzinstransparenz` | mehr Offenlegungspflicht | erhöht → trägerer Markt, weniger Wechsel | 0.3 / 0.4 / 0.5 |

### `gemeinnuetzig_kraft`

Positiver Wert: stärkerer gemeinnütziger Sektor. Eingehende Kanten: 6.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `gemeinnuetzig_mindestanteil` | höherer gemeinnütziger Pflichtanteil | erhöht → stärkerer gemeinnütziger Sektor | 0.9 / 1.0 / 1.0 |
| `gemeinnuetzig_foerderfonds` | mehr Fördermittel | erhöht → stärkerer gemeinnütziger Sektor | 0.5 / 0.8 / 1.0 |
| `gemeinnuetzig_baurecht` | mehr Land im Baurecht für Gemeinnützige | erhöht → stärkerer gemeinnütziger Sektor | 0.9 / 1.0 / 0.9 |
| `boden_vorkaufsrecht` | umfassenderes Vorkaufsrecht der Gemeinde | erhöht → stärkerer gemeinnütziger Sektor | 0.7 / 0.9 / 0.8 |
| `gemeinnuetzig_belegungsvorschriften` | verbindlichere Belegungsvorschriften | erhöht → stärkerer gemeinnütziger Sektor | 0.8 / 0.8 / 0.7 |
| `gemeinnuetzig_sozialmischung` | verbindlichere Sozialmischung | erhöht → stärkerer gemeinnütziger Sektor | 0.7 / 0.8 / 0.8 |

### `eigentumsquoten_trend`

Positiver Wert: Trend zu mehr Wohneigentum. Eingehende Kanten: 6.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `steuer_eigenmietwert` | höhere Besteuerung des Eigenmietwerts | senkt → weniger: Trend zu mehr Wohneigentum | 0.9 / 0.8 / 0.7 |
| `kapital_hypothekarregulierung` | strengere Kreditvergabe | senkt → weniger: Trend zu mehr Wohneigentum | 1.0 / 0.9 / 0.8 |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | senkt → weniger: Trend zu mehr Wohneigentum | 1.0 / 1.0 / 0.9 |
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | senkt → weniger: Trend zu mehr Wohneigentum | 0.7 / 0.8 / 0.8 |
| `ctx:zuwanderungsdruck` | Zuwanderung: stark wachsend | senkt → weniger: Trend zu mehr Wohneigentum | 1.0 / 1.0 / 1.0 |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → Trend zu mehr Wohneigentum | 0.7 / 0.9 / 1.0 |

### `aufwertungsdruck`

Positiver Wert: mehr Aufwertungsdruck. Eingehende Kanten: 7.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `infra_oepnv` | stärkerer ÖV-Ausbau | erhöht → mehr Aufwertungsdruck | 0.6 / 0.9 / 1.0 |
| `infra_wirtschaftsansiedlung` | stärkere Wirtschaftsförderung | erhöht → mehr Aufwertungsdruck | 0.7 / 0.9 / 1.0 |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → mehr Aufwertungsdruck | 0.8 / 0.9 / 1.0 |
| `raumplanung_verdichtung` | stärkere Pflicht zur Innenverdichtung | erhöht → mehr Aufwertungsdruck | 0.8 / 0.9 / 1.0 |
| `raumplanung_ausnuetzungsziffer` | dichtere Bebauung erlaubt | erhöht → mehr Aufwertungsdruck | 0.9 / 0.9 / 0.8 |
| `boden_bodeneigentumssteuer` | höhere Bodensteuer | senkt → weniger: mehr Aufwertungsdruck | 0.6 / 0.7 / 0.8 |
| `gemeinnuetzig_mindestanteil` | höherer gemeinnütziger Pflichtanteil | senkt → weniger: mehr Aufwertungsdruck | 0.8 / 0.7 / 0.6 |

### `investitionsattraktivitaet`

Positiver Wert: attraktiver für Investoren. Eingehende Kanten: 11.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | senkt → weniger: attraktiver für Investoren | 0.9 / 0.9 / 0.8 |
| `kapital_institutionelle_regulierung` | strengere Regulierung institutioneller Anleger | senkt → weniger: attraktiver für Investoren | 0.8 / 0.9 / 0.9 |
| `steuer_grundstueckgewinn` | höhere Grundstückgewinnsteuer | senkt → weniger: attraktiver für Investoren | 0.8 / 0.7 / 0.6 |
| `boden_mehrwertabgabe` | höhere Mehrwertabgabe | senkt → weniger: attraktiver für Investoren | 0.8 / 0.8 / 0.7 |
| `kapital_auslaendische_investoren` | strengere Beschränkung ausländischer Käufer | senkt → weniger: attraktiver für Investoren | 0.8 / 0.9 / 0.9 |
| `steuer_handaenderung` | höhere Handänderungssteuer | senkt → weniger: attraktiver für Investoren | 0.7 / 0.7 / 0.6 |
| `ctx:wirtschaftskraft` | Wirtschaftskraft: sehr stark | erhöht → attraktiver für Investoren | 0.9 / 1.0 / 1.0 |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | senkt → weniger: attraktiver für Investoren | 1.0 / 1.0 / 0.9 |
| `nutzung_kurzzeitvermietung` | strengere Regeln für Kurzzeitvermietung | senkt → weniger: attraktiver für Investoren | 0.8 / 0.7 / 0.6 |
| `nutzung_abbruchverbot` | stärkerer Abbruchschutz | senkt → weniger: attraktiver für Investoren | 0.5 / 0.7 / 0.8 |
| `nutzung_umnutzungsverbot` | strengeres Umwandlungsverbot | senkt → weniger: attraktiver für Investoren | 0.4 / 0.6 / 0.7 |

### `angebotspotenzial_regulation`

Positiver Wert: unelastischeres Angebot (reagiert weniger auf Preise). Eingehende Kanten: 7.

| Quelle | Höhere Stufe bedeutet | Wirkung | Impulse P1 / P2 / P3 |
|---|---|---|---|
| `mietrecht_kostenmiete` | stärkere Bindung der Miete an die Kosten | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.7 / 0.9 / 1.0 |
| `mietrecht_kuendigungsschutz` | stärkerer Kündigungsschutz | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.5 / 0.7 / 0.9 |
| `bau_bewilligungsverfahren` | schnelleres, einfacheres Verfahren | senkt → weniger: unelastischeres Angebot (reagiert weniger auf Preise) | 0.6 / 0.8 / 0.5 |
| `bau_einspracherecht_suspensiv` | stärkere aufschiebende Wirkung von Einsprachen | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.5 / 0.7 / 0.6 |
| `nutzung_abbruchverbot` | stärkerer Abbruchschutz | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.6 / 0.8 / 0.7 |
| `ctx:zinsniveau` | Zinsniveau: sehr hoch | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.8 / 0.6 / 0.4 |
| `ctx:marktenge` | Marktenge: extrem eng | erhöht → unelastischeres Angebot (reagiert weniger auf Preise) | 0.7 / 0.6 / 0.5 |

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
