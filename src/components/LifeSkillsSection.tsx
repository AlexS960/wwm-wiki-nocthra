import { useMemo, useState } from 'react';
import { lifeSkills, type LifeSkill } from '../data/gameData';
import { Edit3, Trash2 } from 'lucide-react';
import WikiArticleCards from './wiki/WikiArticleCards';
import { useAuth } from '../context/AuthContext';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

export default function LifeSkillsSection() {
  const [editName, setEditName] = useState<string | null>(null);
  const { isEditor, isAdmin, siteSettings, updateSiteSettings } = useAuth();
  const canManage = isEditor() || isAdmin();
  const sectionOverrides = siteSettings.sectionOverrides || {};
  const items = useMemo(() => (
    Array.isArray(sectionOverrides.lifeskills) ? (sectionOverrides.lifeskills as typeof lifeSkills) : lifeSkills
  ), [sectionOverrides]);
  const persistItems = (next: typeof lifeSkills) => {
    updateSiteSettings({ sectionOverrides: { ...sectionOverrides, lifeskills: next } });
  };
  const lifeConfig = sectionEditorConfigs.lifeskills;
  const editingItem = editName ? items.find(s => s.name === editName) : null;

  return (
    <section id="lifeskills" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">🎨</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Жизненные Навыки</h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            16 систем профессий формируют целостное общество древнего Китая — от ремесла до астрономии
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {items.map((skill, i) => (
            <div key={skill.name}
              className="relative bg-ink-800/50 border border-ink-700/30 rounded-xl p-4 text-center card-hover group"
              style={{ animationDelay: `${i * 0.05}s` }}>
              {canManage && (
                <div className="absolute top-2 right-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditName(skill.name)} className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm('Удалить навык?')) return;
                      persistItems(items.filter(x => x.name !== skill.name));
                    }}
                    className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <span className="text-3xl md:text-4xl block mb-2 group-hover:scale-110 transition-transform duration-300">{skill.icon}</span>
              <h3 className="font-serif font-bold text-white text-sm mb-1">{skill.name}</h3>
              <p className="text-ink-400 text-xs leading-tight">{skill.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <WikiArticleCards sectionId="lifeskills" />
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5">
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-3">🍳 Кулинария</h3>
            <p className="text-ink-200 text-sm leading-relaxed">
              Готовьте блюда древнего Китая, используя ингредиенты со всего мира.
              Каждое блюдо даёт уникальные баффы: увеличение HP, регенерация, бонус к атаке или защите.
              Рецепты можно найти у NPC, в сундуках или изучить экспериментально.
            </p>
          </div>
          <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5">
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-3">🎣 Рыбалка</h3>
            <p className="text-ink-200 text-sm leading-relaxed">
              Более 20 рыболовных точек по всему миру. Разные водоёмы содержат разные виды рыб.
              Редкие рыбы используются в высокоуровневых рецептах кулинарии.
              Отличный способ расслабиться и заработать ресурсы.
            </p>
          </div>
          <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5">
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-3">🏗️ Архитектура</h3>
            <p className="text-ink-200 text-sm leading-relaxed">
              Проектируйте и стройте свои здания в стиле древнекитайской архитектуры.
              Используйте различные материалы и стили. Ваши строения могут стать частью мира
              и украсить ландшафт для других игроков.
            </p>
          </div>
        </div>
      </div>
      {editingItem && lifeConfig && (
        <SectionEditorModal
          config={lifeConfig}
          storageFolder="lifeskills"
          isEdit
          initial={{
            title: editingItem.name,
            summary: editingItem.description,
            category: 'Ремесло',
            icon: editingItem.icon,
            content: `## Описание\n${editingItem.description}`,
            images: [],
          }}
          onSave={(values: SectionEditorValues) => {
            const summary = values.summary || values.content.replace(/^##\s*Описание/i, '').trim();
            persistItems(items.map((s: LifeSkill) => (
              s.name === editingItem.name
                ? { ...s, name: values.title, icon: values.icon || s.icon, description: summary || s.description }
                : s
            )));
            setEditName(null);
          }}
          onCancel={() => setEditName(null)}
        />
      )}
    </section>
  );
}
