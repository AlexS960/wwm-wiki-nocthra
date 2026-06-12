import { useState } from 'react';
import { Settings, Save, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPanel() {
  const { siteSettings, updatePmSettings, updateSiteSettings, purgeEmbeddedImagesFromDb } = useAuth();
  const pm = siteSettings.pmSettings || { notificationSound: true, soundUrl: '' };
  const [pmSoundUrl, setPmSoundUrl] = useState(pm.soundUrl);
  const [saved, setSaved] = useState(false);
  const [purging, setPurging] = useState(false);
  const [purgeMsg, setPurgeMsg] = useState<string | null>(null);

  const handleSave = () => {
    updatePmSettings({ soundUrl: pmSoundUrl.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5 space-y-4">
        <h3 className="text-gold-400 font-semibold text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" /> Настройки сайта
        </h3>
        <p className="text-ink-500 text-xs">Внешний вид, тексты, блоки главной и ссылки — во вкладке «Конструктор».</p>
        <p className="text-ink-500 text-xs mt-2">
          Скриншоты — Storage (<code className="text-gold-400/80">storage-setup.sql</code>). ЛС — таблица <code className="text-gold-400/80">pm-messages-setup.sql</code>.
        </p>
        <button
          type="button"
          disabled={purging}
          onClick={async () => {
            if (!confirm('Удалить встроенные base64-картинки из базы? Ссылки на Storage останутся.')) return;
            setPurging(true);
            setPurgeMsg(null);
            const err = await purgeEmbeddedImagesFromDb();
            setPurging(false);
            setPurgeMsg(err ? err : 'Готово: base64 убраны из гайдов, вики, новостей и гильдии.');
          }}
          className="mt-2 w-full py-2 rounded-lg text-xs bg-ink-700/50 text-ink-300 hover:bg-ink-600 cursor-pointer disabled:opacity-50"
        >
          {purging ? 'Очистка…' : 'Очистить base64 из базы данных'}
        </button>
        {purgeMsg && <p className="text-[10px] text-ink-400 mt-1">{purgeMsg}</p>}
        <div className="pt-2 border-t border-ink-700/30">
          <h4 className="text-gold-400 text-xs font-semibold mb-2">Личные сообщения</h4>
          <label className="flex items-center gap-2 text-sm text-ink-300 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pm.notificationSound}
              onChange={e => updatePmSettings({ notificationSound: e.target.checked })}
              className="rounded"
            />
            Звук уведомлений ЛС
          </label>
          <label className="text-ink-400 text-xs mb-1 block">URL звука (пусто = встроенный сигнал)</label>
          <input
            value={pmSoundUrl}
            onChange={e => setPmSoundUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50"
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-all ${saved ? 'bg-jade-400/20 text-jade-400' : 'bg-gold-400/20 text-gold-400 hover:bg-gold-400/30'}`}
        >
          {saved ? <><Check className="w-4 h-4" /> Сохранено</> : <><Save className="w-4 h-4" /> Сохранить</>}
        </button>
      </div>

      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gold-400 font-semibold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Режим обслуживания
            </h3>
            <p className="text-ink-400 text-xs mt-1">Пользователи увидят заглушку</p>
          </div>
          <button
            type="button"
            onClick={() => updateSiteSettings({ maintenanceMode: !siteSettings.maintenanceMode })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
              siteSettings.maintenanceMode
                ? 'bg-crimson-400/20 text-crimson-400 border border-crimson-400/40'
                : 'bg-ink-700/50 text-ink-300 border border-ink-600/30'
            }`}
          >
            {siteSettings.maintenanceMode ? <><EyeOff className="w-4 h-4" /> Включён</> : <><Eye className="w-4 h-4" /> Выключен</>}
          </button>
        </div>
      </div>
    </div>
  );
}
