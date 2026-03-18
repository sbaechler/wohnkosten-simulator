import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { load } from 'js-yaml';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
