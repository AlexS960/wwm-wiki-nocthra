import { useEffect, useMemo, useState } from 'react';
import {
  Layout, Type, Image, Link2, Shield, Megaphone, Heart, PanelBottom,
  ChevronUp, ChevronDown, Eye, EyeOff, Plus, Trash2, Save, RotateCcw, Check, Layers,
} from 'lucide-react';
import SectionBuilderPanel from './SectionBuilderPanel';
import { useAuth } from '../../context/AuthContext';
import type { DonationSettings, GuildData, HeroSettings, HomeBlockConfig, SiteSettings } from '../../types/site';
import {
  DEFAULT_FOOTER,
  HOME_BLOCK_META,
  mergeBranding,
  mergeFooterSettings,
  mergeHeroSettings,
  mergeHomeBlocks,
} from '../../lib/siteConstructor';

type SectionId = 'layout' | 'branding' | 'hero' | 'links' | 'guild' | 'announcements' | 'donation' | 'footer' | 'wiki-sections';

const SECTIONS: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'layout', label: 'Структура главной', icon: <Layout className="w-4 h-4" /> },
  { id: 'branding', label: 'Брендинг', icon: <Type className="w-4 h-4" /> },
  { id: 'hero', label: 'Герой', icon: <Image className="w-4 h-4" /> },
  { id: 'links', label: 'Ссылки', icon: <Link2 className="w-4 h-4" /> },
  { id: 'guild', label: 'Гильдия Nocthra', icon: <Shield className="w-4 h-4" /> },
  { id: 'announcements', label: 'Объявления', icon: <Megaphone className="w-4 h-4" /> },
  { id: 'donation', label: 'Пожертвования', icon: <Heart className="w-4 h-4" /> },
  { id: 'wiki-sections', label: 'Разделы вики', icon: <Layers className="w-4 h-4" /> },
  { id: 'footer', label: 'Подвал', icon: <PanelBottom className="w-4 h-4" /> },
];

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="text-ink-400 text-xs mb-1.5 block">{label}</label>
      {children}
      {hint && <p className="text-ink-500 text-[10px] mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = 'w-full bg-ink-900/60 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50';

export default function ConstructorPanel() {
  const {
    siteSettings, guild, discordUrl,
    updateSiteSettings, updateDiscordUrl, updateGuild,
    hasPermission,
  } = useAuth();

  const canEdit = hasPermission('site.settings') || hasPermission('admin.panel');
  const [section, setSection] = useState<SectionId>('layout');
  const [saved, setSaved] = useState(false);
  const [draftSite, setDraftSite] = useState<Partial<SiteSettings>>({});
  const [draftDiscord, setDraftDiscord] = useState('');
  const [draftGuild, setDraftGuild] = useState<GuildData | null>(null);
  const [newAnnText, setNewAnnText] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'warning' | 'success'>('info');

  const resetDraft = () => {
    setDraftSite({
      siteName: siteSettings.siteName,
      siteDescription: siteSettings.siteDescription,
      lolkaUrl: siteSettings.lolkaUrl,
      branding: mergeBranding(siteSettings.branding),
      hero: mergeHeroSettings(siteSettings.hero),
      footer: mergeFooterSettings(siteSettings.footer, discordUrl, siteSettings.lolkaUrl),
      homeBlocks: mergeHomeBlocks(siteSettings.homeBlocks),
      announcements: [...siteSettings.announcements],
      donation: structuredClone(siteSettings.donation),
    });
    setDraftDiscord(discordUrl);
    setDraftGuild(structuredClone(guild));
  };

  useEffect(() => { resetDraft(); }, [siteSettings, guild, discordUrl]);

  const hero = useMemo(() => mergeHeroSettings(draftSite.hero), [draftSite.hero]);
  const homeBlocks = useMemo(() => mergeHomeBlocks(draftSite.homeBlocks), [draftSite.homeBlocks]);
  const donation = draftSite.donation;
  const announcements = draftSite.announcements ?? [];

  const moveBlock = (index: number, dir: -1 | 1) => {
    const next = [...homeBlocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setDraftSite(s => ({ ...s, homeBlocks: next }));
  };

  const toggleBlock = (id: HomeBlockConfig['id']) => {
    setDraftSite(s => ({
      ...s,
      homeBlocks: mergeHomeBlocks(s.homeBlocks).map(b =>
        b.id === id ? { ...b, visible: !b.visible } : b,
      ),
    }));
  };

  const patchHero = (patch: Partial<HeroSettings>) => {
    setDraftSite(s => ({ ...s, hero: { ...mergeHeroSettings(s.hero), ...patch } }));
  };

  const handleSave = () => {
    if (!canEdit) return;
    updateSiteSettings({
      siteName: draftSite.siteName,
      siteDescription: draftSite.siteDescription,
      lolkaUrl: draftSite.lolkaUrl,
      branding: draftSite.branding,
      hero: draftSite.hero,
      footer: draftSite.footer,
      homeBlocks: draftSite.homeBlocks,
      announcements: draftSite.announcements,
      donation: draftSite.donation,
    });
    if (draftDiscord.trim() && draftDiscord !== discordUrl) {
      updateDiscordUrl(draftDiscord.trim());
    }
    if (draftGuild) updateGuild(draftGuild);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!canEdit) {
    return (
      <p className="text-ink-500 text-sm py-8 text-center">
        Конструктор доступен с правом «Настройки сайта» или «Админ-панель».
      </p>
    );
  }

  return (
    <div className="animate-fadeIn space-y-4">
      <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-gold-400 font-semibold text-sm">Конструктор сайта</h3>
          <p className="text-ink-400 text-xs mt-1">
            Редактируйте блоки главной страницы, тексты, ссылки и подвал. Изменения сохраняются в базу и применяются для всех посетителей.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={resetDraft} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-700/50 text-ink-300 text-xs cursor-pointer hover:bg-ink-600">
            <RotateCcw className="w-3.5 h-3.5" /> Сбросить
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
              saved ? 'bg-jade-400/20 text-jade-400' : 'bg-gold-400/20 text-gold-300 hover:bg-gold-400/30'
            }`}
          >
            {saved ? <><Check className="w-4 h-4" /> Сохранено</> : <><Save className="w-4 h-4" /> Сохранить</>}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,14rem)_1fr] gap-4">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap cursor-pointer transition-colors ${
                section === s.id
                  ? 'bg-gold-400/15 text-gold-300 border border-gold-400/30'
                  : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/50 border border-transparent'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </nav>

        <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4 sm:p-5 space-y-4 min-h-[20rem]">
          {section === 'layout' && (
            <>
              <h4 className="text-white font-medium text-sm">Порядок и видимость блоков на главной</h4>
              <ul className="space-y-2">
                {homeBlocks.map((block, i) => {
                  const meta = HOME_BLOCK_META[block.id];
                  return (
                    <li key={block.id} className="flex items-center gap-2 p-3 rounded-lg bg-ink-900/40 border border-ink-700/30">
                      <div className="flex flex-col gap-0.5">
                        <button type="button" disabled={i === 0} onClick={() => moveBlock(i, -1)} className="p-0.5 text-ink-500 hover:text-gold-400 disabled:opacity-30 cursor-pointer"><ChevronUp className="w-4 h-4" /></button>
                        <button type="button" disabled={i === homeBlocks.length - 1} onClick={() => moveBlock(i, 1)} className="p-0.5 text-ink-500 hover:text-gold-400 disabled:opacity-30 cursor-pointer"><ChevronDown className="w-4 h-4" /></button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium">{meta.label}</div>
                        <div className="text-[10px] text-ink-500">{meta.description}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBlock(block.id)}
                        className={`p-2 rounded-lg cursor-pointer ${block.visible ? 'text-jade-400 bg-jade-400/10' : 'text-ink-500 bg-ink-800'}`}
                        title={block.visible ? 'Скрыть' : 'Показать'}
                      >
                        {block.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {section === 'branding' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Название сайта (SEO, заглушка)">
                <input className={inputCls} value={draftSite.siteName ?? ''} onChange={e => setDraftSite(s => ({ ...s, siteName: e.target.value }))} />
              </Field>
              <Field label="Описание сайта">
                <input className={inputCls} value={draftSite.siteDescription ?? ''} onChange={e => setDraftSite(s => ({ ...s, siteDescription: e.target.value }))} />
              </Field>
              <Field label="Заголовок в шапке">
                <input className={inputCls} value={draftSite.branding?.headerTitle ?? ''} onChange={e => setDraftSite(s => ({ ...s, branding: { ...mergeBranding(s.branding), headerTitle: e.target.value } }))} />
              </Field>
              <Field label="Подзаголовок в шапке">
                <input className={inputCls} value={draftSite.branding?.headerSubtitle ?? ''} onChange={e => setDraftSite(s => ({ ...s, branding: { ...mergeBranding(s.branding), headerSubtitle: e.target.value } }))} />
              </Field>
            </div>
          )}

          {section === 'hero' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Заголовок (белая часть)"><input className={inputCls} value={hero.titleWhite} onChange={e => patchHero({ titleWhite: e.target.value })} /></Field>
              <Field label="Заголовок (золотая часть)"><input className={inputCls} value={hero.titleGold} onChange={e => patchHero({ titleGold: e.target.value })} /></Field>
              <Field label="Подзаголовок"><input className={inputCls} value={hero.subtitle} onChange={e => patchHero({ subtitle: e.target.value })} /></Field>
              <Field label="Описание"><textarea className={`${inputCls} resize-none`} rows={2} value={hero.tagline} onChange={e => patchHero({ tagline: e.target.value })} /></Field>
              <Field label="URL логотипа"><input className={inputCls} value={hero.logoUrl} onChange={e => patchHero({ logoUrl: e.target.value })} /></Field>
              <Field label="URL фона"><input className={inputCls} value={hero.bgImageUrl} onChange={e => patchHero({ bgImageUrl: e.target.value })} hint="Путь или ссылка на изображение фона" /></Field>
              <Field label="Discord — заголовок"><input className={inputCls} value={hero.discordTitle} onChange={e => patchHero({ discordTitle: e.target.value })} /></Field>
              <Field label="Discord — подпись"><input className={inputCls} value={hero.discordSubtitle} onChange={e => patchHero({ discordSubtitle: e.target.value })} /></Field>
              <Field label="Lolka — заголовок"><input className={inputCls} value={hero.lolkaTitle} onChange={e => patchHero({ lolkaTitle: e.target.value })} /></Field>
              <Field label="Lolka — подпись"><input className={inputCls} value={hero.lolkaSubtitle} onChange={e => patchHero({ lolkaSubtitle: e.target.value })} /></Field>
            </div>
          )}

          {section === 'links' && (
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              <Field label="Discord URL"><input className={inputCls} value={draftDiscord} onChange={e => setDraftDiscord(e.target.value)} placeholder="https://discord.gg/..." /></Field>
              <Field label="Lolka URL"><input className={inputCls} value={draftSite.lolkaUrl ?? ''} onChange={e => setDraftSite(s => ({ ...s, lolkaUrl: e.target.value }))} placeholder="https://lolka.su/" /></Field>
            </div>
          )}

          {section === 'guild' && draftGuild && (
            <div className="space-y-4 max-w-2xl">
              <p className="text-ink-500 text-xs">Баннер гильдии Nocthra на главной. Карточки info и активности редактируются в модальном окне на главной (кнопка баннера).</p>
              <Field label="Название"><input className={inputCls} value={draftGuild.name} onChange={e => setDraftGuild(g => g ? { ...g, name: e.target.value } : g)} /></Field>
              <Field label="Подзаголовок"><input className={inputCls} value={draftGuild.subtitle} onChange={e => setDraftGuild(g => g ? { ...g, subtitle: e.target.value } : g)} /></Field>
              <Field label="Девиз"><input className={inputCls} value={draftGuild.motto} onChange={e => setDraftGuild(g => g ? { ...g, motto: e.target.value } : g)} /></Field>
              <Field label="Описание"><textarea className={`${inputCls} resize-none`} rows={4} value={draftGuild.description} onChange={e => setDraftGuild(g => g ? { ...g, description: e.target.value } : g)} /></Field>
            </div>
          )}

          {section === 'announcements' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <input className={`${inputCls} flex-1 min-w-[12rem]`} value={newAnnText} onChange={e => setNewAnnText(e.target.value)} placeholder="Текст объявления" />
                <select value={newAnnType} onChange={e => setNewAnnType(e.target.value as typeof newAnnType)} className={`${inputCls} w-auto cursor-pointer`}>
                  <option value="info">Инфо</option>
                  <option value="warning">Важно</option>
                  <option value="success">Успех</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!newAnnText.trim()) return;
                    setDraftSite(s => ({
                      ...s,
                      announcements: [{ id: 'a' + Date.now(), text: newAnnText.trim(), type: newAnnType, active: true }, ...(s.announcements ?? [])],
                    }));
                    setNewAnnText('');
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-orange-500/20 text-orange-300 text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              </div>
              <ul className="space-y-2">
                {announcements.map(ann => (
                  <li key={ann.id} className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-ink-900/40 border border-ink-700/30 text-sm">
                    <button type="button" onClick={() => setDraftSite(s => ({ ...s, announcements: (s.announcements ?? []).map(a => a.id === ann.id ? { ...a, active: !a.active } : a) }))} className={`p-1.5 rounded cursor-pointer ${ann.active ? 'text-jade-400' : 'text-ink-500'}`}>
                      {ann.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <span className="flex-1 text-ink-200 min-w-0">{ann.text}</span>
                    <span className="text-[10px] text-ink-500 uppercase">{ann.type}</span>
                    <button type="button" onClick={() => setDraftSite(s => ({ ...s, announcements: (s.announcements ?? []).filter(a => a.id !== ann.id) }))} className="p-1.5 text-crimson-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section === 'donation' && donation && (
            <DonationEditor
              donation={donation}
              onChange={d => setDraftSite(s => ({ ...s, donation: d }))}
            />
          )}

          {section === 'footer' && (
            <FooterEditor
              footer={draftSite.footer ?? DEFAULT_FOOTER}
              onChange={f => setDraftSite(s => ({ ...s, footer: f }))}
            />
          )}

          {section === 'wiki-sections' && <SectionBuilderPanel />}
        </div>
      </div>
    </div>
  );
}

function DonationEditor({ donation, onChange }: { donation: DonationSettings; onChange: (d: DonationSettings) => void }) {
  return (
    <div className="space-y-4 max-w-2xl">
      <label className="flex items-center gap-2 text-sm text-ink-300 cursor-pointer">
        <input type="checkbox" checked={donation.enabled} onChange={e => onChange({ ...donation, enabled: e.target.checked })} className="rounded" />
        Показывать блок на главной
      </label>
      <Field label="Заголовок"><input className={inputCls} value={donation.title} onChange={e => onChange({ ...donation, title: e.target.value })} /></Field>
      <Field label="Описание"><textarea className={`${inputCls} resize-none`} rows={3} value={donation.description} onChange={e => onChange({ ...donation, description: e.target.value })} /></Field>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-ink-400 text-xs">Способы оплаты</span>
          <button type="button" onClick={() => onChange({ ...donation, methods: [...donation.methods, { id: 'd' + Date.now(), label: '', value: '', url: '' }] })} className="text-xs text-gold-400 cursor-pointer flex items-center gap-1"><Plus className="w-3 h-3" /> Добавить</button>
        </div>
        {donation.methods.map((m, i) => (
          <div key={m.id} className="grid sm:grid-cols-3 gap-2 p-2 rounded-lg bg-ink-900/40 border border-ink-700/30">
            <input className={inputCls} placeholder="Название" value={m.label} onChange={e => { const methods = [...donation.methods]; methods[i] = { ...m, label: e.target.value }; onChange({ ...donation, methods }); }} />
            <input className={inputCls} placeholder="Текст" value={m.value} onChange={e => { const methods = [...donation.methods]; methods[i] = { ...m, value: e.target.value }; onChange({ ...donation, methods }); }} />
            <div className="flex gap-1">
              <input className={`${inputCls} flex-1`} placeholder="URL" value={m.url ?? ''} onChange={e => { const methods = [...donation.methods]; methods[i] = { ...m, url: e.target.value }; onChange({ ...donation, methods }); }} />
              <button type="button" onClick={() => onChange({ ...donation, methods: donation.methods.filter(x => x.id !== m.id) })} className="p-2 text-crimson-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterEditor({ footer, onChange }: { footer: NonNullable<SiteSettings['footer']>; onChange: (f: NonNullable<SiteSettings['footer']>) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Название в подвале"><input className={inputCls} value={footer.brandName} onChange={e => onChange({ ...footer, brandName: e.target.value })} /></Field>
        <Field label="Копирайт"><input className={inputCls} value={footer.copyright} onChange={e => onChange({ ...footer, copyright: e.target.value })} /></Field>
      </div>
      <Field label="О сайте"><textarea className={`${inputCls} resize-none`} rows={3} value={footer.aboutText} onChange={e => onChange({ ...footer, aboutText: e.target.value })} /></Field>
      <Field label="Правовая строка"><textarea className={`${inputCls} resize-none`} rows={2} value={footer.legalText} onChange={e => onChange({ ...footer, legalText: e.target.value })} /></Field>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-ink-400 text-xs">Ссылки</span>
          <button type="button" onClick={() => onChange({ ...footer, links: [...footer.links, { id: 'fl' + Date.now(), label: '', url: '' }] })} className="text-xs text-gold-400 cursor-pointer flex items-center gap-1"><Plus className="w-3 h-3" /> Добавить</button>
        </div>
        <p className="text-ink-500 text-[10px]">Ссылки Discord и Lolka гильдии подставляются автоматически из раздела «Ссылки».</p>
        {footer.links.filter(l => !l.id.startsWith('guild-')).map((link, i) => (
          <div key={link.id} className="flex gap-2">
            <input className={`${inputCls} flex-1`} placeholder="Подпись" value={link.label} onChange={e => { const links = [...footer.links]; const idx = links.findIndex(l => l.id === link.id); if (idx >= 0) { links[idx] = { ...link, label: e.target.value }; onChange({ ...footer, links }); } }} />
            <input className={`${inputCls} flex-1`} placeholder="URL" value={link.url} onChange={e => { const links = [...footer.links]; const idx = links.findIndex(l => l.id === link.id); if (idx >= 0) { links[idx] = { ...link, url: e.target.value }; onChange({ ...footer, links }); } }} />
            <button type="button" onClick={() => onChange({ ...footer, links: footer.links.filter(l => l.id !== link.id) })} className="p-2 text-crimson-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
