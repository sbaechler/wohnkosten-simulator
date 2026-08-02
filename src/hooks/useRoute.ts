import { useState, useEffect, useCallback } from 'react';

export interface Route {
  /** Aktueller Pfad, z.B. "/zuerich" oder "/rechtliches" */
  path: string;
  /** Client-seitige Navigation. Merkt sich die Herkunft für "Zurück"-Links. */
  navigate: (to: string) => void;
  /** Pfad, von dem aus zur aktuellen Seite navigiert wurde (leer = Direkteinstieg) */
  from: string | null;
}

interface HistoryState {
  from?: string;
}

export function useRoute(): Route {
  const [path, setPath] = useState(() => window.location.pathname);
  const [from, setFrom] = useState<string | null>(
    () => (window.history.state as HistoryState | null)?.from ?? null,
  );

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname);
      setFrom((window.history.state as HistoryState | null)?.from ?? null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    const previous = window.location.pathname + window.location.search;
    window.history.pushState({ from: previous }, '', to);
    // Benachrichtigt auch useUrlState, das denselben Event abhört.
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  return { path, navigate, from };
}
