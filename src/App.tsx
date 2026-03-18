import { useUrlState } from './hooks/useUrlState';
import { CitySelector } from './components/CitySelector';
import { ParameterPanel } from './components/ParameterPanel';
import { WidgetGrid } from './widgets/WidgetGrid';
import './App.css';

export default function App() {
  const { city, context, baseline, modified, diff, setParam, setCity, reset } = useUrlState();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Wohnungskosten-Simulator</h1>
        <CitySelector currentSlug={city.slug} onChange={setCity} />
      </header>
      <main className="app__main">
        <ParameterPanel
          context={context}
          baseline={baseline}
          modified={modified}
          onParamChange={setParam}
          onReset={reset}
        />
        <WidgetGrid
          context={context}
          baseline={baseline}
          modified={modified}
          diff={diff}
        />
      </main>
    </div>
  );
}
