---
name: update-city-params
description: Validate and update Swiss city parameters for the Wohnkosten-Simulator. Use when city data needs to be refreshed (e.g. new Leerwohnungszählung, changed cantonal laws, new political votes). Searches the web for changes to key indicators per city and updates src/generated/cities.ts + research documentation if values have changed. Commits and pushes the result.
---

# Update City Parameters

Validates the empirical basis for all 10 Swiss cities in `src/generated/cities.ts` and updates values that have changed. Works city by city, parameter group by parameter group.

## Project Paths

- **City data:** `src/generated/cities.ts`
- **Parameter definitions:** `docs/superpowers/specs/parameter-hierarchie.md`
- **Research baseline:** `docs/superpowers/research/staedte-parameter-recherche.md`
- **Wirkungsmodell (ZH/BE/LU):** `docs/superpowers/specs/wirkungsmodell-und-staedtedaten.md`

## Parameter Reference

See `references/parameter-checklist.md` for:
- Which parameters to search for per city
- Key search terms per parameter
- Reliable sources per parameter type

## Workflow

### 1. Load current state

Read `src/generated/cities.ts` to get all current values. Note the last-updated date in the file header.

### 2. Determine scope

Default: validate all 10 cities, all 4 context factors + the 8 most volatile parameter groups.  
Focused run: caller may specify a city, canton, or parameter group to narrow scope.

### 3. Research — for each city

Use `web_search` sequentially (rate limit: 1 req/s, wait 1–2s between calls).

**Always search for:**
1. `[Stadt] Leerwohnungsziffer [current year]` → updates `zuwanderungsdruck`
2. `Kanton [Kanton] Mehrwertabgabe Wohnbauförderung [current year]` → updates `boden_mehrwertabgabe`, `gemeinnuetzig_foerderfonds`
3. `[Stadt] Vorkaufsrecht Volksinitiative [current year]` → updates `boden_vorkaufsrecht`
4. `Kanton [Kanton] Mietrecht Wohnschutz [current year]` → updates `mietrecht_*`
5. `[Stadt] Airbnb Regulierung Kurzzeitvermietung [current year]` → updates `nutzung_kurzzeitvermietung`

**High-volatility parameters** (search every run):
- `zuwanderungsdruck` — changes annually with BFS Leerwohnungszählung (published September)
- `boden_vorkaufsrecht` — changes via Volksinitiative or cantonal law
- `gemeinnuetzig_foerderfonds` — changes when cantons expand/reduce funds
- `bau_sanierungspflicht` — changes with cantonal energy laws
- `mietrecht_kuendigungsschutz` — changes with cantonal housing protection laws

**Stable parameters** (spot-check only):
- `bau_einspracherecht_suspensiv` — federal law, rarely changes
- `kapital_hypothekarregulierung` — FINMA standard, rarely changes
- `steuer_kapitalgewinnprivatpersonen` — federal law, very stable
- `nutzung_zweitwohnungen` — ZWG, rarely changes

### 4. Evaluate changes

For each city/parameter where search results suggest a change:
- Compare found value to current value in cities.ts
- Only update if there is **concrete evidence** (law, vote result, official statistic)
- Mark uncertain findings as [SCHÄTZUNG] in the research doc

### 5. Update files

If any values changed:

**a) Update `src/generated/cities.ts`**
- Change the affected value(s)
- Update the `Last updated` date in the file header comment
- Add a comment above the changed value explaining the change and source

**b) Update research doc**
- Update the relevant city section in `docs/superpowers/research/staedte-parameter-recherche.md`
- Add source URL and date to the changed row
- Update the Leerwohnungsziffer summary table at the bottom if applicable

### 6. Validate

Run `npx tsc --noEmit` to check TypeScript types.  
Run `npx vitest run --reporter=dot` to verify all tests pass.  
Do not commit if tests fail.

### 7. Commit and push

```bash
git add src/generated/cities.ts docs/superpowers/research/staedte-parameter-recherche.md
git commit -m "data: update city parameters [YYYY-MM-DD]

Changes:
- [City]: [param] [old] → [new] ([reason], [source])
- ..."
git push
```

Use conventional commit prefix `data:` for data-only updates.

## Output

After completing the run, report:
- Which cities were checked
- Which parameters changed (city, param, old → new, source)
- Which parameters were validated as unchanged
- Any uncertain findings that need manual review
