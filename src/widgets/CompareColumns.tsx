import type { ReactNode } from 'react';
import './CompareColumns.css';

interface Props {
  /** Inhalt für «Heute». Fehlt er, wird nur `current` ohne Spalten gezeigt. */
  baseline?: ReactNode;
  current: ReactNode;
}

/**
 * Stellt «Heute» und «Simuliert» nebeneinander (Widget-Regel in AGENTS.md).
 * Ohne Baseline (keine Parameter geändert) wird nur der aktuelle Inhalt gezeigt.
 */
export function CompareColumns({ baseline, current }: Props) {
  if (baseline === undefined) return <>{current}</>;
  return (
    <div className="compare-columns">
      <div className="compare-columns__col">
        <div className="compare-columns__label">Heute</div>
        {baseline}
      </div>
      <div className="compare-columns__divider" />
      <div className="compare-columns__col">
        <div className="compare-columns__label compare-columns__label--sim">Simuliert</div>
        {current}
      </div>
    </div>
  );
}
