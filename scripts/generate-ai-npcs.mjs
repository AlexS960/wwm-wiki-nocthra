import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rows = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/aiNpcs.parsed.json'), 'utf8'),
);

const regionRu = { qinghe: 'Цинхэ', kaifeng: 'Кайфэн', hexi: 'Хэси' };

function icon(name) {
  const n = name.toLowerCase();
  if (n.includes('rat')) return '🐀';
  if (n.includes('cat')) return '🐱';
  if (n === 'dog') return '🐕';
  if (n.includes('angler') || n.includes('fish')) return '🎣';
  if (n.includes('diviner')) return '🔮';
  if (n.includes('beggar')) return '🥣';
  if (n.includes('matchmaker')) return '💒';
  return '👤';
}

const aiChatGlobalTips = [
  'Выберите второй пункт диалога «Подружиться» — не сюжетную ветку.',
  'Читайте подсказку над окном чата: там цель разговора и тон персонажа.',
  'Подстраивайте ответы: учёному — вежливо и образно, воину — прямо, торговцу — о выгоде.',
  'Пишите осмысленные реплики; пустой текст не повышает симпатию.',
  'Если диалог зашёл в тупик — кнопка обновления (↻) вверху чата и начните заново.',
  'Если NPC стал враждебным — выйдите на экран входа; после возврата состояние сбросится.',
  'При статусе «Почитаемый» многие присылают еженедельные подарки.',
];

const specialHints = {
  'li-laizuo': ['Спросите о его прошлом в Цзянху.', 'Не провоцируйте на драку — при агрессии выйдите в меню.'],
  'fang-xu': ['Сначала несколько раз спаррингуйте с ним у арены, затем откройте AI-чат.'],
  'auntie-tian': ['Ищите её в доме за лотком Юань Тяньтянь на Небесном причале.'],
  'zhao-dali': ['Тренируется у главного святилища — помогите с упражнениями в диалоге.'],
  'lie-buxi': ['Она ищет братьев — предложите помощь в поиске.'],
  'gong-ge': ['Доступна только после квеста Land of Gold Encounter в регионе.'],
  'gu-yuehu': ['Доступен только после Land of Gold Encounter.'],
  'xiang-the-greedy': ['Говорите о торговле, выгоде и «сюрпризах» — жадный характер.'],
  'zhou-yizhou': ['Уместны поэтичные и учтивые формулировки.'],
  'zhang-the-diviner': ['Гадатель — задавайте вопросы о судьбе и знаках.'],
  'beggar-liu': ['Сочувствие и практическая помощь работают лучше высокомерия.'],
  'fluffy-cat': ['Может понадобиться навык Animal Whisperer (разговор с животными).'],
  'burrowing-rat': ['Крыса-землекоп — тема земледелия и деревни Mercyheart.'],
};

const out = [];
out.push('/** AI NPC из Game8 — List of All AI NPCs (архив 565812). Источник: game8.co */');
out.push("export type AiNpcRegion = 'qinghe' | 'kaifeng' | 'hexi';");
out.push('');
out.push('export interface AiNpc {');
out.push('  id: string;');
out.push('  nameEn: string;');
out.push('  region: AiNpcRegion;');
out.push('  regionLabelRu: string;');
out.push('  locationTitle: string;');
out.push('  subregion: string;');
out.push('  locationDetail: string;');
out.push('  icon: string;');
out.push('  dialogHints?: string[];');
out.push('}');
out.push('');
out.push(`export const aiChatGlobalTips: string[] = ${JSON.stringify(aiChatGlobalTips, null, 2)};`);
out.push('');
out.push('export const aiNpcRegionLabels: Record<AiNpcRegion, string> = {');
out.push("  qinghe: 'Цинхэ',");
out.push("  kaifeng: 'Кайфэн',");
out.push("  hexi: 'Хэси',");
out.push('};');
out.push('');
out.push('export const aiNpcs: AiNpc[] = [');
for (const r of rows) {
  const hints = specialHints[r.id];
  out.push('  {');
  out.push(`    id: ${JSON.stringify(r.id)},`);
  out.push(`    nameEn: ${JSON.stringify(r.nameEn)},`);
  out.push(`    region: ${JSON.stringify(r.region)},`);
  out.push(`    regionLabelRu: ${JSON.stringify(regionRu[r.region] || r.regionLabel)},`);
  out.push(`    locationTitle: ${JSON.stringify(r.locationTitle)},`);
  out.push(`    subregion: ${JSON.stringify(r.subregion)},`);
  out.push(`    locationDetail: ${JSON.stringify(r.locationDetail)},`);
  out.push(`    icon: ${JSON.stringify(icon(r.nameEn))},`);
  if (hints) out.push(`    dialogHints: ${JSON.stringify(hints)},`);
  out.push('  },');
}
out.push('];');

fs.writeFileSync(path.join(__dirname, '../src/data/aiNpcs.ts'), out.join('\n'));
console.log('Generated', rows.length, 'NPCs');
