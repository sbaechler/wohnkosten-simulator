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

// Validate all V2 params are present (41 + mietrecht_kriterium + mietrecht_durchsetzung, CH-012;
// + gemeinnuetzig_ausgleich, 2026-11-16)
const REQUIRED_KEYS = 44;
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
  // Ein grosser Rest zu 1 signalisiert geschätzte Daten (BFS-Proxy statt
  // Grundbuch-Erhebung). Das MUSS via ownershipBaselineEstimated markiert sein,
  // damit das Widget den Schätz-Hinweis zeigt — sonst gaukelt die Grafik eine
  // Präzision vor, die die Daten nicht haben.
  const RESIDUAL_ESTIMATE_THRESHOLD = 0.1; // Rest > 10% ⇒ Schätzung erwartet
  const isEstimated = city.context.ownershipBaselineEstimated === true;
  if (sum < 1 - RESIDUAL_ESTIMATE_THRESHOLD && !isEstimated) {
    throw new Error(
      `${city.slug}: ownershipBaseline-Summe nur ${sum.toFixed(3)} (Rest ${(1 - sum).toFixed(3)}), `
      + `aber ownershipBaselineEstimated ist nicht gesetzt. Entweder Daten vervollständigen `
      + `oder "ownershipBaselineEstimated: true" ergänzen.`,
    );
  }
}

// anteil_altliegenschaft (CH-012): Rohwert als Anteil, keine Stufe. Fehlend ist
// erlaubt («nicht gemessen»); gesetzt muss er in [0, 1] liegen.
for (const city of raw) {
  const anteil = city.context.anteil_altliegenschaft;
  if (anteil === undefined) continue;
  if (typeof anteil !== 'number' || !Number.isFinite(anteil) || anteil < 0 || anteil > 1) {
    throw new Error(`${city.slug}: context.anteil_altliegenschaft muss ein Anteil in [0, 1] sein: ${anteil}`);
  }
}

// mietabstand_neubezug: nur Anzeige (BFS SE 2024). Faktor > 0, Ebene benannt.
for (const city of raw) {
  const abstand = city.context.mietabstand_neubezug;
  if (abstand === undefined) continue;
  if (typeof abstand.faktor !== 'number' || !(abstand.faktor > 0) || !['stadt', 'kanton'].includes(abstand.ebene)) {
    throw new Error(`${city.slug}: context.mietabstand_neubezug braucht faktor > 0 und ebene stadt|kanton`);
  }
}

// mietluecke ist nicht belegt (CH-012). Ein gesetzter Wert muss als Schätzung markiert sein.
for (const city of raw) {
  if (city.context.mietluecke !== undefined && city.context.mietlueckeEstimated !== true) {
    throw new Error(`${city.slug}: context.mietluecke gesetzt ohne "mietlueckeEstimated: true" (CH-012)`);
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
