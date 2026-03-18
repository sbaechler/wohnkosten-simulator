import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CityParams, CityConfig, CityContext, ParamValue, ParamsDiff } from '../types';
import { cities, cityBySlug } from '../generated/cities';
import { computeDiff, paramMeta } from '../model/params';

// Derive PARAM_KEYS from paramMeta to avoid duplication with params.ts
const PARAM_KEY_SET = new Set<string>(paramMeta.map(m => m.key));

function clampParam(v: number): ParamValue {
  return Math.max(0, Math.min(2, Math.round(v))) as ParamValue;
}

export function parseUrl(pathname: string, search: string) {
  const citySlug = pathname.replace(/^\//, '').split('/')[0] || '';
  const overrides: Partial<CityParams> = {};
  const params = new URLSearchParams(search);
  for (const [key, val] of params.entries()) {
    if (PARAM_KEY_SET.has(key)) {
      const num = parseInt(val, 10);
      if (!isNaN(num)) {
        overrides[key as keyof CityParams] = clampParam(num);
      }
    }
  }
  return { citySlug, overrides };
}

export function buildUrl(citySlug: string, overrides: Partial<CityParams>): string {
  const entries = Object.entries(overrides)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
  const query = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
  return query ? `/${citySlug}?${query}` : `/${citySlug}`;
}

export interface UrlState {
  city: CityConfig;
  context: CityContext;
  baseline: CityParams;
  modified: CityParams;
  diff: ParamsDiff;
  setParam: (key: keyof CityParams, value: ParamValue) => void;
  setCity: (slug: string) => void;
  reset: () => void;
}

export function useUrlState(): UrlState {
  // Store URL as state so React can track changes with stable references
  const [locationKey, setLocationKey] = useState(
    () => window.location.pathname + window.location.search
  );

  const { citySlug, overrides } = useMemo(
    () => parseUrl(window.location.pathname, window.location.search),
    [locationKey]
  );

  const city = useMemo(
    () => cityBySlug.get(citySlug) || cities[0],
    [citySlug]
  );
  const baseline = city.params;
  const modified = useMemo(() => ({ ...baseline, ...overrides }), [baseline, locationKey]);
  const diff = useMemo(() => computeDiff(baseline, modified), [baseline, modified]);

  const pushUrl = useCallback((slug: string, ov: Partial<CityParams>) => {
    const url = buildUrl(slug, ov);
    window.history.pushState(null, '', url);
    setLocationKey(window.location.pathname + window.location.search);
  }, []);

  const setParam = useCallback((key: keyof CityParams, value: ParamValue) => {
    const newOverrides = { ...overrides };
    if (value === baseline[key]) {
      delete newOverrides[key];
    } else {
      newOverrides[key] = value;
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
