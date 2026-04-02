import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CityParams40, CityConfig, CityContext, ParamValue, ParamsDiff40 } from '../types';
import { cities, cityBySlug } from '../generated/cities';
import { computeDiff40 } from '../model/params';
import { clampParam, PARAM_KEYS_40_SET } from '../model/url-helpers';

export function parseUrl(pathname: string, search: string) {
  const citySlug = pathname.replace(/^\//, '').split('/')[0] || '';
  const overrides: Partial<CityParams40> = {};
  const params = new URLSearchParams(search);

  for (const [key, val] of params.entries()) {
    const num = parseInt(val, 10);
    if (isNaN(num)) continue;
    if (PARAM_KEYS_40_SET.has(key)) {
      (overrides as Record<string, number>)[key] = clampParam(num);
    }
  }

  return { citySlug, overrides };
}

export function buildUrl(citySlug: string, overrides: Partial<CityParams40>): string {
  const entries = Object.entries(overrides)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
  const query = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
  return query ? `/${citySlug}?${query}` : `/${citySlug}`;
}

export interface UrlState {
  city: CityConfig;
  context: CityContext;
  baseline: CityParams40;
  modified: CityParams40;
  diff: ParamsDiff40;
  setParam: (key: keyof CityParams40, value: ParamValue) => void;
  setCity: (slug: string) => void;
  reset: () => void;
}

export function useUrlState(): UrlState {
  const [locationKey, setLocationKey] = useState(
    () => window.location.pathname + window.location.search,
  );

  const { citySlug, overrides } = useMemo(
    () => parseUrl(window.location.pathname, window.location.search),
    [locationKey],
  );

  const city = useMemo(
    () => cityBySlug.get(citySlug) || cities[0],
    [citySlug],
  );
  const baseline = city.params;
  const modified = useMemo(() => ({ ...baseline, ...overrides }), [baseline, overrides, locationKey]);
  const diff = useMemo(() => computeDiff40(baseline, modified), [baseline, modified]);

  const pushUrl = useCallback((slug: string, ov: Partial<CityParams40>) => {
    const url = buildUrl(slug, ov);
    window.history.pushState(null, '', url);
    setLocationKey(window.location.pathname + window.location.search);
  }, []);

  const setParam = useCallback((key: keyof CityParams40, value: ParamValue) => {
    const newOverrides = { ...overrides };
    if (value === baseline[key]) {
      delete newOverrides[key];
    } else {
      (newOverrides as Record<string, ParamValue>)[key] = value;
    }
    pushUrl(city.slug, newOverrides);
  }, [overrides, baseline, city.slug, pushUrl]);

  const setCity = useCallback((slug: string) => {
    pushUrl(slug, {});
  }, [pushUrl]);

  const reset = useCallback(() => {
    pushUrl(city.slug, {});
  }, [city.slug, pushUrl]);

  useEffect(() => {
    const onPop = () => setLocationKey(window.location.pathname + window.location.search);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return { city, context: city.context, baseline, modified, diff, setParam, setCity, reset };
}
