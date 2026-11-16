import type { CityContext } from '../types';
import { contextMeta } from '../model/params';

interface Props {
  context: CityContext;
}

/** Auf welcher Ebene der Mietabstand vorliegt (Messvorschrift: switzerland.yaml). */
const EBENE_LABEL = { stadt: 'Stadt', kanton: 'Kanton' } as const;
const EBENE_QUELLE = {
  stadt: 'Stadt, Neubezug unter 2 Jahren inkl. Neubau, 2 bis 4 Zimmer',
  kanton: 'nur für den Kanton verfügbar, Neubezug einer älteren Wohnung, alle Grössen',
} as const;

export function ContextIndicators({ context }: Props) {
  const abstand = context.mietabstand_neubezug;
  return (
    <div className="context-indicators">
      {contextMeta.map(meta => {
        const value = context[meta.key];
        if (typeof value !== 'number') return null;
        const levelIndex = value + 2; // -2→0, -1→1, 0→2, +1→3, +2→4
        return (
          <div key={meta.key} className="context-indicator">
            <span className="context-indicator__label">{meta.label}</span>
            <span className="context-indicator__value">{meta.levels[levelIndex]}</span>
          </div>
        );
      })}
      {abstand && (
        <div
          className="context-indicator"
          title={
            `Nettomiete bei Neubezug im Verhältnis zur Nettomiete bei 21 und mehr Jahren Mietdauer `
            + `(BFS Strukturerhebung 2024, ${EBENE_QUELLE[abstand.ebene]}). Durchschnitt; einzelne `
            + `Wohnungen liegen weit darüber. Nur Anzeige, fliesst nicht in die Simulation ein.`
          }
        >
          <span className="context-indicator__label">Neubezug ggü. Altmiete</span>
          <span className="context-indicator__value">
            +{Math.round((abstand.faktor - 1) * 100)} % ({EBENE_LABEL[abstand.ebene]})
          </span>
        </div>
      )}
    </div>
  );
}
