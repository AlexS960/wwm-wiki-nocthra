import { useEffect, useState } from 'react';
import {
  ChevronDown, ChevronUp, Edit3, Star, Trash2, Link2, Check,
  MapPin, Target, Gift, Lightbulb, Check as CheckIcon, X as XIcon,
  Sparkles, Zap, Shield, Heart, Wind, Clock,
} from 'lucide-react';
import type { WikiArticle } from '../../context/AuthContext';
import { wikiCardDomId } from '../../lib/buildLookup';
import { parseSectionContent } from '../../lib/sectionContent';
import { weaponCategoryEnglish } from '../../data/sectionCategories';
import { bossDiffColor, buildDiffColor, mysticElementColors, mysticTypeLabels } from '../../lib/sectionCardStyles';
import RichText, { RichInline } from '../ui/RichText';
import MarkdownBody from '../MarkdownBody';
import ContentImages from '../ContentImages';
import { wikiCardLinkMarkdown } from '../../lib/wikiLinks';
import { asText } from '../../lib/asText';

interface SectionWikiCardProps {
  sectionId: string;
  article: WikiArticle;
  categoryLabel?: string;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  favoriteAddTitle?: string;
  favoriteRemoveTitle?: string;
  highlighted?: boolean;
}

function CopyWikiLinkButton({
  sectionId,
  article,
}: {
  sectionId: string;
  article: WikiArticle;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(wikiCardLinkMarkdown(sectionId, article.id, article.title));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1.5 rounded-md text-jade-300 border border-jade-400/30 hover:bg-jade-400/10 cursor-pointer"
      title={copied ? 'Скопировано!' : 'Копировать ссылку на карточку'}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
    </button>
  );
}

function ManageButtons({
  canEdit,
  onEdit,
  onDelete,
  sectionId,
  article,
  className = '',
}: {
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  sectionId: string;
  article: WikiArticle;
  className?: string;
}) {
  if (!canEdit) return null;
  return (
    <div className={`flex items-center gap-1 ${className}`} onClick={e => e.stopPropagation()}>
      <CopyWikiLinkButton sectionId={sectionId} article={article} />
      <button type="button" onClick={onEdit} className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
        <Edit3 className="w-3.5 h-3.5" />
      </button>
      <button type="button" onClick={onDelete} className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer" title="Удалить">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function FavoriteButton({
  isFavorite,
  onToggle,
  addTitle = 'В избранное',
  removeTitle = 'Убрать из избранного',
  size = 'sm',
}: {
  isFavorite?: boolean;
  onToggle?: () => void;
  addTitle?: string;
  removeTitle?: string;
  size?: 'sm' | 'md';
}) {
  if (!onToggle) return null;
  const iconClass = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  const padClass = size === 'md' ? 'p-2 rounded-lg' : 'p-1.5 rounded-md border';
  return (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onToggle(); }}
      className={`${padClass} transition-colors cursor-pointer ${
        isFavorite
          ? size === 'md'
            ? 'text-gold-400 bg-gold-400/20 shadow-md shadow-gold-400/10'
            : 'text-gold-400 border-gold-400/40 bg-gold-400/10'
          : size === 'md'
            ? 'text-ink-500 hover:text-gold-400 hover:bg-gold-400/10'
            : 'text-ink-500 border-ink-600/40 hover:text-gold-400 hover:border-gold-400/30'
      }`}
      title={isFavorite ? removeTitle : addTitle}
    >
      <Star className={`${iconClass} ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
}

function CardTitle({
  title,
  nameEn,
  className = '',
  highlight = false,
  size = 'base',
}: {
  title: string;
  nameEn?: string;
  className?: string;
  highlight?: boolean;
  size?: 'base' | 'lg';
}) {
  const ru = asText(title).trim();
  const en = asText(nameEn).trim();
  const showEn = en.length > 0 && en.toLowerCase() !== ru.toLowerCase();
  const sizeClass = size === 'lg' ? 'text-lg' : 'text-base';
  return (
    <>
      <h3 className={`font-serif font-bold leading-snug break-words ${sizeClass} ${highlight ? 'text-gold-400' : 'text-white'} ${className}`}>
        {ru}
      </h3>
      {showEn && <p className="text-ink-400 text-xs mt-0.5">{en}</p>}
    </>
  );
}

/** Заголовок карточки оружия: «Название (English)» + строка категории «Русское — English». */
function WeaponCardTitle({
  title,
  nameEn,
  categoryLabel,
  categoryId,
}: {
  title: string;
  nameEn?: string;
  categoryLabel?: string;
  categoryId?: string;
}) {
  const ruTitle = asText(title).trim();
  const weaponEn = asText(nameEn).trim();
  const catRu = asText(categoryLabel).trim();
  const catEn = weaponCategoryEnglish(asText(categoryId), catRu);
  const titleClass = 'font-serif font-bold leading-snug break-words text-base text-white';
  const showWeaponEn = weaponEn.length > 0 && weaponEn.toLowerCase() !== ruTitle.toLowerCase();

  let categoryLine = '';
  if (catRu && catEn && catRu.toLowerCase() !== catEn.toLowerCase()) {
    categoryLine = `${catRu} — ${catEn}`;
  } else if (catRu) {
    categoryLine = catRu;
  }

  return (
    <div>
      <h3 className={titleClass}>
        {ruTitle}
        {showWeaponEn && <span className="text-ink-400 font-normal"> ({weaponEn})</span>}
      </h3>
      {categoryLine && (
        <p className="text-sm text-gold-400 mt-1">{categoryLine}</p>
      )}
    </div>
  );
}

function CardMetaText({ label, text }: { label: string; text?: string }) {
  const val = asText(text).trim();
  if (!val) return null;
  return (
    <div className="text-sm mt-1">
      <span className="text-ink-400">{label}: </span>
      <span className="text-gold-400">{val}</span>
    </div>
  );
}

function CardMetaRich({ label, content }: { label: string; content?: string }) {
  const val = asText(content).trim();
  if (!val) return null;
  return (
    <div className="text-sm mt-1 [&_button]:text-gold-300 [&_button]:underline [&_a]:text-gold-300 [&_a]:underline">
      <span className="text-ink-400">{label}: </span>
      <RichInline content={val} className="text-gold-400" />
    </div>
  );
}

function BossWikiCard(props: SectionWikiCardProps) {
  const { sectionId, article, categoryLabel, canEdit, onEdit, onDelete, highlighted } = props;
  const [expanded, setExpanded] = useState(false);
  const parsed = parseSectionContent(article.content);
  const difficulty = parsed.getLine('## Сложность');
  const level = parsed.getLine('## Уровень');
  const region = parsed.getLine('## Регион');
  const location = parsed.getLine('## Локация');
  const strategy = parsed.getList('## Стратегия');
  const rewards = parsed.getList('## Награды');
  const tips = parsed.getList('## Советы');
  const nameEn = article.fields?.nameEn;
  const bossType = article.fields?.category;

  useEffect(() => {
    if (highlighted) setExpanded(true);
  }, [highlighted]);

  const isCampaign = bossType === 'campaign';

  return (
    <div
      id={wikiCardDomId(article.id)}
      onClick={() => setExpanded(!expanded)}
      className={`relative bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
        expanded || highlighted ? 'border-gold-400/40 bg-gold-400/5' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0 leading-none">{article.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle title={article.title} nameEn={nameEn} />
            </div>
            {expanded
              ? <ChevronUp className={`w-5 h-5 text-gold-400 shrink-0 ${canEdit ? 'mr-14' : ''}`} />
              : <ChevronDown className={`w-5 h-5 text-ink-400 shrink-0 ${canEdit ? 'mr-14' : ''}`} />}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {difficulty && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${bossDiffColor[difficulty] || 'text-jade-400 bg-jade-400/10'}`}>
                {difficulty}
              </span>
            )}
            {level && <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">Ур. {level}</span>}
            {(bossType || categoryLabel) && (
              <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">
                {isCampaign ? '📖 Сюжет' : '🌍 Мировой'}
              </span>
            )}
          </div>
          {(region || location) && (
            <div className="flex items-center gap-1 text-ink-400 text-xs mt-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{region}{region && location ? ' — ' : ''}{location}</span>
            </div>
          )}
        </div>
      </div>

      <ManageButtons canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} sectionId={sectionId} article={article} className="absolute top-3 right-3 z-10" />

      {expanded && (
        <div className="mt-4 pt-4 border-t border-ink-700/30 space-y-4 animate-fadeIn" onClick={e => e.stopPropagation()}>
          {article.fields?.summary && <RichText content={article.fields.summary} variant="normal" />}
          {strategy.length > 0 && (
            <div>
              <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-1">
                <Target className="w-4 h-4" /> Стратегия
              </h4>
              <ul className="space-y-1.5">
                {strategy.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-200">
                    <span className="text-gold-400 mt-0.5">•</span>
                    <RichInline content={s} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rewards.length > 0 && (
            <div>
              <h4 className="text-jade-400 font-semibold text-sm mb-2 flex items-center gap-1">
                <Gift className="w-4 h-4" /> Награды
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {rewards.map((r, i) => (
                  <span key={i} className="text-xs bg-jade-400/10 text-jade-400 px-2 py-0.5 rounded-full">
                    <RichInline content={r} />
                  </span>
                ))}
              </div>
            </div>
          )}
          {tips.length > 0 && (
            <div className="bg-gold-400/5 border border-gold-400/20 rounded-lg p-3">
              <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-1">
                <Lightbulb className="w-4 h-4" /> Советы
              </h4>
              <ul className="space-y-1">
                {tips.map((t, i) => (
                  <li key={i} className="text-sm text-ink-200">★ <RichInline content={t} /></li>
                ))}
              </ul>
            </div>
          )}
          <ContentImages images={article.images} />
        </div>
      )}
    </div>
  );
}

function WeaponWikiCard(props: SectionWikiCardProps) {
  const { sectionId, article, categoryLabel, canEdit, onEdit, onDelete, isFavorite, onToggleFavorite, favoriteAddTitle, favoriteRemoveTitle, highlighted } = props;
  const [expanded, setExpanded] = useState(false);
  const parsed = parseSectionContent(article.content);
  const howToGetBlock = () => {
    const idx = parsed.lines.findIndex(l => l.toLowerCase() === '## получение');
    if (idx < 0) return '';
    const chunk: string[] = [];
    for (let i = idx + 1; i < parsed.lines.length; i++) {
      const line = parsed.lines[i];
      if (line.startsWith('## ')) break;
      if (line) chunk.push(line);
    }
    return chunk.join('\n');
  };
  const howToGet = howToGetBlock();
  const sect = parsed.getLine('## Секта');
  const pair = parsed.getLine('## Пара');
  const role = article.fields?.role;
  const martialArt = article.fields?.martialArt;
  const nameEn = article.fields?.nameEn;

  useEffect(() => {
    if (highlighted) setExpanded(true);
  }, [highlighted]);

  return (
    <div
      id={wikiCardDomId(article.id)}
      onClick={() => setExpanded(!expanded)}
      className={`relative bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
        expanded || highlighted ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0 leading-none">{article.icon}</span>
        <div className="flex-1 min-w-0">
          <WeaponCardTitle
            title={article.title}
            nameEn={nameEn}
            categoryLabel={categoryLabel}
            categoryId={asText(article.fields?.category)}
          />
          <CardMetaRich label="Роль" content={role} />
          <CardMetaRich label="Искусство" content={martialArt} />
          {!expanded && article.fields?.summary && (
            <RichText content={article.fields.summary} variant="compact" className="mt-1.5" />
          )}
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <ManageButtons canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} sectionId={sectionId} article={article} />
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} addTitle={favoriteAddTitle} removeTitle={favoriteRemoveTitle} />
        </div>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-ink-700/30 space-y-2 animate-fadeIn" onClick={e => e.stopPropagation()}>
          {howToGet && (
            <div>
              <h4 className="text-gold-400 font-semibold text-xs mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Получение</h4>
              <RichText content={howToGet} />
            </div>
          )}
          {sect && (
            <div>
              <h4 className="text-gold-400 font-semibold text-xs mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Секта</h4>
              <RichText content={sect} />
            </div>
          )}
          {pair && (
            <div>
              <h4 className="text-gold-400 font-semibold text-xs mb-1">Пара</h4>
              <RichText content={pair} />
            </div>
          )}
          <ContentImages images={article.images} />
        </div>
      )}
    </div>
  );
}

function BuildWikiCard(props: SectionWikiCardProps) {
  const { sectionId, article, categoryLabel, canEdit, onEdit, onDelete, isFavorite, onToggleFavorite, favoriteAddTitle, favoriteRemoveTitle, highlighted } = props;
  const [expanded, setExpanded] = useState(false);
  const parsed = parseSectionContent(article.content);
  const weapons = parsed.getList('## Оружие');
  const strengths = parsed.getList('## Сильные стороны');
  const weaknesses = parsed.getList('## Слабые стороны');
  const difficulty = article.fields?.difficulty;
  const nameEn = article.fields?.nameEn;
  const isSelected = isFavorite;

  useEffect(() => {
    if (highlighted) setExpanded(true);
  }, [highlighted]);

  return (
    <div
      id={wikiCardDomId(article.id)}
      onClick={() => setExpanded(!expanded)}
      className={`relative bg-ink-800/60 border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isSelected ? 'border-gold-400/60 ring-1 ring-gold-400/30'
          : expanded ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      {isSelected && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400/0 via-gold-400 to-gold-400/0" />}
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 pr-8 min-w-0">
            <span className="text-3xl shrink-0">{article.icon}</span>
            <div className="min-w-0">
              <CardTitle title={article.title} nameEn={nameEn} highlight={isSelected} size="lg" />
              <CardMetaText label="Роль" text={categoryLabel} />
            </div>
          </div>
          {expanded
            ? <ChevronUp className={`w-5 h-5 text-ink-400 shrink-0 ${canEdit ? 'mr-14' : ''}`} />
            : <ChevronDown className={`w-5 h-5 text-ink-400 shrink-0 ${canEdit ? 'mr-14' : ''}`} />}
        </div>

        <ManageButtons canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} sectionId={sectionId} article={article} className="absolute top-4 right-4 z-20" />

        {onToggleFavorite && (
          <div className={`absolute ${canEdit ? 'top-14' : 'top-4'} right-4 z-10`}>
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
              addTitle={favoriteAddTitle}
              removeTitle={favoriteRemoveTitle}
              size="md"
            />
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full ${buildDiffColor[difficulty] || ''}`}>Сложность: {difficulty}</span>
          )}
          {isSelected && (
            <span className="text-xs px-2 py-1 rounded-full bg-gold-400/20 text-gold-400 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Мой билд
            </span>
          )}
        </div>

        {weapons.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {weapons.map((w, i) => (
              <span key={i} className="text-xs bg-ink-700/50 text-ink-200 px-2 py-0.5 rounded-full">
                <RichInline content={w} />
              </span>
            ))}
          </div>
        )}

        {!expanded && article.fields?.summary && <RichText content={article.fields.summary} variant="compact" className="mt-3" />}

        {expanded && (
          <div className="mt-4 pt-4 border-t border-ink-700/30 space-y-4 animate-fadeIn" onClick={e => e.stopPropagation()}>
            {article.fields?.summary && <RichText content={article.fields.summary} variant="normal" />}
            {strengths.length > 0 && (
              <div>
                <h4 className="text-jade-400 font-semibold text-sm mb-2">✅ Сильные стороны</h4>
                <div className="space-y-1">
                  {strengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-ink-200">
                      <CheckIcon className="w-3 h-3 text-jade-400 shrink-0" />
                      <RichInline content={s} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {weaknesses.length > 0 && (
              <div>
                <h4 className="text-crimson-400 font-semibold text-sm mb-2">❌ Слабые стороны</h4>
                <div className="space-y-1">
                  {weaknesses.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-ink-200">
                      <XIcon className="w-3 h-3 text-crimson-400 shrink-0" />
                      <RichInline content={w} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all cursor-pointer font-medium text-sm ${
                  isSelected
                    ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                    : 'bg-ink-700/50 text-ink-300 border border-ink-600/30 hover:bg-gold-400/10 hover:text-gold-400 hover:border-gold-400/40'
                }`}
              >
                <Star className={`w-4 h-4 ${isSelected ? 'fill-current' : ''}`} />
                {isSelected ? 'Это мой текущий билд' : 'Выбрать как мой билд'}
              </button>
            )}
            <ContentImages images={article.images} />
          </div>
        )}
      </div>
    </div>
  );
}

function SectWikiCard(props: SectionWikiCardProps) {
  const { sectionId, article, canEdit, onEdit, onDelete, highlighted } = props;
  const [expanded, setExpanded] = useState(false);
  const parsed = parseSectionContent(article.content);
  const howToJoin = parsed.getLine('## Как вступить');
  const benefits = parsed.getList('## Преимущества');
  const rules = parsed.getList('## Правила');
  const theme = article.fields?.theme;
  const weapon = article.fields?.weapon;
  const nameEn = article.fields?.nameEn;

  useEffect(() => {
    if (highlighted) setExpanded(true);
  }, [highlighted]);

  return (
    <div
      id={wikiCardDomId(article.id)}
      onClick={() => setExpanded(!expanded)}
      className={`relative bg-ink-800/60 border rounded-xl p-5 transition-all cursor-pointer ${
        expanded || highlighted ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{article.icon}</span>
        <div className="flex-1 min-w-0">
          <CardTitle title={article.title} nameEn={nameEn} />
        </div>
        {expanded
          ? <ChevronUp className={`w-5 h-5 text-gold-400 shrink-0 ${canEdit ? 'mr-14' : ''}`} />
          : <ChevronDown className={`w-5 h-5 text-ink-400 shrink-0 ${canEdit ? 'mr-14' : ''}`} />}
      </div>

      <ManageButtons canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} sectionId={sectionId} article={article} className="absolute top-3 right-3 z-10" />

      {article.fields?.summary && <RichText content={article.fields.summary} variant="normal" className="mb-3" />}
      <CardMetaRich label="Тема" content={theme} />
      <CardMetaRich label="Оружие" content={weapon} />
      {howToJoin && <RichText content={howToJoin} variant="compact" className="mt-1" />}

      {expanded && (
        <div className="mt-4 pt-4 border-t border-ink-700/30 space-y-3 animate-fadeIn" onClick={e => e.stopPropagation()}>
          {benefits.length > 0 && (
            <div>
              <h4 className="text-jade-400 font-semibold text-sm mb-1 flex items-center gap-1"><CheckIcon className="w-3 h-3" /> Преимущества</h4>
              <ul className="space-y-1">
                {benefits.map((b, i) => (
                  <li key={i} className="text-sm text-ink-200 flex items-start gap-2">
                    <span className="text-jade-400">•</span>
                    <RichInline content={b} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rules.length > 0 && (
            <div>
              <h4 className="text-gold-400 font-semibold text-sm mb-1">📜 Правила</h4>
              <ul className="space-y-1">
                {rules.map((r, i) => (
                  <li key={i} className="text-sm text-ink-200 flex items-start gap-2">
                    <span className="text-gold-400">•</span>
                    <RichInline content={r} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ContentImages images={article.images} />
        </div>
      )}
    </div>
  );
}

function MysticWikiCard(props: SectionWikiCardProps) {
  const { sectionId, article, categoryLabel, canEdit, onEdit, onDelete } = props;
  const parsed = parseSectionContent(article.content);
  const effectBlock = () => {
    const idx = parsed.lines.findIndex(l => l.toLowerCase() === '## эффект');
    if (idx < 0) return '';
    const chunk: string[] = [];
    for (let i = idx + 1; i < parsed.lines.length; i++) {
      const line = parsed.lines[i];
      if (line.startsWith('## ')) break;
      if (line) chunk.push(line);
    }
    return chunk.join('\n');
  };
  const effect = effectBlock();
  const cooldown = parsed.getLine('## Перезарядка');
  const howToGet = parsed.getLine('## Как получить');
  const nameEn = article.fields?.nameEn;
  const element = article.fields?.category || categoryLabel || '';
  const typeLabel = article.fields?.mysticType || mysticTypeLabels[categoryLabel || ''] || categoryLabel;

  const typeIcon = (t?: string) => {
    const key = (t || '').toLowerCase();
    if (key.includes('атак') || key === 'attack') return <Zap className="w-3 h-3" />;
    if (key.includes('защ') || key === 'defense') return <Shield className="w-3 h-3" />;
    if (key.includes('поддерж') || key === 'support') return <Heart className="w-3 h-3" />;
    if (key.includes('движ') || key === 'movement') return <Wind className="w-3 h-3" />;
    return null;
  };

  return (
    <div id={wikiCardDomId(article.id)} className="relative bg-ink-800/60 border border-ink-700/30 rounded-xl p-5 card-hover transition-all">
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0 leading-none">{article.icon}</span>
        <div className="flex-1 min-w-0">
          <CardTitle title={article.title} nameEn={nameEn} />
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {element && (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${mysticElementColors[element] || 'border-ink-600/40'}`}>
                {element}
              </span>
            )}
            {typeLabel && (
              <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                {typeIcon(typeLabel)} {typeLabel}
              </span>
            )}
          </div>
          {article.fields?.summary && <RichText content={article.fields.summary} variant="normal" className="mt-1.5 mb-2" />}
          <div className="space-y-1 text-xs">
            {effect && (
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-gold-400 shrink-0" />
                <RichInline content={effect} className="text-gold-400" />
              </div>
            )}
            {cooldown && (
              <div className="flex items-center gap-2">
                <span className="text-ink-500">Перезарядка:</span>
                <RichInline content={cooldown} className="text-ink-300" />
              </div>
            )}
            {howToGet && (
              <div className="flex items-center gap-2">
                <span className="text-ink-500">Получение:</span>
                <RichInline content={howToGet} className="text-ink-300" />
              </div>
            )}
          </div>
        </div>
      </div>
      <ManageButtons canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} sectionId={sectionId} article={article} className="absolute top-3 right-3 z-10" />
      <ContentImages images={article.images} />
    </div>
  );
}

function CookingWikiCard(props: SectionWikiCardProps) {
  const { sectionId, article, categoryLabel, canEdit, onEdit, onDelete, highlighted } = props;
  const [expanded, setExpanded] = useState(false);
  const parsed = parseSectionContent(article.content);
  const level = parsed.getLine('## Уровень') || article.fields?.level;
  const stamina = parsed.getLine('## Выносливость') || article.fields?.stamina;
  const ingredients = parsed.getList('## Ингредиенты');
  const howToUnlock = parsed.getLine('## Разблокировка');
  const nameEn = article.fields?.nameEn;
  const isHealing = categoryLabel?.toLowerCase().includes('рецепт') || categoryLabel?.toLowerCase().includes('исцел');

  useEffect(() => {
    if (highlighted) setExpanded(true);
  }, [highlighted]);

  return (
    <div
      id={wikiCardDomId(article.id)}
      onClick={() => setExpanded(!expanded)}
      className={`relative bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
        expanded || highlighted ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0 leading-none">{article.icon}</span>
        <div className="flex-1 min-w-0">
          <CardTitle title={article.title} nameEn={nameEn} />
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
            {categoryLabel && (
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                isHealing ? 'bg-crimson-400/10 text-crimson-400' : 'bg-blue-400/10 text-blue-400'
              }`}>
                {isHealing ? <Heart className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                {categoryLabel}
              </span>
            )}
            {level && <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">Ур. {level}</span>}
            {stamina && (
              <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> {stamina}
              </span>
            )}
          </div>
          {!expanded && article.fields?.summary && (
            <RichText content={article.fields.summary} variant="compact" className="mt-1.5 text-jade-400 [&_p]:text-jade-400 [&_p]:font-medium" />
          )}
        </div>
      </div>

      <ManageButtons canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} sectionId={sectionId} article={article} className="absolute top-3 right-3 z-10" />

      {expanded && (
        <div className="mt-3 pt-3 border-t border-ink-700/30 space-y-2 animate-fadeIn" onClick={e => e.stopPropagation()}>
          {ingredients.length > 0 && (
            <div>
              <h4 className="text-gold-400 font-semibold text-xs mb-1">Ингредиенты:</h4>
              <div className="flex flex-wrap gap-1">
                {ingredients.map((ing, i) => (
                  <span key={i} className="text-xs bg-ink-700/50 text-ink-200 px-2 py-0.5 rounded-full">{ing}</span>
                ))}
              </div>
            </div>
          )}
          {howToUnlock && (
            <div>
              <h4 className="text-gold-400 font-semibold text-xs mb-1">Разблокировка:</h4>
              <RichText content={howToUnlock} />
            </div>
          )}
          <ContentImages images={article.images} />
        </div>
      )}
    </div>
  );
}

function TipsWikiCard(props: SectionWikiCardProps) {
  const { sectionId, article, categoryLabel, canEdit, onEdit, onDelete } = props;
  const text = asText(article.fields?.summary || article.content);

  return (
    <div className="relative bg-ink-800/50 border border-ink-700/30 rounded-xl p-4 flex items-start gap-3">
      <span className="text-lg shrink-0">{article.icon || '💡'}</span>
      <div className="flex-1 min-w-0 pr-8">
        {categoryLabel && (
          <span className="inline-block mb-1.5 text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
            {categoryLabel}
          </span>
        )}
        <RichText content={text} variant="normal" />
      </div>
      <ManageButtons canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} sectionId={sectionId} article={article} className="absolute top-2 right-2" />
      <ContentImages images={article.images} />
    </div>
  );
}

function InnerPathWikiCard(props: SectionWikiCardProps) {
  const { sectionId, article, categoryLabel, canEdit, onEdit, onDelete, highlighted } = props;
  const [expanded, setExpanded] = useState(false);
  const parsed = parseSectionContent(article.content);
  const readBlock = (header: string) => {
    const idx = parsed.lines.findIndex(l => l.toLowerCase() === header.toLowerCase());
    if (idx < 0) return '';
    const chunk: string[] = [];
    for (let i = idx + 1; i < parsed.lines.length; i++) {
      const line = parsed.lines[i];
      if (line.startsWith('## ')) break;
      chunk.push(line);
    }
    return chunk.join('\n').trim();
  };
  const effect = readBlock('## Эффект') || article.fields?.summary || '';
  const howToGet = readBlock('## Как получить');
  const nameEn = article.fields?.nameEn;

  useEffect(() => {
    if (highlighted) setExpanded(true);
  }, [highlighted]);

  return (
    <div
      id={wikiCardDomId(article.id)}
      onClick={() => setExpanded(!expanded)}
      className={`relative bg-ink-800/60 border rounded-xl overflow-hidden transition-all cursor-pointer ${
        expanded || highlighted ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle title={article.title} nameEn={nameEn} />
            {categoryLabel && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-0.5 rounded-full border border-gold-400/30 text-gold-300 bg-gold-400/10">
                {categoryLabel}
              </span>
            )}
            {!expanded && effect && <RichText content={effect} variant="compact" className="mt-2" />}
          </div>
          {expanded
            ? <ChevronUp className={`w-5 h-5 text-gold-400 shrink-0 ${canEdit ? 'mr-14' : ''}`} />
            : <ChevronDown className={`w-5 h-5 text-ink-400 shrink-0 ${canEdit ? 'mr-14' : ''}`} />}
        </div>
        <ManageButtons canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} sectionId={sectionId} article={article} className="absolute top-3 right-3 z-10" />
        {expanded && (
          <div className="mt-4 pt-4 border-t border-ink-700/30 space-y-3 animate-fadeIn" onClick={e => e.stopPropagation()}>
            {effect && (
              <div>
                <h4 className="text-gold-400 font-semibold text-xs mb-1 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Эффект</h4>
                <RichText content={effect} />
              </div>
            )}
            {howToGet && (
              <div>
                <h4 className="text-jade-400 font-semibold text-xs mb-1">Как получить</h4>
                <RichText content={howToGet} />
              </div>
            )}
            <ContentImages images={article.images} />
          </div>
        )}
      </div>
    </div>
  );
}

function GenericWikiCard(props: SectionWikiCardProps) {
  const { sectionId, article, categoryLabel, canEdit, onEdit, onDelete, isFavorite, onToggleFavorite, favoriteAddTitle, favoriteRemoveTitle, highlighted } = props;
  const [expanded, setExpanded] = useState(false);
  const rawPreview = asText(article.fields?.summary || article.content);

  useEffect(() => {
    if (highlighted) setExpanded(true);
  }, [highlighted]);

  return (
    <div
      id={wikiCardDomId(article.id)}
      onClick={() => setExpanded(!expanded)}
      className={`relative bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
        expanded || highlighted ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0 leading-none">{article.icon}</span>
        <div className="flex-1 min-w-0">
          <CardTitle title={article.title} nameEn={article.fields?.nameEn} />
          {categoryLabel && (
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
              {categoryLabel}
            </span>
          )}
          {!expanded && rawPreview.trim() && (
            <RichText content={rawPreview} variant="preview" className="mt-1.5" />
          )}
        </div>
        {(canEdit || onToggleFavorite) && (
          <div className="flex flex-col items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
            <ManageButtons canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} sectionId={sectionId} article={article} />
            <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} addTitle={favoriteAddTitle} removeTitle={favoriteRemoveTitle} />
          </div>
        )}
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-ink-700/30 animate-fadeIn" onClick={e => e.stopPropagation()}>
          <MarkdownBody content={article.content} images={article.images} />
        </div>
      )}
    </div>
  );
}

export default function SectionWikiCard(props: SectionWikiCardProps) {
  if (!getSectionSchema(props.sectionId)) return <GenericWikiCard {...props} />;

  switch (props.sectionId) {
    case 'bosses': return <BossWikiCard {...props} />;
    case 'weapons': return <WeaponWikiCard {...props} />;
    case 'builds': return <BuildWikiCard {...props} />;
    case 'sects': return <SectWikiCard {...props} />;
    case 'mystic': return <MysticWikiCard {...props} />;
    case 'cooking': return <CookingWikiCard {...props} />;
    case 'tips': return <TipsWikiCard {...props} />;
    case 'innerpath': return <InnerPathWikiCard {...props} />;
    default: return <GenericWikiCard {...props} />;
  }
}
