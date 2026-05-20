import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit3, Plus, Save, X as XIcon, Trash2 } from 'lucide-react';

interface WikiEditorProps { sectionId: string; }

export default function WikiEditor({ sectionId }: WikiEditorProps) {
  const { isEditor, isAdmin, wikiArticles, addWikiArticle, updateWikiArticle, deleteWikiArticle } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const canEdit = isEditor() || isAdmin();

  if (!canEdit) return null;

  const sectionArticles = wikiArticles.filter(a => a.section === sectionId);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    if (editId) {
      updateWikiArticle(editId, { title: title.trim(), content: content.trim() });
      setEditId(null);
    } else {
      addWikiArticle({ section: sectionId, title: title.trim(), content: content.trim(), icon: '📝', fields: {} });
    }
    setTitle(''); setContent(''); setShowForm(false);
  };

  const startEdit = (id: string, t: string, c: string) => {
    setEditId(id); setTitle(t); setContent(c); setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
      <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-4 flex items-center gap-3 mb-4">
        <Edit3 className="w-5 h-5 text-gold-400 shrink-0" />
        <div className="flex-1">
          <p className="text-gold-400 text-sm font-medium">Режим редактора</p>
          <p className="text-ink-400 text-xs mt-0.5">
            Вы можете добавлять, редактировать и удалять контент в этом разделе.
          </p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setTitle(''); setContent(''); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-400/20 text-gold-400 text-xs font-medium hover:bg-gold-400/30 cursor-pointer shrink-0">
          <Plus className="w-3.5 h-3.5" /> Добавить
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-ink-800/50 border border-gold-400/30 rounded-xl p-4 space-y-3 mb-6 animate-fadeIn">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок"
            className="w-full bg-ink-700 border border-ink-600/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Содержание..." rows={4}
            className="w-full bg-ink-700 border border-ink-600/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50 resize-none" />
          <div className="flex gap-2">
            <button onClick={handleSubmit} disabled={!title.trim() || !content.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gold-400/20 text-gold-400 rounded-lg text-xs font-medium hover:bg-gold-400/30 cursor-pointer disabled:opacity-40">
              <Save className="w-3.5 h-3.5" /> {editId ? 'Сохранить' : 'Добавить'}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-3 py-2 bg-ink-700 text-ink-300 rounded-lg text-xs hover:bg-ink-600 cursor-pointer">
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Existing articles */}
      {sectionArticles.length > 0 && (
        <div className="space-y-3">
          {sectionArticles.map(article => (
            <div key={article.id} className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm">{article.title}</h3>
                  <p className="text-ink-400 text-xs mt-1">{article.content}</p>
                  <p className="text-ink-500 text-[10px] mt-2">{article.authorName} · {article.updatedAt}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(article.id, article.title, article.content)}
                    className="p-1.5 rounded-lg text-gold-400 hover:bg-gold-400/10 cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteWikiArticle(article.id)}
                    className="p-1.5 rounded-lg text-ink-500 hover:text-crimson-400 hover:bg-crimson-400/10 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
