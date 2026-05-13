import { useState } from 'react';
import { 
  X, User, LogOut, Swords, Users, BookOpen, Map, 
  Scroll, Trash2, Plus, Star, Check, ChevronDown, ChevronUp,
  Settings, Trophy, X as XIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { weapons, sects, mapRegions, buildPaths, type BuildPath } from '../data/gameData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'overview' | 'favorites' | 'progress' | 'notes' | 'settings';

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, progress, guides, logout, deleteNote, addNote, setSelectedBuild, getRoleConfig } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      addNote(newNoteTitle.trim(), newNoteContent.trim());
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowNoteForm(false);
    }
  };

  const favoriteWeaponsList = weapons.filter(w => progress.favoriteWeapons.includes(w.id));
  const favoriteSectsList = sects.filter(s => progress.favoriteSects.includes(s.id));
  const completedGuidesList = guides.filter(g => progress.completedGuides.includes(g.id));
  const visitedRegionsList = mapRegions.filter(r => progress.visitedRegions.includes(r.id));
  const selectedBuildData = buildPaths.find(b => b.id === progress.selectedBuild);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Обзор', icon: <User className="w-4 h-4" /> },
    { id: 'favorites', label: 'Избранное', icon: <Star className="w-4 h-4" /> },
    { id: 'progress', label: 'Прогресс', icon: <Trophy className="w-4 h-4" /> },
    { id: 'notes', label: 'Заметки', icon: <Scroll className="w-4 h-4" /> },
    { id: 'settings', label: 'Настройки', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-ink-800 border border-gold-700/30 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-ink-700/50">
          <div className="flex items-center gap-4">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full border-2 border-gold-400/30" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center border-2 border-gold-400/30">
                <User className="w-6 h-6 text-gold-400" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-xl font-bold text-white">{user.name}</h2>
                {(() => {
                  const role = getRoleConfig(user.role);
                  return (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border"
                      style={{
                        color: role.color,
                        backgroundColor: role.color + '15',
                        borderColor: role.color + '40',
                      }}
                    >
                      {role.displayName}
                    </span>
                  );
                })()}
              </div>
              <p className="text-ink-400 text-sm">{user.email || 'Локальный аккаунт'}</p>
              {user.isDemo && (
                <span className="inline-block mt-1 text-xs bg-gold-400/10 text-gold-400 px-2 py-0.5 rounded-full">
                  Демо-аккаунт
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-ink-400 hover:text-white transition-colors rounded-lg hover:bg-ink-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink-700/50 px-5 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'text-gold-400 border-b-2 border-gold-400 -mb-px'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(85vh-180px)]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon="⚔️" value={progress.favoriteWeapons.length} label="Избранное оружие" />
                <StatCard icon="🏛️" value={progress.favoriteSects.length} label="Избранные секты" />
                <StatCard icon="📖" value={progress.completedGuides.length} label="Пройдено гайдов" />
                <StatCard icon="🗺️" value={progress.visitedRegions.length} label="Исследовано" />
              </div>

              {/* Selected Build */}
              <MyBuildCard selectedBuildData={selectedBuildData} />

              {/* Recent Notes */}
              {progress.notes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gold-400 mb-3">Последние заметки</h3>
                  <div className="space-y-2">
                    {progress.notes.slice(0, 2).map(note => (
                      <div key={note.id} className="bg-ink-700/30 rounded-lg p-3">
                        <div className="font-medium text-white text-sm">{note.title}</div>
                        <div className="text-ink-400 text-xs mt-1 line-clamp-1">{note.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Favorite Weapons */}
              <div>
                <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
                  <Swords className="w-4 h-4" /> Избранное оружие ({favoriteWeaponsList.length})
                </h3>
                {favoriteWeaponsList.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {favoriteWeaponsList.map(weapon => (
                      <div key={weapon.id} className="flex items-center gap-3 bg-ink-700/30 rounded-lg p-3">
                        <span className="text-xl">{weapon.icon}</span>
                        <div>
                          <div className="font-medium text-white text-sm">{weapon.name}</div>
                          <div className="text-ink-400 text-xs">{weapon.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ink-500 text-sm">Нажмите ⭐ на карточке оружия, чтобы добавить в избранное</p>
                )}
              </div>

              {/* Favorite Sects */}
              <div>
                <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Избранные секты ({favoriteSectsList.length})
                </h3>
                {favoriteSectsList.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {favoriteSectsList.map(sect => (
                      <div key={sect.id} className="flex items-center gap-3 bg-ink-700/30 rounded-lg p-3">
                        <span className="text-xl">{sect.icon}</span>
                        <div>
                          <div className="font-medium text-white text-sm">{sect.name}</div>
                          <div className="text-ink-400 text-xs">{sect.theme}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ink-500 text-sm">Нажмите ⭐ на карточке секты, чтобы добавить в избранное</p>
                )}
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Completed Guides */}
              <div>
                <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Пройденные гайды ({completedGuidesList.length} / {guides.length})
                </h3>
                <div className="space-y-2">
                  {guides.map(guide => {
                    const isCompleted = progress.completedGuides.includes(guide.id);
                    return (
                      <div key={guide.id} className={`flex items-center gap-3 rounded-lg p-3 ${
                        isCompleted ? 'bg-jade-400/10' : 'bg-ink-700/30'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-jade-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-ink-500 shrink-0" />
                        )}
                        <span className="text-xl">{guide.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm ${isCompleted ? 'text-jade-400' : 'text-white'}`}>
                            {guide.title}
                          </div>
                          <div className="text-ink-400 text-xs">{guide.category}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visited Regions */}
              <div>
                <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
                  <Map className="w-4 h-4" /> Исследованные регионы ({visitedRegionsList.length} / {mapRegions.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {mapRegions.map(region => {
                    const isVisited = progress.visitedRegions.includes(region.id);
                    return (
                      <div key={region.id} className={`flex items-center gap-3 rounded-lg p-3 ${
                        isVisited ? 'bg-jade-400/10' : 'bg-ink-700/30'
                      }`}>
                        {isVisited ? (
                          <Check className="w-4 h-4 text-jade-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-ink-500 shrink-0" />
                        )}
                        <span className="text-xl">{region.icon}</span>
                        <div>
                          <div className={`font-medium text-sm ${isVisited ? 'text-jade-400' : 'text-white'}`}>
                            {region.name}
                          </div>
                          <div className="text-ink-400 text-xs">Ур. {region.level}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Build Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gold-400 mb-3">Выбрать мой билд</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {buildPaths.map(build => (
                    <button
                      key={build.id}
                      onClick={() => setSelectedBuild(build.id === progress.selectedBuild ? null : build.id)}
                      className={`flex items-center gap-3 rounded-lg p-3 text-left transition-all cursor-pointer ${
                        progress.selectedBuild === build.id
                          ? 'bg-gold-400/20 border border-gold-400/40'
                          : 'bg-ink-700/30 border border-transparent hover:border-ink-600'
                      }`}
                    >
                      <span className="text-xl">{build.icon}</span>
                      <div>
                        <div className="font-medium text-sm text-white">{build.name}</div>
                        <div className="text-ink-400 text-xs">{build.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Add Note Button */}
              {!showNoteForm ? (
                <button
                  onClick={() => setShowNoteForm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gold-400/10 border border-gold-400/30 
                           text-gold-400 rounded-xl p-4 hover:bg-gold-400/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Добавить заметку
                </button>
              ) : (
                <div className="bg-ink-700/30 rounded-xl p-4 space-y-3">
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={e => setNewNoteTitle(e.target.value)}
                    placeholder="Заголовок заметки"
                    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-4 py-2 text-white 
                             placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
                  />
                  <textarea
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                    placeholder="Содержание заметки..."
                    rows={3}
                    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-4 py-2 text-white 
                             placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddNote}
                      className="flex-1 bg-gold-400/20 text-gold-400 rounded-lg py-2 font-medium 
                               hover:bg-gold-400/30 transition-colors cursor-pointer"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => { setShowNoteForm(false); setNewNoteTitle(''); setNewNoteContent(''); }}
                      className="px-4 bg-ink-700 text-ink-300 rounded-lg py-2 hover:bg-ink-600 transition-colors cursor-pointer"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* Notes List */}
              {progress.notes.length > 0 ? (
                <div className="space-y-3">
                  {progress.notes.map(note => (
                    <div key={note.id} className="bg-ink-700/30 rounded-xl p-4 group">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-white">{note.title}</h4>
                          <p className="text-ink-400 text-sm mt-1 whitespace-pre-wrap">{note.content}</p>
                          <p className="text-ink-500 text-xs mt-2">{note.date}</p>
                        </div>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-2 text-ink-500 hover:text-crimson-400 transition-colors opacity-0 
                                   group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-ink-500">
                  <Scroll className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>У вас пока нет заметок</p>
                  <p className="text-sm mt-1">Записывайте важную информацию об игре</p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-ink-700/30 rounded-xl p-4">
                <h3 className="font-medium text-white mb-2">Информация об аккаунте</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-400">Логин:</span>
                    <span className="text-ink-200">{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">Роль:</span>
                    <span style={{ color: getRoleConfig(user.role).color }}>{getRoleConfig(user.role).displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">ID:</span>
                    <span className="text-ink-500 text-xs font-mono">{user.id}</span>
                  </div>
                </div>
              </div>

              <div className="bg-crimson-400/5 border border-crimson-400/20 rounded-xl p-4">
                <h3 className="font-medium text-crimson-400 mb-2">Выход</h3>
                <p className="text-ink-400 text-sm mb-4">
                  Ваш прогресс будет сохранён.
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-crimson-400/10 text-crimson-400 px-4 py-2 rounded-lg 
                           hover:bg-crimson-400/20 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="bg-ink-700/30 rounded-xl p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-serif text-2xl font-bold text-gold-400">{value}</div>
      <div className="text-ink-400 text-xs">{label}</div>
    </div>
  );
}

function MyBuildCard({ selectedBuildData }: { selectedBuildData: BuildPath | undefined }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-ink-700/30 rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => selectedBuildData && setExpanded(!expanded)}
        className={`w-full text-left p-4 ${selectedBuildData ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gold-400 flex items-center gap-2">
            <Star className="w-4 h-4" /> Мой билд
          </h3>
          {selectedBuildData && (
            <div className="text-ink-400">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          )}
        </div>

        {selectedBuildData ? (
          <div className="flex items-center gap-3 mt-3">
            <span className="text-3xl">{selectedBuildData.icon}</span>
            <div>
              <div className="font-serif font-bold text-white">{selectedBuildData.name}</div>
              <div className="text-gold-400 text-sm">{selectedBuildData.role}</div>
            </div>
          </div>
        ) : (
          <p className="text-ink-400 text-sm mt-2">Выберите билд в разделе «Билды» нажав ⭐</p>
        )}
      </button>

      {/* Expanded details */}
      {selectedBuildData && expanded && (
        <div className="px-4 pb-4 space-y-4 animate-fadeIn border-t border-ink-600/30 pt-4">
          {/* Description */}
          <p className="text-ink-200 text-sm leading-relaxed">{selectedBuildData.description}</p>

          {/* Weapons */}
          <div>
            <h4 className="text-gold-400 font-semibold text-xs uppercase tracking-wider mb-2">Оружие</h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedBuildData.weapons.map(w => (
                <span key={w} className="text-xs bg-gold-400/10 text-gold-400 px-2.5 py-1 rounded-full border border-gold-400/20">
                  {w}
                </span>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-ink-400 text-xs">Сложность:</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedBuildData.difficulty === 'Низкая' ? 'text-jade-400 bg-jade-400/10' :
              selectedBuildData.difficulty === 'Средняя' ? 'text-gold-400 bg-gold-400/10' :
              'text-crimson-400 bg-crimson-400/10'
            }`}>
              {selectedBuildData.difficulty}
            </span>
          </div>

          {/* Strengths */}
          <div>
            <h4 className="text-jade-400 font-semibold text-xs uppercase tracking-wider mb-2">✅ Сильные стороны</h4>
            <div className="space-y-1.5">
              {selectedBuildData.strengths.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-ink-200">
                  <Check className="w-3 h-3 text-jade-400 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="text-crimson-400 font-semibold text-xs uppercase tracking-wider mb-2">❌ Слабые стороны</h4>
            <div className="space-y-1.5">
              {selectedBuildData.weaknesses.map((w, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-ink-200">
                  <XIcon className="w-3 h-3 text-crimson-400 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
