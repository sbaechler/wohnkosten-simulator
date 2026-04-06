import { useState } from 'react';
import { useUrlState } from './hooks/useUrlState';
import { CitySelector } from './components/CitySelector';
import { ParameterPanel } from './components/ParameterPanel';
import { WidgetGrid } from './widgets/WidgetGrid';
import { DAGVisualization } from './widgets/DAGVisualization';
import './App.css';

type ViewMode = 'widgets' | 'dag';

export default function App() {
  const { city, context, baseline, modified, diff, setParam, setCity, reset } = useUrlState();
  const [viewMode, setViewMode] = useState<ViewMode>('widgets');

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Wohnungskosten-Simulator</h1>
        <div className="app__header-controls">
          <button
            className={`app__view-toggle ${viewMode === 'dag' ? 'app__view-toggle--active' : ''}`}
            onClick={() => setViewMode(v => v === 'widgets' ? 'dag' : 'widgets')}
            title={viewMode === 'widgets' ? 'DAG-Graph anzeigen' : 'Widgets anzeigen'}
          >
            {/* Graph icon */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" r="2" fill="currentColor" />
              <circle cx="13" cy="3" r="2" fill="currentColor" />
              <circle cx="8" cy="13" r="2" fill="currentColor" />
              <line x1="5" y1="3.5" x2="11" y2="3.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="4.5" y1="4.5" x2="7" y2="11.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="11.5" y1="4.5" x2="9" y2="11.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Graph
          </button>
          <CitySelector currentSlug={city.slug} onChange={setCity} />
        </div>
      </header>
      <main className="app__main">
        <ParameterPanel
          context={context}
          baseline={baseline}
          modified={modified}
          onParamChange={setParam}
          onReset={reset}
        />
        <div className="app__content">
          {viewMode === 'widgets' ? (
            <WidgetGrid
              context={context}
              baseline={baseline}
              modified={modified}
              diff={diff}
            />
          ) : (
            <DAGVisualization
              context={context}
              baseline={baseline}
              modified={modified}
              diff={diff}
            />
          )}
        </div>
      </main>
      <footer className="app__footer">©2026 Simon Bächler</footer>
    </div>
  );
}
