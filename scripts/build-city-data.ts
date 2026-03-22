import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { load } from 'js-yaml';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { migrateParamsV1ToV2 } from '../src/model/params';
import type { CityParams } from '../src/types';

const __dirname = dirname(fileURLToPath(import.meta.url));

const yamlPath = resolve(__dirname, '../data/cities/switzerland.yaml');
const outPath = resolve(__dirname, '../src/generated/cities.ts');

const raw = load(readFileSync(yamlPath, 'utf-8')) as Array<{
  slug: string;
  name: string;
  context: { zinsniveau: number; zuwanderungsdruck: number; wirtschaftskraft: number; bevoelkerungstrend: number };
  params: CityParams;
}>;

if (!Array.isArray(raw)) {
  throw new Error(`Expected YAML root to be an array, got ${typeof raw}`);
}

// Migrate V1 → V2
const cities = raw.map(c => ({
  slug: c.slug,
  name: c.name,
  context: c.context,
  params: migrateParamsV1ToV2(c.params),
}));

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

console.log(`Generated ${outPath} with ${cities.length} cities.`);
