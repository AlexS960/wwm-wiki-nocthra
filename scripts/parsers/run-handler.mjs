import path from 'path';
import { PARSERS, SYNC_ORDER } from './registry.mjs';
import { readJson, DATA, BUNDLED_DATA, UPLOADS, fetchMarkdown, archiveIdFromUrl, isServerless } from './lib/utils.mjs';
import { discoverSourcesFromWiki, DEFAULT_WIKI_URL } from './lib/game8-discover.mjs';
import { normalizePayloadForUi } from './lib/normalize-payload.mjs';

import * as innerWaysMod from './inner-ways.mjs';
import * as riddlesMod from './riddles.mjs';
import * as npcLocationsMod from './npc-locations.mjs';
import * as npcDialoguesMod from './npc-dialogues.mjs';
import * as npcBundleMod from './npc-bundle.mjs';
import * as weaponsMod from './weapons.mjs';
import * as bossesMod from './bosses.mjs';
import * as mysticArtsMod from './mystic-arts.mjs';
import * as cookingMod from './cooking.mjs';

const PARSER_MODULES = {
  'inner-ways.mjs': innerWaysMod,
  'riddles.mjs': riddlesMod,
  'npc-locations.mjs': npcLocationsMod,
  'npc-dialogues.mjs': npcDialoguesMod,
  'npc-bundle.mjs': npcBundleMod,
  'weapons.mjs': weaponsMod,
  'bosses.mjs': bossesMod,
  'mystic-arts.mjs': mysticArtsMod,
  'cooking.mjs': cookingMod,
};

async function resolveSourceUrl(section, opts) {
  const cfg = PARSERS[section];
  const manual = (opts.sourceUrls?.[section] || opts.sourceUrl || '').trim();
  if (manual) return { url: manual, discovered: null };

  if (opts.autoDiscover) {
    if (!opts._discoverCache?.value) {
      opts._discoverCache = opts._discoverCache || { value: null };
      opts._discoverCache.value = await discoverSourcesFromWiki(opts.wikiUrl || DEFAULT_WIKI_URL);
    }
    const hit = opts._discoverCache.value?.sources?.[section];
    if (hit?.url) return { url: hit.url, discovered: hit };
  }

  return { url: cfg?.game8Url || '', discovered: null };
}

export async function runSyncSection(section, opts = {}) {
  const cfg = PARSERS[section];
  if (!cfg?.module) throw new Error(`Неизвестный раздел: ${section}`);

  const dryRun = opts.dryRun === true;
  const doFetch = opts.fetch === true;
  let input = opts.input ?? null;

  const { url: sourceUrl, discovered } = await resolveSourceUrl(section, opts);
  if (doFetch) {
    if (!sourceUrl) {
      throw new Error(`Нет URL для раздела «${cfg.label}». Укажите ссылку в настройках парсера.`);
    }
    const archiveId = archiveIdFromUrl(sourceUrl);
    const fname = archiveId ? `${archiveId}.md` : (cfg.uploadFile || `${section}.md`);
    input = path.join(UPLOADS, fname);
    await fetchMarkdown(sourceUrl, input);
  }

  const modPath = cfg.module.startsWith('parsers/')
    ? cfg.module.slice('parsers/'.length)
    : cfg.module;
  const mod = PARSER_MODULES[modPath];
  if (!mod?.run) throw new Error(`Модуль парсера не найден: ${modPath}`);

  const result = await mod.run({
    input,
    dryRun,
    onlyMissing: opts.onlyMissing,
    limit: opts.limit ?? 0,
  });

  let payload = null;
  if (!dryRun && !result?.skipped && !result?.error) {
    payload = readPayload(section);
    if (payload && isPayloadEmpty(payload)) payload = null;

    if (payload) {
      if (section === 'riddles') {
        payload = normalizePayloadForUi(section, payload);
      } else {
        const { applyRuleBasedTranslation } = await import('./lib/translate-fields.mjs');
        payload = normalizePayloadForUi(section, applyRuleBasedTranslation(payload));
      }
    }
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
    sourceUrl,
    discovered,
    note: cfg.note,
    requiresNetwork: Boolean(cfg.requiresNetwork),
  };
}

function isPayloadEmpty(payload) {
  if (!payload) return true;
  if (payload.riddles) return !payload.riddles.clues?.length && !payload.riddles.masters?.length;
  if (payload.innerpath) return !payload.innerpath.items?.length;
  if (payload.npcLocations) return !payload.npcLocations.items?.length;
  if (payload.sectionOverrides) {
    return !Object.values(payload.sectionOverrides).some(arr => arr?.length);
  }
  return true;
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
      const items = readJson(path.join(DATA, files[section]), []);
      if (!items.length) return null;
      return { sectionOverrides: { [section]: items } };
    }
    default:
      return null;
  }
}

export async function runSyncSections(sections, opts = {}) {
  const keys = sections?.length ? sections : SYNC_ORDER;
  const sourceUrls = opts.sourceUrls || {};
  const discoverCache = { value: null };
  const results = [];
  for (const key of keys) {
    try {
      results.push(await runSyncSection(key, {
        ...opts,
        sourceUrl: sourceUrls[key] || opts.sourceUrl,
        _discoverCache: discoverCache,
      }));
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

export { SYNC_ORDER, PARSERS, isServerless, BUNDLED_DATA };

export const SAFE_SYNC_ORDER = ['riddles', 'innerpath', 'npcs-locations'];
