import path from 'path';
import { PARSERS, SYNC_ORDER } from './registry.mjs';
import { readJson, DATA, UPLOADS, fetchMarkdown } from './lib/utils.mjs';

export async function runSyncSection(section, opts = {}) {
  const cfg = PARSERS[section];
  if (!cfg?.module) throw new Error(`Неизвестный раздел: ${section}`);

  const dryRun = opts.dryRun === true;
  const doFetch = opts.fetch === true;
  let input = opts.input ?? null;

  if (doFetch && cfg.game8Url && cfg.uploadFile) {
    input = path.join(UPLOADS, cfg.uploadFile);
    await fetchMarkdown(cfg.game8Url, input);
  }

  const modPath = cfg.module.startsWith('parsers/')
    ? cfg.module.slice('parsers/'.length)
    : cfg.module;
  const mod = await import(new URL(`./${modPath}`, import.meta.url));

  const result = await mod.run({
    input,
    dryRun,
    onlyMissing: opts.onlyMissing,
    limit: opts.limit ?? 0,
  });

  let payload = null;
  if (!dryRun && !result?.skipped && !result?.error) {
    payload = readPayload(section);
  }

  return {
    section,
    label: cfg.label,
    skipped: Boolean(result?.skipped),
    reason: result?.reason,
    error: result?.error,
    diff: result?.diff,
    count: result?.count ?? 0,
    payload,
    note: cfg.note,
    requiresNetwork: Boolean(cfg.requiresNetwork),
  };
}

function readPayload(section) {
  switch (section) {
    case 'riddles':
      return {
        riddles: {
          clues: readJson(path.join(DATA, 'riddles.clues.json'), []),
          masters: readJson(path.join(DATA, 'riddleMasters.json'), []),
        },
      };
    case 'innerpath': {
      const raw = readJson(path.join(DATA, 'innerWays.json'), { innerWays: [] });
      return {
        innerpath: {
          items: raw.innerWays || [],
          meta: {
            intro: raw.intro,
            upgradeSteps: raw.upgradeSteps,
            explained: raw.explained,
          },
        },
      };
    }
    case 'npcs-locations':
      return { npcLocations: { items: readJson(path.join(DATA, 'aiNpcs.parsed.json'), []) } };
    case 'weapons':
    case 'bosses':
    case 'mystic':
    case 'cooking': {
      const files = {
        weapons: 'parsed/weapons.json',
        bosses: 'parsed/bosses.json',
        mystic: 'parsed/mysticArts.json',
        cooking: 'parsed/recipes.json',
      };
      return { sectionOverrides: { [section]: readJson(path.join(DATA, files[section]), []) } };
    }
    default:
      return null;
  }
}

export async function runSyncSections(sections, opts = {}) {
  const keys = sections?.length ? sections : SYNC_ORDER;
  const results = [];
  for (const key of keys) {
    try {
      results.push(await runSyncSection(key, opts));
    } catch (e) {
      results.push({
        section: key,
        error: e.message,
        label: PARSERS[key]?.label || key,
      });
    }
  }
  return results;
}

export { SYNC_ORDER, PARSERS };
