import type { DerivedIndicators, CityParams40 } from '../types';
import './ZeitBisWirkungWidget.css';

interface Props {
  derived: DerivedIndicators;
  modified: CityParams40;
  baseline: CityParams40;
}

const TIME_LABELS: Record<string, { title: string; color: string }> = {
  kurzfristig: { title: 'Kurzfristig (< 1 Jahr)', color: '#51cf66' },
  mittelfristig: { title: 'Mittelfristig (1–7 Jahre)', color: '#ffd43b' },
  langfristig: { title: 'Langfristig (> 7 Jahre)', color: '#845ef7' },
};

function getMaxCount(derived: DerivedIndicators): number {
  const counts = [
    derived.zeit_bis_wirkung.kurzfristig.length,
    derived.zeit_bis_wirkung.mittelfristig.length,
    derived.zeit_bis_wirkung.langfristig.length,
  ];
  return Math.max(...counts, 1);
}

export function ZeitBisWirkungWidget({ derived }: Props) {
  const { kurzfristig, mittelfristig, langfristig, dominanteKlasse } = derived.zeit_bis_wirkung;
  const maxCount = getMaxCount(derived);

  const groups: { key: string; params: string[]; isDominant: boolean }[] = [
    { key: 'kurzfristig', params: kurzfristig, isDominant: dominanteKlasse === 'kurzfristig' },
    { key: 'mittelfristig', params: mittelfristig, isDominant: dominanteKlasse === 'mittelfristig' },
    { key: 'langfristig', params: langfristig, isDominant: dominanteKlasse === 'langfristig' },
  ];

  return (
    <div className="zeit-bis-wirkung-widget">
      <div className="zeit-bis-wirkung-widget__title">Zeit bis Wirkung</div>

      <div className="zeit-bis-wirkung-widget__groups">
        {groups.map(({ key, params, isDominant }) => {
          const { title, color } = TIME_LABELS[key];
          const count = params.length;
          const barWidth = (count / maxCount) * 100;

          return (
            <div
              key={key}
              className={`zeit-bis-wirkung-widget__group ${isDominant ? 'zeit-bis-wirkung-widget__group--dominant' : ''}`}
            >
              <div className="zeit-bis-wirkung-widget__group-header">
                <span className="zeit-bis-wirkung-widget__group-title" style={{ color }}>
                  {title}
                </span>
                <span className="zeit-bis-wirkung-widget__count">{count}</span>
              </div>
              <div className="zeit-bis-wirkung-widget__bar-bg">
                <div
                  className="zeit-bis-wirkung-widget__bar"
                  style={{ width: `${barWidth}%`, background: color }}
                />
              </div>
              {params.length > 0 && (
                <div className="zeit-bis-wirkung-widget__params">
                  {params.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
