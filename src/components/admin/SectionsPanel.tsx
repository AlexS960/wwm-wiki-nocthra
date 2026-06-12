import { useState, useEffect, useMemo } from 'react';
import { Wrench, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WIKI_HUB_SECTIONS } from '../../data/sections';
import { getCustomSections } from '../../lib/sectionRegistry';

export default function SectionsPanel() {
  const { siteSettings, updateSiteSettings } = useAuth();
  const [sections, setSections] = useState(siteSettings.sections || []);

  const infoSections = useMemo(() => {
    const builtin = WIKI_HUB_SECTIONS.filter(s => s.id !== 'guides').map(s => ({ id: s.id, title: s.label }));
    const builtinIds = new Set(builtin.map(s => s.id));
    const custom = getCustomSections(siteSettings)
      .filter(s => !builtinIds.has(s.id))
      .map(s => ({ id: s.id, title: s.title || s.label }));
    return [...builtin, ...custom];
  }, [siteSettings]);

  useEffect(() => {
    const current = siteSettings.sections || [];
    const normalized = infoSections.map(sec => {
      const existing = current.find(s => s.id === sec.id);
      return existing
        ? { ...existing, title: sec.title }
        : {
            id: sec.id,
            title: sec.title,
            maintenance: false,
            message: 'Раздел находится на технических работах. Попробуйте позже.',
          };
    });
    setSections(normalized);

    const changed =
      normalized.length !== current.length ||
      normalized.some(sec => {
        const cur = current.find(s => s.id === sec.id);
        return !cur || cur.title !== sec.title;
      });

    if (changed) {
      updateSiteSettings({ sections: normalized });
    }
  }, [siteSettings.sections, infoSections, updateSiteSettings]);

  const saveSections = (next: typeof sections) => {
    setSections(next);
    updateSiteSettings({ sections: next });
  };

  const toggleMaintenance = (id: string) => {
    const next = sections.map(s => s.id === id ? { ...s, maintenance: !s.maintenance } : s);
    saveSections(next);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4">
        <h3 className="text-gold-400 font-semibold text-sm flex items-center gap-2 mb-2">
          <Wrench className="w-4 h-4" /> Управление разделами сайта
        </h3>
        <p className="text-ink-400 text-xs">Все разделы вики. Для каждого можно включить или выключить технические работы.</p>
      </div>

      <div className="space-y-3">
        {sections.map(section => (
          <div key={section.id} className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white font-medium">{section.title}</div>
                <div className="text-ink-500 text-xs">ID: {section.id}</div>
              </div>
              <button
                type="button"
                onClick={() => toggleMaintenance(section.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  section.maintenance
                    ? 'bg-orange-400/10 text-orange-400 border border-orange-400/30'
                    : 'bg-jade-400/10 text-jade-400 border border-jade-400/30'
                }`}
              >
                {section.maintenance ? <><EyeOff className="w-3.5 h-3.5" /> Техработы</> : <><Eye className="w-3.5 h-3.5" /> Активен</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
