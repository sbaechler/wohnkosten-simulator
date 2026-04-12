// ============================================================
// graph.ts — DAG source of truth
// Wohnkosten-Simulator V2
// ============================================================

// ── Node IDs ─────────────────────────────────────────────────────────────────

/** Alle Knoten im Graph (E0 Parameter + E0 Kontext + E1 + E2) */
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
  | 'steuer_grundstueckgewinn' | 'steuer_eigenmietwert' | 'steuer_leerstandsabgabe'
  | 'steuer_handaenderung' | 'steuer_kapitalgewinnprivatpersonen'
  | 'kapital_auslaendische_investoren' | 'kapital_institutionelle_regulierung' | 'kapital_hypothekarregulierung'
  | 'nutzung_kurzzeitvermietung' | 'nutzung_umnutzungsverbot' | 'nutzung_abbruchverbot' | 'nutzung_zweitwohnungen'
  | 'infra_oepnv' | 'infra_schule_kita' | 'infra_oeffentlicher_raum' | 'infra_wirtschaftsansiedlung'
  // E0 — Kontextfaktoren
  | 'ctx:zinsniveau' | 'ctx:zuwanderungsdruck' | 'ctx:wirtschaftskraft' | 'ctx:bevoelkerungstrend'
  // E1 — Markt-Zustandsvariablen
  | 'angebotspotenzial' | 'nachfragedruck' | 'mietpreis_schutzlevel' | 'verdraengungsrisiko'
  | 'spekulationshemmung' | 'markfriktion' | 'gemeinnuetzig_kraft'
  | 'eigentumsquoten_trend' | 'aufwertungsdruck' | 'investitionsattraktivitaet'
  // E2 — abgeleitete Indikatoren
  | 'gentrifizierungsindex' | 'neubau_hemmnisindex' | 'verdraengungsrisiko_index'
  | 'fiskalische_wirkung';

// ── Edge (original, used by market-state.ts) ─────────────────────────────────

export interface Edge {
  from: NodeId;
  to:   NodeId;
  sign:   1 | -1;
  weight: 0.5 | 1 | 1.5;
  time:   'short' | 'medium' | 'long';
}

// ── DAG Edges ───────────────────────────────────────────────────────────────

export const DAG_EDGES: Edge[] = [

  // ─── E0 → angebotspotenzial ───────────────────────────────────────────────
  // Starke Evidenz aus GLOBAL-029 (Kholodilin & Kohl 2023, 16 Länder 1910-2016):
  // Restriktives Mietrecht reduziert Neubau langfristig deutlich.
  { from: 'raumplanung_zonenreserve',             to: 'angebotspotenzial',          sign: -1, weight: 1.5, time: 'long'   },
  { from: 'raumplanung_verdichtung',              to: 'angebotspotenzial',          sign: +1, weight: 1.2, time: 'long'   }, // Upzoning wirkt verzögert
  { from: 'raumplanung_ausnuetzungsziffer',       to: 'angebotspotenzial',          sign: +1, weight: 1.5, time: 'medium' },
  { from: 'boden_bauverpflichtung',               to: 'angebotspotenzial',          sign: +1, weight: 0.8, time: 'medium' }, // Schwache Evidenz (DE-011)
  { from: 'bau_energievorgaben',                  to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'short'  },
  { from: 'bau_sanierungspflicht',                to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'short'  },
  { from: 'bau_einspracherecht_dritte',           to: 'angebotspotenzial',          sign: -1, weight: 1.2, time: 'medium' }, // NO-001 bestätigt Verzögerung
  { from: 'bau_einspracherecht_suspensiv',        to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'short'  },
  { from: 'bau_bewilligungsverfahren',            to: 'angebotspotenzial',          sign: +1, weight: 1.0, time: 'medium' },
  { from: 'bau_normenharmonisierung',             to: 'angebotspotenzial',          sign: +1, weight: 0.8, time: 'long'   },
  { from: 'gemeinnuetzig_mindestanteil',          to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'long'   }, // Skaleneffekt wichtig (Wien-Modell)
  { from: 'gemeinnuetzig_foerderfonds',           to: 'angebotspotenzial',          sign: +1, weight: 1.2, time: 'medium' },
  { from: 'nutzung_abbruchverbot',                to: 'angebotspotenzial',          sign: -1, weight: 1.0, time: 'medium' },
  { from: 'nutzung_umnutzungsverbot',             to: 'angebotspotenzial',          sign: -1, weight: 0.7, time: 'medium' },
  { from: 'ctx:zinsniveau',                       to: 'angebotspotenzial',          sign: -1, weight: 1.5, time: 'medium' },
  { from: 'ctx:wirtschaftskraft',                 to: 'angebotspotenzial',          sign: +1, weight: 1.0, time: 'long'   },

  // Mietrecht hat starken langfristigen negativen Effekt auf Angebot (GLOBAL-029)
  { from: 'mietrecht_kuendigungsschutz',         to: 'angebotspotenzial',          sign: -1, weight: 1.3, time: 'long'   },
  { from: 'mietrecht_kostenmiete',               to: 'angebotspotenzial',          sign: -1, weight: 1.2, time: 'long'   },

  // ─── E0 → nachfragedruck ──────────────────────────────────────────────────
  { from: 'ctx:zuwanderungsdruck',                to: 'nachfragedruck',             sign: +1, weight: 1.5, time: 'short'  },
  { from: 'ctx:wirtschaftskraft',                to: 'nachfragedruck',             sign: +1, weight: 1.5, time: 'long'   },
  { from: 'ctx:bevoelkerungstrend',              to: 'nachfragedruck',             sign: +1, weight: 0.5, time: 'long'   },
  { from: 'ctx:zinsniveau',                       to: 'nachfragedruck',             sign: -1, weight: 1.5, time: 'short'  },
  { from: 'infra_oepnv',                          to: 'nachfragedruck',             sign: +1, weight: 1.5, time: 'long'   },
  { from: 'infra_schule_kita',                    to: 'nachfragedruck',             sign: +1, weight: 1.0, time: 'medium' },
  { from: 'infra_oeffentlicher_raum',             to: 'nachfragedruck',             sign: +1, weight: 0.5, time: 'medium' },
  { from: 'infra_wirtschaftsansiedlung',          to: 'nachfragedruck',             sign: +1, weight: 1.5, time: 'long'   },
  { from: 'steuer_eigenmietwert',                 to: 'nachfragedruck',             sign: -1, weight: 1.0, time: 'medium' },
  { from: 'kapital_hypothekarregulierung',        to: 'nachfragedruck',             sign: -1, weight: 1.0, time: 'short'  },
  { from: 'kapital_auslaendische_investoren',     to: 'nachfragedruck',             sign: -1, weight: 0.5, time: 'medium' },

  // ─── E0 → mietpreis_schutzlevel ──────────────────────────────────────────
  // FR-002 (Paris 2019-2024) zeigt starken Effekt von Anfangsmiete-Regulierung
  { from: 'mietrecht_kostenmiete',               to: 'mietpreis_schutzlevel',      sign: +1, weight: 1.5, time: 'short'  },
  { from: 'mietrecht_anfangsmiete',             to: 'mietpreis_schutzlevel',      sign: +1, weight: 1.2, time: 'short'  }, // Paris-Effekt: -5.2% bis -8.2%
  { from: 'mietrecht_mietzinstransparenz',      to: 'mietpreis_schutzlevel',      sign: +1, weight: 0.8, time: 'short'  },
  { from: 'mietrecht_mietzinsindex',            to: 'mietpreis_schutzlevel',      sign: +1, weight: 1.0, time: 'short'  },

  // ─── E0 → verdraengungsrisiko ─────────────────────────────────────────────
  // Mietrecht schützt Bestandsmieter, reduziert aber langfristig Angebot (GLOBAL-029, Kholodilin 2024)
  { from: 'mietrecht_kuendigungsschutz',         to: 'verdraengungsrisiko',        sign: -1, weight: 1.4, time: 'short'  },
  { from: 'nutzung_abbruchverbot',               to: 'verdraengungsrisiko',        sign: -1, weight: 1.2, time: 'short'  },
  { from: 'nutzung_umnutzungsverbot',            to: 'verdraengungsrisiko',        sign: -1, weight: 0.8, time: 'short'  },
  { from: 'bau_sanierungspflicht',              to: 'verdraengungsrisiko',        sign: +1, weight: 1.1, time: 'short'  },
  { from: 'mietrecht_untervermietung',           to: 'verdraengungsrisiko',        sign: -1, weight: 0.6, time: 'short'  },
  { from: 'ctx:zuwanderungsdruck',               to: 'verdraengungsrisiko',        sign: +1, weight: 1.2, time: 'short'  },
  { from: 'ctx:wirtschaftskraft',               to: 'verdraengungsrisiko',        sign: +1, weight: 0.7, time: 'long'   },

  // ─── E0 → spekulationshemmung ─────────────────────────────────────────────
  // GLOBAL-029 + NO-001 + LVT-Literatur (GLOBAL-006, GLOBAL-014, GLOBAL-019)
  { from: 'steuer_grundstueckgewinn',            to: 'spekulationshemmung',        sign: +1, weight: 1.5, time: 'medium' },
  { from: 'steuer_handaenderung',                to: 'spekulationshemmung',        sign: +1, weight: 0.8, time: 'short'  },
  { from: 'steuer_kapitalgewinnprivatpersonen', to: 'spekulationshemmung',        sign: +1, weight: 1.0, time: 'short'  },
  { from: 'boden_mehrwertabgabe',                to: 'spekulationshemmung',        sign: +1, weight: 1.2, time: 'long'   },
  { from: 'boden_bodeneigentumssteuer',         to: 'spekulationshemmung',        sign: +1, weight: 1.4, time: 'medium' }, // Starke Evidenz aus Dänemark, Pennsylvania
  { from: 'boden_bauverpflichtung',              to: 'spekulationshemmung',        sign: +1, weight: 1.0, time: 'medium' },
  { from: 'nutzung_zweitwohnungen',              to: 'spekulationshemmung',        sign: +1, weight: 0.5, time: 'long'   },
  { from: 'nutzung_kurzzeitvermietung',         to: 'spekulationshemmung',        sign: +1, weight: 0.5, time: 'short'  },

  // ─── E0 → markfriktion ────────────────────────────────────────────────────
  { from: 'steuer_grundstueckgewinn',            to: 'markfriktion',               sign: +1, weight: 1.5, time: 'medium' },
  { from: 'steuer_handaenderung',                to: 'markfriktion',               sign: +1, weight: 1.0, time: 'short'  },
  { from: 'steuer_kapitalgewinnprivatpersonen', to: 'markfriktion',               sign: +1, weight: 1.0, time: 'short'  },
  { from: 'ctx:zinsniveau',                      to: 'markfriktion',               sign: +1, weight: 1.0, time: 'short'  },
  { from: 'mietrecht_kostenmiete',               to: 'markfriktion',               sign: +1, weight: 1.0, time: 'long'   },
  { from: 'mietrecht_kuendigungsschutz',         to: 'markfriktion',               sign: +1, weight: 0.5, time: 'long'   },

  // ─── E0 → gemeinnuetzig_kraft ─────────────────────────────────────────────
  // Wien-Modell + Skaleneffekt stark bestätigt (GLOBAL-029 + AT-Studien)
  { from: 'gemeinnuetzig_mindestanteil',        to: 'gemeinnuetzig_kraft',        sign: +1, weight: 1.4, time: 'long'   }, // Skaleneffekt entscheidend
  { from: 'gemeinnuetzig_foerderfonds',         to: 'gemeinnuetzig_kraft',        sign: +1, weight: 1.3, time: 'long'   },
  { from: 'gemeinnuetzig_baurecht',             to: 'gemeinnuetzig_kraft',        sign: +1, weight: 1.2, time: 'long'   },
  { from: 'boden_vorkaufsrecht',                 to: 'gemeinnuetzig_kraft',        sign: +1, weight: 0.8, time: 'long'   }, // Schwache Evidenz (Lücke bestätigt)
  { from: 'gemeinnuetzig_belegungsvorschriften',to: 'gemeinnuetzig_kraft',        sign: +1, weight: 0.7, time: 'medium' },
  { from: 'gemeinnuetzig_sozialmischung',        to: 'gemeinnuetzig_kraft',        sign: +1, weight: 0.8, time: 'long'   },

  // ─── E0 → eigentumsquoten_trend ──────────────────────────────────────────
  { from: 'steuer_eigenmietwert',                to: 'eigentumsquoten_trend',      sign: -1, weight: 1.5, time: 'medium' },
  { from: 'kapital_hypothekarregulierung',       to: 'eigentumsquoten_trend',      sign: -1, weight: 1.0, time: 'short'  },
  { from: 'ctx:zinsniveau',                      to: 'eigentumsquoten_trend',      sign: -1, weight: 1.5, time: 'short'  },
  { from: 'mietrecht_kostenmiete',               to: 'eigentumsquoten_trend',      sign: -1, weight: 0.5, time: 'long'   },
  { from: 'ctx:zuwanderungsdruck',               to: 'eigentumsquoten_trend',      sign: -1, weight: 1.0, time: 'short'  },
  { from: 'ctx:wirtschaftskraft',               to: 'eigentumsquoten_trend',      sign: +1, weight: 1.0, time: 'long'   },

  // ─── E0 → aufwertungsdruck ────────────────────────────────────────────────
  { from: 'infra_oepnv',                         to: 'aufwertungsdruck',           sign: +1, weight: 1.5, time: 'long'   },
  { from: 'infra_wirtschaftsansiedlung',         to: 'aufwertungsdruck',           sign: +1, weight: 1.5, time: 'long'   },
  { from: 'ctx:wirtschaftskraft',                to: 'aufwertungsdruck',           sign: +1, weight: 1.5, time: 'long'   },
  { from: 'raumplanung_verdichtung',            to: 'aufwertungsdruck',           sign: +1, weight: 1.0, time: 'medium' },
  { from: 'raumplanung_ausnuetzungsziffer',     to: 'aufwertungsdruck',           sign: +1, weight: 1.0, time: 'medium' },
  { from: 'boden_bodeneigentumssteuer',         to: 'aufwertungsdruck',           sign: -1, weight: 1.0, time: 'medium' },
  { from: 'gemeinnuetzig_mindestanteil',        to: 'aufwertungsdruck',           sign: -1, weight: 0.5, time: 'long'   },

  // ─── E0 → investitionsattraktivitaet ─────────────────────────────────────
  { from: 'mietrecht_kostenmiete',               to: 'investitionsattraktivitaet', sign: -1, weight: 1.5, time: 'short'  },
  { from: 'kapital_institutionelle_regulierung', to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'medium' },
  { from: 'steuer_grundstueckgewinn',            to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'medium' },
  { from: 'boden_mehrwertabgabe',                to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'long'   },
  { from: 'kapital_auslaendische_investoren',   to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'medium' },
  { from: 'steuer_handaenderung',                to: 'investitionsattraktivitaet', sign: -1, weight: 0.5, time: 'short'  },
  { from: 'ctx:wirtschaftskraft',                to: 'investitionsattraktivitaet', sign: +1, weight: 1.5, time: 'long'   },
  { from: 'ctx:zinsniveau',                      to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'short'  },
  { from: 'nutzung_abbruchverbot',               to: 'investitionsattraktivitaet', sign: -1, weight: 1.0, time: 'long'   },
  { from: 'nutzung_umnutzungsverbot',            to: 'investitionsattraktivitaet', sign: -1, weight: 0.5, time: 'long'   },

  // ─── E1 → E2 ─────────────────────────────────────────────────────────────
  { from: 'aufwertungsdruck',                    to: 'gentrifizierungsindex',      sign: +1, weight: 1.5, time: 'long'   },
  { from: 'mietpreis_schutzlevel',               to: 'gentrifizierungsindex',      sign: -1, weight: 1.5, time: 'short'  },
  { from: 'verdraengungsrisiko',                 to: 'gentrifizierungsindex',      sign: +1, weight: 1.5, time: 'short'  },
  { from: 'gemeinnuetzig_kraft',                 to: 'gentrifizierungsindex',      sign: -1, weight: 1.0, time: 'long'   },

  { from: 'angebotspotenzial',                   to: 'neubau_hemmnisindex',        sign: -1, weight: 1.5, time: 'medium' },

  { from: 'verdraengungsrisiko',                 to: 'verdraengungsrisiko_index',  sign: +1, weight: 1.5, time: 'short'  },

  { from: 'spekulationshemmung',                 to: 'fiskalische_wirkung',        sign: +1, weight: 1.5, time: 'medium' },
  { from: 'markfriktion',                        to: 'fiskalische_wirkung',        sign: -1, weight: 1.0, time: 'medium' },
  { from: 'gemeinnuetzig_kraft',                 to: 'fiskalische_wirkung',        sign: +1, weight: 1.0, time: 'long'   },

  // zeit_bis_wirkung: berechnet sich direkt aus diff + TIME_CLASS_MAP (kein Edge-Eintrag)
] as const;

// ── Compile-time checks ──────────────────────────────────────────────────────

/** Compile-time check: alle 40 Parameter-Keys müssen im Graph vorkommen */
type _AssertAllKeys = typeof DAG_EDGES[number] extends Edge
  ? true
  : never;
const _checkEdges: _AssertAllKeys = true;
void _checkEdges;

// ── Helper: E1 knoten bezogen auf einen Zielknoten ─────────────────────────

export function edgesForTarget(target: NodeId): readonly Edge[] {
  return DAG_EDGES.filter(e => e.to === target);
}
