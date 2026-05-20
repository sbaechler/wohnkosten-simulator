const fs = require('fs');
let content = fs.readFileSync('data/cities/switzerland.yaml', 'utf8');

// Add bau_ersatzneubau_effizienz after bau_sanierungspflicht for all cities
// Zürich (slug: zuerich): 0 (inefficient 2.8x). Others: 1 (moderate)
content = content.replace(
  /(\n  bau_sanierungspflicht: )(\d+)(\n)(\s+bau_einspracherecht_dritte:)/,
  (match, prefix, val, newline, next) => {
    const isZurich = content.includes('slug: zuerich') && content.indexOf(match) < content.indexOf('slug: genf');
    const newVal = val === '2' ? 0 : 1;
    return `${prefix}${val}${newline}  bau_ersatzneubau_effizienz: ${newVal}  # Sotomo 2025: ZH 2.8x, Rest 3-6x\n${next}`;
  }
);

// Add markt_mietbelastungs_grenze at end of params for all cities
// Zürich (infra_wirtschaftsansiedlung: 2): 2 (hoch >30%). Others: 1
const lines = content.split('\n');
const result = [];
let inParams = false;
let lastInfraWirtschaft = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('params:')) inParams = true;
  if (line.trim().startsWith('- slug:') || line.trim() === ']') inParams = false;
  if (line.includes('infra_wirtschaftsansiedlung:')) {
    lastInfraWirtschaft = parseInt(line.match(/(\d+)$/)?.[1] || '1');
  }
  result.push(line);
  // Add markt_mietbelastungs_grenze after infra_wirtschaftsansiedlung at end of each params block
  if (line.match(/^\s+infra_wirtschaftsansiedlung: \d+$/) && i < lines.length - 1) {
    const nextLine = lines[i + 1];
    const isEndOfParams = nextLine.trim() === '' || nextLine.trim().startsWith('- slug:') || nextLine.trim() === ']';
    if (isEndOfParams || nextLine.match(/^\s+"/)) {
      // Only add once per params block
      if (!result.includes('markt_mietbelastungs_grenze:')) {
        const val = lastInfraWirtschaft === 2 ? 2 : 1;
        result.push(`    markt_mietbelastungs_grenze: ${val}  # Sotomo 2025`);
      }
    }
  }
}

// Actually, let me use a cleaner approach - find each city's infra_wirtschaftsansiedlung and add after it
const yaml = require('js-yaml');
const data = yaml.load(content);

for (const city of data) {
  const hasErsatzneubau = city.params.bau_ersatzneubau_effizienz !== undefined;
  if (!hasErsatzneubau) {
    // Add after bau_sanierungspflicht
    city.params.bau_ersatzneubau_effizienz = 1;
  }
  if (city.params.markt_mietbelastungs_grenze === undefined) {
    const isHighLoad = city.params.infra_wirtschaftsansiedlung === 2;
    city.params.markt_mietbelastungs_grenze = isHighLoad ? 2 : 1;
  }
}

fs.writeFileSync('data/cities/switzerland.yaml', yaml.dump(data, { lineWidth: 200, quotingType: '"' }));
console.log('Done');