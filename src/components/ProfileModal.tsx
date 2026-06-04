import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { compressImageFileToBlob } from '../lib/imageUpload';
import { uploadSiteImage, deleteSiteImageByUrl, isStorageUrl } from '../lib/storage';
import {
  X, User, LogOut, Edit3, Save, Camera, Shield, Star, BookOpen,
  Swords, MapPin, FileText, Plus, Trash2, Check, ImagePlus, Link as LinkIcon,
  Circle, Crown
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchor?: { top: number; right: number } | null;
  onOpenAdmin?: () => void;
}

export default function ProfileModal({ isOpen, onClose, anchor, onOpenAdmin }: ProfileModalProps) {
  const { user, logout, progress, updateUserPicture, updateUserGameNickname, getRoleConfig, addNote, deleteNote, isUserOnline } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.gameNickname || '');
  const [pictureUrl, setPictureUrl] = useState(user?.picture || '');
  const [activeTab, setActiveTab] = useState<'stats' | 'progress' | 'notes'>('stats');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !user) return null;
  const rc = getRoleConfig(user.role);

  const handleSave = () => {
    updateUserGameNickname(nickname.trim());
    setAvatarError(null);
    updateUserPicture(pictureUrl.trim());
    setEditing(false);
  };

  const handleAvatarFile = async (file: File) => {
    setAvatarError(null);
    setUploadingAvatar(true);
    try {
      const blob = await compressImageFileToBlob(file);
      const { url, error } = await uploadSiteImage(blob, 'avatars');
      if (error || !url) throw new Error(error || 'Не удалось загрузить аватар');
      if (user.picture && isStorageUrl(user.picture) && user.picture !== url) {
        void deleteSiteImageByUrl(user.picture);
      }
      setPictureUrl(url);
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    addNote(newNoteTitle.trim(), newNoteContent.trim());
    setNewNoteTitle(''); setNewNoteContent(''); setShowAddNote(false);
  };

  const tabs = [
    { id: 'stats' as const, label: 'Профиль', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'progress' as const, label: 'Прогресс', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'notes' as const, label: 'Заметки', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-[120] animate-fadeIn" role="dialog" aria-modal="true" aria-label="Профиль">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className="overlay-panel profile-modal-panel absolute inset-0 bg-ink-900/82 backdrop-blur-lg border-0 rounded-none w-screen h-[100dvh] overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-gold-400/25 flex flex-col sm:inset-auto sm:border sm:border-gold-500/45 sm:rounded-2xl sm:w-[min(34rem,calc(100vw-2rem))] sm:h-auto sm:max-h-[88vh] sm:left-auto sm:right-4 sm:top-[var(--profile-top,80px)]"
        style={{
          ...(anchor?.top ? ({ ['--profile-top' as string]: `${Math.max(72, Math.min(anchor.top, window.innerHeight - 120))}px` }) : {}),
          right: anchor?.right ?? 16,
        }}
      >
        <div className="relative shrink-0 bg-ink-800/70 backdrop-blur-md border-b border-gold-500/30">
          <div className="h-12 flex items-center justify-between px-5">
            <span className="font-serif text-gold-400 text-sm font-bold">Профиль</span>
            <button onClick={onClose} className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-600/50 cursor-pointer transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Avatar block — standalone, left of everything */}
        <div className="px-4 sm:px-5 pt-4 pb-3 flex items-center gap-3 sm:gap-4">
          {/* BLOCK 1: Avatar */}
          <div className="relative shrink-0 group/avatar">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-xl object-cover border-2 border-ink-600/30" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-ink-700 flex items-center justify-center border-2 border-ink-600/30">
                <User className="w-8 h-8 text-gold-400" />
              </div>
            )}
            {/* Online / Offline indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-ink-800 border-2 border-ink-600 flex items-center justify-center">
              <Circle className={`w-2.5 h-2.5 ${isUserOnline(user.id) ? 'text-jade-400 fill-jade-400' : 'text-ink-500 fill-ink-500'}`} />
            </div>
            {editing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) void handleAvatarFile(file);
                  }} />
              </label>
            )}
          </div>

          {/* BLOCK 2: Info — login, (gameNickname), role badge on right */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <h2 className="font-serif text-base sm:text-lg font-bold text-white truncate">{user.name}</h2>
                {user.gameNickname && (
                  <span className="text-gold-400 text-xs sm:text-sm font-medium truncate">({user.gameNickname})</span>
                )}
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 shrink-0"
                style={{ backgroundColor: rc.color + '20', color: rc.color, borderColor: rc.color + '40', borderWidth: 1 }}>
                <Shield className="w-3 h-3" />{rc.displayName}
              </span>
            </div>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => { onOpenAdmin(); onClose(); }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-400/30 hover:bg-purple-500/20 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" /> Панель управления
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink-700/30 px-4">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors cursor-pointer ${activeTab === tab.id ? 'text-gold-400 border-b-2 border-gold-400 -mb-px' : 'text-ink-400 hover:text-ink-200'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="scroll-area flex-1 min-h-0 p-4 space-y-3">
          {activeTab === 'stats' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <StatMini icon={<BookOpen className="w-4 h-4 text-gold-400" />} value={progress.completedGuides.length} label="Гайдов" />
                <StatMini icon={<Swords className="w-4 h-4 text-crimson-400" />} value={progress.favoriteWeapons.length} label="Оружия" />
                <StatMini icon={<MapPin className="w-4 h-4 text-jade-400" />} value={progress.visitedRegions.length} label="Регионов" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatMini icon={<Star className="w-4 h-4 text-purple-400" />} value={progress.favoriteSects.length} label="Сект" />
                <StatMini icon={<FileText className="w-4 h-4 text-ink-400" />} value={progress.notes.length} label="Заметок" />
              </div>

              {editing ? (
                <div className="space-y-3 bg-ink-800/55 rounded-xl p-4 border border-ink-600/35">
                  <div>
                    <label className="text-ink-400 text-[10px] uppercase tracking-wider mb-1 block">Игровой ник</label>
                    <input value={nickname} onChange={e => setNickname(e.target.value)} className="w-full bg-ink-800 border border-ink-600/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50" />
                  </div>
                  <div>
                    <label className="text-ink-400 text-[10px] uppercase tracking-wider mb-1 block">URL аватарки</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1"><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-500" />
                        <input value={pictureUrl} onChange={e => setPictureUrl(e.target.value)} className="w-full bg-ink-800 border border-ink-600/30 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50" />
                      </div>
                      <button type="button" disabled={uploadingAvatar} onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-ink-800 border border-ink-600/30 rounded-lg text-ink-400 hover:text-gold-400 hover:border-gold-400/40 cursor-pointer disabled:opacity-50">
                        {uploadingAvatar ? <span className="text-[10px]">…</span> : <ImagePlus className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-ink-500 text-[10px] mt-1">Файл загружается в Supabase Storage (не base64). Можно также вставить https://…</p>
                    {avatarError && <p className="text-crimson-400 text-xs mt-1">{avatarError}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-gold-400/20 text-gold-400 border border-gold-400/40 py-2 rounded-lg text-xs font-medium hover:bg-gold-400/30 cursor-pointer"><Save className="w-3.5 h-3.5" /> Сохранить</button>
                    <button onClick={() => setEditing(false)} className="px-3 bg-ink-800 text-ink-300 py-2 rounded-lg text-xs hover:bg-ink-700 cursor-pointer">Отмена</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setNickname(user.gameNickname || ''); setPictureUrl(user.picture || ''); setEditing(true); }}
                  className="w-full flex items-center justify-center gap-2 bg-gold-400/10 border border-gold-400/20 text-gold-400 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-400/20 cursor-pointer">
                  <Edit3 className="w-4 h-4" /> Редактировать профиль
                </button>
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-2">
              <ProgressRow label="Пройдено гайдов" done={progress.completedGuides.length} total={6} icon="📖" />
              <ProgressRow label="Оружие в избранном" done={progress.favoriteWeapons.length} total={12} icon="⚔️" />
              <ProgressRow label="Секты изучены" done={progress.favoriteSects.length} total={8} icon="🏛️" />
              <ProgressRow label="Регионов посещено" done={progress.visitedRegions.length} total={5} icon="🗺️" />
              {progress.selectedBuild && (
                <div className="bg-gold-400/5 border border-gold-400/20 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-lg">⭐</span><div><p className="text-gold-400 text-sm font-medium">Выбранный билд</p><p className="text-white text-xs">{progress.selectedBuild}</p></div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-gold-400 font-medium text-sm flex items-center gap-2"><FileText className="w-4 h-4" /> Заметки ({progress.notes.length})</h3>
                <button onClick={() => setShowAddNote(!showAddNote)} className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-gold-400/10 cursor-pointer"><Plus className="w-4 h-4" /></button>
              </div>
              {showAddNote && (
                <div className="bg-ink-800/55 border border-gold-400/30 rounded-xl p-3 space-y-2 animate-fadeIn">
                  <input value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} placeholder="Заголовок заметки" className="w-full bg-ink-800 border border-ink-600/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50" />
                  <textarea value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} placeholder="Содержание..." rows={3} className="w-full bg-ink-800 border border-ink-600/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={handleAddNote} disabled={!newNoteTitle.trim() || !newNoteContent.trim()} className="flex-1 bg-gold-400/20 text-gold-400 py-2 rounded-lg text-xs font-medium hover:bg-gold-400/30 cursor-pointer disabled:opacity-40"><Check className="w-3.5 h-3.5 inline mr-1" />Добавить</button>
                    <button onClick={() => { setShowAddNote(false); setNewNoteTitle(''); setNewNoteContent(''); }} className="px-3 bg-ink-800 text-ink-300 py-2 rounded-lg text-xs hover:bg-ink-700 cursor-pointer">Отмена</button>
                  </div>
                </div>
              )}
              {progress.notes.length === 0 && !showAddNote ? (
                <div className="text-center py-8 text-ink-500"><FileText className="w-10 h-10 mx-auto mb-2 opacity-50" /><p className="text-sm">Нет заметок</p></div>
              ) : (
                <div className="space-y-2">
                  {progress.notes.map(note => (
                    <div key={note.id} className="bg-ink-800/55 border border-ink-600/35 rounded-xl p-3 group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0"><h4 className="text-white text-sm font-medium truncate">{note.title}</h4><p className="text-ink-300 text-xs mt-1 whitespace-pre-wrap line-clamp-3">{note.content}</p></div>
                        <button onClick={() => deleteNote(note.id)} className="p-1 rounded text-ink-600 hover:text-crimson-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <p className="text-ink-500 text-[10px] mt-2">{note.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gold-500/25 bg-ink-800/50 shrink-0">
          <button onClick={() => { logout(); onClose(); }} className="w-full flex items-center justify-center gap-2 bg-crimson-400/10 border border-crimson-400/20 text-crimson-400 py-2.5 rounded-lg text-sm font-medium hover:bg-crimson-400/20 cursor-pointer">
            <LogOut className="w-4 h-4" /> Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}

function StatMini({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return <div className="bg-ink-800/55 border border-ink-600/35 rounded-xl p-3 text-center"><div className="flex justify-center mb-1">{icon}</div><div className="font-serif text-xl font-bold text-white">{value}</div><div className="text-ink-300 text-[10px]">{label}</div></div>;
}
function ProgressRow({ label, done, total, icon }: { label: string; done: number; total: number; icon: string }) {
  const pct = Math.min(100, Math.round((done / total) * 100));
  return <div className="bg-ink-800/55 border border-ink-600/35 rounded-xl p-3"><div className="flex items-center justify-between mb-1.5"><span className="text-ink-200 text-xs flex items-center gap-1.5"><span>{icon}</span> {label}</span><span className="text-ink-400 text-[10px]">{done}/{total}</span></div><div className="h-1.5 bg-ink-600/30 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-gold-400/60 to-gold-400 rounded-full transition-all" style={{ width: `${pct}%` }} /></div></div>;
}
