import { useState } from 'react';
import { Heart, Pencil, Save, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { DonationMethod, DonationSettings } from '../types/site';

export default function DonationBlock() {
  const { siteSettings, updateSiteSettings, hasPermission } = useAuth();
  const donation = siteSettings.donation;
  const canEdit = hasPermission('site.settings') || hasPermission('admin.panel');

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DonationSettings | null>(null);

  if (!donation?.enabled && !canEdit) return null;

  const startEdit = () => {
    setDraft(structuredClone(donation || {
      enabled: true,
      title: 'Поддержать проект',
      description: '',
      methods: [],
    }));
    setEditing(true);
  };

  const save = () => {
    if (!draft) return;
    updateSiteSettings({ donation: draft });
    setEditing(false);
  };

  if (!donation?.enabled && canEdit) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <button type="button" onClick={startEdit} className="text-sm text-gold-400/80 hover:text-gold-300 cursor-pointer">
          + Добавить блок пожертвований
        </button>
      </div>
    );
  }

  if (!donation) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-10 mb-6 cv-auto">
      <div className="relative bg-ink-900/55 border border-jade-500/25 rounded-2xl p-5 sm:p-6">
        {canEdit && !editing && (
          <button type="button" onClick={startEdit} className="absolute top-3 right-3 p-2 text-ink-400 hover:text-jade-300 cursor-pointer" title="Редактировать">
            <Pencil className="w-4 h-4" />
          </button>
        )}

        {!editing ? (
          <>
            <h2 className="font-serif text-lg font-bold text-jade-300 flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5" /> {donation.title}
            </h2>
            <p className="text-ink-300 text-sm mb-4">{donation.description}</p>
            <ul className="space-y-2">
              {donation.methods.map(m => (
                <li key={m.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-jade-400/90 font-medium">{m.label}:</span>
                  {m.url ? (
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-gold-300 underline break-all hover:text-gold-200">
                      {m.value || m.url}
                    </a>
                  ) : (
                    <span className="text-ink-200">{m.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : draft && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-jade-300 font-medium text-sm">Редактирование пожертвований</h3>
              <div className="flex gap-1">
                <button type="button" onClick={save} className="p-2 text-jade-400 cursor-pointer"><Save className="w-4 h-4" /></button>
                <button type="button" onClick={() => setEditing(false)} className="p-2 text-ink-400 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-ink-300 cursor-pointer">
              <input type="checkbox" checked={draft.enabled} onChange={e => setDraft({ ...draft, enabled: e.target.checked })} />
              Показывать блок на главной
            </label>
            <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm text-white" placeholder="Заголовок" />
            <textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={3} className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm text-white resize-y" placeholder="Описание" />
            {draft.methods.map((m, i) => (
              <MethodRow key={m.id} method={m} onChange={next => {
                const methods = [...draft.methods];
                methods[i] = next;
                setDraft({ ...draft, methods });
              }} onRemove={() => setDraft({ ...draft, methods: draft.methods.filter(x => x.id !== m.id) })} />
            ))}
            <button
              type="button"
              onClick={() => setDraft({
                ...draft,
                methods: [...draft.methods, { id: 'd' + Date.now(), label: 'Способ', value: '', url: '' }],
              })}
              className="text-xs text-gold-400 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить способ
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function MethodRow({ method, onChange, onRemove }: {
  method: DonationMethod;
  onChange: (m: DonationMethod) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto] items-center bg-ink-800/50 p-2 rounded-lg border border-ink-700/40">
      <input value={method.label} onChange={e => onChange({ ...method, label: e.target.value })} placeholder="Название" className="bg-ink-900 border border-ink-600 rounded px-2 py-1.5 text-xs text-white" />
      <input value={method.value} onChange={e => onChange({ ...method, value: e.target.value })} placeholder="Текст / реквизиты" className="bg-ink-900 border border-ink-600 rounded px-2 py-1.5 text-xs text-white" />
      <input value={method.url || ''} onChange={e => onChange({ ...method, url: e.target.value })} placeholder="Ссылка (необяз.)" className="bg-ink-900 border border-ink-600 rounded px-2 py-1.5 text-xs text-white" />
      <button type="button" onClick={onRemove} className="p-1.5 text-crimson-400 cursor-pointer justify-self-end"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  );
}
