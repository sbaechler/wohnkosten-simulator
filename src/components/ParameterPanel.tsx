import type { CityParams, CityContext, ParamValue } from '../types';
import { paramMeta, hasChanges } from '../model/params';
import { ParameterSlider } from './ParameterSlider';
import { ContextIndicators } from './ContextIndicators';
import './ParameterPanel.css';

interface Props {
  context: CityContext;
  baseline: CityParams;
  modified: CityParams;
  onParamChange: (key: keyof CityParams, value: ParamValue) => void;
  onReset: () => void;
}

export function ParameterPanel({ context, baseline, modified, onParamChange, onReset }: Props) {
  const changed = hasChanges(baseline, modified);

  return (
    <aside className="parameter-panel">
      <ContextIndicators context={context} />
      <div className="parameter-panel__header">Parameter</div>
      <div className="parameter-panel__sliders">
        {paramMeta.map(meta => (
          <ParameterSlider
            key={meta.key}
            meta={meta}
            value={modified[meta.key]}
            defaultValue={baseline[meta.key]}
            onChange={v => onParamChange(meta.key, v)}
          />
        ))}
      </div>
      {changed && (
        <button className="parameter-panel__reset" onClick={onReset}>
          Zurücksetzen auf Ist-Zustand
        </button>
      )}
    </aside>
  );
}
