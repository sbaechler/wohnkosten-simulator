# Wohnungskosten-Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React SPA that lets users adjust political parameters for Swiss cities and see visualized effects on housing markets.

**Architecture:** URL-driven state (city slug in path, changed params in query). City data from YAML compiled at build time. Each visualization widget independently computes its display from baseline params, modified params, context factors, and diff. D3.js for charts.

**Tech Stack:** Vite, React 18, TypeScript, D3.js, js-yaml (build-time)

**Spec:** `docs/superpowers/specs/2026-03-18-wohnungskosten-simulator-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `data/cities/switzerland.yaml` | City definitions (context + params) |
| `scripts/build-city-data.ts` | YAML → TypeScript at build time |
| `src/generated/cities.ts` | Generated city data (git-ignored) |
| `src/types.ts` | All shared types |
| `src/model/params.ts` | computeDiff(), hasChanges(), paramMeta (labels, help texts) |
| `src/hooks/useUrlState.ts` | URL ↔ state sync |
| `src/App.tsx` | Root layout, wires everything together |
| `src/App.css` | Global styles, layout grid |
| `src/components/CitySelector.tsx` | City dropdown |
| `src/components/ContextIndicators.tsx` | Read-only context factor display |
| `src/components/ParameterPanel.tsx` | Left panel with sliders + reset |
| `src/components/ParameterSlider.tsx` | Single 3-step slider |
| `src/widgets/SupplyDemandChart.tsx` | D3 supply/demand cross diagram |
| `src/widgets/TrendArrow.tsx` | Single trend arrow (reusable) |
| `src/widgets/DivergingTrend.tsx` | Split arrows for income groups |
| `src/widgets/OwnershipDonut.tsx` | D3 double-donut chart |
| `src/widgets/WidgetGrid.tsx` | Right panel grid layout |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.css`

- [ ] **Step 1: Initialize Vite React-TS project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install d3 && npm install -D @types/d3 js-yaml @types/js-yaml
```

- [ ] **Step 3: Verify dev server starts**

Run: `npm run dev`
Expected: Vite dev server starts, default page loads at localhost:5173

- [ ] **Step 4: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Vite React-TS project with D3"
```

---

### Task 2: Types and City Data

**Files:**
- Create: `src/types.ts`, `data/cities/switzerland.yaml`, `scripts/build-city-data.ts`, `src/generated/cities.ts`
- Modify: `package.json` (add prebuild script)
- Modify: `.gitignore` (add src/generated/)

- [ ] **Step 1: Create shared types**

Create `src/types.ts`:
```typescript
export type ParamValue = 0 | 1 | 2;
export type ContextValue = -2 | -1 | 0 | 1 | 2;

export interface CityParams {
  raumplanung: ParamValue;
  bauvorschriften: ParamValue;
  energetischeVorgaben: ParamValue;
  mietrecht: ParamValue;
  steuerpolitik: ParamValue;
  foerderungGemeinnuetzig: ParamValue;
  subventionen: ParamValue;
  einspracherechte: ParamValue;
  infrastruktur: ParamValue;
  auslaendischeInvestitionen: ParamValue;
}

export interface CityContext {
  zinsniveau: ContextValue;
  zuwanderungsdruck: ContextValue;
  wirtschaftskraft: ContextValue;
  bevoelkerungstrend: ContextValue;
}

export interface CityConfig {
  slug: string;
  name: string;
  context: CityContext;
  params: CityParams;
}

export type ParamsDiff = Partial<Record<keyof CityParams, {
  from: ParamValue;
  to: ParamValue;
}>>;

export interface ParamMeta {
  key: keyof CityParams;
  label: string;
  helpText: string;
  levels: [string, string, string]; // labels for 0, 1, 2
}

export interface ContextMeta {
  key: keyof CityContext;
  label: string;
  levels: [string, string, string, string, string]; // labels for -2, -1, 0, +1, +2
}
```

- [ ] **Step 2: Create city YAML data**

Create `data/cities/switzerland.yaml`:
```yaml
- slug: zuerich
  name: "Zürich"
  context:
    zinsniveau: -1
    zuwanderungsdruck: 2
    wirtschaftskraft: 2
    bevoelkerungstrend: 2
  params:
    raumplanung: 2
    bauvorschriften: 2
    energetischeVorgaben: 1
    mietrecht: 1
    steuerpolitik: 2
    foerderungGemeinnuetzig: 2
    subventionen: 1
    einspracherechte: 2
    infrastruktur: 2
    auslaendischeInvestitionen: 1

- slug: bern
  name: "Bern"
  context:
    zinsniveau: -1
    zuwanderungsdruck: 1
    wirtschaftskraft: 1
    bevoelkerungstrend: 1
  params:
    raumplanung: 1
    bauvorschriften: 1
    energetischeVorgaben: 1
    mietrecht: 1
    steuerpolitik: 1
    foerderungGemeinnuetzig: 1
    subventionen: 1
    einspracherechte: 1
    infrastruktur: 1
    auslaendischeInvestitionen: 1

- slug: lugano
  name: "Lugano"
  context:
    zinsniveau: -1
    zuwanderungsdruck: 0
    wirtschaftskraft: 0
    bevoelkerungstrend: 0
  params:
    raumplanung: 1
    bauvorschriften: 1
    energetischeVorgaben: 0
    mietrecht: 0
    steuerpolitik: 0
    foerderungGemeinnuetzig: 0
    subventionen: 0
    einspracherechte: 1
    infrastruktur: 1
    auslaendischeInvestitionen: 1
```

- [ ] **Step 3: Create build script**

Create `scripts/build-city-data.ts`:
```typescript
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { load } from 'js-yaml';
import { resolve, dirname } from 'path';

const yamlPath = resolve(__dirname, '../data/cities/switzerland.yaml');
const outPath = resolve(__dirname, '../src/generated/cities.ts');

const cities = load(readFileSync(yamlPath, 'utf-8'));

mkdirSync(dirname(outPath), { recursive: true });

writeFileSync(outPath, [
  '// AUTO-GENERATED — do not edit. Run: npm run build:data',
  `import type { CityConfig } from '../types';`,
  '',
  `export const cities: CityConfig[] = ${JSON.stringify(cities, null, 2)};`,
  '',
  `export const cityBySlug = new Map(cities.map(c => [c.slug, c]));`,
  '',
].join('\n'));

console.log(`Generated ${outPath} with ${(cities as any[]).length} cities.`);
```

- [ ] **Step 4: Add prebuild script to package.json**

Add to `package.json` scripts:
```json
"build:data": "npx tsx scripts/build-city-data.ts",
"prebuild": "npm run build:data",
"predev": "npm run build:data"
```

- [ ] **Step 5: Add src/generated/ to .gitignore**

Append to `.gitignore`:
```
src/generated/
```

- [ ] **Step 6: Run build script and verify output**

Run: `npm run build:data`
Expected: `src/generated/cities.ts` is created with 3 cities.

- [ ] **Step 7: Commit**

```bash
git add src/types.ts data/cities/switzerland.yaml scripts/build-city-data.ts package.json .gitignore
git commit -m "feat: add types, city YAML data, and build script"
```

---

### Task 3: Model — Params Logic

**Files:**
- Create: `src/model/params.ts`, `src/model/params.test.ts`

- [ ] **Step 1: Write tests for computeDiff and hasChanges**

Create `src/model/params.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { computeDiff, hasChanges } from './params';
import type { CityParams } from '../types';

const base: CityParams = {
  raumplanung: 2, bauvorschriften: 2, energetischeVorgaben: 1,
  mietrecht: 1, steuerpolitik: 2, foerderungGemeinnuetzig: 2,
  subventionen: 1, einspracherechte: 2, infrastruktur: 2,
  auslaendischeInvestitionen: 1,
};

describe('computeDiff', () => {
  it('returns empty diff when params are identical', () => {
    expect(computeDiff(base, { ...base })).toEqual({});
  });

  it('returns changed params only', () => {
    const modified = { ...base, raumplanung: 0 as const, mietrecht: 2 as const };
    const diff = computeDiff(base, modified);
    expect(diff).toEqual({
      raumplanung: { from: 2, to: 0 },
      mietrecht: { from: 1, to: 2 },
    });
  });
});

describe('hasChanges', () => {
  it('returns false for identical params', () => {
    expect(hasChanges(base, { ...base })).toBe(false);
  });

  it('returns true when any param differs', () => {
    expect(hasChanges(base, { ...base, steuerpolitik: 0 as const })).toBe(true);
  });
});
```

- [ ] **Step 2: Install vitest and run test to verify it fails**

Run:
```bash
npm install -D vitest
npx vitest run src/model/params.test.ts
```
Expected: FAIL — module not found

- [ ] **Step 3: Implement params.ts**

Create `src/model/params.ts`:
```typescript
import type { CityParams, ParamsDiff, ParamMeta, ContextMeta } from '../types';

const PARAM_KEYS = [
  'raumplanung', 'bauvorschriften', 'energetischeVorgaben', 'mietrecht',
  'steuerpolitik', 'foerderungGemeinnuetzig', 'subventionen',
  'einspracherechte', 'infrastruktur', 'auslaendischeInvestitionen',
] as const;

export function computeDiff(baseline: CityParams, modified: CityParams): ParamsDiff {
  const diff: ParamsDiff = {};
  for (const key of PARAM_KEYS) {
    if (baseline[key] !== modified[key]) {
      diff[key] = { from: baseline[key], to: modified[key] };
    }
  }
  return diff;
}

export function hasChanges(baseline: CityParams, modified: CityParams): boolean {
  return PARAM_KEYS.some(key => baseline[key] !== modified[key]);
}

export const paramMeta: ParamMeta[] = [
  { key: 'raumplanung', label: 'Raumplanung', helpText: 'Zonenpläne, Bauzonen, Ausnützungsziffern', levels: ['locker', 'mittel', 'streng'] },
  { key: 'bauvorschriften', label: 'Bauvorschriften', helpText: 'Brandschutz, Lärmschutz, Parkplatzvorgaben', levels: ['minimal', 'moderat', 'streng'] },
  { key: 'energetischeVorgaben', label: 'Energetische Vorgaben', helpText: 'Dämmung, Heizsysteme, Sanierungspflichten', levels: ['minimal', 'moderat', 'streng'] },
  { key: 'mietrecht', label: 'Mietrecht', helpText: 'Mietpreisbremse, Kündigungsschutz, Renditedeckelung', levels: ['schwach', 'moderat', 'streng'] },
  { key: 'steuerpolitik', label: 'Steuerpolitik', helpText: 'Grundsteuer, Handänderungssteuer, Eigenmietwert', levels: ['niedrig', 'mittel', 'hoch'] },
  { key: 'foerderungGemeinnuetzig', label: 'Förderung Gemeinnützig', helpText: 'Genossenschaften, Baurecht-Vergabe, Vorkaufsrechte', levels: ['keine', 'moderat', 'stark'] },
  { key: 'subventionen', label: 'Subventionen', helpText: 'Wohneigentum, Sanierungszuschüsse, Wohngeld', levels: ['keine', 'moderat', 'stark'] },
  { key: 'einspracherechte', label: 'Einspracherechte', helpText: 'Rekursmöglichkeiten gegen Bauprojekte', levels: ['eingeschränkt', 'normal', 'weitreichend'] },
  { key: 'infrastruktur', label: 'Infrastruktur', helpText: 'ÖV-Ausbau, Strassenanbindung, öffentliche Einrichtungen', levels: ['kein Ausbau', 'moderat', 'stark'] },
  { key: 'auslaendischeInvestitionen', label: 'Ausländische Investitionen', helpText: 'Regulierung von ausländischem Kapital (Lex Koller)', levels: ['offen', 'reguliert', 'restriktiv'] },
];

export const contextMeta: ContextMeta[] = [
  { key: 'zinsniveau', label: 'Zinsniveau', levels: ['sehr niedrig', 'niedrig', 'neutral', 'hoch', 'sehr hoch'] },
  { key: 'zuwanderungsdruck', label: 'Zuwanderung', levels: ['stark sinkend', 'sinkend', 'stabil', 'wachsend', 'stark wachsend'] },
  { key: 'wirtschaftskraft', label: 'Wirtschaftskraft', levels: ['sehr schwach', 'schwach', 'mittel', 'stark', 'sehr stark'] },
  { key: 'bevoelkerungstrend', label: 'Bevölkerung', levels: ['stark sinkend', 'sinkend', 'stabil', 'wachsend', 'stark wachsend'] },
];
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/model/params.test.ts`
Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/model/params.ts src/model/params.test.ts
git commit -m "feat: add params model with computeDiff, hasChanges, and metadata"
```

---

### Task 4: URL State Hook

**Files:**
- Create: `src/hooks/useUrlState.ts`, `src/hooks/useUrlState.test.ts`

- [ ] **Step 1: Write tests**

Create `src/hooks/useUrlState.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parseUrl, buildUrl } from './useUrlState';

describe('parseUrl', () => {
  it('parses city slug from pathname', () => {
    const result = parseUrl('/zuerich', '');
    expect(result.citySlug).toBe('zuerich');
  });

  it('parses param overrides from query string', () => {
    const result = parseUrl('/zuerich', 'raumplanung=0&mietrecht=2');
    expect(result.overrides).toEqual({ raumplanung: 0, mietrecht: 2 });
  });

  it('returns first city slug for root path', () => {
    const result = parseUrl('/', '');
    expect(result.citySlug).toBe('');
  });

  it('ignores invalid param names', () => {
    const result = parseUrl('/zuerich', 'invalid=1&raumplanung=0');
    expect(result.overrides).toEqual({ raumplanung: 0 });
  });

  it('clamps param values to 0-2', () => {
    const result = parseUrl('/zuerich', 'raumplanung=5');
    expect(result.overrides).toEqual({ raumplanung: 2 });
  });
});

describe('buildUrl', () => {
  it('returns slug path with no query when no overrides', () => {
    expect(buildUrl('zuerich', {})).toBe('/zuerich');
  });

  it('appends only changed params as query', () => {
    expect(buildUrl('zuerich', { raumplanung: 0 })).toBe('/zuerich?raumplanung=0');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useUrlState.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement parseUrl and buildUrl**

Create `src/hooks/useUrlState.ts`:
```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useUrlState.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useUrlState.ts src/hooks/useUrlState.test.ts
git commit -m "feat: add URL state hook with parseUrl/buildUrl"
```

---

### Task 5: ParameterSlider Component

**Files:**
- Create: `src/components/ParameterSlider.tsx`, `src/components/ParameterSlider.css`

- [ ] **Step 1: Create ParameterSlider component**

Create `src/components/ParameterSlider.tsx`:
```tsx
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
```

- [ ] **Step 2: Create ParameterSlider styles**

Create `src/components/ParameterSlider.css`:
```css
.param-slider {
  margin-bottom: 20px;
}

.param-slider--changed {
  border-left: 2px solid #ffd43b;
  padding-left: 10px;
}

.param-slider__label {
  font-size: 13px;
  color: #ccc;
  margin-bottom: 2px;
}

.param-slider__help {
  font-size: 10px;
  color: #666;
  margin-bottom: 8px;
}

.param-slider__input {
  width: 100%;
  appearance: none;
  height: 6px;
  background: #222;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.param-slider__input::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.param-slider__levels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}

.param-slider__level {
  font-size: 10px;
  color: #555;
}

.param-slider__level--active {
  color: #ccc;
  font-weight: 600;
}
```

- [ ] **Step 3: Verify it renders in isolation**

Temporarily render `<ParameterSlider>` in App.tsx with hardcoded props. Check in browser that slider snaps to 3 positions, labels highlight correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/ParameterSlider.tsx src/components/ParameterSlider.css
git commit -m "feat: add ParameterSlider component with 3-step snap"
```

---

### Task 6: ContextIndicators, CitySelector, ParameterPanel

**Files:**
- Create: `src/components/ContextIndicators.tsx`, `src/components/CitySelector.tsx`, `src/components/ParameterPanel.tsx`, `src/components/ParameterPanel.css`

- [ ] **Step 1: Create ContextIndicators**

Create `src/components/ContextIndicators.tsx`:
```tsx
import type { CityContext } from '../types';
import { contextMeta } from '../model/params';

interface Props {
  context: CityContext;
}

export function ContextIndicators({ context }: Props) {
  return (
    <div className="context-indicators">
      {contextMeta.map(meta => {
        const value = context[meta.key];
        const levelIndex = value + 2; // -2→0, -1→1, 0→2, +1→3, +2→4
        return (
          <div key={meta.key} className="context-indicator">
            <span className="context-indicator__label">{meta.label}</span>
            <span className="context-indicator__value">{meta.levels[levelIndex]}</span>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create CitySelector**

Create `src/components/CitySelector.tsx`:
```tsx
import { cities } from '../generated/cities';

interface Props {
  currentSlug: string;
  onChange: (slug: string) => void;
}

export function CitySelector({ currentSlug, onChange }: Props) {
  return (
    <select
      value={currentSlug}
      onChange={e => onChange(e.target.value)}
      className="city-selector"
    >
      {cities.map(city => (
        <option key={city.slug} value={city.slug}>{city.name}</option>
      ))}
    </select>
  );
}
```

- [ ] **Step 3: Create ParameterPanel**

Create `src/components/ParameterPanel.tsx`:
```tsx
import type { CityParams, CityContext, ParamValue } from '../types';
import { paramMeta } from '../model/params';
import { hasChanges } from '../model/params';
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
```

- [ ] **Step 4: Create ParameterPanel styles**

Create `src/components/ParameterPanel.css`:
```css
.parameter-panel {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid #222;
  padding: 16px;
  background: #11112a;
  overflow-y: auto;
}

.parameter-panel__header {
  font-size: 13px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.parameter-panel__sliders {
  flex: 1;
}

.parameter-panel__reset {
  width: 100%;
  padding: 8px;
  margin-top: 16px;
  background: transparent;
  border: 1px solid #444;
  color: #888;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.parameter-panel__reset:hover {
  border-color: #666;
  color: #ccc;
}

.context-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #222;
}

.context-indicator {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1 0 45%;
}

.context-indicator__label {
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
}

.context-indicator__value {
  font-size: 11px;
  color: #888;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ContextIndicators.tsx src/components/CitySelector.tsx src/components/ParameterPanel.tsx src/components/ParameterPanel.css
git commit -m "feat: add CitySelector, ContextIndicators, and ParameterPanel"
```

---

### Task 7: TrendArrow and DivergingTrend Widgets

**Files:**
- Create: `src/widgets/TrendArrow.tsx`, `src/widgets/TrendArrow.css`, `src/widgets/DivergingTrend.tsx`, `src/widgets/DivergingTrend.css`

- [ ] **Step 1: Create TrendArrow**

Create `src/widgets/TrendArrow.tsx`:
```tsx
import './TrendArrow.css';

interface Props {
  label: string;
  value: number; // -1 to +1, 0 = neutral
}

const ARROWS: Record<string, string> = {
  up: '\u2197',     // ↗
  flat: '\u2192',   // →
  down: '\u2198',   // ↘
};

function getDirection(value: number) {
  if (value > 0.15) return 'up';
  if (value < -0.15) return 'down';
  return 'flat';
}

function getColor(direction: string) {
  if (direction === 'up') return '#ff6b6b';
  if (direction === 'down') return '#51cf66';
  return '#ffd43b';
}

function getLabel(direction: string) {
  if (direction === 'up') return 'steigend';
  if (direction === 'down') return 'sinkend';
  return 'stabil';
}

export function TrendArrow({ label, value }: Props) {
  const direction = getDirection(value);
  const color = getColor(direction);

  return (
    <div className="trend-arrow">
      <div className="trend-arrow__label">{label}</div>
      <div className="trend-arrow__icon" style={{ color }}>{ARROWS[direction]}</div>
      <div className="trend-arrow__text" style={{ color }}>{getLabel(direction)}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create TrendArrow styles**

Create `src/widgets/TrendArrow.css`:
```css
.trend-arrow {
  background: #13132a;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.trend-arrow__label {
  font-size: 13px;
  color: #888;
  margin-bottom: 12px;
}

.trend-arrow__icon {
  font-size: 36px;
  line-height: 1;
}

.trend-arrow__text {
  font-size: 12px;
  margin-top: 4px;
}
```

- [ ] **Step 3: Create DivergingTrend**

Create `src/widgets/DivergingTrend.tsx`:
```tsx
import './DivergingTrend.css';

interface GroupTrend {
  label: string;
  value: number; // -1 to +1
}

interface Props {
  title: string;
  groups: GroupTrend[];
}

const ARROWS: Record<string, string> = {
  up: '\u2197',
  flat: '\u2192',
  down: '\u2198',
};

function getDirection(value: number) {
  if (value > 0.15) return 'up';
  if (value < -0.15) return 'down';
  return 'flat';
}

function getColor(direction: string) {
  if (direction === 'up') return '#ff6b6b';
  if (direction === 'down') return '#51cf66';
  return '#ffd43b';
}

function getTrendLabel(direction: string, isPrice: boolean) {
  if (direction === 'up') return isPrice ? '+teurer' : 'steigend';
  if (direction === 'down') return isPrice ? '-günstiger' : 'sinkend';
  return 'stabil';
}

export function DivergingTrend({ title, groups }: Props) {
  return (
    <div className="diverging-trend">
      <div className="diverging-trend__title">{title}</div>
      <div className="diverging-trend__groups">
        {groups.map((group, i) => {
          const direction = getDirection(group.value);
          const color = getColor(direction);
          return (
            <div key={i} className="diverging-trend__group">
              {i > 0 && <div className="diverging-trend__separator" />}
              <div className="diverging-trend__arrow" style={{ color }}>{ARROWS[direction]}</div>
              <div className="diverging-trend__label" style={{ color }}>
                {getTrendLabel(direction, true)}
              </div>
              <div className="diverging-trend__group-name">{group.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create DivergingTrend styles**

Create `src/widgets/DivergingTrend.css`:
```css
.diverging-trend {
  background: #13132a;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.diverging-trend__title {
  font-size: 13px;
  color: #888;
  margin-bottom: 12px;
}

.diverging-trend__groups {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.diverging-trend__group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.diverging-trend__separator {
  display: none;
}

.diverging-trend__groups > .diverging-trend__group + .diverging-trend__group::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #333;
}

.diverging-trend__group {
  position: relative;
}

.diverging-trend__arrow {
  font-size: 28px;
  line-height: 1;
}

.diverging-trend__label {
  font-size: 11px;
  margin-top: 2px;
}

.diverging-trend__group-name {
  font-size: 10px;
  color: #666;
  margin-top: 2px;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/widgets/TrendArrow.tsx src/widgets/TrendArrow.css src/widgets/DivergingTrend.tsx src/widgets/DivergingTrend.css
git commit -m "feat: add TrendArrow and DivergingTrend widgets"
```

---

### Task 8: SupplyDemandChart Widget

**Files:**
- Create: `src/widgets/SupplyDemandChart.tsx`, `src/widgets/SupplyDemandChart.css`

- [ ] **Step 1: Create SupplyDemandChart**

Create `src/widgets/SupplyDemandChart.tsx`:
```tsx
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { CityParams, CityContext, ParamsDiff } from '../types';
import './SupplyDemandChart.css';

interface Props {
  context: CityContext;
  baseline: CityParams;
  modified: CityParams;
  diff: ParamsDiff;
}

// Simplified model: compute supply/demand curve shift factors
function computeSupplyShift(params: CityParams, context: CityContext): number {
  // Higher regulation = less supply (negative shift)
  const regulation = -(params.raumplanung + params.bauvorschriften +
    params.energetischeVorgaben + params.einspracherechte) / 8;
  const promotion = (params.foerderungGemeinnuetzig + params.subventionen) / 4;
  const investment = params.auslaendischeInvestitionen === 0 ? 0.1 : params.auslaendischeInvestitionen === 2 ? -0.1 : 0;
  const interest = -context.zinsniveau * 0.05;
  return regulation + promotion + investment + interest;
}

function computeDemandShift(params: CityParams, context: CityContext): number {
  const taxes = -params.steuerpolitik * 0.1;
  const attract = (params.infrastruktur - params.steuerpolitik) * 0.05;
  const subsidy = params.subventionen * 0.05;
  const migration = context.zuwanderungsdruck * 0.1;
  const economy = context.wirtschaftskraft * 0.05;
  const population = context.bevoelkerungstrend * 0.05;
  return taxes + attract + subsidy + migration + economy + population;
}

const MARGIN = { top: 20, right: 20, bottom: 40, left: 50 };
const WIDTH = 500;
const HEIGHT = 200;

export function SupplyDemandChart({ context, baseline, modified, diff }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = WIDTH - MARGIN.left - MARGIN.right;
    const h = HEIGHT - MARGIN.top - MARGIN.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const x = d3.scaleLinear().domain([0, 10]).range([0, w]);
    const y = d3.scaleLinear().domain([0, 10]).range([h, 0]);

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(0))
      .selectAll('text').remove();
    g.append('g')
      .call(d3.axisLeft(y).ticks(0))
      .selectAll('text').remove();

    // Axis labels
    g.append('text').attr('x', w / 2).attr('y', h + 30)
      .attr('text-anchor', 'middle').attr('fill', '#555').attr('font-size', 11)
      .text('Menge');
    g.append('text').attr('transform', 'rotate(-90)')
      .attr('x', -h / 2).attr('y', -35)
      .attr('text-anchor', 'middle').attr('fill', '#555').attr('font-size', 11)
      .text('Preis');

    // Curve generators
    const line = d3.line<[number, number]>()
      .x(d => x(d[0])).y(d => y(d[1]))
      .curve(d3.curveBasis);

    // Baseline shifts
    const baseSupply = computeSupplyShift(baseline, context);
    const baseDemand = computeDemandShift(baseline, context);

    // Modified shifts
    const modSupply = computeSupplyShift(modified, context);
    const modDemand = computeDemandShift(modified, context);

    // Generate curve points: supply goes up-right, demand goes down-right
    function supplyCurve(shift: number): [number, number][] {
      return Array.from({ length: 50 }, (_, i) => {
        const q = (i / 49) * 10;
        const p = 1 + (q + shift * 4) * 0.8;
        return [q, Math.max(0, Math.min(10, p))] as [number, number];
      });
    }

    function demandCurve(shift: number): [number, number][] {
      return Array.from({ length: 50 }, (_, i) => {
        const q = (i / 49) * 10;
        const p = 9 - (q - shift * 4) * 0.8;
        return [q, Math.max(0, Math.min(10, p))] as [number, number];
      });
    }

    // Baseline curves (dashed)
    g.append('path').datum(supplyCurve(baseSupply))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-dasharray', '4');
    g.append('path').datum(demandCurve(baseDemand))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-dasharray', '4');

    // Modified curves (solid, animated)
    const supplyPath = g.append('path').datum(supplyCurve(modSupply))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#4dabf7').attr('stroke-width', 2).attr('opacity', 0);
    const demandPath = g.append('path').datum(demandCurve(modDemand))
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', '#ff6b6b').attr('stroke-width', 2).attr('opacity', 0);

    const hasChanges = Object.keys(diff).length > 0;
    if (hasChanges) {
      supplyPath.transition().duration(600).attr('opacity', 1);
      demandPath.transition().duration(600).attr('opacity', 1);
    }

    // Find equilibrium (approximate intersection)
    function findEquilibrium(supplyShift: number, demandShift: number): [number, number] {
      // supply: p = 1 + (q + shift*4) * 0.8
      // demand: p = 9 - (q - shift*4) * 0.8
      // set equal: 1 + (q + s*4)*0.8 = 9 - (q - d*4)*0.8
      const s = supplyShift, d = demandShift;
      const q = (8 - 0.8 * s * 4 - 0.8 * d * 4) / 1.6 + (s * 4 + d * 4) / 2;
      const qEq = (8 + 0.8 * 4 * (d - s)) / 1.6;
      const pEq = 1 + (qEq + s * 4) * 0.8;
      return [Math.max(0, Math.min(10, qEq)), Math.max(0, Math.min(10, pEq))];
    }

    const [bq, bp] = findEquilibrium(baseSupply, baseDemand);
    const [mq, mp] = findEquilibrium(modSupply, modDemand);

    // Baseline equilibrium
    g.append('line').attr('x1', x(bq)).attr('y1', y(bp)).attr('x2', x(bq)).attr('y2', y(0))
      .attr('stroke', '#555').attr('stroke-dasharray', '3').attr('stroke-width', 1);
    g.append('line').attr('x1', 0).attr('y1', y(bp)).attr('x2', x(bq)).attr('y2', y(bp))
      .attr('stroke', '#555').attr('stroke-dasharray', '3').attr('stroke-width', 1);
    g.append('circle').attr('cx', x(bq)).attr('cy', y(bp)).attr('r', 4).attr('fill', '#555');

    if (hasChanges) {
      // Modified equilibrium
      g.append('line').attr('x1', x(mq)).attr('y1', y(mp)).attr('x2', x(mq)).attr('y2', y(0))
        .attr('stroke', '#ffd43b').attr('stroke-dasharray', '3').attr('stroke-width', 1)
        .attr('opacity', 0).transition().duration(600).attr('opacity', 1);
      g.append('line').attr('x1', 0).attr('y1', y(mp)).attr('x2', x(mq)).attr('y2', y(mp))
        .attr('stroke', '#ffd43b').attr('stroke-dasharray', '3').attr('stroke-width', 1)
        .attr('opacity', 0).transition().duration(600).attr('opacity', 1);
      g.append('circle').attr('cx', x(mq)).attr('cy', y(mp)).attr('r', 5)
        .attr('fill', '#fff').attr('stroke', '#ffd43b').attr('stroke-width', 2)
        .attr('opacity', 0).transition().duration(600).attr('opacity', 1);
    }

    // Legend
    const legend = g.append('g').attr('transform', `translate(${w - 120}, 0)`);
    legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 20).attr('y2', 0)
      .attr('stroke', '#ff6b6b').attr('stroke-width', 2);
    legend.append('text').attr('x', 25).attr('y', 4).attr('fill', '#ff6b6b').attr('font-size', 10).text('Nachfrage');
    legend.append('line').attr('x1', 0).attr('y1', 16).attr('x2', 20).attr('y2', 16)
      .attr('stroke', '#4dabf7').attr('stroke-width', 2);
    legend.append('text').attr('x', 25).attr('y', 20).attr('fill', '#4dabf7').attr('font-size', 10).text('Angebot');
    legend.append('line').attr('x1', 0).attr('y1', 32).attr('x2', 20).attr('y2', 32)
      .attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-dasharray', '4');
    legend.append('text').attr('x', 25).attr('y', 36).attr('fill', '#555').attr('font-size', 10).text('Ist-Zustand');

  }, [context, baseline, modified, diff]);

  return (
    <div className="supply-demand-chart">
      <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
```

- [ ] **Step 2: Create SupplyDemandChart styles**

Create `src/widgets/SupplyDemandChart.css`:
```css
.supply-demand-chart {
  background: #13132a;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 16px;
  grid-column: 1 / 3;
}

.supply-demand-chart svg {
  width: 100%;
  height: auto;
}
```

- [ ] **Step 3: Verify chart renders with test data in browser**

Temporarily render in App.tsx with hardcoded baseline/modified params. Check:
- Dashed baseline curves visible
- Solid modified curves animate in when diff is non-empty
- Equilibrium points and helper lines show

- [ ] **Step 4: Commit**

```bash
git add src/widgets/SupplyDemandChart.tsx src/widgets/SupplyDemandChart.css
git commit -m "feat: add SupplyDemandChart with D3 animated curves"
```

---

### Task 9: OwnershipDonut Widget

**Files:**
- Create: `src/widgets/OwnershipDonut.tsx`, `src/widgets/OwnershipDonut.css`

- [ ] **Step 1: Create OwnershipDonut**

Create `src/widgets/OwnershipDonut.tsx`:
```tsx
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { CityParams, CityContext, ParamsDiff } from '../types';
import './OwnershipDonut.css';

interface Props {
  context: CityContext;
  baseline: CityParams;
  modified: CityParams;
  diff: ParamsDiff;
}

interface OwnershipShares {
  privat: number;
  institutionell: number;
  genossenschaft: number;
  oeffentlich: number;
}

const COLORS = {
  privat: '#4dabf7',
  institutionell: '#845ef7',
  genossenschaft: '#51cf66',
  oeffentlich: '#ffd43b',
};

const LABELS = {
  privat: 'Privat',
  institutionell: 'Instit.',
  genossenschaft: 'Genoss.',
  oeffentlich: 'Öfftl.',
};

function computeOwnership(params: CityParams, context: CityContext): OwnershipShares {
  // Base distribution, adjusted by params
  let privat = 0.40;
  let institutionell = 0.30;
  let genossenschaft = 0.18;
  let oeffentlich = 0.12;

  // Förderung gemeinnützig shifts to coops/public
  const foerderung = params.foerderungGemeinnuetzig * 0.04;
  genossenschaft += foerderung;
  privat -= foerderung * 0.5;
  institutionell -= foerderung * 0.5;

  // Strong Mietrecht reduces institutional
  const mietEffect = params.mietrecht * 0.03;
  institutionell -= mietEffect;
  privat += mietEffect * 0.5;
  genossenschaft += mietEffect * 0.5;

  // Restriktive ausländische Investitionen reduce institutional
  const foreignEffect = params.auslaendischeInvestitionen * 0.02;
  institutionell -= foreignEffect;
  privat += foreignEffect;

  // High Wirtschaftskraft increases institutional
  institutionell += context.wirtschaftskraft * 0.02;
  privat -= context.wirtschaftskraft * 0.02;

  // Normalize to sum = 1
  const total = privat + institutionell + genossenschaft + oeffentlich;
  return {
    privat: Math.max(0.05, privat / total),
    institutionell: Math.max(0.05, institutionell / total),
    genossenschaft: Math.max(0.05, genossenschaft / total),
    oeffentlich: Math.max(0.05, oeffentlich / total),
  };
}

const SIZE = 180;

export function OwnershipDonut({ context, baseline, modified, diff }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${SIZE / 2},${SIZE / 2})`);

    const baseShares = computeOwnership(baseline, context);
    const modShares = computeOwnership(modified, context);
    const hasChanges = Object.keys(diff).length > 0;

    const keys = ['privat', 'institutionell', 'genossenschaft', 'oeffentlich'] as const;

    const pie = d3.pie<number>().sort(null);

    // Inner ring: baseline (always shown)
    const innerArc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(25).outerRadius(42);
    const baseData = keys.map(k => baseShares[k]);
    g.selectAll('.inner')
      .data(pie(baseData))
      .join('path')
      .attr('d', innerArc)
      .attr('fill', (_, i) => COLORS[keys[i]])
      .attr('opacity', hasChanges ? 0.3 : 0.8);

    // Outer ring: modified (only if changes)
    if (hasChanges) {
      const outerArc = d3.arc<d3.PieArcDatum<number>>()
        .innerRadius(48).outerRadius(70);
      const modData = keys.map(k => modShares[k]);
      g.selectAll('.outer')
        .data(pie(modData))
        .join('path')
        .attr('d', outerArc)
        .attr('fill', (_, i) => COLORS[keys[i]])
        .attr('opacity', 0)
        .transition().duration(600).attr('opacity', 0.9);
    }

    // Center text
    if (hasChanges) {
      g.append('text').attr('text-anchor', 'middle').attr('y', -4)
        .attr('fill', '#888').attr('font-size', 8).text('aussen: neu');
      g.append('text').attr('text-anchor', 'middle').attr('y', 8)
        .attr('fill', '#555').attr('font-size', 8).text('innen: ist');
    }

  }, [context, baseline, modified, diff]);

  return (
    <div className="ownership-donut">
      <div className="ownership-donut__title">Eigentümerschaft</div>
      <svg ref={svgRef} viewBox={`0 0 ${SIZE} ${SIZE}`} preserveAspectRatio="xMidYMid meet" />
      <div className="ownership-donut__legend">
        {Object.entries(LABELS).map(([key, label]) => (
          <span key={key} style={{ color: COLORS[key as keyof typeof COLORS] }}>
            {'\u25A0'} {label}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create OwnershipDonut styles**

Create `src/widgets/OwnershipDonut.css`:
```css
.ownership-donut {
  background: #13132a;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.ownership-donut__title {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}

.ownership-donut svg {
  width: 160px;
  height: 160px;
}

.ownership-donut__legend {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
  font-size: 9px;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/widgets/OwnershipDonut.tsx src/widgets/OwnershipDonut.css
git commit -m "feat: add OwnershipDonut with D3 double-donut"
```

---

### Task 10: WidgetGrid and App Assembly

**Files:**
- Create: `src/widgets/WidgetGrid.tsx`
- Modify: `src/App.tsx`, `src/App.css`

- [ ] **Step 1: Create WidgetGrid**

Create `src/widgets/WidgetGrid.tsx`:
```tsx
import type { CityParams, CityContext, ParamsDiff } from '../types';
import { SupplyDemandChart } from './SupplyDemandChart';
import { TrendArrow } from './TrendArrow';
import { DivergingTrend } from './DivergingTrend';
import { OwnershipDonut } from './OwnershipDonut';

interface Props {
  context: CityContext;
  baseline: CityParams;
  modified: CityParams;
  diff: ParamsDiff;
}

// Simplified trend computation from params + context
function computeTrends(baseline: CityParams, modified: CityParams, context: CityContext) {
  const supplyDelta =
    -(modified.raumplanung - baseline.raumplanung) * 0.15 +
    -(modified.bauvorschriften - baseline.bauvorschriften) * 0.1 +
    -(modified.energetischeVorgaben - baseline.energetischeVorgaben) * 0.1 +
    -(modified.einspracherechte - baseline.einspracherechte) * 0.1 +
    (modified.foerderungGemeinnuetzig - baseline.foerderungGemeinnuetzig) * 0.1 +
    (modified.subventionen - baseline.subventionen) * 0.05;

  const demandDelta =
    -(modified.steuerpolitik - baseline.steuerpolitik) * 0.1 +
    (modified.infrastruktur - baseline.infrastruktur) * 0.1 +
    (modified.subventionen - baseline.subventionen) * 0.05 +
    context.zuwanderungsdruck * 0.02;

  // Price trend diverges by income group
  const priceBase = -supplyDelta + demandDelta;
  const priceLow = priceBase + (modified.mietrecht - baseline.mietrecht) * -0.1;
  const priceHigh = priceBase + (modified.mietrecht - baseline.mietrecht) * 0.05;

  return {
    supply: supplyDelta,
    demand: demandDelta,
    priceLow,
    priceHigh,
  };
}

export function WidgetGrid({ context, baseline, modified, diff }: Props) {
  const trends = computeTrends(baseline, modified, context);

  return (
    <div className="widget-grid">
      <SupplyDemandChart
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
      />
      <DivergingTrend
        title="Trend Wohnpreise"
        groups={[
          { label: 'Geringverd.', value: trends.priceLow },
          { label: 'Gutverd.', value: trends.priceHigh },
        ]}
      />
      <TrendArrow label="Trend Nachfrage" value={trends.demand} />
      <TrendArrow label="Trend Angebot" value={trends.supply} />
      <OwnershipDonut
        context={context}
        baseline={baseline}
        modified={modified}
        diff={diff}
      />
    </div>
  );
}
```

- [ ] **Step 2: Wire up App.tsx**

Replace `src/App.tsx` with:
```tsx
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
```

- [ ] **Step 3: Write App.css**

Replace `src/App.css` with:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0f0f1a;
  color: #ccc;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #222;
  background: #13132a;
}

.app__title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.city-selector {
  background: #1a1a3a;
  color: #ccc;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
}

.app__main {
  display: flex;
  flex: 1;
}

.widget-grid {
  flex: 1;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
}
```

- [ ] **Step 4: Clean up main.tsx**

Replace `src/main.tsx` (remove StrictMode double-render which interferes with D3):
```tsx
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

- [ ] **Step 5: Run dev server and verify full app works**

Run: `npm run dev`
Expected:
- App loads at localhost:5173, redirected to /zuerich
- Left panel shows context indicators + 10 sliders
- Right panel shows supply/demand chart, trend arrows, donut
- Changing a slider updates URL and all widgets animate
- City dropdown switches between Zürich/Bern/Lugano
- Reset button appears when params are changed

- [ ] **Step 6: Commit**

```bash
git add src/widgets/WidgetGrid.tsx src/App.tsx src/App.css src/main.tsx
git commit -m "feat: assemble full app with WidgetGrid, ParameterPanel, and URL state"
```

---

### Task 11: Polish and Verify

**Files:**
- Modify: various files for minor fixes

- [ ] **Step 1: Test URL sharing**

1. Change some params in Zürich
2. Copy the URL (e.g. `/zuerich?raumplanung=0&mietrecht=2`)
3. Open in new tab
4. Verify: same city, same params, same visualizations

- [ ] **Step 2: Test browser back/forward**

1. Navigate to /zuerich, change params
2. Navigate to /bern
3. Press back → should return to /zuerich with previous params
4. Press forward → should return to /bern

- [ ] **Step 3: Verify all widget transitions**

For each widget, change a param that affects it and verify:
- SupplyDemandChart: curves animate, new equilibrium appears
- TrendArrow: direction changes
- DivergingTrend: arrows reflect different effects per group
- OwnershipDonut: outer ring appears/changes

- [ ] **Step 4: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 5: Build for production**

Run: `npm run build`
Expected: Build succeeds, `dist/` folder created

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: polish and verify complete prototype"
```
