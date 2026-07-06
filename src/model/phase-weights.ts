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
 * Diese Datei enthält ausschliesslich E0/ctx → E1 Kanten.
 * E1 → E2 wird in `derived.ts` berechnet (dortige Koeffizienten sind die
 * Source of Truth; `dag-topology.ts` projiziert sie für die Visualisierung).
 *
 * Research sources:
 *   - RESULT-agent1-weights.md   (27 edges: angebotspotenzial + nachfragedruck)
 *   - RESULT-agent2-weights.md   (46 edges: verdrängungsrisiko, spekulationshemmung,
 *                                 marktfriktion, mietpreis_schutzlevel, gemeinnuetzig_kraft,
 *                                 eigentumsquoten_trend, aufwertungsdruck, investitionsattraktivitaet)
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
  // E0 → angebotspotenzial (20 edges)
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
  // Sotomo 2025: Ersatzneubau-Effizienz (Zürich 2.8x, Lausanne 6.5x)
  {
    from: 'bau_ersatzneubau_effizienz',
    to: 'angebotspotenzial',
    sign: +1,
    weights: [0.1, 0.5, 0.8],
    // Effizienter Ersatzneubau → mehr Netto-Neubau pro Abriss → höheres Angebot.
    // Kurzfristig gering (laufende Projekte); mittelfristig und langfristig volle Wirkung.
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
    sign: -1,
    weights: [0.5, 0.7, 0.6],
    // FHNW-Studie (Ters/Kholodilin 2025, Genf): Wohnungsrationierung = stärkste Angebotsbremse.
    // Abbruchverbot verhindert Ersatzneubau → institutionelle Investoren stornieren Projekte.
    // Basel: Baugesuche −76%, geplante Wohneinheiten −95% (1078→67) nach Wohnschutz-Initiative.
    // Dominanter Effekt: Neubau-Verhinderung > Bestandsschutz.
    // P2 peak: Max. Projektstornierungen; P3 leicht abnehmend wenn Markt sich angepasst hat.
  },
  {
    from: 'nutzung_umnutzungsverbot',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.4, 0.7, 0.6],
    // Umnutzungsverbot verhindert Neuentwicklung (Industrie→Wohnen, Aufstockung).
    // Gleicher Mechanismus wie Abbruchverbot, etwas schwächer da weniger Neubau-Anteil.
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

  // Mietrecht hat starken langfristigen negativen Effekt auf Angebot (GLOBAL-029, Kholodilin & Kohl 2023)
  {
    from: 'mietrecht_kuendigungsschutz',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.1, 0.4, 0.8],
    // Restriktives Mietrecht reduziert Neubau langfristig deutlich.
    // Kurzfristig wenig Effekt; langfristig stark (Investoren meiden Markt).
  },
  {
    from: 'mietrecht_kostenmiete',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.2, 0.5, 0.9],
    // Kostenmietregulierung senkt Renditeerwartung → Neubau wird unattraktiv.
    // GLOBAL-029: 16 Länder 1910–2016 — stärkster langfristiger Effekt.
  },
  {
    from: 'nutzung_zweitwohnungen',
    to: 'angebotspotenzial',
    sign: -1,
    weights: [0.3, 0.5, 0.7],
    // CH-006 Lex Weber: Zweitwohnungsbeschränkung senkt paradoxerweise
    // Gesamtbauaktivität (weniger Bauprojekte insgesamt).
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → nachfragedruck (15 edges)
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

  // CH-007 BWO: Zonenreserve dämpft Nachfragedruck durch Angebotsausweitung
  {
    from: 'raumplanung_zonenreserve',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.2, 0.5, 0.8],
    // Mehr Bauland → mehr Angebot → weniger Knappheit → weniger Nachfragedruck.
    // Langfristig stärkster Effekt wenn Bauland tatsächlich mobilisiert wird.
  },
  // AT-002 WIFO: Gemeinnütziger Wohnbau als "Public Option" — dämpft Privatmarktnachfrage
  {
    from: 'gemeinnuetzig_mindestanteil',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.3, 0.5, 0.7],
    // Wien-Effekt: 60% Sozialwohnungen → strukturelle Marktdämpfung.
    // Kurzfristig begrenzt; langfristig wenn Bestand wächst.
  },
  {
    from: 'gemeinnuetzig_foerderfonds',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.1, 0.4, 0.7],
    // Förderfonds braucht Aufbauphase; langfristig alternative Wohnangebote.
  },
  {
    from: 'gemeinnuetzig_baurecht',
    to: 'nachfragedruck',
    sign: -1,
    weights: [0.2, 0.4, 0.6],
    // Baurechte für Gemeinnützige erweitern Angebot; mittelfristig wirksam.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → verdrängungsrisiko (9 edges)
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
    from: 'raumplanung_verdichtung',
    to: 'verdraengungsrisiko',
    sign: +1,
    weights: [0.5, 0.7, 0.5],
    // CH-008 ETH SPUR: Verdichtung via Ersatzneubau verdrängt vulnerable Bewohnende.
    // Mittelfristig stärkster Effekt bei Bauboom; langfristig leichte Dämpfung.
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
  {
    from: 'nutzung_kurzzeitvermietung',
    to: 'verdraengungsrisiko',
    sign: -1,
    weights: [0.9, 0.8, 0.7],
    // NYC LL18: 90% Airbnb-Inserate-Rückgang nach Regulierung.
    // Weniger Konkurrenz durch Ferienwohnungen → weniger Verdrängung von Mietern.
    // Sofortiger Effekt; langfristig passt sich der Markt an.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → spekulationshemmung (9 edges)
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
  {
    from: 'steuer_leerstandsabgabe',
    to: 'spekulationshemmung',
    sign: +1,
    weights: [0.7, 0.8, 0.9],
    // Vancouver EHT (Leerstand 0.9%→0.49%, 20k Einheiten zum Mietmarkt).
    // Leerstandsabgabe macht Horten direkt unrentabel → Spekulation sinkt.
    // Kurzfristig Vollzugsverzögerung; langfristig stärkster Effekt.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → marktfriktion (7 edges)
  // Research: RESULT-agent2-weights.md + FHNW-Studie (Ters/Kholodilin 2025)
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'steuer_grundstueckgewinn',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.8, 0.7, 0.6],
    // Transaktionssteuern erzeugen sofort Reibung;
    // Märkte finden mittelfristig Workarounds.
  },
  {
    from: 'steuer_handaenderung',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.8, 0.7, 0.6],
    // Identischer Effekt wie Grundstückgewinnsteuer.
  },
  {
    from: 'steuer_kapitalgewinnprivatpersonen',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.6, 0.7, 0.7],
    // Kapgewinnsteuer moderater Effekt;
    // leicht zunehmend da sie Verkaufsentscheide stärker beeinflusst.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'marktfriktion',
    sign: +1,
    weights: [1.0, 1.0, 0.9],
    // Zinsniveau ist fundamentaler Markttreiber;
    // kaum abschwächend über Zeit da strukturelle Determinante.
  },
  {
    from: 'mietrecht_kostenmiete',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.6, 0.8, 0.9],
    // FHNW: In stark regulierten Märkten wie Genf sinkt die Marktrotation drastisch.
    // Bestandsmieter bleiben durchschnittlich 13.7 Jahre (vs. ~6 J. in weniger regulierten Märkten).
    // Neumieter zahlen ~30% mehr als Bestandsmieter (Genf), vs. ~18% in Zürich.
    // Kostenmiete = rigideste Form → maximale Marktstarrheit, wächst über Zeit.
  },
  {
    from: 'mietrecht_kuendigungsschutz',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.5, 0.7, 0.8],
    // Starker Kündigungsschutz reduziert Fluktuation → Marktstarrheit steigt.
    // Mieter bleiben in Wohnungen, die nicht mehr zum Lebensstil passen.
    // Kumulative Wirkung nimmt über Zeit zu (P3 stärker als P1).
  },
  {
    from: 'mietrecht_mietzinstransparenz',
    to: 'marktfriktion',
    sign: +1,
    weights: [0.3, 0.4, 0.5],
    // CH-003: Anfechtungsrecht erhöht Transaktionskosten für Vermieter;
    // strategische Preissetzung trotzdem möglich, aber Friktion steigt.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → mietpreis_schutzlevel (4 edges)
  // Research: RESULT-agent2-weights.md
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
  // E0 → investitionsattraktivitaet (11 edges)
  // Research: RESULT-agent2-weights.md + FHNW-Studie (Ters/Kholodilin 2025)
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
  {
    from: 'nutzung_kurzzeitvermietung',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.8, 0.7, 0.6],
    // Barcelona Paradox: Airbnb-Regulierung → +1.9% Miete, +4.6% Kaufpreise.
    // Vermieter weichen auf Kaufmarkt aus → Renditeerwartungen sinken.
    // Sofortiger Effekt auf Investoren-Pool; langfristig Markt-Anpassung.
  },
  {
    from: 'nutzung_abbruchverbot',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.5, 0.7, 0.8],
    // FHNW-Studie (Genf 1994–2022): Rationierungsschocks → institutionelle Neubauinvestitionen −400 Mio. CHF.
    // Bewilligungsrisiken steigen, Projektlaufzeiten verlängern sich, Bodenwerte sinken →
    // grossflächige Ersatzneubauten werden unattraktiv.
    // Langfristig stärkster Effekt (P3=0.8) da Investoren Markt dauerhaft meiden.
  },
  {
    from: 'nutzung_umnutzungsverbot',
    to: 'investitionsattraktivitaet',
    sign: -1,
    weights: [0.4, 0.6, 0.7],
    // Ergänzend zu Abbruchverbot: Umnutzungsverbot verhindert Redevelopment-Projekte.
    // Etwas schwächerer Effekt, da Umnutzungen seltener sind als Ersatzneubauten.
  },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → angebotspotenzial_regulation
  // Bestimmt die Elastizität des Angebots in Bezug auf Preisänderungen.
  // Wirkt primär in P3 (langfristige Anpassung des Bauvolumens an Preissignale).
  // Starke Regulierung → unelastische Angebotskurve → Preise reagieren stark, Menge wenig.
  // Schwache Regulierung → elastische Angebotskurve → Menge reagiert stark, Preise wenig.
  // ═══════════════════════════════════════════════════════════════════

  {
    from: 'mietrecht_kostenmiete',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.7, 0.9, 1.0],
    // Kostenmietregulierung macht Preissignale irrelevant für Anleger → unelastisch.
    // GLOBAL-029: Stärkster Effekt bei langfristiger Regulierung.
  },
  {
    from: 'mietrecht_kuendigungsschutz',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.5, 0.7, 0.9],
    // Kündigungsschutz reduziert Exit-Optionen → Investoren reagieren weniger auf Preisänderungen.
  },
  {
    from: 'bau_bewilligungsverfahren',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.6, 0.8, 0.5],
    // Komplexe Verfahren machen Angebotstrist träge → weniger Elastizität.
    // Kurzfristig stark, da bestehende Projekte nicht schnell reagiert können.
  },
  {
    from: 'bau_einspracherecht_suspensiv',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.5, 0.7, 0.6],
    // Veto-Recht schafft Unsicherheit → Anleger meiden den Markt bei Preisänderungen.
  },
  {
    from: 'nutzung_abbruchverbot',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.6, 0.8, 0.7],
    // Rationierung blockiert den physischen Reaktionskanal → Angebot reagiert kaum auf Preise.
    // FHNW: Basel Baugesuche −76% zeigt diese Unelastizität.
  },
  {
    from: 'ctx:zinsniveau',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.8, 0.6, 0.4],
    // Zinserhöhung verteuert Finanzierung → selbst bei hohen Preisen kein Angebot.
    // Kurzfristig starker Effekt, da Kapital sofort teurer wird.
  },
  {
    from: 'ctx:marktenge',
    to: 'angebotspotenzial_regulation',
    sign: +1,
    weights: [0.7, 0.6, 0.5],
    // Enger Markt hat weniger Ausweichoptionen → selbst bei Preisreiz kein Angebot möglich.
    // Entspannter Markt: mehr Spielraum für Angebotsreaktion.
    //
    // Bewusste Koexistenz mit `marketModulator` (compute-phases.ts): marktenge
    // wirkt dort GLOBAL als Reaktions-Verstärker ("enge Märkte reagieren
    // stärker auf alles"), hier LOKAL als Elastizitäts-Treiber der
    // Angebotskurve ("enge Märkte haben unelastisches Angebot"). Zwei
    // verschiedene Mechanismen, die sich nur auf diesem einen Node überlagern —
    // beide zusammen kalibriert (0/446 Constraint-Verletzungen).
  },

] as const;
