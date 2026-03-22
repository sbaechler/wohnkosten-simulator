import { useState } from 'react';
import type { CityParams40, ParamValue, CityContext } from '../types';
import { paramsByGroup, PARAM_GROUP_LABELS, PARAM_GROUP_ORDER } from '../model/params';
import type { ParamGroup } from '../types';
import { ParameterSlider } from './ParameterSlider';
import { ContextIndicators } from './ContextIndicators';
import './ParameterPanel.css';

interface Props {
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  onParamChange: (key: keyof CityParams40, value: ParamValue) => void;
  onReset: () => void;
}

/** Starting state: all groups collapsed */
const INITIAL_COLLAPSED: Record<ParamGroup, boolean> = {
  bodenrecht:    false, // start expanded (first group)
  bau:           true,
  gemeinnuetzig: true,
  mietrecht:     true,
  steuern:       true,
  kapital:       true,
  nutzung:       true,
  infrastruktur: true,
};

export function ParameterPanel({ context, baseline, modified, onParamChange, onReset }: Props) {
  const [collapsed, setCollapsed] = useState<Record<ParamGroup, boolean>>(INITIAL_COLLAPSED);

  const groups = paramsByGroup();
  const hasAnyChange = Object.keys(modified).some(
    k => modified[k as keyof CityParams40] !== baseline[k as keyof CityParams40],
  );

  function toggleGroup(group: ParamGroup) {
    setCollapsed(prev => ({ ...prev, [group]: !prev[group] }));
  }

  return (
    <aside className="parameter-panel">
      <ContextIndicators context={context} />
      <div className="parameter-panel__header">Parameter</div>
      <div className="parameter-panel__groups">
        {PARAM_GROUP_ORDER.map(groupKey => {
          const metaItems = groups[groupKey];
          if (!metaItems || metaItems.length === 0) return null;

          const isCollapsed = collapsed[groupKey];
          const changedCount = metaItems.filter(
            m => modified[m.key] !== baseline[m.key],
          ).length;

          return (
            <div key={groupKey} className="param-group">
              <button
                className="param-group__header"
                onClick={() => toggleGroup(groupKey)}
                aria-expanded={!isCollapsed}
              >
                <span className="param-group__title">
                  {PARAM_GROUP_LABELS[groupKey]}
                  {changedCount > 0 && (
                    <span className="param-group__badge">{changedCount}</span>
                  )}
                </span>
                <span className={`param-group__chevron ${isCollapsed ? 'param-group__chevron--right' : 'param-group__chevron--down'}`}>
                  ▾
                </span>
              </button>

              {!isCollapsed && (
                <div className="param-group__body">
                  {metaItems.map(meta => (
                    <ParameterSlider
                      key={meta.key}
                      meta={meta}
                      value={modified[meta.key]}
                      defaultValue={baseline[meta.key]}
                      onChange={v => onParamChange(meta.key, v)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {hasAnyChange && (
        <button className="parameter-panel__reset" onClick={onReset}>
          Zurücksetzen auf Ist-Zustand
        </button>
      )}
    </aside>
  );
}
