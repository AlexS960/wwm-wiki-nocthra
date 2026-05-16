import { useState } from 'react';
import { useAuth, type WikiArticle } from '../context/AuthContext';
import { Plus, Edit3, Trash2, X, Save, Search, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface SectionConfig {
  section: string;
  title: string;
  icon: string;
  fieldLabels: { key: string; label: string; type?: 'text' | 'textarea' | 'select'; options?: string[] }[];
  defaultIcon: string;
  icons: string[];
}

const sectionConfigs: Record<string, SectionConfig> = {
  weapons: {
    section: 'weapons', title: 'Оружие', icon: '⚔️', defaultIcon: '⚔️',
    icons: ['⚔️', '🗡️', '🔱', '🔪', '🪭', '☂️', '🔨', '🛡️', '🌂', '🪢', '⚡', '🌸'],
    fieldLabels: [
      { key: 'type', label: 'Тип оружия' },
      { key: 'role', label: 'Роль (ДПС / Танк / Хилер)' },
      { key: 'martialArt', label: 'Боевое искусство' },
      { key: 'pair', label: 'Парное оружие' },
      { key: 'sect', label: 'Связанная секта' },
      { key: 'howToGet', label: 'Как получить', type: 'textarea' },
    ],
  },
  builds: {
    section: 'builds', title: 'Билды', icon: '🛤️', defaultIcon: '🛤️',
    icons: ['⚔️', '🩸', '💨', '🛡️', '💚', '🎯', '🔥', '💎', '⚡', '🌀'],
    fieldLabels: [
      { key: 'role', label: 'Роль' },
      { key: 'weapons', label: 'Оружие (через запятую)' },
      { key: 'difficulty', label: 'Сложность', type: 'select', options: ['Низкая', 'Средняя', 'Высокая'] },
      { key: 'strengths', label: 'Сильные стороны (каждая с новой строки)', type: 'textarea' },
      { key: 'weaknesses', label: 'Слабые стороны (каждая с новой строки)', type: 'textarea' },
    ],
  },
  sects: {
    section: 'sects', title: 'Секты', icon: '🏛️', defaultIcon: '🏛️',
    icons: ['⚖️', '💉', '🗡️', '🎭', '🌊', '☯️', '🌺', '☁️', '🏛️', '⛩️'],
    fieldLabels: [
      { key: 'theme', label: 'Тема секты' },
      { key: 'weapon', label: 'Оружие секты' },
      { key: 'howToJoin', label: 'Как вступить', type: 'textarea' },
      { key: 'rules', label: 'Правила (каждое с новой строки)', type: 'textarea' },
      { key: 'benefits', label: 'Преимущества (каждое с новой строки)', type: 'textarea' },
    ],
  },
  bosses: {
    section: 'bosses', title: 'Боссы', icon: '👹', defaultIcon: '👹',
    icons: ['💀', '🐍', '🧘', '🦁', '👻', '🐺', '👑', '🥷', '🐴', '🎭', '👹', '🔥'],
    fieldLabels: [
      { key: 'type', label: 'Тип (сюжетный / мировой)', type: 'select', options: ['Сюжетный', 'Мировой', 'Рейдовый'] },
      { key: 'region', label: 'Регион' },
      { key: 'location', label: 'Локация' },
      { key: 'level', label: 'Уровень' },
      { key: 'difficulty', label: 'Сложность' },
      { key: 'strategy', label: 'Стратегия (каждый пункт с новой строки)', type: 'textarea' },
      { key: 'rewards', label: 'Награды (через запятую)' },
    ],
  },
  mystic: {
    section: 'mystic', title: 'Мистические Арты', icon: '✨', defaultIcon: '✨',
    icons: ['☯️', '🦁', '☁️', '👆', '🖐️', '💀', '🐸', '✋', '🐉', '👁️', '✨', '🔥'],
    fieldLabels: [
      { key: 'combatEffect', label: 'Эффект в бою', type: 'textarea' },
      { key: 'utilityEffect', label: 'Эффект вне боя', type: 'textarea' },
      { key: 'howToUnlock', label: 'Как получить', type: 'textarea' },
      { key: 'priority', label: 'Приоритет', type: 'select', options: ['Must-Have', 'Recommended', 'Optional'] },
    ],
  },
  cooking: {
    section: 'cooking', title: 'Готовка', icon: '🍳', defaultIcon: '🍳',
    icons: ['🐟', '🍲', '🥩', '🍄', '🍮', '🍜', '🦌', '🐔', '🐡', '🍳', '🥘', '🫕'],
    fieldLabels: [
      { key: 'effect', label: 'Эффект' },
      { key: 'category', label: 'Тип', type: 'select', options: ['Исцеление', 'Бафф'] },
      { key: 'level', label: 'Требуемый уровень' },
      { key: 'ingredients', label: 'Ингредиенты (каждый с новой строки)', type: 'textarea' },
      { key: 'howToUnlock', label: 'Как разблокировать' },
    ],
  },
  tips: {
    section: 'tips', title: 'Советы', icon: '💡', defaultIcon: '💡',
    icons: ['💡', '🎯', '⚠️', '✅', '🔥', '💎', '🧠', '🎮', '🏆', '📌', '🔑', '📢'],
    fieldLabels: [
      { key: 'category', label: 'Категория', type: 'select', options: ['Новичкам', 'Промокоды', 'PvP', 'Бой', 'Экипировка', 'Фарм', 'Прочее'] },
      { key: 'importance', label: 'Важность', type: 'select', options: ['Критично', 'Важно', 'Полезно'] },
      { key: 'code', label: 'Промокод / ключ (если есть)' },
      { key: 'effect', label: 'Награда / результат', type: 'textarea' },
    ],
  },
};

interface WikiEditorProps {
  sectionId: string;
}

export default function WikiEditor({ sectionId }: WikiEditorProps) {
  const { wikiArticles, addWikiArticle, updateWikiArticle, deleteWikiArticle, isEditor } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [formFields, setFormFields] = useState<Record<string, string>>({});

  const config = sectionConfigs[sectionId];
  if (!config) return null;

  const articles = wikiArticles.filter(a => a.section === sectionId);
  const filtered = search.trim()
    ? articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
    : articles;

  const canEdit = isEditor();

  const resetForm = () => {
    setFormTitle(''); setFormContent(''); setFormIcon(config.defaultIcon); setFormFields({});
    setEditingId(null); setShowForm(false);
  };

  const startNew = () => {
    setFormTitle(''); setFormContent(''); setFormIcon(config.defaultIcon); setFormFields({});
    setEditingId(null); setShowForm(true);
  };

  const startEdit = (a: WikiArticle) => {
    setFormTitle(a.title); setFormContent(a.content); setFormIcon(a.icon); setFormFields({ ...a.fields });
    setEditingId(a.id); setShowForm(true); setExpandedId(null);
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;
    if (editingId) {
      updateWikiArticle(editingId, { title: formTitle, content: formContent, icon: formIcon, fields: formFields });
    } else {
      addWikiArticle({ section: sectionId, title: formTitle, content: formContent, icon: formIcon, fields: formFields });
    }
    resetForm();
  };

  const handleDelete = (id: string) => { deleteWikiArticle(id); setDeleteConfirm(null); setExpandedId(null); };

  const updateField = (key: string, value: string) => setFormFields(prev => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span> {config.title}
            <span className="text-ink-500 text-sm font-normal ml-2">({articles.length})</span>
          </h2>
        </div>
        {canEdit && !showForm && (
          <button onClick={startNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-400/20 text-gold-400 border border-gold-400/40 hover:bg-gold-400/30 cursor-pointer text-sm font-medium">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        )}
      </div>

      {/* Search */}
      {articles.length > 0 && !showForm && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
            className="w-full bg-ink-800 border border-ink-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
        </div>
      )}

      {/* Editor Form */}
      {showForm && (
        <div className="bg-ink-800/70 border border-gold-400/30 rounded-xl p-5 mb-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-gold-400">
              {editingId ? 'Редактировать' : 'Новая запись'}
            </h3>
            <button onClick={resetForm} className="p-1.5 text-ink-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
          </div>

          {/* Icon */}
          <div>
            <label className="text-ink-400 text-xs mb-1.5 block">Иконка</label>
            <div className="flex gap-1.5 flex-wrap">
              {config.icons.map(ic => (
                <button key={ic} onClick={() => setFormIcon(ic)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center cursor-pointer transition-all ${
                    formIcon === ic ? 'bg-gold-400/20 border border-gold-400/40' : 'bg-ink-700 border border-ink-600/30 hover:border-ink-500'
                  }`}>{ic}</button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-ink-400 text-xs mb-1.5 block">Название *</label>
            <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Название"
              className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
          </div>

          {/* Custom Fields */}
          {config.fieldLabels.map(f => (
            <div key={f.key}>
              <label className="text-ink-400 text-xs mb-1.5 block">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea value={formFields[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} rows={3}
                  className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 resize-y" />
              ) : f.type === 'select' ? (
                <select value={formFields[f.key] || ''} onChange={e => updateField(f.key, e.target.value)}
                  className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2.5 text-white text-sm cursor-pointer focus:outline-none focus:border-gold-400/50">
                  <option value="">—</option>
                  {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input value={formFields[f.key] || ''} onChange={e => updateField(f.key, e.target.value)}
                  className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
              )}
            </div>
          ))}

          {/* Description */}
          <div>
            <label className="text-ink-400 text-xs mb-1.5 block">Описание <span className="text-ink-500">(## заголовки, - списки)</span></label>
            <textarea value={formContent} onChange={e => setFormContent(e.target.value)} rows={6}
              className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-3 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 resize-y font-mono" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={!formTitle.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-gold-400/20 text-gold-400 border border-gold-400/40 py-3 rounded-xl font-medium text-sm cursor-pointer hover:bg-gold-400/30 disabled:opacity-40 disabled:cursor-not-allowed">
              <Save className="w-4 h-4" /> {editingId ? 'Сохранить' : 'Опубликовать'}
            </button>
            <button onClick={resetForm} className="px-6 bg-ink-700 text-ink-300 py-3 rounded-xl text-sm cursor-pointer hover:bg-ink-600">Отмена</button>
          </div>
        </div>
      )}

      {/* Articles List */}
      {!showForm && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-ink-500">
              <span className="text-4xl block mb-3">{config.icon}</span>
              <p>{search ? 'Ничего не найдено' : 'Пока нет записей. Нажмите «Добавить», чтобы создать.'}</p>
            </div>
          )}
          {filtered.map(a => {
            const isExpanded = expandedId === a.id;
            return (
              <div key={a.id} className={`bg-ink-800/60 border rounded-xl overflow-hidden transition-all ${isExpanded ? 'border-gold-400/40' : 'border-ink-700/30'}`}>
                {/* Header */}
                <button onClick={() => setExpandedId(isExpanded ? null : a.id)}
                  className="w-full flex items-center justify-between p-4 cursor-pointer text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{a.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-white text-sm truncate">{a.title}</h3>
                      {a.fields.role && <span className="text-gold-400 text-xs">{a.fields.role}</span>}
                      {a.fields.type && <span className="text-ink-400 text-xs ml-2">{a.fields.type}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-ink-500 text-[10px] hidden sm:block">{a.authorName} · {a.updatedAt}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-400" /> : <ChevronDown className="w-4 h-4 text-ink-400" />}
                  </div>
                </button>

                {/* Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 animate-fadeIn">
                    <div className="border-t border-ink-700/30 pt-4 space-y-3">
                      {/* Fields */}
                      <div className="grid sm:grid-cols-2 gap-2">
                        {config.fieldLabels.map(f => {
                          const val = a.fields[f.key];
                          if (!val) return null;
                          const isMultiline = f.type === 'textarea';
                          return (
                            <div key={f.key} className={`bg-ink-700/30 rounded-lg p-3 ${isMultiline ? 'sm:col-span-2' : ''}`}>
                              <div className="text-ink-400 text-[10px] uppercase tracking-wider mb-1">{f.label}</div>
                              {isMultiline ? (
                                <div className="space-y-1">
                                  {val.split('\n').filter(Boolean).map((line, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-ink-200">
                                      <Star className="w-3 h-3 text-gold-400 mt-1 shrink-0" /> <span>{line}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-white text-sm">{val}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Description */}
                      {a.content && (
                        <div className="bg-ink-700/30 rounded-lg p-3">
                          <div className="text-ink-400 text-[10px] uppercase tracking-wider mb-2">Описание</div>
                          <div className="space-y-2">
                            {a.content.split('\n').map((line, i) => {
                              if (line.startsWith('## ')) return <h4 key={i} className="font-serif text-base font-bold text-gold-400 mt-2">{line.replace('## ', '')}</h4>;
                              if (line.startsWith('- ')) return <div key={i} className="flex items-start gap-2 text-sm text-ink-200"><Star className="w-3 h-3 text-gold-400 mt-1 shrink-0" /><span>{line.replace('- ', '')}</span></div>;
                              if (!line.trim()) return <div key={i} className="h-1" />;
                              return <p key={i} className="text-ink-200 text-sm">{line}</p>;
                            })}
                          </div>
                        </div>
                      )}

                      {/* Edit/Delete */}
                      {canEdit && (
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => startEdit(a)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gold-400/10 text-gold-400 border border-gold-400/30 hover:bg-gold-400/20 cursor-pointer">
                            <Edit3 className="w-3.5 h-3.5" /> Редактировать
                          </button>
                          <button onClick={() => setDeleteConfirm(a.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-crimson-400/10 text-crimson-400 border border-crimson-400/30 hover:bg-crimson-400/20 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" /> Удалить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-ink-800 border border-crimson-400/30 rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-serif text-lg text-white font-bold mb-2">Удалить запись?</h3>
            <p className="text-ink-300 text-sm mb-4">Это действие нельзя отменить.</p>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-crimson-400/20 text-crimson-400 py-2 rounded-lg font-medium hover:bg-crimson-400/30 cursor-pointer">Удалить</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-ink-700 text-ink-300 py-2 rounded-lg hover:bg-ink-600 cursor-pointer">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
