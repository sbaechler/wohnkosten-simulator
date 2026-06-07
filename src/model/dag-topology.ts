// ============================================================
// dag-topology.ts — DAG topology for visualization
// Provides a simplified Edge interface from PHASE_WEIGHTED_EDGES
// ============================================================

import { PHASE_WEIGHTED_EDGES } from './phase-weights';

export type NodeId =
  | 'raumplanung_zonenreserve' | 'raumplanung_verdichtung' | 'raumplanung_ausnuetzungsziffer'
  | 'boden_vorkaufsrecht' | 'boden_bauverpflichtung' | 'boden_mehrwertabgabe' | 'boden_bodeneigentumssteuer'
  | 'bau_energievorgaben' | 'bau_sanierungspflicht' | 'bau_ersatzneubau_effizienz'
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
  | 'ctx:zinsniveau' | 'ctx:zuwanderungsdruck' | 'ctx:wirtschaftskraft' | 'ctx:bevoelkerungstrend' | 'ctx:mietbelastungs_grenze'
  | 'angebotspotenzial' | 'nachfragedruck' | 'mietpreis_schutzlevel' | 'verdraengungsrisiko'
  | 'spekulationshemmung' | 'markfriktion' | 'gemeinnuetzig_kraft'
  | 'eigentumsquoten_trend' | 'aufwertungsdruck' | 'investitionsattraktivitaet'
  | 'angebotspotenzial_regulation'
  | 'gentrifizierungsindex' | 'neubau_hemmnisindex' | 'verdraengungsrisiko_index'
  | 'fiskalische_wirkung';

export interface Edge {
  from: NodeId;
  to: NodeId;
  sign: 1 | -1;
  weight: number;
  time: 'short' | 'medium' | 'long';
}

/**
 * Projects phase-weighted edges to single-weight edges for visualization.
 * Uses the dominant phase's weight as the single weight value.
 */
export function getDagTopology(): readonly Edge[] {
  return PHASE_WEIGHTED_EDGES.map(edge => {
    const maxWeight = Math.max(...edge.weights);
    const dominantIndex = edge.weights.indexOf(maxWeight);
    const time: 'short' | 'medium' | 'long' =
      dominantIndex === 0 ? 'short' :
      dominantIndex === 1 ? 'medium' :
      'long';

    return {
      from: edge.from as NodeId,
      to: edge.to as NodeId,
      sign: edge.sign,
      weight: maxWeight,
      time,
    };
  });
}