#!/usr/bin/env python3
import os

test_dir = '/Volumes/projects/wohnkosten-simulator/src/model/__tests__'
root_test = '/Volumes/projects/wohnkosten-simulator/src/model/params.test.ts'
files = [os.path.join(test_dir, f) for f in os.listdir(test_dir) if f.endswith('.test.ts')]
files.append(root_test)

NEW_PARAMS = '\n    bau_ersatzneubau_effizienz: 1,\n    markt_mietbelastungs_grenze: 1,'

for filepath in files:
    with open(filepath) as f:
        content = f.read()
    
    if 'bau_ersatzneubau_effizienz' in content:
        print(f'Skip (already patched): {os.path.basename(filepath)}')
        continue
    
    # The params object ends with: infra_wirtschaftsansiedlung: N,\n}
    # Find the last occurrence of this pattern
    idx = content.rfind('infra_wirtschaftsansiedlung: ')
    if idx == -1:
        print(f'No match: {os.path.basename(filepath)}')
        continue
    
    # Find the comma after the number
    comma_idx = content.find(',', idx)
    if comma_idx == -1:
        print(f'No comma after param: {os.path.basename(filepath)}')
        continue
    
    # Find the closing brace
    brace_idx = content.find('}', comma_idx)
    if brace_idx == -1:
        print(f'No closing brace: {os.path.basename(filepath)}')
        continue
    
    new_content = content[:comma_idx+1] + NEW_PARAMS + content[brace_idx:]
    with open(filepath, 'w') as f:
        f.write(new_content)
    print(f'Patched: {os.path.basename(filepath)}')

print('Done.')