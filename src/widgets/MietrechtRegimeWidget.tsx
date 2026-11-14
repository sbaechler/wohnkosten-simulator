import type { PhaseResult } from '../model/phases';
import type { MarketState } from '../types';
import { CompareColumns } from './CompareColumns';
import './MietrechtRegimeWidget.css';

interface Props {
  phases: PhaseResult[];
  /** Wenn gesetzt: «Heute» neben «Simuliert» */
  baselinePhases?: PhaseResult[];
}

type RegimeFeld = 'erhoehungsspielraum' | 'bestandsmiete' | 'anfangsmiete' | 'verweildauer';

/** Zeilen des Widgets: Regime-Zustände aus mietrecht-regime.ts (provisorisch, CH-012). */
const ZEILEN: Array<{ feld: RegimeFeld; label: string; hinweis: string }> = [
  { feld: 'erhoehungsspielraum', label: 'Erhöhungsspielraum', hinweis: 'plus = Vermieter darf laufende Mieten anheben' },
  { feld: 'bestandsmiete', label: 'Bestandsmiete', hinweis: 'plus = teurer' },
  { feld: 'anfangsmiete', label: 'Anfangsmiete', hinweis: 'plus = teurer' },
  { feld: 'verweildauer', label: 'Verweildauer', hinweis: 'plus = Mieter bleiben länger' },
];

/** Anzeige mit zwei Nachkommastellen; Beträge darunter gelten als «unverändert». */
const NULL_SCHWELLE = 0.005;

function formatIndex(value: number): string {
  if (Math.abs(value) < NULL_SCHWELLE) return '0';
  return `${value > 0 ? '+' : '−'}${Math.abs(value).toFixed(2)}`;
}

function vorzeichenKlasse(value: number): string {
  if (Math.abs(value) < NULL_SCHWELLE) return 'regime-widget__wert--null';
  return value > 0 ? 'regime-widget__wert--plus' : 'regime-widget__wert--minus';
}

function RegimeTabelle({ phases }: { phases: PhaseResult[] }) {
  const letzte: MarketState = phases[phases.length - 1]!.marketState;
  return (
    <>
      <table className="regime-widget__tabelle">
        <thead>
          <tr>
            <th scope="col" />
            {phases.map(p => (
              <th key={p.phase} scope="col" title={p.yearsLabel}>P{p.phase}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ZEILEN.map(z => (
            <tr key={z.feld}>
              <th scope="row" title={z.hinweis}>{z.label}</th>
              {phases.map(p => {
                const v = p.marketState[z.feld];
                return (
                  <td key={p.phase} className={vorzeichenKlasse(v)}>{formatIndex(v)}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="regime-widget__tor">
        Vergleichsmiete als Massstab: {letzte.vergleichsmiete_aktiv > 0 ? 'aktiv' : 'nicht aktiv'}
      </div>
    </>
  );
}

/**
 * Macht die Schieber Missbrauchskriterium, Durchsetzung und Mietzinsindex
 * sichtbar. Die Zustände sind provisorisch und nicht kalibriert (CH-012);
 * sie fliessen bewusst nicht in Gruppen-Trends und Mietbelastung ein.
 */
export function MietrechtRegimeWidget({ phases, baselinePhases }: Props) {
  if (phases.length === 0) return null;
  return (
    <div className="regime-widget">
      <div className="regime-widget__title">Mietrecht-Regime (provisorisch)</div>
      <CompareColumns
        baseline={baselinePhases && <RegimeTabelle phases={baselinePhases} />}
        current={<RegimeTabelle phases={phases} />}
      />
      <p className="regime-widget__note">
        Index, nicht kalibriert. Zeigt die Wirkung von Missbrauchskriterium, Durchsetzung
        und Mietzinsindex; diese Werte fliessen nicht in Preistrends und Mietbelastung ein.
        Die Durchsetzung bewegt nur etwas, wenn es etwas durchzusetzen gibt: einen
        Senkungsanspruch (negativer Erhöhungsspielraum) oder eine Miete über dem Deckel.
      </p>
    </div>
  );
}
