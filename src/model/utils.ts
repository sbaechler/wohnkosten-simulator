/**
 * utils.ts — Geteilte Hilfsfunktionen für die Model-Pipeline
 *
 * Reine Funktionen ohne Seiteneffekte. Keine Abhängigkeiten auf andere
 * Module (ausser Type-Imports).
 */

/**
 * Begrenzt einen Wert auf das Intervall [lo, hi].
 *
 * Standard: [-1, +1] — die normalisierte Skala der E1-Markt-Zustandsvariablen
 * und E2-abgeleiteten Indikatoren. Für andere Bereiche (z. B. Mietbelastung
 * 20–70%) werden `lo`/`hi` explizit angegeben.
 *
 * @param v   Wert
 * @param lo  Untergrenze (default: -1)
 * @param hi  Obergrenze (default: +1)
 */
export function clamp(v: number, lo = -1, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}
