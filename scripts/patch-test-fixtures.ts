#!/usr/bin/env node
// Add missing new params to all test fixture objects
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TEST_DIR = resolve(__dirname, '../src/model/__tests__');
const ROOT_TEST = resolve(__dirname, '../src/model/params.test.ts');
const FILES = [
  ...readdirSync(TEST_DIR).filter(f => f.endsWith('.test.ts')).map(f => resolve(TEST_DIR, f)),
  ROOT_TEST,
];

const NEW_PARAMS = `
    bau_ersatzneubau_effizienz: 1,
    markt_mietbelastungs_grenze: 1,`;

for (const file of FILES) {
  let content = readFileSync(file, 'utf8');
  const hasNewParams = content.includes('bau_ersatzneubau_effizienz');
  if (hasNewParams) continue;

  // Inject after the last param in FULL_PARAMS-like blocks
  // Find the param that's before the closing of the params object
  let modified = false;
  
  // Pattern: find 'infra_wirtschaftsansiedlung: X' followed by newlines and closing brace/blank
  content = content.replace(
    /(\n  infra_wirtschaftsansiedlung: \d+)(\s*\n\s*\})/g,
    (match, line, rest) => {
      modified = true;
      return `${line},${NEW_PARAMS}${rest}`;
    }
  );

  if (modified) {
    writeFileSync(file, content);
    console.log(`Patched: ${file}`);
  }
}

console.log('Done.');