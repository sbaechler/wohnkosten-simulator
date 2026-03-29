/**
 * Phase-Weighted DAG Edges
 * 
 * Replaces the old single weight + time-class schema with three phase weights.
 * Phase 1: 0–2 years (short-term)
 * Phase 2: 2–5 years (medium-term)
 * Phase 3: 5–10 years (long-term)
 * 
 * Weight: 0.0 = no effect, 1.0 = full effect in this phase.
 * 
 * Auto-generated from research by sub-agents.
 * Source: docs/superpowers/specs/abhaengigkeiten-und-iterationen.md
 */

export const PHASE_WEIGHTED_EDGES: readonly {
  from: string;
  to: string;
  sign: 1 | -1;
  weights: readonly [number, number, number];
}[] = [

  // ═══════════════════════════════════════════════════════════════════
  // E0 → angebotspotenzial (16 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'raumplanung_zonenreserve',        to: 'angebotspotenzial', sign: -1, weights: [0.8, 0.5, 0.3] },
  { from: 'raumplanung_verdichtung',          to: 'angebotspotenzial', sign: +1, weights: [0.0, 0.6, 1.0] },
  { from: 'raumplanung_ausnuetzungsziffer',   to: 'angebotspotenzial', sign: +1, weights: [0.2, 0.7, 1.0] },
  { from: 'boden_bauverpflichtung',            to: 'angebotspotenzial', sign: +1, weights: [0.1, 0.5, 0.8] },
  { from: 'bau_energievorgaben',              to: 'angebotspotenzial', sign: -1, weights: [0.2, 0.6, 0.4] },
  { from: 'bau_sanierungspflicht',            to: 'angebotspotenzial', sign: -1, weights: [0.9, 0.6, 0.3] },
  { from: 'bau_einspracherecht_dritte',       to: 'angebotspotenzial', sign: -1, weights: [0.5, 0.7, 0.4] },
  { from: 'bau_einspracherecht_suspensiv',    to: 'angebotspotenzial', sign: -1, weights: [0.7, 0.9, 0.5] },
  { from: 'bau_bewilligungsverfahren',        to: 'angebotspotenzial', sign: +1, weights: [0.4, 0.6, 0.3] },
  { from: 'bau_normenharmonisierung',         to: 'angebotspotenzial', sign: +1, weights: [0.0, 0.5, 0.8] },
  { from: 'gemeinnuetzig_mindestanteil',     to: 'angebotspotenzial', sign: -1, weights: [0.4, 0.6, 0.5] },
  { from: 'gemeinnuetzig_foerderfonds',       to: 'angebotspotenzial', sign: +1, weights: [0.1, 0.5, 0.8] },
  { from: 'nutzung_abbruchverbot',            to: 'angebotspotenzial', sign: +1, weights: [0.5, 0.7, 0.6] },
  { from: 'nutzung_umnutzungsverbot',         to: 'angebotspotenzial', sign: +1, weights: [0.4, 0.7, 0.6] },
  { from: 'ctx:zinsniveau',                   to: 'angebotspotenzial', sign: -1, weights: [1.0, 0.8, 0.5] },
  { from: 'ctx:wirtschaftskraft',              to: 'angebotspotenzial', sign: +1, weights: [0.8, 0.6, 0.4] },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → nachfragedruck (11 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'ctx:zuwanderungsdruck',            to: 'nachfragedruck', sign: +1, weights: [1.0, 0.8, 0.6] },
  { from: 'ctx:wirtschaftskraft',             to: 'nachfragedruck', sign: +1, weights: [0.9, 0.7, 0.5] },
  { from: 'ctx:bevoelkerungstrend',           to: 'nachfragedruck', sign: +1, weights: [0.8, 0.9, 0.7] },
  { from: 'ctx:zinsniveau',                   to: 'nachfragedruck', sign: -1, weights: [0.9, 0.7, 0.4] },
  { from: 'infra_oepnv',                      to: 'nachfragedruck', sign: +1, weights: [0.3, 0.7, 1.0] },
  { from: 'infra_schule_kita',                to: 'nachfragedruck', sign: +1, weights: [0.2, 0.6, 0.9] },
  { from: 'infra_oeffentlicher_raum',         to: 'nachfragedruck', sign: +1, weights: [0.4, 0.8, 0.7] },
  { from: 'infra_wirtschaftsansiedlung',       to: 'nachfragedruck', sign: +1, weights: [0.6, 0.9, 0.7] },
  { from: 'steuer_eigenmietwert',             to: 'nachfragedruck', sign: -1, weights: [0.8, 0.6, 0.4] },
  { from: 'kapital_hypothekarregulierung',    to: 'nachfragedruck', sign: -1, weights: [0.9, 0.6, 0.3] },
  { from: 'kapital_auslaendische_investoren', to: 'nachfragedruck', sign: -1, weights: [0.8, 0.5, 0.2] },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → verdrängungsrisiko (7 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'mietrecht_kuendigungsschutz',     to: 'verdraengungsrisiko', sign: -1, weights: [1.0, 0.9, 0.7] },
  { from: 'nutzung_abbruchverbot',            to: 'verdraengungsrisiko', sign: -1, weights: [0.8, 0.8, 0.7] },
  { from: 'nutzung_umnutzungsverbot',          to: 'verdraengungsrisiko', sign: -1, weights: [0.9, 0.8, 0.7] },
  { from: 'bau_sanierungspflicht',             to: 'verdraengungsrisiko', sign: +1, weights: [0.7, 0.9, 0.8] },
  { from: 'mietrecht_untervermietung',        to: 'verdraengungsrisiko', sign: -1, weights: [0.8, 0.7, 0.6] },
  { from: 'ctx:zuwanderungsdruck',             to: 'verdraengungsrisiko', sign: +1, weights: [1.0, 1.0, 1.0] },
  { from: 'ctx:wirtschaftskraft',              to: 'verdraengungsrisiko', sign: +1, weights: [0.7, 1.0, 0.9] },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → spekulationshemmung (8 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'steuer_grundstueckgewinn',        to: 'spekulationshemmung', sign: +1, weights: [0.9, 0.8, 0.7] },
  { from: 'steuer_handaenderung',              to: 'spekulationshemmung', sign: +1, weights: [0.9, 0.8, 0.7] },
  { from: 'steuer_kapitalgewinnprivatpersonen', to: 'spekulationshemmung', sign: +1, weights: [0.8, 0.8, 0.7] },
  { from: 'boden_mehrwertabgabe',              to: 'spekulationshemmung', sign: +1, weights: [0.9, 0.8, 0.7] },
  { from: 'boden_bodeneigentumssteuer',        to: 'spekulationshemmung', sign: +1, weights: [0.7, 0.8, 0.9] },
  { from: 'boden_bauverpflichtung',            to: 'spekulationshemmung', sign: +1, weights: [0.8, 0.9, 0.8] },
  { from: 'nutzung_zweitwohnungen',            to: 'spekulationshemmung', sign: +1, weights: [0.7, 0.8, 0.7] },
  { from: 'nutzung_kurzzeitvermietung',        to: 'spekulationshemmung', sign: +1, weights: [0.8, 0.9, 0.8] },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → markfriktion (4 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'steuer_grundstueckgewinn',        to: 'markfriktion', sign: +1, weights: [0.8, 0.7, 0.6] },
  { from: 'steuer_handaenderung',              to: 'markfriktion', sign: +1, weights: [0.8, 0.7, 0.6] },
  { from: 'steuer_kapitalgewinnprivatpersonen', to: 'markfriktion', sign: +1, weights: [0.6, 0.7, 0.7] },
  { from: 'ctx:zinsniveau',                   to: 'markfriktion', sign: +1, weights: [1.0, 1.0, 0.9] },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → mietpreis_schutzlevel (4 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'mietrecht_kostenmiete',           to: 'mietpreis_schutzlevel', sign: +1, weights: [1.0, 0.9, 0.8] },
  { from: 'mietrecht_anfangsmiete',           to: 'mietpreis_schutzlevel', sign: +1, weights: [1.0, 0.8, 0.7] },
  { from: 'mietrecht_mietzinstransparenz',    to: 'mietpreis_schutzlevel', sign: +1, weights: [0.8, 0.7, 0.6] },
  { from: 'mietrecht_mietzinsindex',          to: 'mietpreis_schutzlevel', sign: +1, weights: [1.0, 0.9, 0.9] },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → gemeinnuetzig_kraft (6 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'gemeinnuetzig_mindestanteil',     to: 'gemeinnuetzig_kraft', sign: +1, weights: [0.9, 1.0, 1.0] },
  { from: 'gemeinnuetzig_foerderfonds',       to: 'gemeinnuetzig_kraft', sign: +1, weights: [0.5, 0.8, 1.0] },
  { from: 'gemeinnuetzig_baurecht',           to: 'gemeinnuetzig_kraft', sign: +1, weights: [0.9, 1.0, 0.9] },
  { from: 'boden_vorkaufsrecht',               to: 'gemeinnuetzig_kraft', sign: +1, weights: [0.7, 0.9, 0.8] },
  { from: 'gemeinnuetzig_belegungsvorschriften', to: 'gemeinnuetzig_kraft', sign: +1, weights: [0.8, 0.8, 0.7] },
  { from: 'gemeinnuetzig_sozialmischung',     to: 'gemeinnuetzig_kraft', sign: +1, weights: [0.7, 0.8, 0.8] },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → eigentumsquoten_trend (6 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'steuer_eigenmietwert',             to: 'eigentumsquoten_trend', sign: -1, weights: [0.9, 0.8, 0.7] },
  { from: 'kapital_hypothekarregulierung',    to: 'eigentumsquoten_trend', sign: -1, weights: [1.0, 0.9, 0.8] },
  { from: 'ctx:zinsniveau',                   to: 'eigentumsquoten_trend', sign: -1, weights: [1.0, 1.0, 0.9] },
  { from: 'mietrecht_kostenmiete',            to: 'eigentumsquoten_trend', sign: -1, weights: [0.7, 0.8, 0.8] },
  { from: 'ctx:zuwanderungsdruck',             to: 'eigentumsquoten_trend', sign: -1, weights: [1.0, 1.0, 1.0] },
  { from: 'ctx:wirtschaftskraft',             to: 'eigentumsquoten_trend', sign: +1, weights: [0.7, 0.9, 1.0] },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → aufwertungsdruck (7 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'infra_oepnv',                      to: 'aufwertungsdruck', sign: +1, weights: [0.6, 0.9, 1.0] },
  { from: 'infra_wirtschaftsansiedlung',       to: 'aufwertungsdruck', sign: +1, weights: [0.7, 0.9, 1.0] },
  { from: 'ctx:wirtschaftskraft',             to: 'aufwertungsdruck', sign: +1, weights: [0.8, 0.9, 1.0] },
  { from: 'raumplanung_verdichtung',          to: 'aufwertungsdruck', sign: +1, weights: [0.8, 0.9, 1.0] },
  { from: 'raumplanung_ausnuetzungsziffer',   to: 'aufwertungsdruck', sign: +1, weights: [0.9, 0.9, 0.8] },
  { from: 'boden_bodeneigentumssteuer',        to: 'aufwertungsdruck', sign: -1, weights: [0.6, 0.7, 0.8] },
  { from: 'gemeinnuetzig_mindestanteil',     to: 'aufwertungsdruck', sign: -1, weights: [0.8, 0.7, 0.6] },

  // ═══════════════════════════════════════════════════════════════════
  // E0 → investitionsattraktivitaet (8 edges)
  // ═══════════════════════════════════════════════════════════════════
  { from: 'mietrecht_kostenmiete',            to: 'investitionsattraktivitaet', sign: -1, weights: [0.9, 0.9, 0.8] },
  { from: 'kapital_institutionelle_regulierung', to: 'investitionsattraktivitaet', sign: -1, weights: [0.8, 0.9, 0.9] },
  { from: 'steuer_grundstueckgewinn',          to: 'investitionsattraktivitaet', sign: -1, weights: [0.8, 0.7, 0.6] },
  { from: 'boden_mehrwertabgabe',              to: 'investitionsattraktivitaet', sign: -1, weights: [0.8, 0.8, 0.7] },
  { from: 'kapital_auslaendische_investoren',  to: 'investitionsattraktivitaet', sign: -1, weights: [0.8, 0.9, 0.9] },
  { from: 'steuer_handaenderung',               to: 'investitionsattraktivitaet', sign: -1, weights: [0.7, 0.7, 0.6] },
  { from: 'ctx:wirtschaftskraft',              to: 'investitionsattraktivitaet', sign: +1, weights: [0.9, 1.0, 1.0] },
  { from: 'ctx:zinsniveau',                    to: 'investitionsattraktivitaet', sign: -1, weights: [1.0, 1.0, 0.9] },

  // ═══════════════════════════════════════════════════════════════════
  // E1 → E2 edges (9 edges)
  // ═══════════════════════════════════════════════════════════════════
  // gentrifizierungsindex
  { from: 'aufwertungsdruck',          to: 'gentrifizierungsindex',     sign: +1, weights: [1.0, 1.0, 1.0] },
  { from: 'mietpreis_schutzlevel',     to: 'gentrifizierungsindex',     sign: -1, weights: [0.3, 0.7, 1.0] },
  { from: 'verdraengungsrisiko',       to: 'gentrifizierungsindex',     sign: +1, weights: [1.0, 0.9, 0.7] },
  { from: 'gemeinnuetzig_kraft',       to: 'gentrifizierungsindex',     sign: -1, weights: [0.2, 0.6, 1.0] },

  // neubau_hemmnisindex
  { from: 'angebotspotenzial',         to: 'neubau_hemmnisindex',      sign: -1, weights: [1.0, 1.0, 1.0] },

  // verdraengungsrisiko_index
  { from: 'verdraengungsrisiko',       to: 'verdraengungsrisiko_index', sign: +1, weights: [1.0, 0.9, 0.7] },

  // fiskalische_wirkung
  { from: 'spekulationshemmung',        to: 'fiskalische_wirkung',      sign: +1, weights: [0.3, 0.6, 1.0] },
  { from: 'markfriktion',              to: 'fiskalische_wirkung',       sign: -1, weights: [0.4, 0.7, 1.0] },
  { from: 'gemeinnuetzig_kraft',       to: 'fiskalische_wirkung',       sign: +1, weights: [0.5, 0.8, 1.0] },

] as const;
