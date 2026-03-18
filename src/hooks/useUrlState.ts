import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CityParams, CityConfig, CityContext, ParamValue, ParamsDiff } from '../types';
import { cities, cityBySlug } from '../generated/cities';
import { computeDiff } from '../model/params';

const PARAM_KEYS = new Set<string>([
  'raumplanung', 'bauvorschriften', 'energetischeVorgaben', 'mietrecht',
  'steuerpolitik', 'foerderungGemeinnuetzig', 'subventionen',
  'einspracherechte', 'infrastruktur', 'auslaendischeInvestitionen',
]);

function clampParam(v: number): ParamValue {
  return Math.max(0, Math.min(2, Math.round(v))) as ParamValue;
}

export function parseUrl(pathname: string, search: string) {
  const citySlug = pathname.replace(/^\//, '').split('/')[0] || '';
  const overrides: Partial<CityParams> = {};
  const params = new URLSearchParams(search);
  for (const [key, val] of params.entries()) {
    if (PARAM_KEYS.has(key)) {
      const num = parseInt(val, 10);
      if (!isNaN(num)) {
        overrides[key as keyof CityParams] = clampParam(num);
      }
    }
  }
  return { citySlug, overrides };
}

export function buildUrl(citySlug: string, overrides: Partial<CityParams>): string {
  const entries = Object.entries(overrides).filter(([, v]) => v !== undefined);
  const query = entries.map(([k, v]) => `${k}=${v}`).join('&');
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
  const [, forceUpdate] = useState(0);

  const { citySlug, overrides } = parseUrl(
    window.location.pathname,
    window.location.search.replace(/^\?/, ''),
  );

  const city = cityBySlug.get(citySlug) || cities[0];
  const baseline = city.params;
  const modified = useMemo(() => ({ ...baseline, ...overrides }), [baseline, overrides]);
  const diff = useMemo(() => computeDiff(baseline, modified), [baseline, modified]);

  const pushUrl = useCallback((slug: string, ov: Partial<CityParams>) => {
    const url = buildUrl(slug, ov);
    window.history.pushState(null, '', url);
    forceUpdate(n => n + 1);
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
    const onPop = () => forceUpdate(n => n + 1);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return { city, context: city.context, baseline, modified, diff, setParam, setCity, reset };
}
