import { readFileSync, writeFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const yamlPath = resolve(__dirname, '../data/cities/switzerland.yaml');

const data = load(readFileSync(yamlPath, 'utf-8')) as any[];

for (const city of data) {
  // Add bau_ersatzneubau_effizienz after bau_sanierungspflicht
  if (city.params.bau_ersatzneubau_effizienz === undefined) {
    city.params.bau_ersatzneubau_effizienz = city.slug === 'zuerich' ? 0 : 1;
  }
  // Add markt_mietbelastungs_grenze
  if (city.params.markt_mietbelastungs_grenze === undefined) {
    const isHighLoad = city.params.infra_wirtschaftsansiedlung === 2;
    city.params.markt_mietbelastungs_grenze = isHighLoad ? 2 : 1;
  }
}

writeFileSync(yamlPath, [
  '# Swiss cities with >40k inhabitants',
  '# Research source: staedte-parameter-recherche.md',
  '# Generated: npm run build:data',
  '# Last updated: 2026-05-20',
  '# New params: bau_ersatzneubau_effizienz, markt_mietbelastungs_grenze (Sotomo ZH-Wohnraumstudie 2025)',
  '',
  ...data.map((city: any) => {
    const ctx = city.context;
    const params = city.params;
    const ctxLines = Object.entries(ctx).map(([k, v]) => `    ${k}: ${v}`).join('\n');
    const paramLines = Object.entries(params).map(([k, v]) => `    ${k}: ${v}`).join('\n');
    return `- slug: ${city.slug}
  name: "${city.name}"
  context:
${ctxLines}
  params:
${paramLines}`;
  }),
  '',
].join('\n'));

console.log(`Updated ${data.length} cities with new params.`);