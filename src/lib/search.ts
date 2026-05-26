import type { GuideArticle, WikiArticle } from '../context/AuthContext';
import { aiNpcs } from '../data/aiNpcs';
import { riddleClues, riddleMasters } from '../data/riddles';

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

const WIKI_SECTION_LABELS: Record<string, string> = {
  weapons: 'Оружие',
  builds: 'Билды',
  sects: 'Секты',
  bosses: 'Боссы',
  mystic: 'Мистические арты',
  map: 'Карта',
  cooking: 'Готовка',
  tips: 'Советы',
  lifeskills: 'Жизненные навыки',
  npcs: 'NPC',
  riddles: 'Загадки',
};

export function searchSite(
  query: string,
  guides: GuideArticle[],
  wiki: WikiArticle[],
  limit = 20
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

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
      sectionLabel: WIKI_SECTION_LABELS[w.section] || w.section,
      icon: w.icon,
      navigateTo: w.section,
    });
  }

  for (const n of aiNpcs) {
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

  if (q.length >= 2) {
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
  }

  return results.slice(0, limit);
}
