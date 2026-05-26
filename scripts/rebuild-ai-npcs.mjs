import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parsed = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/aiNpcs.parsed.json'), 'utf8'));
const dialogues = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/aiNpcs.dialogues.json'), 'utf8'));

const NAME_RU = {
  'An Lexi': 'Ань Лекси',
  'An Lingrong': 'Ань Линьжун',
  Angler: 'Рыбак',
  'Auntie Tian': 'Тётя Тянь',
  Bailan: 'Бай Лань',
  'Barn Rat': 'Амбарная крыса',
  'Beggar Liu': 'Попрошайка Лю',
  Bodhi: 'Бодхи',
  'Boss Qian': 'Босс Цянь',
  'Bu Jiefeng': 'Бу Цзефэн',
  'Bu Jiujie': 'Бу Цзюцзе',
  'Burrowing Rat': 'Крот-землекоп',
  'Cao Jinyang': 'Цао Цзиньян',
  'Chai Bakun': 'Чай Бакун',
  'Chai Jiudui': 'Чай Цзюдуй',
  'Chai Sansheng': 'Чай Саньшэн',
  'Chai Shipi': 'Чай Шипи',
  'Chu Yuan': 'Чу Юань',
  'Cui Qingquan': 'Цуй Цинцюань',
  Daozheng: 'Даочжэн',
  Dog: 'Собака',
  'Elder Zhou': 'Старейшина Чжоу',
  'Embroidered Rat': 'Вышитая крыса',
  'Fan Qicha': 'Фан Цича',
  'Fang Xu': 'Фан Сюй',
  'Feng Rusong': 'Фэн Жусун',
  'Feng Shishi': 'Фэн Шиши',
  'Fluffy Cat': 'Пушистый кот',
  'Fu Lubao': 'Фу Лубао',
  'Fu Lushou': 'Фу Лушоу',
  'Gong Ge': 'Гун Гэ',
  'Gu Yuehu': 'Гу Юэху',
  'Guan Dayan': 'Гуань Даянь',
  'Guan Wei': 'Гуань Вэй',
  'Hai Changchong': 'Хай Чанчун',
  'Hao Jiu': 'Хао Цзю',
  'He Ruiyang': 'Хэ Жуйян',
  'Hong Yang': 'Хун Ян',
  'Hu Da': 'Ху Да',
  Hunter: 'Охотник',
  'Jiang Li': 'Цзян Ли',
  'Jiang Nanyi': 'Цзян Наньи',
  'Jiang Shiqi': 'Цзян Шицы',
  'Jiang Yulang': 'Цзян Юлан',
  'Jin Chunniang': 'Цзинь Чуньнян',
  'Jin Nanshou': 'Цзинь Наньшоу',
  'Jin Xiaobao': 'Цзинь Сяобао',
  'Jing Chaoyang': 'Цзин Чаоян',
  "Jing'an": 'Цзинъань',
  Jingyi: 'Цзиньи',
  'Kang Bao': 'Кан Бао',
  'Kid Wei': 'Малыш Вэй',
  'Lan Huahua': 'Лань Хуахуа',
  'Leng Dancui': 'Лэн Даньцуй',
  'Li Daniu': 'Ли Данью',
  'Li Laizuo': 'Ли Лаизо',
  'Li Shaokui': 'Ли Шаокуй',
  'Li Youxin': 'Ли Юсинь',
  'Li Yueniang': 'Ли Юэнян',
  'Li Yuerong': 'Ли Юэрон',
  'Liang Chenghong': 'Лян Чэнхун',
  'Lie Buxi': 'Ле Буси',
  'Lin Jin': 'Линь Цзинь',
  'Liu Heiqui': 'Лю Хэйцуй',
  'Liu the Woodcutter': 'Лю Дровосек',
  'Liu Zhishuang': 'Лю Чжишуан',
  'Lu Kangge': 'Лу Канге',
  'Lu Sheng': 'Лу Шэн',
  'Lu Zhuo': 'Лу Чжо',
  'Ma Zhongwu': 'Ма Чжуну',
  'Mao the Miser': 'Мао Скупец',
  Matchmaker: 'Сваха',
  'Mei Zhaole': 'Мэй Чжаолэ',
  'Meng Da': 'Мэн Да',
  'Meng Zhixia': 'Мэн Чжися',
  Miaojue: 'Мяоцзюэ',
  'Mo Yuer': 'Мо Юэр',
  'Mountain Dweller': 'Горный отшельник',
  'Mr. Qiao': 'Господин Цяо',
  'Mu Huaishan': 'Му Хуайшань',
  'Mu Laosan': 'Му Лаосань',
  'Murong Chan': 'Мурон Чань',
  'Nan Zhibing': 'Нань Чжибин',
  'Niu Ma': 'Ню Ма',
  'Niu Sanqi': 'Ню Саньци',
  'Pan Faxin': 'Пань Фасинь',
  'Pan Xinniang': 'Пань Синьнян',
  'Pei Mao': 'Пэй Мао',
  'Pip Rat': 'Крыса Пип',
  'Qi Gai': 'Ци Гай',
  'Qi Wuyu': 'Ци Уюй',
  'Qin Caiwei': 'Цинь Цайвэй',
  'Qin Zhu': 'Цинь Чжу',
  'Qiu Fengxi': 'Цю Фэнси',
  'Rafter Rat': 'Чердачная крыса',
  'Ren Shuiliu': 'Жэнь Шуйлю',
  'Ruan Sese': 'Жуань Сэсэ',
  'Shan Yinjiang': 'Шань Иньцзян',
  'Shen Moxuan': 'Шэнь Мосюань',
  'Shen Weiqing': 'Шэнь Вэйцин',
  'Shi Jingtian': 'Ши Цзиньтянь',
  'Shi the Boatman': 'Ши Лодочник',
  'Shui Changliu': 'Шуй Чанлю',
  'Small Chisel': 'Малый Зубило',
  'Song Shiheng': 'Сун Шиһэн',
  'Song Wu': 'Сун У',
  'Su Xinlu': 'Су Синьлу',
  'Sun Mang': 'Сунь Ман',
  'Tan Xiangchen': 'Тань Сянчэнь',
  'Tang Lubao': 'Тан Лубао',
  Tanxiang: 'Тань Сян',
  'Tao Jingjing': 'Тао Цзинцзин',
  'Tao Wang': 'Тао Ван',
  'Tian Heng': 'Тянь Хэн',
  'Tu Er': 'Ту Эр',
  'Uncle Mi': 'Дядя Ми',
  'Wang Duobao': 'Ван Дуобао',
  'Wang Duoli': 'Ван Дуоли',
  'Wang Duolu': 'Ван Дуолу',
  'Wen Gao': 'Вэнь Гао',
  'Wen Yuan': 'Вэнь Юань',
  Wenwu: 'Вэнь У',
  'Wobbly Tang': 'Шатающийся Тан',
  'Wu Cezhi': 'У Цэчжи',
  'Wu Dayong': 'У Дайон',
  'Wu Jing': 'У Цзин',
  'Wu Jingming': 'У Цзинмин',
  'Wu Qiwan': 'У Цивань',
  'Xi Daozhi': 'Си Даочжи',
  'Xi Gema': 'Си Гэма',
  'Xiang the Greedy': 'Сянь Любопытный',
  'Xu Lijun': 'Сюй Лицзюнь',
  'Xu Yingyu': 'Сюй Иньюй',
  'Xue Li': 'Сюэ Ли',
  'Ya Zhou': 'Я Чжоу',
  'Yan Chuchu': 'Янь Чучу',
  'Yan Momo': 'Янь Момо',
  'Yan Ziyan': 'Янь Цзыянь',
  'Yang Chunnuan': 'Ян Чуньнюань',
  'Ye Zhiqiu': 'Е Цзыцю',
  'Yelu Longxian': 'Елю Лунсянь',
  'Yi Xi': 'И Си',
  'Yu Hui': 'Юй Хуэй',
  'Yu Nu': 'Юй Ню',
  'Yu Songfeng': 'Юй Сунфэн',
  'Yuan Sheng': 'Юань Шэн',
  Yueniang: 'Юэнян',
  'Zhang Dazhuang': 'Чжан Дачжуан',
  'Zhang Jiushu': 'Чжан Цзюшу',
  'Zhang Shuazi': 'Чжан Шуацзы',
  'Zhang the Diviner': 'Чжан Гадатель',
  'Zhao Dali': 'Чжао Дали',
  'Zhao Silu': 'Чжао Силу',
  'Zhao Waibao': 'Чжао Вайбао',
  'Zhao Weiye': 'Чжао Вэйе',
  'Zhen Huo': 'Чжэнь Хуо',
  "Zheng Da'an": 'Чжэн Даань',
  'Zhou Canying': 'Чжоу Цаньин',
  'Zhou Miaoxin': 'Чжоу Мяосинь',
  'Zhou Yihang': 'Чжоу Ихан',
  'Zhou Yizhou': 'Чжоу Ичжоу',
  'Zhu Bawan': 'Чжу Бавань',
  'Zhu Jiuba': 'Чжу Цзюба',
  'Zhuan Fei': 'Чжуань Фэй',
  'Zhuang Yingming': 'Чжуан Инмин',
  'Zhuang Zhengzhi': 'Чжуан Чжэнчжи',
};

const LOC_RU = {
  "Heaven's Pier": 'Небесный причал',
  "General's Shrine": 'Храм генералов',
  'Velvet Shade': 'Бархатная тень',
  'Moonveil Mountain': 'Гора Лунной дымки',
  'Verdant Wilds': 'Изумрудные дикие земли',
  'Sundara Land': 'Земли Сундара',
  'Mercyheart Town': 'Город Милосердного сердца',
  'Lost Crossing': 'Забытый перекрёсток',
  'Jade Gate Pass': 'Нефритовые ворота',
  'Kaifeng City': 'Кайфэн',
  'Riverside Station': 'Приречная станция',
  'Crimson Cliff': 'Багровый утёс',
  'Harvestfall Village': 'Деревня Урожайной осени',
  'Blissful Retreat': 'Блаженное прибежище',
  'Encircling Lake': 'Озеро Окружения',
  'Palace of Annals': 'Дворец летописей',
  'Twinbeast Ridge': 'Хребет Двух зверей',
  'Bamboo Abode': 'Бамбуковая обитель',
  'Stonewash Strand': 'Каменистый берег',
  'Battlecrest Slope': 'Склон Боевого гребня',
  'Peace Bell Tower': 'Башня Мирного колокола',
  'Halo Peak': 'Пик Ореола',
  'Jadebrook Mountain': 'Гора Нефритового ручья',
  'Cleardew Terrace': 'Терраса Чистой росы',
  'Liangzhou Town': 'Город Лянчжоу',
  'Golden Sands River': 'Река Золотых песков',
  'Nine Mortal Ways Base': 'База Девяти смертных путей',
  'Sage\'s Knoll': 'Холм Мудреца',
  'Kilnfire Ridge': 'Хребет Печного огня',
  'Witherwilds': 'Увядающие дебри',
  'Liangzhou (Fallen)': 'Лянчжоу (павший)',
  'Marsh Plain': 'Болотная равнина',
  'Qinchuan Path': 'Тропа Циньчуань',
  'Rustling Meadow': 'Шелестящий луг',
  'Straying Steed Sands': 'Пески Блуждающего скакуна',
  'Jiuquan': 'Цзюцюань',
  'Ayisu': 'Айсу',
  'Steed’s Pass': 'Перевал Скакуна',
  'Jade-Mirrored Spring': 'Нефритовое зеркало источника',
};

function trLoc(s) {
  let r = s;
  for (const [en, ru] of Object.entries(LOC_RU)) {
    r = r.split(en).join(ru);
  }
  return r;
}

function trDetail(s) {
  return trLoc(s)
    .replace(/You can find (him|her|them|it)/gi, 'Можно найти $1')
    .replace(/You can find/gi, 'Можно найти')
    .replace(/can be found/gi, 'можно найти')
    .replace(/is located/gi, 'находится')
    .replace(/He could also be/gi, 'Иногда он также может быть')
    .replace(/depending on the day/gi, 'в зависимости от дня')
    .replace(/near the/gi, 'рядом с')
    .replace(/inside the/gi, 'внутри')
    .replace(/at the/gi, 'у')
    .replace(/to the/gi, 'к')
    .replace(/from the/gi, 'от')
    .replace(/south of/gi, 'южнее')
    .replace(/north of/gi, 'севернее')
    .replace(/east of/gi, 'восточнее')
    .replace(/west of/gi, 'западнее');
}

function isJunkLine(text, nameEn) {
  if (text.length > 420) return true;
  if (/Sign Up|Log In|Free Member|Game Tools|Wiki Front|Premium Articles/i.test(text)) return true;
  if (/^Location:/i.test(text)) return true;
  if (/^Found in /i.test(text)) return true;
  if (new RegExp(`^${nameEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} Location`, 'i').test(text)) return true;
  if (/^Exit the Area/i.test(text)) return true;
  if (/^NPC Location$/i.test(text)) return true;
  if (/Exiting the area for a while/i.test(text)) return true;
  if (/will begin attacking you/i.test(text)) return true;
  if (/Any attack won't work/i.test(text)) return true;
  if (/^An Lexi shouts/i.test(text)) return true;
  return false;
}

function cleanDialogues(raw, nameEn) {
  if (!raw?.dialogueLines) return { befriendGuide: '', dialogues: [] };
  const dialogues = [];
  for (const line of raw.dialogueLines) {
    if (isJunkLine(line.text, nameEn)) continue;
    let role = line.role;
    let text = line.text.trim();
    if (/^I (am |'m |order |must )/i.test(text) || /^You must /i.test(text) || /^Your /i.test(text)) {
      role = 'player';
    }
    const aff = text.match(/\(Affection \+100.*\)/i);
    if (aff) {
      dialogues.push({ role: 'system', textEn: aff[0], textRu: 'Симпатия +100, статус «Почитаемый»' });
      text = text.replace(aff[0], '').trim();
      if (!text) continue;
    }
    if (/seems lost in thought/i.test(text)) {
      dialogues.push({ role: 'system', textEn: text, textRu: 'Персонаж задумался — дружба достигнута.' });
      continue;
    }
    dialogues.push({
      role,
      textEn: text,
      textRu: text, // оригинал; при необходимости дополняется вручную в wiki
    });
  }
  const guide = (raw?.befriendGuide || '').trim();
  return {
    befriendGuide: guide.length > 40 ? guide.slice(0, 1800) : '',
    dialogues: dialogues.slice(0, 40),
  };
}

function icon(name) {
  const n = name.toLowerCase();
  if (n.includes('rat')) return '🐀';
  if (n.includes('cat')) return '🐱';
  if (n === 'dog') return '🐕';
  if (n.includes('angler')) return '🎣';
  if (n.includes('diviner')) return '🔮';
  if (n.includes('beggar')) return '🥣';
  if (n.includes('matchmaker')) return '💒';
  return '👤';
}

const regionRu = { qinghe: 'Цинхэ', kaifeng: 'Кайфэн', hexi: 'Хэси' };

const npcs = parsed.map(r => {
  const d = cleanDialogues(dialogues[r.id], r.nameEn);
  return {
    id: r.id,
    nameEn: r.nameEn,
    nameRu: NAME_RU[r.nameEn] || r.nameEn,
    region: r.region,
    regionLabelRu: regionRu[r.region] || r.regionLabel,
    locationTitle: trLoc(r.locationTitle),
    subregion: trLoc(r.subregion),
    locationDetail: trDetail(r.locationDetail),
    icon: icon(r.nameEn),
    befriendGuide: d.befriendGuide,
    dialogues: d.dialogues,
  };
});

const out = `/** Сгенерировано scripts/rebuild-ai-npcs.mjs — не редактировать вручную */
export type AiNpcRegion = 'qinghe' | 'kaifeng' | 'hexi';

export type NpcDialogueRole = 'player' | 'npc' | 'system';

export interface NpcDialogueLine {
  role: NpcDialogueRole;
  textEn: string;
  textRu: string;
}

export interface AiNpc {
  id: string;
  nameEn: string;
  nameRu: string;
  region: AiNpcRegion;
  regionLabelRu: string;
  locationTitle: string;
  subregion: string;
  locationDetail: string;
  icon: string;
  befriendGuide?: string;
  dialogues: NpcDialogueLine[];
  /** wiki-запись (редактируемая) */
  wikiId?: string;
  isCustom?: boolean;
}

export const aiChatGlobalTips: string[] = ${JSON.stringify([
  'Выберите второй пункт диалога «Подружиться» — не сюжетную ветку.',
  'Читайте подсказку над окном чата: там цель разговора и тон персонажа.',
  'Подстраивайте ответы: учёному — вежливо и образно, воину — прямо, торговцу — о выгоде.',
  'Пишите осмысленные реплики; пустой текст не повышает симпатию.',
  'Если диалог зашёл в тупик — кнопка обновления (↻) вверху чата и начните заново.',
  'Если NPC стал враждебным — выйдите на экран входа; после возврата состояние сбросится.',
  'При статусе «Почитаемый» многие присылают еженедельные подарки.',
], null, 2)};

export const aiNpcRegionLabels: Record<AiNpcRegion, string> = {
  qinghe: 'Цинхэ',
  kaifeng: 'Кайфэн',
  hexi: 'Хэси',
};

export const aiNpcs: AiNpc[] = ${JSON.stringify(npcs, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/aiNpcs.ts'), out);
console.log('Wrote', npcs.length, 'NPCs, with dialogues:', npcs.filter(n => n.dialogues.length).length);
