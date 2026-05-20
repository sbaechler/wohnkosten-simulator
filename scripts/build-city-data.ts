import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { load } from 'js-yaml';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { CityConfig } from '../src/types';

const __dirname = dirname(fileURLToPath(import.meta.url));

const yamlPath = resolve(__dirname, '../data/cities/switzerland.yaml');
const outPath = resolve(__dirname, '../src/generated/cities.ts');

const raw = load(readFileSync(yamlPath, 'utf-8')) as CityConfig[];

if (!Array.isArray(raw)) {
  throw new Error(`Expected YAML root to be an array, got ${typeof raw}`);
}

// Validate all 42 V2 params are present (40 original + 2 from Sotomo 2025)
const REQUIRED_KEYS = 42;
for (const city of raw) {
  const keys = Object.keys(city.params);
  if (keys.length !== REQUIRED_KEYS) {
    throw new Error(`${city.slug}: expected ${REQUIRED_KEYS} params, got ${keys.length}`);
  }
}

mkdirSync(dirname(outPath), { recursive: true });

writeFileSync(outPath, [
  '// AUTO-GENERATED — do not edit. Run: npm run build:data',
  `import type { CityConfig } from '../types';`,
  '',
  `export const cities: CityConfig[] = ${JSON.stringify(raw, null, 2)};`,
  '',
  `export const cityBySlug = new Map(cities.map(c => [c.slug, c]));`,
  '',
].join('\n'));

console.log(`Generated ${outPath} with ${raw.length} cities.`);
