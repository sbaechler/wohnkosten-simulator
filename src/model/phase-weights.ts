/**
 * Phasen-gewichtete Kanten E0/ctx → E1
 * ====================================
 *
 * Phase 1: 0–2 Jahre, Phase 2: 2–5 Jahre, Phase 3: 5–10 Jahre.
 *
 * ## Was ein Gewicht bedeutet (Fix-9/Fix-10, Stand 2026-11-15)
 *
 * `weights[p]` ist der **Impuls** der Kante in Phase p, nicht das in dieser
 * Phase erreichte Niveau. Der Stand eines E1-Knotens entsteht im Generator
 * (`compute-phases.ts`):
 *
 *     Stand[p] = PERSISTENCE · Stand[p−1] + Impuls[p]
 *     Impuls[p] = Σ sign · weights[p] · Δ · marketModulator / E1_NENNER
 *
 * Δ ist die Änderung des Parameters, normiert auf −1…+1 (ein voller Schritt
 * 0 → 2 ergibt Δ = 1, eine Stufe Δ = 0.5). `E1_NENNER` ist für alle Knoten
 * gleich. Ein Gewicht bedeutet darum überall dasselbe: die Effektgrösse eines
 * vollen Schritts, unabhängig davon, wie viele Kanten der Zielknoten hat.
 * Es gibt keinen weiteren Phasenfaktor (der frühere `PHASE_BASE_MULTIPLIER`
 * ist gestrichen).
 *
 * Wie früh ein Effekt kommt, steht nur im Vektor; wie lange er hält, im
 * Übertrag. Mit PERSISTENCE = 0.8 gilt für einen Impulsvektor [a, b, c]:
 *
 *     Stand P1 = a
 *     Stand P2 = 0.8·a + b
 *     Stand P3 = 0.64·a + 0.8·b + c
 *
 * Drei Verlaufsformen kommen vor:
 *   - Neutral `[w, w, w]`: gleicher Impuls in jeder Phase, der Stand wächst
 *     1 : 1.8 : 2.44. Pflicht für jede Kante mit `profilQuelle: 'Annahme'`
 *     (keine Verlaufsevidenz → kein erfundener Verlauf).
 *   - Sprung und Halten `[w, 0.2·w, 0.2·w]`: der volle Stand sofort, danach
 *     ersetzt der Impuls genau den Verlust durch den Übertrag (1 − 0.8).
 *   - Verzögert `[≈0, b, c]`: erst ab P2 nennenswert.
 * Ein Stand ohne neuen Impuls verliert 20 % pro Phase. Schneller abklingende
 * Effekte bräuchten einen negativen Impuls; das Schema (Gewichte in [0, 1],
 * festes Vorzeichen) sieht das derzeit nicht vor, und keine Kante belegt es.
 *
 * ## profilQuelle
 *
 * Jede Politik-Kante (Quelle ist ein Parameter, nicht `ctx:*`) nennt, woher
 * ihr Verlauf über die Phasen stammt: eine Studien-ID aus `docs/recherche/`
 * oder ausdrücklich `'Annahme'`. Die Quelle für Richtung und Grösse steht im
 * Kommentar der Kante; sie ist oft eine andere als die Verlaufsquelle.
 * Kontextkanten (`ctx:*`) sind nicht Teil des Verlaufs-Audits und tragen kein
 * Feld.
 *
 * ## Herkunft der Zahlen
 *
 * Kanten mit `'Annahme'` haben den Impuls w = (0.64·a + 0.8·b + c) / 2.44 des
 * früheren Vektors [a, b, c] erhalten: derselbe P3-Stand ohne Multiplikator,
 * aber gleichmässig verteilt. Wo ein Gewicht anders gesetzt ist, sagt der
 * Kommentar warum. Grössen ohne Beleg sind als «Setzung» gekennzeichnet.
 * Kalibriert gegen die Constraints in `scripts/calibrate.ts`
 * (Dry-Run 0 Verletzungen, Stand 2026-11-15).
 *
 * Diese Datei enthält ausschliesslich E0/ctx → E1. E1 → E2 steht in
 * `derived.ts` (E2_TERMS).
 */

export interface PhaseEdge {
  from: string;
  to: string;
  sign: 1 | -1;
  /** Impuls je Phase [P1, P2, P3], je in [0, 1]. */
  weights: readonly [number, number, number];
  /**
   * Herkunft des Verlaufs über die Phasen: Studien-ID aus `docs/recherche/`
   * oder `'Annahme'` (dann gleicher Impuls in allen Phasen). Pflicht für
   * Politik-Kanten, fehlt bei Kontextkanten (`ctx:*`).
   */
  profilQuelle?: string;
}

export const PHASE_WEIGHTED_EDGES: readonly PhaseEdge[] = [

  // ═══════════════════════════════════════════════════════════════════
  // E0 → angebotspotenzial
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'raumplanung_zonenreserve',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.1, 0.7, 1.0],
    profilQuelle: 'AU-002',
    // Skala: höher = weniger Bauland-Reserven → weniger Angebot.
    // Richtung CH-007 (mehr Bauland dämpft den Kostenanstieg), Grösse
    // summary.md (Angebot dominanter Hebel, Zonenreserve «sehr robust»).
    // Verlauf AU-002: mehrjährige Anpassungsverzögerung. Bis 2026-11 als
    // «sofort» [0.8, 0.5, 0.3] geführt, ohne Quelle für den Verlauf.
  },
  {
    from: 'raumplanung_verdichtung',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.0, 0.6, 1.0],
    profilQuelle: 'NZ-001',
    // NZ-001 Auckland: Upzoning erhöht den Neubau, Wirkung nach 2–4 Jahren.
  },
  {
    from: 'raumplanung_ausnuetzungsziffer',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.1, 0.5, 1.0],
    profilQuelle: 'US-005',
    // US-005 (Kanton Zürich, 1996–2020): +9 % Wohnungen 5–10 Jahre nach der
    // Erhöhung der Ausnützung, rund 10 Jahre vom Beschluss bis zu messbar
    // mehr Neubau. US-007: Angebot steigt, Preise in den ersten Jahren nicht
    // messbar.
  },
  {
    from: 'boden_bauverpflichtung',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.52, 0.52, 0.52],
    profilQuelle: 'Annahme',
    // Wirkung nicht belegt (summary.md, Feld `evidenz` in params.ts).
    // Bestehende Kante, Grösse unverändert übernommen; keine neue Evidenz.
  },
  {
    from: 'bau_energievorgaben',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.41, 0.41, 0.41],
    profilQuelle: 'Annahme',
    // Höhere Baukosten hemmen das Angebot. Grösse Setzung.
  },
  {
    from: 'bau_sanierungspflicht',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.56, 0.56, 0.56],
    profilQuelle: 'Annahme',
    // Kapital wird in die Renovation statt in den Neubau gelenkt. Grösse Setzung.
  },
  {
    from: 'bau_ersatzneubau_effizienz',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.52, 0.52, 0.52],
    profilQuelle: 'Annahme',
    // Ersatzneubau-Effizienz: Agglomeration Zürich 2.8×, Agglomeration
    // Lausanne 6.5× (Sotomo 2025, Abb. 9; Stadt Zürich rund 2×).
    // Mehr Netto-Neubau pro Abriss → mehr Angebot. Grösse Setzung.
  },
  {
    from: 'bau_einspracherecht_dritte',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.52, 0.52, 0.52],
    profilQuelle: 'Annahme',
    // NO-001: Einspracherechte verzögern Bewilligungen, ohne quantitative
    // Schätzung. Grösse Setzung.
  },
  {
    from: 'bau_einspracherecht_suspensiv',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.68, 0.68, 0.68],
    profilQuelle: 'Annahme',
    // Aufschiebende Wirkung kann Projekte stoppen; stärker als das blosse
    // Einspracherecht. Grösse Setzung.
  },
  {
    from: 'bau_bewilligungsverfahren',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.42, 0.42, 0.42],
    profilQuelle: 'Annahme',
    // Skala: höher = schnelleres Verfahren. CH-007: lange Verfahren verteuern.
  },
  {
    from: 'bau_normenharmonisierung',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.49, 0.49, 0.49],
    profilQuelle: 'Annahme',
    // Einheitlichere Vorschriften senken Planungskosten. Grösse Setzung.
  },
  {
    from: 'gemeinnuetzig_mindestanteil',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.51, 0.51, 0.51],
    profilQuelle: 'Annahme',
    // Kontingentierung reduziert das private Angebot. Grösse Setzung.
  },
  {
    from: 'gemeinnuetzig_foerderfonds',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.35, 0.35, 0.35],
    profilQuelle: 'Annahme',
    // Fördermittel ermöglichen zusätzlichen gemeinnützigen Neubau.
    // Fix-12: einziger Angebots-/Nachfragekanal des Förderfonds; die
    // Kante → nachfragedruck ist gestrichen (siehe dort). Grösse Setzung,
    // gesenkt von 0.52 (P3-Stand des alten Vektors), damit die Rangfolge
    // aus summary.md hält: Zonierung, Verdichtung und Ausnützung wirken auf
    // Neumieter stärker als der Förderfonds (Fix-13, Rangfolge-Constraint).
  },
  {
    from: 'nutzung_abbruchverbot',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.61, 0.61, 0.61],
    profilQuelle: 'Annahme',
    // DIW Discussion Paper 2143 (Ters/Kholodilin, nur Genf): Wohnungs-
    // rationierung = stärkste Angebotsbremse. Basel: Baugesuche für Wohnungen
    // −76 % (Mittel 784 für 2014–2020 gegen 190 für 2021–2023; Swiss Real
    // Estate Institute im Auftrag des SVIT, Interessenvertreter; Ursache laut
    // Regierungsrat Basel-Stadt offen).
    // Ohne Verlaufsangabe in der Sammlung → neutraler Impuls.
  },
  {
    from: 'nutzung_umnutzungsverbot',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.58, 0.58, 0.58],
    profilQuelle: 'Annahme',
    // Gleicher Mechanismus wie das Abbruchverbot, etwas schwächer.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [1.0, 0.8, 0.5],
    // Zinserhöhung wirkt sofort auf die Rentabilität.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.8, 0.6, 0.4],
    // Wirtschaftskraft ermöglicht Investitionen.
  },
  {
    from: 'mietrecht_kuendigungsschutz',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.1, 0.3, 0.6],
    profilQuelle: 'GLOBAL-029',
    // GLOBAL-027/-029: restriktives Mietrecht senkt den Neubau, kumulativ
    // über Jahrzehnte. P2/P3 gegenüber [0.1, 0.4, 0.8] gesenkt (Setzung):
    // sonst überwiegt der Angebotsverlust den Schutz der Bestandsmieter, und
    // die Rangfolge GLOBAL-027 (Bestand sinkt, Neumieter steigt) kippt.
  },
  {
    from: 'mietrecht_kostenmiete',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.2, 0.5, 0.9],
    profilQuelle: 'GLOBAL-029',
    // Kostenmiete senkt die Renditeerwartung → Neubau unattraktiv.
    // GLOBAL-029: 16 Länder 1910–2016, Wirkung wächst über die Zeit.
  },
  {
    from: 'nutzung_zweitwohnungen',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.53, 0.53, 0.53],
    profilQuelle: 'Annahme',
    // CH-006 Lex Weber: Beschränkung senkt die Bautätigkeit insgesamt.
    // Fachlich strittig für Städte (Verbesserungsplan Fix-1).
  },
  // Fix-11 (2026-11-15): drei Kanten, die beim Umbau auf Phasengewichte
  // verloren gegangen waren.
  {
    from: 'steuer_leerstandsabgabe',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.05, 0.15, 0.15],
    profilQuelle: 'CA-001',
    // Vancouver Empty Homes Tax (EHT): Leerstand 0.90 % (2017) → 0.49 %
    // (2024), rund 2'900 Wohnungen zurück auf dem Markt (CA-001/CA-003).
    // Die 20'000 Condos (Metro Vancouver, 2018–2020) gehören laut CA-002 zur
    // provinziellen Speculation and Vacancy Tax, nicht zur EHT.
    // Verlauf CA-001: erste Effekte nach 1–2 Jahren, deutlich nach 3–5.
    // Grösse Setzung, bewusst klein: die Leerstandsquote sank um 0.4
    // Prozentpunkte, also um einen kleinen Teil des Bestands, und der
    // mobilisierbare Leerstand in den
    // angespannten Schweizer Städten ist tief (für die Städte in
    // switzerland.yaml nicht erfasst). Mietpreiseffekte sind laut
    // CA-001/CA-003 umstritten.
  },
  {
    from: 'nutzung_kurzzeitvermietung',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.1, 0.1, 0.1],
    profilQuelle: 'Annahme',
    // Skala: höher = strengere Regeln. US-003 (Los Angeles): Kurzzeitmiete
    // entzieht Wohnungen dem Dauermarkt, +2 % Mieten; Regulierung auf den
    // Hauptwohnsitz hebt das nahezu auf. ES-001 (Barcelona): +1.9 % Mieten.
    // summary.md: STR-Literatur, Evidenz mittel. Gegenbefund US-013 (NYC)
    // und US-014 (Santa Monica): Inserate −90 % bzw. −60 %, aber keine
    // messbare Mietwirkung, entfernte Einheiten kamen nicht zwingend auf den
    // Dauermarkt. Grösse Setzung, klein.
  },
  {
    from: 'boden_bodeneigentumssteuer',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.1, 0.1, 0.1],
    profilQuelle: 'Annahme',
    // GLOBAL-028: Bodenwertsteuer lenkt Boden in produktivere Nutzung
    // (Theorie und Übersicht). DK-001/DK-002: volle Kapitalisierung in tiefere
    // Bodenpreise; DK-001 findet aber keine messbare Wirkung auf die
    // Entwicklung. Der Angebotseffekt ist damit schwach belegt. Grösse
    // Setzung, klein.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → nachfragedruck
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'ctx:zuwanderungsdruck',
    to: 'nachfragedruck',
    sign: +1,
    weights: [1.0, 0.8, 0.6],
    // Zuwanderung wirkt sofort auf die Nachfrage.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.9, 0.7, 0.5],
    // Wirtschaftskraft erhöht sofort die Kaufkraft.
  },
  {
    from: 'ctx:bevoelkerungstrend',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.8, 0.9, 0.7],
    // Bevölkerungswachstum treibt die Nachfrage, teils verzögert.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.9, 0.7, 0.4],
    // Zinserhöhung verteuert die Finanzierung sofort.
  },
  {
    from: 'infra_oepnv',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.5, 0.5, 0.5],
    profilQuelle: 'Annahme',
    // Bessere Erschliessung erhöht die Lagequalität. Grösse Setzung, gesenkt
    // von 0.72 (P3-Stand des alten Vektors): summary.md nennt das Angebot als
    // dominanten Hebel; ÖV darf auf Neumieter in P3 nicht stärker wirken als
    // Zonierung, Verdichtung, Ausnützung (Fix-13). Die übrigen Infrastruktur-
    // Kanten sind im selben Verhältnis (≈ 0.7) gesenkt.
  },
  {
    from: 'infra_schule_kita',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.43, 0.43, 0.43],
    profilQuelle: 'Annahme',
    // Schul-Infrastruktur zieht Familien an. Grösse Setzung (siehe ÖV).
  },
  {
    from: 'infra_oeffentlicher_raum',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.45, 0.45, 0.45],
    profilQuelle: 'Annahme',
    // Aufwertung des öffentlichen Raums. Grösse Setzung (siehe ÖV).
  },
  {
    from: 'infra_wirtschaftsansiedlung',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.51, 0.51, 0.51],
    profilQuelle: 'Annahme',
    // Ansiedlung schafft Arbeitsplätze und Nachfrage. Grösse Setzung (siehe ÖV).
  },
  {
    from: 'steuer_eigenmietwert',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.57, 0.57, 0.57],
    profilQuelle: 'Annahme',
    // Eigenmietwert-Besteuerung reduziert die Wohneigentumsnachfrage.
    // CH-010: Industrie-Report, keine Peer-Review-Evidenz.
  },
  {
    from: 'kapital_hypothekarregulierung',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.9, 0.0, 0.0],
    profilQuelle: 'KR-003',
    // GLOBAL-003 (BIS/CGFS): LTV-Verschärfungen senken Transaktionen und
    // kurzfristig die Preise, Verschärfungen wirken schneller als Lockerungen.
    // KR-003: kurzfristig wirksam, nicht auf das langfristige Preisniveau.
    // Darum nur ein P1-Impuls; der Stand klingt über den Übertrag ab
    // (0.9 / 0.72 / 0.58). Ein vollständiges Abklingen bräuchte einen
    // negativen Impuls; GLOBAL-003 nennt langfristige Effekte «variierend»,
    // das reicht dafür nicht.
  },
  {
    from: 'kapital_auslaendische_investoren',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.46, 0.46, 0.46],
    profilQuelle: 'Annahme',
    // Lex Koller: weniger ausländische Käufer, weniger Nachfrage. Grösse Setzung.
  },
  // Fix-12 (2026-11-15) gestrichen:
  // - raumplanung_zonenreserve → nachfragedruck. Der Effekt liegt auf
  //   angebotspotenzial (CH-007); die zweite Kante zählte ihn doppelt und
  //   machte die Zonenreserve zum stärksten Einzelhebel.
  // - gemeinnuetzig_mindestanteil / _foerderfonds / _baurecht →
  //   nachfragedruck (AT-002 «Public Option»). Die preisdämpfende Wirkung
  //   des gemeinnützigen Sektors auf die Marktmiete läuft jetzt über
  //   gemeinnuetzig_kraft → Neumieter-Trend (groups.ts, Fix-11). Der
  //   Förderfonds behält seinen physischen Kanal (angebotspotenzial).
  //   Wahl: der Nachfragekanal war die Doppelzählung, weil AT-002 eine
  //   Preiswirkung über Konkurrenz beschreibt, keine sinkende Nachfrage.

  // ═══════════════════════════════════════════════════════════════════
  // E0 → verdraengungsrisiko
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'mietrecht_kuendigungsschutz',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [0.84, 0.84, 0.84],
    profilQuelle: 'Annahme',
    // GLOBAL-027: weniger Mobilität und Verdrängung der Bestandsmieter.
  },
  {
    from: 'nutzung_abbruchverbot',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [0.76, 0.76, 0.76],
    profilQuelle: 'Annahme',
    // Schutz gegen Verdrängung durch Abbruch.
  },
  {
    from: 'nutzung_umnutzungsverbot',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [0.79, 0.79, 0.79],
    profilQuelle: 'Annahme',
    // Umnutzungsverbote verhindern Verdrängung durch Umwandlung.
  },
  {
    from: 'bau_sanierungspflicht',
    to: 'verdraengungsrisiko',
    sign: +1,
    weights: [0.81, 0.81, 0.81],
    profilQuelle: 'Annahme',
    // Sanierungen führen zu Leerkündigungen.
  },
  {
    from: 'mietrecht_untervermietung',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [0.69, 0.69, 0.69],
    profilQuelle: 'Annahme',
    // Fachlich strittig (Verbesserungsplan Fix-1): Stufe 2 enthält ein
    // Kündigungsrecht des Vermieters. Nicht Teil von Fix-9 bis Fix-13.
  },
  {
    from: 'raumplanung_verdichtung',
    to: 'verdraengungsrisiko',
    sign: +1,
    weights: [0.57, 0.57, 0.57],
    profilQuelle: 'Annahme',
    // CH-008 ETH SPUR: Verdichtung via Ersatzneubau verdrängt vulnerable
    // Bewohnende. Ohne Verlaufsangabe.
  },
  {
    from: 'ctx:zuwanderungsdruck',
    to: 'verdraengungsrisiko',
    sign: +1,
    weights: [1.0, 1.0, 1.0],
    // Zuwanderungsdruck wirkt durchgehend.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'verdraengungsrisiko',
    sign: +1,
    weights: [0.7, 1.0, 0.9],
    // Konjunktur treibt Mietniveaus.
  },
  {
    from: 'nutzung_kurzzeitvermietung',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [0.79, 0.79, 0.79],
    profilQuelle: 'Annahme',
    // US-013 NYC LL18: Inserate −90 % nach der Regulierung, Leerstand und
    // Mieten ohne messbare Änderung (US-013). Weniger Ferienwohnungen →
    // weniger Verdrängung.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → spekulationshemmung
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'steuer_grundstueckgewinn',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.79, 0.79, 0.79],
    profilQuelle: 'Annahme',
    // GLOBAL-005: Grundstückgewinnsteuern dämpfen kurzfristige Spekulation.
    // «Kurzfristig» bezeichnet dort die Art der Spekulation, nicht den Verlauf.
  },
  {
    from: 'steuer_handaenderung',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.79, 0.79, 0.79],
    profilQuelle: 'Annahme',
    // SG-002: Seller's Stamp Duty reduziert kurzfristige Spekulation.
  },
  {
    from: 'steuer_kapitalgewinnprivatpersonen',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.76, 0.76, 0.76],
    profilQuelle: 'Annahme',
    // Kapitalgewinnbesteuerung verteuert spekulative Verkäufe.
  },
  {
    from: 'boden_mehrwertabgabe',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.79, 0.79, 0.79],
    profilQuelle: 'Annahme',
    // Schöpft planungsbedingte Wertsteigerungen ab.
  },
  {
    from: 'boden_bodeneigentumssteuer',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.81, 0.81, 0.81],
    profilQuelle: 'Annahme',
    // GLOBAL-028, DK-001: Bodenwertsteuer reduziert Spekulation.
  },
  {
    from: 'boden_bauverpflichtung',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.83, 0.83, 0.83],
    profilQuelle: 'Annahme',
    // Wirkung nicht belegt (summary.md). Bestehende Kante, Grösse übernommen.
  },
  {
    from: 'nutzung_zweitwohnungen',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.73, 0.73, 0.73],
    profilQuelle: 'Annahme',
    // Beschränkt Spekulation mit Zweitwohnungen.
  },
  {
    from: 'nutzung_kurzzeitvermietung',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.83, 0.83, 0.83],
    profilQuelle: 'Annahme',
    // Unterbindet Kurzzeitvermietung als Renditekanal.
  },
  {
    from: 'steuer_leerstandsabgabe',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.3, 0.9, 0.9],
    profilQuelle: 'CA-001',
    // CA-001: EHT, Leerstand 0.90 % (2017) → 0.49 % (2024). CA-002
    // (provinzielle Speculation and Vacancy Tax, nicht EHT): Hausverkäufe in
    // steuerpflichtigen Regionen zusätzlich −12.5 %. Verlauf CA-001: erste Effekte nach 1–2 Jahren,
    // deutlich nach 3–5. Gleicher P3-Stand wie der alte Vektor [0.7, 0.8, 0.9].
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → marktfriktion
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'steuer_grundstueckgewinn',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.69, 0.69, 0.69],
    profilQuelle: 'Annahme',
    // Transaktionssteuern erzeugen Reibung (GLOBAL-016: Handänderungssteuern
    // senken die Mobilität).
  },
  {
    from: 'steuer_handaenderung',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.69, 0.69, 0.69],
    profilQuelle: 'Annahme',
    // GLOBAL-016 (Hilber): Handänderungssteuern senken die Mobilität.
  },
  {
    from: 'steuer_kapitalgewinnprivatpersonen',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.67, 0.67, 0.67],
    profilQuelle: 'Annahme',
    // Lock-in: Verkäufe werden aufgeschoben.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'marktfriktion',
    sign: +1,
    weights: [1.0, 1.0, 0.9],
    // Zinsniveau als strukturelle Determinante.
  },
  {
    from: 'mietrecht_kostenmiete',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.79, 0.79, 0.79],
    profilQuelle: 'Annahme',
    // Genf: in stark regulierten Märkten sinkt die Marktrotation,
    // Bestandsmieter bleiben im Mittel 13.7 Jahre gegenüber rund 8.5 Jahren
    // im CH-Schnitt (Wüest Partner 2024, zitiert in DIW Discussion Paper
    // 2143; CH-005). Abstand Markt- zu Bestandsmiete: Genf rund 33 %,
    // Agglomeration Zürich rund 9 % (Sotomo 2025, S. 27: 268 gegen
    // 245 CHF/m²·a). CH-004: Mietrecht als Mobilitätsbremse.
  },
  {
    from: 'mietrecht_kuendigungsschutz',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.69, 0.69, 0.69],
    profilQuelle: 'Annahme',
    // CH-004, GLOBAL-027: weniger Fluktuation, stay-put-Effekt.
  },
  {
    from: 'mietrecht_mietzinstransparenz',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.41, 0.41, 0.41],
    profilQuelle: 'Annahme',
    // Fachlich strittig (Verbesserungsplan Fix-1): mehr Information senkt
    // gewöhnlich Friktion; CH-003 behandelt die Anfangsmiete, nicht die
    // Offenlegung. Nicht Teil von Fix-9 bis Fix-13.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → mietpreis_schutzlevel
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'mietrecht_kostenmiete',
    to: 'mietpreis_schutzlevel',
    sign: +1,
    weights: [1.0, 0.2, 0.2],
    profilQuelle: 'DE-004',
    // Verlauf DE-004 (Berliner Mietendeckel): regulierte Mieten sinken
    // mechanisch mit Inkrafttreten. Sprung und Halten: voller Stand in P1,
    // danach ersetzt 0.2 = 1 − PERSISTENCE den Übertragsverlust, der Stand
    // bleibt bei 1.0. GLOBAL-027: Mieten im regulierten Sektor sinken.
  },
  {
    from: 'mietrecht_anfangsmiete',
    to: 'mietpreis_schutzlevel',
    sign: +1,
    weights: [0.18, 0.26, 0.18],
    profilQuelle: 'FR-003',
    // Verlauf FR-003 (Paris): −2.5 % im ersten Jahr, −5.9 % im vierten,
    // −8.2 % im fünften; der Stand wächst. Der Vektor ergibt 0.18 / 0.40 /
    // 0.50, also 36 % / 80 % / 100 % des P3-Standes.
    // Grösse: CH-003 findet für die Anfechtung der Anfangsmiete in der Schweiz
    // keinen messbaren Effekt auf die Neuvertragsmieten. Darum klein
    // (Setzung); Paris ist ein Deckel, keine Anfechtung.
  },
  {
    from: 'mietrecht_mietzinstransparenz',
    to: 'mietpreis_schutzlevel',
    sign: +1,
    weights: [0.15, 0.15, 0.15],
    profilQuelle: 'Annahme',
    // DE-006: Mietspiegel mit begrenzter, nachweisbarer Wirkung. summary.md:
    // Evidenz schwach (0.5 gegenüber 0.8 für die Anfangsmiete). Grösse
    // Setzung, gesenkt von 0.69, damit die Offenlegung nicht stärker schützt
    // als die Anfechtung der Anfangsmiete.
  },
  {
    from: 'mietrecht_kuendigungsschutz',
    to: 'mietpreis_schutzlevel',
    sign: +1,
    weights: [0.6, 0.6, 0.6],
    profilQuelle: 'Annahme',
    // Fix-11 (2026-11-15). summary.md: Kündigungsschutz → Schutzlevel +1,
    // «robust». GLOBAL-027: Konsens, Mieten im regulierten Sektor sinken.
    // Grösse Setzung: mindestens so gross, dass der Schutz der Bestandsmieter
    // den Angebotsverlust aus GLOBAL-029 überwiegt (Rangfolge GLOBAL-027).
  },
  // mietrecht_mietzinsindex → mietpreis_schutzlevel entfernt (CH-012). Der
  // Erhöhungsspielraum lebt in mietrecht-regime.ts. Seit Fix-9 gibt es keinen
  // Nenner pro Knoten mehr, der dadurch veraltet wäre.

  // ═══════════════════════════════════════════════════════════════════
  // E0 → gemeinnuetzig_kraft
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'gemeinnuetzig_mindestanteil',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.97, 0.97, 0.97],
    profilQuelle: 'Annahme',
    // AT-002: Sektorgrösse entscheidet über die Wirkung.
  },
  {
    from: 'gemeinnuetzig_foerderfonds',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.8, 0.8, 0.8],
    profilQuelle: 'Annahme',
    // Kapital für gemeinnützige Träger.
  },
  {
    from: 'gemeinnuetzig_baurecht',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.93, 0.93, 0.93],
    profilQuelle: 'Annahme',
    // Land im Baurecht für gemeinnützige Träger.
  },
  {
    from: 'boden_vorkaufsrecht',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.81, 0.81, 0.81],
    profilQuelle: 'Annahme',
    // Wirkung nicht belegt (summary.md). Bestehende Kante, Grösse übernommen;
    // keine Kante zum Angebot (Fix-11: keine Kante erfinden).
  },
  {
    from: 'gemeinnuetzig_belegungsvorschriften',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.76, 0.76, 0.76],
    profilQuelle: 'Annahme',
    // Direkte Steuerung der Belegung.
  },
  {
    from: 'gemeinnuetzig_sozialmischung',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.77, 0.77, 0.77],
    profilQuelle: 'Annahme',
    // Verbindliche Sozialmischung.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → eigentumsquoten_trend
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'steuer_eigenmietwert',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [0.79, 0.79, 0.79],
    profilQuelle: 'Annahme',
    // Steuerliche Belastung des Wohneigentums.
  },
  {
    from: 'kapital_hypothekarregulierung',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [0.89, 0.89, 0.89],
    profilQuelle: 'Annahme',
    // Kreditbeschränkung erschwert den Zugang zu Eigentum, solange sie gilt.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [1.0, 1.0, 0.9],
    // Zinsen bestimmen die Kaufkraft.
  },
  {
    from: 'mietrecht_kostenmiete',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [0.77, 0.77, 0.77],
    profilQuelle: 'Annahme',
    // Kostenmieten machen Mieten gegenüber Kaufen attraktiver.
  },
  {
    from: 'ctx:zuwanderungsdruck',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [1.0, 1.0, 1.0],
    // Zuwanderung erhöht die Mietnachfrage.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'eigentumsquoten_trend',
    sign: +1,
    weights: [0.7, 0.9, 1.0],
    // Wohlstand stärkt die Kaufkraft.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → aufwertungsdruck
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'infra_oepnv',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.86, 0.86, 0.86],
    profilQuelle: 'Annahme',
    // UK-001 Crossrail: Erschliessung wird in Bodenwerte kapitalisiert.
  },
  {
    from: 'infra_wirtschaftsansiedlung',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.89, 0.89, 0.89],
    profilQuelle: 'Annahme',
    // Ansiedlung zieht kaufkräftige Haushalte an.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.8, 0.9, 1.0],
    // Konjunktur treibt Aufwertung.
  },
  {
    from: 'raumplanung_verdichtung',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.9, 0.18, 0.18],
    profilQuelle: 'US-010',
    // US-010 Minneapolis 2040: Optionswert-Effekt, Property Values +3–5 % im
    // Umkreis schon kurzfristig. Sprung und Halten (0.18 = 0.2 · 0.9).
  },
  {
    from: 'raumplanung_ausnuetzungsziffer',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.9, 0.18, 0.18],
    profilQuelle: 'US-008',
    // US-008 Chicago TOD: Verkaufspreise +15–23 % auf den upgezonten
    // Parzellen, bevor das Angebot steigt. Sprung und Halten.
  },
  {
    from: 'boden_bodeneigentumssteuer',
    to: 'aufwertungsdruck',
    sign: -1,
    weights: [0.71, 0.71, 0.71],
    profilQuelle: 'Annahme',
    // DK-001: Bodensteuer wird in tiefere Bodenpreise kapitalisiert.
  },
  {
    from: 'gemeinnuetzig_mindestanteil',
    to: 'aufwertungsdruck',
    sign: -1,
    weights: [0.69, 0.69, 0.69],
    profilQuelle: 'Annahme',
    // Gemeinnütziger Anteil bremst Aufwertung.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → investitionsattraktivitaet
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'mietrecht_kostenmiete',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.86, 0.86, 0.86],
    profilQuelle: 'Annahme',
    // Kostenmiete begrenzt die Rendite.
  },
  {
    from: 'kapital_institutionelle_regulierung',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.87, 0.87, 0.87],
    profilQuelle: 'Annahme',
    // Regulierung institutioneller Anleger.
  },
  {
    from: 'steuer_grundstueckgewinn',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.69, 0.69, 0.69],
    profilQuelle: 'Annahme',
    // Verteuert den Ausstieg.
  },
  {
    from: 'boden_mehrwertabgabe',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.76, 0.76, 0.76],
    profilQuelle: 'Annahme',
    // Schmälert die Rendite bei Einzonung oder Aufzonung.
  },
  {
    from: 'kapital_auslaendische_investoren',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.87, 0.87, 0.87],
    profilQuelle: 'Annahme',
    // Kleinerer Käuferpool.
  },
  {
    from: 'steuer_handaenderung',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.66, 0.66, 0.66],
    profilQuelle: 'Annahme',
    // Transaktionshürde.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'investitionsattraktivitaet',
    sign: +1,
    weights: [0.9, 1.0, 1.0],
    // Wirtschaftskraft zieht Investoren an.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [1.0, 1.0, 0.9],
    // Zinsniveau bestimmt die Renditeerwartung.
  },
  {
    from: 'nutzung_kurzzeitvermietung',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.69, 0.69, 0.69],
    profilQuelle: 'Annahme',
    // Barcelona: Airbnb-Aktivität erhöhte die Mieten um 1.9 % und die
    // Transaktionspreise um 4.6 % (Garcia-López et al. 2020, ES-001).
    // Effekt der Aktivität, nicht der Regulierung. Regulierung nimmt
    // diesen Renditekanal weg.
  },
  {
    from: 'nutzung_abbruchverbot',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.69, 0.69, 0.69],
    profilQuelle: 'Annahme',
    // DIW Discussion Paper 2143 (Ters/Kholodilin; Genf 1994–2022):
    // Rationierungsschocks → institutionelle Neubauinvestitionen −400 Mio. CHF.
  },
  {
    from: 'nutzung_umnutzungsverbot',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.59, 0.59, 0.59],
    profilQuelle: 'Annahme',
    // Verhindert Redevelopment; seltener als Ersatzneubau.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → angebotspotenzial_regulation
  // Elastizität des Angebots (Steigung der Angebotskurve). Starke
  // Regulierung → unelastisch: Preise reagieren stark, Menge wenig.
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'mietrecht_kostenmiete',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.89, 0.89, 0.89],
    profilQuelle: 'Annahme',
    // Preissignale werden für Anleger irrelevant → unelastisch.
  },
  {
    from: 'mietrecht_kuendigungsschutz',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.73, 0.73, 0.73],
    profilQuelle: 'Annahme',
    // Weniger Exit-Optionen → Investoren reagieren weniger auf Preise.
  },
  {
    from: 'bau_bewilligungsverfahren',
    to: 'angebotspotenzial_regulation',
    sign: -1,
    weights: [0.62, 0.62, 0.62],
    profilQuelle: 'Annahme',
    // Skala: höher = schnelleres Verfahren → Angebot reagiert rascher →
    // elastischer (Knoten sinkt). Vorzeichen war bis 2026-11 +1.
  },
  {
    from: 'bau_einspracherecht_suspensiv',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.61, 0.61, 0.61],
    profilQuelle: 'Annahme',
    // Veto-Recht schafft Unsicherheit.
  },
  {
    from: 'nutzung_abbruchverbot',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.71, 0.71, 0.71],
    profilQuelle: 'Annahme',
    // Rationierung blockiert den physischen Reaktionskanal (Basel-Angaben
    // siehe nutzung_abbruchverbot → angebotspotenzial).
  },
  {
    from: 'ctx:zinsniveau',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.8, 0.6, 0.4],
    // Teure Finanzierung → auch bei hohen Preisen kein Angebot.
  },
  {
    from: 'ctx:marktenge',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.7, 0.6, 0.5],
    // Enger Markt hat weniger Ausweichoptionen.
    // Bewusste Koexistenz mit `marketModulator` (compute-phases.ts):
    // marktenge wirkt dort global als Reaktions-Verstärker, hier lokal als
    // Elastizitäts-Treiber der Angebotskurve.
  },

];
