import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Edit3, Save, Users, Swords, Trophy, Calendar, Sparkles, ImagePlus, Link as LinkIcon } from 'lucide-react';
import { useAuth, type GuildData } from '../context/AuthContext';
import { compressImageFileToBlob } from '../lib/imageUpload';
import { uploadSiteImage, deleteSiteImageByUrl, isStorageUrl } from '../lib/storage';
import { SITE_GUILDMASTER_ROLE } from '../lib/guildRegistry';
import { getDisplayName } from '../lib/displayName';
import AppModal from './ui/AppModal';

const INFO_ICONS = [Users, Swords, Trophy, Calendar];

function GuildBanner({ guildName, onClick }: { guildName: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="guild-banner relative w-full max-w-2xl mx-auto block cursor-pointer group text-left"
    >
      <div className="guild-banner-bg absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(110deg,transparent_0%,rgba(216,180,255,0.15)_45%,transparent_85%)] bg-[length:180%_180%] animate-[shimmer_7s_linear_infinite]" />
      </div>

      <div className="relative px-5 sm:px-10 py-7 sm:py-9">
        <p className="guild-banner-label text-[10px] sm:text-xs uppercase text-purple-200/75 text-center mb-4">
          База знаний принадлежит гильдии
        </p>

        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <span className="hidden sm:block h-px flex-1 max-w-[4.5rem] bg-gradient-to-r from-transparent to-purple-400/50" />
          <h2 className="text-center font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.12em] sm:tracking-[0.18em] guild-text-shimmer group-hover:scale-[1.02] transition-transform duration-300 px-1">
            {guildName}
          </h2>
          <span className="hidden sm:block h-px flex-1 max-w-[4.5rem] bg-gradient-to-l from-transparent to-purple-400/50" />
        </div>

        <div className="flex items-center justify-center gap-3 mt-5">
          <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
          <span className="guild-banner-moon text-lg" aria-hidden>🌙</span>
          <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
        </div>

        <p className="text-center text-[10px] text-purple-300/45 mt-3 tracking-widest uppercase group-hover:text-purple-300/65 transition-colors">
          Нажмите, чтобы узнать больше
        </p>
      </div>
    </button>
  );
}

function GuildInfoPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { guild, updateGuild, hasPermission, registeredUsers, ensureAccountsLoaded } = useAuth();
  const canEditGuild = hasPermission('guild.edit');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GuildData>(guild);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(guild);
    if (!isOpen) {
      setEditing(false);
      setAvatarError(null);
      setUploadingAvatar(false);
    }
  }, [guild, isOpen]);

  useEffect(() => {
    if (isOpen) void ensureAccountsLoaded();
  }, [isOpen, ensureAccountsLoaded]);

  const siteGuildmasterName = useMemo(() => {
    const gm = registeredUsers.find(u => u.role === SITE_GUILDMASTER_ROLE);
    return gm ? getDisplayName(gm) : '—';
  }, [registeredUsers]);

  const handleSave = () => {
    updateGuild(draft);
    setEditing(false);
  };

  const updateInfo = (index: number, field: 'label' | 'value', val: string) => {
    const info = [...draft.info];
    info[index] = { ...info[index], [field]: val };
    setDraft({ ...draft, info });
  };

  const updateActivity = (index: number, val: string) => {
    const activities = [...draft.activities];
    activities[index] = val;
    setDraft({ ...draft, activities });
  };

  const handleGuildAvatarFile = async (file: File) => {
    setAvatarError(null);
    setUploadingAvatar(true);
    try {
      const blob = await compressImageFileToBlob(file);
      const { url, error } = await uploadSiteImage(blob, 'guild');
      if (error || !url) throw new Error(error || 'Не удалось загрузить аватар гильдии');
      if (draft.avatar && isStorageUrl(draft.avatar) && draft.avatar !== url) {
        void deleteSiteImageByUrl(draft.avatar);
      }
      setDraft(prev => ({ ...prev, avatar: url }));
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const g = editing ? draft : guild;
  if (!isOpen) return null;

  const modal = (
    <AppModal open={isOpen} onClose={onClose} layer="default" className="max-w-lg w-full">
      <div className="w-full max-h-[min(92dvh,720px)] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl border border-purple-500/35 flex flex-col bg-ink-900/78 backdrop-blur-lg">
        <div className="h-1 guild-border-flow shrink-0" />

        <div className="relative shrink-0">
          <div className="relative h-24 sm:h-32 md:h-36 bg-gradient-to-br from-purple-900 via-violet-700 to-purple-950 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(168,130,255,0.35),transparent_70%)]" />
            {g.avatar ? (
              <img src={g.avatar} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            ) : null}
            <span className="relative text-6xl sm:text-7xl drop-shadow-[0_0_24px_rgba(251,191,36,0.6)]">🌙</span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
            {canEditGuild && !editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="p-2 text-purple-200 hover:text-white rounded-lg hover:bg-purple-500/25 cursor-pointer"
                title="Редактировать"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button type="button" onClick={onClose} className="p-2 text-purple-200/70 hover:text-white rounded-lg hover:bg-purple-500/20 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3 sm:space-y-4 min-h-0">
          {editing && (
            <div className="bg-purple-950/28 border border-purple-500/22 rounded-xl p-3 space-y-2">
              <label className="text-purple-200 text-[10px] uppercase tracking-wider block">Аватар гильдии</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-300/60" />
                  <input
                    value={draft.avatar}
                    onChange={e => setDraft({ ...draft, avatar: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-ink-800/70 border border-purple-500/25 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-ink-400 focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <button
                  type="button"
                  disabled={uploadingAvatar}
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-2.5 bg-ink-800/70 border border-purple-500/25 rounded-lg text-purple-200 hover:text-purple-100 hover:border-purple-400/50 cursor-pointer disabled:opacity-60"
                  title="Загрузить файл"
                >
                  {uploadingAvatar ? <span className="text-[11px]">…</span> : <ImagePlus className="w-4 h-4" />}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) void handleGuildAvatarFile(file);
                  }}
                />
              </div>
              {avatarError ? <p className="text-crimson-300 text-xs">{avatarError}</p> : null}
            </div>
          )}

          <div className="text-center">
            {editing ? (
              <input
                value={draft.name}
                onChange={e => setDraft({ ...draft, name: e.target.value })}
                className="w-full bg-ink-800/70 border border-purple-500/30 rounded-lg px-3 py-2 text-center font-serif text-2xl font-bold text-white"
              />
            ) : (
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-purple-100 tracking-wider">{g.name}</h2>
            )}
            {editing ? (
              <input
                value={draft.subtitle}
                onChange={e => setDraft({ ...draft, subtitle: e.target.value })}
                className="w-full mt-2 bg-ink-800/70 border border-purple-500/20 rounded-lg px-3 py-1 text-center text-[10px] tracking-[0.2em] uppercase text-purple-300/80"
              />
            ) : (
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-purple-300/70 mt-1">{g.subtitle}</p>
            )}
            {editing ? (
              <input
                value={draft.motto}
                onChange={e => setDraft({ ...draft, motto: e.target.value })}
                className="w-full mt-2 bg-ink-800/70 border border-purple-500/20 rounded-lg px-3 py-1.5 text-center text-sm italic text-purple-200/90"
              />
            ) : (
              <p className="text-purple-200/80 text-sm italic mt-2 font-serif">{g.motto}</p>
            )}
          </div>

          {editing ? (
            <textarea
              value={draft.description}
              onChange={e => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              className="w-full bg-ink-800/70 border border-purple-500/20 rounded-xl px-3 py-2 text-sm text-ink-100"
            />
          ) : (
            <p className="text-ink-300 text-sm text-center leading-relaxed">{g.description}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {g.info.map((item, i) => {
              const Icon = INFO_ICONS[i % INFO_ICONS.length];
              return (
                <div key={i} className="bg-purple-950/30 border border-purple-500/18 rounded-xl p-3 flex gap-2.5">
                  <Icon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    {editing ? (
                      <>
                        <input
                          value={draft.info[i]?.label || ''}
                          onChange={e => updateInfo(i, 'label', e.target.value)}
                          className="w-full bg-transparent text-[9px] uppercase tracking-wider text-ink-500 mb-0.5"
                        />
                        <input
                          value={draft.info[i]?.value || ''}
                          onChange={e => updateInfo(i, 'value', e.target.value)}
                          className="w-full bg-ink-800/70 border border-purple-500/20 rounded px-1.5 py-0.5 text-xs text-purple-100 font-semibold"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-[9px] uppercase tracking-wider text-ink-500">{item.label}</p>
                        <p className="text-sm font-semibold text-purple-100">{item.value}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full rounded-xl border border-purple-500/25 bg-purple-950/30 px-4 py-3 text-sm text-center sm:text-left">
            <span className="text-purple-300/70">Гильдмастер: </span>
            <span className="text-gold-300 font-medium">{siteGuildmasterName}</span>
          </div>

          <div className="border border-purple-500/25 rounded-xl p-4 bg-purple-950/24">
            <h3 className="text-center font-serif font-bold text-purple-300 text-sm mb-3">Чем мы занимаемся</h3>
            <ul className="space-y-2">
              {(editing ? draft.activities : g.activities).map((act, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  {editing ? (
                    <input
                      value={draft.activities[i] || ''}
                      onChange={e => updateActivity(i, e.target.value)}
                      className="flex-1 bg-ink-800/70 border border-purple-500/20 rounded px-2 py-1 text-xs"
                    />
                  ) : (
                    <span>{act}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {editing && (
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/40 py-2.5 rounded-xl font-medium cursor-pointer hover:bg-purple-500/30"
              >
                <Save className="w-4 h-4" /> Сохранить
              </button>
              <button
                type="button"
                onClick={() => { setDraft(guild); setEditing(false); }}
                className="px-5 bg-ink-700 text-ink-300 py-2.5 rounded-xl cursor-pointer hover:bg-ink-600"
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </AppModal>
  );

  return createPortal(modal, document.body);
}

export function GuildBadgeHero() {
  const { guild } = useAuth();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="animate-fadeInUp">
        <GuildBanner guildName={guild.name} onClick={() => setShowInfo(true)} />
      </div>
      <GuildInfoPopup isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}

export function GuildBadgeCompact() {
  const { guild } = useAuth();
  return (
    <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/20">
      <span className="text-purple-300/60 text-xs">🌙</span>
      <span className="font-serif font-bold text-sm tracking-wider guild-text-shimmer">{guild.name}</span>
    </div>
  );
}

export function GuildBadgeFooter() {
  const { guild } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  return (
    <>
      <div className="relative mt-8 pt-8 border-t border-purple-500/10">
        <GuildBanner guildName={guild.name} onClick={() => setShowInfo(true)} />
        <p className="text-center text-purple-400/35 text-[10px] tracking-widest uppercase mt-3">{guild.motto}</p>
      </div>
      <GuildInfoPopup isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}
