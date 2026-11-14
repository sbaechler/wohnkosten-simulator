import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { renderEdgeDoc } from '../src/model/edge-doc';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../docs/architektur/01-graph-kanten.md');

writeFileSync(outPath, renderEdgeDoc(), 'utf-8');
console.log(`Generated ${outPath}`);
