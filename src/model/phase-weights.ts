/**
 * Phase-Weighted DAG Edges — Phase 2 Research Results
 * =====================================================
 * Replaces the old single-weight + time-class schema with three phase weights.
 *
 * Phase 1: 0–2 years (short-term)
 * Phase 2: 2–5 years (medium-term)
 * Phase 3: 5–10 years (long-term)
 *
 * Weight: 0.0 = no effect, 1.0 = full effect in this phase.
 * sign:  +1 = increases target,  -1 = decreases target
 *
 * Research sources:
 *   - RESULT-agent1-weights.md   (27 edges: angebotspotenzial + nachfragedruck)
 *   - RESULT-agent2-weights.md   (46 edges: verdrängungsrisiko, spekulationshemmung,
 *                                 markfriktion, mietpreis_schutzlevel, gemeinnuetzig_kraft,
 *                                 eigentumsquoten_trend, aufwertungsdruck, investitionsattraktivitaet)
 *   - RESULT-agent3-e1e2-weights.md (9 edges: E1→E2)
 *
 * Research principles:
 *   - Uncertainty → tend toward 0.0 rather than 0.5
 *   - Lower values preferred when unsure
 *   - Phases: P1=immediate, P2=cumulative, P3=long-run equilibrium
 */

export const PHASE_WEIGHTED_EDGES: readonly {
  from: string;
  to: string;
  sign: 1 | -1;
  weights: readonly [number, number, number];
}[] = [

  // ═══════════════════════════════════════════════════════════════════
  // E0 → angebotspotenzial (16 edges)
  // Research: RESULT-agent1-weights.md
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'raumplanung_zonenreserve',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.8, 0.5, 0.3],
    // Sofortige Wirkung durch Land-Entzug; langfristig relativ konstant
    // (Gegenargument: Reserve wird nie mobilisiert → P3 tiefer)
  },
  {
    from: 'raumplanung_verdichtung',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.0, 0.6, 1.0],
    // Verdichtung braucht Planungs- und Bauphase; erst nach 5+ Jahren voll wirksam
  },
  {
    from: 'raumplanung_ausnuetzungsziffer',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.2, 0.7, 1.0],
    // Ausnützungsziffer-Erhöhung benötigt Zeit bis Baugesuch; langfristig voll effektiv
  },
  {
    from: 'boden_bauverpflichtung',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.1, 0.5, 0.8],
    // Verpflichtung braucht Enforcement-Jahre; langfristig starker Effekt durch erzwungene Projekte
  },
  {
    from: 'bau_energievorgaben',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.2, 0.6, 0.4],
    // Erhöhte Baukosten hemmen Angebot nach 2-3 Jahren;
    // langfristig durch Technologie-Rückgang teilweise kompensiert
  },
  {
    from: 'bau_sanierungspflicht',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.9, 0.6, 0.3],
    // Kapital wird SOFORT umgelenkt (Renovation vs. Neubau); langfristig weniger relevant
  },
  {
    from: 'bau_einspracherecht_dritte',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.5, 0.7, 0.4],
    // Verzögerung sofort spürbar; mittelfristig grösstes Hemmnis; langfristig Projekte angepasst
  },
  {
    from: 'bau_einspracherecht_suspensiv',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.7, 0.9, 0.5],
    // Veto-Recht stark verzögernd (Projekt-Stopp möglich); mittelfristig intensivste Hemmnis
  },
  {
    from: 'bau_bewilligungsverfahren',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.4, 0.6, 0.3],
    // Vereinfachung zeigt kurzfristig begrenzte Wirkung; mittelfristig stärker
  },
  {
    from: 'bau_normenharmonisierung',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.0, 0.5, 0.8],
    // Harmonisierung braucht Umsetzungszeit; langfristig substantielle Erleichterung
  },
  {
    from: 'gemeinnuetzig_mindestanteil',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.4, 0.6, 0.5],
    // Kontingentierung reduziert privates Angebot sofort; bleibt konstant
  },
  {
    from: 'gemeinnuetzig_foerderfonds',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.1, 0.5, 0.8],
    // Förderfonds braucht Aufbauphase; langfristig substantielle Angebotssteigerung
  },
  {
    from: 'nutzung_abbruchverbot',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.5, 0.7, 0.6],
    // Verbot bindet Bestand; kurzfristig Angebotserhalt, mittelfristig leicht positive Wirkung
  },
  {
    from: 'nutzung_umnutzungsverbot',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.4, 0.7, 0.6],
    // Verbot schützt Wohnraum; mittelfristig stabilisierende Wirkung
  },
  {
    from: 'ctx:zinsniveau',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [1.0, 0.8, 0.5],
    // Zinserhöhung sofortiger Effekt auf Rentabilität; langfristig Anpassung an neue Realität
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.8, 0.6, 0.4],
    // Wirtschaftskraft ermöglicht sofortige Investitionen; langfristig abnehmende Grenzrerträge
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → nachfragedruck (11 edges)
  // Research: RESULT-agent1-weights.md
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'ctx:zuwanderungsdruck',
    to: 'nachfragedruck',
    sign: +1,
    weights: [1.0, 0.8, 0.6],
    // Zuwanderung wirkt SOFORT auf Nachfrage; langfristig Dämpfung durch Marktanspannung
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.9, 0.7, 0.5],
    // Wirtschaftskraft erhöht sofort Kaufkraft; langfristig Sättigungseffekte
  },
  {
    from: 'ctx:bevoelkerungstrend',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.8, 0.9, 0.7],
    // Bevölkerungswachstum treibt Nachfrage mit Verzögerung (Familiengründung etc.)
  },
  {
    from: 'ctx:zinsniveau',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.9, 0.7, 0.4],
    // Zinserhöhung verteuert Finanzierung sofort; langfristig Anpassung des Konsumentenverhaltens
  },
  {
    from: 'infra_oepnv',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.3, 0.7, 1.0],
    // OEPNV-Ausbau zeigt langfristig volle Wirksamkeit auf Lagequalität; kurzfristig kaum Effekt
  },
  {
    from: 'infra_schule_kita',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.2, 0.6, 0.9],
    // Schul-Infrastruktur wird erst bei Familien relevant; stark verzögerter Effekt
  },
  {
    from: 'infra_oeffentlicher_raum',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.4, 0.8, 0.7],
    // Aufwertung des öffentlichen Raums wirkt mittelfristig am stärksten
  },
  {
    from: 'infra_wirtschaftsansiedlung',
    to: 'nachfragedruck',
    sign: +1,
    weights: [0.6, 0.9, 0.7],
    // Ansiedlungseffekt auf Nachfrage zeigt sich mit Verzögerung
  },
  {
    from: 'steuer_eigenmietwert',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.8, 0.6, 0.4],
    // Eigenmietwert-Besteuerung reduziert Wohneigentumsnachfrage sofort; langfristig Anpassung
  },
  {
    from: 'kapital_hypothekarregulierung',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.9, 0.6, 0.3],
    // Regulierung dämpft Nachfrage unmittelbar; langfristig finden Akteure Alternativen
  },
  {
    from: 'kapital_auslaendische_investoren',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.8, 0.5, 0.2],
    // Restriktion ausländischer Käufer reduziert Nachfrage sofort; Markt kompensiert langfristig
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → verdrängungsrisiko (7 edges)
  // Research: RESULT-agent2-weights.md
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'mietrecht_kuendigungsschutz',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [1.0, 0.9, 0.7],
    // Sofortiger Schutz; mittelfristig finden Vermieter Umgehungsmöglichkeiten.
  },
  {
    from: 'nutzung_abbruchverbot',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [0.8, 0.8, 0.7],
    // Sofortiger Schutz gegen Abbruch-Verdrängung;
    // langfristig weichen Marktteilnehmer auf andere Kanäle aus.
  },
  {
    from: 'nutzung_umnutzungsverbot',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [0.9, 0.8, 0.7],
    // Umnutzungsverbote greifen sofort; bei langfristig hoher Profitabilität
    // weicht man auf Luxussanierung aus.
  },
  {
    from: 'bau_sanierungspflicht',
    to: 'verdraengungsrisiko',
    sign: +1,
    weights: [0.7, 0.9, 0.8],
    // Sanierungspflicht verdrängt kurzfristig durch Baulärm/Leerstand;
    // mittelfristig vollständiger Effekt.
  },
  {
    from: 'mietrecht_untervermietung',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [0.8, 0.7, 0.6],
    // Untermietverbote reduzieren kurzfristig eine Verdrängungsstrategie;
    // Vermieter weichen mittelfristig aus.
  },
  {
    from: 'ctx:zuwanderungsdruck',
    to: 'verdraengungsrisiko',
    sign: +1,
    weights: [1.0, 1.0, 1.0],
    // Zuwanderungsdruck wirkt durchgehend stark – keine zeitliche Abschwächung.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'verdraengungsrisiko',
    sign: +1,
    weights: [0.7, 1.0, 0.9],
    // Kurzfristig moderat; mittelfristig voller Effekt wenn Konjunktur Mietniveaus antreibt.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → spekulationshemmung (8 edges)
  // Research: RESULT-agent2-weights.md
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'steuer_grundstueckgewinn',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.9, 0.8, 0.7],
    // Sofortige Transaktionskosten-Erhöhung; langfristig passen sich Spekulanten an.
  },
  {
    from: 'steuer_handaenderung',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.9, 0.8, 0.7],
    // Gleichartiger Effekt wie Grundstückgewinnsteuer.
  },
  {
    from: 'steuer_kapitalgewinnprivatpersonen',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.8, 0.8, 0.7],
    // Kapgewinnbesteuerung verteuert kurzfristig;
    // langfristig bleiben Anreize durch Hebelwirkung.
  },
  {
    from: 'boden_mehrwertabgabe',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.9, 0.8, 0.7],
    // Trifft Spekulanten direkt bei Wertsteigerungen;
    // über Zeit leicht abnehmend da Alternativstrategien existieren.
  },
  {
    from: 'boden_bodeneigentumssteuer',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.7, 0.8, 0.9],
    // Laufende Steuer auf Bodeneigentum – je länger gehalten, desto teurer;
    // Effekt wächst über Zeit.
  },
  {
    from: 'boden_bauverpflichtung',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.8, 0.9, 0.8],
    // Sofortiger Entwicklungsdruck;
    // mittelfristig vollständiger wenn Grundstückseigner handeln müssen.
  },
  {
    from: 'nutzung_zweitwohnungen',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.7, 0.8, 0.7],
    // Beschränkt Spekulation mit Zweitwohnungen;
    // mittelfristig am stärksten wenn Markt sich anpasst.
  },
  {
    from: 'nutzung_kurzzeitvermietung',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.8, 0.9, 0.8],
    // Unterbindet Kurzzeit-Vermietung als Spekulationskanal;
    // mittelfristig stärkster Effekt wenn Vollzug greift.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → markfriktion (4 edges)
  // Research: RESULT-agent2-weights.md
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'steuer_grundstueckgewinn',
    to: 'markfriktion',
    sign: +1,
    weights: [0.8, 0.7, 0.6],
    // Transaktionssteuern erzeugen sofort Reibung;
    // Märkte finden mittelfristig Workarounds.
  },
  {
    from: 'steuer_handaenderung',
    to: 'markfriktion',
    sign: +1,
    weights: [0.8, 0.7, 0.6],
    // Identischer Effekt wie Grundstückgewinnsteuer.
  },
  {
    from: 'steuer_kapitalgewinnprivatpersonen',
    to: 'markfriktion',
    sign: +1,
    weights: [0.6, 0.7, 0.7],
    // Kapgewinnsteuer moderater Effekt;
    // leicht zunehmend da sie Verkaufsentscheide stärker beeinflusst.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'markfriktion',
    sign: +1,
    weights: [1.0, 1.0, 0.9],
    // Zinsniveau ist fundamentaler Markttreiber;
    // kaum abschwächend über Zeit da strukturelle Determinante.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → mietpreis_schutzlevel (4 edges)
  // Research: RESULT-agent2-weights.md (spekulationshemmung group logic applied)
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'mietrecht_kostenmiete',
    to: 'mietpreis_schutzlevel',
    sign: +1,
    weights: [1.0, 0.9, 0.8],
    // Kostenmieten-System sofort wirksam; mittelfristig leicht abnehmend
    // durch Marktumgehung bei profitabren Neubauten.
  },
  {
    from: 'mietrecht_anfangsmiete',
    to: 'mietpreis_schutzlevel',
    sign: +1,
    weights: [1.0, 0.8, 0.7],
    // Regulierung der Erstmieten greift sofort;
    // langfristig passen sich Vermieter via Umgehungsmodelle an.
  },
  {
    from: 'mietrecht_mietzinstransparenz',
    to: 'mietpreis_schutzlevel',
    sign: +1,
    weights: [0.8, 0.7, 0.6],
    // Transparenz schafft kurzfristige Hemmschwelle für Mietzinserhöhungen;
    // langfristig etablieren sich Markenpraktiken als Umgehung.
  },
  {
    from: 'mietrecht_mietzinsindex',
    to: 'mietpreis_schutzlevel',
    sign: +1,
    weights: [1.0, 0.9, 0.9],
    // Mietzinsindex bindet automatisch an Inflation; sofort und dauerhaft wirksam.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → gemeinnuetzig_kraft (6 edges)
  // Research: RESULT-agent2-weights.md
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'gemeinnuetzig_mindestanteil',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.9, 1.0, 1.0],
    // Politik greift sofort; mittelfristig voll wenn Bestand wächst.
  },
  {
    from: 'gemeinnuetzig_foerderfonds',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.5, 0.8, 1.0],
    // Kapital braucht Aufbauphase; Effekt wächst über Zeit bis volle Förderkraft erreicht.
  },
  {
    from: 'gemeinnuetzig_baurecht',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.9, 1.0, 0.9],
    // Baurechte werden sofort zugeteilt;
    // langfristig weniger neu wenn Bestand gesättigt.
  },
  {
    from: 'boden_vorkaufsrecht',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.7, 0.9, 0.8],
    // Recht besteht sofort, nutzt aber nur bei Marktchancen;
    // mittelfristig stärkster Effekt.
  },
  {
    from: 'gemeinnuetzig_belegungsvorschriften',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.8, 0.8, 0.7],
    // Direkte Steuerung sofort; langfristig etwas erodierend wenn Durchsetzung nachlässt.
  },
  {
    from: 'gemeinnuetzig_sozialmischung',
    to: 'gemeinnuetzig_kraft',
    sign: +1,
    weights: [0.7, 0.8, 0.8],
    // Sozialmischung braucht Umsetzungszeit;
    // Effekt mittel- bis langfristig am stärksten.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → eigentumsquoten_trend (6 edges)
  // Research: RESULT-agent2-weights.md
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'steuer_eigenmietwert',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [0.9, 0.8, 0.7],
    // Unmittelbare steuerliche Belastung des Wohneigentums;
    // langfristig weicht man auf Kapitalanlagen aus.
  },
  {
    from: 'kapital_hypothekarregulierung',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [1.0, 0.9, 0.8],
    // Regulatorische Kreditbeschränkung sofort spürbar;
    // Märkte finden mittelfristig Umgehung.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [1.0, 1.0, 0.9],
    // Zinsen fundamental für Kaufkraft; dauerhafter Effekt als strukturelle Determinante.
  },
  {
    from: 'mietrecht_kostenmiete',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [0.7, 0.8, 0.8],
    // Kostenmieten machen Mietwohnungen attraktiver vs. Kaufen; mittelfristig stabil.
  },
  {
    from: 'ctx:zuwanderungsdruck',
    to: 'eigentumsquoten_trend',
    sign: -1,
    weights: [1.0, 1.0, 1.0],
    // Zuwanderung erhöht Mietnachfrage dauerhaft; Kaufquote sinkt unter Druck.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'eigentumsquoten_trend',
    sign: +1,
    weights: [0.7, 0.9, 1.0],
    // Wohlstand stärkt Kaufkraft erst mittelfristig;
    // langfristig voll wenn Einkommen steigen.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → aufwertungsdruck (7 edges)
  // Research: RESULT-agent2-weights.md
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'infra_oepnv',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.6, 0.9, 1.0],
    // OEV-Ausbau braucht Zeit bis Aufwertung eintritt; Effekt wächst über Zeit.
  },
  {
    from: 'infra_wirtschaftsansiedlung',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.7, 0.9, 1.0],
    // Ansiedlung zeigt erst mittelfristig Effekt wenn Arbeitsplätze entstehen.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.8, 0.9, 1.0],
    // Konjunktur treibt Aufwertung;
    // langfristig stärkster Effekt wenn Boom nachhaltig.
  },
  {
    from: 'raumplanung_verdichtung',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.8, 0.9, 1.0],
    // Verdichtung verändert Quartiercharakter sofort in Antragstellung;
    // Effekt wächst mit Fertigstellungen.
  },
  {
    from: 'raumplanung_ausnuetzungsziffer',
    to: 'aufwertungsdruck',
    sign: +1,
    weights: [0.9, 0.9, 0.8],
    // Höhere Ausnützung sofort in Bodenpreisen eingepreist;
    // langfristig weniger Zusatz Effekt wenn Marktnähe erreicht.
  },
  {
    from: 'boden_bodeneigentumssteuer',
    to: 'aufwertungsdruck',
    sign: -1,
    weights: [0.6, 0.7, 0.8],
    // Bodensteuer verteuert Halten;
    // Effekt nimmt zu je länger spekulativ vorgehalten wird.
  },
  {
    from: 'gemeinnuetzig_mindestanteil',
    to: 'aufwertungsdruck',
    sign: -1,
    weights: [0.8, 0.7, 0.6],
    // Gemeinnütziger Anteil bremst Aufwertung;
    // langfristig weniger wirksam wenn Markt sich anpasst.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → investitionsattraktivitaet (8 edges)
  // Research: RESULT-agent2-weights.md
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'mietrecht_kostenmiete',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.9, 0.9, 0.8],
    // Kostenmietregulierung begrenzt Rendite sofort;
    // Markt passt sich teilweise an.
  },
  {
    from: 'kapital_institutionelle_regulierung',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.8, 0.9, 0.9],
    // Regulierung institutioneller Investoren sofort;
    // dauerhaft restriktiv wenn Durchsetzung hoch.
  },
  {
    from: 'steuer_grundstueckgewinn',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.8, 0.7, 0.6],
    // Transaktionssteuer verteuert Ein-/Ausstieg;
    // Markt findet mittelfristig Workarounds.
  },
  {
    from: 'boden_mehrwertabgabe',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.8, 0.8, 0.7],
    // Mehrwertabgabe schmälert Rendite bei Veräusserung;
    // nachhaltig aber mit Anpassungseffekten.
  },
  {
    from: 'kapital_auslaendische_investoren',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.8, 0.9, 0.9],
    // Ausländerbeschränkungen reduzieren Käuferpool sofort;
    // nachhaltig da politikbeständig.
  },
  {
    from: 'steuer_handaenderung',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.7, 0.7, 0.6],
    // Handaänderungssteuer moderate Transaktionshürde;
    // langfristig weniger relevant da einmalig.
  },
  {
    from: 'ctx:wirtschaftskraft',
    to: 'investitionsattraktivitaet',
    sign: +1,
    weights: [0.9, 1.0, 1.0],
    // Wirtschaftskraft treibt Miet- und Kaufpreise;
    // anhaltend starker Magnet für Investoren.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [1.0, 1.0, 0.9],
    // Zinsniveau fundamental für Renditeerwartungen;
    // sofortiger und nachhaltiger Effekt.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E1 → E2 edges (9 edges)
  // Research: RESULT-agent3-e1e2-weights.md
  // Kern-Logik: E1-Werte sind kumulierte Markt-Zustände.
  // Rückkopplungs-Dämpfung: Steigendes E2 löst in P2/P3 Gegenkräfte aus,
  // die das Verdrängungsrisiko relativ dämpfen.
  // ═══════════════════════════════════════════════════════════════════

  // ── gentrifizierungsindex ─────────────────────────────────────────────

  {
    from: 'aufwertungsdruck',
    to: 'gentrifizierungsindex',
    sign: +1,
    weights: [1.0, 1.0, 1.0],
    // Direkter Alias — E1 akkumuliert, E2 bildet sofort ab:
    // aufwertungsdruck ist ein kumulierter Markt-Zustand; keine额外 Verzögerung.
  },
  {
    from: 'mietpreis_schutzlevel',
    to: 'gentrifizierungsindex',
    sign: -1,
    weights: [0.3, 0.7, 1.0],
    // Mieterpolitischer Schutz wirkt als Bremse gegen Gentrifizierung,
    // aber mit systembedingter Verzögerung.
    // Phase 1: Schutzniveau frisch gesetzt, Markt hat sich noch nicht voll angepasst.
    // Phase 3: Schutzwirkung vollständig im Mietmarkt integriert.
  },
  {
    from: 'verdraengungsrisiko',
    to: 'gentrifizierungsindex',
    sign: +1,
    weights: [1.0, 0.9, 0.7],
    // Direkter Alias in P1.
    // Rückkopplungs-Dämpfung in P2/P3:
    // Steigender Gentrifizierungsindex mobilisiert politische Gegenreaktion,
    // Non-Profit-Aktivität — dämpft Verdrängungsrisiko relativ zum Index.
  },
  {
    from: 'gemeinnuetzig_kraft',
    to: 'gentrifizierungsindex',
    sign: -1,
    weights: [0.2, 0.6, 1.0],
    // Non-Profit Akteure wirken gentrifizierungs-hemmend, aber mit erheblichem time-lag.
    // Projekte brauchen Planung, Finanzierung, Bauzeit.
    // Phase 1: nur erste Planungssignale wirksam.
    // Phase 3: substanzielle Non-Profit-Bestände entstanden — volle Dämpfung.
  },

  // ── neubau_hemmnisindex ───────────────────────────────────────────────

  {
    from: 'angebotspotenzial',
    to: 'neubau_hemmnisindex',
    sign: -1,
    weights: [1.0, 1.0, 1.0],
    // Direkte Invertierung — keine zeitliche Dynamik.
    // Hohes Angebots-potenzial = tiefer Hemmnis-Index.
    // E1 akkumuliert, E2 bildet sofort ab.
  },

  // ── verdraengungsrisiko_index ───────────────────────────────────────────

  {
    from: 'verdraengungsrisiko',
    to: 'verdraengungsrisiko_index',
    sign: +1,
    weights: [1.0, 0.9, 0.7],
    // Direkter Alias in P1; Rückkopplungs-Dämpfung in P2/P3:
    // Steigendes Verdrängungsrisiko triggert Gegenreaktionen
    // (politische Massnahmen, Non-Profit-Aktivität, Migrationsbewegungen),
    // die das Risiko relativ zum Index dämpfen.
  },

  // ── fiskalische_wirkung ────────────────────────────────────────────────

  {
    from: 'spekulationshemmung',
    to: 'fiskalische_wirkung',
    sign: +1,
    weights: [0.3, 0.6, 1.0],
    // Spekulationshemmung reduziert Transaktions-basierte Steuereinnahmen kurzfristig,
    // aber die gesamte fiskalische Wirkung (stabilere Einnahmen, tiefere Sozialkosten,
    // höhere Planungssicherheit) braucht Jahre um sich vollständig zu entfalten.
    // Phase 1: nur unmittelbarer Rückgang der Handelsaktivität spürbar.
    // Phase 3: volle positive Bilanz.
  },
  {
    from: 'markfriktion',
    to: 'fiskalische_wirkung',
    sign: -1,
    weights: [0.4, 0.7, 1.0],
    // Weniger Markt-Friktion = effizienterer Immobilienmarkt
    // = höheres Transaktionsvolumen = mehr fiskalische Einnahmen.
    // Markt-Friktion hat systembedingte Anpassungsverzögerung.
  },
  {
    from: 'gemeinnuetzig_kraft',
    to: 'fiskalische_wirkung',
    sign: +1,
    weights: [0.5, 0.8, 1.0],
    // Non-Profit-Projekte generieren fiskalische Wirkung primär durch
    // Baubeginn und Betrieb (MwSt., Handwerkeraufträge, Arbeitsplätze).
    // Kürzerer Lag als bei Gentrifizierung-Dämpfung, aber immer noch verzögert.
  },

] as const;
