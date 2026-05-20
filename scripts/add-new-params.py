#!/usr/bin/env python3
import yaml

with open('data/cities/switzerland.yaml', 'r') as f:
    data = yaml.safe_load(f)

for city in data:
    # Add bau_ersatzneubau_effizienz after bau_sanierungspflicht
    if 'bau_ersatzneubau_effizienz' not in city['params']:
        city['params']['bau_ersatzneubau_effizienz'] = 0 if city['slug'] == 'zuerich' else 1
    # Add markt_mietbelastungs_grenze
    if 'markt_mietbelastungs_grenze' not in city['params']:
        is_high = city['params'].get('infra_wirtschaftsansiedlung', 1) == 2
        city['params']['markt_mietbelastungs_grenze'] = 2 if is_high else 1

with open('data/cities/switzerland.yaml', 'w') as f:
    yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False, line_width=200)

print(f'Updated {len(data)} cities')