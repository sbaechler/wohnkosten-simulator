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
}

// Validate ownershipBaseline: must be defined per city inside `context` —
// a silent default would ship wrong data for the OwnershipDonut.
const OWNERSHIP_KEYS = ['privat', 'institutionell', 'genossenschaft', 'oeffentlich'] as const;
for (const city of raw) {
  const ob = city.context?.ownershipBaseline;
  if (!ob || typeof ob !== 'object') {
    throw new Error(`${city.slug}: context.ownershipBaseline fehlt (muss unter "context:" stehen, nicht auf Stadt-Ebene)`);
  }
  for (const key of OWNERSHIP_KEYS) {
    const v = ob[key];
    if (typeof v !== 'number' || v <= 0 || v > 1) {
      throw new Error(`${city.slug}: context.ownershipBaseline.${key} fehlt oder ausserhalb (0, 1]: ${v}`);
    }
  }
  const sum = OWNERSHIP_KEYS.reduce((acc, k) => acc + ob[k], 0);
  if (sum > 1.001) {
    throw new Error(`${city.slug}: ownershipBaseline-Summe > 1 (${sum.toFixed(3)})`);
  }
  // Anteile < 1 sind erlaubt (Rest = übrige Eigentumsformen), aber grobe Ausreisser melden
  if (sum < 0.5) {
    console.warn(`WARN ${city.slug}: ownershipBaseline-Summe nur ${sum.toFixed(3)} — Datenlücke?`);
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
