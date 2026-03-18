import type { ParamValue, ParamMeta } from '../types';
import './ParameterSlider.css';

interface Props {
  meta: ParamMeta;
  value: ParamValue;
  defaultValue: ParamValue;
  onChange: (value: ParamValue) => void;
}

export function ParameterSlider({ meta, value, defaultValue, onChange }: Props) {
  const isChanged = value !== defaultValue;

  return (
    <div className={`param-slider ${isChanged ? 'param-slider--changed' : ''}`}>
      <div className="param-slider__label">{meta.label}</div>
      <div className="param-slider__help">{meta.helpText}</div>
      <input
        type="range"
        min={0}
        max={2}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value) as ParamValue)}
        className="param-slider__input"
      />
      <div className="param-slider__levels">
        {meta.levels.map((level, i) => (
          <span
            key={i}
            className={`param-slider__level ${i === value ? 'param-slider__level--active' : ''}`}
          >
            {level}
          </span>
        ))}
      </div>
    </div>
  );
}
