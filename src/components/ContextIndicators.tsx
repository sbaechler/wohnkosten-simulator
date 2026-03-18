import type { CityContext } from '../types';
import { contextMeta } from '../model/params';

interface Props {
  context: CityContext;
}

export function ContextIndicators({ context }: Props) {
  return (
    <div className="context-indicators">
      {contextMeta.map(meta => {
        const value = context[meta.key];
        const levelIndex = value + 2; // -2→0, -1→1, 0→2, +1→3, +2→4
        return (
          <div key={meta.key} className="context-indicator">
            <span className="context-indicator__label">{meta.label}</span>
            <span className="context-indicator__value">{meta.levels[levelIndex]}</span>
          </div>
        );
      })}
    </div>
  );
}
