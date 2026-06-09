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

// Validate all 41 V2 params are present (40 original + bau_ersatzneubau_effizienz from Sotomo 2025)
const REQUIRED_KEYS = 41;
for (const city of raw) {
  const keys = Object.keys(city.params);
  if (keys.length !== REQUIRED_KEYS) {
    throw new Error(`${city.slug}: expected ${REQUIRED_KEYS} params, got ${keys.length}`);
  }
  
  // Add default ownershipBaseline if missing
  if (!city.ownershipBaseline || typeof city.ownershipBaseline !== 'object') {
    city.ownershipBaseline = {
      privat: 0.39,
      institutionell: 0.30,
      genossenschaft: 0.175,
      oeffentlich: 0.066
    };
  }
}

// Add default ownershipBaseline to context if missing
for (const city of raw) {
  if (!city.context.ownershipBaseline || typeof city.context.ownershipBaseline !== 'object') {
    city.context.ownershipBaseline = {
      privat: 0.39,
      institutionell: 0.30,
      genossenschaft: 0.175,
      oeffentlich: 0.066
    };
  }
}

// Remove ownershipBaseline from YAML output (it's only in TypeScript)
for (const city of raw) {
  delete (city as any).ownershipBaseline;
}

// Add default ownershipBaseline to context if missing
for (const city of raw) {
  if (!city.context.ownershipBaseline || typeof city.context.ownershipBaseline !== 'object') {
    city.context.ownershipBaseline = {
      privat: 0.39,
      institutionell: 0.30,
      genossenschaft: 0.175,
      oeffentlich: 0.066
    };
  }
}

// Add default ownershipBaseline to context if missing (only in generated TS)
for (const city of raw) {
  if (!city.context.ownershipBaseline || typeof city.context.ownershipBaseline !== 'object') {
    city.context.ownershipBaseline = {
      privat: 0.39,
      institutionell: 0.30,
      genossenschaft: 0.175,
      oeffentlich: 0.066
    };
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
