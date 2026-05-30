import type { AiNpc } from '../data/aiNpcs.meta';

let builtinCache: AiNpc[] | null = null;

/** Ленивая загрузка большого списка NPC (отдельный chunk). */
export async function loadBuiltinNpcs(): Promise<AiNpc[]> {
  if (!builtinCache) {
    const mod = await import('../data/aiNpcs');
    builtinCache = mod.aiNpcs;
  }
  return builtinCache;
}
