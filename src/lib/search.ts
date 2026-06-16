import type { GuideArticle, WikiArticle } from '../types/site';
import type { AiNpc } from '../data/aiNpcs.meta';
import type { RiddleClue, RiddleMaster } from '../data/riddles';
import { WIKI_SECTION_LABELS } from '../data/sections';

export interface SearchResult {
  id: string;
  type: 'guide' | 'wiki';
  title: string;
  summary: string;
  section?: string;
  sectionLabel?: string;
  icon: string;
  navigateTo: string;
}

let extrasPromise: Promise<{
  riddleMasters: RiddleMaster[];
  riddleClues: RiddleClue[];
}> | null = null;

function loadSearchExtras() {
  if (!extrasPromise) {
    extrasPromise = import('../data/riddles').then(riddles => ({
      riddleMasters: riddles.riddleMasters,
      riddleClues: riddles.riddleClues,
    }));
  }
  return extrasPromise;
}

export function preloadSearchExtras(): void {
  void loadSearchExtras();
}

function searchCore(
  q: string,
  guides: GuideArticle[],
  wiki: WikiArticle[],
  npcs: AiNpc[],
  riddleMasters: RiddleMaster[],
  riddleClues: RiddleClue[],
  limit: number,
  sectionLabels: Record<string, string> = WIKI_SECTION_LABELS,
): SearchResult[] {
  const results: SearchResult[] = [];

  for (const g of guides) {
    const hay = `${g.title} ${g.summary} ${g.content} ${g.category}`.toLowerCase();
    if (!hay.includes(q)) continue;
    results.push({
      id: g.id,
      type: 'guide',
      title: g.title,
      summary: g.summary || g.category,
      icon: g.icon,
      navigateTo: 'guides',
    });
  }

  for (const w of wiki) {
    const hay = `${w.title} ${w.content} ${w.fields?.summary || ''} ${w.fields?.category || ''}`.toLowerCase();
    if (!hay.includes(q)) continue;
    results.push({
      id: w.id,
      type: 'wiki',
      title: w.title,
      summary: w.fields?.summary || w.content.slice(0, 120),
      section: w.section,
      sectionLabel: sectionLabels[w.section] || w.section,
      icon: w.icon,
      navigateTo: w.section,
    });
  }

  for (const n of npcs) {
    const hay = `${n.nameRu} ${n.nameEn} ${n.locationTitle} ${n.subregion} ${n.locationDetail}`.toLowerCase();
    if (!hay.includes(q)) continue;
    results.push({
      id: n.id,
      type: 'wiki',
      title: n.nameRu,
      summary: `${n.locationTitle} · ${n.regionLabelRu}`,
      section: 'npcs',
      sectionLabel: WIKI_SECTION_LABELS.npcs,
      icon: n.icon,
      navigateTo: 'npcs',
    });
  }

  for (const m of riddleMasters) {
    const hay = `${m.nameRu} ${m.nameEn} ${m.locationTitle} ${m.subregion}`.toLowerCase();
    if (!hay.includes(q)) continue;
    results.push({
      id: m.id,
      type: 'wiki',
      title: m.nameRu,
      summary: `Загадочник · ${m.locationTitle}`,
      section: 'riddles',
      sectionLabel: WIKI_SECTION_LABELS.riddles,
      icon: '🧩',
      navigateTo: 'riddles',
    });
  }

  for (const c of riddleClues) {
    const hay = `${c.clueEn} ${c.answers.join(' ')}`.toLowerCase();
    if (!hay.includes(q)) continue;
    results.push({
      id: c.id,
      type: 'wiki',
      title: c.clueEn,
      summary: c.primaryAnswer || c.answers[0] || '—',
      section: 'riddles',
      sectionLabel: WIKI_SECTION_LABELS.riddles,
      icon: '❓',
      navigateTo: 'riddles',
    });
    if (results.length >= limit) break;
  }

  return results.slice(0, limit);
}

export async function searchSite(
  query: string,
  guides: GuideArticle[],
  wiki: WikiArticle[],
  npcs: AiNpc[] = [],
  limit = 20,
  sectionLabels: Record<string, string> = WIKI_SECTION_LABELS,
): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const { riddleMasters, riddleClues } = await loadSearchExtras();
  return searchCore(q, guides, wiki, npcs, riddleMasters, riddleClues, limit, sectionLabels);
}
