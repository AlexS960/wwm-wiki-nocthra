/** Финальная подготовка полей для UI (без подстановки английского в русские поля) */

import { hasCyrillic, WEAPON_NAME_RU, RIDDLE_MASTER_RU } from './translate-fields.mjs';

function splitList(s) {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  return String(s)
    .split(/[,;\n]/)
    .map(x => x.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

export function normalizePayloadForUi(section, payload) {
  if (!payload) return payload;

  if (payload.riddles) {
    return {
      ...payload,
      riddles: {
        ...payload.riddles,
        clues: (payload.riddles.clues || []).map(c => ({
          ...c,
          primaryAnswer: c.primaryAnswer || c.answers?.[0] || '',
        })),
        masters: (payload.riddles.masters || []).map(m => ({
          ...m,
          nameRu:
            (m.nameRu && hasCyrillic(m.nameRu) ? m.nameRu : null)
            || RIDDLE_MASTER_RU[m.nameEn]
            || '',
        })),
        clues: (payload.riddles.clues || []).map(c => ({
          ...c,
          clueRu: c.clueRu && hasCyrillic(c.clueRu) ? c.clueRu : '',
        })),
      },
    };
  }

  if (payload.innerpath?.items) {
    return {
      ...payload,
      innerpath: {
        ...payload.innerpath,
        items: payload.innerpath.items.map(item => ({
          ...item,
          nameRu: hasCyrillic(item.nameRu) ? item.nameRu : '',
          effectRu: hasCyrillic(item.effectRu) ? item.effectRu : '',
          howToGetRu: hasCyrillic(item.howToGetRu) ? item.howToGetRu : '',
        })),
      },
    };
  }

  if (payload.npcLocations?.items) {
    return {
      ...payload,
      npcLocations: {
        ...payload.npcLocations,
        items: payload.npcLocations.items.map(n => ({
          ...n,
          nameRu: n.nameRu || n.nameEn,
          locationDetailRu: hasCyrillic(n.locationDetailRu) ? n.locationDetailRu : '',
        })),
      },
    };
  }

  if (payload.sectionOverrides) {
    const key = Object.keys(payload.sectionOverrides)[0];
    const list = payload.sectionOverrides[key] || [];
    return {
      ...payload,
      sectionOverrides: {
        [key]: list.map(item => {
          const name =
            (hasCyrillic(item.name) ? item.name : null)
            || WEAPON_NAME_RU[item.nameEn]
            || item.name
            || item.nameEn;
          return {
            ...item,
            name,
            description: hasCyrillic(item.description) ? item.description : (item.description || ''),
          };
        }),
      },
    };
  }

  return payload;
}
